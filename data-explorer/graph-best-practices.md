---
title: Best practices for Kusto Query Language (KQL) graph semantics
description: Learn about the best practices for Kusto Query Language (KQL) graph semantics.
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 09/03/2023
# Customer intent: As a data analyst, I want to learn about best practices for KQL graph semantics.
---

# Best practices for Kusto Query Language (KQL) graph semantics

This article explains how to use the graph semantics feature in KQL effectively and efficiently for different use cases and scenarios. It shows how to create and query graphs with the syntax and operators, and how to integrate them with other KQL features and functions. It also helps users avoid common pitfalls or errors, such as creating graphs that exceed memory or performance limits, or applying unsuitable or incompatible filters, projections, or aggregations.

## Size of graph

The [make-graph operator](kusto/query/make-graph-operator.md) creates an in-memory representation of a graph. It consists of the graph structure itself and its properties. When making a graph, use appropriate filters, projections, and aggregations to select only the relevant nodes and edges and their properties.

The following example shows how to reduce the number of nodes and edges and their properties. In this scenario, Bob changed manager from Alice to Eve and the user only wants to see the latest state of the graph for their organization. To reduce the size of the graph, the nodes are first filtered by the organization property and then the property is removed from the graph using the [project-away operator](kusto/query/project-away-operator.md). The same happens for edges. Then [summarize operator](kusto/query/summarize-operator.md) together with [arg_max](kusto/query/arg-max-aggregation-function.md) is used to get the last known state of the graph.

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

**Output**

| employee | topManager |
| -------- | ---------- |
| Bob      | Mallory    |

## Last known state of the graph

The [Size of graph](#size-of-graph) example demonstrated how to get the last known state of the edges of a graph by using `summarize` operator and the `arg_max` aggregation function. Obtaining the last known state is a compute-intensive operation.

Consider creating a materialized view to improve the query performance, as follows:

1. Create tables that have some notion of version as part of their model. We recommend using a `datetime` column that you can later use to create a graph time series.

    ```kusto
    .create table employees (organization: string, name:string, stateOfEmployment:string, properties:dynamic, modificationDate:datetime)

    .create table reportsTo (employee:string, manager:string, modificationDate: datetime)
    ```

1. Create a materialized view for each table and use the [arg_max aggregation](kusto/query/arg-max-aggregation-function.md) function to determine the *last known state* of employees and the *reportsTo* relation.

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

1. Create two functions that ensure that only the materialized component of the materialized view is used and additional filters and projections are applied.

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

The resulting query using materialized makes the query faster and more efficient for larger graphs. It also enables higher concurrency and lower latency queries for the latest state of the graph. The user can still query the graph history based on the employees and *reportsTo* tables, if needed

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

## Graph time travel

Some scenarios require you to analyze data based on the state of a graph at a specific point in time. Graph time travel uses a combination of time filters and summarizes using the arg_max aggregation function.

The following KQL statement creates a function with a parameter that defines the interesting point in time for the graph. It returns a ready-made graph.

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

With the function in place, the user can craft a query to get the top manager of Bob based on the graph in June 2022.

```kusto
graph_time_travel(datetime(2022-06-01))
| graph-match (employee)-[hasManager*2..5]-(manager)
  where employee.name == "Bob"
  project employee = employee.name, reportingPath = hasManager.manager
```

**Output**

| employee | topManager |
| -------- | ---------- |
| Bob      | Dave       |

## Dealing with multiple node and edge types

Sometimes it's required to contextualize time series data with a graph that consists of multiple node types. One way of handling this scenario is creating a general-purpose property graph that is represented by a canonical model.

Occasionally, you may need to contextualize time series data with a graph that has multiple node types. You could approach the problem by creating a general-purpose property graph that is based on a canonical model, such as the following.

- nodes
  - nodeId (string)
  - label (string)
  - properties (dynamic)
- edges
  - source (string)
  - destination (string)
  - label (string)
  - properties (dynamic)

The following example shows how to transform the data into a canonical model and how to query it. The base tables for the nodes and edges of the graph have different schemas.

This scenario involves a factory manager who wants to find out why equipment isn't working well and who is responsible for fixing it. The manager decides to use a graph that combines the asset graph of the production floor and the maintenance staff hierarchy which changes every day.

The following graph shows the relations between assets and their time series, such as speed, temperature, and pressure. The operators and the assets, such as *pump*, are connected via the *operates* edge. The operators themselves report up to management.

:::image type="content" source="media/graph/graph-property-graph.png" alt-text="Infographic on the property graph scenario." lightbox="media/graph/graph-property-graph.png":::

The data for those entities can be stored directly in your cluster or acquired using query federation to a different service, such as Azure Cosmos DB, Azure SQL, or Azure Digital Twin. To illustrate the example, the following tabular data is created as part of the query:

```kusto
let sensors = datatable(sensorId:string, tagName:string, unitOfMeasuree:string)
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

The *employees*, *sensors*, and other entities and relationships don't share a canonical data model. You can use the [union operator](kusto/query/union-operator.md) to combine and canonize the data.

The following query joins the sensor data with the time series data to find the sensors that have abnormal readings. Then, it uses a projection to create a common model for the graph nodes.

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

The edges are transformed in a similar way.

```kusto
let edges =
    union
        ( assetHierarchy | extend label = "hasParent" ),
        ( allReports | project source = employee, destination = manager, label = "reportsTo" ),
        ( operates | project source = employee, destination = machine, properties = pack_all(true), label = "operates" );
```

With the canonized nodes and edges data, you can create a graph using the [make-graph operator](kusto/query/make-graph-operator.md), as follows:

```kusto
let graph = edges
| make-graph source --> destination with nodes on nodeId;
```

Once created, define the path pattern and project the information required. The pattern starts at a tag node followed by a variable length edge to an asset. That asset is operated by an operator that reports to a top manager via a variable length edge, called *reportsTo*. The constraints section of the [graph-match operator](kusto/query/graph-match-operator.md), in this instance **where**, reduces the tags to the ones that have an anomaly and were operated on a specific day.

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

The projection in graph-match outputs the information that the temperature sensor showed an anomaly on the specified day. It was operated by Eve who ultimately reports to Mallory. With this information, the factory manager can reach out to Eve and potentially Mallory to get a better understanding of the anomaly.

## Related content

* [Graph operators](kusto/query/graph-operators.md)
