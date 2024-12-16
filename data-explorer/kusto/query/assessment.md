---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language

Kusto Query Language (KQL) is a powerful tool used to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, etc. 
KQL language is expressive, easy to read and to understand, and is optimized for authoring experiences. KQL provides optimal language for data analysis. This includes querying telemetry, metrics and logs with deep support for text search and parsing. Other features include time series operators and functions, analytics and aggregation, geospatioal vector similarity searches, and other language constucts. The KQL query uses schema entities organized in a hierarchy similar to SQLs that include databases, tables, and columns.

This article provides an explanation of the KQL query language, and offers practical exercises for you to begin writing queries. To access the KQL query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

A tabular expression **statement** is a common KQL query statement where both the input and output consists of tables or tabular datasets. Tabular statements contain zero or more **operators**, that starts with a tabular input and returns a tabular output. Operators are sequenced by a `|` (pipe or vertical bar). Data flows are "piped' between operators, data is filtered or manipulated at each step, and then fed into the next step.

A KQL query is a read-only request to process data and return results. The KQL request is expressed in plain text using a data-flow model that is easy to read, author, and automate. KQL queries contain one or more query statements, and KQL query components (table names, operators, functions, etc.) are case-sensitive.

The following are user [query statement types](statements.md):

1. [Tabular expression](tabular-expression-statements.md)
1. [Let statement](let-statement.md)
1. [Set statement](set-statement.md)
<NOTETO REVIEWERS: THE ABOVE LIST SHOULD BE BULLETED.>

All query statement types are separated by a `;` (semicolon), and only affect the stated query.

For information about application query statements, see [Application query statements](statements.md#application-query-statements).


A KQL query is similar to a funnel, where you begin with an an entire data table, and the data is filtered, rearranged or summarized each time the data passes through another operator. Because the piping of information from one operator to another is sequential, the query operator order is important and can affect both results and performance. The result is a refined output at the terminal end of the funnel.

## KQL examples

The following is an example that describes a KQL query:
<NOTE TO REVIWERS: THIS IS BEYOND MY SKILLSET AND MUST BE VERIFIED BY AN SME FOR TECHNICAL CORRECTNESS>
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


This KQL query example contains a single tabular expression statement that begins with a reference to a table called *StormEvents* and contains several operators, [`where`](where-operator.md) and [`count`](count-operator.md), each separated by a pipe. 
Source table data rows are filtered by the *StartTime*, and then by the *State* column values.
The query returns a table with a single column and a single row containing the remaining rows count.


In contrast to KQL queries, [Management commands](../management/index.md) are requests to KQL to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax that differs from KQL syntax, although they share many concepts. Management commands have a period (`.`) character as the first character in the command text, which cannot start a query. This helps prevent many types of security attacks as it blocks embedding management commands inside of queries.


For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, see the following:

[Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
[Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
[Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
[CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)
<NOTE TO REVIEWERS: THE ABOVE REFERENCED LIST SHOULD BE BULLETED>

## Related content

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference guide](kql-quick-reference.md)
* [SQL cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
