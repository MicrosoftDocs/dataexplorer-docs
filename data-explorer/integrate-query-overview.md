---
title: Overview of query integrations
description: Learn about the available query integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/26/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-adx-fabric
# CustomerIntent: As a data ingestor, I want to know what data connectors and tools are available, so that I can choose the right one for my use case.
---
# Query integrations overview

Blurb about query integrations.

The following tables summarizes the available query connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name | Functionality | Supports streaming? | Supports free cluster? | Type | Use cases |
|--|--|:-:|--|--|--|
| [Apache Kafka](#apache-kafka) | **Ingestion** | &check; |  | First party, [Open source](https://github.com/Azure/kafka-sink-azure-kusto/) | Logs, Telemetry, Time series |
| [Apache Flink](#apache-flink) | **Ingestion** | &check; |  | [Open source](https://github.com/Azure/flink-connector-kusto/) | Telemetry |
| [Apache Log4J 2](#apache-log4j-2) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-log4j) | Logs |
| [Apache Spark](#apache-spark) | **Export**<br /><br />**Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/azure-kusto-spark/) | Telemetry |
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Telemetry |
| [Azure Cosmos DB](#azure-cosmos-db) | **Ingestion** | &check; |  | First party | Change feed |
| [Azure Data Factory](#azure-data-factory) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Data orchestration |
| [Azure Event Grid](#azure-event-grid) | **Ingestion** | &check; |  | First party | Event processing |
| [Azure Event Hubs](#azure-event-hubs) | **Ingestion** | &check; |  | First party | Messaging |
| [Azure Functions](#azure-functions) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Workflow integrations |
| [Azure IoT Hubs](#azure-iot-hubs) | **Ingestion** | &check; |  | First party | IoT data |
| [Azure Stream Analytics](#azure-stream-analytics) | **Ingestion** | &check; |  | First party | Event processing |
| [Fluent Bit](#fluent-bit) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/fluent/fluent-bit) | Logs, Metrics, Traces |
| [Logstash](#logstash) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs |
| [NLog](#nlog) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-nlog-sink) | Telemetry, Logs, Metrics |
| [Open Telemetry](#open-telemetry) | **Ingestion** | &check; |  | [Open source](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter) | Traces, Metrics, Logs |
| [Power Automate](#power-automate) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Data orchestration |
| [Serilog](#serilog) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/serilog-sinks-azuredataexplorer) | Logs |
| [Splunk](#splunk) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/azure-kusto-splunk) | Logs |
| [Telegraf](#telegraf) | **Ingestion** | &check; |  | [Open source](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) | Metrics, Logs |

## [Tools and integrations](#tab/integrations)

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

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](tools-integrations-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Visualize integrations overview](visualize-data-integrations.md)
