---
title: Best practices for Kusto Query Language (KQL) graph semantics
description: Learn about the best practices for Kusto Query Language (KQL) graph semantics.
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 05/29/2025
# Customer intent: As a data analyst, I want to learn about best practices for KQL graph semantics.
---

# Best practices for graph semantics

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Graph semanitcs supports two primary approaches for working with graphs: transient graphs created in-memory for each query, and persistent graphs defined as graph models and snapshots within the database. This article provides best practices for both methods, enabling you to select the optimal approach and use KQL graph semantics efficiently.

This guidance covers:

- Graph creation and optimization strategies
- Querying techniques and performance considerations
- Schema design for persistent graphs
- Integration with other KQL features
- Common pitfalls to avoid

:::moniker range="azure-data-explorer || microsoft-fabric"

## Graph modeling approaches

There are two approaches for working with graphs: transient and persistent.

### Transient graphs

Created dynamically using the [`make-graph`](make-graph-operator.md) operator. These graphs exist only during query execution and are optimal for ad hoc or exploratory analysis on small to medium datasets.

### Persistent graphs

Defined using [graph models](../management/graph/graph-model-overview.md) and [graph snapshots](../management/graph/graph-snapshot-overview.md). These graphs are stored in the database, support schema and versioning, and are optimized for repeated, large-scale, or collaborative analysis.

:::moniker-end

## Best practices for transient graphs

Transient graphs, created in-memory using the `make-graph` operator, are ideal for ad hoc analysis, prototyping, and scenarios where graph structure changes frequently or requires only a subset of available data.

### Optimize graph size for performance

The [`make-graph`](make-graph-operator.md) creates an in-memory representation including both structure and properties. Optimize performance by:

- **Apply filters early** - Select only relevant nodes, edges, and properties before graph creation
- **Use projections** - Remove unnecessary columns to minimize memory consumption
- **Apply aggregations** - Summarize data where appropriate to reduce graph complexity

**Example: Reducing graph size through filtering and projection**

In this scenario, Bob changed managers from Alice to Eve. To view only the latest organizational state while minimizing graph size:

```kusto
let allEmployees = datatable(organization: string, name:string, age:long)
[
  "R&D", "Alice", 32,
  "R&D","Bob", 31,
  "R&D","Eve", 27,
  "R&D","Mallory", 29,
  "Marketing", "Alex", 35
];
let allReports = datatable(employee:string, manager:string, modificationDate: datetime)
[
  "Bob", "Alice", datetime(2022-05-23),
  "Bob", "Eve", datetime(2023-01-01),
  "Eve", "Mallory", datetime(2022-05-23),
  "Alice", "Dave", datetime(2022-05-23)
];
let filteredEmployees =
    allEmployees
    | where organization == "R&D"
    | project-away age, organization;
let filteredReports =
    allReports
    | summarize arg_max(modificationDate, *) by employee
    | project-away modificationDate;
filteredReports
| make-graph employee --> manager with filteredEmployees on name
| graph-match (employee)-[hasManager*2..5]-(manager)
  where employee.name == "Bob"
  project employee = employee.name, topManager = manager.name
```

**Output:**

| employee | topManager |
| -------- | ---------- |
| Bob      | Mallory    |

### Maintain current state with materialized views

The previous example showed how to obtain the last known state using `summarize` and `arg_max`. This operation can be compute-intensive, so consider using materialized views for improved performance.

**Step 1: Create tables with versioning**

Create tables with a versioning mechanism for graph time series:

```kusto
.create table employees (organization: string, name:string, stateOfEmployment:string, properties:dynamic, modificationDate:datetime)

.create table reportsTo (employee:string, manager:string, modificationDate: datetime)
```

**Step 2: Create materialized views**

Use the [arg_max aggregation](arg-max-aggregation-function.md) function to determine the latest state:

```kusto
.create materialized-view employees_MV on table employees
{
    employees
    | summarize arg_max(modificationDate, *) by name
}

.create materialized-view reportsTo_MV on table reportsTo
{
    reportsTo
    | summarize arg_max(modificationDate, *) by employee
}
```

**Step 3: Create helper functions**

Ensure only the materialized component is used and apply additional filters:

```kusto
.create function currentEmployees () {
    materialized_view('employees_MV')
    | where stateOfEmployment == "employed"
}

.create function reportsTo_lastKnownState () {
    materialized_view('reportsTo_MV')
    | project-away modificationDate
}
```

This approach provides faster queries, higher concurrency, and lower latency for current state analysis while preserving access to historical data.

