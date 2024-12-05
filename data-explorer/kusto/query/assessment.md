---
title:  Writing Assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: Yuri Kruman
ms.topic: reference
ms.date: 2024-12-05
---

Kusto Query Language (KQL) is a powerful tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and analyze complex datasets. You can query different kinds of data using this versatile language. KQL is expressive, easy to read, and optimized for authoring experiences, making query intent clear and understandable.

KQL excels at querying telemetry, metrics, and logs with deep support for text search and parsing, time-series operators and functions, analytics and aggregation, geospatial operations, vector similarity searches, and many other language constructs that provide optimal data analysis capabilities. The query system uses schema entities organized in a hierarchy similar to SQL: databases, tables, and columns.

To access the query environment, use [Azure Data Explorer web UI](https://dataexplorer.azure.com/). 

To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

##Query Structure and Operation
The most common kind of query statement is a tabular expression statement, where both input and output consist of tables or tabular datasets. These statements contain zero or more operators, each starting with tabular input and returning tabular output. Operators are sequenced by a `|` (pipe). Data flows through each operator, being filtered or manipulated at each step before moving to the next.

It functions like a funnel, where you start with an entire data table. Each time the data passes through another operator, it's filtered, rearranged, or summarized. The query operator order is important and can affect both results and performance. At the end of the funnel, you're left with a refined output.

A Kusto query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author and automate. Kusto queries are made of one or more query statements.

All query statements are separated by a semicolon (`;`) and only affect the query at hand.

For more on application query statements, see [Application query statements](statements.md#application-query-statements).

Here's a query example:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
_StormEvents_ 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count 
```

|Count|
|-----|
|   28|

Note that KQL is case-sensitive for everything, including table names, column names, operators, functions, and all other elements.

There are three types of user query statements [query statements](statements.md):

  1. A [tabular expression statement](tabular-expression-statements.md)
  2. A [let statement](let-statement.md)
  3. A [set statement](set-statement.md)

The above query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains several operators, [`where`](where-operator.md) and [`count`](count-operator.md), each separated by a pipe. 

The data rows for the source table are filtered by the value of the *StartTime* column and then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the count of the remaining rows.

##Management Commands 
In contrast to Kusto queries, management commands are requests to Kusto to process or modify data or metadata. 

For example, the following example creates a new Kusto table with two columns: 

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, distinct from KQL syntax, although they share many concepts. These commands are distinguished at the beginning with a dot (`.`), which prevents management commands from being embedded inside queries and enhances security.

Not all management commands modify data or metadata. Commands that start with `.show` display metadata or data. For example, `.show` tables returns a list of all tables in the current database.

For more, see [Management commands overview](../management/index.md).

##KQL in Other Services 

KQL is implemented across many Microsoft services. For specific information about using KQL in these environments, refer to:

* [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
* [Advanced hunting for threats in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

##Related Resources 

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
