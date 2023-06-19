---
title: Overview of data connectors in Azure Data Explorer
description: This article summarizes available data connectors and their capabilities.
ms.reviewer: aksdi
ms.topic: reference
ms.date: 05/10/2023
---
# Data connectors overview

[Data ingestion](ingest-data-overview.md) is the process used to load data records from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for [query](kusto/query/index.md). Azure Data Explorer provides several connectors for data ingestion.

The following table summarizes the available connectors in Azure Data Explorer and their capabilities:

| Name | Functionality | Supports streaming? | Type | Use cases |
|---|---|:-:|---|---|
| [Apache Kafka](#apache-kafka) | **Ingestion** | &check; | First party, [Open source](https://github.com/Azure/kafka-sink-azure-kusto/) | Logs, Telemetry, Time series |
| [Apache Log4J 2](#apache-log4j-2) | **Ingestion** | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-log4j) | Logs |
| [Apache Spark](#apache-spark) | **Export** <br /><br />**Ingestion** | &#x2717; | [Open source](https://github.com/Azure/azure-kusto-spark/) | Telemetry |
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) | **Export** <br /><br />**Ingestion** | &#x2717; | First party | Telemetry |
| [Azure Cosmos DB](#azure-cosmos-db) | **Ingestion** | &check; | First party | Change feed |
| [Azure Data Factory](#azure-data-factory) | **Export** <br /><br />**Ingestion** | &#x2717; | First party | Data orchestration |
| [Azure Event Grid](#azure-event-grid) | **Ingestion** | &check; | First party | Event processing |
| [Azure Event Hubs](#azure-event-hubs) | **Ingestion** | &check; | First party | Messaging |
| [Azure Functions](#azure-functions) | **Export** <br /><br />**Ingestion** |  &#x2717; | First party | Workflow integrations |
| [Azure IoT Hubs](#azure-iot-hubs) | **Ingestion** | &check; | First party | IoT data |
| [Azure Stream Analytics](#azure-stream-analytics) | **Ingestion** | &check; | First party | Event processing |
| [Logstash](#logstash) | **Ingestion** | &#x2717; | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs |
| [NLog](#nlog) | **Ingestion** | &check; | First party, [Open source](https://github.com/Azure/azure-kusto-nlog-sink) | Telemetry, Logs, Metrics |
| [Open Telemetry](#open-telemetry) | **Ingestion** | &check; | [Open source](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter) | Traces, Metrics, Logs |
| [Power Automate](#power-automate) | **Export** <br /><br />**Ingestion** | &#x2717; | First party | Data orchestration |
| [Serilog](#serilog) | **Ingestion** | &check; | First party, [Open source](https://github.com/Azure/serilog-sinks-azuredataexplorer) | Logs |
| [Telegraf](#telegraf) | **Ingestion** | &check; | [Open source](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) | Metrics, Logs |

## Apache Kafka

* **Description:** Azure Data Explorer supports data ingestion from [Apache Kafka](https://kafka.apache.org/documentation/). Apache Kafka is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. Kafka Connect is a tool for scalable and reliable streaming of data between Apache Kafka and other data systems. The Azure Data Explorer Kafka Sink serves as the connector from Kafka and doesn't require using code. This is a gold certified by Confluent - has gone through comprehensive review and testing for quality, feature completeness, compliance with standards and for performance.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs, Telemetry, Time series
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/kafka-sink-azure-kusto/
* **Documentation:** [Ingest data from Apache Kafka into Azure Data Explorer](ingest-data-kafka.md)
* **Community Blog:** [Kafka ingestion into Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/kafka-ingestion-into-azure-data-explorer-part-1/ba-p/1452439)

## Apache Log4J 2

* **Description:** Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. Apache Log4J2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze and visualize your logs in real time.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-log4j
* **Documentation:** [Ingest data with the Apache Log4J 2 connector](apache-log4j2-connector.md)
* **Community Blog:** [Getting started with Apache Log4J and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-apache-log4j-and-azure-data-explorer/ba-p/3705242)

## Apache Spark

* **Description:** [Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing. The [Azure Data Explorer connector for Spark](spark-connector.md) is an open source project that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Data Explorer and Spark clusters. Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, Azure Data Explorer becomes a valid data store for standard Spark source and sink operations, such as write, read, and writeStream.
* **Functionality:** Ingestion, Export
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-spark/
* **Documentation:** [Azure Data Explorer Connector for Apache Spark](spark-connector.md)
* **Community Blog:** [Data preprocessing for Azure Data Explorer with Apache Spark](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/data-pre-processing-for-azure-data-explorer-with-apache-spark/ba-p/2727993/)

## Apache Spark for Azure Synapse Analytics

* **Description:** [Apache Spark](https://spark.apache.org/) is a parallel processing framework that supports in-memory processing to boost the performance of big data analytic applications. [Apache Spark in Azure Synapse](/azure/synapse-analytics/spark/apache-spark-overview) Analytics is one of Microsoft's implementations of Apache Spark in the cloud. You can access an Azure Data Explorer database from [Synapse Studio](/azure/synapse-analytics/) with Apache Spark for Azure Synapse Analytics.
* **Functionality:** Ingestion, Export
* **Ingestion type supported:** Batching
* **Use cases:** Telemetry
* **Documentation:** [Connect an Azure Data Explorer database to an Azure Synapse workspace](/azure/synapse-analytics/quickstart-connect-azure-data-explorer)


## Azure Cosmos DB

* **Description:** Azure Data Explorer supports data ingestion from [Azure Cosmos DB for NoSql](/azure/cosmos-db/) using a change feed. The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your cluster.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Change feed
* **Documentation:** [Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)](ingest-data-cosmos-db-connection.md)

## Azure Data Factory

* **Description:**  [Azure Data Factory](/azure/data-factory) (ADF) is a cloud-based data integration service that allows you to integrate different data stores and perform activities on the data.
* **Functionality:** Ingestion, Export
* **Ingestion type supported:** Batching
* **Use cases:** Data orchestration
* **Documentation:** [Copy data to Azure Data Explorer by using Azure Data Factory](data-factory-load-data.md)

## Azure Event Grid

* **Description:** Event Grid ingestion is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created or blob renamed notifications and streaming these notifications to Azure Data Explorer via Azure Event Hubs.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Event processing
* **Documentation:** [Event Grid data connection](ingest-data-event-grid-overview.md)

## Azure Event Hubs

* **Description:**  [Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. Azure Data Explorer offers continuous ingestion from customer-managed Event Hubs.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Documentation:** [Azure Event Hubs data connection](ingest-data-event-hub-overview.md)

## Azure Functions

* **Description:**  [Azure Functions](/azure/azure-functions/functions-overview) allow you to run serverless code in the cloud on a schedule or in response to an event. With Azure Data Explorer input and output bindings for Azure Functions, you can integrate Azure Data Explorer into your workflows to ingest data and run queries against your cluster.
* **Functionality:** Ingestion, Export
* **Ingestion type supported:** Batching
* **Use cases:** Workflow integrations.
* **Documentation:** [Integrating Azure Functions with Azure Data Explorer using input and output bindings (preview)](integrate-azure-functions.md)

## Azure IoT Hubs

* **Description:** [Azure IoT Hub](/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Azure Data Explorer offers continuous ingestion from customer-managed IoT Hubs, using its [Event Hub compatible built in endpoint of device-to-cloud messages](/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:**  IoT data
* **Documentation:** [IoT Hub data connection](ingest-data-iot-hub-overview.md)

## Azure Stream Analytics

* **Description:** [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-introduction) is a real-time analytics and complex event-processing engine that's designed to process high volumes of fast streaming data from multiple sources simultaneously.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Event processing
* **Documentation:** [Ingest data from Azure Stream Analytics into Azure Data Explorer](stream-analytics-connector.md)

## Logstash

* **Description:** [The Azure Data Explorer Logstash plugin](ingest-data-logstash.md) enables you to process events from Logstash into an Azure Data Explorer database for later analysis.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching
* **Use cases:** Logs
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/logstash-output-kusto/
* **Documentation:** [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md)
* **Community Blog:** [How to migrate from Elasticsearch to Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/how-to-migrate-from-elasticsearch-to-azure-data-explorer/ba-p/1621539/)

## NLog

* **Description:** NLog is a flexible and free logging platform for various .NET platforms, including .NET standard. NLog allows you to write to several targets, such as a database, file, or console. With NLog you can change the logging configuration on-the-fly. The NLog sink is a target for NLog that allows you to send your log messages to an Azure Data Explorer cluster. The plugin is built on top of the Azure-Kusto-Data library and provides an efficient way to sink your logs to your cluster.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry, Logs, Metrics
* **Underlying SDK:** [.NET](kusto/api/netfx/about-the-sdk.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-nlog-sink
* **Documentation:** [Ingest data with the NLog sink into Azure Data Explorer](nlog-sink.md)
* **Community Blog:** [Getting started with NLog sink and Azure Data Explorer](https://aka.ms/adx-docs-nlog-blog)

## Open Telemetry

* **Description:**  [The OpenTelemetry connector](open-telemetry-connector.md) supports ingestion of data from many receivers into Azure Data Explorer. It works as a bridge to ingest data generated by Open telemetry to the ADX clusters by customizing the format of the exported data according to the needs of the end user.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Traces, Metrics, Logs
* **Underlying SDK:** [Go](kusto/api/golang/kusto-golang-client-library.md)
* **Repository:** Open Telemetry - https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter
* **Documentation:** [Ingest data from OpenTelemetry to Azure Data Explorer](open-telemetry-connector.md)
* **Community Blog:** [Getting started with Open Telemetry and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-open-telemetry-and-azure-data-explorer/ba-p/3675708)

## Power Automate

* **Description:** [Power Automate](/power-automate/getting-started) is an orchestration service used to automate business processes. The Azure Data Explorer connector for :::no-loc text="Power Automate"::: (previously Microsoft Flow) enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task.
* **Functionality:** Ingestion, Export
* **Ingestion type supported:** Batching
* **Use cases:** Data orchestration
* **Documentation:** [Azure Data Explorer connector for Microsoft Power Automate](flow.md)

## Serilog

* **Description:** Serilog is a popular logging framework for .NET applications. Serilog allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Serilog sink, also known as an appender, for Azure Data Explorer streams your log data to Azure Data Explorer, where you can analyze and visualize your logs in real time.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs
* **Underlying SDK:** [.NET](kusto/api/netfx/about-the-sdk.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/serilog-sinks-azuredataexplorer
* **Documentation:** [Ingest data with the Serilog sink into Azure Data Explorer](serilog-sink.md)
* **Community Blog:** [Getting started with Serilog sink and Azure Data Explorer](https://go.microsoft.com/fwlink/p/?linkid=2227749)

## Telegraf

* **Description:** Azure Data Explorer supports [data ingestion from Telegraf](ingest-data-telegraf.md). Telegraf is an open source, lightweight, minimal memory foot print agent for collecting, processing and writing telemetry data including logs, metrics, and IoT data. Telegraf supports hundreds of input and output plugins. It's widely used and well supported by the open source community. The Azure Data Explorer output plugin serves as the connector from Telegraf and supports ingestion of data from many types of input plugins into Azure Data Explorer.
* **Functionality:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry, Logs, Metrics
* **Underlying SDK:** Go
* **Repository:** InfluxData - https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer
* **Documentation:** [Ingest data from Telegraf into Azure Data Explorer](ingest-data-telegraf.md)
* **Community Blog:**  [New Azure Data Explorer output plugin for Telegraf enables SQL monitoring at huge scale](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/new-azure-data-explorer-output-plugin-for-telegraf-enables-sql/ba-p/2829444)

## See also

* [Azure Data Explorer data ingestion overview](ingest-data-overview.md)