```kusto
let filteredEmployees =
    currentEmployees
    | where organization == "R&D"
    | project-away organization;
reportsTo_lastKnownState
| make-graph employee --> manager with filteredEmployees on name
| graph-match (employee)-[hasManager*2..5]-(manager)
  where employee.name == "Bob"
  project employee = employee.name, reportingPath = hasManager.manager
```

### Implement graph time travel

Analyzing data based on historical graph states provides valuable temporal context. Implement this "time travel" capability by combining time filters with `summarize` and `arg_max`:

```kusto
.create function graph_time_travel (interestingPointInTime:datetime ) {
    let filteredEmployees =
        employees
        | where modificationDate < interestingPointInTime
        | summarize arg_max(modificationDate, *) by name;
    let filteredReports =
        reportsTo
        | where modificationDate < interestingPointInTime
        | summarize arg_max(modificationDate, *) by employee
        | project-away modificationDate;
    filteredReports
    | make-graph employee --> manager with filteredEmployees on name
}
```

**Usage example:**

Query Bob's top manager based on June 2022 graph state:

```kusto
graph_time_travel(datetime(2022-06-01))
| graph-match (employee)-[hasManager*2..5]-(manager)
  where employee.name == "Bob"
  project employee = employee.name, reportingPath = hasManager.manager
```

**Output:**

| employee | topManager |
| -------- | ---------- |
| Bob      | Dave       |

### Handle multiple node and edge types

When working with complex graphs containing multiple node types, use a canonical property graph model. Define nodes with attributes like `nodeId` (string), `label` (string), and `properties` (dynamic), while edges include `source` (string), `destination` (string), `label` (string), and `properties` (dynamic) fields.

**Example: Factory maintenance analysis**

Consider a factory manager investigating equipment issues and responsible personnel. The scenario combines asset graphs of production equipment with maintenance staff hierarchy:

:::image type="content" source="media/graphs/factory-maintenance-analysis.png" alt-text="A graph of factory people, equiptment, and measurements":::

The data for those entities can be stored directly in your cluster or acquired using query federation to a different service. To illustrate the example, the following tabular data is created as part of the query:

```kusto
let sensors = datatable(sensorId:string, tagName:string, unitOfMeasure:string)
[
  "1", "temperature", "°C",
  "2", "pressure", "Pa",
  "3", "speed", "m/s"
];
let timeseriesData = datatable(sensorId:string, timestamp:string, value:double, anomaly: bool )
[
    "1", datetime(2023-01-23 10:00:00), 32, false,
    "1", datetime(2023-01-24 10:00:00), 400, true,
    "3", datetime(2023-01-24 09:00:00), 9, false
];
let employees = datatable(name:string, age:long)
[
  "Alice", 32,
  "Bob", 31,
  "Eve", 27,
  "Mallory", 29,
  "Alex", 35,
  "Dave", 45
];
let allReports = datatable(employee:string, manager:string)
[
  "Bob", "Alice",
  "Alice", "Dave",
  "Eve", "Mallory",
  "Alex", "Dave"
];
let operates = datatable(employee:string, machine:string, timestamp:datetime)
[
  "Bob", "Pump", datetime(2023-01-23),
  "Eve", "Pump", datetime(2023-01-24),
  "Mallory", "Press", datetime(2023-01-24),
  "Alex", "Conveyor belt", datetime(2023-01-24),
];
let assetHierarchy = datatable(source:string, destination:string)
[
  "1", "Pump",
  "2", "Pump",
  "Pump", "Press",
  "3", "Conveyor belt"
];
```

The employees, sensors, and other entities and relationships do not share a canonical data model. The [union operator](union-operator.md) can be used to combine and standardize the data.

The following query joins the sensor data with the time series data to identify sensors with abnormal readings, then uses a projection to create a common model for the graph nodes.

```kusto
let nodes =
    union
        (
            sensors
            | join kind=leftouter
            (
                timeseriesData
                | summarize hasAnomaly=max(anomaly) by sensorId
            ) on sensorId
            | project nodeId = sensorId, label = "tag", properties = pack_all(true)
        ),
        ( employees | project nodeId = name, label = "employee", properties = pack_all(true));
```

The edges are transformed in a similar manner.

```kusto
let edges =
    union
        ( assetHierarchy | extend label = "hasParent" ),
        ( allReports | project source = employee, destination = manager, label = "reportsTo" ),
        ( operates | project source = employee, destination = machine, properties = pack_all(true), label = "operates" );
```

With the standardized nodes and edges data, you can create a graph using the [make-graph operator](make-graph-operator.md)


