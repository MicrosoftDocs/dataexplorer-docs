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

Data ingestion is the process used to load data records from one or more sources to create or update a table in Azure Data Explorer. In most cases, the data is managed, then ingested to the engine endpoint. Once ingested, the data becomes available for query.

The diagram below shows the end-to-end flow for working in Azure Data Explorer and depicts different [ingestion methods].

:::image type="content" source="media/data-ingestion-overview/data-management-and-ingestion-overview.png" alt-text="Overview scheme of data ingestion and management":::

The Azure Data Explorer data management service, which is responsible for data ingestion, implements the following process:

Azure Data Explorer pulls data from an external source or reads requests from an Azure queue. Data is batched or streamed to the Data Manager. Batch data flowing to the same database and table is optimized for ingestion throughput. Azure Data Explorer validates initial data and converts data formats where necessary. Further data manipulation includes matching schema, organizing, indexing, encoding, and compressing the data. Data is persisted in storage according to the set retention policy. The Data Manager then commits the data ingest to the engine, where it's available for query. 

There are other ingestion methods that bypass the data manager by using Kusto query language to ingest control commands directly to the engine endpoint. Do not use these methods for production scenarios. 

## Supported data formats, properties, and permissions

For all ingestion methods other than [ingest from query](kusto\management\data-ingestion\ingest-from-query.md), format the data so that Azure Data Explorer can parse it. 

* See [supported formats](ingestion-supported-formats.md) and [properties](ingestion-properties.md) for more information.

* Depending on the existence of the table beforehand, the ingestion process may require [database admin, database ingestor, database user, or table admin permissions](kusto/management/access-control/role-based-authorization.md).

* Data types are inferred based on the target table columns. If a record is incomplete or a field cannot be parsed as the required data type, the corresponding table columns will be populated with null values. 

## Queued vs streaming ingestion

* Queued ingestion performs data batching and is optimized for high ingestion throughput. This method is the preferred and most performant type of ingestion. Data is batched according to ingestion properties. Small batches of data are then merged, and optimized for fast query results. Queued ingestion can be performed with the following ingestion methods:
 <!--which methods are relevant-->

* Streaming ingestion is ongoing data ingestion from an automated source. Streaming ingestion allows near real-time latency for small sets of data per table. Data is initially ingested to row store, then moved to column store extents. Streaming ingestion can be performed using an Azure Data Explorer client library, with Event Hub as a data source.

## Ingestion methods

Azure Data Explorer supports several ingestion methods, each with its own target scenarios, advantages, and disadvantages. Azure Data Explorer offers ingestion tools, connectors and plugins to common services, managed pipelines, programmatic ingestion using SDKs, and direct access to the engine.

### Ingestion using managed pipelines 
\\TODO: Ask Tzvia about name of managed pipelines vs messaging service vs something else

For organizations with an existing infrastructure that is based on a messaging service like Event Hub and IoT Hub, using a connector is likely the most appropriate solution. Queued ingestion is appropriate for large data volumes. Azure Data Explorer currently supports the following pipelines:

