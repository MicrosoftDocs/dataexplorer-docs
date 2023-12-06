---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 12/06/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion is the process of loading data from one or more sources into a table in your cluster. Azure Data Explorer validates initial data and converts data formats where necessary. Further data manipulation includes matching schema, organizing, indexing, encoding, and compressing the data. Once ingested, the data is available for query.

Azure Data Explorer offers streaming ingestion and queued ingestion. For more information, see [Continuous data ingestion](#continuous-data-ingestion).

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

* **Queued ingestion**: This method performs data batching and is optimized for high ingestion throughput. Data is batched based on ingestion properties, with small batches subsequently merged and optimized for fast query results. By default, the maximum batching values are 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a queued ingestion command is 6 GB. For more information, see the [ingestion batching policy](kusto/management/batchingpolicy.md).

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

| Ingestion name | Data type | Maximum file size | Streaming, batching, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| **Get data experience** | *sv, JSON | 1 GB uncompressed (see note)| Batching to container, local file and blob in direct ingestion | One-off, create table schema, definition of continuous ingestion with Event Grid, bulk ingestion with container (up to 5,000 blobs; no limit when using historical ingestion) |  |
| [**LightIngest**](lightingest.md) | All formats supported | 1 GB uncompressed (see note) | Batching via DM or direct ingestion |  Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| Case-sensitive, space-sensitive |
| [**ADX Kafka**](ingest-data-kafka.md) |Avro, ApacheAvro, JSON, CSV, Parquet, and ORC |Unlimited. Inherits Java restrictions.| Batching, streaming |Existing pipeline, high volume consumption from the source.| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired. |
| [**ADX to Apache Spark**](spark-connector.md) | Every format supported by the Spark environment  | Unlimited | Batching | Existing pipeline, preprocessing on Spark before ingestion, fast way to create a safe (Spark) streaming pipeline from the various sources the Spark environment supports. | Consider cost of Spark cluster. For batch write, compare with Azure Data Explorer data connection for Event Grid. For Spark streaming, compare with the data connection for event hub.
| [**LogStash**](ingest-data-logstash.md) | JSON | Unlimited. Inherits Java restrictions. | Inputs to the connector are Logstash events, and the connector outputs to Kusto using queued ingestion.| Existing pipeline, leverage the mature, open source nature of Logstash for high volume consumption from the input(s).| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired.
| [**Azure Data Factory (ADF)**](./data-factory-integration.md) | [Supported data formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | Unlimited *(per ADF restrictions) | Batching or per ADF trigger | Supports formats that are usually unsupported, large files, can copy from over 90 sources, from on perm to cloud | This method takes relatively more time until data is ingested. ADF uploads all data to memory and then begins ingestion. |
| [**Power Automate**](./flow.md) | All formats supported| 1 GB uncompressed (see note) | Batching | Ingestion commands as part of flow. Used to automate pipelines. |
| [**Logic Apps**](kusto/tools/logicapps.md)| All formats supported | 1 GB uncompressed (see note) | Batching | Used to automate pipelines |
| [**IoT Hub**](ingest-data-iot-hub-overview.md) | [Supported data formats](ingest-data-iot-hub-overview.md#data-format)  | N/A | Batching, streaming | IoT messages, IoT events, IoT properties | |
| [**Event Hub**](ingest-data-event-hub-overview.md) | [Supported data formats](ingest-data-event-hub-overview.md#data-format) | N/A | Batching, streaming | Messages, events | |
| [**Event Grid**](ingest-data-event-grid-overview.md) | [Supported data formats](ingest-data-event-grid-overview.md#data-format) | 1 GB uncompressed | Batching | Continuous ingestion from Azure storage, external data in Azure storage | Ingestion can be triggered by blob renaming or blob creation actions |
| [**.NET SDK**](./net-sdk-ingest-data.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Python**](python-ingest-data.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Node.js**](node-ingest-data.md) | All formats supported | 1 GB uncompressed (see note | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Java**](kusto/api/java/kusto-java-client-library.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**REST**](kusto/api/netfx/kusto-ingest-client-rest.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct| Write your own code according to organizational needs |
| [**Go**](kusto/api/golang/kusto-golang-client-library.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |

> [!NOTE]
> When referenced in the above table, ingestion supports a maximum file size of 6 GB. The recommendation is to ingest files between 100 MB and 1 GB.

## Permissions

The following list describes the permissions required for various ingestion scenarios:

* To create a new table requires Database User or Database Admin permissions.
* To ingest data into an existing table, without changing its schema, requires Database Ingestor permissions.
* To change the schema of an existing table requires Table Admin or Database Admin permissions.

For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

## Ingestion process

Once you have chosen the most suitable ingestion method for your needs, do the following steps:

1. **Set batching policy** (optional)

     The batching manager batches ingestion data based on the [ingestion batching policy](kusto/management/batchingpolicy.md). Define a batching policy before ingestion. See [ingestion best practices - optimizing for throughput](kusto/api/netfx/kusto-ingest-best-practices.md#optimize-for-throughput). Batching policy changes can require up to 5 minutes to take effect. The policy sets batch limits according to three factors: time elapsed since batch creation, accumulated number of items (blobs), or total batch size. By default, settings are 5 minutes / 1000 blobs / 1 GB, with the limit first reached taking effect. Therefore there's usually a 5-minute delay when queueing sample data for ingestion.

1. **Set retention policy**

    Data ingested into a table in Azure Data Explorer is subject to the table's effective retention policy. Unless set on a table explicitly, the effective retention policy is derived from the database's retention policy. Hot retention is a function of cluster size and your retention policy. Ingesting more data than you have available space will force the first in data to cold retention.

    Make sure that the database's retention policy is appropriate for your needs. If not, explicitly override it at the table level. For more information, see [retention policy](kusto/management/retentionpolicy.md).

1. **Create a table**

    To ingest data programmatically, a table needs to be created beforehand. If you're using the **Get data** experience, you can create a table as part of the ingestion flow.

    * Create a table [with a command](kusto/management/create-table-command.md).

    > [!Note]
    > If a record is incomplete or a field cannot be parsed as the required data type, the corresponding table columns will be populated with null values.

1. **Create schema mapping**

    [Schema mapping](kusto/management/mappings.md) helps bind source data fields to destination table columns. Mapping allows you to take data from different sources into the same table, based on the defined attributes. Different types of mappings are supported, both row-oriented (CSV, JSON and AVRO), and column-oriented (Parquet). In most methods, mappings can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.

1. **Set update policy** (optional)

   Some of the data format mappings (Parquet, JSON, and Avro) support simple and useful ingest-time transformations. If the scenario requires more complex processing at ingestion, adjust the [update policy](./kusto/management/show-table-update-policy-command.md), which supports lightweight processing using query commands. The update policy automatically runs extractions and transformations on ingested data on the original table, and ingests the resulting data into one or more destination tables.

1. **Ingest data**

    You can [ingest sample data](ingest-sample-data.md) into the table you created in your database using commands or the ingestion wizard.
    To ingest your own data, you can select from a range of options, including [ingestion tools](#comparing-ingestion-methods-and-tools), [connectors](connector-overview.md) to diverse services, [managed pipelines](#ingestion-using-managed-pipelines), [programmatic ingestion using SDKs](#programmatic-ingestion-using-sdks), and [direct access to ingestion](#ingest-management-commands).

## Related content

* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)
