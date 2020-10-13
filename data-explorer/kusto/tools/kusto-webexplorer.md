---
title: Kusto.WebExplorer - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.WebExplorer in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/24/2020
---
# Kusto.WebExplorer

Kusto.WebExplorer is a web application that can be used to send queries
and control commands to a Kusto service. The application is hosted at
https://dataexplorer.azure.com/ and short-linked by https://aka.ms/kwe.



Kusto.WebExplorer can also be hosted by other web portals in an HTML IFRAME.
(For example, this is done by the [Azure portal](https://portal.azure.com).)
See [Monaco IDE](../api/monaco/monaco-kusto.md) for details on how to host it
and the Monaco editor it uses.

## Connect to multiple clusters

You can now connect multiple clusters and switch between databases and clusters.
The tool is designed to easily identify the cluster and database to which you are connected.

![Animated GIF. When Add Cluster is clicked in Azure Data Explorer and a cluster name is entered in a dialog box, the cluster appears in the left pane.](./Images/KustoTools-WebExplorer/AddingCluster.gif "AddingCluster")

## Recall results

Often during analysis, we run multiple queries and may have to revisit the
results of the previous queries. You can use this feature to recall your results
without having to rerun the query. The data is served from local client-side cache.

![Animated GIF. After two Azure Data Explorer queries run, the mouse moves to the first query and Recall is clicked. The initial results appear again.](./Images/KustoTools-WebExplorer/RecallResults.gif "RecallResults")

## Enhanced results grid control

The table grid allows you to select multiple rows, columns, and cells. Compute
aggregates by selecting multiple cells (like Excel) and pivot the data.

![Animated GIF. After Pivot Mode is turned on in Azure Data Explorer and columns are dragged to pivot table target areas, the summarized data appears.](./Images/KustoTools-WebExplorer/EnhancedGrid.gif "EnhancedGrid")

## Intellisense & Formatting

You can use pretty-print format by using the "Shift + Alt + F" shortcut key, code
folding (outlining), and IntelliSense.

![Animated GIF showing an Azure Data Explorer query. After the query is expanded, it changes format, appearing on one line, with pink column names.](./Images/KustoTools-WebExplorer/Formating.gif "Formating")

## Deep linking

You can copy just the deep link or deep link and the query. You can also format
the URL to include the cluster, database, and query by using the following template:

`https://dataexplorer.azure.com/` [`clusters/` *Cluster* [`/databases/` *Database* [`?` *Options*]]]

The following options may be specified:

* `workspace=empty`: Indicates to create a new empty workspace (no recall of
  previous clusters, tabs, and queries will be done).



![Animated GIF. The Azure Data Explorer Share menu opens. The Query link to clipboard item becomes visible, as does the Text and link to clipboard item.](./Images/KustoTools-WebExplorer/DeepLink.gif "DeepLink")

## How to provide feedback

You can submit your feedback via the tool.
![Animated GIF showing Azure Data Explorer. When the Feedback icon is clicked, the Send us feedback dialog box opens.](./Images/KustoTools-WebExplorer/Feedback.gif "Feedback")
