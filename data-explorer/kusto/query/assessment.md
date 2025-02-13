---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language

The Kusto Query Language (KQL) is a powerful tool to explore different kinds of data and discover patterns, identify anomalies and outliers, create statistical modeling, etc. KQL is expressive, easy to read, makes it easy for you to understand the query’s intent and and is optimized for authoring.

 
Kusto Query Language is optimal for querying telemetry, metrics, and logs. It has extensive support for text search and parsing, time-series operators and functions, analytics and aggregation, geospatial searches, and vector similarity searches. KQL, as we many other language constructs in order to provide the most optimal language for data analysis. Kusto queries use schema entities that are organized in a hierarchy similar to SQLs, specifically: databases, tables, and columns.  

This article provides an explanation of the Kusto Query Language and offers practical exercises to get you started writing queries. To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md). To access the actual query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).  

## Tabular expression statements

The most common kind of query statement is a *tabular expression statement*. In these statements, both inputs and outputs consist of tables or tabular datasets, tabular data and sometimes rendering operators and. In addition, Tabular expression statements contain zero or more operators; the statements start with a tabular input and return a tabular output. Operators are sequenced by a | (pipe); data is piped (meaning “flows”) from one operator to the next in the sequence written within the statement. The data is filtered or manipulated at each step and is then fed to the next step in the sequence.  

A **Kusto** query is a *read-only* request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. Kusto queries are made of one or more query statements.  

## Query statements

There are three kinds of user [query statements](https://learn.microsoft.com/en-us/kusto/query/statements?view=microsoft-fabric):

1. [tabular expression statements](https://learn.microsoft.com/en-us/kusto/query/tabular-expression-statements?view=microsoft-fabric)
1. [let statements](https://learn.microsoft.com/en-us/kusto/query/let-statement?view=microsoft-fabric)
1. [set statements](https://learn.microsoft.com/en-us/kusto/query/set-statement?view=microsoft-fabric)

Query statements are separated from each other by a semicolon( ; ) and affect only the query at hand. For more information about application query statements, see [Application query statements](statements.md#application-query-statements).  

Query statements resemble a funnel in that they begin with an entire data table. Each time the data passes through an operator, it is filtered, rearranged, or summarized. Because the information is piped from one operator to another in sequential order, the operator order within the query is important, and affects both results and performance. At the end of the sequence (funnel), you are left with a refined output. See the short example query, below.  

## Kusto example query  

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

**Note:** The Kusto Query Language is case-sensitive for everything including table names, table column names, operators, functions, and so on.

The example query above has a single tabular expression statement. The statement begins with a reference to a table called StormEvents and contains the operators where and count which are separated by a pipe. The data rows of the source table are filtered by the value of the StartTime column and are then filtered by the value in the State column. The last line of the query returns a single column, single row table containing the count (number) of remaining rows.  


## Management commands  

[Management commands](https://learn.microsoft.com/pdf?url=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fkusto%2Ftoc.json%3Fview%3Dmicrosoft-fabric#D703-) share many concepts with Kusto queries but are slightly different with their own syntax which is not part of the Kusto Query Language syntax. They are requests to Kusto to process or modify data or metadata.  

Management commands are distinguished from queries by having the first character in the text of the command be the dot character (.) which is unable to start a query. This distinction prevents many kinds of security attacks because it prevents embedding management commands inside queries.  

Not all management commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data, for example, the `.show tables` command which returns a list of all tables in the current database.  

In another example, the management command below creates a new Kusto table with two columns: `Level` and `Number`:  


### Example - Management command  

```
kusto
.create table Logs (Level:string, Text:string)
```

For more information about management commands, see [Management commands overview](https://learn.microsoft.com/en-us/kusto/management/?view=microsoft-fabric).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

* [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
* [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related stuff

* [Tytorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
