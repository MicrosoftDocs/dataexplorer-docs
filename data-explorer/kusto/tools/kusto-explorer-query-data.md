---
title: Query data in Kusto.Explorer
description: Learn how to query data in Kusto.Explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/13/2020
---

# Query mode

Kusto.Explorer includes a powerful script mode that enables you to write, edit, and run ad-hoc queries. The script mode comes with syntax highlighting and IntelliSense, so you can quickly ramp-up your knowledge of the Kusto Query Language.

This document describes how to run basic queries in Kusto.Explorer and how to add parameters to your queries.

## Basic Queries

If you have table Logs, you can start exploring them:

<!-- csl: https://help.kusto.windows.net:443/Samples -->

```kusto
StormEvents | count 
```

When your cursor is on this line, it's colored gray. Press **F5** to run the query. 

Here are some more example queries:

<!-- csl: https://help.kusto.windows.net:443/Samples -->

```kusto
// Take 10 lines from the table. Useful to get familiar with the data
StormEvents | limit 10 
```

<!-- csl: https://help.kusto.windows.net:443/Samples -->

```kusto
// Filter by EventType == 'Flood' and State == 'California' (=~ means case insensitive) 
// and take sample of 10 lines
StormEvents 
| where EventType == 'Flood' and State =~ 'California'
| limit 10
```

[![](./Images/kusto-explorer-query-data/basic-query.png "Basic query")](./Images/kusto-explorer-query-data/basic-query.png#lightbox)

Learn more about [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

## Client-side query parameterization

> [!Note]
> There are two types of query parametrization techniques in Kusto:
> * [Language-integrated query parametrization](../query/queryparametersstatement.md) is implemented as part
> of the query engine and is meant to be used by applications that query the service programmatically. This method is not described in this document.
>
> * Client-side query parametrization, described below, is a feature of the Kusto.Explorer application only. It's equivalent to using string-replace operations on the queries before sending them to be executed by the service. The syntax described below is not part of the query language itself and can't be used when sending queries to the service by means other than Kusto.Explorer.

If you use the same value in multiple queries or in multiple tabs, it's highly inconvenient to change that value in every place it's used. That's why Kusto.Explorer supports query parameters. Query parameters are shared among tabs so that they can be easily reused. Parameters are denoted by {} brackets. For example: `{parameter1}`

The script editor highlights query parameters:

![Parameterized query](./Images/kusto-explorer-query-data/parametrized-query-1.png "parametrized-query-1")

You can easily define and edit existing query parameters:

![Edit parameterized queryt](./Images/kusto-explorer-query-data/parametrized-query-2.png "parametrized-query-2")

![Edit parameterized query](./Images/kusto-explorer-query-data/parametrized-query-3.png "parametrized-query-3")

The script editor also has IntelliSense for query parameters that are already defined:

![Parameterized query IntelliSense](./Images/kusto-explorer-query-data/parametrized-query-4.png "parametrized-query-4")

You can have multiple sets of parameters (listed in the **Parameters Set** combo box).
Select **Add new** or **Delete current** to manipulate the list of parameter sets.

![List of parameter sets](./Images/kusto-explorer-query-data/parametrized-query-5.png "parametrized-query-5")

## Next steps

* Learn about the [searching data in Kusto.Explorer](kusto-explorer-search-mode.md)
* Learn about [querying data in Kusto.Explorer from the command line](kusto-explorer-command-line.md)
* Learn about [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)
