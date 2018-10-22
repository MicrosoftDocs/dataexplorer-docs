---
title: Kusto.Ingest Reference - Ingest Clients and Ingestion Properties - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest Reference - Ingest Clients and Ingestion Properties in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto.Ingest Reference - Ingest Clients and Ingestion Properties

## Interface IKustoIngestClient
IKustoIngestClient interface defines Kusto ingestion methods, allowing data ingestion from Stream, IDataReader, local file(s), and Azure blob(s) in both synchronous and asynchronous modes.

```csharp
public interface IKustoIngestClient : IDisposable
{
    /// <summary>
    /// Ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="dataReader">The data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="retainCsvOnFailure">Optional. Indicates if the CSV created from the data reader for ingestion should be kept for further analysis in case of failure.</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromDataReader(IDataReader dataReader, KustoIngestionProperties ingestionProperties, bool retainCsvOnFailure = false);

    /// <summary>
    /// Ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="dataReaderDescription"><see cref="DataReaderDescription"/>Represents the data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="retainCsvOnFailure">Optional. Indicates if the CSV created from the data reader for ingestion should be kept for further analysis in case of failure.</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromDataReader(DataReaderDescription dataReaderDescription, KustoIngestionProperties ingestionProperties, bool retainCsvOnFailure = false);

    /// <summary>
    ///  Asynchronously ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="dataReader">The data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="retainCsvOnFailure">Optional. Indicates if the CSV created from the data reader for ingestion should be kept for further analysis in case of failure.</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromDataReaderAsync(IDataReader dataReader, KustoIngestionProperties ingestionProperties, bool retainCsvOnFailure = false);

    /// <summary>
    ///  Asynchronously ingest data from <see cref="IDataReader"/>, which is closed and disposed of upon call completion
    /// </summary>
    /// <param name="dataReaderDescription"><see cref="DataReaderDescription"/>Represents the data to ingest (only the first record set will be used)</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="retainCsvOnFailure">Optional. Indicates if the CSV created from the data reader for ingestion should be kept for further analysis in case of failure.</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromDataReaderAsync(DataReaderDescription dataReaderDescription, KustoIngestionProperties ingestionProperties, bool retainCsvOnFailure = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/>
    /// </summary>
    /// <param name="stream">The data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), <paramref name="stream"/> will be closed and disposed on call completion</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromStream(Stream stream, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/>
    /// </summary>
    /// <param name="streamDescription"><see cref="StreamDescription"/>Represents the data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), streamDescription.Stream will be closed and disposed on call completion</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromStream(StreamDescription streamDescription, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/> asynchronously
    /// </summary>
    /// <param name="stream">The data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), <paramref name="stream"/> will be closed and disposed on call completion</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromStreamAsync(Stream stream, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from <see cref="Stream"/> asynchronously
    /// </summary>
    /// <param name="streamDescription"><see cref="StreamDescription"/>Represents the data to ingest</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="leaveOpen">Optional. If set to 'false' (default value), streamDescription.Stream will be closed and disposed on call completion</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromStreamAsync(StreamDescription streamDescription, KustoIngestionProperties ingestionProperties, bool leaveOpen = false);

    /// <summary>
    /// Ingest data from a single file
    /// </summary>
    /// <param name="filePath">Absolute path of the source file to be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromSingleFile(string filePath, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file asynchronously
    /// </summary>
    /// <param name="filePath">Absolute path of the source file to be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromSingleFileAsync(string filePath, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file
    /// </summary>
    /// <param name="fileDescription"><see cref="FileDescription"/> representing the file that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromSingleFile(FileDescription fileDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single file asynchronously
    /// </summary>
    /// <param name="fileDescription"><see cref="FileDescription"/> representing the file that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source file should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromSingleFileAsync(FileDescription fileDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple files
    /// </summary>
    /// <param name="filePaths">A list of source file absolute paths</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source files should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromMultipleFiles(IEnumerable<string> filePaths, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple files asynchronously
    /// </summary>
    /// <param name="filePaths">A list of source file absolute paths</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source files should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromMultipleFilesAsync(IEnumerable<string> filePaths, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple files
    /// </summary>
    /// <param name="fileDescriptions">A collection of <see cref="FileDescription"/> representing the files that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source files should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromMultipleFiles(IEnumerable<FileDescription> fileDescriptions, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple files asynchronously
    /// </summary>
    /// <param name="fileDescriptions">A collection of <see cref="FileDescription"/> representing the files that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source files should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromMultipleFilesAsync(IEnumerable<FileDescription> fileDescriptions, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from a single data blob
    /// </summary>
    /// <param name="blobUri">The URI of the blob will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromSingleBlob(string blobUri, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob asynchronously
    /// </summary>
    /// <param name="blobUri">The URI of the blob will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromSingleBlobAsync(string blobUri, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob
    /// </summary>
    /// <param name="blobDescription"><see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromSingleBlob(BlobDescription blobDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from a single data blob asynchronously
    /// </summary>
    /// <param name="blobDescription"><see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourceOnSuccess">Indicates if the source blob should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <param name="rawDataSize">The uncompressed raw data size</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromSingleBlobAsync(BlobDescription blobDescription, bool deleteSourceOnSuccess, KustoIngestionProperties ingestionProperties, long? rawDataSize = null);

    /// <summary>
    /// Ingest data from multiple data blobs
    /// </summary>
    /// <param name="blobUris">A collection of blob URIs representing the blobs that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source blobs should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromMultipleBlobs(IEnumerable<string> blobUris, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple data blobs asynchronously
    /// </summary>
    /// <param name="blobUris">A collection of blob URIs representing the blobs that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source blobs should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromMultipleBlobsAsync(IEnumerable<string> blobUris, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple data blobs
    /// </summary>
    /// <param name="blobDescriptions">A collection of <see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source blobs should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns><see cref="IKustoIngestionResult"/></returns>
    IKustoIngestionResult IngestFromMultipleBlobs(IEnumerable<BlobDescription> blobDescriptions, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);

    /// <summary>
    /// Ingest data from multiple data blobs asynchronously
    /// </summary>
    /// <param name="blobDescriptions">A collection of <see cref="BlobDescription"/> representing the blobs that will be ingested</param>
    /// <param name="deleteSourcesOnSuccess">Indicates if the source blobs should be deleted after a successful ingestion</param>
    /// <param name="ingestionProperties">Additional properties to be used during the ingestion process</param>
    /// <returns>An <see cref="IKustoIngestionResult"/> task</returns>
    Task<IKustoIngestionResult> IngestFromMultipleBlobsAsync(IEnumerable<BlobDescription> blobDescriptions, bool deleteSourcesOnSuccess, KustoIngestionProperties ingestionProperties);
}
```

