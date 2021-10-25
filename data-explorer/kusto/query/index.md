---
title: Kusto Query Language (KQL) overview- Azure Data Explorer
description: This article is a general overview of the Kusto Query Language in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/24/2021
ms.localizationpriority: high 
adobe-target: true
---
# Kusto Query Language (KQL) overview

Kusto Query language is a powerful tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and more. The query uses schema entities that are organized in a hierarchy similar to SQL's: databases, tables, and columns.

## What is a Kusto query?

A Kusto query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. Kusto queries are made of one or more query statements.

## What is a query statement?

There are three kinds of user [query statements](statements.md):

* A [tabular expression statement](tabularexpressionstatements.md), the most important and common kind of query statement, returns "interesting" data as results. Tabular statements can contain one more operator. Each query operator starts with a tabular input, and returns a tabular output. Data flows from one operator to the next, being filtered or manipulated at each step, and then fed into the following step. Operators are sequenced by a `|` (pipe).
* A [let statement](letstatement.md) defines a binding between a name and an expression. Let statements can be used to break a long query into small named parts that are easier to understand.
* A [set statement](setstatement.md) sets a query option that affects how the query is processed and its results returned.

Query Statements are separated by a `;` (semicolon), and only affect the query at hand.

>[!NOTE]
> For information about application query statements, see [Application query statements](statements.md#application-query-statements).

## Query example

For example, the following Kusto query has a single statement, which is a tabular expression statement. The statement starts with a reference to a table called `StormEvents` (the database that hosts this table is implicit, and part of the connection information). The statement contains several operators, separated by pipes. The data (rows) for that table are filtered by the value of the `StartTime` column, and afterwards filtered by the value of the `State` column. The query then returns the count of "surviving" rows.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime >= datetime(2007-11-01) and StartTime < datetime(2007-12-01)
| where State == "FLORIDA"  
| count 
```

[Run this query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksKgnJzE1VsLNVSEksSS0BsjWMDAzMdQ0NdQ0MNRUS81KQVNmgKzICKUIxryRVwdZWQcnNxz/I08VRSQFsW3J+aV6JAgAwMx4+hAAAAA==)
to see the result:

|Count|
|-----|
|   23|

> [!NOTE]
> KQL is case-sensitive for everything – table names, table column names, operators, functions, and so on.

## Control commands

In contrast to Kusto queries, [Control commands](../management/index.md) are requests to Kusto to process or modify data or metadata. For example, the following control command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Control commands have their own syntax, which isn't part of the Kusto Query Language syntax, although the two share many concepts. In particular, control commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which can't start a query).
This distinction prevents many kinds of security attacks, simply because it prevents embedding control commands inside queries.

Not all control commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

## Next steps

* [Tutorial: Use Kusto queries](../query/tutorial.md)
* [Samples for Kusto Queries](../query/samples.md)
* [KQL quick reference](../../kql-quick-reference.md)
* [SQL to Kusto cheat sheet](sqlcheatsheet.md)
* [Query best practices](best-practices.md)