```kusto
let graph = edges
| make-graph source --> destination with nodes on nodeId;
```

Once the graph is created, define the path pattern and project the required information. The pattern begins at a tag node, followed by a variable-length edge to an asset. That asset is operated by an operator who reports to a top manager via a variable-length edge called *reportsTo*. The constraints section of the [graph-match operator](graph-match-operator.md), in this case the **where** clause, filters the tags to those with an anomaly that were operated on a specific day.

```kusto
graph
| graph-match (tag)-[hasParent*1..5]->(asset)<-[operates]-(operator)-[reportsTo*1..5]->(topManager)
    where tag.label=="tag" and tobool(tag.properties.hasAnomaly) and
        startofday(todatetime(operates.properties.timestamp)) == datetime(2023-01-24)
        and topManager.label=="employee"
    project
        tagWithAnomaly = tostring(tag.properties.tagName),
        impactedAsset = asset.nodeId,
        operatorName = operator.nodeId,
        responsibleManager = tostring(topManager.nodeId)
```

**Output**

| tagWithAnomaly | impactedAsset | operatorName | responsibleManager |
| -------------- | ------------- | ------------ | ------------------ |
| temperature    | Pump          | Eve          | Mallory            |

The projection in `graph-match` shows that the temperature sensor exhibited an anomaly on the specified day. The sensor was operated by Eve, who ultimately reports to Mallory. With this information, the factory manager can contact Eve and, if necessary, Mallory to better understand the anomaly.

:::moniker range="azure-data-explorer || microsoft-fabric"

## Best practices for persistent graphs

Persistent graphs, defined using [graph models](../management/graph/graph-model-overview.md) and [graph snapshots](../management/graph/graph-snapshot-overview.md), provide robust solutions for advanced graph analytics needs. These graphs excel in scenarios requiring repeated analysis of large, complex, or evolving data relationships, and facilitate collaboration by enabling teams to share standardized graph definitions and consistent analytical results. By persisting graph structures in the database, this approach significantly enhances performance for recurring queries and supports sophisticated versioning capabilities.

### Use schema and definition for consistency and performance

A clear schema for your graph model is essential, as it specifies node and edge types along with their properties. This approach ensures data consistency and enables efficient querying. Utilize the `Definition` section to specify how nodes and edges are constructed from your tabular data through `AddNodes` and `AddEdges` steps.

### Leverage static and dynamic labels for flexible modeling

When modeling your graph, you can utilize both static and dynamic labeling approaches for optimal flexibility. Static labels are ideal for well-defined node and edge types that rarely change—define these in the `Schema` section and reference them in the `Labels` array of your steps. For cases where node or edge types are determined by data values (for example, when the type is stored in a column), use dynamic labels by specifying a `LabelsColumn` in your step to assign labels at runtime. This approach is especially useful for graphs with heterogeneous or evolving schemas. Both mechanisms can be effectively combined—you can define a `Labels` array for static labels and also specify a `LabelsColumn` to incorporate additional labels from your data, providing maximum flexibility when modeling complex graphs with both fixed and data-driven categorization.

#### Example: Using dynamic labels for multiple node and edge types

The following example demonstrates an effective implementation of dynamic labels in a graph representing professional relationships. In this scenario, the graph contains people and companies as nodes, with employment relationships forming the edges between them. The flexibility of this model comes from determining node and edge types directly from columns in the source data, allowing the graph structure to adapt organically to the underlying information.

````
.create-or-alter graph_model ProfessionalNetwork ```
{
  "Schema": {
    "Nodes": {
      "Person": {"Name": "string", "Age": "long"},
      "Company": {"Name": "string", "Industry": "string"}
    },
    "Edges": {
      "WORKS_AT": {"StartDate": "datetime", "Position": "string"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "Employees | project Id, Name, Age, NodeType",
        "NodeIdColumn": "Id",
        "Labels": ["Person"],
        "LabelsColumn": "NodeType"
      },
      {
        "Kind": "AddEdges",
        "Query": "EmploymentRecords | project EmployeeId, CompanyId, StartDate, Position, RelationType",
        "SourceColumn": "EmployeeId",
        "TargetColumn": "CompanyId",
        "Labels": ["WORKS_AT"],
        "LabelsColumn": "RelationType"
      }
    ]
  }
}
```
````

This dynamic labeling approach provides exceptional flexibility when modeling graphs with numerous node and edge types, eliminating the need to modify your schema each time a new entity type appears in your data. By decoupling the logical model from the physical implementation, your graph can continuously evolve to represent new relationships without requiring structural changes to the underlying schema.

## Multitenant partitioning strategies for large-scale ISV scenarios

