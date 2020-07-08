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

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer collects, stores, and analyzes diverse data to improve products, enhance customer experiences, monitor devices, and boost operations. 

Azure Data Explorer offers different tools and integrations to do data ingestion, queries, visualization, orchestration and more. In addition to its native services, Azure Data Explorer allows users to integrate easily with various products and platforms, enable various customer use cases, optimize the business process by streamlining workflows, and reducing costs. 

This article supplies you with a list of Azure Data Explorer tools, connectors, and integrations with links to relevant documents for additional information.

## Data ingestion 

Data ingestion is the process used to load data records from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for query. Azure Data Explorer provides several tools and connectors for data ingestion. 

### Azure Data Explorer ingestion tools

* [LightIngest](lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
* One-click Ingestion
    * [One-click ingestion overview](ingest-data-one-click.md) 
    * [Ingest data from a container to a new table](one-click-ingestion-new-table.md)
    * [Ingest data from a local file to an existing table](one-click-ingestion-existing-table.md)

### Azure Data Explorer ingestion integrations

* Event Hub
    * [Ingest from Event Hub]([Ingest from Event Hub](kusto/management/data-ingestion/eventhub.md)
    * Ingest from Event Hub using the [Azure portal](ingest-data-event-hub.md), [C#](data-connection-event-hub-csharp.md), [Python](data-connection-event-hub-python.md) or [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)
* Event Grid
    * [Ingest from Event Grid](kusto/management/data-ingestion/eventgrid.md)
    * Ingest from Event Grid using the [Azure portal](ingest-data-event-grid.md), [C#](data-connection-event-grid-csharp.md), [Python](data-connection-event-grid-python.md) or [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)
* IoT Hub
    * [Ingest from IoT Hub](kusto/management/data-ingestion/iothub.md)
    * Ingest from IoT Hub using the [Azure portal](ingest-data-iot-hub.md), [C#](data-connection-iot-hub-csharp.md), [Python](data-connection-iot-hub-python.md) or [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)
* [Logstash](ingest-data-logstash.md)
* Azure Data Factory
    * [Integrate with Azure Data Factory](data-factory-integration.md)
    * [Copy data](data-factory-load-data.md)
    * [Copy in bulk from a database by using the Azure Data Factory template](data-factory-template.md)
    * [Use Azure Data Factory command activity to run Azure Data Explorer control commands](data-factory-command-activity.md)
* Apache 
    * [Spark](spark-connector.md)
    * [Kafka](ingest-data-kafka.md)
* [Cosmos DB](https://github.com/Azure/azure-kusto-labs/tree/master/cosmosdb-adx-integration)
* [Power Automate](flow.md)

## Query data

### Azure Data Explorer query tools

There are several tools available for running queries in Azure Data Explorer:

* Kusto.Explorer
    * [installation and user interface](kusto/tools/kusto-explorer.md)
    * [Using Kusto.Explorer](kusto/tools/kusto-explorer-using.md)
    * [options](kusto/tools/kusto-explorer-options.md)
    * Additional topics include [troubleshooting](kusto/tools/kusto-explorer-troubleshooting.md), [keyboard shortcuts](kusto/tools/kusto-explorer-shortcuts.md), [code refactoring](kusto/tools/kusto-explorer-refactor.md), [code navigation](kusto/tools/kusto-explorer-codenav.md), and [code analyze](kusto/tools/kusto-explorer-code-analyzer.md)
* [Web UI](web-query-data.md)
* [Kusto.Cli](kusto/tools/kusto-cli.md)

### Azure Data Explorer query integrations

* [Azure Monitor](query-monitor-data.md)
* [Azure Data Lake](data-lake-query-data.md)
* [Apache Spark](spark-connector.md)
* Microsoft Power Apps
* Azure Data Studio

## Visualizations, dashboards, and reporting

The [visualization overview](viz-overview.md) details data visualization, dashboards, and reporting options. 

## Notebook connectivity

* [Azure Notebooks](azure-notebooks.md)
* [Jupyter Notebooks](kqlmagic.md)
* Azure Data Studio

## Orchestration

* Power Automate
    * [Power Automate Flow connector](flow.md)
    * [Power Automate connector usage examples](flow-usage.md)
* [Microsoft Logic App](kusto/tools/logicapps.md) 
* [Azure Data Factory](data-factory-integration.md)

## Share data

* [Azure Data Share](data-share.md)

## Source control integration

* [Azure Pipelines](devops.md) 
* [Sync Kusto](kusto/tools/synckusto.md) 

<!--Open Source Tools-->
