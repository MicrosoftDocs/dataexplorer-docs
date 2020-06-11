---
title: Azure Data Explorer tools - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Explorer tools in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/01/2020
---
# Azure Data Explorer tools overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers different tools and connectors to do data ingestion, queries, visualize data, automate tasks, control schema entities, or integrate with other services.

## Ad hoc query tools

A Kusto query is a read-only request to process data on Azure Data Explorer and return results. There are several tools available for running queries in Azure Data Explorer:

* Kusto.Explorer
   * [Kusto.Explorer installation and user interface](./kusto-explorer.md) - The primary desktop tool for querying and controlling Kusto
   * [Using Kusto.Explorer](./kusto-explorer-using.md)
   * [Kusto.Explorer troubleshooting](kusto-explorer-troubleshooting.md)
* [Web UI](../../web-query-data.md) - Web UI for querying Kusto

## Visualizations, dashboards, and reporting tools

The [visualization overview](../../viz-overview.md) covers detailed information about data visualization and reporting options. Data visualization and reporting is a critical step in the data analytics process.  Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. Choose from one of the many BI services to best fit your scenario and budget.

* [Azure Notebooks](../../azure-notebooks.md) - use Azure Notebooks to analyze data in Azure Data Explorer.
* Excel
    * [Excel blank query](../../excel-blank-query.md) - Add Kusto query as Excel data source
    * [Excel connector](../../excel-connector.md) - an Excel connector for Azure Data Explorer 

* Power BI
   * [Power BI best practices](../../power-bi-best-practices.md)
   * [Power BI Connector](../../power-bi-connector.md)
   * [Power BI imported query](../../power-bi-imported-query.md) 
   * [Power BI SQL query](../../power-bi-sql-query.md)

* [Grafana](../../grafana.md)
* [K2Bridge open-source connector](../../k2bridge.md) - Visualize data from Azure Data Explorer in Kibana

## Automation tools

Azure Data Explorer can connect with other Microsoft products to automate control commands or queries.

* Power Automate: The Azure Data Explorer flow connector allows Azure Data Explorer to use the flow capabilities of [Microsoft Power Automate](https://flow.microsoft.com/). You can run Kusto queries and commands automatically, as part of a scheduled or triggered task.
    * [Power Automate Flow connector](../../flow.md)
    * [Power Automate connector usage examples](../../flow-usage.md)
* [Microsoft Logic App](./logicapps.md) - Execute Kusto queries automatically as part of [Microsoft Logic App](https://docs.microsoft.com/azure/logic-apps/logic-apps-what-are-logic-apps)

## Data ingestion tools

Data ingestion is the process used to load data records from one or more sources to import data into a table in Azure Data Explorer. Once ingested, the data becomes available for query. Azure Data Explorer provides several tools and connectors for data ingestion. 

* [LightIngest](../../lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
* [One-click ingestion](../../ingest-data-one-click.md) - Tool to quickly ingest data and automatically suggest tables and mapping structures
* [Azure Data Factory](azure-data-factory.md)
* [Azure Data Explorer Connector for Apache Spark](../../spark-connector.md)
* [Ingest from Event Hub](../management/data-ingestion/eventhub.md)

## Source control integration tools

There are several source control tools available for integration to control schema entities.

* [Azure Pipelines](../../devops.md) - Invokes control commands as part of your pipeline
* [Sync Kusto](./synckusto.md) - Sync Kusto stored functions to/from Git

## Integrate with other apps //TODO: where to put this

* [Use a Jupyter Notebook and kqlmagic extension to analyze data in Azure Data Explorer](../../kqlmagic.md)
* [Connect to Azure Data Explorer from Azure Databricks](../../connect-from-databricks.md)
* [Use Azure Data Share to share data with Azure Data Explorer (preview)](../../data-share.md)
* [Query data in Azure Monitor using Azure Data Explorer (Preview)](../../query-monitor-data.md)