In large organizations, particularly ISV scenarios, graphs can consist of multiple billions of nodes and edges. This scale presents unique challenges that require strategic partitioning approaches to maintain performance while managing costs and complexity.

### Understanding the challenge

Large-scale multitenant environments often exhibit the following characteristics:

- **Billions of nodes and edges** - Enterprise-scale graphs that exceed traditional graph database capabilities
- **Tenant size distribution** - Typically follows a power law where 99.9% of tenants have small to medium graphs, while 0.1% have massive graphs
- **Performance requirements** - Need for both real-time analysis (current data) and historical analysis capabilities
- **Cost considerations** - Balance between infrastructure costs and analytical capabilities

### Partitioning by natural boundaries

The most effective approach for managing large-scale graphs is partitioning by natural boundaries, typically tenant identifiers or organizational units:

**Key partitioning strategies:**

- **Tenant-based partitioning** - Separate graphs by customer, organization, or business unit
- **Geographic partitioning** - Divide by region, country, or datacenter location
- **Temporal partitioning** - Separate by time periods for historical analysis
- **Functional partitioning** - Split by business domain or application area

**Example: Multitenant organizational structure**

```kusto
// Partition employees and reports by tenant
let tenantEmployees = 
    allEmployees
    | where tenantId == "tenant_123"
    | project-away tenantId;
    
let tenantReports = 
    allReports
    | where tenantId == "tenant_123"
    | summarize arg_max(modificationDate, *) by employee
    | project-away modificationDate, tenantId;

tenantReports
| make-graph employee --> manager with tenantEmployees on name
| graph-match (employee)-[hasManager*1..5]-(manager)
  where employee.name == "Bob"
  project employee = employee.name, reportingChain = hasManager.manager
```

### Hybrid approach: Transient vs. persistent graphs by tenant size

The most cost-effective strategy combines both transient and persistent graphs based on tenant characteristics:

#### Small to medium tenants (99.9% of tenants)

Use **transient graphs** for the majority of tenants:

**Advantages:**

- **Always up-to-date data** - No snapshot maintenance required
- **Lower operational overhead** - No graph model or snapshot management
- **Cost-effective** - No additional storage costs for graph structures
- **Immediate availability** - No pre-processing delays

**Implementation pattern:**

```kusto
.create function getTenantGraph(tenantId: string) {
    let tenantEmployees = 
        employees
        | where tenant == tenantId and stateOfEmployment == "employed"
        | project-away tenant, stateOfEmployment;
    let tenantReports = 
        reportsTo
        | where tenant == tenantId
        | summarize arg_max(modificationDate, *) by employee
        | project-away modificationDate, tenant;
    tenantReports
    | make-graph employee --> manager with tenantEmployees on name
}

// Usage for small tenant
getTenantGraph("small_tenant_456")
| graph-match (employee)-[reports*1..3]-(manager)
  where employee.name == "Alice"
  project employee = employee.name, managerChain = reports.manager
```

#### Large tenants (0.1% of tenants)

Use **persistent graphs** for the largest tenants:

**Advantages:**

- **Scalability** - Handle graphs exceeding memory limitations
- **Performance optimization** - Eliminate construction latency for complex queries
- **Advanced analytics** - Support sophisticated graph algorithms and analysis
- **Historical analysis** - Multiple snapshots for temporal comparison

**Implementation pattern:**

````kusto
// Create graph model for large tenant (example: Contoso)
.create-or-alter graph_model ContosoOrgChart ```
{
    "Schema": {
        "Nodes": {
            "Employee": {
                "Name": "string",
                "Department": "string",
                "Level": "int",
                "JoinDate": "datetime"
            }
        },
        "Edges": {
            "ReportsTo": {
                "Since": "datetime",
                "Relationship": "string"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "employees | where tenant == 'Contoso' and stateOfEmployment == 'employed' | project Name, Department, Level, JoinDate",
                "NodeIdColumn": "Name",
                "Labels": ["Employee"]
            },
            {
                "Kind": "AddEdges", 
                "Query": "reportsTo | where tenant == 'Contoso' | summarize arg_max(modificationDate, *) by employee | project employee, manager, modificationDate as Since | extend Relationship = 'DirectReport'",
                "SourceColumn": "employee",
                "TargetColumn": "manager",
                "Labels": ["ReportsTo"]
            }
        ]
    }
}
```

// Create snapshot for Contoso
.create graph snapshot ContosoSnapshot from ContosoOrgChart

