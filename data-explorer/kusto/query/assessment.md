---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language

This article provides an explanation of the Kusto Query Language (KQL) and offers practical exercises to get started writing queries.  

Kusto Query Language is a powerful tool for exploring data, discovering patterns, creating statistical models, and identifying anomalies and outliers. It’s ideal for querying telemetry, metrics, and logs. KQL has robust support for text search, time-series analysis, geospatial queries, and vector similarity. The language tool is expressive, easy to read, and optimized for efficient querying and authoring. Its hierarchical schema of databases, tables, and columns resembles the hierarchy of SQL. With its advanced capabilities for analytics and aggregation, KQL is a top choice for data analysis.

## Query statements

A Kusto query is a read-only request that processes data and returns results. Written in plain text, the query follows a data-flow model that is easy to read, author, and automate. A Kusto query consists of one or more query statements.

The query process can be likened to a funnel, starting with an entire data table. As the data flows through each operator, it is filtered, rearranged, or summarized. Since operators are applied sequentially, the order in which they are arranged is crucial, impacting both the results and performance of the query. The final output is a refined dataset.

The most common query statement is a tabular expression, where both the input and output are tables or tabular datasets. These statements consist of zero or more operators, each starting with a tabular input and returning a tabular output. Operators are sequenced using the pipe (|) symbol, which directs the flow of data from one operator to the next. At each step, the data is filtered or manipulated before being passed to the subsequent operator. All query statements are separated by a semicolon (;) and apply only to the current query.

To learn about common operators, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).  
To access the query environment, use the [Azure Data Explorer](https://dataexplorer.azure.com/). 


### Query statement types

There are two types of [query statements](statements.md): User query statements and Application query statements.

* User query statements - primarily used by users. User query statements include:
  *   [Tabular expression statements](tabular-expression-statements.md)
  *   [Let statement](let-statement.md)
  *   [Set statement](set-statement.md)

* Application query statements - designed to support scenarios in which mid-tier applications take user queries and send a modified version of them to Kusto. Application query statements include:
  * [Alias statement](alias-statement.md) 
  * [Pattern statement](pattern-statement.md)
  * [Query parameters statement](query-parameters-statement.md)
  * [Restrict statement](restrict-statement.md)

 
### Example

This following query consists of a single tabular expression statement. It starts by referencing the StormEvents table and includes the operators **where** and **count**, each separated by a pipe (|). The data is first filtered based on the values in the *StartTime* column, and then further filtered by the *State* column. In the final step, the query returns a table with a single column which contains the count of the storm events within the specified time period in the specified state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "FLORIDA"  
| count 
```

|Count|
|-----|
|   28|


## Troubleshooting

KQL is case-sensitive for all elements, including table names, column names, operators, and functions.  As a result, incorrect use of uppercase or lowercase letters can impact the behavior and outcome of the query.

When 'florida' is written in lowercase instead of uppercase, the query results are affected, and '0' is returned.

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count 
```

|Count|
|-----|
|   0|


## Management commands

Unlike Kusto queries, [management commands](../management/index.md) are requests to Kusto to process, retreive, or modify data or metadata.

Management commands have their own syntax, separate from KQL, though they share many common concepts. One key distinction is that management commands begin with a dot (.) character, which cannot start a KQL query. This design helps prevent security vulnerabilities by ensuring that management commands cannot be embedded within queries.

Examples:

* `.create table` - the `.create table` management command is used to create new Kusto tables. In this example, the columns *Level* and *Text* are displayed:
```kusto
.create table Logs (Level:string, Text:string)
```
* `.show tables` - the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).


## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

[Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview) **Comment: None of the links in this section work, please provide new links, or should links be deleted?**  
[Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)  
[Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)  
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)  
[CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related articles

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Best practices for Kusto Query Language queries](best-practices.md)
