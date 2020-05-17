---
title: 'Azure Data Explorer data ingestion overview'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/30/2019
---

# Azure Data Explorer data ingestion overview

Data ingestion is the process used to load data records from one or more sources to import data into a table in Azure Data Explorer. Once ingested, the data becomes available for query.

The diagram below shows the end-to-end flow for working in Azure Data Explorer and shows different ingestion methods.

:::image type="content" source="media/data-ingestion-overview/data-management-and-ingestion-overview.png" alt-text="Overview scheme of data ingestion and management":::

The Azure Data Explorer data management service, which is responsible for data ingestion, implements the following process:

Azure Data Explorer pulls data from an external source and reads requests from a pending Azure queue. Data is batched or streamed to the Data Manager. Batch data flowing to the same database and table is optimized for ingestion throughput. Azure Data Explorer validates initial data and converts data formats where necessary. Further data manipulation includes matching schema, organizing, indexing, encoding, and compressing the data. Data is persisted in storage according to the set retention policy. The Data Manager then commits the data ingest to the engine, where it's available for query. 

## Supported data formats, properties, and permissions

* **[Supported formats](ingestion-supported-formats.md)** -- LIST FORMATS, embedded list
Compression formats: LIST FORMATS, embedded list

* **Ingestion [properties](ingestion-properties.md)**: The properties which affect how the data will be ingested (for example, tagging, mapping, creation time).

* **Permissions**: In order to ingest data, the process requires [database ingestor level permissions](kusto/management/access-control/role-based-authorization.md). Other actions, such as query, may require database admin, database user, or table admin permissions.

* **Supported Data types**: See [supported data types] (INSERT LINK) for Azure Data Explorer. If a record is incomplete or a field cannot be parsed as the required data type, the corresponding table columns will be populated with null values.

## Batching vs streaming ingestion

* Batching ingestion performs data batching and is optimized for high ingestion throughput. This method is the preferred and most performant type of ingestion. Data is batched according to ingestion properties. Small batches of data are then merged, and optimized for fast query results. The [ingestion batching](kusto/management/batchingpolicy.md) policy can be set on databases or tables. By default, Kusto will use a maximum batching value of 5 minutes, 1000 items, or a total size of 500 MB.

* Streaming ingestion is ongoing data ingestion from a streaming source. Streaming ingestion allows near real-time latency for small sets of data per table. Data is initially ingested to row store, then moved to column store extents. Streaming ingestion can be performed using an Azure Data Explorer client library or one of the supported data pipelines.

## Ingestion methods

Azure Data Explorer supports several ingestion methods, each with its own target scenarios. Azure Data Explorer offers ingestion tools, connectors and plugins to diverse services, managed pipelines, programmatic ingestion using SDKs, and direct access to ingestion.

### Ingestion using managed pipelines 

For organizations who wish to have management (throttling, retries, monitors, alerts, and more) performed by an external service, using a connector is likely the most appropriate solution. Queued ingestion is appropriate for large data volumes. Azure Data Explorer currently supports the following pipelines:

