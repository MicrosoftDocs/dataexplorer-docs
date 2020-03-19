---
title: LightIngest - Azure Data Explorer | Microsoft Docs
description: This article describes LightIngest in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2020
---
# LightIngest

LightIngest is a command-line utility for ad-hoc data ingestion into Kusto.
The utility can pull source data from a local folder or from an Azure blob storage container.

## Prerequisites

* LightIngest - download it as part of the [Microsoft.Azure.Kusto.Tools NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)
* WinRAR - download it from [www.win-rar.com/download.html](www.win-rar.com/download.html)

## Install LightIngest

1. Navigate to the location on your computer where you downloaded LightIngest. 
1. Using WinRAR, extract the *tools* directory to your computer.

## Run LightIngest

1. Navigate to the extracted *tools* directory on your computer.
1. Delete the existing location information from the location bar.
    
      ![Delete location information](./images/KustoTools-Lightingest/lightingest-locationbar.png)

1. Enter `cmd` and press **Enter**.
1. At the command prompt, enter `LightIngest.exe` followed by the relevant command-line argument.

    > [!Tip]
    > For a list of supported command-line arguments, enter `LightIngest.exe /help`.
    >
    >![Command line Help](./images/KustoTools-Lightingest/lightingest-cmd-line-help.png)

1. (Mandatory) Enter `LightIngest` followed by the connection string to the Kusto cluster that will manage the ingestion.
    The connection string should be enclosed in double quotes and follow the [Kusto connection strings specification](../api/connection-strings/kusto.md).

    For example:
    ```
    LightIngest "https://<your cluster and region>.kusto.windows.net;AAD Federated Security=True" -db:TzviaTest -table:Trips -source:"https://<bLob container URI with SAS or account key>" -pattern:"*.csv.gz" -format:csv -limit:2 -ignoreFirst:true -cr:10.0 -dontWait:true
    ```

> [!Note]
> * It's recommended to configure `LightIngest` to work with the ingestion endpoint at `https://ingest-{yourClusterNameAndRegion}.kusto.windows.net`. This way the Kusto service can manage the ingestion load, and it provides for recovery in case of transient errors. However, you can also configure `LightIngest` to work directly with the engine endpoint (`https://{yourClusterNameAndRegion}.kusto.windows.net`).
> * Knowing the raw data size is important for optimal ingestion performance. `LightIngest` will estimate the uncompressed size of local files. However, for compressed blobs, `LightIngest` could have difficulties correctly estimating their raw size without first downloading them. When ingesting compressed blobs, it will be helpful for `LightIngest` performance if you set the `rawSizeBytes` property on the blob metadata to uncompressed data size in bytes.

## Command line arguments reference

