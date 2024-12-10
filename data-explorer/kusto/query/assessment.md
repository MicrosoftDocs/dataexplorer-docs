---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language (KQL) introduction

Kusto Query Language (KQL) is a powerful tool for exploring your data, uncovering patterns, identifying anomalies and outliers, creating statistical models, and more.
KQL is a versatile language that allows you to query all types of data structures effectively. The language is expressive and straightforward, making queries easy to read, author, and understand.

This article helps you begin to unlock your data by offering an introduction to KQL, as well as resources to help you start writing valuable queries. 

## What is a Kusto query?
A Kusto query is a read-only request to process data and return results. The request appears in plain text, using a highly accessible data format. Any Kusto query is made of one or more query statements, each separated by a semicolon (`;`).

> [!NOTE]
> KQL is case-sensitive for all inputs, including table names, table column names, operators, functions, and so on.


### What are query statements?
Query statements break down into two categories:
- Statements primarily used by users ([user query statements](https://learn.microsoft.com/en-us/kusto/query/statements?view=azure-data-explorer#user-query-statements))
- Statements designed to support scenarios in which mid-tier applications modify user queries and send them to Kusto ([application query statements](https://learn.microsoft.com/en-us/kusto/query/statements?view=azure-data-explorer#application-query-statements)).

This article will focus only on types of user query statements.

### Kinds of user query statements
There are three kinds of user [query statements](statements.md):

1. A [tabular expression statement](tabular-expression-statements.md)
1. A [let statement](let-statement.md)
1. A [set statement](set-statement.md)

> [!NOTE]
> All KQL queries require at least one tabular expression statement.

### Parameters by query statement type
Each type of user query statement has its own distinct syntax and set of parameters.

#### Tabular expresssion statements

|Name|Type|Required|Description|
|--|--|--|--|
|*Source*| `string` | :heavy_check_mark:|A tabular data source. See [Tabular data sources](#tabular-data-sources).|
|*Operator*| `string` | :heavy_check_mark:|Tabular data operators, such as filters and projections.|
|*RenderInstruction*| `string` ||Rendering operators or instructions.|

#### Let statements

#### Set statements

| Name | Type | Required | Description |
|--|--|--|--|
| *OptionName* | `string` |  :heavy_check_mark: | The name of the request property.|
| *OptionValue* | |  :heavy_check_mark: | The value of the request property.|

## Access the query environment
To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).


It's like a funnel, where you start out with an an entire data table. Each time the data passes through another operator, it's filtered, rearranged, or summarized. Because the piping of information from one operator to another is sequential, the query operator order is important, and can affect both results and performance. At the end of the funnel, you're left with a refined output.

## Example
The following query counts the number of records in the `StormEvents` table whose `StartTime` is between January 11-12, 2007 and which have a value of `Florida` in the `State` column.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "Florida"  
| count 
```
The query returned a result of 28 records meeting the requested criteria:
|Count|
|-----|
|   28|


## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

[Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
[Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
[Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
[CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## References and tutorials

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
* [About management commands](../management/index.md)
