---
title: Azure Data Explorer data ingestion overview
description: Learn about the different ways you can ingest (load) data in Azure Data Explorer
ms.reviewer: akshay.dixit
ms.topic: conceptual
ms.date: 12/31/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion involves loading data into a table in your cluster. Azure Data Explorer ensures data validity, converts formats as needed, and performs manipulations like schema matching, organization, indexing, encoding, and compression. Once ingested, data is available for query.

Azure Data Explorer offers one-time ingestion or the establishment of a continuous ingestion pipeline, using either streaming or queued ingestion. To determine which is right for you, see [One-time data ingestion](#one-time-data-ingestion) and [Continuous ingestion](#continuous-data-ingestion).

> [!NOTE]
> Data is persisted in storage according to the set [retention policy](kusto/management/retentionpolicy.md).

## One-time data ingestion

One-time ingestion is helpful in various scenarios, such as the transfer of historical data, filling in missing data, and for the initial stages of prototyping and data analysis. This approach facilitates fast data integration without the need for a continuous pipeline commitment.

There are multiple ways to perform one-time data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="complex" source="media/ingest-data-overview/one-time-ingestion.png" lightbox="media/ingest-data-overview/one-time-ingestion.png" alt-text="Flow chart for one-time ingestion decision making.":::
   "Flow chart for one-time ingestion decision making. If you're ingesting historical data, you should follow the guidance in the Ingest historical data document. If you're not ingesting historical data, and the data is in a supported data format, we recommend using the Get Data experience to get data from a local file, get data from Amazon S3, or get data from Azure Storage. If the data is in an unsupported format, or if you don't want to use the Get Data experience, you can integrate with Azure Data Factory, which supports around 90 data formats, or write your own custom code using the Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::

For more information, see the relevant documentation:

* **[Ingest historical data](ingest-data-historical.md)**: Get data from an existing storage system into an Azure Data Explorer table with the proper creation date associated with each record.
* **[Get data from a local file](get-data-file.md)**: Get data from a local file in a [supported data format](ingestion-supported-formats.md) into a new or existing Azure Data Explorer table.
* **[Get data from Amazon S3](get-data-amazon-s3.md)**: Get data from Amazon S3 storage into either a new or existing Azure Data Explorer table.
* **[Get data from Azure Storage](get-data-storage.md)**: Get data from an Azure Data Lake Gen2 container, Azure Storage blob container, or individual blobs into either a new or existing Azure Data Explorer table.
* **[Integrate with Azure Data Factory](data-factory-integration.md)**: Azure Data Factory (ADF) is a fully managed data integration service for analytic workloads. ADF connects with over 90 supported sources to provide efficient and resilient data transfer. ADF prepares, transforms, and enriches data to give insights that can be monitored in different kinds of ways. This service can be used as a one-time solution, on a periodic timeline, or triggered by specific events.
* **[Write custom code with Kusto client libraries](kusto/api/client-libraries.md)**: Write code with C#, Python, Java, JavaScript, TypeScript, or Go to ingest data into an Azure Data Explorer table.

## Continuous data ingestion

Continuous ingestion excels in situations demanding immediate insights from live data. It proves useful for monitoring systems, log and event data, and real-time analytics.

Azure Data Explorer offers various data connectors for continuous data ingestion. Some of these connectors include external management services, such as throttling, retries, monitors, and alerts. To learn more, see the [Connectors overview](connector-overview.md).

Continuous data ingestion involves setting up an ingestion pipeline with either streaming or queued ingestion:

* **Streaming ingestion**: This method ensures near-real-time latency for small sets of data per table. Data is ingested in micro batches from a streaming source, initially placed in the row store, and then transferred to column store extents. For more information, see [Configure streaming ingestion](ingest-data-streaming.md).

* **Queued ingestion**: This method is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches then merged and optimized for fast query results. By default, the maximum queued values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see the [ingestion batching policy](kusto/management/batchingpolicy.md).

> [!NOTE]
> For most scenarios, we recommend using queued ingestion as it is the more performant option.

There are multiple ways to configure continuous data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="complex" source="media/ingest-data-overview/continuous-ingestion.png" lightbox="media/ingest-data-overview/continuous-ingestion.png" alt-text="Flow chart for continuous ingestion decision making.":::
    "Flow chart for continuous ingestion decision making. First, determine the type and location of your data. For event data, you can create an Event Hubs data connection or ingest data with Apache Kafka. For IoT data, you can create an IoT Hubs data connection. For data in Azure Storage, you can create an Event Grid data connection. For data stored in other places, check the connectors overview to see if there's a dedicated connector that can fit your use case. If so, follow the guidance to use that connector. If not, write custom code using Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::


> [!NOTE]
> Not all ingestion methods support streaming ingestion. For support details, check the guidance for the specific ingestion method.

For more information, see the relevant documentation:

* **[Create an Event Hubs data connection](create-event-hubs-connection.md)**: A pipeline that transfers events from various supported services to Azure Data Explorer.
* **[Ingest data from Apache Kafka](ingest-data-kafka.md)**: A pipeline to get data from Apache Kafka, a distributed platform for real-time streaming data. 
* **[Create an IoT Hubs data connection](create-iot-hub-connection.md)**: A pipeline that is used for the transfer of data from supported IoT devices to Azure Data Explorer.
* **[Create an Event Grid data connection](create-event-grid-connection.md)**: A pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur.
* **[Connectors overview](connector-overview.md)**: Get data with services like Apache Spark, Azure Data Factory, Apache Kafka, Apache Flink, Azure Cosmos DB, Fluent Bit, Logstash, Open Telemetry, Power Automate, Splunk, and more.
* **[Write custom code with Kusto client libraries](kusto/api/client-libraries.md)**: Write code with C#, Python, Java, JavaScript, TypeScript, or Go to ingest data into an Azure Data Explorer table.

> [!NOTE]
> Event Hubs, IoT Hubs, Event Grid, and certain data connectors offer services such as throttling, retries, monitors, and alerts. To learn more, see the [Connectors overview](connector-overview.md).

## Direct ingestion with management commands

Azure Data Explorer offers the following ingestion management commands, which ingest data directly to your cluster instead of using the data management service. They should be used only for exploration and prototyping and not in production or high-volume scenarios.

* **Inline ingestion**: The [.ingest inline command](kusto/management/data-ingestion/ingest-inline.md) contains the data to ingest being a part of the command text itself. This method is intended for improvised testing purposes.
* **Ingest from query**: The [.set, .append, .set-or-append, or .set-or-replace commands](kusto/management/data-ingestion/ingest-from-query.md) indirectly specifies the data to ingest as the results of a query or a command.
* **Ingest from storage**: The [.ingest into command](kusto/management/data-ingestion/ingest-from-storage.md) gets the data to ingest from external storage, such as Azure Blob Storage, accessible by your cluster and pointed-to by the command.

## Compare ingestion methods

| Ingestion name | Data type | Maximum file size | Streaming, queued, direct | Most common scenarios | Considerations |
|--|--|--|--|--|--|
| [**Apache Spark connector**](spark-connector.md) | Every format supported by the Spark environment | Unlimited | Queued | Existing pipeline, preprocessing on Spark before ingestion, fast way to create a safe (Spark) streaming pipeline from the various sources the Spark environment supports. | Consider cost of Spark cluster. For batch write, compare with Azure Data Explorer data connection for Event Grid. For Spark streaming, compare with the data connection for event hub. |  |
| [**Azure Data Factory (ADF)**](data-factory-integration.md) | [Supported data formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | Unlimited *(per ADF restrictions) | Batching or per ADF trigger | Supports formats that are usually unsupported, large files, can copy from over 90 sources, from on perm to cloud | This method takes relatively more time until data is ingested. ADF uploads all data to memory and then begins ingestion. |
| [**Event Grid**](ingest-data-event-grid-overview.md) | [Supported data formats](ingest-data-event-grid-overview.md#data-format) | 1 GB uncompressed | Queued | Continuous ingestion from Azure storage, external data in Azure storage | Ingestion can be triggered by blob renaming or blob creation actions |
| [**Event Hub**](ingest-data-event-hub-overview.md) | [Supported data formats](ingest-data-event-hub-overview.md#data-format) | N/A | Queued, streaming | Messages, events |  |
| [**Get data experience**](get-data-file.md) | *SV, JSON | 1 GB uncompressed | Queued to container, local file and blob in direct ingestion | One-off, create table schema, definition of continuous ingestion with Event Grid, bulk ingestion with container (up to 5,000 blobs; no limit when using historical ingestion) |  |
| [**IoT Hub**](ingest-data-iot-hub-overview.md) | [Supported data formats](ingest-data-iot-hub-overview.md#data-format) | N/A | Queued, streaming | IoT messages, IoT events, IoT properties |  |
| [**Kafka connector**](ingest-data-kafka.md) | Avro, ApacheAvro, JSON, CSV, Parquet, and ORC | Unlimited. Inherits Java restrictions. | Queued, streaming | Existing pipeline, high volume consumption from the source. | Preference can be determined by the existing use of a "multiple producer" or "consumer" service or the desired level of service management. |
| [**Kusto client libraries**](kusto/api/client-libraries.md) | All formats supported | 1 GB uncompressed | Queued, streaming, direct | Write your own code according to organizational needs |
| [**LightIngest**](lightingest.md) | All formats supported | 1 GB uncompressed | Queued via DM or direct ingestion | Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction) | Case-sensitive, space-sensitive |
| [**Logic Apps**](kusto/tools/logicapps.md) | All formats supported | 1 GB uncompressed | Queued | Used to automate pipelines |
| [**LogStash**](ingest-data-logstash.md) | JSON | Unlimited. Inherits Java restrictions. | Inputs to the connector are Logstash events, and the connector outputs to Kusto using queued ingestion. | Existing pipeline, use the mature, open source nature of Logstash for high volume consumption from the input(s). | Preference can be determined by the existing use of a "multiple producer" or "consumer" service or the desired level of service management. |
| [**Power Automate**](flow.md) | All formats supported | 1 GB uncompressed | Queued | Ingestion commands as part of flow. Used to automate pipelines. |

## The ingestion process

The following steps outline the general ingestion process:

:::image type="content" source="media/ingest-data-overview/data-ingestion-process.png" lightbox="media/ingest-data-overview/data-ingestion-process.png" alt-text="Diagram showing the steps to data ingestion.":::

1. **Set batching policy (optional)**: Data is batched based on the [ingestion batching policy](kusto/management/batchingpolicy.md). For guidance, see [Optimize for throughput](kusto/api/netfx/kusto-ingest-best-practices.md#optimize-for-throughput). 

1. **Set retention policy**: If the database retention policy isn't suitable for your needs, override it at the table level. For more information, see [Retention policy](kusto/management/retentionpolicy.md).

1. **Create a table**: If you're using the Get data experience, you can create a table as part of the ingestion flow. Otherwise, create a table prior to ingestion in the [web UI](create-table-wizard.md) or with the [.create table command](kusto/management/create-table-command.md).

1. **Create a schema mapping**: [Schema mappings](kusto/management/mappings.md) help bind source data fields to destination table columns. Different types of mappings are supported, including row-oriented formats like CSV, JSON, and AVRO, as well as column-oriented formats like Parquet. In most methods, mappings can also be [precreated on the table](kusto/management/create-ingestion-mapping-command.md).

1. **Set update policy (optional)**: Certain data formats like Parquet, JSON, and Avro enable straightforward ingest-time transformations. For more intricate processing during ingestion, use the [update policy](kusto/management/updatepolicy.md). This policy automatically executes extractions and transformations on ingested data within the original table, then ingests the modified data into one or more destination tables.

1. **Ingest data**: Use your preferred ingestion tool, connector, or method to bring in the data.

## Related content

* [Connectors overview](connector-overview.md)
* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
* [Policies overview](kusto/management/policies.md)
