---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 12/06/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion involves loading data from various sources into a table in your cluster. Azure Data Explorer ensures data validity, converts formats as needed, and performs additional manipulations like schema matching, organization, indexing, encoding, and compression. Once ingested, data is available for query.

Azure Data Explorer offers streaming ingestion and queued ingestion. For more information, see [Continuous data ingestion](#continuous-data-ingestion).

To ingest data, you need access to an Azure Data Explorer table. First, [create a cluster and database](create-cluster-and-database.md). Then, either [create a table in the Azure Data Explorer web UI](create-table-wizard.md) or use the [.create table command](kusto/management/create-table-command.md).

> [!NOTE]
> Data is persisted in storage according to the set [retention policy](kusto/management/retentionpolicy.md).

## One-time vs. continuous data ingestion

Azure Data Explorer offers two main approaches to data ingestion:

* [**One-time ingestion**](#one-time-data-ingestion): One-time ingestion is beneficial for importing historical data into a new database, filling in missing data, and during the initial stages of prototyping and data analysis, as it allows for quick data integration without committing to a continuous pipeline.

* [**Continuous ingestion**](#continuous-data-ingestion): Continuous ingestion is ideal for scenarios requiring immediate insights from live data, such as monitoring systems or situations where a constant data flow is critical for established production environments. This method is particularly well-suited for real-time analytics and continuous data streams, such as log or event data.

### One-time data ingestion

There are multiple ways to perform one-time data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="content" source="media/ingest-data-overview/one-time-ingestion.png" lightbox="media/ingest-data-overview/one-time-ingestion.png" alt-text="Flow chart for one-time ingestion decision making.":::

For more information, see the relevant documentation:

* [Ingest historical data](ingest-data-historical.md)
* [Get data from a local file](get-data-file.md)
* [Get data from Amazon S3](get-data-amazon-s3.md)
* [Get data from Azure Storage](get-data-storage.md)
* [Integrate with Azure Data Factory](data-factory-integration.md)
* [Write custom code wth Kusto client libraries](kusto/api/client-libraries.md)

### Continuous data ingestion

Continuous data ingestion involves setting up an ingestion pipeline, employing either streaming or queued ingestion:

* **Streaming ingestion**: This method entails ongoing data ingestion from a streaming source, providing near real-time latency for small sets of data per table. The data is initially ingested into the row store and later moved to column store extents. For more information, see [Configure streaming ingestion](ingest-data-streaming.md).

* **Queued ingestion**: This method performs data queued and is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches subsequently merged and optimized for fast query results. By default, the maximum queued values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see the [ingestion queued policy](kusto/management/queuedpolicy.md).

> [!NOTE]
> For most scenarios, we recommend using queued ingestion as it is the more performant option.

There are multiple ways to configure continuous data ingestion. Use the following diagram to help you determine the most suitable option based on your specific use case:

:::image type="content" source="media/ingest-data-overview/continuous-ingestion.png" lightbox="media/ingest-data-overview/continuous-ingestion.png" alt-text="Flow chart for continuous ingestion decision making.":::

For more information, see the relevant documentation:

* [Create an Event Hubs data connection](create-event-hubs-connection.md)
* [Ingest data from Apache Kafka](ingest-data-kafka.md)
* [Create an IoT Hubs data connection](create-iot-hub-connection.md)
* [Create an Event Grid data connection](create-event-grid-connection.md)
* [Connectors overview](connector-overview.md)
* [Write custom code with Kusto client libraries](kusto/api/client-libraries.md)

## Compare ingestion methods and tools

| Ingestion name | Data type | Maximum file size | Streaming, queued, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| **Get Data experience** | [All supported formats](ingestion-supported-formats.md) | 1 GB uncompressed (see note)| Queued to container, local file and blob in direct ingestion | One-off, create table schema, definition of continuous ingestion with Event Grid, bulk ingestion with container (up to 5,000 blobs; no limit when using historical ingestion) |  |
| [**LightIngest**](lightingest.md) | [All supported formats](ingestion-supported-formats.md) | 1 GB uncompressed (see note) | Queued via DM or direct ingestion |  Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| Case-sensitive, space-sensitive |
| [**Kafka connector**](ingest-data-kafka.md) |Avro, ApacheAvro, JSON, CSV, Parquet, and ORC |Unlimited. Inherits Java restrictions.| Queued, streaming |Existing pipeline, high volume consumption from the source.| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired. |
| [**Apache Spark connector**](spark-connector.md) | Every format supported by the Spark environment  | Unlimited | Queued | Existing pipeline, preprocessing on Spark before ingestion, fast way to create a safe (Spark) streaming pipeline from the various sources the Spark environment supports. | Consider cost of Spark cluster. For batch write, compare with Azure Data Explorer data connection for Event Grid. For Spark streaming, compare with the data connection for event hub.
| [**LogStash**](ingest-data-logstash.md) | JSON | Unlimited. Inherits Java restrictions. | Inputs to the connector are Logstash events, and the connector outputs to Kusto using queued ingestion.| Existing pipeline, leverage the mature, open source nature of Logstash for high volume consumption from the input(s).| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired.
| [**Azure Data Factory (ADF)**](./data-factory-integration.md) | [Supported data formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | Unlimited *(per ADF restrictions) | Queued or per ADF trigger | Supports formats that are usually unsupported, large files, can copy from over 90 sources, from on perm to cloud | This method takes relatively more time until data is ingested. ADF uploads all data to memory and then begins ingestion. |
| [**Power Automate**](./flow.md) | [All supported formats](ingestion-supported-formats.md)| 1 GB uncompressed (see note) | Queued | Ingestion commands as part of flow. Used to automate pipelines. |
| [**Logic Apps**](kusto/tools/logicapps.md)| [All supported formats](ingestion-supported-formats.md) | 1 GB uncompressed (see note) | Queued | Used to automate pipelines |
| [**IoT Hub**](ingest-data-iot-hub-overview.md) | [Supported data formats](ingest-data-iot-hub-overview.md#data-format)  | N/A | Queued, streaming | IoT messages, IoT events, IoT properties | |
| [**Event Hub**](ingest-data-event-hub-overview.md) | [Supported data formats](ingest-data-event-hub-overview.md#data-format) | N/A | Queued, streaming | Messages, events | |
| [**Event Grid**](ingest-data-event-grid-overview.md) | [Supported data formats](ingest-data-event-grid-overview.md#data-format) | 1 GB uncompressed | Queued | Continuous ingestion from Azure storage, external data in Azure storage | Ingestion can be triggered by blob renaming or blob creation actions |
| [**Kusto client libraries**](kusto/api/client-libraries.md) | [All supported formats](ingestion-supported-formats.md) | 1 GB uncompressed (see note) | Queued, streaming, direct | Write your own code according to organizational needs |

> [!NOTE]
> When referenced in the above table, ingestion supports a maximum file size of 6 GB. The recommendation is to ingest files between 100 MB and 1 GB.

## Data mappings

[Data mappings](kusto/management/mappings.md) help bind source data fields to destination table columns. Mappings allows you to take data from different sources into the same table, based on the defined attributes. Different types of mappings are supported, both row-oriented (CSV, JSON and AVRO), and column-oriented (Parquet). In most methods, mappings can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.

## Policies

The following policies are the main policies related to getting and retaining data:

* [Queued policy](kusto/management/queuedpolicy.md)
* [Merge policy](kusto/management/mergepolicy.md)
* [Partitioning policy](kusto/management/partitioningpolicy.md)
* [Retention policy](kusto/management/retentionpolicy.md)
* [Update policy](kusto/management/updatepolicy.md)

For a list of all polices, see [Policies overview](kusto/management/policies.md).

## Permissions

The following list describes the permissions required for various ingestion scenarios:

* To create a new table requires Database User or Database Admin permissions.
* To ingest data into an existing table, without changing its schema, requires Database Ingestor permissions.
* To change the schema of an existing table requires Table Admin or Database Admin permissions.

For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

## Related content

* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
