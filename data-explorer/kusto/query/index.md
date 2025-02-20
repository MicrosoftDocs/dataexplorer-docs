---
title:  Kusto Query Language (KQL) overview
description: Learn about how to use Kusto Query Language (KQL) to explore data, discover patterns, identify anomalies, and create statistical models.
ms.reviewer: alexans
ms.topic: reference
ms.custom: build-2023, build-2023-dataai
ms.date: 08/11/2024
adobe-target: true
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Kusto Query Language (KQL) overview

Kusto Query Language (KQL) is a powerful tool for exploring your data and discovering patterns, identifying anomalies and outliers, creating statistical modeling, and more.

KQL is a simple yet powerful language to query structured, semi-structured, and unstructured data. The language is expressive, easy to read and understand the query intent, and optimized for authoring experiences. Kusto Query Language is optimal for querying telemetry, metrics, and logs with deep support for text search and parsing, time-series operators and functions, analytics and aggregation, geospatial, vector similarity searches, and many other language constructs that provide the most optimal language for data analysis. The query uses schema entities that are organized in a hierarchy similar to SQLs: databases, tables, and columns.

::: moniker range="azure-data-explorer"
This article provides an explanation of the query language and offers practical exercises to get you started writing queries. To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).
::: moniker-end

::: moniker range="microsoft-fabric"
This article provides an explanation of the query language and offers practical exercises to get you started writing queries. To access the query environment, use the [KQL queryset](/fabric/real-time-intelligence/kusto-query-set). To learn how to use KQL, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).
::: moniker-end

::: moniker range="microsoft-sentinel"
Kusto Query Language is also the language you use to work with and manipulate data in Microsoft Sentinel. The logs you feed into your workspace aren't worth much if you can't analyze them and get the important information hidden in all that data. Kusto Query Language has not only the power and flexibility to get that information, but the simplicity to help you get started quickly. If you have a background in scripting or working with databases, much the content of this article should feel familiar. If not, don't worry, as the intuitive nature of the language quickly enables you to start writing your own queries and driving value for your organization.

This article introduces the basics of Kusto Query Language, covering some of the most used functions and operators, which should address 75 to 80 percent of the queries users write day to day. When you need more depth, or to run more advanced queries, you can take advantage of the [Advanced KQL for Microsoft Sentinel workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766).

## Why Kusto Query Language for Microsoft Sentinel?

Microsoft Sentinel is built on top of the Azure Monitor service and it uses Azure Monitor’s [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) workspaces to store all of its data. This data includes any of the following:

* data ingested from external sources into predefined tables using Microsoft Sentinel data connectors.
* data ingested from external sources into user-defined custom tables, using custom-created data connectors and some types of out-of-the-box connectors.
* data created by Microsoft Sentinel itself, resulting from the analyses it creates and performs - for example, alerts, incidents, and UEBA-related information.
* data uploaded to Microsoft Sentinel to assist with detection and analysis - for example, threat intelligence feeds and watchlists.

Kusto Query Language was developed as part of the [Azure Data Explorer](/azure/data-explorer/) service, and it’s therefore optimized for searching through big-data stores in a cloud environment. It’s designed to help you dive deep into your of data and explore their hidden treasures.

Kusto Query Language is also used in Azure Monitor, and supports extra Azure Monitor features that allow you to retrieve, visualize, analyze, and parse data in Log Analytics data stores. In Microsoft Sentinel, you're using tools based on Kusto Query Language whenever you’re visualizing and analyzing data and hunting for threats, whether in existing rules and workbooks, or in building your own.

Because Kusto Query Language is a part of nearly everything you do in Microsoft Sentinel, a clear understanding of how it works helps you get that more out of your SIEM.
::: moniker-end

## What is a Kusto query?

A Kusto query is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. Kusto queries are made of one or more query statements.

A Kusto Query Language query is a read-only request to process data and return results – it doesn’t write any data. Queries operate on data that's organized into a hierarchy of [databases](schema-entities/databases.md), [tables](schema-entities/tables.md), and [columns](schema-entities/columns.md), similar to SQL.

Requests are stated in plain language and use a data-flow model designed to make the syntax easy to read, write, and automate.

## What is a query statement?

There are three kinds of user [query statements](statements.md):

* A [tabular expression statement](tabular-expression-statements.md)
* A [let statement](let-statement.md)
* A [set statement](set-statement.md) <!--is this supported in Sentinel?-->

All query statements are separated by a `;` (semicolon), and only affect the query at hand.

>[!NOTE]
> For information about application query statements, see [Application query statements](statements.md#application-query-statements).

The most common kind of query statement is a tabular expression **statement**, which means both its input and output consist of tables or tabular datasets. Tabular statements contain zero or more **operators**, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a `|` (pipe). Data flows, or is piped, from one operator to the next. The data is filtered or manipulated at each step and then fed into the following step.

It's like a funnel, where you start out with an entire data table. Each time the data passes through another operator, it's filtered, rearranged, or summarized. Because the piping of information from one operator to another is sequential, the query operator order is important, and can affect both results and performance. At the end of the funnel, you're left with a refined output.

Let's look at an example query.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "FLORIDA"
| count
```

|Count|
|-----|
|   28|

> [!NOTE]
> KQL is case-sensitive for everything – table names, table column names, operators, functions, and so on.
> Keywords can be used as identifiers by enclosing them in brackets and quotes (`['` and `']` or `["` and `"]`). For example, `['where']`. For more information, see [Identifier naming rules](/kusto/query/schema-entities/entity-names?view=azure-data-explorer&preserve-view=true#identifier-naming-rules)

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains several operators, [`where`](where-operator.md) and [`count`](count-operator.md), each separated by a pipe. The data rows for the source table are filtered by the value of the *StartTime* column and then filtered by the value of the *State* column. In the last line, the query returns a table with a single column and a single row containing the count of the remaining rows.

To try out some more Kusto queries, see [Tutorial: Write Kusto queries](tutorials/learn-common-operators.md).

## Management commands

In contrast to Kusto queries, [Management commands](../management/index.md) are requests to Kusto to process or modify data or metadata. For example, the following management command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, which isn't part of the Kusto Query Language syntax, although the two share many concepts. In particular, management commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which can't start a query).
This distinction prevents many kinds of security attacks, simply because it prevents embedding management commands inside queries.

Not all management commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management commands overview](../management/index.md).

## KQL in other services

KQL is used by many other Microsoft services. For specific information on the use of KQL in these environments, refer to the following links:

* [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
* [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related content

* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [KQL quick reference](kql-quick-reference.md)
* [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
* [Query best practices](best-practices.md)
