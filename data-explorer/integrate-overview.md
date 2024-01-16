---
title: Overview of connectors, tools, and integrations
description: Learn about the available data connectors, toold, and integrations, and their capabilities.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 01/16/2024
---
# Connectors, tools, and integrations overview

There are many data connectors, tools, and integrations that work seamlessly with the platform for ingestion, orchestration, output, and data query. This document is a high level overview about the availale connectors, tools, and integrations. Detailed information is provided for each connector, as well as links to their full documentation.

For overview pages on a specific type of connector, select one of the following buttons.

:::row:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Data integrations](integrate-data-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Query integrations](integrate-query-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Visualize integrations](integrate-visualize-overview.md)
   :::column-end:::
:::row-end:::

## Comparison tables

The following tables summarize the capabilities of each item. Select the tab corresponding to connectors or tools and integrations. Each item name is linked to its detailed description, which can also be found [below](#detailed-descriptions).

### [Connectors](#tab/connectors)

The following table summarizes the available connectors and their capabilities:

| Name                                                                                  | Input   | Output  | Export  | Orchestrate | Query   |
| ------------------------------------------------------------------------------------- | ------- | ------- | ------- | ----------- | ------- |
| [Apache Kafka](#apache-kafka)                                                         | :heavy_check_mark: |         |         |             |         |
| [Apache Flink](#apache-flink)                                                         | :heavy_check_mark: |         |         |             |         |
| [Apache Log4J 2](#apache-log4j-2)                                                     | :heavy_check_mark: |         |         |             |         |
| [Apache Spark](#apache-spark)                                                         | :heavy_check_mark: |         | :heavy_check_mark: |             | :heavy_check_mark: |
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) | :heavy_check_mark: |         | :heavy_check_mark: |             | :heavy_check_mark: |
| [Azure Cosmos DB](#azure-cosmos-db)                                                   | :heavy_check_mark: |         |         |             |         |
| [Azure Data Factory](#azure-data-factory)                                             | :heavy_check_mark: |         |         | :heavy_check_mark:     |         |
| [Azure Event Grid](#azure-event-grid)                                                 |         |         |         | :heavy_check_mark:     |         |
| [Azure Event Hubs](#azure-event-hubs)                                                 | :heavy_check_mark: |         |         |             |         |
| [Azure Functions](#azure-functions)                                                   | :heavy_check_mark: | :heavy_check_mark: |         |             | :heavy_check_mark: |
| [Azure IoT Hubs](#azure-iot-hubs)                                                     | :heavy_check_mark: |         |         |             |         |
| [Azure Stream Analytics](#azure-stream-analytics)                                     | :heavy_check_mark: |         |         |             |         |
| [Fluent Bit](#fluent-bit)                                                             |         |         |         |             |         |
| [Logic Apps](#logic-apps)                                                             |         |         |         |             | :heavy_check_mark: |
| [Logstash](#logstash)                                                                 | :heavy_check_mark: |         |         |             |         |
| [Matlab](#matlab)                                                                     |         |         |         |             | :heavy_check_mark: |
| [NLog](#nlog)                                                                         |         |         |         |             | :heavy_check_mark: |
| [Open Telemetry](#open-telemetry)                                                     | :heavy_check_mark: |         |         |             |         |
| [Power Apps](#power-apps)                                                             | :heavy_check_mark: | :heavy_check_mark: |         |             | :heavy_check_mark: |
| [Power Automate](#power-automate)                                                     | :heavy_check_mark: | :heavy_check_mark: |         | :heavy_check_mark:     | :heavy_check_mark: |
| [Serilog](#serilog)                                                                   | :heavy_check_mark: |         |         |             |         |
| [Splunk](#splunk)                                                                     |         |         |         |             |         |
| [Telegraf](#telegraf)                                                                 | :heavy_check_mark: |         |         |             |         |
| [ODBC](#odbc)                                                                         |         |         |         |             | :heavy_check_mark: |
| [JDBC](#jdbc)                                                                         |         |         |         |             | :heavy_check_mark: |

### [Tools and integrations](#tab/integrations)

The following table summarizes the available tools and integrations and their capabilities:

| Name                                                                                | Ingest             | Query              | Share              | Source control     | Secure             | Administrate       | Visualize          |
| ----------------------------------------------------------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| [Azure CLI](#azure-cli)                                                             |                    |                    |                    |                    |                    | :heavy_check_mark: |                    |
| [Azure Synapse Analytics](#azure-synapse-analytics)                                 | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [Azure Data Lake](#azure-data-lake)                                                 | :heavy_check_mark: |                    |                    |                    |                    |                    |                    |
| [Azure Data Studio](#azure-data-studio)                                             |                    | :heavy_check_mark: |                    |                    |                    |                    |                    |
| [Azure Data Share](#azure-data-share)                                               |                    |                    | :heavy_check_mark: |                    |                    |                    |                    |
| [Azure Monitor](#azure-monitor)                                                     | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [Azure Notebooks](#azure-notebooks)                                                 |                    | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [Azure Pipelines](#azure-pipelines)                                                 |                    |                    |                    | :heavy_check_mark: |                    |                    |                    |
| [DeltaKusto](#deltakusto)                                                           |                    |                    |                    | :heavy_check_mark: |                    |                    |                    |
| [Jupyter Notebooks](#jupyter-notebooks)                                             |                    | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [KQL Parser](#kql-parser)                                                           |                    | :heavy_check_mark: |                    |                    |                    |                    |                    |
| [Kusto.Explorer](#kustoexplorer)                                                    |                    | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [Kusto CLI](#kusto-cli)                                                             | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    | :heavy_check_mark: |                    |
| [Lightingest](#lightingest)                                                         | :heavy_check_mark: |                    |                    |                    |                    |                    |                    |
| [Microsoft Purview](#microsoft-purview)                                             |                    |                    |                    |                    | :heavy_check_mark: |                    |                    |
| [Monaco editor](#monaco-editor-pluginembed)                                         |                    | :heavy_check_mark: |                    |                    |                    |                    |                    |
| [PowerShell](#powershell)                                                           |                    |                    |                    |                    |                    | :heavy_check_mark: |                    |
| [Real-Time Analytics in Microsoft Fabric](#real-time-analytics-in-microsoft-fabric) | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| [SyncKusto](#synckusto)                                                             |                    |                    |                    | :heavy_check_mark: |                    |                    |                    |
| [Web UI](#web-ui)                                                                   | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |


---

## Detailed descriptions

Brief blurb about the following:

### [Connectors](#tab/connectors)

### Apache Kafka

[Apache Kafka](https://kafka.apache.org/documentation/) is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. Kafka Connect is a tool for scalable and reliable streaming of data between Apache Kafka and other data systems. The Kafka Sink serves as the connector from Kafka and doesn't require using code. This is gold certified by Confluent - has gone through comprehensive review and testing for quality, feature completeness, compliance with standards, and for performance.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs, Telemetry, Time series
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/kafka-sink-azure-kusto/
* **Documentation:** [Ingest data from Apache Kafka](ingest-data-kafka.md)
* **Community Blog:** [Kafka ingestion into Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/kafka-ingestion-into-azure-data-explorer-part-1/ba-p/1452439)

### Apache Flink

[Apache Flink](https://flink.apache.org/) is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. The connector implements data sink for moving data across Azure Data Explorer and Flink clusters. Using Azure Data Explorer and Apache Flink, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics.

* **Functionality:** Ingestion

* **Ingestion type supported:** Streaming
* **Use cases:** Telemetry
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/flink-connector-kusto/
* **Documentation:** [Ingest data from Apache Flink](ingest-data-flink.md)

### Apache Log4J 2

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Apache Log4J 2 sink allows you to stream your log data to your database, where you can analyze and visualize your logs in real time.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-log4j
* **Documentation:** [Ingest data with the Apache Log4J 2 connector](apache-log4j2-connector.md)
* **Community Blog:** [Getting started with Apache Log4J and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-apache-log4j-and-azure-data-explorer/ba-p/3705242)

### Apache Spark

[Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing. The [Spark connector](spark-connector.md) is an open source project that can run on any Spark cluster. It implements data source and data sink for moving data to or from Spark clusters. Using the Apache Spark connector, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, your database becomes a valid data store for standard Spark source and sink operations, such as read, write, and writeStream.

* **Functionality:** Ingestion, Export

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-spark/
* **Documentation:** [Apache Spark connector](spark-connector.md)
* **Community Blog:** [Data preprocessing for Azure Data Explorer for Azure Data Explorer with Apache Spark](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/data-pre-processing-for-azure-data-explorer-with-apache-spark/ba-p/2727993/)

### Apache Spark for Azure Synapse Analytics

[Apache Spark](https://spark.apache.org/) is a parallel processing framework that supports in-memory processing to boost the performance of big data analytic applications. [Apache Spark in Azure Synapse](/azure/synapse-analytics/spark/apache-spark-overview) Analytics is one of Microsoft's implementations of Apache Spark in the cloud. You can access a database from [Synapse Studio](/azure/synapse-analytics/) with Apache Spark for Azure Synapse Analytics.

* **Functionality:** Ingestion, Export

* **Ingestion type supported:** Batching
* **Use cases:** Telemetry
* **Documentation:** [Connect to an Azure Synapse workspace](/azure/synapse-analytics/quickstart-connect-azure-data-explorer)

### Azure Cosmos DB

The [Azure Cosmos DB](/azure/cosmos-db/) change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your database.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Change feed
* **Documentation:** [Ingest data from Azure Cosmos DB (Preview)](ingest-data-cosmos-db-connection.md)

### Azure Data Factory

[Azure Data Factory](/azure/data-factory) (ADF) is a cloud-based data integration service that allows you to integrate different data stores and perform activities on the data.

* **Functionality:** Ingestion, Export

* **Ingestion type supported:** Batching
* **Use cases:** Data orchestration
* **Documentation:** [Copy data to your database by using Azure Data Factory](data-factory-load-data.md)

### Azure Event Grid

Event Grid ingestion is a pipeline that listens to Azure storage, and updates your database to pull information when subscribed events occur. You can configure continuous ingestion from Azure Storage (Blob storage and ADLSv2) with an [Azure Event Grid](/azure/event-grid/overview) subscription for blob created or blob renamed notifications and streaming the notifications via Azure Event Hubs.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Event processing
* **Documentation:** [Event Grid data connection](ingest-data-event-grid-overview.md)

### Azure Event Hubs

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. You can configure continuous ingestion from customer-managed Event Hubs.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Documentation:** [Azure Event Hubs data connection](ingest-data-event-hub-overview.md)

### Azure Functions

[Azure Functions](/azure/azure-functions/functions-overview) allow you to run serverless code in the cloud on a schedule or in response to an event. With input and output bindings for Azure Functions, you can integrate your database into your workflows to ingest data and run queries against your database.

* **Functionality:** Ingestion, Export

* **Ingestion type supported:** Batching
* **Use cases:** Workflow integrations.
* **Documentation:** [Integrating Azure Functions using input and output bindings (preview)](integrate-azure-functions.md)

### Azure IoT Hubs

[Azure IoT Hub](/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. You can configure continuous ingestion from customer-managed IoT Hubs, using its [Event Hubs compatible built in endpoint of device-to-cloud messages](/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:**  IoT data
* **Documentation:** [IoT Hub data connection](ingest-data-iot-hub-overview.md)

### Azure Stream Analytics

[Azure Stream Analytics](/azure/stream-analytics/stream-analytics-introduction) is a real-time analytics and complex event-processing engine that's designed to process high volumes of fast streaming data from multiple sources simultaneously.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Event processing
* **Documentation:** [Ingest data from Azure Stream Analytics](stream-analytics-connector.md)

### Fluent Bit

[Fluent Bit](https://fluentbit.io/) is an open-source agent that collects logs, metrics, and traces from various sources. It allows you to filter, modify, and aggregate event data before sending it to storage.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs, Metrics, Traces
* **Repository:** [fluent-bit](https://github.com/fluent/fluent-bit)
* **Documentation:** [Ingest data with Fluent Bit into Azure Data Explorer](fluent-bit.md)

### JDBC

Java Database Connectivity (JDBC) is a Java API used to connect to databases and execute queries. You can use JDBC to connect to Azure Data Explorer.

* **Functionality:** Query, visualization

* **Ingestion type supported:**
* **Use cases:**
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** 
* **Documentation:** [Connect to Azure Data Explorer with JDBC](connect-jdbc.md)
* **Community Blog:**

### Logic Apps

The [Microsoft Logic Apps](/azure/logic-apps/logic-apps-what-are-logic-apps) connector allows you to run queries and commands automatically as part of a scheduled or triggered task.

* **Functionality:** Query and commands

* **Ingestion type supported:** Batching
* **Use cases:** 
* **Documentation:** [Microsoft Logic Apps and Azure Data Explorer](kusto/tools/logicapps.md)

### Logstash

[The Logstash plugin](ingest-data-logstash.md) enables you to process events from Logstash into an Azure Data Explorer database for later analysis.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching
* **Use cases:** Logs
* **Underlying SDK:** [Java](kusto/api/java/kusto-java-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/logstash-output-kusto/
* **Documentation:** [Ingest data from Logstash](ingest-data-logstash.md)
* **Community Blog:** [How to migrate from Elasticsearch to Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/how-to-migrate-from-elasticsearch-to-azure-data-explorer/ba-p/1621539/)

### Matlab

MATLAB is a programming and numeric computing platform used to analyze data, develop algorithms, and create models. You can get an authorization token in MATLAB for querying your data in Azure Data Explorer.

* **Functionality:** Query

* **Documentation:** [Query data using MATLAB](query-matlab.md)
* **Community Blog:**

### NLog

NLog is a flexible and free logging platform for various .NET platforms, including .NET standard. NLog allows you to write to several targets, such as a database, file, or console. With NLog you can change the logging configuration on-the-fly. The NLog sink is a target for NLog that allows you to send your log messages to your database. The plugin provides an efficient way to sink your logs to your cluster.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry, Logs, Metrics
* **Underlying SDK:** [.NET](kusto/api/netfx/about-the-sdk.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-nlog-sink
* **Documentation:** [Ingest data with the NLog sink](nlog-sink.md)
* **Community Blog:** [Getting started with NLog sink and Azure Data Explorer](https://aka.ms/adx-docs-nlog-blog)

### ODBC

Open Database Connectivity ([ODBC](/sql/odbc/reference/odbc-overview)) is a widely accepted application programming interface (API) for database access. Azure Data Explorer is compatible with a subset of the SQL Server communication protocol (MS-TDS). This compatibility enables the use of the ODBC driver for SQL Server with Azure Data Explorer.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry, Logs, Metrics
* **Underlying SDK:** 
* **Repository:** 
* **Documentation:** [Connect to Azure Data Explorer with ODBC](connect-odbc.md)
* **Community Blog:**



### Open Telemetry

[The OpenTelemetry connector](open-telemetry-connector.md) supports ingestion of data from many receivers into your database. It works as a bridge to ingest data generated by Open telemetry to your database by customizing the format of the exported data according to your needs.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Traces, Metrics, Logs
* **Underlying SDK:** [Go](kusto/api/golang/kusto-golang-client-library.md)
* **Repository:** Open Telemetry - https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter
* **Documentation:** [Ingest data from OpenTelemetry](open-telemetry-connector.md)
* **Community Blog:** [Getting started with Open Telemetry and Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-open-telemetry-and-azure-data-explorer/ba-p/3675708)

### Power Apps


### Power Automate

[Power Automate](/power-automate/getting-started) is an orchestration service used to automate business processes. The :::no-loc text="Power Automate"::: (previously Microsoft Flow) connector enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task.

* **Functionality:** Ingestion, Export

* **Ingestion type supported:** Batching
* **Use cases:** Data orchestration
* **Documentation:** [Microsoft Power Automate connector](flow.md)

### Serilog

Serilog is a popular logging framework for .NET applications. Serilog allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Serilog sink, also known as an appender, streams your log data to your database, where you can analyze and visualize your logs in real time.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Logs
* **Underlying SDK:** [.NET](kusto/api/netfx/about-the-sdk.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/serilog-sinks-azuredataexplorer
* **Documentation:** [Ingest data with the Serilog sink](serilog-sink.md)
* **Community Blog:** [Getting started with Serilog sink and Azure Data Explorer](https://go.microsoft.com/fwlink/p/?linkid=2227749)

### Splunk

[Splunk Enterprise](https://www.splunk.com/en_us/products/splunk-enterprise.html) is a software platform that allows you to ingest data from many sources simultaneously.The [Azure Data Explorer add-on](https://splunkbase.splunk.com/app/6979) sends data from Splunk to a table in your cluster.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching
* **Use cases:** Logs
* **Underlying SDK:** [Python](kusto/api/python/kusto-python-client-library.md)
* **Repository:** Microsoft Azure - https://github.com/Azure/azure-kusto-splunk
* **Documentation:** [Ingest data from Splunk](ingest-data-splunk.md)
* **Splunk Base:** [Microsoft Azure Data Explorer Add-On for Splunk](https://splunkbase.splunk.com/app/6979)
* **Community Blog:** [Getting started with Microsoft Azure Data Explorer Add-On for Splunk](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/getting-started-with-microsoft-azure-data-explorer-add-on-for/ba-p/3917176)

### Telegraf

Telegraf is an open source, lightweight, minimal memory foot print agent for collecting, processing and writing telemetry data including logs, metrics, and IoT data. Telegraf supports hundreds of input and output plugins. It's widely used and well supported by the open source community. The output plugin serves as the connector from Telegraf and supports ingestion of data from many types of input plugins into your database.

* **Functionality:** Ingestion

* **Ingestion type supported:** Batching, Streaming
* **Use cases:** Telemetry, Logs, Metrics
* **Underlying SDK:** Go
* **Repository:** InfluxData - https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer
* **Documentation:** [Ingest data from Telegraf](ingest-data-telegraf.md)
* **Community Blog:**  [New Azure Data Explorer output plugin for Telegraf enables SQL monitoring at huge scale](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/new-azure-data-explorer-output-plugin-for-telegraf-enables-sql/ba-p/2829444)

### [Tools and integrations](#tab/integrations)



* **Functionality:** Ingestion

* **Ingestion type supported:**
* **Use cases:** 
* **Documentation:**
* **Community Blog:** 



### Azure CLI

### Azure Synapse Analytics


### Azure Data Lake

[Azure Data Lake](data-lake-query-data.md)

### Azure Data Studio 

Azure Data Studio: [Kusto extension overview](/sql/azure-data-studio/extensions/kusto-extension?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), [use Kusto](/sql/azure-data-studio/notebooks/notebooks-kusto-kernel?context=%252fazure%252fdata-explorer%252fcontext%252fcontext), and [use Kqlmagic](/sql/azure-data-studio/notebooks-kqlmagic?context=%252fazure%252fdata-explorer%252fcontext%252fcontext)

### Azure Data Share

[Azure Data Share](data-share.md)

### Azure Monitor

[Azure Monitor](query-monitor-data.md)


### Azure Notebooks

[Azure Notebooks](/sql/azure-data-studio/notebooks/notebooks-kqlmagic?context=%252fazure%252fdata-explorer%252fcontext%252fcontext%253fcontext%253d%252fazure%252fdata-explorer%252fcontext%252fcontext)

### Azure Pipelines

[Azure Pipelines](devops.md)

### DeltaKusto

[Delta Kusto](https://github.com/microsoft/delta-kusto)

### Jupyter Notebooks

[Jupyter Notebooks](kqlmagic.md)


### KQL Parser

[Kusto Query Language parser](https://github.com/microsoft/Kusto-Query-Language) - A .NET core repository for the Kusto Query Language parser and semantic tree.


### Kusto.Explorer  

[installation and user interface](kusto/tools/kusto-explorer.md), [using Kusto.Explorer](kusto/tools/kusto-explorer-using.md)
  * Additional topics include [options](kusto/tools/kusto-explorer-options.md), [troubleshooting](kusto/tools/kusto-explorer-troubleshooting.md), [keyboard shortcuts](kusto/tools/kusto-explorer-shortcuts.md), [code features](kusto/tools/kusto-explorer-code-features.md)


### Kusto CLI

[Kusto CLI](kusto/tools/kusto-cli.md)


### Lightingest

[LightIngest](https://github.com/Azure/Kusto-Lightingest/blob/main/README.md): a command-line utility for ad-hoc data ingestion into Azure Data Explorer. For more information, see [Use LightIngest to ingest data](lightingest.md)                            

### Microsoft Purview


### Monaco editor (plugin/embed)

[Kusto Query Language setup and usage for the Monaco editor](./kusto/api/monaco/monaco-kusto.md) - The Kusto Query Language editor that can be embedded in web and electron based applications.
  * [Kusto Query Language plugin](https://github.com/Azure/monaco-kusto) - Access the Kusto Query Language editor plugin.
  * [Embedding the Azure Data Explorer web UI](./kusto/api/monaco/host-web-ux-in-iframe.md) - The Azure Data Explorer web UI can be embedded in an iframe and hosted in third-party websites.


### PowerShell


### Real-Time Analytics in Microsoft Fabric


### SyncKusto

[Sync Kusto](kusto/tools/synckusto.md)


### Web UI

Ingestion wizard: [overview](./ingest-data-wizard.md) and ingest data [from a container to a new table](/azure/data-explorer/ingest-from-container)
or [from a local file to an existing table](/azure/data-explorer/ingest-from-local-file)

[Azure Data Explorer web UI](web-query-data.md)

---

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Query integrations overview](integrate-query-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
