---
title: LightIngest - Azure Data Explorer | Microsoft Docs
description: This article describes LightIngest in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019
---
# LightIngest

LightIngest is a command-line utility for ad-hoc data ingestion into Kusto.
The utility can pull source data from a local folder or from an Azure Blob Storage container.

## Getting the tool

* LightIngest is shipped as an executable (`LightIngest.exe`) and associated binaries
* The tool requires no installation and can be downloaded as part of the [Microsoft.Azure.Kusto.Tools NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)
* Once you have the the package downloaded, extract the contents of the *tools* directory in it

## Running the tool

Run `LightIngest.exe /help` to get help on the command-line arguments the tool requires and/or supports.

* First argument to `LightIngest` is the connection string to the Kusto cluster that will manage the ingestion and is mandatory.
  The connection string should be enclosed in double quotes and follow the [Kusto connection strings specification](../api/connection-strings/kusto.md)
* `LightIngest` can be configured to work with the ingestion endpoint at `https://ingest-{yourClusterNameAndRegion}.kusto.windows.net`,
  or directly with the engine endpoint (`https://{yourClusterNameAndRegion}.kusto.windows.net`). Pointing `LightIngest` at the ingestion endpoint is resomended,
  for it allows Kusto service to manage the ingestion load, as well as provides for recovery in case on transient errors.
* Raw data size (or its accurate estimation) is important for the optimal ingestion performance. `LightIngest` will do its 
  best to estimate the uncompressed size of local files, but it will have difficulties correctly estimating raw size of compressed 
  blobs without downloading them. If you are ingesting compressed blobs and are able to interfere with the blob creation process, 
  you can help `LightIngest` by setting `rawSizeBytes` property on the blob metadata to **uncompressed** data size in bytes.


## Command line arguments reference

|Argument name         |Short name   |Type    |Mandatory |Description                                |
|----------------------|-------------|--------|----------|-------------------------------------------|
|                      |             |string  |Mandatory |[Kusto Connection String](../api/connection-strings/kusto.md) specifying the Kusto endpoint that will handle the ingestion. Should be enclosed in double quotes |
|-database             |-db          |string  |Optional  |Target Kusto database name |
|-table                |             |string  |Mandatory |Target Kusto table name |
|-sourcePath           |-source      |string  |Mandatory |Path to source files or root URI of the blob container. If the data is in blobs, must contain storage account key or SAS. Recommended to enclose in double quotes |
|-prefix               |             |string  |Optional  |When the source data to ingest resides on blob storage, this is the URL prefix shared by all blobs, excluding the container name. For example, `MyContainer/Dir1/Dir2`. Recommended to enclose in double quotes |
|-pattern              |             |string  |Optional  |Pattern by which source files/blobs are picked. Supports wildcards. E.g., `"*.csv"`. Recommended to enclose in double quotes |
|-format               |-f           |string  |Optional  |Source data format. Must be one of the [supported formats](../management/data-ingestion/index.md#supported-data-formats) |
|-ingestionMappingPath |-mappingPath |string  |Optional  |Path to ingestion column mapping file (mandatory for Json and Avro formats). See [data mappings](../management/mappings.md) |
|-ingestionMappingRef  |-mappingRef  |string  |Optional  |Name of a pre-created ingestion column mapping (mandatory for Json and Avro formats). See [data mappings](../management/mappings.md) |
|-ignoreFirstRow       |-ignoreFirst |bool    |Optional  |If set, first record of each file/blob is ignored (e.g., if the source data has headers) |
|-tag                  |             |string  |Optional  |[Tags](../management/extents-overview.md#extent-tagging) to associate with the ingested data. Multiple occurrences are permitted |
|-dontWait             |             |bool    |Optional  |If set to 'true', does not wait for ingestion completion. Useful when ingesting large amounts of files/blobs |

### Additional arguments for advanced scenarios

|Argument name         |Short name   |Type    |Mandatory |Description                                |
|----------------------|-------------|--------|----------|-------------------------------------------|
|-compression          |-cr          |double  |Optional  |Compression ratio hint. Useful when ingesting compressed files/blobs to help Kusto assess the raw data size. Calculated as original size divided by compressed size |
|-limit                |-l           |integer |Optional  |If set, limits the ingestion to first N files |
|-ingestTimeout        |             |integer |Optional  |Timeout in minutes for all ingest operations completion. Defaults to `60`|
|-forceSync            |             |bool    |Optional  |If set, forces syncronous ingestion. Defaults to `false` |
|-dataBatchSize        |             |integer |Optional  |Sets the total size limit (MB, uncompressed) of each ingest operation |
|-filesInBatch         |             |integer |Optional  |Sets the file/blob count limit of each ingest operation |
|-devTracing           |-trace       |string  |Optional  |If set, diagnostic logs are written to a local directory (by default, `RollingLogs` in the current directory, or can be modified by setting the switch value) |


## Usage examples

**Example 1:**
* Ingest 10 blobs under specified storage account `ACCOUNT`, residing in folder `DIR` under container `CONT`, matching the pattern `*.csv.gz`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping `MAPPING` is precreated on the destination
* The tool will wait until the ingest operations complete
* Note the different options for specifying the target database and storage account key vs. SAS token

```
LightIngest.exe "https://ingest-{clusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}"
  -prefix:"DIR"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -limit:10

LightIngest.exe "https://ingest-{clusterAndRegion}.kusto.windows.net;Fed=True;Initial Catalog=DB"
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER}?{SAS token}"
  -prefix:"DIR"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -limit:10
```

**Example 2:**
* Ingest all blobs under specified storage account `ACCOUNT`, residing in folder `DIR1/DIR2` under container `CONT`, matching the pattern `*.csv.gz`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping `MAPPING` is precreated on the destination
* Source blobs contain header line, so the tool is instructed to drop the first record of each blob
* The tool will post the data for ingestion and will not wait for the ingest operations to complete

```
LightIngest.exe "https://ingest-{clusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER}?{SAS token}"
  -prefix:"DIR1/DIR2"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -ignoreFirstRow:true
```

**Example 3:**
* Ingest all files under path `PATH`, matching the pattern `*.json`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping is defined in local file `MAPPING_FILE_PATH`
* The tool will post the data for ingestion and will not wait for the ingest operations to complete

```
LightIngest.exe "https://ingest-{clusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"PATH"
  -pattern:*.json
  -format:json
  -mappingPath:"MAPPING_FILE_PATH"
```

**Example 4:**
* Ingest all files under path `PATH`, matching the pattern `*.json`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping is defined in local file `MAPPING_FILE_PATH`
* The tool will post the data for ingestion and will not wait for the ingest operations to complete
* Diagnostics trace files will be written locally under folder `LOGS_PATH`

```
LightIngest.exe "https://ingest-{clusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"PATH"
  -pattern:*.json
  -format:json
  -mappingPath:"MAPPING_FILE_PATH"
  -trace:"LOGS_PATH"
```