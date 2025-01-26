---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language

Kusto Query Language is a powerful tool that can be used to explore your data, discover patterns, identify anomalies and outliers, create statistical modeling and more. 
You can query different types of data. The language is expressive - the query intent is easy to read and understand - and is optimized for authoring experiences. Kusto Query Language is optimal for querying telemetry, metrics, and logs with deep support for text search and parsing, time-series operators and functions, analytics and aggregation, geospatial, vector similarity searches, and many other language constructs that provide the most optimal language for data analysis. The query uses schema entities that are organized in a hierarchy similar to SQLs: databases, tables, and columns.
This article provides an explanation of the query language and offers practical exercises to get you started writing queries. It is divided into 2 sections: queries and management commands. To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn Common Operators](tutorials/learn-common-operators.md).

**Queries**

The most common kind of query statement is a tabular expression **statement**, which means both its input and output consist of tables or tabular datasets. Tabular statements contain zero or more **operators**, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a `|` (pipe). Data flows, or is piped, from one operator to the next. The data is filtered or manipulated at each step and then fed into the following step.
A Kusto query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. Kusto queries are made of one or more query statements.

There are 3 types of user [query statements](statements.md):

1. A [tabular expression statement](tabular-expression-statements.md)
2. A [let statement](let-statement.md)
3. A [set statement](set-statement.md)

All query statements are separated by a `;` (semicolon), and only affect the query at hand.

For information about application query statements, see [Application query statements](statements.md#application-query-statements).

The query operates like a funnel, filtering the contents of an entire data table. Each operator further filters, rearranges, or summarizes the data. Because piping information from one operator to another is sequential, the query operator order is important and can affect both results and performance. The query yields a refined output.

The following is an example of a query:

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

Please note that KQL is always case-sensitive, including table names, table column names, operators, and functions.

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains 2 operators, [`where`](where-operator.md) and [`count`](count-operator.md), each separated by a pipe. The data rows for the source table are filtered by the value in the *StartTime* column and then by the value in the *State* column. In the last line, the query returns a table with a single column and a single row containing the number of remaining rows.

**Management Commands**

In contrast to Kusto queries, [Management commands](../management/index.md are requests to Kusto to process or modify data or metadata. In the following example, the management command creates a new Kusto table with two columns, `Level` and `Number`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, distinct from Kusto Query Language syntax, although the two share many characteristics. In particular, management commands differ from queries in that they begin with a dot  (`.`). Queries on the other hand, cannot begin with a dot. This distinction prevents many types of security attacks by preventing embedding management commands inside queries.

Not all management commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

[Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
[Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
[Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
[CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related links:

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
