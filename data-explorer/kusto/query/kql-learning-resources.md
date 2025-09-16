---
title: Kusto Query Language Learning Resources
description: Learn KQL from scratch with curated resources, including tutorials, demos, and training programs for data analysts and professionals.
ms.reviewer: alexans
ms.topic: concept-article
ms.date: 09/15/2025
#customerIntent: As a data analyst, I want to access various learning resources for Kusto Query Language (KQL), so that I can effectively explore and analyze data using KQL.
---

# Kusto Query Language learning resources

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Use Kusto Query Language (KQL) to explore your data, discover patterns, identify anomalies and outliers, build statistical models, and more. New to KQL or want to improve your skills? Use the following learning resources.

For more information, see [KQL overview](index.md).

:::moniker range="microsoft-sentinel || azure-monitor"

## Demo environment

Practice Kusto Query Language statements in the [Log Analytics demo environment](https://aka.ms/lademo) in the Azure portal. It's free, but you need an Azure account.

Like your production Log Analytics workspace, the demo environment lets you:

* **Choose a table on which to build a query.** From the **Tables** tab, select a table from the list grouped by topic. Expand a topic to see its tables. Expand a table to see its fields (columns). Double-click a table or field name to insert it at the cursor in the query window. Type the rest of the query after the table name.

* **Find an existing query to study or modify.** Select the **Queries** tab to see the list of queries available by default. Alternatively, select **Queries** from the button bar. Double-click a query to insert it at the cursor in the query window.

::: moniker-end

::: moniker range="microsoft-sentinel"

As in the demo environment, query and filter data on the Microsoft Sentinel **Logs** page. Select a table and drill down to see its columns. Use the **Column chooser** to modify the default columns, and set the default time range for queries. If the time range is explicitly defined in the query, the time filter is unavailable (grayed out).

If Microsoft Sentinel is [onboarded to the Defender portal](/azure/sentinel/microsoft-sentinel-defender-portal), query and filter data on the Microsoft Defender **Advanced hunting** page. For more information, see [Advanced hunting with Microsoft Sentinel data in Microsoft Defender portal](/defender-xdr/advanced-hunting-microsoft-defender?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json&branch=main).

::: moniker-end

## KQL training

Learn more about KQL:

* [Pluralsight: KQL from scratch](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch)
* [Kusto Detective Agency](https://detective.kusto.io/)
* [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
* [Tutorial: Join data from multiple tables](tutorials/join-data-from-multiple-tables.md)
* [Cloud Academy: Introduction to Kusto Query Language](https://cloudacademy.com/lab/introduction-to-kusto-query-language/)

::: moniker range="azure-data-explorer"

## Azure Data Explorer

For more information about KQL in Azure Data Explorer, see:

* [Tutorial: Create geospatial visualizations](tutorials/create-geospatial-visualizations.md)
* [Data analysis in Azure Data Explorer with Kusto Query Language](/training/paths/data-analysis-data-explorer-kusto-query-language/)
* [Free Pluralsight training: Azure Data Explorer](https://www.pluralsight.com/partners/microsoft/azure-data-explorer)
::: moniker-end

::: moniker range="microsoft-fabric"

## Microsoft Fabric

For more information about KQL in Microsoft Fabric, see [Get started with Real-Time Analytics in Microsoft Fabric](/training/modules/get-started-kusto-fabric/).
::: moniker-end

::: moniker range="azure-monitor"

## Azure Monitor

For more information about KQL in Azure Monitor, see:

* [Tutorial: Detect and analyze anomalies using KQL in Azure Monitor](/azure/azure-monitor/logs/kql-machine-learning-azure-monitor)
* [Analyze monitoring data with Kusto Query Language](/training/paths/analyze-monitoring-data-with-kql/)
* [Koenig: KQL for Azure Admins](https://www.koenig-solutions.com/kql-azure-admins-training)
::: moniker-end

::: moniker range="microsoft-sentinel"

## Microsoft Sentinel

For more information about KQL in Microsoft Sentinel, see:

* [Must learn KQL](https://github.com/rod-trent/MustLearnKQL)
* [Udemy: Learn KQL for Microsoft Sentinel](https://www.udemy.com/course/learn-kql-for-microsoft-sentinel/)
* [SC-200: Create queries for Microsoft Sentinel using Kusto Query Language (KQL)](/training/paths/sc-200-utilize-kql-for-azure-sentinel/)
* [Infosec Train: Kusto Query Language (KQL) eLearning Training Program Online](https://www.infosectrain.com/self-paced-learning/kusto-query-language-training/)
::: moniker-end
