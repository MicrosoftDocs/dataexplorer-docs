---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 08/07/2023
---

# Azure Data Explorer data ingestion overview

Data ingestion is the process used to load data records from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query.

The diagram below shows the end-to-end flow for working in Azure Data Explorer and shows different ingestion methods.

:::image type="content" source="media/data-ingestion-overview/data-management-and-ingestion-overview.png" alt-text="Overview scheme of data ingestion and management.":::

The Azure Data Explorer data management service, which is responsible for data ingestion, implements the following process:

Azure Data Explorer pulls data from an external source and reads requests from a pending Azure queue. Data is batched or streamed to the Data Manager. Batch data flowing to the same database and table is optimized for ingestion throughput. Azure Data Explorer validates initial data and converts data formats where necessary. Further data manipulation includes matching schema, organizing, indexing, encoding, and compressing the data. Data is persisted in storage according to the set retention policy. The Data Manager then commits the data ingest into the engine, where it's available for query.

## Supported data formats, properties, and permissions

* **[Supported data formats](ingestion-supported-formats.md)**: The data formats that Azure Data Explorer can understand and ingest natively (for example Parquet, JSON)

* **[Ingestion properties](ingestion-properties.md)**: The properties that affect how the data will be ingested (for example, tagging, mapping, creation time).

* **Permissions**: To ingest data, the process requires [database ingestor level permissions](kusto/access-control/role-based-access-control.md). Other actions, such as query, may require database admin, database user, or table admin permissions.

## Batching vs streaming ingestion

* Batching ingestion does data batching and is optimized for high ingestion throughput. This method is the preferred and most performant type of ingestion. Data is batched according to ingestion properties. Small batches of data are then merged, and optimized for fast query results. The [ingestion batching](kusto/management/batchingpolicy.md) policy can be set on databases or tables. By default, the maximum batching value is 5 minutes, 1000 items, or a total size of 1 GB. The data size limit for a batch ingestion command is 6 GB.

* [Streaming ingestion](ingest-data-streaming.md) is ongoing data ingestion from a streaming source. Streaming ingestion allows near real-time latency for small sets of data per table. Data is initially ingested to row store, then moved to column store extents. Streaming ingestion can be done using an Azure Data Explorer client library or one of the supported data pipelines.

## Ingestion methods and tools

Azure Data Explorer supports several ingestion methods, each with its own target scenarios. These methods include ingestion tools, connectors and plugins to diverse services, managed pipelines, programmatic ingestion using SDKs, and direct access to ingestion.

For a list of data connectors, see [Data connectors overview](connector-overview.md).

### Ingestion using managed pipelines

For organizations who wish to have management (throttling, retries, monitors, alerts, and more) done by an external service, using a connector is likely the most appropriate solution. Queued ingestion is appropriate for large data volumes. Azure Data Explorer supports the following Azure Pipelines:

