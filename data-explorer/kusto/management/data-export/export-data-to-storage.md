---
title:  Export data to storage
description: Learn how to export data to external storage.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/05/2023
---
# Export data to external storage

Executes a query and writes the first result set to an external storage, specified by a [storage connection string](../../api/connection-strings/storage-connection-strings.md).

## Permissions

You must have at least [Database Viewer](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.export` [`async`] [`compressed`] `to` *OutputDataFormat* `(` *StorageConnectionString* [`,` ...] `)` [`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`] `<|` *Query*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| `async` | string | | If specified, the command runs in asynchronous mode. See [asynchronous mode](#asynchronous-mode).|
| `compressed` | string | | If specified, the output storage artifacts are compressed as `.gz` files. See the `compressionType` [property](#properties) for compressing Parquet files as snappy.|
| *OutputDataFormat* | string | &check; | Indicates the data format of the storage artifacts written by the command. Supported values are: `csv`, `tsv`, `json`, and `parquet`.|
| *StorageConnectionString* | string | | One or more [storage connection strings](../../api/connection-strings/storage-connection-strings.md) that indicate which storage to write the data to. More than one storage connection string may be specified for scalable writes. Each such connection string must indicate the credentials to use when writing to storage. For example, when writing to Azure Blob Storage, the credentials can be the storage account key, or a shared access key (SAS) with the permissions to read, write, and list blobs.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of key-value property pairs. See [properties](#properties).|

> [!NOTE]
> We highly recommended exporting data to storage that is co-located in the same region as the cluster itself. This includes data that is exported so it can be transferred to another cloud service in other regions. Writes should be done locally, while reads can happen remotely.

## Properties

| Property | Type | Description |
|--|--|--|
| `includeHeaders` | `string` | For `csv`/`tsv` output, controls the generation of column headers. Can be one of `none` (default; no header lines emitted), `all` (emit a header line into every storage artifact), or `firstFile` (emit a header line into the first storage artifact only). |
| `fileExtension` | `string` | Indicates the "extension" part of the storage artifact (for example, `.csv` or `.tsv`). If compression is used, `.gz` is appended as well. |
| `namePrefix` | `string` | Indicates a prefix to add to each generated storage artifact name. A random prefix is used if left unspecified. |
| `encoding` | `string` | Indicates how to encode the text: `UTF8NoBOM` (default) or `UTF8BOM`. |
| `compressionType` | `string` | Indicates the type of compression to use. Possible values are `gzip` or `snappy`. Default is `gzip`. `snappy` can (optionally) be used for `parquet` format. |
| `distribution` | `string` | Distribution hint (`single`, `per_node`, `per_shard`). If value equals `single`, a single thread writes to storage. Otherwise, export writes from all nodes executing the query in parallel. See [evaluate plugin operator](../../query/evaluateoperator.md). Defaults to `per_shard`. |
| `persistDetails` | `bool` | Indicates that the command should persist its results (see `async` flag). Defaults to `true` in async runs, but can be turned off if the caller doesn't require the results). Defaults to `false` in synchronous executions, but can be turned on in those as well. |
| `sizeLimit` | `long` | The size limit in bytes of a single storage artifact being written (prior to compression). Allowed range is 100 MB (default) to 1 GB. |
| `parquetRowGroupSize` | `int` | Relevant only when data format is Parquet. Controls the row group size in the exported files. Default row group size is 100,000 records. |
| `distributed` | `bool` | Disable/enable distributed export. Setting to false is equivalent to `single` distribution hint. Default is true. |
| `useNativeParquetWriter` | `bool` | Use the new export implementation when exporting to Parquet, this implementation is a more performant, resource light export mechanism. An exported 'datetime' column is currently unsupported by Synapse SQL 'COPY'. Default is false. |

## Authentication and authorization

The authentication method is based on the connection string provided, and the permissions required vary depending on the authentication method.

The following table lists the supported authentication methods and the permissions needed for exporting data to external storage by storage type.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Impersonation](../../api/connection-strings/storage-authentication-methods.md#impersonation)|Storage Blob Data Contributor|Contributor|
|[Shared Access (SAS) token](../../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token)|Write|Write|
|[Microsoft Entra access token](../../api/connection-strings/storage-authentication-methods.md#azure-ad-access-token)||
|[Storage account access key](../../api/connection-strings/storage-authentication-methods.md#storage-account-access-key)|||

## Returns

The commands return a table that describes the generated storage artifacts.
Each record describes a single artifact and includes the storage path to the
artifact and how many records it holds.

|Path|NumRecords|
|---|---|
|http://storage1.blob.core.windows.net/containerName/export_1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/export_2_454c0f1359e24795b6529da8a0101330.csv|15|

## Asynchronous mode

If the `async` flag is specified, the command executes in asynchronous mode.
In this mode, the command returns immediately with an operation ID, and data
export continues in the background until completion. The operation ID returned
by the command can be used to track its progress and ultimately its results
via the following commands:

* [`.show operations`](../operations.md#show-operations): Track progress.
* [`.show operation details`](../operations.md#show-operation-details): Get completion results.

For example, after a successful completion, you can retrieve the results using:

```kusto
.show operation f008dc1e-2710-47d8-8d34-0d562f5f8615 details
```

## Examples

In this example, Kusto runs the query and then exports the first recordset produced by the query to one or more compressed CSV blobs, up to 1GB before compression.
Column name labels are added as the first row for each blob.

```kusto 
.export
  async compressed
  to csv (
    h@"https://storage1.blob.core.windows.net/containerName;secretKey",
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey"
  ) with (
    sizeLimit=1000000000,
    namePrefix="export",
    includeHeaders="all",
    encoding="UTF8NoBOM"
  )
  <| 
  Logs | where id == "1234" 
```

## Failures during export commands

Export commands can transiently fail during execution. [Continuous export](continuous-data-export.md) will automatically retry the command. Regular export commands ([export to storage](export-data-to-storage.md), [export to external table](export-data-to-an-external-table.md)) don't perform any retries.

*  When the export command fails, artifacts that were already written to storage aren't deleted. These artifacts remain in storage. If the command fails, assume the export is incomplete, even if some artifacts were written. 
* The best way to track both completion of the command and the artifacts exported upon successful completion is by using the [`.show operations`](../operations.md#show-operations) and [`.show operation details`](../operations.md#show-operation-details) commands.

### Storage failures

By default, export commands are distributed such that there may be many concurrent writes to storage. The level of distribution depends on the type of export command:
* The default distribution for regular `.export` command is `per_shard`, which means all [extents](../extents-overview.md) that contain data to export write to storage concurrently. 
* The default distribution for [export to external table](export-data-to-an-external-table.md) commands is `per_node`, which means the concurrency is the number of nodes in the cluster.

When the number of extents/nodes is large, this may lead to high load on storage that results in storage throttling, or transient storage errors. The following suggestions may overcome these errors (by order of priority):

* Increase the number of storage accounts provided to the export command or to the [external table definition](../external-tables-azurestorage-azuredatalake.md) (the load will be evenly distributed between the accounts).
* Reduce the concurrency by setting the distribution hint to `per_node` (see command properties).
* Reduce concurrency of number of nodes exporting by setting the [client request property](../../api/netfx/request-properties.md) `query_fanout_nodes_percent` to the desired concurrency (percent of nodes). The property can be set as part of the export query. For example, the following command limits the number of nodes writing to storage concurrently to 50% of the cluster nodes:

    ```kusto
    .export async  to csv
        ( h@"https://storage1.blob.core.windows.net/containerName;secretKey" ) 
        with
        (
            distribution="per_node"
        ) 
        <| 
        set query_fanout_nodes_percent = 50;
        ExportQuery
    ```

* Reduce concurrency of number of threads exporting in each node when using per shard export, by setting the [client request property](../../api/netfx/request-properties.md) `query_fanout_threads_percent` to the desired concurrency (percent of threads). The property can be set as part of the export query. For example, the following command limits the number of threads writing to storage concurrently to 50% on each of the cluster nodes:

    ```kusto
    .export async  to csv
        ( h@"https://storage1.blob.core.windows.net/containerName;secretKey" ) 
        with
        (
            distribution="per_shard"
        ) 
        <| 
        set query_fanout_threads_percent = 50;
        ExportQuery
    ```

* If exporting to a partitioned external table, setting the `spread`/`concurrency` properties can reduce concurrency (see details in the [command properties](export-data-to-an-external-table.md#syntax).
* If neither of the above work, you can completely disable distribution by setting the `distributed` property to false. However, we don't recommend doing so, as it may significantly affect the command performance.

### Authorization failures

Authentication or authorization failures during export commands can occur when the credentials provided in the storage connection string aren't permitted to write to storage. If you're using `impersonate` or a user-delegated SAS token for the export command, the [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role is required to write to the storage account. For more information, see [Storage connection strings](../../api/connection-strings/storage-connection-strings.md).

## Data types mapping

### Parquet data types mapping

On export, Kusto data types are mapped to Parquet data types using the following rules:


| Kusto Data Type | Parquet Data Type | Parquet Annotation | Comments |
| --------------- | ----------------- | ------------------ | -------- |
| `bool`     | `BOOLEAN` | | |
| `datetime` | `INT64` | TIMESTAMP_MICROS | |
| `dynamic`  | `BYTE_ARRAY` | UTF-8 | Serialized as JSON string |
| `guid` | `BYTE_ARRAY` | UTF-8 | |
| `int` | `INT32` | | |
| `long` | `INT64` | | |
| `real` | `DOUBLE` | | |
| `string` | `BYTE_ARRAY` | UTF-8 | |
| `timespan` | `INT64` | | Stored as ticks (100-nanosecond units) count |
| `decimal` | `FIXED_LENGTH_BYTE_ARRAY` | DECIMAL | |

When specifying 'useNativeParquetWriter=false', Kusto data types are mapped to Parquet data types using the following rules:

| Kusto Data Type | Parquet Data Type | Parquet Annotation | Comments |
| --------------- | ----------------- | ------------------ | -------- |
| `bool`     | `BOOLEAN` | | |
| `datetime` | `INT96` | | |
| `dynamic`  | `BYTE_ARRAY` | UTF-8 | Serialized as JSON string |
| `guid` | `BYTE_ARRAY` | UTF-8 | |
| `int` | `INT32` | | |
| `long` | `INT64` | | |
| `real` | `DOUBLE` | | |
| `string` | `BYTE_ARRAY` | UTF-8 | |
| `timespan` | `INT64` | | Stored as ticks (100-nanosecond units) count |
| `decimal` | `BYTE_ARRAY` | DECIMAL | |
