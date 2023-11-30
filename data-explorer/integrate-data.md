---
title: Overview of data integrations
description: Learn about the available data integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/26/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-adx-fabric
# CustomerIntent: As a data ingestor, I want to know what data connectors and tools are available, so that I can choose the right one for my use case.
---
# Data integrations overview

[Data ingestion](ingest-data-overview.md) Data ingestion is the process used to load data from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for [query](kusto/query/index.md). Azure Data Explorer provides several connectors for data ingestion.

The following tables summarizes the available data connectors and tools. For more information about each connector, see [Integrations overview](connector-overview.md).

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

## [Tools](#tab/tools)

* [LightIngest](https://github.com/Azure/Kusto-Lightingest/blob/main/README.md): a command-line utility for ad-hoc data ingestion into Azure Data Explorer. For more information, see [Use LightIngest to ingest data](lightingest.md).
* Ingestion wizard: [overview](ingest-data-wizard.md) and ingest data [from a container to a new table](/azure/data-explorer/ingest-from-container)
or [from a local file to an existing table](/azure/data-explorer/ingest-from-local-file)

---

For more information about connectors and tools, see [Integrations overview](connector-overview.md).

### Related content

* [Analyze and model data integrations](integrate-analyze-model.md)
* [Visualize integrations](visualize-data-integrations.md)