// Query Contoso's organizational graph
graph("ContosoOrgChart")
| graph-match (employee)-[reports*1..10]-(executive)
  where employee.Department == "Engineering"
  project employee = employee.Name, executive = executive.Name, pathLength = array_length(reports)
````

### Best practices for ISV scenarios

1. **Start with transient graphs** - Begin all new tenants with transient graphs for simplicity
2. **Monitor growth patterns** - Implement automatic detection of tenants requiring persistent graphs
3. **Batch snapshot creation** - Schedule snapshot updates during low-usage periods
4. **Tenant isolation** - Ensure graph models and snapshots are properly isolated between tenants
5. **Resource management** - Use workload groups to prevent large tenant queries from affecting smaller tenants
6. **Cost optimization** - Regularly review and optimize the persistent/transient threshold based on actual usage patterns

This hybrid approach enables organizations to provide always-current data analysis for the majority of tenants while delivering enterprise-scale analytics capabilities for the largest tenants, optimizing both cost and performance across the entire customer base.

:::moniker-end

## Common analysis queries

These reusable query patterns work across all graph models and help you understand the structure and characteristics of any graph dataset. Use these queries to explore new graphs, perform basic analysis, or as starting points for more complex graph investigations.

### Graph overview and statistics

Understanding the basic characteristics of your graph is essential for analysis planning and performance optimization. These queries provide fundamental metrics about graph size and structure.

**Count total nodes and edges**:

Use these queries to understand the scale of your graph dataset. Node and edge counts help determine appropriate query strategies and identify potential performance considerations.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXV3BPLVHIy09JVUjOL80r4UovSizI0FAPzswtyElV1%2BSqUQCL6OYmliRnKGiAVGpyKQBBQVF%2BVmoyRC9QFVg3AIVDvo5PAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Get node count
graph('Simple')
| graph-match (node)
    project node
| count
```

|Count|
|---|
|11|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXV3BPLVFITUlPVUjOL80r4UovSizI0FAPzswtyElV1%2BSqUQCL6OYmliRnKGgU55cWJadq6kaDtMTq2mmUJBalp5ZocikAQUFRflZqMsQ4oEawgQB1u6FrYgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Get edge count
graph('Simple')
| graph-match (source)-[edge]->(target)
    project edge
| count
```

|Count|
|---|
|20|

**Get graph summary statistics**:

This combined query efficiently provides both metrics in a single result, useful for initial graph assessment and reporting.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPOw7CMBBE%2B5xiOtsSPgEKLQegjFJEziox8k%2FOmhTA3YnlAlra0bw3u44YIc60ocfD0i4VnljylFYpbtYnR0Lh1RLtJzYrZO0rpBzvZBp9NEwsgfE%2Bo3OHkublL%2BUWSzak9FDBUV8kT3kh%2Fq7U%2FGelK8HGgN3y2tB%2BENcqBDnyFFiM7a1TO%2BUDuRGGVOcAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let nodes = view() { graph('Simple') | graph-match (node) project node | count }; 
let edges = view() { graph('Simple') | graph-match (source)-[edge]->(target) project edge | count };
union withsource=['Graph element'] nodes, edges
```

|Graph element|Count|
|---|---|
|nodes|11|
|edges|20|

**Alternative using graph-to-table**:

For basic counting, the `graph-to-table` operator can be more efficient as it directly exports graph elements without pattern matching overhead.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHIy09JLVawVSjLTC3X0FSoVkgvSizI0FAPzswtyElV11SogYjoluTrliQm5aRCddQoJOeX5pUo1Fpz5QCNSU1JJ9EYiA4kY0rzMvPzIKbrQGQBL%2BM0MaAAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let nodes = view() { graph('Simple') | graph-to-table nodes | count };
let edges = view() { graph('Simple') | graph-to-table edges | count };
union nodes, edges
```

|Count|
|---|
|11|
|20|

### Node analysis

Node analysis helps you understand the entities in your graph, their types, and distribution. These patterns are essential for data quality assessment and schema understanding.

**Discover all node types (labels)**:

This query reveals the different entity types in your graph and their frequencies. Use it to understand your data model, identify the most common entity types, and spot potential data quality issues.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2LQQ7CIBBF9z3F7AqLHsFTeABDYaQYYMgwNbbx8IIY%2F%2Brnv%2Fc9m7Kp%2BRpSiTjr6Q2%2BL0syYjdQmRxqmKClMD3QCkSzYqxw%2BZWhtF96LvgqJrsB%2FgIIgRwF6a6qcMi%2By3VPyXA4ESztWZSG9Rh%2Bg8QOuQ9fdgOH1X4Ahd7qqagAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('Simple')
| graph-match (node) 
    project labels = labels(node)