|Argument name         |Short name   |Type    |Mandatory |Description                                |
|----------------------|-------------|--------|----------|-------------------------------------------|
|                      |             |string  |Mandatory |[Kusto Connection String](../api/connection-strings/kusto.md) specifying the Kusto endpoint that will handle the ingestion. Should be enclosed in double quotes |
|-database             |-db          |string  |Optional  |Target Kusto database name |
|-table                |             |string  |Mandatory |Target Kusto table name |
|-sourcePath           |-source      |string  |Mandatory |Path to source files or root URI of the blob container. If the data is in blobs, must contain storage account key or SAS. Recommended to enclose in double quotes |
|-prefix               |             |string  |Optional  |When the source data to ingest resides on blob storage, this URL prefix is shared by all blobs, **excluding** the container name.<br>For example, if the data is in `MyContainer/Dir1/Dir2`, then the prefix should be `Dir1/Dir2`. Enclosing in double quotes is recommended |
|-pattern              |             |string  |Optional  |Pattern by which source files/blobs are picked. Supports wildcards. E.g., `"*.csv"`. Recommended to enclose in double quotes |
|-zipPattern           |             |string  |Optional  |Regular expression to use when selecting which files in a ZIP archive to ingest.<br>All other files in the archive will be ignored. E.g., `"*.csv"`. Recommended to enclose in double quotes |
|-format               |-f           |string  |Optional  |Source data format. Must be one of the [supported formats](../management/data-ingestion/index.md#supported-data-formats) |
|-ingestionMappingPath |-mappingPath |string  |Optional  |Path to ingestion column mapping file (mandatory for Json and Avro formats). See [data mappings](../management/mappings.md) |
|-ingestionMappingRef  |-mappingRef  |string  |Optional  |Name of a pre-created ingestion column mapping (mandatory for Json and Avro formats). See [data mappings](../management/mappings.md) |
|-creationTimePattern  |             |string  |Optional  |When set, will be used to extract the CreationTime property from the file/blob path. See [Using CreationTimePattern argument](#using_creationtimepattern-argument) |
|-ignoreFirstRow       |-ignoreFirst |bool    |Optional  |If set, first record of each file/blob is ignored (e.g., if the source data has headers) |
|-tag                  |             |string  |Optional  |[Tags](../management/extents-overview.md#extent-tagging) to associate with the ingested data. Multiple occurrences are permitted |
|-dontWait             |             |bool    |Optional  |If set to 'true', does not wait for ingestion completion. Useful when ingesting large amounts of files/blobs |

### Using CreationTimePattern argument

`-creationTimePattern` argument is used to extract the CreationTime property from the file/blob path. The pattern does not need to reflect the entire item path, but just the section enclosing the timestamp you wish to use.
The value of the argument must contain of three sections:
* Constant test immediately preceding the timestamp, enclosed in single quotes
* The timestamp format, in standard [.NET DateTime notation](https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings)
* Constant text immediately following the timestamp

For example, if blob names end with 'historicalvalues19840101.parquet' (the timestamp is 4 digits for the year, 2 digits for the month and 2 digits fot the day of month), the corresponding value for the `-creationTimePattern` argument is 'historicalvalues'yyyyMMdd'.parquet'.


### Additional arguments for advanced scenarios

|Argument name         |Short name   |Type    |Mandatory |Description                                |
|----------------------|-------------|--------|----------|-------------------------------------------|
|-compression          |-cr          |double  |Optional  |Compression ratio hint. Useful when ingesting compressed files/blobs to help Kusto assess the raw data size. Calculated as original size divided by compressed size |
|-limit                |-l           |integer |Optional  |If set, limits the ingestion to first N files |
|-listOnly             |-list        |bool    |Optional  |If set, only displays the items that would have been selected for ingestion |
|-ingestTimeout        |             |integer |Optional  |Timeout in minutes for all ingest operations completion. Defaults to `60`|
|-forceSync            |             |bool    |Optional  |If set, forces syncronous ingestion. Defaults to `false` |
|-dataBatchSize        |             |integer |Optional  |Sets the total size limit (MB, uncompressed) of each ingest operation |
|-filesInBatch         |             |integer |Optional  |Sets the file/blob count limit of each ingest operation |
|-devTracing           |-trace       |string  |Optional  |If set, diagnostic logs are written to a local directory (by default, `RollingLogs` in the current directory, or can be modified by setting the switch value) |


## Blob metadata properties

When used with Azure blobs, `LightIngest` will use certain blob metadata properties to augment the ingestion process.

|Metadata property                            | Usage                                                                           |
|---------------------------------------------|---------------------------------------------------------------------------------|
|`rawSizeBytes`, `kustoUncompressedSizeBytes` | If set, will be interpreted as the uncompressed data size                       |
|`kustoCreationTime`, `kustoCreationTimeUtc`  | Interpreted as UTC timestamp. If set, will be used to override the creation time in Kusto. Useful for backfilling scenarios |


## Usage examples

**Example 1**

* Ingest two blobs under a specified storage account {Account}, in `CSV` format matching the pattern `.csv.gz`.
* Destination is the database {Database}, the table `Trips`, ignoring the first record
* You indicate your data is compressed with approximate ratio of 10.0
* LightIngest will not wait for the ingestion to be completed

To use the LightIngest command, below:
1. Create a table command.
2. Create a mapping command.
3. Copy the cluster name and paste it into the LightIngest command {Cluster Name and Region}.
4. Enter the database name into the LightIngest command {Database}.
5. Enter the table name into the LightIngest command.

```
LightIngest "Data Source=https://ingest-{Cluster Name and Region}.kusto.windows.net;AAD Federated Security=True"  
    -db:{Database}
    -table:Trips
    -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}"
    -pattern:"*.csv.gz" 
    -format:csv 
    -limit:2 
    -ignoreFirst:true 
    -cr:10.0 
    -dontWait:true
```

**Example 2**
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

**Example 3**
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

**Example 4**
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

**Example 5**
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


## Changelog

|Version        |Changes                                                                             |
|---------------|------------------------------------------------------------------------------------|
|4.0.9.0        |<ul><li>Added `-zipPattern` argument</li><li>Added `-listOnly` argument</li><li>Arguments summary is displayed before run is commenced</li><li>CreationTime is read from blob metadata properties or from blob or file name, according to the `-creationTimePattern` argument</li></ul>|