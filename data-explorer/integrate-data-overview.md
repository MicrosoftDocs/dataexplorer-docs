---
title: Data integrations overview
description: Learn about the available data integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 01/30/2024
# CustomerIntent: As a data ingestor, I want to know what data connectors and tools are available, so that I can choose the right one for my use case.
---
# Data integrations overview

[Data ingestion](ingest-data-overview.md) is the process used to load data from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for [query](kusto/query/index.md). Azure Data Explorer provides several connectors for data ingestion.

Use the following filters to see other connectors, tools, and integrations are available for your use case.

:::row:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Overview](integrate-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Query integrations](integrate-query-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Visualization integrations](integrate-visualize-overview.md)
   :::column-end:::
:::row-end:::

The following tables summarizes the available data connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name | Functionality | Supports streaming? | Supports free cluster? | Type | Use cases |
|--|--|:-:|--|--|--|
| [Apache Kafka](integrate-overview.md#apache-kafka) | **Ingestion** | :heavy_check_mark: | | First party, [Open source](https://github.com/Azure/kafka-sink-azure-kusto/) | Logs, Telemetry, Time series |
| [Apache Flink](integrate-overview.md#apache-flink) | **Ingestion** | :heavy_check_mark: | | [Open source](https://github.com/Azure/flink-connector-kusto/) | Telemetry |
| [Apache Log4J 2](integrate-overview.md#apache-log4j-2) | **Ingestion** | :heavy_check_mark: | :heavy_check_mark: | First party, [Open source](https://github.com/Azure/azure-kusto-log4j) | Logs |
| [Apache Spark](integrate-overview.md#apache-spark) | **Export**<br /><br />**Ingestion** | | | [Open source](https://github.com/Azure/azure-kusto-spark/) | Telemetry |
| [Apache Spark for Azure Synapse Analytics](integrate-overview.md#apache-spark-for-azure-synapse-analytics) | **Export**<br /><br />**Ingestion** | | | First party | Telemetry |
| [Azure Cosmos DB](integrate-overview.md#azure-cosmos-db) | **Ingestion** | :heavy_check_mark: | | First party | Change feed |
| [Azure Data Factory](integrate-overview.md#azure-data-factory) | **Export**<br /><br />**Ingestion** | | | First party | Data orchestration |
| [Azure Event Grid](integrate-overview.md#azure-event-grid) | **Ingestion** | :heavy_check_mark: | | First party | Event processing |
| [Azure Event Hubs](integrate-overview.md#azure-event-hubs) | **Ingestion** | :heavy_check_mark: | | First party | Messaging |
| [Azure Functions](integrate-overview.md#azure-functions) | **Export**<br /><br />**Ingestion** | | | First party | Workflow integrations |
| [Azure IoT Hubs](integrate-overview.md#azure-iot-hubs) | **Ingestion** | :heavy_check_mark: | | First party | IoT data |
| [Azure Stream Analytics](integrate-overview.md#azure-stream-analytics) | **Ingestion** | :heavy_check_mark: | | First party | Event processing |
| [Fluent Bit](integrate-overview.md#fluent-bit) | **Ingestion** | | | [Open source](https://github.com/fluent/fluent-bit) | Logs, Metrics, Traces |
| [Logstash](integrate-overview.md#logstash) | **Ingestion** | | | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs |
| [NLog](integrate-overview.md#nlog) | **Ingestion** | :heavy_check_mark: | :heavy_check_mark: | First party, [Open source](https://github.com/Azure/azure-kusto-nlog-sink) | Telemetry, Logs, Metrics |
| [Open Telemetry](integrate-overview.md#open-telemetry) | **Ingestion** | :heavy_check_mark: | | [Open source](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter) | Traces, Metrics, Logs |
| [Power Automate](integrate-overview.md#power-automate) | **Export**<br /><br />**Ingestion** | | | First party | Data orchestration |
| [Serilog](integrate-overview.md#serilog) | **Ingestion** | :heavy_check_mark: | :heavy_check_mark: | First party, [Open source](https://github.com/Azure/serilog-sinks-azuredataexplorer) | Logs |
| [Splunk](integrate-overview.md#splunk) | **Ingestion** | | | [Open source](https://github.com/Azure/azure-kusto-splunk/tree/main/splunk-adx-alert-addon) | Logs |
| [Splunk Universal Forwarder](integrate-overview.md#splunk-universal-forwarder)| **Ingestion** | | | [Open source](https://github.com/Azure/azure-kusto-splunk) | Logs |
| [Telegraf](integrate-overview.md#telegraf) | **Ingestion** | :heavy_check_mark: | | [Open source](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) | Metrics, Logs |

## [Tools and integrations](#tab/integrations)

| Name | Functionality | Supports streaming? | Supports free cluster? | Type | Use cases |
|--|--|:-:|--|--|--|
| [LightIngest](integrate-overview.md#lightingest) | **Ingestion** | | :heavy_check_mark: | First party | Historical data, One-time data ingestion |
| [Web UI](integrate-overview.md#web-ui) | **Ingestion** | :heavy_check_mark: | :heavy_check_mark: | First party | Logs, Telemetry, Time series |

---

For more information about connectors and tools, see [Integrations overview](integrate-overview.md#detailed-descriptions).

## Related content

* [Query data integrations](integrate-query-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
