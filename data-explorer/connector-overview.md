---
title: Overview of available data connectors in Azure Data Explorer.
description: This article summarizes the available connectors and their capabilities.
ms.reviewer: aksdi
ms.topic: reference
ms.date: 02/05/2023
---
# Data connectors Overview

The following table summarizes the available connectors in Azure Data Explorer and their capabilities:

| Name of connector                 | Type                                              | Underlying SDK | Repo owner      | Functionality         |
|-----------------------------------|---------------------------------------------------|----------------|-----------------|-----------------------|
| [Apache Kafka](#apache-kafka)     | **Ingestion** <br> *streaming, batching*          | Java           | Microsoft Azure | Telemetry             |
| [Apache Log4J 2](#apache-log4j-2) | **Ingestion** <br> *streaming*                    | Java           | Microsoft Azure | Logs                  |
| [Apache Spark](#apache-spark)     | **Export** <br> <br>**Ingestion** <br> *batching* | Java           | Microsoft Azure | Telemetry             |
| [Logstash](#logstash)             | **Ingestion** <br> *batching*                     | Java           | Microsoft Azure | Logs                  |
| [Open Telemetry](#open-telemetry) | **Ingestion** <br> *streaming, batching*          | Go             |                 | Traces, Metrics, Logs |
| [Telegraf](#telegraf)             | **Ingestion** <br> *streaming, batching*          | Go             | InfluxData      | Metrics, Logs         |
|  [Event Hubs](#event-hubs)      |     **Ingestion** <br> *streaming*                   |                |                 |                       |
|  [Event Grid  ](#event-grid)                   |       **Ingestion** <br> *streaming, batching*                                   |                |                 |                       |
|  [IoT Hubs](#iot-hubs)          |        **Ingestion** <br> *streaming*             |                |                 |                       |
|                                   |                                                   |                |                 |                       |
|                                   |                                                   |                |                 |                       |

## Apache Kafka

* **Description:** Azure Data Explorer supports [data ingestion from Apache Kafka](ingest-data-kafka.md). Apache Kafka is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. Kafka Connect is a tool for scalable and reliable streaming of data between Apache Kafka and other data systems. The Azure Data Explorer Kafka Sink serves as the connector from Kafka and doesn't require using code.
* **Type:** Ingestion
* **Ingestion type supported:** Streaming, Batching
* **Functionality:** Telemetry
* **Underlying SDK:** Java
* **Repository:** Microsoft Azure - https://github.com/Azure/kafka-sink-azure-kusto/
* **Documentation:** [Ingest data from Apache Kafka into Azure Data Explorer](ingest-data-kafka.md)
* **Community Blog:** [Kafka ingestion into Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/kafka-ingestion-into-azure-data-explorer-part-1/ba-p/1452439)

## Apache Log4J 2

* **Description:** Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time.
* **Type:** Ingestion
* **Ingestion type supported:** Streaming
* **Functionality:** Logs
* **Underlying SDK:** Java
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-log4j
* **Community Blog:** [Getting started with Apache Log4j and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-apache-log4j-and-azure-data-explorer/ba-p/3705242)

## Apache Spark

* **Description:** The [Azure Data Explorer connector for Spark](spark-connector.md) is an open source project that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Data Explorer and Spark clusters. Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, Azure Data Explorer becomes a valid data store for standard Spark source and sink operations, such as write, read, and writeStream.
* **Type:** Ingestion, Export
* **Ingestion type supported:** Streaming, Batching
* **Functionality:** Telemetry
* **Underlying SDK:** Java
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-spark/
* **Documentation:** [Azure Data Explorer Connector for Apache Spark](spark-connector.md)
* **Community Blog:** [Data pre-processing for Azure Data Explorer with Apache Spark](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/data-pre-processing-for-azure-data-explorer-with-apache-spark/ba-p/2727993/)

## Logstash

* **Description:** [The Azure Data Explorer Logstash plugin](ingest-data-logstash.md) enables you to process events from Logstash into an Azure Data Explorer database for later analysis.
* **Type:** Ingestion
* **Ingestion type supported:** Batching
* **Functionality:** Logs
* **Underlying SDK:** Java
* **Repository:** Microsoft Azure - https://github.com/Azure/logstash-output-kusto/
* **Documentation:** [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md)
* **Community Blog:** [How to migrate from Elasticsearch to Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/how-to-migrate-from-elasticsearch-to-azure-data-explorer/ba-p/1621539/)

## Open Telemetry

* **Description:**  [The OpenTelemetry connector](open-telemetry-connector.md) supports ingestion of data from many receivers into Azure Data Explorer. It works as a bridge to ingest data generated by Open telemetry to the ADX clusters by customizing the format of the exported data according to the needs of the end user.
* **Type:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Functionality:** Traces, Metrics, Logs
* **Underlying SDK:** Go
* **Repository:** Owner, link
* **Documentation:** [Ingest data from OpenTelemetry to Azure Data Explorer](open-telemetry-connector.md)
* **Community Blog:** [Getting started with Open Telemetry and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-open-telemetry-and-azure-data-explorer/ba-p/3675708)

## Telegraf

* **Description:** Azure Data Explorer supports [data ingestion from Telegraf](ingest-data-telegraf.md). Telegraf is an open source, lightweight, minimal memory foot print agent for collecting, processing and writing telemetry data including logs, metrics, and IoT data. Telegraf supports hundreds of input and output plugins. It's widely used and well supported by the open source community. The Azure Data Explorer output plugin serves as the connector from Telegraf and supports ingestion of data from many types of input plugins into Azure Data Explorer.
* **Type:** Ingestion
* **Ingestion type supported:** Batching, Streaming
* **Functionality:** Telemetry, Logs, Metrics
* **Underlying SDK:** Go
* **Repository:** InfluxData - https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer
* **Documentation:** [Ingest data from Telegraf into Azure Data Explorer](ingest-data-telegraf.md)
* **Community Blog:**  [New Azure Data Explorer output plugin for Telegraf enables SQL monitoring at huge scale](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/new-azure-data-explorer-output-plugin-for-telegraf-enables-sql/ba-p/2829444)


## Event Hubs

* **Description:** 
* **Type:** 
* **Ingestion type supported:** 
* **Functionality:** 
* **Underlying SDK:** 
* **Repository:** 
* **Documentation:** 
* **Community Blog:**  


## Event Grid

* **Description:** 
* **Type:** 
* **Ingestion type supported:** 
* **Functionality:** 
* **Underlying SDK:** 
* **Repository:** 
* **Documentation:** 
* **Community Blog:**  


## IoT Hubs

* **Description:** 
* **Type:** 
* **Ingestion type supported:** 
* **Functionality:** 
* **Underlying SDK:** 
* **Repository:** 
* **Documentation:** 
* **Community Blog:**  

## 

* **Description:** 
* **Type:** 
* **Ingestion type supported:** 
* **Functionality:** 
* **Underlying SDK:** 
* **Repository:** 
* **Documentation:** 
* **Community Blog:**  