## Class KustoDirectIngestClient
KustoDirectIngestClient implements the Direct ingestion mode and requires an authenticated connection to Kusto Engine service.
```csharp
public class KustoDirectIngestClient : IKustoIngestClient
{
    // The connection string for creation of the Kusto service connection object that will execute the ingestions
    public KustoDirectIngestClient(KustoConnectionStringBuilder kustoConnectionString);

    // The connection object of the Kusto service that will execute the ingestions
    public KustoDirectIngestClient(ICslAdminProvider kustoClient)
}
```

### Class KustoIngestionProperties

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

## Kusto Column Mappings and DataSourceFormat
Column mappings help Kusto determine what source data fields must go into each target table column. The mapping is mandatory for JSON data.

### Class JsonColumnMapping
```csharp
public class JsonColumnMapping
{
    /// The column name (in the Kusto table)
    public string ColumnName { get; set; }

    /// The JsonPath to the desired property in the JSON document
    public string JsonPath { get; set; }
}
```

### Class CsvColumnMapping
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

### DataSourceFormat enumeration
```csharp
public enum DataSourceFormat
{
    csv,
    tsv,
    log,
    storageanalyticslogformat,
    scsv,
    sohsv,
    json,
    psv
}
```

### Example of KustoIngestionProperties Definition
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


## Class KustoQueuedIngestClient
KustoQueuedIngestClient implements the Queued ingestion mode and requires an authenticated connection to Kusto Data Management service.<BR>

KustoQueuedIngestClient exposes [IRetryPolicy](https://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.retrypolicies.iretrypolicy.aspx) QueueRetryPolicy property, allowing control over the retry policy that is applied to posting ingestion messages to the incoming queue of the Data Management service.

```csharp
public class KustoQueuedIngestClient : IKustoIngestClient
{
    // KustoQueuedIngestClient object created with this constructor will take care about the temporary storage accounts and the ingestion queues details
    // For high ingestion rates the Data Management service will be configured to use multiple storage accounts and queues to prevent throttling.
    // kustoDMConnectionString: The connection object of the Kusto Data Management service that will execute the ingestions. 
    public KustoQueuedIngestClient(KustoConnectionStringBuilder kustoDMConnectionString);

    // KustoQueuedIngestClient object created with this constructor will use the parameters listed below for the temporary storage account and the ingestion queue
    // It's not scalable and cannot be used for high ingestion rate
    // queueConnectionString: The queue connection string details to which the ingestion messages will be sent
    // queueName: The name of the queue to which the ingestion messages will be sent
    // blobConnectionString: The connection string of the blob account that will be used as a temporary storage to upload the local files for ingestion. 
    // Can be null if KustoQueuedIngestClient is used only for blob ingestions.
    // blobContainerName: The name of the blob that will be used as a temporary storage to upload the local files for ingestion. 
    // Can be null if KustoQueuedIngestClient is used only for blob ingestions.
    public KustoQueuedIngestClient(string queueConnectionString, string queueName, string blobConnectionString, string blobContainerName)

    // Exposes IRetryPolicy
    public IRetryPolicy QueueRetryPolicy { get; set; }
}
```

### Class KustoQueuedIngestionProperties

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