| mv-expand label = labels to typeof(string)
| summarize count() by label
| order by count_ desc
```

|label|count_|
|---|---|
|Person|5|
|Company|3|
|City|3|

**Find nodes with multiple labels**:

Identifies nodes that belong to multiple categories simultaneously. This is useful for understanding overlapping classifications and complex entity relationships in your data model.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNwQoCMQxE7%2FsVuW0XVBDPehAE%2F6LENrSrtVliRAQ%2F3tT1oHMa3mQmSXDKrt8X5njke43%2BUFWwH7oXpJYtr6ghg6scaYAOTJPwmYJCQ36MsP241RgXUPBE5WZkNnPri32wfbUMRfDpC9Wk2f0etqePTEJ%2FhR2sjSteCDZv34fy5q8AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node) 
    project node_id = node.id, labels = labels(node), label_count = array_length(labels(node))
| where label_count > 1
| take 3
```

|node_id|labels|label_count|
|---|---|---|
|2|[<br>  "AZBase",<br>  "AZServicePrincipal"<br>]|2|
|4|[<br>  "AZBase",<br>  "AZUser"<br>]|2|
|5|[<br>  "AZBase",<br>  "AZUser"<br>]|2|

**Sample nodes by type**:

Retrieves representative examples of specific node types to understand their structure and properties. Essential for data exploration and query development.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0svSizI0FB3ysnPT%2FHIL81LiXfNKylKVNfkqlFIB8np5iaWJGcoaOTlp6RqKnApAEF5RmpRqkJOYlJqTjFUPCOxWEHJMSq0OLVICaymoCg%2FKzW5RAEkHZ%2BZomALZullpuiApApSi0oyU4thoggRoK3FibkFOakKRgAqpl%2FNmgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node) 
    where labels(node) has "AZUser"
    project node_id = node.id, properties = node.properties
| sample 2
```

|node_id|properties|
|---|---|
|5|{<br>  "lastseen": "2025-08-11T09:21:19.002Z[UTC]",<br>  "lastcollected": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "enabled": true,<br>  "displayname": "Jack Miller",<br>  "name": "JMILLER@PHANTOMCORP.ONMICROSOFT.COM",<br>  "tenantid": "6c12b0b0-b2cc-4a73-8252-0b94bfca2145",<br>  "objectid": "9a20c327-8cc7-4425-9480-11fb734db194",<br>  "onpremid": "",<br>  "usertype": "Member",<br>  "title": "",<br>  "userprincipalname": "jmiller@phantomcorp.onmicrosoft.com",<br>  "system_tags": "admin_tier_0",<br>  "pwdlastset": "2021-06-16T17:51:03Z[UTC]",<br>  "onpremsyncenabled": false,<br>  "whencreated": "2021-06-16T17:29:16Z[UTC]",<br>  "email": ""<br>}|
|10|{<br>  "lastseen": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "onpremid": "",<br>  "usertype": "Member",<br>  "title": "",<br>  "lastcollected": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "enabled": true,<br>  "userprincipalname": "cjackson@phantomcorp.onmicrosoft.com",<br>  "system_tags": "admin_tier_0",<br>  "displayname": "Chris Jackson",<br>  "pwdlastset": "2022-07-19T15:18:49Z[UTC]",<br>  "onpremsyncenabled": false,<br>  "name": "CJACKSON@PHANTOMCORP.ONMICROSOFT.COM",<br>  "tenantid": "6c12b0b0-b2cc-4a73-8252-0b94bfca2145",<br>  "whencreated": "2022-07-19T15:01:55Z[UTC]",<br>  "email": "cjackson@phantomcorp.onmicrosoft.com",<br>  "objectid": "bfb6a9c2-f3c8-4b9c-9d09-2924d38895f7"<br>}|

### Edge analysis

Understanding relationships in your graph is crucial for identifying patterns, data quality issues, and potential analysis directions.

**Discover all edge types** (works with different graph schemas):

This query identifies all relationship types in your graph, helping you understand the connections available for analysis. Different graphs use different property names for edge types, so multiple variations are provided.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02OsQ7CMAxEd77CW5MhIyMMSEj8A0JVmpi0qIkjx0UU8fEkdOEm697dyYFtHlV3mon8hZbk%2B3MStp3efSA0ZqIVN4IqtLBDba7oA97MUYnlgKJ3UJWZHugEGutnO%2BBc4ADboZrZ5uLT4Cvb5DdQA%2F9xIZA1I91VEZ5SaI2yxGh5eiO4%2BpooDcO6lSsUyrBvxo%2F14LG4Lz9WTF%2FOAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (source)-[edge]->(target)
    project edge_labels = labels(edge)
| mv-expand label = edge_labels to typeof(string)
| summarize count() by label
| top 5 by count_ desc
```

