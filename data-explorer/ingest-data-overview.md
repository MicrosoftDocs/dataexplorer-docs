---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 12/20/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion involves loading data into a table in your cluster. Azure Data Explorer ensures data validity, converts formats as needed, and performs additional manipulations like schema matching, organization, indexing, encoding, and compression. Once ingested, data is available for query.

Azure Data Explorer offers one-time ingestion or the establishment of a continuous ingestion pipeline, using either streaming or queued ingestion. To determine which is right for you, see [One-time data ingestion](#one-time-data-ingestion) and [Continuous ingestion](#continuous-data-ingestion).

The following diagram provides an overview of the general ingestion process. For more information on each step, see [Ingestion process](#ingestion-process).

:::image type="content" source="media/ingest-data-overview/data-ingestion-process.png" lightbox="media/ingest-data-overview/data-ingestion-process.png" alt-text="Diagram showing the steps to data ingestion.":::

> [!NOTE]
> Data is persisted in storage according to the set [retention policy](kusto/management/retentionpolicy.md).

## One-time data ingestion

One-time ingestion proves advantageous in various situations, including the transfer of historical data to a new database, filling in missing data, and in the initial stages of prototyping and data analysis. This approach facilitates fast data integration without the need for a continuous pipeline commitment.

There are multiple ways to perform one-time data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="complex" source="media/ingest-data-overview/one-time-ingestion.png" lightbox="media/ingest-data-overview/one-time-ingestion.png" alt-text="Flow chart for one-time ingestion decision making.":::
   "Flow chart for one-time ingestion decision making. If you're ingesting historical data, you should follow the guidance in the Ingest historical data document. If you're not ingesting historical data, and the data is in a supported data format, we recommend using the Get Data experience to get data from a local file, get data from Amazon S3, or get data from Azure Storage. If the data is in an unsupported format, or if you don't want to use the Get Data experience, you can use integrate with Azure Data Factory, which supports around 90 data formats, or write your own custom code using the Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::

For more information, see the relevant documentation:

* [Ingest historical data](ingest-data-historical.md)
* [Get data from a local file](get-data-file.md)
* [Get data from Amazon S3](get-data-amazon-s3.md)
* [Get data from Azure Storage](get-data-storage.md)
* [Integrate with Azure Data Factory](data-factory-integration.md)
* [Write custom code wth Kusto client libraries](kusto/api/client-libraries.md)

## Continuous data ingestion

Continuous ingestion excels in situations demanding immediate insights from live data. It proves particularly useful for monitoring systems, log and event data, and real-time analytics.

Continuous data ingestion involves setting up an ingestion pipeline with either streaming or queued ingestion:

* **Streaming ingestion**: TThis method ensures near-real-time latency for small sets of data per table. Data is ingested in very small batches from a streaming source, initially placed in the row store, and subsequently transferred to column store extents. For more information, see [Configure streaming ingestion](ingest-data-streaming.md).

* **Queued ingestion**: This method is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches subsequently merged and optimized for fast query results. By default, the maximum queued values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see the [ingestion batching policy](kusto/management/batchingpolicy.md).

> [!NOTE]
> For most scenarios, we recommend using queued ingestion as it is the more performant option.

There are multiple ways to configure continuous data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="complex" source="media/ingest-data-overview/continuous-ingestion.png" lightbox="media/ingest-data-overview/continuous-ingestion.png" alt-text="Flow chart for continuous ingestion decision making.":::
    "Flow chart for continuous ingestion decision making. First, you should determine whether you plan to use streaming or queued ingestion. Generally, if you need low latency, streaming is the better option, and if you have high throughput, queued is the better option. If you need streaming or queued ingestion of event data, you can create an Event Hubs data connection or ingest data with Apache Kafka. If you need streaming or queued ingestion of IoT data, you can create an IoT Hubs data connection. If you need streaming ingestion of another type of data, write custom code using the Kusto client libraries. For queued only ingestion, if your data is in Azure Storage, you can create an Event Grid data connection. For data stored in other places, check the connectors overview to see if there is a dedicated connector that can fit your use case. If so, follow the guidance to use that connector. If not, write custom code using Kusto client libraries. Articles with guidance on each of these options are linked to directly following this flow chart."
:::image-end:::

For more information, see the relevant documentation:

* [Create an Event Hubs data connection](create-event-hubs-connection.md)
* [Ingest data from Apache Kafka](ingest-data-kafka.md)
* [Create an IoT Hubs data connection](create-iot-hub-connection.md)
* [Create an Event Grid data connection](create-event-grid-connection.md)
* [Connectors overview](connector-overview.md)
* [Write custom code with Kusto client libraries](kusto/api/client-libraries.md)

## Ingest management commands

Use commands to ingest data directly to your cluster. This method bypasses the Data Management services, and therefore should be used only for exploration and prototyping. Don't use this method in production or high-volume scenarios.

* **Inline ingestion**:  A management command [.ingest inline](kusto/management/data-ingestion/ingest-inline.md) is sent to your cluster, with the data to be ingested being a part of the command text itself. This method is intended for improvised testing purposes.
* **Ingest from query**: A management command [.set, .append, .set-or-append, or .set-or-replace](kusto/management/data-ingestion/ingest-from-query.md) is sent to your cluster, with the data specified indirectly as the results of a query or a command.
* **Ingest from storage**: A management command [.ingest into](kusto/management/data-ingestion/ingest-from-storage.md) is sent to your cluster, with the data stored in external storage, such as Azure Blob Storage, accessible by your cluster and pointed-to by the command.

## Ingestion process

The following steps outline the general ingestion process:

1. **Set batching policy (optional)**: Data is batched based on the [ingestion batching policy](kusto/management/batchingpolicy.md). The policy sets batch limits according to three factors: time elapsed since batch creation, accumulated number of items, or total batch size. By default, settings are 5 minutes / 1000 blobs / 1 GB, with the limit first reached taking effect. As a result, there's typically a 5-minute delay when queueing sample data for ingestion. For guidance, see [Optimize for throughput](kusto/api/netfx/kusto-ingest-best-practices.md#optimize-for-throughput). 

1. **Set retention policy**: If the database retention policy is not suitable for your needs, override it at the table level. For more information, see [Retention policy](kusto/management/retentionpolicy.md).

1. **Create a table**: If you're using the Get data experience, you can create a table as part of the ingestion flow. Otherwise, create a table prior to ingestion in the [web UI](create-table-wizard.md) or with the [.create table command](kusto/management/create-table-command.md).

1. **Create a schema mapping**: [Schema mappings](kusto/management/mappings.md) help bind source data fields to destination table columns. Different types of mappings are supported, including row-oriented formats like CSV, JSON, and AVRO, as well as column-oriented formats like Parquet. In most methods, mappings can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md). The method for using a mapping varies depending on the ingestion approach. For instance, when using ingestion commands, you can reference a mapping through a command parameter.

1. **Set update policy (optional)**: Certain data formats like Parquet, JSON, and Avro enable straightforward ingest-time transformations. For more intricate processing during ingestion, modify the [update policy](kusto/management/updatepolicy.md), facilitating lightweight processing with query commands. This policy automatically executes extractions and transformations on ingested data within the original table, then ingests the modified data into one or more destination tables.

1. **Ingest data**: Use your preferred ingestion tool, connector, or method to bring in the data.

## Related content

* [Connectors overview](connector-overview.md)
* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
* [Policies overview](kusto/management/policies.md)
