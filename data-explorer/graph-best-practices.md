---
title: Kusto graph semantics best practices
description: This article describes best practices for the KQL graph semantics
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 08/11/2023
---

# Best practices

Best practices are important for users to understand the benefits and limitations of the graph semantics feature, and how to use it effectively and efficiently for their use cases and scenarios. It provides guidance and examples on how to create and query graphs using the syntax and operators, and how to combine them with other KQL features and functions. Furthermore, it helps prevent users from making common mistakes or errors, such as creating graphs that are too large or too complex for the memory or performance of the engine, or using inappropriate or incompatible filters, projections, or aggregations.

## Size of graph

The make-graph operator creates an in-memory representation of a graph. It consists of the graph structure itself and its properties. Users should use appropriate filters, projections, and aggregations to select only the relevant nodes and edges and their properties.

The following example illustrates how to reduce the number of nodes and edges including their properties. The nodes where filtered by the R&D organization properties which are not required for downstream operators where projected away. The same happens for the edges. Bob transitioned from her previous manager Alice to Eve. The user is solely interested in the last state of the graph, that's why the summarize operator together with arg_max was used to get the last known state of the graph.

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

The previous example demonstrated how to get the last known state of the edges of a graph by using summarize and the arg_max aggregation function. This is a compute intense operation so it might make sense to create a materialized view to improve the query performance.

The initial set of tables for employees require to have some notion of version being part of their model. It makes a lot of sense to use a datetime column for that purpose. This will allow the user to create a graph time series.

```kusto
.create table employees (organization: string, name:string, stateOfEmployment:string, properties:dynamic, modificationDate:datetime)

.create table reportsTo (employee:string, manager:string, modificationDate: datetime)
```

Once the tables were created its possible to create a materialized view for each of them and use the arg_max aggregation function to determine the last known state of employees and the reportsTo relation.

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

The last step involves the creation of two functions which ensure that only the materialized component of the materialized view is being used and additional filters/projections are applied.

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

The resulting statement looks a lot cleaner and will perform much better on larger graphs because of the optimization using the materialized views. Moreover, this pattern allows higher concurrency and lower latency queries for the last known state of the graph. Additionally it does not prevent the user from implementing a graph time travel query based on the employees and reportsTo tables.

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

Some scenarios require to analyze data based on the state of a graph at a specific point in time. Graph time travel is leveraging a combination of time filters and summarize using the arg_max aggregation function.

The following KQL statement creates a function with a parameter which defines the interesting point in time for the graph. It returns a ready made graph.

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

Sometimes it's required to contextualize time series data in ADX with a graph which consists of multiple node types. One way of handling this scenario is creating a general purpose property graph which is represented by a canonical model.

- nodes
  - nodeId (string)
  - label (string)
  - properties (dynamic)
- edges
  - source (string)
  - destination (string)
  - label (string)
  - properties (dynamic)

The following example (IIoT scenario) demonstrates the transformation to the canonical model and how to query it. The base tables for the nodes and edges of the graph have a very different in their schema.

````kusto
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

In order to create a canonical model the user can leverage the union operator. The following KQL shows that the sensor data is joined with the time series data to identify anomalous sensors. Afterwards, a projection is used to create the canonical model for the nodes of the graph.

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

Once the graph was created using make-graph, the user needs to define the path pattern which should be detected and project the information required.

```kusto
edges
| make-graph source --> destination with nodes on nodeId
| graph-match cycles=edges (tag)-[hasParent*1..5]->(asset)<-[operates]-(operator)-[reportsTo*1..5]->(topManager)
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

The output of the query returned the information that the temperature sensor showed an anomaly on the given day. It was operated by Eve which ultimately reports to Mallory. Now a service engine

## Executing multiple graph match statements on a graph

## Next steps

Learn more about Scenarios _addLinkHere_
Learn more about Operators _addLinkHere_
````
