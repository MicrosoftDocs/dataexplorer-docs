---
title: Kusto Query Language learning resources
description: This article provides a list of various learning resources to help you ramp up on Kusto Query Language (KQL) effectively.
ms.reviewer: alexans
ms.topic: concept-article
ms.date: 08/11/2024
#customerIntent: As a data analyst, I want to access various learning resources for Kusto Query Language (KQL), so that I can effectively explore and analyze data using KQL.
---
# Kusto Query Language learning resources

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Kusto Query Language (KQL) is a powerful tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and more. Are you new to KQL or want to improve your KQL skills? Take a look at the following learning resources.

For more information on KQL, see [KQL overview](index.md).

::: moniker range="microsoft-sentinel || azure-monitor"

## Demo environment

You can practice Kusto Query Language statements in a [Log Analytics demo environment](https://aka.ms/lademo) in the Azure portal. There's no charge to use this practice environment, but you do need an Azure account to access it.

Like Log Analytics in your production environment, it can be used in many ways:

* **Choose a table on which to build a query.** From the default **Tables** tab (shown in the red rectangle at the upper left), select a table from the list of tables grouped by topics (shown at the lower left). Expand the topics to see the individual tables, and you can further expand each table to see all its fields (columns). Double-clicking on a table or a field name places it at the point of the cursor in the query window. Type the rest of your query following the table name, as directed below.

* **Find an existing query to study or modify.** Select the **Queries** tab (shown in the red rectangle at the upper left) to see a list of queries available out-of-the-box. Or, select **Queries** from the button bar at the top right.

    ::: moniker-end

    ::: moniker range="microsoft-sentinel"

    You can explore the queries that come with Microsoft Sentinel out-of-the-box. Double-clicking a query places the whole query in the query window at the point of the cursor.

Like in this demo environment, you can query and filter data in the Microsoft Sentinel **Logs** page. You can select a table and drill down to see columns. You can modify the default columns shown using the **Column chooser**, and you can set the default time range for queries. If the time range is explicitly defined in the query, the time filter is unavailable (grayed out).

If you're onboarded to [Microsoft's unified security operations platform](/azure/sentinel/microsoft-sentinel-defender-portal), you can also query and filter data in the Microsoft Defender **Advanced hunting** page. For more information, see [Advanced hunting with Microsoft Sentinel data in Microsoft Defender portal](/defender-xdr/advanced-hunting-microsoft-defender?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json&branch=main).

::: moniker-end

## General training

For general information about KQL, see:

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
