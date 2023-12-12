---
title: Ingest JSON formatted data into Azure Data Explorer
description: Learn about how to ingest JSON formatted data into Azure Data Explorer.
ms.reviewer: kerend
ms.topic: how-to
ms.date: 09/14/2022
---

# Ingest JSON formatted sample data into Azure Data Explorer

This article shows you how to ingest JSON formatted data into an Azure Data Explorer database. You'll start with simple examples of raw and mapped JSON, continue to multi-lined JSON, and then tackle more complex JSON schemas containing arrays and dictionaries.  The examples detail the process of ingesting JSON formatted data using Kusto Query Language (KQL), C#, or Python.

> [!NOTE]
> We don't recommend using `.ingest` management commands in production scenarios. Instead, use a [data connector](connector-overview.md) or programmatically ingest data using one of the [Kusto client libraries](kusto/api/client-libraries.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## The JSON format

Azure Data Explorer supports two JSON file formats:

* `json`: Line separated JSON. Each line in the input data has exactly one JSON record. This format supports parsing of comments and single-quoted properties. For more information, see [JSON Lines](https://jsonlines.org/).
* `multijson`: Multi-lined JSON. The parser ignores the line separators and reads a record from the previous position to the end of a valid JSON.

> [!NOTE]
> When ingesting using the [ingestion wizard](ingest-data-wizard.md), the default format is `multijson`. The format can handle multiline JSON records and arrays of JSON records. When a parsing error is encountered, the entire file is discarded. To ignore invalid JSON records, select the option to "Ignore data format errors.", which will switch the format to `json` (JSON Lines).
> 
> If you're using the JSON Line format (`json`), lines that don't represent a valid JSON records are skipped during parsing.

### Ingest and map JSON formatted data

Ingestion of JSON formatted data requires you to specify the *format* using [ingestion property](ingestion-properties.md). Ingestion of JSON data requires [mapping](kusto/management/mappings.md), which maps a JSON source entry to its target column. When ingesting data, use the `IngestionMapping` property with its `ingestionMappingReference` (for a pre-defined mapping) ingestion property or its `IngestionMappings` property. This article will use the `ingestionMappingReference` ingestion property, which is pre-defined on the table used for ingestion. In the examples below, we'll start by ingesting JSON records as raw data to a single column table. Then we'll use the mapping to ingest each property to its mapped column.

### Simple JSON example

The following example is a simple JSON, with a flat structure. The data has temperature and humidity information, collected by several devices. Each record is marked with an ID and timestamp.

```json
{
    "timestamp": "2019-05-02 15:23:50.0369439",
    "deviceId": "2945c8aa-f13e-4c48-4473-b81440bb5ca2",
    "messageId": "7f316225-839a-4593-92b5-1812949279b3",
    "temperature": 31.0301639051317,
    "humidity": 62.0791099602725
}
```

## Ingest raw JSON records

In this example, you ingest JSON records as raw data to a single column table. The data manipulation, using queries, and update policy is done after the data is ingested.

### [KQL](#tab/kusto-query-language)

Use Kusto Query Language to ingest data in a raw [JSON format](#the-json-format).

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

1. Select **Add cluster**.

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run** to create the table.

    ```kusto
    .create table RawEvents (Event: dynamic)
    ```

    This query creates a table with a single `Event` column of a [dynamic](kusto/query/scalar-data-types/dynamic.md) data type.

1. Create the JSON mapping.

    ```kusto
    .create table RawEvents ingestion json mapping 'RawEventMapping' '[{"column":"Event","Properties":{"path":"$"}}]'
    ```

    This command creates a mapping, and maps the JSON root path `$` to the `Event` column.

1. Ingest data into the `RawEvents` table.

    ```kusto
    .ingest into table RawEvents ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json') with '{"format":"json", "ingestionMappingReference":"RawEventMapping"}'
    ```

### [C#](#tab/c-sharp)

Use C# to ingest data in raw [JSON format](#the-json-format).

1. Create the `RawEvents` table.

    ```csharp
    var kustoUri = "https://<clusterName>.<region>.kusto.windows.net/";
    var connectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    {
        FederatedSecurity = true,
        UserID = userId,
        Password = password,
        Authority = tenantId,
        InitialCatalog = databaseName
    };
    using var kustoClient = KustoClientFactory.CreateCslAdminProvider(connectionStringBuilder);
    var tableName = "RawEvents";
    var command = CslCommandGenerator.GenerateTableCreateCommand(
        tableName,
        new[] { Tuple.Create("Events", "System.Object") }
    );
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

1. Create the JSON mapping.

    ```csharp
    var tableMappingName = "RawEventMapping";
    command = CslCommandGenerator.GenerateTableMappingCreateCommand(
        IngestionMappingKind.Json,
        tableName,
        tableMappingName,
        new ColumnMapping[]
        {
            new() { ColumnName = "Events", Properties = new Dictionary<string, string> { { "path", "$" } } }
        }
    );
    
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

    This command creates a mapping, and maps the JSON root path `$` to the `Event` column.

1. Ingest data into the `RawEvents` table.

    ```csharp
    var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net/";
    
    var ingestConnectionStringBuilder = new KustoConnectionStringBuilder(ingestUri)
    {
        FederatedSecurity = true,
        UserID = userId,
        Password = password,
        Authority = tenantId,
        InitialCatalog = databaseName
    };
    using var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestConnectionStringBuilder);
    
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json";
    var properties = new KustoQueuedIngestionProperties(databaseName, tableName)
    {
        Format = DataSourceFormat.json,
        IngestionMapping = new IngestionMapping { IngestionMappingReference = tableMappingName }
    };
    await ingestClient.IngestFromStorageAsync(blobPath, properties);
    ```

> [!NOTE]
> Data is aggregated according to [batching policy](kusto/management/batchingpolicy.md), resulting in a latency of a few minutes.

### [Python](#tab/python)

Use Python to ingest data in raw [JSON format](#the-json-format).

1. Create the `RawEvents` table.

    ```python
    KUSTO_URI = "https://<ClusterName>.<Region>.kusto.windows.net/"
    KCSB_DATA = KustoConnectionStringBuilder.with_aad_device_authentication(KUSTO_URI, AAD_TENANT_ID)
    KUSTO_CLIENT = KustoClient(KCSB_DATA)
    TABLE = "RawEvents"

    CREATE_TABLE_COMMAND = ".create table " + TABLE + " (Events: dynamic)"
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_TABLE_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Create the JSON mapping.

    ```python
    MAPPING = "RawEventMapping"
    CREATE_MAPPING_COMMAND = ".create table " + TABLE + " ingestion json mapping '" + MAPPING + """' '[{"column":"Event","path":"$"}]'"""
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_MAPPING_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `RawEvents` table.

    ```python
    INGEST_URI = "https://ingest-<ClusterName>.<Region>.kusto.windows.net/"
    KCSB_INGEST = KustoConnectionStringBuilder.with_aad_device_authentication(INGEST_URI, AAD_TENANT_ID)
    INGESTION_CLIENT = KustoIngestClient(KCSB_INGEST)
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json'

    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.JSON, ingestion_mapping_reference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

    > [!NOTE]
    > Data is aggregated according to [batching policy](kusto/management/batchingpolicy.md), resulting in a latency of a few minutes.

---

## Ingest mapped JSON records

In this example, you ingest JSON records data. Each JSON property is mapped to a single column in the table.

### [KQL](#tab/kusto-query-language)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands.

    ```kusto
    .create table Events (Time: datetime, Device: string, MessageId: string, Temperature: double, Humidity: double)
    ```

1. Create the JSON mapping.

    ```kusto
    .create table Events ingestion json mapping 'FlatEventMapping' '[{"column":"Time","Properties":{"path":"$.timestamp"}},{"column":"Device","Properties":{"path":"$.deviceId"}},{"column":"MessageId","Properties":{"path":"$.messageId"}},{"column":"Temperature","Properties":{"path":"$.temperature"}},{"column":"Humidity","Properties":{"path":"$.humidity"}}]'
    ```

    In this mapping, as defined by the table schema, the `timestamp` entries will be ingested to the column `Time` as `datetime` data types.

1. Ingest data into the `Events` table.

    ```kusto
    .ingest into table Events ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json') with '{"format":"json", "ingestionMappingReference":"FlatEventMapping"}'
    ```

    The file 'simple.json' has a few line-separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.

### [C#](#tab/c-sharp)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands.

     ```csharp
    var tableName = "Events";
    var command = CslCommandGenerator.GenerateTableCreateCommand(
        tableName,
        new[]
        {
            Tuple.Create("Time", "System.DateTime"),
            Tuple.Create("Device", "System.String"),
            Tuple.Create("MessageId", "System.String"),
            Tuple.Create("Temperature", "System.Double"),
            Tuple.Create("Humidity", "System.Double")
        }
    );
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

1. Create the JSON mapping.

    ```csharp
    var tableMappingName = "FlatEventMapping";
    command = CslCommandGenerator.GenerateTableMappingCreateCommand(
        IngestionMappingKind.Json,
        tableName,
        tableMappingName,
        new ColumnMapping[]
        {
            new() { ColumnName = "Time", Properties = new Dictionary<string, string> { { MappingConsts.Path, "$.timestamp" } } },
            new() { ColumnName = "Device", Properties = new Dictionary<string, string> { { MappingConsts.Path, "$.deviceId" } } },
            new() { ColumnName = "MessageId", Properties = new Dictionary<string, string> { { MappingConsts.Path, "$.messageId" } } },
            new() { ColumnName = "Temperature", Properties = new Dictionary<string, string> { { MappingConsts.Path, "$.temperature" } } },
            new() { ColumnName = "Humidity", Properties = new Dictionary<string, string> { { MappingConsts.Path, "$.humidity" } } }
        }
    );
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

    In this mapping, as defined by the table schema, the `timestamp` entries will be ingested to the column `Time` as `datetime` data types.

1. Ingest data into the `Events` table.

    ```csharp
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json";
    var properties = new KustoQueuedIngestionProperties(databaseName, tableName)
    {
        Format = DataSourceFormat.json,
        IngestionMapping = new IngestionMapping { IngestionMappingReference = tableMappingName }
    };
    await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
    ```

    The file 'simple.json' has a few line-separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.

### [Python](#tab/python)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands.

    ```python
    TABLE = "Events"
    CREATE_TABLE_COMMAND = ".create table " + TABLE + " (Time: datetime, Device: string, MessageId: string, Temperature: double, Humidity: double)"
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_TABLE_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Create the JSON mapping.

    ```python
    MAPPING = "FlatEventMapping"
    CREATE_MAPPING_COMMAND = ".create table Events ingestion json mapping '" + MAPPING + """' '[{"column":"Time","Properties":{"path":"$.timestamp"}},{"column":"Device","Properties":{"path":"$.deviceId"}},{"column":"MessageId","Properties":{"path":"$.messageId"}},{"column":"Temperature","Properties":{"path":"$.temperature"}},{"column":"Humidity","Properties":{"path":"$.humidity"}}]'"""
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_MAPPING_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `Events` table.

    ```python
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json'

    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.JSON, ingestion_mapping_reference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

    The file 'simple.json' has a few line separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.

---

## Ingest multi-lined JSON records

In this example, you ingest multi-lined JSON records. Each JSON property is mapped to a single column in the table. The file 'multilined.json' has a few indented JSON records. The format `multijson` indicates to read records by the JSON structure.

### [KQL](#tab/kusto-query-language)

Ingest data into the `Events` table.

```kusto
.ingest into table Events ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json') with '{"format":"multijson", "ingestionMappingReference":"FlatEventMapping"}'
```

### [C#](#tab/c-sharp)

Ingest data into the `Events` table.

```csharp
var tableMappingName = "FlatEventMapping";
var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json";
var properties = new KustoQueuedIngestionProperties(databaseName, tableName)
{
    Format = DataSourceFormat.multijson,
    IngestionMapping = new IngestionMapping { IngestionMappingReference = tableMappingName }
};
await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
```

### [Python](#tab/python)

Ingest data into the `Events` table.

```python
MAPPING = "FlatEventMapping"
BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json'
INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.MULTIJSON, ingestion_mapping_reference=MAPPING)
BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
INGESTION_CLIENT.ingest_from_blob(
    BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
```

---

## Ingest JSON records containing arrays

Array data types are an ordered collection of values. Ingestion of a JSON array is done by an [update policy](./kusto/management/show-table-update-policy-command.md). The JSON is ingested as-is to an intermediate table. An update policy runs a pre-defined function on the `RawEvents` table, reingesting the results to the target table. We'll ingest data with the following structure:

```json
{
    "records":
    [
        {
            "timestamp": "2019-05-02 15:23:50.0000000",
            "deviceId": "ddbc1bf5-096f-42c0-a771-bc3dca77ac71",
            "messageId": "7f316225-839a-4593-92b5-1812949279b3",
            "temperature": 31.0301639051317,
            "humidity": 62.0791099602725
        },
        {
            "timestamp": "2019-05-02 15:23:51.0000000",
            "deviceId": "ddbc1bf5-096f-42c0-a771-bc3dca77ac71",
            "messageId": "57de2821-7581-40e4-861e-ea3bde102364",
            "temperature": 33.7529423105311,
            "humidity": 75.4787976739364
        }
    ]
}
```

### [KQL](#tab/kusto-query-language)

1. Create an `update policy` function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.

    ```kusto
    .create function EventRecordsExpand() {
        RawEvents
        | mv-expand records = Event.records
        | project
            Time = todatetime(records["timestamp"]),
            Device = tostring(records["deviceId"]),
            MessageId = tostring(records["messageId"]),
            Temperature = todouble(records["temperature"]),
            Humidity = todouble(records["humidity"])
    }
    ```

1. The schema received by the function must match the schema of the target table. Use `getschema` operator to review the schema.

    ```kusto
    EventRecordsExpand() | getschema
    ```

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest the results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```kusto
    .alter table Events policy update @'[{"Source": "RawEvents", "Query": "EventRecordsExpand()", "IsEnabled": "True"}]'
    ```

1. Ingest data into the `RawEvents` table.

    ```kusto
    .ingest into table RawEvents ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json') with '{"format":"multijson", "ingestionMappingReference":"RawEventMapping"}'
    ```

1. Review data in the `Events` table.

    ```kusto
    Events
    ```

### [C#](#tab/c-sharp)

1. Create an update function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.

    ```csharp
    var command = CslCommandGenerator.GenerateCreateFunctionCommand(
        "EventRecordsExpand",
        "UpdateFunctions",
        string.Empty,
        null,
        @"RawEvents
        | mv-expand records = Event
        | project
            Time = todatetime(records['timestamp']),
            Device = tostring(records['deviceId']),
            MessageId = tostring(records['messageId']),
            Temperature = todouble(records['temperature']),
            Humidity = todouble(records['humidity'])",
        ifNotExists: false
    );
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

    > [!NOTE]
    > The schema received by the function must match the schema of the target table.

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest its results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```csharp
    command = ".alter table Events policy update @'[{'Source': 'RawEvents', 'Query': 'EventRecordsExpand()', 'IsEnabled': 'True'}]";
    await kustoClient.ExecuteControlCommandAsync(command);
    ```

1. Ingest data into the `RawEvents` table.

    ```csharp
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json";
    var tableName = "RawEvents";
    var tableMappingName = "RawEventMapping";
    var properties = new KustoQueuedIngestionProperties(databaseName, tableName)
    {
        Format = DataSourceFormat.multijson,
        IngestionMapping = new IngestionMapping { IngestionMappingReference = tableMappingName }
    };
    await ingestClient.IngestFromStorageAsync(blobPath, properties);
    ```

1. Review data in the `Events` table.

### [Python](#tab/python)

1. Create an update function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.

    ```python
    CREATE_FUNCTION_COMMAND =
        '''.create function EventRecordsExpand() {
            RawEvents
            | mv-expand records = Event
            | project
                Time = todatetime(records["timestamp"]),
                Device = tostring(records["deviceId"]),
                MessageId = tostring(records["messageId"]),
                Temperature = todouble(records["temperature"]),
                Humidity = todouble(records["humidity"])
            }'''
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_FUNCTION_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

    > [!NOTE]
    > The schema received by the function has to match the schema of the target table.

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest its results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```python
    CREATE_UPDATE_POLICY_COMMAND =
        """.alter table Events policy update @'[{'Source': 'RawEvents', 'Query': 'EventRecordsExpand()', 'IsEnabled': 'True'}]"""
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_UPDATE_POLICY_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `RawEvents` table.

    ```python
    TABLE = "RawEvents"
    MAPPING = "RawEventMapping"
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json'
    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.MULTIJSON, ingestion_mapping_reference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

1. Review data in the `Events` table.

---

## Related content

* [Data ingestion overview](ingest-data-overview.md)
* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
