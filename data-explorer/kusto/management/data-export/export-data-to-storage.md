---
title: Export data to storage - Azure Data Explorer | Microsoft Docs
description: This article describes Export data to storage in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/02/2019
---
# Export data to storage

The `.export` command executes a query and writes the first result set to an
external storage, specified by a [storage connection string](../../api/connection-strings/storage.md).

**Syntax**

`.export` [`async`] [`compressed`]
`to` *OutputDataFormat*
`(` *StorageConnectionString* [`,` ...] `)`
[`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`]
`<|` *Query*

**Arguments**

* `async`: If specified, indicates that the command runs in asynchronous mode.
  See below for more details on the behavior in this mode.

* `compressed`: If specified, the output storage artifacts are compressed
  as `.gz` files.

* *OutputDataFormat*: Indicates the data format of the storage artifacts written
  by the command. Supported values are: `csv`, `tsv`, `json`, and `parquet`.

* *StorageConnectionString*: Specifies one or more [storage connection strings](../../api/connection-strings/storage.md)
  that indicate which storage to write the data to. (More than one storage
  connection string may be specified for scalable writes.) Each such connection
  string must indicate the credentials to use when writing to storage.
  For example, when writing to Azure Blob Storage, the credentials can be the
  storage account key, or a shared access key (SAS) with the permissions to
  read, write, and list blobs.

> [!NOTE]
> It is highly recommended to export data to storage that is co-located in the
> same region as the Kusto cluster itself. This includes the case in which data
> export is done in order to transfer the data to another cloud service in
> another regions; writes should be done locally, while reads can happen remotely.

* *PropertyName*/*PropertyValue*: Zero or more optional export properties:

|Property        |Type    |Description                                                                                                                |
|----------------|--------|---------------------------------------------------------------------------------------------------------------------------|
|`sizeLimit`     |`long`  |The size limit in bytes of a single storage artifact being written (prior to compression). Allowed range is 100MB (default) to 1GB.|
|`includeHeaders`|`string`|For `csv`/`tsv` output, controls the generation of column headers. Can be one of `none` (default; no header lines emitted), `all` (emit a header line into every storage artifact), or `firstFile` (emit a header line into the first storage artifact only).|
|`fileExtension` |`string`|Indicates the "extension" part of the storage artifact (e.g. `.csv` or `.tsv`) Note that if compression is used, `.gz` will be appended as well.|
|`namePrefix`    |`string`|Indicates a prefix to add to each generated storage artifact name. A random prefix will be used if left unspecified.       |
|`encoding`      |`string`|Indicates how to encode the text: `UTF8NoBOM` (default) or `UTF8BOM`.                                                      
|`compressionType`|`string`|Indicates the type of compression to use: `gzip` (default, if `compressed` is specified) or `snappy` (supported only for `parquet` format).     
|`distributed`   |`bool`  |Indicates that the export writes from all nodes executing the query in parallel. (Defaults to `true`.)                     |
|`persistDetails`|`bool`  |Indicates that the command should persist its results (see `async` flag). Defaults to `true` in async runs, but can be turned off if the caller does not require the results). Defaults to `false` in synchronous executions, but can be turned on in those as well. |

**Results**

The commands returns back a table that describes the generated storage artifacts.
Each record describes a single artifact, and includes the storage path to the
artifact and how many data records it holds.

|Path|NumRecords|
|---|---|
|http://storage1.blob.core.windows.net/containerName/export_1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/export_2_454c0f1359e24795b6529da8a0101330.csv|15|

**Asynchronous mode**

If the `async` flag is specified, the command executes in asynchronous mode.
In this mode, the command returns immediately with an operation ID, and data
export continues in the background until completion. The operation ID returned
by the command can be used to track its progress and ultimately its results
via the following commands:

* [.show operations](../operations.md#show-operations): Track progress.
* [.show operation details](../operations.md#show-operation-details): Get completion results.

For example, after a successful completion, one can retrieve the results using:

```kusto
.show operation f008dc1e-2710-47d8-8d34-0d562f5f8615 details
```

**Limitations**

If the output data format is set to `parquet`, export may produce storage artifacts, containing only the schema and no 
records (indicating that the node writing the artifact had no records to write).
As an optional mitigation, one might disable executing the export process in a
distributed fashion (set `distributed` to `false`). This is not recommended, however,
as it adds load on the cluster due to the need to write all data from a single
cluster node. Note also that if the query returns no records at all, a single storage
artifact will still be produced (even if distribution is disabled).

**Examples** 

In this example, Kusto runs the query and then exports the first recordset produced by the query to one or more compressed CSV blobs.
Column name labels are added as the first row for each blob.

```kusto 
.export
  async compressed
  to csv (
    h@"https://storage1.blob.core.windows.net/containerName;secretKey",
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey"
  ) with (
    sizeLimit=100000,
    namePrefix=export,
    includeHeaders=all,
    encoding =UTF8NoBOM
  )
  <| myLogs | where id == "moshe" | limit 10000
```