* **[Event Grid](https://azure.microsoft.com/services/event-grid/)**: A pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. For more information, see [Ingest Azure Blobs into Azure Data Explorer](ingest-data-event-grid.md).

* **[Event Hub](https://azure.microsoft.com/services/event-hubs/)**: A pipeline that transfers events from services to Azure Data Explorer. For more information, see [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md).

* **[IoT Hub](https://azure.microsoft.com/services/iot-hub/)**: A pipeline that is used for the transfer of data from supported IoT devices to Azure Data Explorer. For more information, see [Ingest from IoT Hub](ingest-data-iot-hub.md).

* **[Azure Data Factory (ADF)](https://azure.microsoft.com/products/data-factory/)**: A fully managed data integration service for analytic workloads in Azure. Azure Data Factory connects with over 90 supported sources to provide efficient and resilient data transfer. ADF prepares, transforms, and enriches data to give insights that can be monitored in different kinds of ways. This service can be used as a one-time solution, on a periodic timeline, or triggered by specific events.
  * [Integrate Azure Data Explorer with Azure Data Factory](data-factory-integration.md).
  * [Use Azure Data Factory to copy data from supported sources to Azure Data Explorer](./data-factory-load-data.md).
  * [Copy in bulk from a database to Azure Data Explorer by using the Azure Data Factory template](data-factory-template.md).
  * [Use Azure Data Factory command activity to run Azure Data Explorer management commands](data-factory-command-activity.md)

### Programmatic ingestion using SDKs

Azure Data Explorer provides SDKs that can be used for query and data ingestion. Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process.

**Available SDKs and open-source projects**

* [Python SDK](kusto/api/python/kusto-python-client-library.md)
* [.NET SDK](kusto/api/netfx/about-the-sdk.md)
* [Java SDK](kusto/api/java/kusto-java-client-library.md)
* [Node SDK](kusto/api/node/kusto-node-client-library.md)
* [REST API](kusto/api/netfx/kusto-ingest-client-rest.md)
* [GO SDK](kusto/api/golang/kusto-golang-client-library.md)

### Tools

* The **[ingestion wizard](./ingest-data-wizard.md)**: Enables you to quickly ingest data by creating and adjusting tables from a wide range of source types. The ingestion wizard automatically suggests tables and mapping structures based on the data source in Azure Data Explorer. The wizard can be used for one-time ingestion, or to define continuous ingestion via Event Grid on the container to which the data was ingested.

* **[LightIngest](lightingest.md)**: A command-line utility for ad-hoc data ingestion into Azure Data Explorer. The utility can pull source data from a local folder or from an Azure blob storage container.

### Ingest management commands

Use commands to ingest data directly to the engine. This method bypasses the Data Management services, and therefore should be used only for exploration and prototyping. Don't use this method in production or high-volume scenarios.

* **Inline ingestion**:  A management command [.ingest inline](kusto/management/data-ingestion/ingest-inline.md) is sent to the engine, with the data to be ingested being a part of the command text itself. This method is intended for improvised testing purposes.

* **Ingest from query**: A management command [.set, .append, .set-or-append, or .set-or-replace](kusto/management/data-ingestion/ingest-from-query.md) is sent to the engine, with the data specified indirectly as the results of a query or a command.

* **Ingest from storage (pull)**: A management command [.ingest into](kusto/management/data-ingestion/ingest-from-storage.md) is sent to the engine, with the data stored in some external storage (for example, Azure Blob Storage) accessible by the engine and pointed-to by the command.

## Comparing ingestion methods and tools

| Ingestion name | Data type | Maximum file size | Streaming, batching, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| **Get data experience** | *sv, JSON | 1 GB uncompressed (see note)| Batching to container, local file and blob in direct ingestion | One-off, create table schema, definition of continuous ingestion with Event Grid, bulk ingestion with container (up to 5,000 blobs; no limit when using historical ingestion) |  |
| [**LightIngest**](lightingest.md) | All formats supported | 1 GB uncompressed (see note) | Batching via DM or direct ingestion to engine |  Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| Case-sensitive, space-sensitive |
| [**ADX Kafka**](ingest-data-kafka.md) |Avro, ApacheAvro, JSON, CSV, Parquet, and ORC |Unlimited. Inherits Java restrictions.| Batching, streaming |Existing pipeline, high volume consumption from the source.| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired. |
| [**ADX to Apache Spark**](spark-connector.md) | Every format supported by the Spark environment  | Unlimited | Batching | Existing pipeline, preprocessing on Spark before ingestion, fast way to create a safe (Spark) streaming pipeline from the various sources the Spark environment supports. | Consider cost of Spark cluster. For batch write, compare with Azure Data Explorer data connection for Event Grid. For Spark streaming, compare with the data connection for event hub.
| [**LogStash**](ingest-data-logstash.md) | JSON | Unlimited. Inherits Java restrictions. | Inputs to the connector are Logstash events, and the connector outputs to Kusto using batching ingestion.| Existing pipeline, leverage the mature, open source nature of Logstash for high volume consumption from the input(s).| Preference may be determined by which “multiple producer/consumer” service is already used, or how managed of a service is desired.
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

## Ingestion process

Once you have chosen the most suitable ingestion method for your needs, do the following steps:

1. **Set batching policy** (optional)

     The batching manager batches ingestion data based on the [ingestion batching policy](kusto/management/batchingpolicy.md). Define a batching policy before ingestion. See [ingestion best practices - optimizing for throughput](kusto/api/netfx/kusto-ingest-best-practices.md#optimizing-for-throughput). Batching policy changes can require up to 5 minutes to take effect. The policy sets batch limits according to three factors: time elapsed since batch creation, accumulated number of items (blobs), or total batch size. By default, settings are 5 minutes / 1000 blobs / 1 GB, with the limit first reached taking effect. Therefore there's usually a 5-minute delay when queueing sample data for ingestion.

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
    To ingest your own data, you can select from a range of options, including [ingestion tools](#comparing-ingestion-methods-and-tools), [connectors and plugins](#ingestion-using-connectors-and-plugins) to diverse services, [managed pipelines](#ingestion-using-managed-pipelines), [programmatic ingestion using SDKs](#programmatic-ingestion-using-sdks), and [direct access to ingestion](#ingest-management-commands).

## Next steps

* [Supported data formats](ingestion-supported-formats.md)
* [Supported ingestion properties](ingestion-properties.md)