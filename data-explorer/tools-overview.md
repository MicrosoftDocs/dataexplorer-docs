---
title: Azure Data Explorer tools - Azure Data Explorer
description: This article describes tools and integrations in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: olgolden
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/08/2020
---
# Azure Data Explorer tools overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers different tools and connectors to do data ingestion, queries, visualize data, automate tasks, control schema entities, or integrate with other services.

Azure Data Explorer (ADX) is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more. ADX collects, stores, and analyzes diverse data to improve products, enhance customer experiences, monitor devices, and boost operations. 
In addition to its native services, ADX allows users to easily integrate with various products and platforms, to enable a variety of customer use cases, optimize the business process by streamlining workflows, reducing costs and bottlenecks, and above all to allow users to make better decisions with richer insights into their integrated business.

## Query data

* [Azure Monitor](../../query-monitor-data.md)
* [Azure Data Lake](../../data-lake-query-data.md)
* [Apache Spark](../../spark-connector.md)
* Microsoft Power Apps
* Azure Data Studio

### Azure Data Explorer query tools

There are several tools available for running queries in Azure Data Explorer:

* Kusto.Explorer
   * [Kusto.Explorer installation and user interface](./kusto-explorer.md)
   * [Using Kusto.Explorer](./kusto-explorer-using.md)
   * [Kusto.Explorer troubleshooting](kusto-explorer-troubleshooting.md)
* [Web UI](../../web-query-data.md) - Web UI for querying Kusto
* [Kusto.Cli](kusto-cli.md)

## Data ingestion 

Data ingestion is the process used to load data records from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for query. Azure Data Explorer provides several tools and connectors for data ingestion. 

* Event Hub
    * [Ingest from Event Hub](../management/data-ingestion/eventhub.md)
    * [Ingest data from Event Hub using the Azure portal](../../ingest-data-event-hub.md)
    * [Ingest data from Event Hub using C#](../../data-connection-event-hub-csharp.md)
    * [Ingest data from Event Hub using Python](../../data-connection-event-grid-python.md)


* [LightIngest](../../lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
* [One-click ingestion](../../ingest-data-one-click.md) - Tool to quickly ingest data and automatically suggest tables and mapping structures
* [Azure Data Factory](azure-data-factory.md)
* [Azure Data Explorer Connector for Apache Spark](../../spark-connector.md)

### Azure Data Explorer ingestion tools

* 

## Visualizations, dashboards, and reporting tools

The [visualization overview](../../viz-overview.md) covers detailed information about data visualization and reporting options. Data visualization and reporting is a critical step in the data analytics process.  Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. Choose from one of the many BI services to best fit your scenario and budget.


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

## Notebook connectivity

* [Azure Notebooks](../../azure-notebooks.md) 
* [Jupyter Notebooks](../../kqlmagic.md)
* Azure Data Studio

## Orchestration

Azure Data Explorer can connect with other Microsoft products to automate control commands or queries.

* Power Automate
    * [Power Automate Flow connector](../../flow.md)
    * [Power Automate connector usage examples](../../flow-usage.md)
* [Microsoft Logic App](./logicapps.md) 
* [Azure Data Factory]()

## Share data

* [Azure Data Share](../../data-share.md)

## Source control integration

There are several source control tools available for integration to control schema entities.

* [Azure Pipelines](../../devops.md) - Invokes control commands as part of your pipeline
* [Sync Kusto](./synckusto.md) - Sync Kusto stored functions to/from Git

## Integrate with other apps //TODO: where to put this

* 
* [Connect to Azure Data Explorer from Azure Databricks](../../connect-from-databricks.md)
* 
* 

