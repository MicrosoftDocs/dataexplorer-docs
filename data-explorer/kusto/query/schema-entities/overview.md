---
title: Schema entities - Azure Kusto | Microsoft Docs
description: This article describes Schema entities in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Schema entities

Kusto queries are exposed to stored data arranged in rectangular tables
that use the relational model (a table is "rectangular" in the sense that
it has a well-defined ordered set of columns, and every row in the table
has the same set). Every table "belongs" to a database, and every database
"belongs" to one cluster.

Kusto also supports entities called stored functions; a stored function
"belongs" to a database, and provides a mechanism to reuse Kusto query
(in whole or in parts).

To summarize:

* [Clusters](./clusters.md) are entities that hold databases.
  Clusters are "named" through a URI, such as `https://help.kusto.windows.net`,
  and referenced by using the `cluster()` function.

* [Databases](./databases.md) are named entities that hold tables
  and stored functions.

* [Tables](./tables.md) are named entities that have an ordered set
  of columns, and zero or more rows of data that provide values
  according to those columns.

* [Columns](./columns.md) are named entities that have a data type.
  The data type of a column is one of the supported scalar data types.

* [Stored functions](./stored-functions.md) are named entities that
  allow reuse of Kusto queries or query parts.

## Client-side entity validation

<!-- TODO: ZIVC: This section needs to be moved outside the query language section completely. -->

Client code that is using [Kusto Client .NET library](https://kusdoc2.azurewebsites.net/docs/api/using-the-kusto-client-library.html) can 
use `Kusto.Data.Common.EntityValidator` class to check if the entity is valid or not.

## Examples

<!-- This should be moved out as well -->

Here are two examples for fully-qualified names
(see [Cross-database queries](https://kusdoc2.azurewebsites.net/docs/syntax.html#queries) for more information
on referencing foreign clusters.)
 
```
database("MyDb").Table

cluster("OtherCluster").database("MyDb").Table
```