|label|count_|
|---|---|
|AZMGAddOwner|403412|
|AZMGAddSecret|345324|
|AZAddSecret|24666|
|AZContains|12924|
|AZRunsAs|6269|

**Find most connected nodes (highest degree)**:

Node degree analysis reveals the most influential or central entities in your graph. High-degree nodes often represent key players, bottlenecks, or important infrastructure components.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31QywrCMBC89yvm1harnjx6qSII4sUPCLFZmvWRlLgqgh9vjHooFOe0ywwzOzudYsXOwHlDF9xZLCy3li4C8aJPMNQGIhTsMIK%2FSpm1QXe2yDfLeqF221qtnVDQjfCN8jJ7IvHjs5bGonj7lhkiuuAP1EhKUmwwT9OETYXE%2F8BOfTM%2Fiu%2Bm2H3Mqp46XjQsj8SQPpX6HxB7DhrFaj4YCtg%2F%2Bjbxc00kRR8Jsxe0ZOByUQEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Find nodes with highest total degree (in + out)
graph('LDBC_SNB_Interactive')
| graph-match (node)
    project node_id = node.id, 
            in_degree = node_degree_in(node),
            out_degree = node_degree_out(node),
            total_degree = node_degree_in(node) + node_degree_out(node)
| order by total_degree desc
| take 5
```

|node_id|in_degree|out_degree|total_degree|
|---|---|---|---|
|0|41076|1|41077|
|1|35169|1|35170|
|50|12080|1|12081|
|49|11554|1|11555|
|58|7571|1|7572|

**Find nodes with highest in-degree (most incoming connections)**:

High in-degree nodes are often targets of influence, popular destinations, or central resources. In social networks, these might be influential people; in infrastructure graphs, these could be critical services.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNsQ6DMAxEd77CGyDRLsxd2qpT%2FyEyiRXcpgkyWZD4%2BIYQpPamO9%2FT2QpOY1M%2F79eberBHrxld3VYr2K05fTDqERofDLUVJE0SXqQjbBfFBi7ZnUvsIEOH8tXhQG5O4G72re6PY68MWSEqcyUp9uXzCkEMCQzLD2to1qmJ%2BCbov0iY1HnJAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('LDBC_Financial')
| graph-match (node)
    project node_id = node.node_id, 
            node_labels = labels(node),
            in_degree = node_degree_in(node)
| order by in_degree desc
| take 3
```

|node_id|node_labels|in_degree|
|---|---|---|
|Account::99079191802151398|[<br>  "ACCOUNT"<br>]|314|
|Account::4868391197187506662|[<br>  "ACCOUNT"<br>]|279|
|Account::4896538694858573544|[<br>  "ACCOUNT"<br>]|184|

**Find nodes with highest out-degree (most outgoing connections)**:

High out-degree nodes are often sources of influence, distributors, or connector hubs. These entities typically initiate many relationships or distribute resources to others.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNsQ7CMAxE936Ft7ZSYencBRAT%2FxC5sZUGQlK5YUDqx5OmQYKb7nxPZyM4T019u5zO6mo9em3R1W21gtmawxOjnqDxgbitIGmWcGcdYbsoSzBkdyyxgwx9la8OR3ZLAnezb3V%2FXHhFRWyEueyVpFJRfq8QhFhgfP%2FSxItOVcQHQ%2F8BiBTdrMwAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('LDBC_Financial')
| graph-match (node)
    project node_id = node.node_id, 
            node_labels = labels(node),
            out_degree = node_degree_out(node)
| order by out_degree desc
| take 3
```

|node_id|node_labels|out_degree|
|---|---|---|
|Account::236720455413661980|[<br>  "ACCOUNT"<br>]|384|
|Account::56576470318842045|[<br>  "ACCOUNT"<br>]|106|
|Account::4890627720347648300|[<br>  "ACCOUNT"<br>]|81|

### Relationship pattern analysis

These queries help identify structural patterns and complex relationships that might indicate important behaviors or anomalies in your data.

**Discover triangular relationships** (nodes connected in a triangle):

Triangular patterns often indicate tight collaboration, mutual dependencies, or closed-loop processes. In social networks, these represent groups of friends; in business processes, they might indicate approval chains or redundancy patterns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0svSizI0FB3ysnPT%2FHIL81LiXd0UdfkqlFIB0no5iaWJGcoaCRq6uraaSSByWQwmajJVZ6RWpSqkKiXmaKgaKuQBKIT81IgDKBAMkwgGSoAUslVUJSflZpcopCXn5JqqAASzEvMTdUB840UQMYg%2BMYKIFNAfKB7ShKzUxWMAUHbZKmvAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_AD')
| graph-match (a)-->(b)-->(c)-->(a)
    where a.id != b.id and b.id != c.id and c.id != a.id
    project node1 = a.name, node2 = b.name, node3 = c.name
| take 3
```

