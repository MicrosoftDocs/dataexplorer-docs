---
title: Azure Data Explorer tools - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Explorer tools in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
---
# Azure Data Explorer tools

## Ad-hoc query tools


* [Kusto.Explorer](./kusto-explorer.md) - The primary desktop tool for querying and controlling Kusto
* [Web UI](../../web-query-data.md) - Web UI for querying Kusto

## Visualizations, dashboards, and reporting tools


* [Azure Notebooks](../../azure-notebooks.md) - use Azure Notebooks to analyze data in Azure Data Explorer.
* Excel
    * [Excel blank query](../../excel-blank-query.md) - Add Kusto query as Excel data source
    * [Excel connector](../../excel-connector.md) - an Excel connector for Azure Data Explorer 

* PowerBI

   * [PowerBI best practices](../../power-bi-best-practices.md)
   * [PowerBI Connector](../../power-bi-connector.md)
   * [PowerBI imported query](../../power-bi-imported-query.md) 
   * [PowerBI SQL query](../../power-bi-sql-query.md)

* [Grafana](../../grafana.md)

## Orchestration tools


* Microsoft Flow
    * [Microsoft Flow connector](../../flow.md)
    * [Microsoft Flow connector usage examples](../../flow-usage.md)
* [Microsoft Logic App](./logicapps.md) - Execute Kusto queries automatically as part of [Microsoft Logic App](https://docs.microsoft.com/azure/logic-apps/logic-apps-what-are-logic-apps)



## Data ingestion tools


* [LightIngest](../../lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
 



## Source control integration tools

* [Azure Pipelines](../../devops.md) - Invokes control commands as part of your pipeline
* [Sync Kusto](./synckusto.md) - Sync Kusto stored functions to/from Git
