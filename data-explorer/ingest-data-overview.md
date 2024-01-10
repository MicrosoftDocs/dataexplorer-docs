---
title: Azure Data Explorer data ingestion overview
description: Learn about the different ways you can ingest (load) data in Azure Data Explorer
ms.reviewer: akshay.dixit
ms.topic: conceptual
ms.date: 01/10/2024
---

# Azure Data Explorer data ingestion overview

Data ingestion involves loading data into a table in your cluster. Azure Data Explorer ensures data validity, converts formats as needed, and performs manipulations like schema matching, organization, indexing, encoding, and compression. Once ingested, data is available for query.

Azure Data Explorer offers one-time ingestion or the establishment of a continuous ingestion pipeline, using either streaming or queued ingestion. To determine which is right for you, see [One-time data ingestion](#one-time-data-ingestion) and [Continuous ingestion](#continuous-data-ingestion).

> [!NOTE]
> Data is persisted in storage according to the set [retention policy](kusto/management/retention-policy.md).

## One-time data ingestion

One-time ingestion is helpful for the transfer of historical data, filling in missing data, and the initial stages of prototyping and data analysis. This approach facilitates fast data integration without the need for a continuous pipeline commitment.

There are multiple ways to perform one-time data ingestion. Use the following decision tree to determine the most suitable option for your use case:

:::image type="complex" source="media/ingest-data-overview/one-time-ingestion.png" lightbox="media/ingest-data-overview/one-time-ingestion.png" alt-text="Flow chart for one-time ingestion decision making.":::
   "Diagram that acts as a decision tree for one-time ingestion. If you're ingesting historical data, you should follow the guidance in the Ingest historical data document. If you're not ingesting historical data, and the data is in a supported data format, we recommend using the Get data experience. If the data is in an unsupported format, you can integrate with Azure Data Factory or write your own custom code using the Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::

For more information, see the relevant documentation:

| Callout | Relevant documentation |
|--|--|
| :::image type="icon" source="media/ingest-data-overview/callout-A.png" alt-text="Screenshot of decision tree callout A."::: | See the [data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-B.png" alt-text="Screenshot of decision tree callout B."::: | See the [file formats supported for Azure Data Factory pipelines](/azure/data-explorer/ingestion-supported-formats). |
| :::image type="icon" source="media/ingest-data-overview/callout-1.png" alt-text="Screenshot of decision tree callout #1."::: | To import data from an existing storage system, see [How to ingest historical data into Azure Data Explorer](ingest-data-historical.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-2.png" alt-text="Screenshot of decision tree callout #2."::: | In the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home), you can get data from a [local file](get-data-file.md), [Amazon S3](get-data-amazon-s3.md), or [Azure Storage](get-data-storage.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-3.png" alt-text="Screenshot of decision tree callout #3."::: | To integrate with Azure Data Factory, see [Copy data to Azure Data Explorer by using Azure Data Factory](data-factory-load-data.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-4.png" alt-text="Screenshot of decision tree callout #4."::: | [Kusto client libraries](kusto/api/client-libraries.md) are available for C#, Python, Java, JavaScript, TypeScript, and Go. You can write code to manipulate your data and then use the Kusto Ingest library to ingest data into your Azure Data Explorer table. The data must be in one of the [supported formats](ingestion-supported-formats.md) prior to ingestion. |

## Continuous data ingestion

Continuous ingestion excels in situations demanding immediate insights from live data. For example, continuous ingestion is useful for monitoring systems, log and event data, and real-time analytics.

Continuous data ingestion involves setting up an ingestion pipeline with either streaming or queued ingestion:

* **Streaming ingestion**: This method ensures near-real-time latency for small sets of data per table. Data is ingested in micro batches from a streaming source, initially placed in the row store, and then transferred to column store extents. For more information, see [Configure streaming ingestion](ingest-data-streaming.md).

* **Queued ingestion**: This method is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches then merged and optimized for fast query results. By default, the maximum queued values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see [Ingestion batching policy](kusto/management/batching-policy.md).

> [!NOTE]
> For most scenarios, we recommend using queued ingestion as it is the more performant option.

There are multiple ways to configure continuous data ingestion. Use the following decision tree to determine the most suitable option for your use case:

:::image type="complex" source="media/ingest-data-overview/continuous-ingestion.png" lightbox="media/ingest-data-overview/continuous-ingestion.png" alt-text="Flow chart for continuous ingestion decision making.":::
    "Flow chart for continuous ingestion decision making. First, determine the type and location of your data. For event data, you can create an Event Hubs data connection or ingest data with Apache Kafka. For IoT data, you can create an IoT Hubs data connection. For data in Azure Storage, you can create an Event Grid data connection. For data stored in other places, check the connectors overview to see if there's a dedicated connector that can fit your use case. If so, follow the guidance to use that connector. If not, write custom code using Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::

For more information, see the relevant documentation:

| Callout | Relevant documentation |
|--|--|
| :::image type="icon" source="media/ingest-data-overview/callout-A.png" alt-text="Screenshot of continuous decision tree callout A."::: | For a list of connectors, see [Connectors overview](connector-overview.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-1.png" alt-text="Screenshot of continuous decision tree callout #1."::: | [Create an Event Hubs data connection](create-event-hubs-connection.md). Integration with Event Hubs provides services such as throttling, retries, monitoring, and alerts. |
| :::image type="icon" source="media/ingest-data-overview/callout-2.png" alt-text="Screenshot of continuous decision tree callout #2."::: | [Ingest data from Apache Kafka](ingest-data-kafka.md), a distributed streaming platform for building real-time streaming data pipelines. |
| :::image type="icon" source="media/ingest-data-overview/callout-3.png" alt-text="Screenshot of continuous decision tree callout #3."::: | [Create an IoT Hub data connection](create-iot-hub-connection.md). Integration with IoT Hubs provides services such as throttling, retries, monitoring, and alerts. |
| :::image type="icon" source="media/ingest-data-overview/callout-4.png" alt-text="Screenshot of continuous decision tree callout #4."::: | [Create an Event Grid data connection](create-event-grid-connection.md). Integration with Event Grid provides services such as throttling, retries, monitoring, and alerts. |
| :::image type="icon" source="media/ingest-data-overview/callout-5.png" alt-text="Screenshot of continuous decision tree callout #5."::: | See the guidance for the relevant connector, such as Apache Spark, Apache Kafka, Azure Cosmos DB, Fluent Bit, Logstash, Open Telemetry, Power Automate, Splunk, and more. For more information, see [Connectors overview](connector-overview.md). |
| :::image type="icon" source="media/ingest-data-overview/callout-6.png" alt-text="Screenshot of continuous decision tree callout #6."::: | [Kusto client libraries](kusto/api/client-libraries.md) are available for C#, Python, Java, JavaScript, TypeScript, and Go. You can write code to manipulate your data and then use the Kusto Ingest library to ingest data into your Azure Data Explorer table. The data must be in one of the [supported formats](ingestion-supported-formats.md) prior to ingestion. |

> [!NOTE]
> Streaming ingestion isn't supported for all ingestion methods. For support details, check the documentation for the specific ingestion method.

## Direct ingestion with management commands

Azure Data Explorer offers the following ingestion management commands, which ingest data directly to your cluster instead of using the data management service. They should be used only for exploration and prototyping and not in production or high-volume scenarios.

* **Inline ingestion**: The [.ingest inline command](kusto/management/data-ingestion/ingest-inline.md) contains the data to ingest being a part of the command text itself. This method is intended for improvised testing purposes.
* **Ingest from query**: The [.set, .append, .set-or-append, or .set-or-replace commands](kusto/management/data-ingestion/ingest-from-query.md) indirectly specifies the data to ingest as the results of a query or a command.
* **Ingest from storage**: The [.ingest into command](kusto/management/data-ingestion/ingest-from-storage.md) gets the data to ingest from external storage, such as Azure Blob Storage, accessible by your cluster and pointed-to by the command.

## Compare ingestion methods

The following table compares the main ingestion methods:

| Ingestion name | Data type | Maximum file size | Streaming, queued, direct | Most common scenarios | Considerations |
|--|--|--|--|--|--|
| [Apache Spark connector](spark-connector.md) | Every format supported by the Spark environment | Unlimited | Queued | Existing pipeline, preprocessing on Spark before ingestion, fast way to create a safe (Spark) streaming pipeline from the various sources the Spark environment supports. | Consider cost of Spark cluster. For batch write, compare with Azure Data Explorer data connection for Event Grid. For Spark streaming, compare with the data connection for event hub. |
| [Azure Data Factory (ADF)](data-factory-integration.md) | [Supported data formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | Unlimited. Inherits ADF restrictions. | Queued or per ADF trigger | Supports formats that are unsupported, such as Excel and XML, and can copy large files from over 90 sources, from on perm to cloud | This method takes relatively more time until data is ingested. ADF uploads all data to memory and then begins ingestion. |
| [Event Grid](ingest-data-event-grid-overview.md) | [Supported data formats](ingest-data-event-grid-overview.md#data-format) | 1 GB uncompressed | Queued | Continuous ingestion from Azure storage, external data in Azure storage | Ingestion can be triggered by blob renaming or blob creation actions |
| [Event Hub](ingest-data-event-hub-overview.md) | [Supported data formats](ingest-data-event-hub-overview.md#data-format) | N/A | Queued, streaming | Messages, events |  |
| [Get data experience](get-data-file.md) | *SV, JSON | 1 GB uncompressed | Queued or direct ingestion | One-off, create table schema, definition of continuous ingestion with Event Grid, bulk ingestion with container (up to 5,000 blobs; no limit when using historical ingestion) |  |
| [IoT Hub](ingest-data-iot-hub-overview.md) | [Supported data formats](ingest-data-iot-hub-overview.md#data-format) | N/A | Queued, streaming | IoT messages, IoT events, IoT properties |  |
| [Kafka connector](ingest-data-kafka.md) | Avro, ApacheAvro, JSON, CSV, Parquet, and ORC | Unlimited. Inherits Java restrictions. | Queued, streaming | Existing pipeline, high volume consumption from the source. | Preference can be determined by the existing use of a multiple producers or consumer service or the desired level of service management. |
| [Kusto client libraries](kusto/api/client-libraries.md) | [Supported data formats](ingestion-supported-formats.md) | 1 GB uncompressed | Queued, streaming, direct | Write your own code according to organizational needs | Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process. |
| [LightIngest](lightingest.md) | [Supported data formats](ingestion-supported-formats.md) | 1 GB uncompressed | Queued or direct ingestion | Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction) | Case-sensitive and space-sensitive |
| [Logic Apps](kusto/tools/logicapps.md) | [Supported data formats](ingestion-supported-formats.md) | 1 GB uncompressed | Queued | Used to automate pipelines | |
| [LogStash](ingest-data-logstash.md) | JSON | Unlimited. Inherits Java restrictions. | Queued | Existing pipeline, use the mature, open source nature of Logstash for high volume consumption from the input(s). | Preference can be determined by the existing use of a multiple producers or consumer service or the desired level of service management. |
| [Power Automate](flow.md) | [Supported data formats](ingestion-supported-formats.md) | 1 GB uncompressed | Queued | Ingestion commands as part of flow. Used to automate pipelines. | |

For information on other connectors, see [Connectors overview](connector-overview.md).

## Permissions

The following list describes the permissions required for various ingestion scenarios:

* To create a new table requires at least Database User permissions.
* To ingest data into an existing table, without changing its schema, requires at least Database Ingestor permissions.
* To change the schema of an existing table requires at least Table Admin or Database Admin permissions.

For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

## The ingestion process

The following steps outline the general ingestion process:

1. **Set batching policy (optional)**: Data is batched based on the [ingestion batching policy](kusto/management/batching-policy.md). For guidance, see [Optimize for throughput](kusto/api/netfx/kusto-ingest-best-practices.md#optimize-for-throughput). 

1. **Set retention policy**: If the database retention policy isn't suitable for your needs, override it at the table level. For more information, see [Retention policy](kusto/management/retentionpolicy.md).

1. **Create a table**: If you're using the Get data experience, you can create a table as part of the ingestion flow. Otherwise, create a table prior to ingestion in the [web UI](create-table-wizard.md) or with the [.create table command](kusto/management/create-table-command.md).

1. **Create a schema mapping**: [Schema mappings](kusto/management/mappings.md) help bind source data fields to destination table columns. Different types of mappings are supported, including row-oriented formats like CSV, JSON, and AVRO, and column-oriented formats like Parquet. In most methods, mappings can also be [precreated on the table](kusto/management/create-ingestion-mapping-command.md).

1. **Set update policy (optional)**: Certain data formats like Parquet, JSON, and Avro enable straightforward ingest-time transformations. For more intricate processing during ingestion, use the [update policy](kusto/management/updatepolicy.md). This policy automatically executes extractions and transformations on ingested data within the original table, then ingests the modified data into one or more destination tables.

1. **Ingest data**: Use your preferred ingestion tool, connector, or method to bring in the data.

## Related content

* [Connectors overview](connector-overview.md)
* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
* [Policies overview](kusto/management/policies.md)
