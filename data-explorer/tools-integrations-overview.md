---
title: Overview of data connectors and integrations
description: Learn about the available data connectors and their capabilities.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/30/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-adx-fabric
# CustomerIntent: As a data ingestor, I want to know what data connectors are available, so that I can choose the right one for my use case.
---
# Data connectors and integrations overview

#### [Connectors](#tab/connectors)

::: zone pivot="azuredataexplorer"
Short blurb about this is a high level overview.

The following table summarizes the available connectors and their capabilities:

::: zone-end
::: zone pivot="fabric"

Short blurb about this is a high level overview.

The following table summarizes the available connectors and their capabilities:
::: zone-end
::: zone pivot="azuredataexplorer"

| Name                                     | Input   | Output  | Export  | Orchestrate | Query   |
| ---------------------------------------- | ------- | ------- | ------- | ----------- | ------- |
| Apache Kafka                             | &check; |         |         |             |         |
| Apache Flink                             | &check; |         |         |             |         |
| Apache Log4J 2                           | &check; |         |         |             |         |
| Apache Spark                             | &check; |         | &check; |             | &check; |
| Apache Spark for Azure Synapse Analytics | &check; |         | &check; |             | &check; |
| Azure Cosmos DB                          | &check; |         |         |             |         |
| Azure Data Factory                       | &check; |         |         | &check;     |         |
| Azure Event Grid                         |         |         |         | &check;     |         |
| Azure Event Hubs                         | &check; |         |         |             |         |
| Azure Functions                          | &check; | &check; |         |             | &check; |
| Azure IoT Hubs                           | &check; |         |         |             |         |
| Azure Stream Analytics                   | &check; |         |         |             |         |
| Fluent Bit                               |         |         |         |             |         |
| Logstash                                 | &check; |         |         |             |         |
| NLog                                     |         |         |         |             | &check; |
| Open Telemetry                           | &check; |         |         |             |         |
| Power Apps                               | &check; | &check; |         |             | &check; |
| Power Automate                           | &check; | &check; |         | &check;     | &check; |
| Serilog                                  | &check; |         |         |             |         |
| Telegraf                                 | &check; |         |         |             |         |
| Splunk                                   |         |         |         |             |         |
| Telegraf                                 |         |         |         |             |         |
| ODBC                                     |         |         |         |             | &check; |
| JDBC                                     |         |         |         | &check;     |         |


::: zone-end
::: zone pivot="fabric"

| Name                                                                                  | Input | Output | Export | Orchestrate | Query |
| ------------------------------------------------------------------------------------- | ----- | ------ | ------ | ----------- | ----- |
| [Apache Kafka](#apache-kafka)                                                         |       |        |        |             |       |
| [Apache Flink](#apache-flink)                                                         |       |        |        |             |       |
| [Apache Log4J 2](#apache-log4j-2)                                                     |       |        |        |             |       |
| [Apache Spark](#apache-spark)                                                         |       |        |        |             |       |
| [Apache Spark for Azure Synapse Analytics](#apache-spark-for-azure-synapse-analytics) |       |        |        |             |       |
| [Azure Cosmos DB](#azure-cosmos-db)                                                   |       |        |        |             |       |
| [Azure Data Factory](#azure-data-factory)                                             |       |        |        |             |       |
| [Azure Event Grid](#azure-event-grid)                                                 |       |        |        |             |       |
| [Azure Event Hubs](#azure-event-hubs)                                                 |       |        |        |             |       |
| [Azure Functions](#azure-functions)                                                   |       |        |        |             |       |
| [Azure IoT Hubs](#azure-iot-hubs)                                                     |       |        |        |             |       |
| [Azure Stream Analytics](#azure-stream-analytics)                                     |       |        |        |             |       |
| [Logstash](#logstash)                                                                 |       |        |        |             |       |
| [NLog](#nlog)                                                                         |       |        |        |             |       |
| [Open Telemetry](#open-telemetry)                                                     |       |        |        |             |       |
| [Power Automate](#power-automate)                                                     |       |        |        |             |       |
| [Serilog](#serilog)                                                                   |       |        |        |             |       |
| [Telegraf](#telegraf)                                                                 |       |        |        |             |       |

::: zone-end

#### [Tools and integrations](#tab/integrations)

| Name                                    | Ingestion | Query   | Share   | Source control | Secure  | Administration | Visualization |
| --------------------------------------- | --------- | ------- | ------- | -------------- | ------- | -------------- | ------------- |
| DeltaKusto                              |           |         |         | &check;        |         |                |               |
| Lightingest                             | &check;   |         |         |                |         |                |               |
| Azure CLI                               |           |         |         |                |         | &check;        |               |
| Azure Synapse Analytics                 | &check;   | &check; |         |                |         |                |               |
| Azure Data Lake                         | &check;   |         |         |                |         |                |               |
| Azure Data Studio                       |           | &check; |         |                |         |                |               |
| Azure Data Share                        |           |         | &check; |                |         |                |               |
| Azure Monitor                           |           |         |         |                |         |                | &check;       |
| Azure Notebooks                         |           | &check; |         |                |         |                |               |
| Azure Pipelines                         |           |         |         | &check;        |         |                |               |
| Jupyter Notebooks                       |           | &check; |         |                |         |                | &check;       |
| KQL Parser                              |           | &check; |         |                |         |                |               |
| Kusto.Explorer                          |           | &check; |         |                |         |                | &check;       |
| Kusto CLI                               |           | &check; |         |                |         | &check;        |               |
| Microsoft Purview                       |           |         |         |                | &check; |                |               |
| Monaco editor (plugin/embed)            |           | &check; |         |                |         |                |               |
| PowerShell                              |           |         |         |                |         | &check;        |               |
| Real-Time Analytics in Microsoft Fabric | &check;   | &check; |         |                |         |                | &check;       |
| SyncKusto                               |           |         |         | &check;        |         |                |               |
| Web UI "Get data"                       | &check;   |         |         |                |         |                |               |
| Web UI query editor                     |           | &check; |         |                |         |                | &check;       |

---
