---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language Overview

Kusto Query Language (KQL) is a powerful tool used to explore data, discover patterns, identify anomalies and outliers, create statistical modeling, and so on. 
KQL is optimal for querying telemetry, metrics, and logs with strong support for searching and parsing text, providing time-series operators and functions, analytics and aggregation, geospatial data, vector similarity searches, and many other language constructs that provide the most optimal language for data analysis. KQL queries use schema entities organized in a hierarchy similar to SQLs: databases, tables, and columns. KQL supports querying different types of data.

This article provides an explanation of the query language and offers practical exercises to get you started writing queries. To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md). {DK: Note: I tried to put these references into a bulleted list. This bullets worked, but it broke the links}

A Kusto query is a read-only request to process data and return results. Kusto queries are made of one or more query statements stated in plain text, using a data-flow model that is easy to read, author, and automate. KQL is expressive, easy to read and understand the query intent, and optimized for the authoring experience. KQL is case-sensitive for everything: table names, table column names, operators, functions, and so on. All query statements are separated by a `;` (semicolon), and only affect the specific query which contains it. 

<h2>Types of Queries</h2>
There are four types of user [query statements](statements.md): {DK: I would need to fix the broken link}

1. A [tabular expression statement](tabular-expression-statements.md) - This is the most common type of query statement or expression. Both its input and output consist of tables or tabular data sets. Tabular statements contain zero or more **operators**, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a pipe (`|`). Data flows from one operator to the next. Data is filtered or manipulated at each step and then fed into the subsequent step. It is like a funnel in which you start out with an an entire data table and each time the data passes through another operator, it is filtered, rearranged, or summarized. Because the flow of information from one operator to another is sequential, the query operator order is important, and can affect both results and performance. At the end of the funnel, refined output is produced.
1. A [let statement](let-statement.md)
1. A [set statement](set-statement.md)
2.  [Application query statements](statements.md#application-query-statements).

See the following sample query.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count 
```

|Count|
|-----|
|   28|

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains several operators, [`where`](where-operator.md) and [`count`](count-operator.md), each separated by a pipe. The data rows for the source table are filtered by the value of the *StartTime* column and are then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the count of the remaining rows.

<h2>Management Commands</h2>
In contrast to Kusto queries, management commands are requests to process, modify, or display data or metadata. For example, the following management command creates a new Kusto table with two columns, `Level` and `Number`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, which is not part of the KQL syntax, although the two share many concepts. In particular, management comands are distinguished from queries because the first character in the text of the command is the dot (`.`) character, which cannot be used to start a query. This distinction prevents many kinds of security attacks, simply because it prevents embedding management commands inside queries.

The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in Other Services

KQL is used by many other Microsoft services. For information on using KQL in these environments, refer to the following links:

* [Log Queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph Query Language](/azure/governance/resource-graph/concepts/query-language)
* [Proactively Hunt for Threats with Advanced Hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot Queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related stuff

* [Tutorial: Learn Common Operators](tutorials/learn-common-operators.md)
* [Tutorial: Use Aggregation Functions](tutorials/use-aggregation-functions.md)
* [KQL Quick Reference](kql-quick-reference.md)
* [SQL to Kusto Query Language Cheat Sheet](sql-cheat-sheet.md)
* [Query Best Practices](best-practices.md)
