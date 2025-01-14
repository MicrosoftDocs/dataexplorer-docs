---
title:  Writing Assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 01/14/2025
---
# Kusto Query Language (KQL) introduction

Kusto Query Language (KQL) is a powerful tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and more. 
KQL is a simple yet dynamic language to query structured, semi-structured, and unstructured data. The language is expressive, easy to read and understand the query intent, and optimized for authoring experiences. Kusto Query Language is optimal for querying telemetry, metrics, and logs with deep support for text search and parsing, time-series operators and functions, analytics and aggregation, geospatial, vector similarity searches, and many other language constructs that provide the most optimal language for data analysis. The query uses schema entities that are organized in a hierarchy similar to SQLs: databases, tables, and columns.

This article provides an explanation of the query language and offers practical exercises to get you started writing queries. To access the query environment, use the [KQL queryset](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/kusto-query-set). To learn how to use KQL, see [Tutorial: Learn common operators](https://learn.microsoft.com/en-us/kusto/query/tutorials/learn-common-operators?view=microsoft-fabric).

## What is a Kusto query?

A Kusto query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. Kusto queries are made of one or more query statements.

## About Kusto query statements

There are three kinds of user [query statements](https://learn.microsoft.com/en-us/kusto/query/statements?view=microsoft-fabric):

1. A [tabular expression statement](https://learn.microsoft.com/en-us/kusto/query/tabular-expression-statements?view=microsoft-fabric)
1. A [let statement](https://learn.microsoft.com/en-us/kusto/query/let-statement?view=microsoft-fabric)
1. A [set statement](https://learn.microsoft.com/en-us/kusto/query/set-statement?view=microsoft-fabric)

All query statements are separated by a `;` (semicolon), and only affect the query at hand.

[!NOTE]
For information about application query statements, see [Application query statements](https://learn.microsoft.com/en-us/kusto/query/statements?view=microsoft-fabric#application-query-statements).

The most common kind of query statement is a tabular expression **statement**, which means both its input and output consist of tables or tabular datasets. Tabular statements contain zero or more **operators**, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a `|` (pipe). Data flows, or is piped, from one operator to the next. The data is filtered or manipulated at each step and then fed into the following step.

It's like a funnel, where you start out with an an entire data table. Each time the data passes through another operator, it's filtered, rearranged, or summarized. Because the piping of information from one operator to another is sequential, the query operator order is important, and can affect both results and performance. At the end of the funnel, you're left with a refined output.

Let's look at an example query.

```Kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "Florida"  
| count 
```

|Count|
|-----|
|   28|

[!NOTE]
KQL is case-sensitive for everything – table names, table column names, operators, functions, and so on.
Keywords can be used as identifiers by enclosing them in brackets and quotes ([' and '] or [" and "]). For example, ['where']. For more information, see [Identifier naming rules](https://learn.microsoft.com/en-us/kusto/query/schema-entities/entity-names?view=azure-data-explorer&preserve-view=true#identifier-naming-rules)

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains operators, [where](https://learn.microsoft.com/en-us/kusto/query/where-operator?view=microsoft-fabric) and [count](https://learn.microsoft.com/en-us/kusto/query/count-operator?view=microsoft-fabric), each separated by a pipe. The data rows for the source table are filtered by the value of the *StartTime* column and then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the count of the remaining rows.

To try out more Kusto queries, see [Tutorial: Write Kusto queries](https://learn.microsoft.com/en-us/kusto/query/tutorials/learn-common-operators?view=microsoft-fabric).

## Management commands

In contrast to Kusto queries, [Management commands](https://learn.microsoft.com/en-us/kusto/management/?view=microsoft-fabric) are requests to Kusto to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns, `Level` and `Text`:

```Kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, which isn't part of the Kusto Query Language syntax (although the two share many concepts). In particular, management commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which can't start a query). This distinction stops many kinds of security attacks, because it prevents embedding management commands inside queries.

Not all management commands modify data or metadata. Commands that start with `.show` only display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](https://learn.microsoft.com/en-us/kusto/management/?view=microsoft-fabric).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

[Log queries in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview)
[Kusto Query Language in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/kusto-overview)
[Understanding the Azure Resource Graph query language](https://learn.microsoft.com/en-us/azure/governance/resource-graph/concepts/query-language)
[Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-overview)
[CMPivot queries](https://learn.microsoft.com/en-us/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related content

* [Tytorial: Learn common operators](https://learn.microsoft.com/en-us/kusto/query/tutorials/learn-common-operators?view=microsoft-fabric)
* [Tutorial: Use aggregation functions](https://learn.microsoft.com/en-us/kusto/query/tutorials/use-aggregation-functions?view=microsoft-fabric)
* [KQL quick reference](https://learn.microsoft.com/en-us/kusto/query/kql-quick-reference?view=microsoft-fabric)
* [SQL to Kusto Query Language cheat sheet](https://learn.microsoft.com/en-us/kusto/query/sql-cheat-sheet?view=microsoft-fabric)
* [Query best practices](https://learn.microsoft.com/en-us/kusto/query/best-practices?view=microsoft-fabric)
