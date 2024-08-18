---
title:    Cross-cluster and cross-database queries
description:  This article describes cross-database and cross-cluster queries.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# Cross-cluster and cross-database queries

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

:::moniker range="azure-data-explorer"
Queries run with a particular database designated as the *database in context*. This database acts as the default for permission checking. If an entity is referenced in a query without specifying the cluster or database, it's resolved against this database.
:::moniker-end
:::moniker range="microsoft-fabric"
Queries run with a particular database designated as the *database in context*. This database acts as the default for permission checking. If an entity is referenced in a query without specifying the context, it's resolved against this database.
:::moniker-end

This article explains how to execute queries that involve entities located outside the current context database.

## Prerequisites

:::moniker range="azure-data-explorer"
* If the clusters are in different tenants, follow the instructions in [Allow cross-tenant queries and commands](/azure/data-explorer/cross-tenant-query-and-commands).

## Identify the cluster and database in context
:::moniker-end

:::moniker range="microsoft-fabric"
## Identify the eventhouse and database in context

:::moniker-end

The following table explains how to identify the database in context by query environment.

:::moniker range="azure-data-explorer"

|Environment|Database in context|
|--|--|
|[Kusto Explorer](../tools/kusto-explorer.md)|The default database is the one selected in the [connections panel](../tools/kusto-explorer.md#connections-panel), and the current cluster is the cluster containing that database.|
|[Azure Data Explorer web UI](https://dataexplorer.azure.com/)|The default database is the one selected in the [connection pane](/azure/data-explorer/web-ui-query-overview#view-clusters-and-databases), and the current cluster is the cluster containing that database.|
|[Client libraries](../api/client-libraries.md)|Specify the default database and cluster by the `Data Source` and `Initial Catalog` properties of the [Kusto connection strings](../api/connection-strings/kusto.md).|
:::moniker-end
:::moniker range="microsoft-fabric"

|Environment|Database/Eventhouse in context|
|--|--|
|[Kusto Explorer](../tools/kusto-explorer.md)|The default database is the one selected in the [connections panel](../tools/kusto-explorer.md#connections-panel) and the current eventhouse is the eventhouse containing that database.|
|[Real-Time Intelligence KQL queryset](/fabric/real-time-intelligence/create-query-set#open-an-existing-kql-queryset) |The default database is the current database selected either [directly](/fabric/real-time-intelligence/kusto-query-set?tabs=kql-database#select-a-database) or through an eventhouse.|
|[Client libraries](../api/client-libraries.md)| Specify the default database with the [database URI](/fabric/real-time-intelligence/access-database-copy-uri#copy-uri), used for the `Data Source` properties of the [Kusto connection strings](../api/connection-strings/kusto.md). For the eventhouse, use its cluster URI. You can find it by selecting **System Overview** in the *Eventhouse details* section for the selected eventhouse. |

:::moniker-end

:::moniker range="azure-data-explorer"
## Perform cross-cluster or cross-database queries
:::moniker-end
:::moniker range="microsoft-fabric"
## Perform cross-eventhouse or cross-database queries
:::moniker-end

To access entities outside the database in context, use the [cluster()](../query/cluster-function.md) and [database()](../query/database-function.md) functions to qualify the entity name.

:::moniker range="azure-data-explorer"
For a table in a different database within the same cluster:

```kusto
database("<DatabaseName>").<TableName>
```

For a table in a remote cluster:

```kusto
cluster("<ClusterName>").database("<DatabaseName>").<TableName>
```
:::moniker-end
:::moniker range="microsoft-fabric"
For a table in a different database within the same eventhouse:

```kusto
database("<DatabaseName>").<TableName>
```

For a table in a remote eventhouse or remote service (like Azure Data Explorer) cluster:

```kusto
cluster("<EventhouseClusterURI>").database("<DatabaseName>").<TableName>
```
:::moniker-end

> [!NOTE]
> To execute a query, you must have viewer permission to the default database and
> to every other database referenced in the query.
> For more information, see [Kusto role-based access control](../access-control/role-based-access-control.md).

> [!TIP]
> The number of records returned from a query is limited by default, even if there's no specific use of the `take` operator. To lift this limit, use the `notruncation` client request option. For more information, see [Query limits](../concepts/query-limits.md).

### Qualified names and the union operator
:::moniker range="azure-data-explorer"
When a *qualified name* appears as an operand of the [union operator](union-operator.md), then wildcards can be used to specify multiple tables and multiple databases. Wildcards aren't permitted in cluster names.

```kusto
union withsource=TableName *, database("OtherDb*").*Table, cluster("OtherCluster").database("*").*
```
:::moniker-end 
:::moniker range="microsoft-fabric"
When a *qualified name* appears as an operand of the [union operator](union-operator.md), then wildcards can be used to specify multiple tables and multiple databases. Wildcards aren't permitted in eventhouse names.

```kusto
union withsource=TableName *, database("OtherDb*").*Table, cluster("OtherEventhouseClusterURI").database("*").*
```
:::moniker-end

> [!NOTE]
> The name of the default database is also a potential match, so `database("*")` specifies all tables of all databases including the default.

### Qualified names and restrict access statements

:::moniker range="azure-data-explorer"
Qualified names or patterns can also be included in [restrict access](restrict-statement.md) statement.
Wildcards in cluster names aren't permitted.
:::moniker-end
:::moniker range="microsoft-fabric"
Wildcards in eventhouse names aren't permitted.
:::moniker-end

The following query restricts query access to the following entities:

:::moniker range="azure-data-explorer"
* Any entity name starting with *my...* in the default database.
* Any table in all the databases named *MyOther...* of the current cluster.
* Any table in all the databases named *my2...* in the cluster *OtherCluster.kusto.windows.net*.

```kusto
restrict access to (my*, database("MyOther*").*, cluster("OtherCluster").database("my2*").*);
```
:::moniker-end
:::moniker range="microsoft-fabric"
* Any entity name starting with *event...* in the default database.
* Any table in all the databases named *EventOther...* of the current eventhouse.
* Any table in all the databases named *event2...* in the eventhouse *OtherEventhouse.kusto.data.microsoft.com*.

```kusto
restrict access to (event*, database("EventOther*").*, cluster("OtherEventhouseClusterURI").database("event2*").*);
```
:::moniker-end

## Handle schema changes of remote entities

:::moniker range="azure-data-explorer"
To process a cross-cluster query, the cluster that performs the initial query interpretation needs to have the schema of the entities referenced on remote clusters. To obtain this information, a command is sent to retrieve the schemas, which are then stored in a cache.

If there's a schema change in the remote cluster, a cached schema might become outdated. This can lead to undesired effects, including scenarios where new or deleted columns cause a `Partial query failure`. To solve such issues, manually refresh the schema with the [.clear cache remote-schema](../management/clear-cross-cluster-schema-cache.md) command.
:::moniker-end
:::moniker range="microsoft-fabric"
To process a cross-eventhouse or eventhouse-to-ADX cluster query, the eventhouse that performs the initial query interpretation needs to have the schema of the entities referenced on remote eventhouses or clusters. To obtain this information, a command is sent to retrieve the schemas, which are then stored in a cache.

If there's a remote schema change, a cached schema might become outdated. This can lead to undesired effects, including scenarios where new or deleted columns cause a `Partial query failure`. To solve such issues, manually refresh the schema with the [.clear cache remote-schema](../management/clear-cross-cluster-schema-cache.md) command.
:::moniker-end

## Functions and views

:::moniker range="azure-data-explorer"
Functions and views (persistent and created inline) can reference tables across database and cluster boundaries. The following code is valid.

```kusto
let MyView = Table1 join database("OtherDb").Table2 on Key | join cluster("OtherCluster").database("SomeDb").Table3 on Key;
MyView | where ...
```

Persistent functions and views can be accessed from another database in the same cluster.

For example, say you create the following tabular function (view) in a database `OtherDb`:

```kusto
.create function MyView(v:string) { Table1 | where Column1 has v ...  }  
```

Then, you create the following scalar function in a database `OtherDb`:

```kusto
.create function MyCalc(a:double, b:double, c:double) { (a + b) / c }  
```

In default database, these entities can be referenced as follows:

```kusto
database("OtherDb").MyView("exception") | extend CalCol=database("OtherDb").MyCalc(Col1, Col2, Col3) | take 10
```

:::moniker-end
:::moniker range="microsoft-fabric"
Functions and views (persistent and created inline) can reference tables across database and eventhouse boundaries. The following code is valid.

```kusto
let EventView = Table1 join database("OtherDb").Table2 on Key | join cluster("OtherEventhouseClusterURI").database("SomeDb").Table3 on Key;
EventView | where ...
```

Persistent functions and views can be accessed from another database in the same eventhouse.

For example, say you create the following tabular function (view) in a database `OtherDb`:

```kusto
.create function EventView(v:string) { Table1 | where Column1 has v ...  }  
```

Then, you create the following scalar function in a database `OtherDb`:

```kusto
.create function EventCalc(a:double, b:double, c:double) { (a + b) / c }  
```
For example, say you create the following tabular function (view) in a database `OtherDb`:

```kusto
.create function EventView(v:string) { Table1 | where Column1 has v ...  }  
```

Then, you create the following scalar function in a database `OtherDb`:

```kusto
.create function EventCalc(a:double, b:double, c:double) { (a + b) / c }  
```

In default database, these entities can be referenced as follows:

```kusto
database("OtherDb").EventView("exception") | extend CalCol=database("OtherDb").EventCalc(Col1, Col2, Col3) | take 10
```
:::moniker-end

:::moniker range="azure-data-explorer"
### Limitations of cross-cluster function calls

Tabular functions or views can be referenced across clusters. The following limitations apply:

* Remote functions must return tabular schema. Scalar functions can only be accessed in the same cluster.
* Remote functions can accept only scalar arguments. Functions that get one or more table arguments can only be accessed in the same cluster.
* Remote functions' result schema must be fixed (known in advance without executing parts of the query). So query constructs such as the `pivot` plugin can't be used. Some plugins, such as the `bag_unpack` plugin, support a way to indicate the result schema statically, and in this form it *can* be used in cross-cluster function calls.
* For performance reasons, the calling cluster caches the schema of remote entities after the initial call. Therefore, changes made to the remote entity might result in a mismatch with the cached schema information, potentially leading to query failures. For more information, see [Cross-cluster queries and schema changes](#handle-schema-changes-of-remote-entities).
:::moniker-end
:::moniker range="microsoft-fabric"
### Limitations of cross-eventhouse function calls

Tabular functions or views can be referenced across eventhouses. The following limitations apply:

* Remote functions must return tabular schema. Scalar functions can only be accessed in the same eventhouse.
* Remote functions can accept only scalar arguments. Functions that get one or more table arguments can only be accessed in the same eventhouse.
* Remote functions' result schema must be fixed (known in advance without executing parts of the query). So query constructs such as the `pivot` plugin can't be used. Some plugins, such as the `bag_unpack` plugin, support a way to indicate the result schema statically, and in this form it *can* be used in cross-eventhouse function calls.
* For performance reasons, the calling eventhouse caches the schema of remote entities after the initial call. Therefore, changes made to the remote entity might result in a mismatch with the cached schema information, potentially leading to query failures. For more information, see [Cross-cluster queries and schema changes](#handle-schema-changes-of-remote-entities).

:::moniker-end

#### Examples

:::moniker range="azure-data-explorer"
The following cross-cluster call is valid.

```kusto
cluster("OtherCluster").database("SomeDb").MyView("exception") | count
```

The following query calls a remote scalar function `MyCalc`.
This call violates rule #1, so it's not valid.

```kusto
MyTable | extend CalCol=cluster("OtherCluster").database("OtherDb").MyCalc(Col1, Col2, Col3) | take 10
```

The following query calls remote function `MyCalc` and provides a tabular parameter.
This call violates rule #2, so it's not valid.

```kusto
cluster("OtherCluster").database("OtherDb").MyCalc(datatable(x:string, y:string)["x","y"] )
```
:::moniker-end
:::moniker range="microsoft-fabric"
The following cross-eventhouse call is valid.

```kusto
cluster("OtherEventhouseURI").database("SomeDb").EventView("exception") | count
```

The following query calls a remote scalar function `EventCalc`.
This call violates rule #1, so it's not valid.

```kusto
Eventtable | extend CalCol=cluster("OtherEventhouseClusterURI").database("OtherDb").MyCalc(Col1, Col2, Col3) | take 10
```

The following query calls remote function `EventCalc` and provides a tabular parameter.
This call violates rule #2, so it's not valid.

```kusto
cluster("EventhouseClusterURI").database("OtherDb").MyCalc(datatable(x:string, y:string)["x","y"] )
```
:::moniker-end

The following query calls remote function `SomeTable` that has a variable schema output based on the parameter `tablename`.
This call violates rule #3, so it's not valid.

Tabular function in `OtherDb`.

```kusto
.create function SomeTable(tablename:string) { table(tablename)  }  
```

In default database.

:::moniker range="azure-data-explorer"
```kusto
cluster("OtherCluster").database("OtherDb").SomeTable("MyTable")
```
:::moniker-end
:::moniker range="microsoft-fabric"
```kusto
cluster("OtherEventhouseClusterURI").database("OtherDb").SomeTable("EventTable")
```
:::moniker-end

The following query calls remote function `GetDataPivot` that has a variable schema output based on the data ([pivot() plugin](pivot-plugin.md) has dynamic output).
This call violates rule #3, so it's not valid.

Tabular function in `OtherDb`.

```kusto
.create function GetDataPivot() { T | evaluate pivot(PivotColumn) }  
```

Tabular function in the default database.

:::moniker range="azure-data-explorer"
```kusto
cluster("OtherCluster").database("OtherDb").GetDataPivot()
```
:::moniker-end
:::moniker range="microsoft-fabric"
```kusto
cluster("OtherEventhouseClusterURI").database("OtherDb").GetDataPivot()
```
:::moniker-end

## Related content

:::moniker range="azure-data-explorer"
* [Cross-cluster join](../query/join-cross-cluster.md)
* [Allow cross-tenant queries and commands](/azure/data-explorer/cross-tenant-query-and-commands)
:::moniker-end

:::moniker range="microsoft-fabric"
* [Cross-cluster join](../query/join-cross-cluster.md)
:::moniker-end
