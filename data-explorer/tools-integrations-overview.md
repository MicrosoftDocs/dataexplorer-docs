---
title: Azure Data Explorer tools and integrations overview - Azure Data Explorer
description: This article describes tools and integrations in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: olgolden
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/08/2020
---
# Azure Data Explorer tools and integrations overview

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer collects, stores, and analyzes diverse data to improve products, enhance customer experiences, monitor devices, and boost operations. 

Azure Data Explorer offers different tools and integrations to do data ingestion, queries, visualization, orchestration and more. In addition to its native services, Azure Data Explorer allows users to integrate easily with various products and platforms, enable various customer use cases, optimize the business process by streamlining workflows, and reducing costs. 

This article supplies you with a list of Azure Data Explorer tools, connectors, and integrations with links to relevant documents for additional information.

## Ingest data 

Data ingestion is the process used to load data records from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for query. Azure Data Explorer provides several tools and connectors for data ingestion. 

### Azure Data Explorer ingestion tools

* [LightIngest](lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
* One-click Ingestion: [overview](ingest-data-one-click.md) and ingest data [from a container to a new table](one-click-ingestion-new-table.md)
or [from a local file to an existing table](one-click-ingestion-existing-table.md)

### Ingestion integrations

* Event Hub: [Ingest from Event Hub overview](ingest-data-event-hub-overview.md) and using the [Azure portal](ingest-data-event-hub.md), [C#](data-connection-event-hub-csharp.md), [Python](data-connection-event-hub-python.md) or [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)
* Event Grid: [Ingest from Event Grid overview](ingest-data-event-grid-overview.md) and using the [Azure portal](ingest-data-event-grid.md), [C#](data-connection-event-grid-csharp.md), [Python](data-connection-event-grid-python.md) or [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)
* IoT Hub: [Ingest from IoT Hub overview](ingest-data-iot-hub-overview.md) and using the [Azure portal](ingest-data-iot-hub.md), [C#](data-connection-iot-hub-csharp.md), [Python](data-connection-iot-hub-python.md) or [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)
* [Logstash](ingest-data-logstash.md)
* Azure Data Factory: [integration overview](data-factory-integration.md), [copy data](data-factory-load-data.md), [Copy in bulk using the Azure Data Factory template](data-factory-template.md), and [run Azure Data Explorer control commands using Azure Data Factory command activity](data-factory-command-activity.md)
* [Azure Synapse Apache Spark](/azure/synapse-analytics/quickstart-connect-azure-data-explorer?context=%252fazure%252fdata-explorer%252fcontext%252fcontext)
* [Apache Spark](spark-connector.md)
* [Apache Kafka](ingest-data-kafka.md)
* [Cosmos DB](https://github.com/Azure/azure-kusto-labs/tree/master/cosmosdb-adx-integration)
* [Power Automate](flow.md)

## Query data

### Azure Data Explorer query tools

There are several tools available for running queries in Azure Data Explorer.

* Kusto.Explorer
    * [installation and user interface](kusto/tools/kusto-explorer.md), [using Kusto.Explorer](kusto/tools/kusto-explorer-using.md)
    * Additional topics include [options](kusto/tools/kusto-explorer-options.md), [troubleshooting](kusto/tools/kusto-explorer-troubleshooting.md), [keyboard shortcuts](kusto/tools/kusto-explorer-shortcuts.md), [code refactoring](kusto/tools/kusto-explorer-refactor.md), [code navigation](kusto/tools/kusto-explorer-codenav.md), and [code analyze](kusto/tools/kusto-explorer-code-analyzer.md)
* [Web UI](web-query-data.md)
* [Kusto.Cli](kusto/tools/kusto-cli.md)

### Query open source repositories

The following open source repositories contain the source code for the Kusto Query Lanuguage (KQL) parser and editor:

* [Kusto Query Language parser](https://github.com/microsoft/Kusto-Query-Language) - A .Net core repository for the Kusto Query Language parser and semantic tree.
* [Kusto Query Language Plugin for the Monaco editor](https://github.com/Azure/monaco-kusto) - A Kusto Query Language editor that can be embedded in web and electron based applications. 

### Query integrations

* [Azure Monitor](query-monitor-data.md)
* [Azure Data Lake](data-lake-query-data.md)
* [Azure Synapse Apache Spark](/azure/synapse-analytics/quickstart-connect-azure-data-explorer?context=%252fazure%252fdata-explorer%252fcontext%252fcontext)
* [Apache Spark](spark-connector.md)
* [Microsoft Power Apps](power-apps-connector.md)
* Azure Data Studio: [Kusto extension overview](/sql/azure-data-studio/extensions/kusto-extension?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), [use Kusto](/sql/azure-data-studio/notebooks/notebooks-kusto-kernel?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), and [use Kqlmagic](/sql/azure-data-studio/notebooks-kqlmagic?context=%252fazure%252fdata-explorer%252fcontext%252fcontext)

## Visualizations, dashboards, and reporting

The [visualization overview](viz-overview.md) details data visualization, dashboards, and reporting options. 

## Notebook connectivity

* [Azure Notebooks](/sql/azure-data-studio/notebooks/notebooks-kqlmagic?context=%252fazure%252fdata-explorer%252fcontext%252fcontext%253fcontext%253d%252fazure%252fdata-explorer%252fcontext%252fcontext)
* [Jupyter Notebooks](kqlmagic.md)
* Azure Data Studio: [Kusto extension overview](/sql/azure-data-studio/extensions/kusto-extension?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), [use Kusto](/sql/azure-data-studio/notebooks/notebooks-kusto-kernel?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), and [use Kqlmagic](/sql/azure-data-studio/notebooks-kqlmagic?context=%252fazure%252fdata-explorer%252fcontext%252fcontext)

## Orchestration

* Power Automate
    * [Power Automate connector](flow.md)
    * [Power Automate connector usage examples](flow-usage.md)
* [Microsoft Logic App](kusto/tools/logicapps.md) 
* [Azure Data Factory](data-factory-integration.md)

## Share data

* [Azure Data Share](data-share.md)

## Source control integration

* [Azure Pipelines](devops.md) 
* [Sync Kusto](kusto/tools/synckusto.md) 

<!--Open Source Tools-->
