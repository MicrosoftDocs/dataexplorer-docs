---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Introduction to Kusto Query Language (KQL)

Kusto Query Language (KQL) helps users explore and analyze data across services. With KQL, users can write queries to identify patterns, detect anomalies, and create statistical models from their data. KQL includes built-in support for structured logs, telemetry, and metrics, making it ideal for monitoring and analytics. The language works with many data types, including structured logs, telemetry, and geospatial data, and offers deep support for text search, time-series analysis, and vector similarity searches. KQL organizes data using a structured hierarchy of databases, tables, and columns, similar to how SQL structures relational data.

Users can get started with KQL by practicing real queries in a live environment. Start by accessing the query environment in [Azure Data Explorer](https://dataexplorer.azure.com/), then follow the [Learn common operators tutorial](tutorials/learn-common-operators.md) to build your first queries.

### KQL Query Processing

A KQL query typically processes tabular data—data organized in rows and columns—using **Tabular Expression Statements**. Each query consists of operators that process this data step by step. Users connect these operators using the pipe symbol (|), which allows data to flow efficiently from one operation to the next—similar to Unix pipelines or PowerShell commands. Common operators include [where](where-operator.md) for filtering data and [count](count-operator.md) for aggregating results.

A Kusto query is a read-only request that processes data and returns results. KQL queries use a **text-based syntax** that follows a **data-flow model**, making them easy to read, write, and automate. A query consists of one or more **query statements**, each performing a specific operation on the data.

### Query Statements

There are three kinds of user [query statements](statements.md):

1. A [tabular expression statement](tabular-expression-statements.md) – Defines a query that processes and returns tabular data.
2. A [let statement](let-statement.md) – Assigns a value or expression to a variable for reuse in queries.
3. A [set statement](set-statement.md) – Modifies query behavior or configuration settings.

All query statements are separated by a semicolon (;) and apply only to the current query session.

To learn more about application query statements, see [Application query statements](statements.md#application-query-statements).

### KQL Query Processing Step by Step

A KQL query processes data step by step, starting with an entire data table. Each operator refines the data by filtering, rearranging, or summarizing it before passing it to the next step. Because the order of query operators is sequential, it determines how transformations are applied and impacts both results and performance. The final output is a refined dataset.

### Example Query

To see KQL in action, run the following example query:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "Florida"  
| count
```

This query filters the StormEvents table to include rows where the StartTime is between November 1, 2007, and December 1, 2007, and the State is "Florida." It then counts the number of remaining rows.

|Count|
|-----|
|   28|

### Case Sensitivity in KQL

KQL is case-sensitive for everything—table names, table column names, operators and functions.

### Query Explanation

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains several operators, [where](where-operator.md) and [count](count-operator.md), each separated by a pipe. The data rows for the source table are filtered by the value of the *StartTime* column and then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the count of the remaining rows.

### Management Commands

In contrast to Kusto queries, [management commands](../management/index.md) are requests to Kusto to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns, Level and Number:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, which isn't part of the KQL syntax, although the two share many concepts. In particular, management commands are distinguished from queries by having the first character in the text of the command be the dot (.) character (which can't start a query). This distinction prevents many kinds of security attacks, simply because it prevents embedding management commands inside queries.

Not all management commands modify data or metadata. The large class of commands that start with .show are used to display metadata or data. For example, the .show tables command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in Other Services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

- [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
- [KQL in Microsoft Sentinel](/azure/sentinel/kusto-overview)
- [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
- [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
- [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related Topics

- [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
- [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
- [KQL quick reference](kql-quick-reference.md)
- [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
- [Query best practices](best-practices.md)
