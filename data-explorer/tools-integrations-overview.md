---
title: Azure Data Explorer tools and integrations overview - Azure Data Explorer
description: This article describes tools and integrations in Azure Data Explorer.
ms.reviewer: olgolden
ms.topic: conceptual
ms.date: 07/02/2023
---
# Azure Data Explorer tools and integrations overview

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer collects, stores, and analyzes diverse data to improve products, enhance customer experiences, monitor devices, and boost operations.

Azure Data Explorer offers different tools and integrations to do data ingestion, queries, visualization, orchestration and more. In addition to its native services, Azure Data Explorer allows users to integrate easily with various products and platforms, enable various customer use cases, optimize the business process by streamlining workflows, and reducing costs.

This article supplies you with a list of Azure Data Explorer tools, connectors, and integrations with links to relevant documents for additional information.

## Ingest data

Data ingestion is the process used to load data records from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for query. Azure Data Explorer provides several tools and connectors for data ingestion.

For a complete list of ingestion connectors, see [Data connectors Overview](connector-overview.md).

### Azure Data Explorer ingestion tools

* [LightIngest](lightingest.md) - Help utility for ad-hoc data ingesting into Azure Data Explorer
* Ingestion wizard: [overview](./ingest-data-wizard.md) and ingest data [from a container to a new table](/azure/data-explorer/ingest-from-container)
or [from a local file to an existing table](/azure/data-explorer/ingest-from-local-file)

## Query data

### Azure Data Explorer query tools

There are several tools available for running queries in Azure Data Explorer.

* [Azure Data Explorer web UI](web-query-data.md)
* Kusto.Explorer
  * [installation and user interface](kusto/tools/kusto-explorer.md), [using Kusto.Explorer](kusto/tools/kusto-explorer-using.md)
  * Additional topics include [options](kusto/tools/kusto-explorer-options.md), [troubleshooting](kusto/tools/kusto-explorer-troubleshooting.md), [keyboard shortcuts](kusto/tools/kusto-explorer-shortcuts.md), [code features](kusto/tools/kusto-explorer-code-features.md)
* [Kusto CLI](kusto/tools/kusto-cli.md)

### Query open source repositories

The following open source repositories contain the source code for the Kusto Query Language (KQL) parser and editor:

* [Kusto Query Language parser](https://github.com/microsoft/Kusto-Query-Language) - A .NET core repository for the Kusto Query Language parser and semantic tree.
* [Kusto Query Language setup and usage for the Monaco editor](./kusto/api/monaco/monaco-kusto.md) - The Kusto Query Language editor that can be embedded in web and electron based applications.
  * [Kusto Query Language plugin](https://github.com/Azure/monaco-kusto) - Access the Kusto Query Language editor plugin.
  * [Embedding the Azure Data Explorer web UI](./kusto/api/monaco/host-web-ux-in-iframe.md) - The Azure Data Explorer web UI can be embedded in an iframe and hosted in third-party websites.

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
* [Delta Kusto](https://github.com/microsoft/delta-kusto)