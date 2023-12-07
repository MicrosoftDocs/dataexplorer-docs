---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 12/06/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion involves loading data from various sources into a table in your cluster. Azure Data Explorer ensures data validity, converts formats as needed, and performs additional manipulations like schema matching, organization, indexing, encoding, and compression. Once ingested, data is available for query.

Azure Data Explorer offers one-time data ingestion or the establishment of a continuous ingestion pipeline, using either streaming or queued ingestion. To determine which is right for you, see [One-time data ingestion](#one-time-data-ingestion) and [Continuous ingestion](#continuous-data-ingestion).

For any method of data ingestion, you need access to a table. Once you [create a cluster and database](create-cluster-and-database.md), you can either [create a table in the Azure Data Explorer web UI](create-table-wizard.md) or use the [.create table command](kusto/management/create-table-command.md).

> [!NOTE]
> Data is persisted in storage according to the set [retention policy](kusto/management/retentionpolicy.md).

## One-time data ingestion

One-time ingestion is beneficial for importing historical data into a new database, filling in missing data, and during the initial stages of prototyping and data analysis, as it allows for quick data integration without committing to a continuous pipeline.

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

Continuous ingestion is ideal for scenarios requiring immediate insights from live data, such as monitoring systems or situations where a constant data flow is critical for established production environments. This method is particularly well-suited for real-time analytics and continuous data streams, such as log or event data.

Continuous data ingestion involves setting up an ingestion pipeline, employing either streaming or queued ingestion:

* **Streaming ingestion**: This method entails ongoing data ingestion from a streaming source, providing near real-time latency for small sets of data per table. The data is initially ingested into the row store and later moved to column store extents. For more information, see [Configure streaming ingestion](ingest-data-streaming.md).

* **Queued ingestion**: This method is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches subsequently merged and optimized for fast query results. By default, the maximum queued values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see the [ingestion queued policy](kusto/management/queuedpolicy.md).

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

## Data mappings

[Data mappings](kusto/management/mappings.md) help bind source data fields to destination table columns. Different types of mappings are supported, both row-oriented (CSV, JSON and AVRO), and column-oriented (Parquet). In most methods, mappings can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.

## Permissions

The following list describes the permissions required for various ingestion scenarios:

* To create a new table requires Database User or Database Admin permissions.
* To ingest data into an existing table, without changing its schema, requires Database Ingestor permissions.
* To change the schema of an existing table requires Table Admin or Database Admin permissions.

For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

## Policies

The following policies are relevant to getting and retaining data:

* [Queued policy](kusto/management/queuedpolicy.md)
* [Merge policy](kusto/management/mergepolicy.md)
* [Partitioning policy](kusto/management/partitioningpolicy.md)
* [Retention policy](kusto/management/retentionpolicy.md)
* [Update policy](kusto/management/updatepolicy.md)

For a list of all polices, see [Policies overview](kusto/management/policies.md).

## Related content

* [Connectors overview](connector-overview.md)
* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
