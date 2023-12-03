---
title: Overview of data integrations
description: Learn about the available data integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/26/2023
# CustomerIntent: As a data ingestor, I want to know what data connectors and tools are available, so that I can choose the right one for my use case.
---
# Data integrations overview

[Data ingestion](ingest-data-overview.md) Data ingestion is the process used to load data from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for [query](kusto/query/index.md). Azure Data Explorer provides several connectors for data ingestion.

The following tables summarizes the available data connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name | Functionality | Supports streaming? | Supports free cluster? | Type | Use cases |
|--|--|:-:|--|--|--|
| [Apache Kafka](tools-integrations-overview.md#apache-kafka) | **Ingestion** | &check; |  | First party, [Open source](https://github.com/Azure/kafka-sink-azure-kusto/) | Logs, Telemetry, Time series |
| [Apache Flink](tools-integrations-overview.md#apache-flink) | **Ingestion** | &check; |  | [Open source](https://github.com/Azure/flink-connector-kusto/) | Telemetry |
| [Apache Log4J 2](tools-integrations-overview.md#apache-log4j-2) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-log4j) | Logs |
| [Apache Spark](tools-integrations-overview.md#apache-spark) | **Export**<br /><br />**Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/azure-kusto-spark/) | Telemetry |
| [Apache Spark for Azure Synapse Analytics](tools-integrations-overview.md#apache-spark-for-azure-synapse-analytics) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Telemetry |
| [Azure Cosmos DB](tools-integrations-overview.md#azure-cosmos-db) | **Ingestion** | &check; |  | First party | Change feed |
| [Azure Data Factory](tools-integrations-overview.md#azure-data-factory) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Data orchestration |
| [Azure Event Grid](tools-integrations-overview.md#azure-event-grid) | **Ingestion** | &check; |  | First party | Event processing |
| [Azure Event Hubs](tools-integrations-overview.md#azure-event-hubs) | **Ingestion** | &check; |  | First party | Messaging |
| [Azure Functions](tools-integrations-overview.md#azure-functions) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Workflow integrations |
| [Azure IoT Hubs](tools-integrations-overview.md#azure-iot-hubs) | **Ingestion** | &check; |  | First party | IoT data |
| [Azure Stream Analytics](tools-integrations-overview.md#azure-stream-analytics) | **Ingestion** | &check; |  | First party | Event processing |
| [Fluent Bit](tools-integrations-overview.md#fluent-bit) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/fluent/fluent-bit) | Logs, Metrics, Traces |
| [Logstash](tools-integrations-overview.md#logstash) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs |
| [NLog](tools-integrations-overview.md#nlog) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-nlog-sink) | Telemetry, Logs, Metrics |
| [Open Telemetry](tools-integrations-overview.md#open-telemetry) | **Ingestion** | &check; |  | [Open source](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter) | Traces, Metrics, Logs |
| [Power Automate](tools-integrations-overview.md#power-automate) | **Export**<br /><br />**Ingestion** | &#x2717; |  | First party | Data orchestration |
| [Serilog](tools-integrations-overview.md#serilog) | **Ingestion** | &check; | &check; | First party, [Open source](https://github.com/Azure/serilog-sinks-azuredataexplorer) | Logs |
| [Splunk](tools-integrations-overview.md#splunk) | **Ingestion** | &#x2717; |  | [Open source](https://github.com/Azure/azure-kusto-splunk) | Logs |
| [Telegraf](tools-integrations-overview.md#telegraf) | **Ingestion** | &check; |  | [Open source](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) | Metrics, Logs |

## [Tools and integrations](#tab/integrations)

* [LightIngest](https://github.com/Azure/Kusto-Lightingest/blob/main/README.md): a command-line utility for ad-hoc data ingestion into Azure Data Explorer. For more information, see [Use LightIngest to ingest data](lightingest.md).
* Ingestion wizard: [overview](ingest-data-wizard.md) and ingest data [from a container to a new table](/azure/data-explorer/ingest-from-container)
or [from a local file to an existing table](/azure/data-explorer/ingest-from-local-file)

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](tools-integrations-overview.md#detailed-descriptions).

## Related content

* [Query data integrations](integrate-query-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
