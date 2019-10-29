---
title: Kusto.Ingest client reference - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest client reference in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/05/2019
---
# Kusto.Ingest client reference

The main interfaces and factory classes in the Kusto.Ingest library are:

* [interface IKustoIngestClient](#interface-ikustoingestclient): The main ingestion interface.
* [Class ExtendedKustoIngestClient](#class-extendedkustoingestclient): Extensions to the main ingestion interface.
* [class KustoIngestFactory](#class-kustoingestfactory): The main factory for ingestion clients.
* [class KustoIngestionProperties](#class-kustoingestionproperties): Class used to provide common ingestion properties.
* [Class JsonColumnMapping](#class-jsoncolumnmapping): Class used to describe the schema mapping to apply when ingesting from a JSON data source.
* [Class CsvColumnMapping](#class-csvcolumnmapping): Class used to describe the schema mapping to apply when ingesting from a CSV data source.
* [Enum DataSourceFormat](#enum-datasourceformat): Supported data source formats (e.g. CSV, JSON, etc.)
* [Interface IKustoQueuedIngestClient](#interface-ikustoqueuedingestclient): Interface describing operations that apply for queued ingestion only.
* [Class KustoQueuedIngestionProperties](#class-kustoqueuedingestionproperties): Properties that apply to queued ingestion only.

## Interface IKustoIngestClient

```csharp
public interface IKustoIngestClient : IDisposable
{
    /// <summary>
    /// Ingests data from <see cref="IDataReader"/>. <paramref name="dataReader"/> will be closed when the call completes.
    /// </summary>
    /// <param name="dataReader">The <see cref="IDataReader"/> data source to ingest. Only the first record set will be used</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="sourceOptions">Options for the <see cref="IDataReader"/> ingestion source. This is an optional parameter</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromDataReaderAsync(IDataReader dataReader, KustoIngestionProperties ingestionProperties, DataReaderSourceOptions sourceOptions = null);

    /// <summary>
    /// Ingest data from one of the supported storage providers. Currently the supported providers are: File System, Azure Blob Storage.
    /// </summary>
    /// <param name="uri">The URI of the storage resource to be ingested. Note: This URI may include a storage account key or shared access signature (SAS).
    ///  See <see href="https://docs.microsoft.com/en-us/azure/kusto/api/connection-strings/storage"/> for the URI format options.</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="sourceOptions">Options for the storage ingestion source. This is an optional parameter</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromStorageAsync(string uri, KustoIngestionProperties ingestionProperties, StorageSourceOptions sourceOptions = null);

    /// <summary>
    /// Ingest data from <see cref="Stream"/>.
    /// </summary>
    /// <param name="stream">The <see cref="Stream"/> data source to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="sourceOptions">Options for the <see cref="Stream"/> ingestion source. This is an optional parameter</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromStreamAsync(Stream stream, KustoIngestionProperties ingestionProperties, StreamSourceOptions sourceOptions = null);
}
```

## Class ExtendedKustoIngestClient

```csharp
public static class ExtendedKustoIngestClient
{
    /// <summary>
    /// Ingest data from a single data blob
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="blobUri">The URI of the blob will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromSingleBlob(this IKustoIngestClient client, string blobUri, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="blobUri">The URI of the blob will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromSingleBlobAsync(this IKustoIngestClient client, string blobUri, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="blobDescription"><see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromSingleBlob(this IKustoIngestClient client, BlobDescription blobDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="blobDescription"><see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromSingleBlobAsync(this IKustoIngestClient client, BlobDescription blobDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="dataReader">The data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromDataReader(this IKustoIngestClient client, IDataReader dataReader, KustoIngestionProperties ingestionProperties);

    /// <summary>
    ///  Asynchronously ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="dataReader">The data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromDataReaderAsync(this IKustoIngestClient client, IDataReader dataReader, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="dataReaderDescription"><see cref="DataReaderDescription"/>Represents the data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromDataReader(this IKustoIngestClient client, DataReaderDescription dataReaderDescription, KustoIngestionProperties ingestionProperties);

    /// <summary>
    ///  Asynchronously ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="dataReaderDescription"><see cref="DataReaderDescription"/>Represents the data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromDataReaderAsync(this IKustoIngestClient client, DataReaderDescription dataReaderDescription, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="filePath">Absolute path of the source file to be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromSingleFile(this IKustoIngestClient client, string filePath, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="filePath">Absolute path of the source file to be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromSingleFileAsync(this IKustoIngestClient client, string filePath, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="fileDescription"><see cref="FileDescription"/> representing the file that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromSingleFile(this IKustoIngestClient client, FileDescription fileDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="fileDescription"><see cref="FileDescription"/> representing the file that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromSingleFileAsync(this IKustoIngestClient client, FileDescription fileDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from <see cref="Stream"/>
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="stream">The data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), <paramref name="stream"/> will be closed and disposed on call completion</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromStream(this IKustoIngestClient client, Stream stream, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/> asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="stream">The data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), <paramref name="stream"/> will be closed and disposed on call completion</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromStreamAsync(this IKustoIngestClient client, Stream stream, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/>
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="streamDescription"><see cref="StreamDescription"/>Represents the data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), streamDescription.Stream will be closed and disposed on call completion</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    public static IKustoIngestionResult IngestFromStream(this IKustoIngestClient client, StreamDescription streamDescription, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/> asynchronously
    /// </summary>
    /// <param name="client">The ingest client that will execute the ingestions</param>
    /// <param name="streamDescription"><see cref="StreamDescription"/>Represents the data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), streamDescription.Stream will be closed and disposed on call completion</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    public static Task<IKustoIngestionResult> IngestFromStreamAsync(this IKustoIngestClient client, StreamDescription streamDescription, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);
}
```

## Class KustoIngestFactory

```csharp
/// <summary>
/// Factory for creating Kusto ingestion objects.
/// </summary>
public static class KustoIngestFactory
{
    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that communicates
    /// directly with the Kusto engine service.
    /// </summary>
    /// <param name="kcsb">Indicates the connection to the Kusto engine service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that communicates
    /// directly with the Kusto engine service.</returns>
    /// <remarks>In most cases, it is preferred that ingestion be done using the
    /// queued implementation of <see cref="IKustoIngestClient"/>. See <see cref="CreateQueuedIngestClient(KustoConnectionStringBuilder)"/>.</remarks>
    public static IKustoIngestClient CreateDirectIngestClient(KustoConnectionStringBuilder kcsb);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that communicates
    /// directly with the Kusto engine service.
    /// </summary>
    /// <param name="connectionString">Indicates the connection to the Kusto engine service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that communicates
    /// directly with the Kusto engine service.</returns>
    /// <remarks>In most cases, it is preferred that ingestion be done using the
    /// queued implementation of <see cref="IKustoIngestClient"/>. See <see cref="CreateQueuedIngestClient(string)"/>.</remarks>
    public static IKustoIngestClient CreateDirectIngestClient(string connectionString);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoQueuedIngestClient"/> that communicates
    /// with the Kusto ingestion service using a reliable queue.
    /// </summary>
    /// <param name="kcsb">Indicates the connection to the Kusto ingestion service.
    /// Note that the ingestion service generally has a "ingest-" prefix in the
    /// DNS host name part.</param>
    /// <returns>An implementation of <see cref="IKustoQueuedIngestClient"/> that communicates
    /// with the Kusto ingestion service using a reliable queue.</returns>
    public static IKustoQueuedIngestClient CreateQueuedIngestClient(KustoConnectionStringBuilder kcsb);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoQueuedIngestClient"/> that communicates
    /// with the Kusto ingestion service using a reliable queue.
    /// </summary>
    /// <param name="connectionString">Indicates the connection to the Kusto ingestion service.
    /// Note that the ingestion service generally has a "ingest-" prefix in the
    /// DNS host name part.</param>
    /// <returns>An implementation of <see cref="IKustoQueuedIngestClient"/> that communicates with the Kusto ingestion service using a reliable queue.</returns>
    public static IKustoQueuedIngestClient CreateQueuedIngestClient(string connectionString);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that performs managed streaming ingestion
    /// </summary>
    /// <param name="engineKcsb">Indicates the connection to the Kusto engine service.</param>
    /// <param name="dmKcsb">Indicates the connection to the Kusto data management service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that performs managed streaming ingestion</returns>
    /// <remarks>Streaming ingestion is performed directy intto Kusto enginge cluster 
    /// and is optimized for low-latency ingestion of relatively small chunks of data.
    /// If the streaming ingset doesn't succeed after several retries, queued ingestion will be performed.</remarks>
    public static IKustoIngestClient CreateManagedStreamingIngestClient(KustoConnectionStringBuilder engineKcsb, KustoConnectionStringBuilder dmKcsb);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that performs managed streaming ingestion
    /// </summary>
    /// <param name="engineConnectionString">Indicates the connection to the Kusto engine service.</param>
    /// <param name="dmConnectionString">Indicates the connection to the Kusto data management service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that performs managed streaming ingestion</returns>
    /// <remarks>Streaming ingestion is performed directy intto Kusto enginge cluster 
    /// and is optimized for low-latency ingestion of relatively small chunks of data.
    /// If the streaming ingset doesn't succeed after several retries, queued ingestion will be performed.</remarks>
    public static IKustoIngestClient CreateManagedStreamingIngestClient(string engineConnectionString, string dmConnectionString);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that performs streaming ingestion
    /// </summary>
    /// <param name="kcsb">Indicates the connection to the Kusto engine service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that performs streaming ingestion</returns>
    /// <remarks>Streaming ingestion is performed directy intto Kusto enginge cluster 
    /// and is optimized for low-latency ingestion of relatively small chunks of data</remarks>
    public static IKustoIngestClient CreateStreamingIngestClient(KustoConnectionStringBuilder kcsb);

    /// <summary>
    /// Creates an implementation of <see cref="IKustoIngestClient"/> that performs streaming ingestion
    /// </summary>
    /// <param name="connectionString">Indicates the connection to the Kusto engine service.</param>
    /// <returns>An implementation of <see cref="IKustoIngestClient"/> that performs streaming ingestion</returns>
    /// <remarks>Streaming ingestion is performed directy into Kusto enginge cluster 
    /// and is optimized for low-latency ingestion of relatively small chunks of data</remarks>
    public static IKustoIngestClient CreateStreamingIngestClient(string connectionString);
}
```

## Class KustoIngestionProperties

KustoIngestionProperties class encapsulates basic ingestion properties that allow fine control over the ingestion process and its handling by the Kusto engine:

|Property   |Meaning    |
|-----------|-----------|
|DatabaseName |Name of the database to ingest into |
|TableName |Name of the table to ingest into |
|DropByTags |Tags that each extent will have. DropByTags are permanant and can be used as follows: `.show table T extents where tags has 'some tag'` or `.drop extents <| .show table T extents where tags has 'some tag'` |
|IngestByTags |Tags that are written per extent. Later on can be used with `IngestIfNotExists` property to avoid ingesting the same data twice |
|AdditionalTags |Additional tags as needed |
|IngestIfNotExists |List of tags that you don't want to ingest again (per table) |
|CSVMapping |For each column, defines the data type and the ordinal column number. Relevant for csv ingestion only (optional) |
|JsonMapping |For each column, defines the JSON path and transformation options. **Mandatory for JSON ingestion** |
|AvroMapping |For each column, defines the name of the field in Avro record. **Mandatory for AVRO ingestion** |
|ValidationPolicy |Data validation definitions. See [TODO] for details |
|Format |Format of the data being ingested |
|AdditionalProperties | Other properties that will be passed as [Ingestion Properties](../../management/data-ingestion/index.md#ingestion-properties) to the ingestion command, as not all the Ingestion Properties are represented in a separate member of this class|

```csharp
public class KustoIngestionProperties
{
    public string DatabaseName { get; set; }
    public string TableName { get; set; }
    public IEnumerable<string> DropByTags { get; set; }
    public IEnumerable<string> IngestByTags { get; set; }
    public IEnumerable<string> AdditionalTags { get; set; }
    public IEnumerable<string> IngestIfNotExists { get; set; }
    public IEnumerable<CsvColumnMapping> CSVMapping { get; set; }
    public IEnumerable<JsonColumnMapping> JsonMapping { get; set; } // Must be set for DataSourceFormat.json format
    public IEnumerable<AvroColumnMapping> AvroMapping { get; set; } // Must be set for DataSourceFormat.avro format
    public ValidationPolicy ValidationPolicy { get; set; }
    public DataSourceFormat? Format { get; set; }
    public bool IgnoreSizeLimit { get; set; } // Determines whether the limit of 4GB per single ingestion source should be ignored. Defaults to false.
    public IDictionary<string, string> AdditionalProperties { get; set; }

    public KustoIngestionProperties(string databaseName, string tableName);
}
```

## Class JsonColumnMapping

```csharp
public class JsonColumnMapping
{
    /// The column name (in the Kusto table)
    public string ColumnName { get; set; }

    /// The JsonPath to the desired property in the JSON document
    public string JsonPath { get; set; }
}
```

## Class CsvColumnMapping

```csharp
public class CsvColumnMapping
{
    /// The column name (in the Kusto table)
    public string ColumnName { get; set; }

    /// The column's data type in the table (CSL term), if empty, the current column data type will be used.
    /// If column doesn't exist, a new one will be created (alter table) with this data type, if empty, StorageDataType.StringBuffer will be used.
    public string CslDataType { get; set; }

    /// The CSV column dataType (not in use for now)
    public string CsvColumnDataType { get; set; }

    /// CSV ordinal number
    public int Ordinal { get; set; }

    /// This column has a const value (the Ordinal field is ignored, if this value is not null or empty)
    public string ConstValue { get; set; }
}
```

## Enum DataSourceFormat

```csharp
public enum DataSourceFormat
{
    csv,        // Data is in a CSV(-comma-separated values) format
    tsv,        // Data is in a TSV(-tab-separated values) format
    scsv,       // Data is in a SCSV(-semicolon-separated values) format
    sohsv,      // Data is in a SOHSV(-SOH (ASCII 1) separated values) format
    psv,        // Data is in a PSV (pipe-separated values) format
    txt,        // Each record is a line and has just one field
    raw,        // The entire stream/file/blob is a single record having a single field
    json,       // Data is in a JSON-line format (each line is record with a single JSON value)
    multijson,  // The data stream is a concatenation of JSON documents (property bags all)
    avro,       // Data is in a AVRO format
}
```


## Example of KustoIngestionProperties Definition

```csharp
var guid = new Guid().ToString();
var kustoIngestionProperties = new KustoIngestionProperties("TargetDatabase", "TargetTable")
{
    DropByTags = new List<string> { DateTime.Today.ToString() },
    IngestByTags = new List<string> { guid },
    AdditionalTags = new List<string> { "some tags" },
    IngestIfNotExists = new List<string> { guid },
    CSVMapping = new List<CsvColumnMapping> { new CsvColumnMapping { ColumnName = "columnA", CslDataType = "Dynamic", Ordinal = 1 } },
    JsonMapping = new List<JsonColumnMapping> { new JsonColumnMapping { ColumnName = "columnA" , JsonPath = "$.path" } }, // You can only one of CSV/JSON/AVRO mappings
    AvroMapping = new List<AvroColumnMapping> { new AvroColumnMapping { ColumnName = "columnA" , FieldName = "AvroFieldName" } }, // You can only one of CSV/JSON/AVRO mappings
    ValidationPolicy = new ValidationPolicy { ValidationImplications = ValidationImplications.Fail, ValidationOptions = ValidationOptions.ValidateCsvInputConstantColumns },
    Format = DataSourceFormat.csv
};
```

## Interface IKustoQueuedIngestClient

IKustoQueuedIngestClient interface adds tracking methods to follow the ingestion operation result, and exposes RetryPolicy for the ingest client.

```csharp
public interface IKustoQueuedIngestClient : IKustoIngestClient
{
    /// <summary>
    /// Peeks top (== oldest) ingestion failures  
    /// </summary>
    /// <param name="messagesLimit">Maximum ingestion failures to peek. Default value peeks 32 messages.</param>
    /// <returns>A task which its result contains IEnumerable of <see cref="IngestionFailure"/>. The received messages won't be discarded from the relevant azure queue.</returns>
    Task<IEnumerable<IngestionFailure>> PeekTopIngestionFailures(int messagesLimit = -1);

    /// <summary>
    /// Returns and deletes top (== oldest) ingestion failure notifications 
    /// </summary>
    /// <param name="messagesLimit">Maximum ingestion failure notifications to get. Default value peeks 32 messages.</param>
    /// <returns>A task which its result contains IEnumerable of <see cref="IngestionFailure"/>. The received messages will be discarded from the relevant azure queue.</returns>
    Task<IEnumerable<IngestionFailure>> GetAndDiscardTopIngestionFailures(int messagesLimit = -1);

    /// <summary>
    /// Returns and deletes top (== oldest) ingestion success notifications 
    /// </summary>
    /// <param name="messagesLimit">Maximum ingestion success notifications to get. Default value peeks 32 messages.</param>
    /// <returns>A task which its result contains IEnumerable of <see cref="IngestionSuccess"/>. The received messages will be discarded from the relevant azure queue.</returns>
    Task<IEnumerable<IngestionSuccess>> GetAndDiscardTopIngestionSuccesses(int messagesLimit = -1);

    /// <summary>
    /// An implementation of IRetryPolicy that will be enforced on every ingest call,
    /// which affects how the ingest client handles retrying on transient failures 
    /// </summary>
    IRetryPolicy QueueRetryPolicy { get; set; }
}
```

## Class KustoQueuedIngestionProperties

KustoQueuedIngestionProperties class extends KustoIngestionProperties with several control knobs that can be used to fine-tune the ingestion behavior:

|Property   |Meaning    |
|-----------|-----------|
|FlushImmediately |Defaults to `false`. If set to `true`, will bypass aggregation mechanism of the Data Management service |
|IngestionReportLevel |Controls the level of ingestion status reporting (defaults to `FailuresOnly`). In terms of performance and storage usage, it's not recommended to set IngestionReportLevel to `FailuresAndSuccesses` |
|IngestionReportMethod |Controls the target of the ingestion status reporting. Available options are: Azure Queue, Azure Table, or both. Defaults to `Queue`.

```csharp
public class KustoQueuedIngestionProperties : KustoIngestionProperties
{
    /// <summary>
    /// Allows to stop the batching phase and will cause to an immediate ingestion.
    /// Defaults to 'false'. 
    /// </summary>
    public bool FlushImmediately { get; set; }

    /// <summary>
    /// Controls the ingestion status report level.
    /// Defaults to 'FailuresOnly'.
    /// </summary>
    public IngestionReportLevel ReportLevel { get; set; }

    /// <summary>
    /// Controls the target of the ingestion status reporting. Available options are Azure Queue, Azure Table, or both.
    /// Defaults to 'Queue'.
    /// </summary>
    public IngestionReportMethod ReportMethod;

    public KustoQueuedIngestionProperties(string databaseName, string tableName);
}
```