* **[Event Grid](https://azure.microsoft.com/services/event-grid/)**: A pipeline that listens to Azure storage and updates Azure Data Explorer to pull information when subscribed events occur. For more information, see [Ingest Azure Blobs into Azure Data Explorer](ingest-data-event-grid.md).

* **[Event Hub](https://azure.microsoft.com/services/event-hubs/)**: A pipeline that transfers events from services to Azure Data Explorer. For more information, see [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md).

* **[IoT Hub](https://azure.microsoft.com/services/iot-hub/)**: A pipeline that is used for the transfer of data from supported IoT devices to Azure Data Explorer. For more information, see [Ingest from IoT Hub](ingest-data-iot-hub.md).

### Ingestion using connectors and plugins

* **Logstash plugin**, see [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md).

<<<<<<< HEAD
* **Kafka connector**, see [Ingest data from Kafka into Azure Data Explorer](ingest-data-kafka.md).
=======
* Azure Data Factory (ADF), a fully managed data integration service for analytic workloads in Azure, to copy data to and from Azure Data Explorer using [supported data stores and formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats). For more information, see [Copy data from Azure Data Factory to Azure Data Explorer](data-factory-load-data.md).
>>>>>>> ca86553a296265e7ca304c5cb76950eb11471ca0

* **[Azure Data Flow](https://flow.microsoft.com/)**: An automated pipelines over Azure Data Explorer. For example, Azure Data Flow can be used to execute a query and send emails based on query results. See [Microsoft Flow Azure Kusto Connector (Preview)](kusto/tools/flow.md).

* **Apache Spark connector**:  An open source project that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Data Explorer and Spark clusters. You can build fast and scalable applications targeting data driven scenarios. See [Azure Data Explorer Connector for Apache Spark](spark-connector.md).

### Programmatic ingestion using SDKs

Azure Data Explorer provides SDKs that can be used for query and data ingestion. Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process.

**Available SDKs and open-source projects**:

Client SDKs can be used for data ingestion and query data with:

* [Python SDK](kusto/api/python/kusto-python-client-library.md)

* [.NET SDK](kusto/api/netfx/about-the-sdk.md)

* [Java SDK](kusto/api/java/kusto-java-client-library.md)

* [Node SDK](kusto/api/node/kusto-node-client-library.md)

* [REST API](kusto/api/netfx/kusto-ingest-client-rest.md)

* [GO API](kusto/api/golang/kusto-golang-client-library.md)

### Tools

* **Azure Data Factory (ADF)**: A fully managed data integration service for analytic workloads in Azure. ((ADD small paragraph about the function of ADF in connecting to supported sources, pipelines, commands, data transformations, etc)). Can be used as a one-time solution, on a periodic timeline, or triggered by specific events. This supports (( say something about large volume of supported sources and connections))
  * [Supported data stores and formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats). 
  * [Copy data from supported sources, using Azure Data Factory, to Azure Data Explorer](/azure/data-explorer/data-factory-load-data).

* **[One Click Ingestion](ingest-data-one-click.md)**: Enables you to quickly ingest data and automatically suggest tables and mapping structures, based on a data source in Azure Data Explorer. Supports table creation and adjustment from a wide range of source types. One Click Ingestion can be used for one-time ingestion, or to define continuous ingestion via Event Grid on the container to which the data was ingested. (( CLEAN UP ))

* **[LightIngest](lightingest.md)**: A command-line utility for ad-hoc data ingestion into Azure Data Explorer. The utility can pull source data from a local folder or from an Azure blob storage container.

### Kusto Query Language ingest control commands

There are a number of methods by which data can be ingested directly to the engine by Kusto Query Language (KQL) commands. Because this method bypasses the Data Management services, this method is only appropriate for exploration and prototyping, and should not be used in production or high-volume scenarios.

  * **Inline ingestion**:  A control command [.ingest inline](kusto/management/data-ingestion/ingest-inline.md) is sent to the engine, with the data to be ingested being a part of the command text itself. This method is intended for ad hoc testing purposes.

  * **Ingest from query**: A control command [.set, .append, .set-or-append, or .set-or-replace](kusto/management/data-ingestion/ingest-from-query.md) is sent to the engine, with the data specified indirectly as the results of a query or a command.

  * **Ingest from storage (pull)**: A control command [.ingest into](kusto/management/data-ingestion/ingest-from-storage.md)  is sent to the engine, with the data stored in some external storage (for example, Azure Blob Storage) accessible by the engine and pointed-to by the command.

## Comparing ingestion methods

| Ingestion name | Data type | Maximum file size | Streaming, batching, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| [**One click ingestion**](ingest-data-one-click.md) | *sv, JSON | 1 GB uncompressed (see note)| batching to container, local file and blob in direct ingestion | one-off, create table schema, definition of continuous ingestion with event grid, bulk ingestion with container (up to 10,000 blobs) | 10,000 blobs are randomly selected from container|
| [**LightIngest**](lightingest.md) | all formats supported | 1 GB uncompressed (see note) | batching via DM or direct ingestion to engine |  data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| Case-sensitive, space-sensitive |
| [**ADX Kafka**](ingest-data-kafka.md) | | | | |
| [**ADX to Apache Spark**](spark-connector.md) | | | | |
| [**LogStash**](ingest-data-logstash.md) | | | | |
| [**Azure Data Factory**](kusto/tools/azure-data-factory.md) | TODO: Link to ADF supported format | unlimited *(per ADF restrictions) | Batching or per ADF trigger | Supports usually unsupported formats, large files, can copy from over 100 sources, from onperm to cloud | Time of ingestion |
|[ **Azure Data Flow**](kusto/tools/flow.md) | | | | Ingestion commands as part of flow| Must have high-performing response time |
| [**IoT Hub**](kusto/management/data-ingestion/iothub.md) | all formats supported- TODO: link to supported formats | N/A | batching, streaming | IoT messages, IoT events, IoT properties | |
| [**Event Hub**](kusto/management/data-ingestion/eventhub.md) | all formats supported TODO: link to supported formats| N/A | batching, streaming | Messages, events | |
| [**Event Grid**](kusto/management/data-ingestion/eventgrid.md) | all formats supported TODO: link to supported formats | 1 GB uncompressed | batching | Continuous ingestion from Azure storage, external data in Azure storage | 100 KB is optimal file size, Used for blob renaming and blob creation |
| [**Net Std**](net-standard-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Python**](python-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Node.js**](node-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Java**](kusto/api/java/kusto-java-client-library.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**REST**](kusto/api/netfx/kusto-ingest-client-rest.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct| Write your own code according to organizational needs |
| [**Go**](kusto/api/golang/kusto-golang-client-library.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |

> [!Note] 
> In the above table, 

## Creating a table

In order to ingest data, a table needs to be created beforehand. Use one of the following options:
* Create a table [with a command](kusto/management/create-table-command.md). 
* Create a table using [One Click Ingestion](one-click-ingestion-new-table.md).

## Schema mapping
TODO: shorten below definitions and add links

[Schema mapping](kusto/management/mappings.md) helps bind source data fields to destination table columns. This allows you to take data from a variety of different sources to the same table, based on the defined attributes. 

Kusto supports different types of mappings, both row-oriented (CSV, JSON and AVRO), and column-oriented (Parquet).

Mapping transformations

Some of the data format mappings (Parquet, JSON and Avro) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use Update policy, which allows defining lightweight processing using KQL expression.

* **[CSV Mapping](kusto/management/mappings.md#csv-mapping)** (optional) works with all ordinal-based formats. It can be performed using the ingest command parameter or [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.
* **[JSON Mapping](kusto/management/mappings.md#json-mapping)** (mandatory) and [Avro mapping](kusto/management/mappings.md#avro-mapping) (mandatory) can be performed using the ingest command parameter. They can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.

<!--**Avro-Apache**-->

* **Orc mapping**: When the source file is in Orc format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Orc mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns. 

* **Parquet mapping**: When the source file is in Parquet format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

## Update policy

The update policy automatically runs extractions and transformations on ingested data on the original table, and ingests the resulting data into one or more destination tables. Set your [update policy](kusto/management/update-policy.md).

## Ingestion recommendations and limitations

* Data ingested into a table in Azure Data Explorer is subject to the table's effective retention policy. Unless set on a table explicitly, the effective retention policy is derived from the database's retention policy. Hot retention is a function of cluster size and your retention policy. Ingesting more data than you have available space will force the first in data to cold retention.
Make sure that the database's retention policy is appropriate for your needs. If not, explicitly override it at the table level. See [retention policy](kusto/management/retentionpolicy.md) for more details. 
* Ingesting data requires **Table ingestor** or **Database ingestor** [permissions](kusto/management/access-control/role-based-authorization.md).
* Ingestion supports a maximum file size of 5 GB. The recommendation is to ingest files between 100 MB and 1 GB.

## Next steps

* [Supported data formats](ingestion-supported-formats.md)
* Supported data properties TODO: add link
* [Supported ingestion properties](ingestion-properties.md)