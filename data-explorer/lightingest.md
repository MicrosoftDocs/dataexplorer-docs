---
title: Use LightIngest to ingest data into Azure Data Explorer.
description: Learn about LightIngest, a command-line utility for ad-hoc data ingestion into Azure Data Explorer.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 11/02/2023
---

# Use LightIngest to ingest data into Azure Data Explorer
 
[LightIngest](https://github.com/Azure/Kusto-Lightingest/blob/main/README.md) is a command-line utility for ad-hoc data ingestion into Azure Data Explorer. The utility can pull source data from a local folder or from an Azure blob storage container.

LightIngest is most useful when you want to ingest a large amount of data, because there is no time constraint on ingestion duration. It's also useful when you want to later query records according to the time they were created, and not the time they were ingested.

For an example of how to auto-generate a LightIngest command, see [ingest historical data](ingest-data-historical.md).

## Prerequisites

* LightIngest - download it as part of the [Microsoft.Azure.Kusto.Tools NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)

    :::image type="content" source="media/lightingest/lightingest-download-area.png" alt-text="Lightingest download.":::

* WinRAR - download it from [www.win-rar.com/download.html](http://www.win-rar.com/download.html)

## Install LightIngest

1. Navigate to the location on your computer where you downloaded LightIngest.
1. Using WinRAR, extract the *tools* directory to your computer.

## Run LightIngest

1. Navigate to the extracted *tools* directory on your computer.
1. Delete the existing location information from the location bar.

    :::image type="content" source="media/lightingest/lightingest-locationbar.png" alt-text="Delete existing location information for LightIngest in Azure Data Explorer.":::


1. Enter `cmd` and press **Enter**.
1. At the command prompt, enter `LightIngest.exe` followed by the relevant command-line argument.

    > [!Tip]
    > For a list of supported command-line arguments, enter `LightIngest.exe /help`.
    >
    > :::image type="content" source="media/lightingest/lightingest-cmd-line-help.png" alt-text="Command line help for LightIngest.":::

1. Enter `ingest-` followed by the connection string to the Azure Data Explorer cluster that will manage the ingestion.
    Enclose the connection string in double quotes and follow the [Kusto connection strings specification](kusto/api/connection-strings/kusto.md).

    For example:

    ```
    LightIngest.exe "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -pattern:"*.csv.gz" -format:csv -limit:2 -ignoreFirst:true -cr:10.0 -dontWait:true
    ```

### Recommendations

* To best manage the ingestion load and recover from transient errors, use the ingestion endpoint at `https://ingest-{yourClusterNameAndRegion}.kusto.windows.net`.

* For optimal ingestion performance, the raw data size is needed so LightIngest can estimate the uncompressed size of local files. However, LightIngest might not be able to correctly estimate the raw size of compressed blobs without first downloading them. Therefore, when ingesting compressed blobs, set the `rawSizeBytes` property on the blob metadata to uncompressed data size in bytes.

## Command-line arguments

|Argument name            |Type     |Description       |Mandatory/Optional
|------------------------------|--------|----------|-----------------------------|
|                               |string   |[Azure Data Explorer Connection String](kusto/api/connection-strings/kusto.md) specifying the Kusto endpoint that will handle the ingestion. Should be enclosed in double quotes | Mandatory
|-database, -db          |string  |Target Azure Data Explorer database name | Optional  |
|-table                  |string  |Target Azure Data Explorer table name | Mandatory |
|-sourcePath, -source      |string  |Path to source files or root URI of the blob container. If the data is in blobs, must contain storage account key or SAS. Recommended to enclose in double quotes |Mandatory |
|-prefix                  |string  |When the source data to ingest resides on blob storage, this URL prefix is shared by all blobs, excluding the container name. <br>For example, if the data is in `MyContainer/Dir1/Dir2`, then the prefix should be `Dir1/Dir2`. Enclosing in double quotes is recommended | Optional  |
|-pattern        |string  |Pattern by which source files/blobs are picked. Supports wildcards. For example, `"*.csv"`. Recommended to enclose in double quotes | Optional  |
|-zipPattern     |string  |Regular expression to use when selecting which files in a ZIP archive to ingest.<br>All other files in the archive will be ignored. For example, `"*.csv"`. It's recommended to surround it in double quotes | Optional  |
|-format, -f           |string  | Source data format. Must be one of the [supported formats](ingestion-supported-formats.md) | Optional  |
|-ingestionMappingPath, -mappingPath |string  |Path to local file for ingestion column mapping. Mandatory for Json and Avro formats. See [data mappings](kusto/management/mappings.md) | Optional  |
|-ingestionMappingRef, -mappingRef  |string  |Name of an ingestion column mapping that was previously created on the table. Mandatory for Json and Avro formats. See [data mappings](kusto/management/mappings.md) | Optional  |
|-creationTimePattern      |string  |When set, is used to extract the CreationTime property from the file or blob path. See [How to ingest data using `CreationTime`](#how-to-ingest-data-using-creationtime) |Optional  |
|-ignoreFirstRow, -ignoreFirst |bool    |If set, the first record of each file/blob is ignored (for example, if the source data has headers) | Optional  |
|-tag            |string   |[Tags](kusto/management/extents-overview.md#extent-tags) to associate with the ingested data. Multiple occurrences are permitted | Optional  |
|-dontWait           |bool     |If set to 'true', doesn't wait for ingestion completion. Useful when ingesting large amounts of files/blobs |Optional  |
|-compression, -cr          |double |Compression ratio hint. Useful when ingesting compressed files/blobs to help Azure Data Explorer assess the raw data size. Calculated as original size divided by compressed size |Optional  |
|-limit , -l           |integer   |If set, limits the ingestion to first N files |Optional  |
|-listOnly, -list        |bool    |If set, only displays the items that would have been selected for ingestion| Optional  |
|-ingestTimeout   |integer  |Timeout in minutes for all ingest operations completion. Defaults to `60`| Optional  |
|-forceSync        |bool  |If set, forces synchronous ingestion. Defaults to `false` |Optional  |
|-dataBatchSize        |integer  |Sets the total size limit (MB, uncompressed) of each ingest operation |Optional  |
|-filesInBatch            |integer |Sets the file/blob count limit of each ingest operation |Optional  |
|-devTracing, -trace       |string    |If set, diagnostic logs are written to a local directory (by default, `RollingLogs` in the current directory, or can be modified by setting the switch value) | Optional  |

## Azure blob-specific capabilities

When used with Azure blobs, LightIngest will use certain blob metadata properties to augment the ingestion process.

|Metadata property                            | Usage                                                                           |
|---------------------------------------------|---------------------------------------------------------------------------------|
|`rawSizeBytes`, `kustoUncompressedSizeBytes` | If set, will be interpreted as the uncompressed data size                       |
|`kustoCreationTime`, `kustoCreationTimeUtc`  | Interpreted as UTC timestamp. If set, will be used to override the creation time in Kusto. Useful for backfilling scenarios |

## Usage examples

### How to ingest data using CreationTime

When you load historical data from existing system to Azure Data Explorer, all records receive the same ingestion date. To enable partitioning your data by creation time and not ingestion time, you can use the `-creationTimePattern` argument. The `-creationTimePattern` argument extracts the `CreationTime` property from the file or blob path. The pattern doesn't need to reflect the entire item path, just the section enclosing the timestamp you want to use.

The argument values must include:
* Constant text immediately preceding the timestamp format, enclosed in single quotes (prefix)
* The timestamp format, in standard [.NET DateTime notation](/dotnet/standard/base-types/custom-date-and-time-format-strings)
* Constant text immediately following the timestamp (suffix).

> [!IMPORTANT]
> When specifying that the creation time should be overridden, make sure the `Lookback` property in the target table's effective [Extents merge policy](kusto/management/mergepolicy.md) is aligned with the values in your file or blob paths.

**Examples** 

* A blob name that contains the datetime as follows: `historicalvalues19840101.parquet` (the timestamp is four digits for the year, two digits for the month, and two digits for the day of month), 
    
    The value for `-creationTimePattern` argument is part of the filename: *"'historicalvalues'yyyyMMdd'.parquet'"*

    ```kusto
    LightIngest.exe "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -creationTimePattern:"'historicalvalues'yyyyMMdd'.parquet'"
     -pattern:"*.parquet" -format:parquet -limit:2 -cr:10.0 -dontWait:true
    ```

* For a blob URI that refers to hierarchical folder structure, like `https://storageaccount/mycontainer/myfolder/2002/12/01/blobname.extension`, 

    The value for `-creationTimePattern` argument is part of the folder structure: *"'folder/'yyyy/MM/dd'/blob'"*

   ```kusto
    LightIngest.exe "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -creationTimePattern:"'mycontainer/myfolder/'yyyy/MM/dd'/'"
     -pattern:"*.csv.gz" -format:csv -limit:2 -ignoreFirst:true -cr:10.0 -dontWait:true
    ```

### Ingesting blobs using a storage account key or a SAS token

* Ingest 10 blobs under specified storage account `ACCOUNT`, in folder `DIR`, under container `CONT`, and matching the pattern `*.csv.gz`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping `MAPPING` is precreated on the destination
* The tool will wait until the ingest operations complete
* Note the different options for specifying the target database and storage account key vs. SAS token

```
LightIngest.exe "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}"
  -prefix:"DIR"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -limit:10

LightIngest.exe "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True;Initial Catalog=DB"
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER}?{SAS token}"
  -prefix:"DIR"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -limit:10
```

### Ingesting all blobs in a container, not including header rows

* Ingest all blobs under specified storage account `ACCOUNT`, in folder `DIR1/DIR2`, under container `CONT`, and matching the pattern `*.csv.gz`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping `MAPPING` is precreated on the destination
* Source blobs contain header line, so the tool is instructed to drop the first record of each blob
* The tool will post the data for ingestion and won't wait for the ingest operations to complete

```
LightIngest.exe "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER}?{SAS token}"
  -prefix:"DIR1/DIR2"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -ignoreFirstRow:true
```

### Ingesting all JSON files from a path

* Ingest all files under path `PATH`, matching the pattern `*.json`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping is defined in local file `MAPPING_FILE_PATH`
* The tool will post the data for ingestion and won't wait for the ingest operations to complete

```
LightIngest.exe "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"PATH"
  -pattern:*.json
  -format:json
  -mappingPath:"MAPPING_FILE_PATH"
```

### Ingesting files and writing diagnostic trace files

* Ingest all files under path `PATH`, matching the pattern `*.json`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping is defined in local file `MAPPING_FILE_PATH`
* The tool will post the data for ingestion and won't wait for the ingest operations to complete
* Diagnostics trace files will be written locally under folder `LOGS_PATH`

```
LightIngest.exe "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"PATH"
  -pattern:*.json
  -format:json
  -mappingPath:"MAPPING_FILE_PATH"
  -trace:"LOGS_PATH"
```