* [Event Grid](https://azure.microsoft.com/services/event-grid/) pipeline, which can be managed using the management wizard in the Azure portal. For more information, see [Ingest Azure Blobs into Azure Data Explorer](ingest-data-event-grid.md).

* [Event Hub](https://azure.microsoft.com/services/event-hubs/) pipeline, which can be managed using the management wizard in the Azure portal. For more information, see [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md).

* [IoT Hub](https://azure.microsoft.com/services/iot-hub/), which can be managed using the management wizard in the Azure portal. For more information, see [Ingest from IoT Hub](ingest-data-iot-hub.md).

### Ingestion using connectors and plugins

* Logstash plugin, see [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md).

* Kafka connector, see [Ingest data from Kafka into Azure Data Explorer](ingest-data-kafka.md).

* [Azure Data Flow](https://flow.microsoft.com/), see [Microsoft Flow Azure Kusto Connector (Preview)](kusto/tools/flow.md)
<!-- add more links? -->

* Apache Spark connector, see [Azure Data Explorer Connector for Apache Spark](spark-connector.md)
<!-- add more links> -->

### Programmatic ingestion using SDKs

Azure Data Explorer provides SDKs that can be used for query and data ingestion. Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process.

**Available SDKs and open-source projects**:

Client SDKs can be used to ingest and query data with:

* [Python SDK](kusto/api/python/kusto-python-client-library.md)

* [.NET SDK](kusto/api/netfx/about-the-sdk.md)

* [Java SDK](kusto/api/java/kusto-java-client-library.md)

* [Node SDK](kusto/api/node/kusto-node-client-library.md)

* [REST API](kusto/api/netfx/kusto-ingest-client-rest.md)

* [GO API](kusto/api/golang/kusto-golang-client-library.md)

### Tools

* Azure Data Factory (ADF), a fully managed data integration service for analytic workloads in Azure. 
  * [Supported data stores and formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats). 
  * [Copy data from Azure Data Factory to Azure Data Explorer](/azure/data-explorer/data-factory-load-data).

* [One Click Ingestion](ingest-data-one-click.md) enables you to quickly ingest data and automatically suggest tables and mapping structures, based on a data source in Azure Data Explorer.

* [LightIngest](lightingest.md) is a command-line utility for ad-hoc data ingestion into Azure Data Explorer. The utility can pull source data from a local folder or from an Azure blob storage container.

### Kusto Query Language ingest control commands

There are a number of methods by which data can be ingested directly to the engine by Kusto Query Language (KQL) commands. This method is most appropriate for exploration and prototyping, and should not be used in production scenarios.

  * **Inline ingestion**:  A control command [.ingest inline](kusto/management/data-ingestion/ingest-inline.md) is sent to the engine, with the data to be ingested being a part of the command text itself. This method is intended for ad hoc testing purposes.

  * **Ingest from query**: A control command [.set, .append, .set-or-append, or .set-or-replace](kusto/management/data-ingestion/ingest-from-query.md) is sent to the engine, with the data specified indirectly as the results of a query or a command.

  * **Ingest from storage (pull)**: A control command [.ingest into](kusto/management/data-ingestion/ingest-from-storage.md)  is sent to the engine, with the data stored in some external storage (for example, Azure Blob Storage) accessible by the engine and pointed-to by the command.

## Comparing ingestion methods

| Ingestion name | Data type | Maximum file size | Streaming, batching, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| [**One click ingestion**](ingest-data-one-click.md) | *sv, JSON | 1 GB uncompressed | batching to container, local blob in direct ingestion | one-off, create table schema, definition of continuous ingestion with event grid, bulk ingestion with container (up to 10,000 blobs) | 10,000 blobs are randomly selected from container|
| [**LightIngest**](lightingest.md) | all formats supported | 1 GB uncompressed | batching via DM or direct ingestion to engine |  data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| |
| [**ADX Kafka**](ingest-data-kafka.md) | | | | |
| [**ADX to Apache Spark**](spark-connector.md) | | | | |
| [**LogStash**](ingest-data-logstash.md) | | | | |
| [**Azure Data Factory**](kusto/tools/azure-data-factory.md) | all formats supported | unlimited *(some restrictions- maybe up to 200GB) | Batching | Supports usually unsupported formats, large files, can copy from over 100 sources, from onperm to cloud | Time of ingestion |
|[ **Azure Data Flow**](kusto/tools/flow.md) | | | | Ingestion commands as part of flow| Must have high-performing response time |
| [**IoT Hub**](kusto/management/data-ingestion/iothub.md) | all formats supported | N/A | batching, streaming | IoT messages, IoT events | |
| [**Event Hub**](kusto/management/data-ingestion/eventhub.md) | all formats supported | N/A | batching, streaming | Messages, events | |
| [**Event Grid**](kusto/management/data-ingestion/eventgrid.md) | all formats supported | 1 GB uncompressed | batching | Continuous ingestion from Azure storage, external data in Azure storage | 100 KB is optimal file size |
| [**Net Std**](net-standard-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Python**](python-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Node.js**](node-ingest-data.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**Java**](kusto/api/java/kusto-java-client-library.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |
| [**REST**](kusto/api/netfx/kusto-ingest-client-rest.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct| Write your own code according to organizational needs |
| [**Go**](kusto/api/golang/kusto-golang-client-library.md) | all formats supported | 1 GB uncompressed | batching, streaming, direct | Write your own code according to organizational needs |

## Creating a table
\\TODO: should we make a section about this?

## Schema mapping
\\TODO: Talk to Tzvia- what does the user choose/change/need to know about this

[Schema mapping](kusto/management/mappings.md) helps bind source data fields to destination table columns.

* [CSV Mapping](kusto/management/mappings.md#csv-mapping) (optional) works with all ordinal-based formats. It can be performed using the ingest command parameter or [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.
* [JSON Mapping](kusto/management/mappings.md#json-mapping) (mandatory) and [Avro mapping](kusto/management/mappings.md#avro-mapping) (mandatory) can be performed using the ingest command parameter. They can also be [pre-created on the table](kusto/management/create-ingestion-mapping-command.md) and referenced from the ingest command parameter.

## Update policy

Set your [update policy](kusto/management/update-policy.md) to automatically run a query and ingest its results when data is ingested into another table.

## Validation policy

When ingesting from storage, the source data is validated as part of parsing. The validation policy indicates how to react to parsing failures. It consists of two properties:
* `ValidationOptions`: Here, `0` means that no validation should be performed, `1` validates that all records have the same number of fields (useful for CSV files and similar), and `2` indicates to ignore fields that are not double-quoted.
* `ValidationImplications`: `0` indicates that validation failures should fail the whole ingestion, and `1` indicates that validation failures should be ignored.
<!-- is this relevant for all ingestion methods from storage? was taken from Kusto doc-->

## Ingestion recommendations and limitations

* Data ingested into a table in Azure Data Explorer is subject to the table's effective retention policy. Unless set on a table explicitly, the effective retention policy is derived from the database's retention policy. The default retention policy is five minutes. Make sure that the database's retention policy is appropriate for your needs. If not, explicitly override it at the table level. Failure to do so might result in a "silent" deletion of your data due to the database's retention policy. See [retention policy](kusto/management/retentionpolicy.md) for more details. 
* Ingesting data requires **Table ingestor** or **Database ingestor** [permissions](kusto/management/access-control/role-based-authorization.md).
* Ingestion supports a maximum file size of 5 GB. The recommendation is to ingest files between 100 MB and 1 GB.

## Next steps

* [Supported data formats](ingestion-supported-formats.md)
* [Supported data properties](ingestion-properties.md)