|node1|node2|node3|
|---|---|---|
|GHOST.CORP|USERS@GHOST.CORP|DOMAIN CONTROLLERS@GHOST.CORP|
|WRAITH.CORP|USERS@WRAITH.CORP|DOMAIN CONTROLLERS@WRAITH.CORP|
|DU001@PHANTOM.CORP|ADMINISTRATORS@PHANTOM.CORP|DOMAIN ADMINS@PHANTOM.CORP|

### Property analysis

Understanding the properties available on your nodes helps you build more sophisticated queries and identify data quality issues.

**Explore node properties**:

This query reveals what information is stored with your nodes, helping you understand the available attributes for filtering and analysis.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQzWrDMAyA730K0UsdWNvtAXLYYLDzoJeNEhRbxF78h62s7ejDz2nGkh0msAXyp0%2B2u4RRi82TDUG9hMGr5tlzwk21ukI3nm0dstQgfFBUraDESVMisNiSzVMZNGZYP74dMqU1wH4PrxQtSoKTYQ0oeUA7ddwMMYUPkjzmSIkNZahhNO3mSpnvPrcYo70sueBB3BxjFIDOEb2C3nhVY0q4hH%2B568%2BdTfaByUW%2BiJl6fzhWC5LOTEXYYgd12ZqIshccMifju2Xb%2FbG6g381eXAOk%2Fmiv4902FNTtKKsCR8%2FeobbwViVpSaHi1nVN6%2BRJYymAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node)
    where labels(node) has "AZUser"  // Replace with actual label
    project properties = node.properties
| mv-apply properties on (
        mv-expand kind=array properties
        | where isnotempty(properties[1])
        | extend bag =bag_pack(tostring(properties[0]), properties[1])
        | summarize properties = make_bag(bag)
    )
| summarize buildschema(properties)
```

|schema_properties|
|---|
|{<br>  "onpremsyncenabled": "bool",<br>  "system_tags": "string",<br>  "lastcollected": "string",<br>  "pwdlastset": "string",<br>  "usertype": "string",<br>  "userprincipalname": "string",<br>  "email": "string",<br>  "tenantid": "guid",<br>  "name": "string",<br>  "lastseen": "string",<br>  "displayname": "string",<br>  "enabled": "bool",<br>  "title": "string",<br>  "onpremid": "string",<br>  "objectid": "guid",<br>  "whencreated": "string"<br>}|

**Find nodes with specific property values**:

Use this pattern to locate entities with particular characteristics or to validate data quality by checking for expected property values.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OQQqDMBBF955idiq02bjuplDoLcLgDCatyYQ4WoQe3ih201l9%2Fnt8ZsiYXFPfRxF6yhzJPqJmrNvqC8POrgG1d9BEIW4rKPdxnBn8FEU5JF0PZFKWxFk9TyZiONVSvrhX2A3rCW5HMp4ucPqrXXCc%2BUf%2BVsoTim%2BGbgNX9s4YpwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node)
    where isnotempty(node.properties.name)
    project node_id = node.id, property_value = node.properties.name
| take 3
```

|node_id|property_value|
|---|---|
|1|JJACOB@PHANTOMCORP.ONMICROSOFT.COM|
|10|CJACKSON@PHANTOMCORP.ONMICROSOFT.COM|
|12|RHALL@PHANTOMCORP.ONMICROSOFT.COM|

## Related content

:::moniker range="microsoft-fabric || azure-data-explorer"
- [Graph semantics overview](graph-semantics-overview.md)
- [Common scenarios for using graph semantics](graph-scenarios.md)
- [Graph function](graph-function.md)
- [make-graph operator](make-graph-operator.md)
- [Graph models overview](../management/graph/graph-model-overview.md)
:::moniker-end

:::moniker range="azure-monitor || microsoft-sentinel"
- [Graph semantics overview](graph-semantics-overview.md)
- [Common scenarios for using graph semantics](graph-scenarios.md)
- [make-graph operator](make-graph-operator.md)
:::moniker-end
