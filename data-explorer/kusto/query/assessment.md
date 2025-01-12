---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language

Kusto Query Language (KQL) is a powerful tool that you can use to explore data and discover patterns, identify anomalies and outliers, create statistical modeling, etc. KQL can be used to query different kinds of data. The language is expressive, makes it easy to understand a query's intent, and is optimized for the authoring experience. KQL can be used to query telemetry, metrics, and logs.

KQL supports:

* Text search and parsing
* Time-series operators and functions
* Analytics and aggregation
* Geospatial data
* Vector similarity searches
* Additional language constructs

These capabilities provide an optimal language for data analysis.

KQL is universally case sensitive. This includes table names, table column names, operators, functions, etc.

This article provides a description of KQL and offers practical exercises to get you started writing queries.

* To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).
* For a tutorial about using KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

## KQL Queries

A KQL query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. KQL queries use schema entities organized in a hierarchy similar to that of SQL. The hierarchy includes databases, tables, and columns.

Queries consist of query statements separated by semicolons (`;`). Query statements only affect the current query. The most common kind of KQL query statement is a tabular expression **statement**. In a tabular expression statement, both the input and the output consist of tables or tabular datasets.

Tabular statements contain zero or more **operators**, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a pipe (`|`). Data flows, or is piped, from one operator to the next. The data is filtered or manipulated at each step and then fed to the following step. Because the piping of information from one operator to another is sequential, the order of operators in the query is important and can affect both results and performance.

A query can be compared to a funnel. The query starts with all of the data in a table. As the data passes through an operator, it is filtered, rearranged, or summarized. At the end of the funnel, only the relevant data remains.

There are three types of user [query statements](statements.md):

* [Tabular expression statements](tabular-expression-statements.md)
* [Let statements](let-statement.md)
* [Set statements](set-statement.md)

For information about application query statements, see [Application query statements](statements.md#application-query-statements).

# Example query

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


The query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains [`where`](where-operator.md) and [`count`](count-operator.md) operators, each separated by a pipe. The data rows for the source table are filtered by the value of the *StartTime* column and then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the number of rows remaining in the table.

## Management commands

In contrast to KQL queries, [management commands](../management/index.md) are requests to Kusto to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax. This syntax is not part of the KQL syntax. However, the two share many concepts. In particular, management comands are distinguished from queries by starting with the dot character (`.`). This results in increased security by preventing the embedding of management commands in a query because a query cannot start with a dot.

Not all management commands modify data or metadata. Commands that start with `.show` are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

* [Log queries in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph query language](https://learn.microsoft.com/en-us/azure/governance/resource-graph/concepts/query-language)
* [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot queries](https://learn.microsoft.com/en-us/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related content

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
