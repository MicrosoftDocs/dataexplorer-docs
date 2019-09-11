---
title: Kusto.WebExplorer - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.WebExplorer in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/09/2019
---
# Kusto.WebExplorer

## Introduction

Kusto.WebExplorer is a web application that can be used to send queries
and control commands to a Kusto service. The application is hosted at
[https://dataexplorer.azure.com/] and short-linked by [https://aka.ms/kwe].

Kusto.WebExplorer can also be hosted by other web portals in an HTML IFRAME.
(For example, this is done by the [Azure portal](https://portal.azure.com).)
See [Monaco IDE](../api/monaco/monaco-kusto.md) for details on how to host it
and the Monaco editor it uses.

## Connect to multiple clusters 

You can now connect multiple clusters and switch between databases and clusters.
The tool is designed to identify the cluster and database you are connected to easily.

![alt text](./Images/KustoTools-WebExplorer/AddingCluster.gif "AddingCluster")

## Recall Results

Often during analysis, we run multiple queries and may have to revisit the
results of the previous queries. You can use this feature to recall your results
without having to rerun the query. The data is served from local client-side cache.

![alt text](./Images/KustoTools-WebExplorer/RecallResults.gif "RecallResults")

## Enhanced results grid control

The table grid allows you to select multiple rows, columns, and cells. Computes
aggregates by selecting multiple cells (like Excel) and pivot the data.

![alt text](./Images/KustoTools-WebExplorer/EnhancedGrid.gif "EnhancedGrid")

## Intellisense & Formatting

You can use pretty-print format by using "Shift + Alt + F" shortcut key, code
folding (outlining), and IntelliSense.

![alt text](./Images/KustoTools-WebExplorer/Formating.gif "Formating")

## Deep linking

You can copy just the deep link or deep link and the query. You can also format
the URL to include the cluster, database, and query by using the following template:

`https://dataexplorer.azure.com/` [`clusters/` *Cluster* [`/databases/` *Database* [`?` *Options*]]]

The following options may be specified:

* `workspace=empty`: Indicates to create a new empty workspace (no recall of
  previous clusters, tabs, and queries will be done).



![alt text](./Images/KustoTools-WebExplorer/DeepLink.gif "DeepLink")

## Feedback

You can submit your feedback via the tool.
![alt text](./Images/KustoTools-WebExplorer/Feedback.gif "Feedback")