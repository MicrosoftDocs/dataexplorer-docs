---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language
> ## In This Article
> [Query statements](#query-statements)  
> [Kusto query](#kusto-query)   
> [Management commands](#management-commands)  
> [KQL in other services](#kql-in-other-services)  
> [Related content](#related-content)  

Kusto Query Language (KQL) is a powerful and intuitive tool for exploring data, detecting patterns, and performing statistical analyses. Designed for versatility, KQL enables seamless querying across various data types.

With a clear and intuitive syntax, KQL supports full-text search, time-series analyses, data aggregation, geospatial processing, and vector similarity search. It follows a structured schema like SQL, organizing data into databases, tables, and columns for efficient querying.

KQL follows a structured schema hierarchy similar to SQL, organizing data into databases, tables, and columns for efficient query execution.

This article provides an explanation of the query language and offers hands-on exercises to get you started writing queries. 

To access the query environment, visit the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). 
For a guided introduction to KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

## Query statements
A query is a request for data, typically composed of one or more statements separated by a semicolon (;).

There are three types of user query statements:

1. A [tabular expression statement](tabular-expression-statements.md)
1. A [let statement](let-statement.md)
1. A [set statement](set-statement.md)

The most common type is the tabular expression statements where both input and output are tables or tabular datasets. They use **operators** connected by a **pipe (|)** to filter and transform data step by step.

Think of it like a funnel: you start with a full data table, and each operator filters, rearranges, or summarizes the data as it flows through. Since operators process data sequentially, their order matters—it can impact both results and performance. At the end, you get a refined output.

>[!NOTE]
>For information about application query statements, see [Application query statements](statements.md#application-query-statements).

## Kusto query
Kusto queries help you analyze your data using simple, readable commands. Each query consists of one or more statements that process your data and return results. The straightforward syntax makes it easy to write queries manually or automate them in your applications.

Let's look at a simple Kusto query:
```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count 
```

|Count|
|-----|
|   28|

This query consists of a single tabular expression statement, starting with a reference to the StormEvents table. It includes several operators, where and count, connected by pipes. The data is first filtered by the StartTime column and then by the State column. Finally, the query returns a table with a single column and row, displaying the count of the remaining rows.  

>[!IMPORTANT]
> When writing KQL queries, remember that all elements are case-sensitive, including table names, table column names, operators, functions, and more. 
> Need to use a keyword as an identifier? Just wrap it in **brackets** and **quotes**.
>You can use either single or double quotes:
>**['where']** 
>**["where"]**

## Management commands
In contrast to Kusto queries, [Management commands](../management/index.md) are requests to Kusto to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns: **'Level'** and **'Text'**.

```kusto
.create table Logs (Level:string, Text:string)
```
Management commands have their own syntax, different from KQL syntax, although they share many similarities. The key difference is that management commands start with a dot (.) character, which can’t be used to start a query. This helps prevent security issues by making it impossible to embed management commands inside queries.

Not all management commands modify data or metadata. A large group of commands that starts with **.show** is used to display metadata or data. For example, the **.show tables** command returns a list of all tables in the current database.  
>[!NOTE]
>For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by many other Microsoft services. For detailed information on how KQL is used in these environments, refer to the following links:
* [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
* [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related content

* [Tytorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
