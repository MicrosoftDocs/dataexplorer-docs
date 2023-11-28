---
title: Overview of data connectors and integrations
description: Learn about the available data connectors and their capabilities.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/26/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-adx-fabric
# CustomerIntent: As a data ingestor, I want to know what data connectors are available, so that I can choose the right one for my use case.
---
# Data connectors and integrations overview

#### [Connectors](#tab/connectors)

::: zone pivot="azuredataexplorer"
[Data ingestion](ingest-data-overview.md) Data ingestion is the process used to load data from one or more sources into Azure Data Explorer. Once ingested, the data becomes available for [query](kusto/query/index.md). Azure Data Explorer provides several connectors for data ingestion.
::: zone-end
::: zone pivot="fabric"
Data ingestion is the process used to load data from one or more sources into a Real-Time Analytics KQL database in Microsoft Fabric. Once ingested, the data becomes available for [query](kusto/query/index.md?context=/fabric/context/context-rta&pivots=fabric). Real-Time Analytics provides several connectors for data ingestion.

The following table summarizes the available connectors and their capabilities:
::: zone-end
::: zone pivot="azuredataexplorer"

| Name | Input | Output | Export | Orchestrate | Query | Visualize |
|--|--|--|--|--|--|--|
| [Apache Kafka](#apache-kafka) | &check; | | | | | |
| [Apache Flink](#apache-flink) | &check; | | | | | |
| [Apache Log4J 2](#apache-log4j-2) | &check;
| [Apache Spark](#apache-spark) |  &check; | | &check; | |&check; | 
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) |  &check; | | &check; | |&check; | 
| [Azure Cosmos DB](#azure-cosmos-db) | &check; |
| [Azure Data Factory](#azure-data-factory) | &check; | | | &check; |
| [Azure Event Grid](#azure-event-grid) | | | | &check; |
| [Azure Event Hubs](#azure-event-hubs) |  &check; |
| [Azure Functions](#azure-functions) | &check; | &check; | | | &check; |
| [Azure IoT Hubs](#azure-iot-hubs) | &check; |
| [Azure Stream Analytics](#azure-stream-analytics) | &check; | 
| [Fluent Bit](#fluent-bit) | 
| [Logstash](#logstash) | &check; |
| [NLog](#nlog) | | | | | &check; |
| [Open Telemetry](#open-telemetry) | &check; |
| Power Apps | &check; | &check; | | | &check; |
| [Power Automate](#power-automate) | &check; | &check; | | &check; | &check; |
| [Serilog](#serilog) | &check; |
| Telegraf | &check; |
| [Splunk](#splunk) | 
| [Telegraf](#telegraf) | 
| ODBC |  | | | | &check; |
| JDBC | | | | &check; |
::: zone-end
::: zone pivot="fabric"



| Name | Input | Output | Export | Orchestrate | Query | Visualize |
|--|--|--|--|--|--|--|
| [Apache Kafka](#apache-kafka) | 
| [Apache Flink](#apache-flink) | 
| [Apache Log4J 2](#apache-log4j-2) | 
| [Apache Spark](#apache-spark) | 
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) | 
| [Azure Cosmos DB](#azure-cosmos-db) | 
| [Azure Data Factory](#azure-data-factory) | 
| [Azure Event Grid](#azure-event-grid) | 
| [Azure Event Hubs](#azure-event-hubs) | 
| [Azure Functions](#azure-functions) | 
| [Azure IoT Hubs](#azure-iot-hubs) | 
| [Azure Stream Analytics](#azure-stream-analytics) | 
| [Logstash](#logstash) | 
| [NLog](#nlog) | 
| [Open Telemetry](#open-telemetry) | 
| [Power Automate](#power-automate) | 
| [Serilog](#serilog) | 
| [Telegraf](#telegraf) | 

::: zone-end

#### [Tools and integrations](#tab/integrations)

| Name | Ingestion | Query | Share | Source control | Secure | Administration |
|--|--|--|--|--|--|--|
| DeltaKusto | | | |&check; | | 
| Lightingest | &check; |
| Azure CLI | | | | | | &check;
| Azure Synapse Analytics |  
| Azure Data Lake |
| Azure Data Studio |
| Azure Data Share |
| Azure Monitor |
| Azure Notebooks |
| Azure Pipelines |
| Jupyter Notebooks |
| KQL Parser |
| Kusto.Explorer |
| Kusto CLI |
| Microsoft Purview |
| Monaco editor (plugin/embed) |
| Power Shell |
| Real-Time Analytics in Microsoft Fabric |
| SyncKusto |
| Web UI "Get data" |
| Web UI query editor |

---
