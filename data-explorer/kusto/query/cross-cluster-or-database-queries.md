---
title:   Cross-cluster and cross-database queries - Azure Data Explorer
description: This article describes cross-database and cross-cluster queries in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
monikerRange: "=azure-data-explorer"
---
# Cross-cluster and cross-database queries

Queries run with a particular database designated as the *database in context*. This database acts as the default for permission checking. If an entity is referenced in a query without specifying the cluster or database, it's resolved against this database.

This article explains how to execute queries that involve entities located outside the current context database.

## Prerequisites

* If the clusters are in different tenants, follow the instructions in [Allow cross-tenant queries and commands](../access-control/cross-tenant-query-and-commands.md).

## Identify the cluster and database in context

The following table explains how to identify the database in context by query environment.

|Environment|Database in context|
|--|--|
|[Kusto Explorer](../tools/kusto-explorer.md)|The default database is the one selected in the [connections panel](../tools/kusto-explorer.md#connections-panel), and the current cluster is the cluster containing that database.|
|[Azure Data Explorer web UI](https://dataexplorer.azure.com/)|The default database is the one selected in the [connection pane](../../web-ui-query-overview.md#view-clusters-and-databases), and the current cluster is the cluster containing that database.|
|[Client libraries](../api/client-libraries.md)|The default database and cluster are specified by the `Data Source` and `Initial Catalog` properties of the [Kusto connection strings](../api/connection-strings/kusto.md).|

## Perform cross-cluster or cross-database queries

To access entities outside the database in context, use the [cluster()](../query/cluster-function.md) and [database()](../query/databasefunction.md) functions to qualify the entity name.

For a table in a different database within the same cluster:

```kusto
database("<DatabaseName>").<TableName>
```

For a table in a remote cluster:

```kusto
cluster("<ClusterName>").database("<DatabaseName>").<TableName>
```

> [!NOTE]
> To execute a query, you must have viewer permission to the default database and
> to every other database referenced in the query.
> For more information, see [Kusto role-based access control](../access-control/role-based-access-control.md).

> [!TIP]
> The number of records returned from a query is limited by default, even if there's no specific use of the `take` operator. To lift this limit, use the `notruncation` client request option. For more information, see [Query limits](../concepts/querylimits.md).

### Qualified names and the union operator

When a *qualified name* appears as an operand of the [union operator](./unionoperator.md), then wildcards can be used to specify multiple tables and multiple databases. Wildcards aren't permitted in cluster names.

```kusto
union withsource=TableName *, database("OtherDb*").*Table, cluster("OtherCluster").database("*").*
```

> [!NOTE]
> The name of the default database is also a potential match, so `database("*")` specifies all tables of all databases including the default.

### Qualified names and restrict access statements

Qualified names or patterns can also be included in [restrict access](./restrictstatement.md) statement.
Wildcards in cluster names aren't permitted.

The following query restricts query access to the following entities:

* Any entity name starting with *my...* in the default database.
* Any table in all the databases named *MyOther...* of the current cluster.
* Any table in all the databases named *my2...* in the cluster *OtherCluster.kusto.windows.net*.

```kusto
restrict access to (my*, database("MyOther*").*, cluster("OtherCluster").database("my2*").*);
```

## Handle schema changes of remote entities

To process a cross-cluster query, the cluster that performs the initial query interpretation needs to have the schema of the entities referenced on remote clusters. To obtain this information, a command is sent to retrieve the schemas, which are then stored in a cache. 

In the event of a schema change in the remote cluster, a cached schema may become outdated. This can lead to undesired effects, including scenarios where new or deleted columns cause a `Partial query failure`. To solve such issues, manually refresh the schema with the [.clear cache remote-schema](../management/clear-cross-cluster-schema-cache.md) command.

## Functions and views

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

### Limitations of cross-cluster function calls

Tabular functions or views can be referenced across clusters. The following limitations apply:

* Remote functions must return tabular schema. Scalar functions can only be accessed in the same cluster.
* Remote functions can accept only scalar arguments. Functions that get one or more table arguments can only be accessed in the same cluster.
* Remote functions' result schema must be fixed (known in advance without executing parts of the query).
  This precludes the use of query constructs such as the `pivot` plugin. (Note that some plugins,
  such as the `bag_unpack` plugin, supports a way to indicate the result schema statically,
  and in this form it *can* be used in cross-cluster function calls.)
* For performance reasons, the schema of remote entities is cached by the calling cluster after the initial call. Therefore, changes made to the remote entity may result in a mismatch with the cached schema information, potentially leading to query failures. For more information, see [Cross-cluster queries and schema changes](../concepts/cross-cluster-and-schema-changes.md).

#### Examples

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

The following query calls remote function `SomeTable` that has a variable schema output based on the parameter `tablename`.
This call violates rule #3, so it's not valid.

Tabular function in `OtherDb`.

```kusto
.create function SomeTable(tablename:string) { table(tablename)  }  
```

In default database.

```kusto
cluster("OtherCluster").database("OtherDb").SomeTable("MyTable")
```

The following query calls remote function `GetDataPivot` that has a variable schema output based on the data ([pivot() plugin](pivotplugin.md) has dynamic output).
This call violates rule #3, so it's not valid.

Tabular function in `OtherDb`.

```kusto
.create function GetDataPivot() { T | evaluate pivot(PivotColumn) }  
```

Tabular function in the default database.

```kusto
cluster("OtherCluster").database("OtherDb").GetDataPivot()
```

## Related content

* [Cross-cluster join](../query/joincrosscluster.md)
* [Allow cross-tenant queries and commands](../access-control/cross-tenant-query-and-commands.md)
