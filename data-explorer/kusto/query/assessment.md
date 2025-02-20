---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
This article provides an explanation of the query language and offers practical exercises to get you started writing queries. To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

# Introduction to Kusto Query Language (KQL)

Kusto Query Language is a powerful tool for data exploration, pattern discovery, and statistical analysis. It's designed to efficiently query various types of data, with particular strength in handling telemetry, metrics, and logs. The language is expressively designed to be both readable and optimized for performance.

## Core Features

- Deep support for text search and parsing

- Time-series operators and functions

- Analytics and aggregation capabilities

- Geospatial analysis functions

- Vector similarity searches

- Optimized data analysis constructs

# Query Structure and Operation
## Basic Query Components
A Kusto query is a read-only request that processes data and returns results. Queries consist of one or more statements, written in plain text using a data-flow model.

## Types of Query Statements
There are three kinds of user [query statements](statements.md):

1. A [tabular expression statement](tabular-expression-statements.md)
2. A [let statement](let-statement.md)
3. A [set statement](set-statement.md)
All statements are separated by semicolons (;) and affect only the current query.

## The Pipeline Model
KQL operates like a funnel, where data flows through operators sequentially. Each operator:

- Filters

- Rearranges

- Summarizes the data

It's like a funnel, where you start out with an an entire data table. Each time the data passes through another operator, it's filtered, rearranged, or summarized. Because the piping of information from one operator to another is sequential, the query operator order is important, and can affect both results and performance. At the end of the funnel, you're left with a refined output.

## Query Example

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

All query statements are separated by a `;` (semicolon), and only affect the query at hand.
For information about application query statements, see [Application query statements](statements.md#application-query-statements).

## Important Note
KQL is case-sensitive for all elements:

- Table names

- Column names

- Operators

- Functions

## Management Commands
Management commands in KQL are distinguished by starting with a dot (.) character. For example:
```kusto
.create table Logs (Level:string, Text:string)
```
## Purpose of Management Commands

- Modify data or metadata
- Display information (commands starting with .show)
- Handle administrative tasks

##  Security Feature
The dot prefix distinction prevents security attacks by ensuring management commands cannot be embedded within regular queries.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

[Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
[Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
[Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
[CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related stuff

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
