---
title: Use LightIngest to ingest data into Azure Data Explorer
description: Learn about LightIngest, a command-line utility for ad-hoc data ingestion into Azure Data Explorer.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 12/27/2023
---

# Use LightIngest to ingest data into Azure Data Explorer
 
[LightIngest](https://github.com/Azure/Kusto-Lightingest/blob/main/README.md) is a command-line utility for ad-hoc data ingestion into Azure Data Explorer. The utility can pull source data from a local folder, an Azure blob storage container, or an Amazon S3 bucket.

LightIngest is most useful when you want to ingest a large amount of data, because there's no time constraint on ingestion duration. It's also useful when you want to later query records according to the time they were created, and not the time they were ingested.

For an example of how to autogenerate a LightIngest command, see [ingest historical data](ingest-data-historical.md).

## Prerequisites

* LightIngest. There are two ways to get LightIngest:
  * [Download LightIngest binaries for your operating system](https://github.com/Azure/Kusto-Lightingest/releases). Make sure to unzip the binaries after download.
  * [Install LightIngest as a .NET tool](https://www.nuget.org/packages/Microsoft.Azure.Kusto.LightIngest). This method requires that you have the .NET SDK version 6.0 or higher installed on your machine. Then, run the following command:

      ```
      dotnet tool install -g Microsoft.Azure.Kusto.LightIngest
      ```

## Run LightIngest

To run LightIngest:

1. At the command prompt, enter `LightIngest` followed by the relevant command-line argument.

    > [!TIP]
    > For a list of supported command-line arguments, enter `LightIngest /help`.

1. Enter `ingest-` followed by the connection string to the Azure Data Explorer cluster that will manage the ingestion. Enclose the connection string in double quotes and follow the [Kusto connection strings specification](kusto/api/connection-strings/kusto.md).

    For example:

    ```
    LightIngest "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -pattern:"*.csv.gz" -format:csv -limit:2 -ignoreFirst:true -cr:10.0 -dontWait:true
    ```

## Performance recommendations

* To best manage the ingestion load and recover from transient errors, use the ingestion endpoint at `https://ingest-{yourClusterNameAndRegion}.kusto.windows.net`.

* For optimal ingestion performance, the raw data size is needed so LightIngest can estimate the uncompressed size of local files. However, LightIngest might not be able to correctly estimate the raw size of compressed blobs without first downloading them. Therefore, when ingesting compressed blobs, set the `rawSizeBytes` property on the blob metadata to uncompressed data size in bytes.

## Command-line arguments

| Argument | Type | Description | Required |
|----------|------|-------------|----------|
|          | string | A [Kusto connection string](kusto/api/connection-strings/kusto.md) specifying the Kusto endpoint that handles the ingestion. This value should be enclosed with double quotes. | &check; |
| -database, -db | string | The target Azure Data Explorer database name. |  |
| -table | string | The target Azure Data Explorer table name. | &check; |
| -sourcePath, -source | string | The location of the source data, which can be either a local file path, the root URI of an Azure blob container, or the URI of an Amazon S3 bucket. If the data is stored in Azure blobs, the URI must include the storage account key or Shared Access Signature (SAS). If the data is in an S3 bucket, the URI must include the credential key. We recommend enclosing this value in double quotes. For more information, see [Storage connection strings](kusto/api/connection-strings/storage-connection-strings.md). Pass *-sourcePath:;impersonate* to list Azure storage items with user permissions (user prompt authorization). | &check; |
| -managedIdentity, -mi | string | Client ID of the managed identity (user-assigned or system-assigned) to use for connecting. Use "system" for system-assigned identity. |  |
| -ingestWithManagedIdentity, -imgestmi | string | Client ID of the managed identity (user-assigned or system-assigned) to use for connecting. Use "system" for system-assigned identity. |  |
| -connectToStorageWithUserAuth, -storageUserAuth | string | Authenticate to the data source storage service with user credentials. The options for this value are `PROMPT` or `DEVICE_CODE`. |  |
| -connectToStorageLoginUri, -storageLoginUri | string | If `-connectToStorageWithUserAuth` is set, you can optionally provide a Microsoft Entra ID login URI. |  |
| -prefix | string | When the source data to ingest resides on blob storage, this URL prefix is shared by all blobs, excluding the container name. <br>For example, if the data is in `MyContainer/Dir1/Dir2`, then the prefix should be `Dir1/Dir2`. We recommend enclosing this value in double quotes. |  |
| -pattern | string | Pattern by which source files/blobs are picked. Supports wildcards. For example, `"*.csv"`. We recommend enclosing this value in double quotes. |  |
| -zipPattern | string | Regular expression to use when selecting which files in a ZIP archive to ingest. All other files in the archive will be ignored. For example, `"*.csv"`. We recommend enclosing this value in double quotes. |  |
| -format, -f | string | Source data format. Must be one of the [supported formats](ingestion-supported-formats.md) |  |
| -ingestionMappingPath, -mappingPath | string | A path to a local file for ingestion column mapping. See [data mappings](kusto/management/mappings.md). |  |
| -ingestionMappingRef, -mappingRef | string | The name of an ingestion column mapping that was previously created on the table. See [data mappings](kusto/management/mappings.md). |  |
| -creationTimePattern | string | When set, is used to extract the CreationTime property from the file or blob path. See [How to ingest data using `CreationTime`](#ingest-historical-data-with-the-creationtime-property). |  |
| -ignoreFirstRow, -ignoreFirst | bool | If set, the first record of each file/blob is ignored. For example, if the source data has headers. |  |
| -tag | string | [Tags](kusto/management/extent-tags.md) to associate with the ingested data. Multiple occurrences are permitted |  |
| -dontWait | bool | If set to `true`, doesn't wait for ingestion completion. Useful when ingesting large amounts of files/blobs. |  |
| -compression, -cr | double | Compression ratio hint. Useful when ingesting compressed files/blobs to help Azure Data Explorer assess the raw data size. Calculated as original size divided by compressed size. |  |
| -limit, -l | integer | If set, limits the ingestion to first *N* files. |  |
| -listOnly, -list | bool | If set, only displays the items that would have been selected for ingestion. |  |
| -ingestTimeout | integer | Timeout in minutes for all ingest operations completion. Defaults to `60`. |  |
| -forceSync | bool | If set, forces synchronous ingestion. Defaults to `false`. |  |
| -interactive | bool | If set to `false`, doesn't prompt for arguments confirmation. For unattended flows and non-interactive environments. Default is `true`. | |
| -dataBatchSize | integer | Sets the total size limit (MB, uncompressed) of each ingest operation. |  |
| -filesInBatch | integer | Sets the file/blob count limit of each ingest operation. |  |
| -devTracing, -trace | string | If set, diagnostic logs are written to a local directory (by default, `RollingLogs` in the current directory, or can be modified by setting the switch value). |  |

## Azure blob-specific capabilities

When used with Azure blobs, LightIngest uses certain blob metadata properties to augment the ingestion process.

|Metadata property                            | Usage                                                                           |
|---------------------------------------------|---------------------------------------------------------------------------------|
|`rawSizeBytes`, `kustoUncompressedSizeBytes` | If set, will be interpreted as the uncompressed data size                       |
|`kustoCreationTime`, `kustoCreationTimeUtc`  | Interpreted as UTC timestamp. If set, will be used to override the creation time in Kusto. Useful for backfilling scenarios |

## Usage examples

The following examples assume you've installed LightIngest binaries for your operating system. If you've installed LightIngest as a .NET tool, substitute  `LightIngest` with `LightIngest` in the examples.

### Ingest historical data with the CreationTime property

When you load historical data from existing system to Azure Data Explorer, all records receive the same ingestion date. To enable partitioning your data by creation time and not ingestion time, you can use the `-creationTimePattern` argument. The `-creationTimePattern` argument extracts the `CreationTime` property from the file or blob path. The pattern doesn't need to reflect the entire item path, just the section enclosing the timestamp you want to use.

The argument values must include:

* Constant text immediately preceding the timestamp format, enclosed in single quotes (prefix)
* The timestamp format, in standard [.NET DateTime notation](/dotnet/standard/base-types/custom-date-and-time-format-strings)
* Constant text immediately following the timestamp (suffix).

> [!IMPORTANT]
> When specifying that the creation time should be overridden, make sure the `Lookback` property in the target table's effective [Extents merge policy](kusto/management/merge-policy.md) is aligned with the values in your file or blob paths.

**Examples** 

* A blob name that contains the datetime as follows: `historicalvalues19840101.parquet` (the timestamp is four digits for the year, two digits for the month, and two digits for the day of month), 
    
    The value for `-creationTimePattern` argument is part of the filename: *"'historicalvalues'yyyyMMdd'.parquet'"*

    ```kusto
    LightIngest "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -creationTimePattern:"'historicalvalues'yyyyMMdd'.parquet'"
     -pattern:"*.parquet" -format:parquet -limit:2 -cr:10.0 -dontWait:true
    ```

* For a blob URI that refers to hierarchical folder structure, like `https://storageaccount/mycontainer/myfolder/2002/12/01/blobname.extension`, 

    The value for `-creationTimePattern` argument is part of the folder structure: *"'folder/'yyyy/MM/dd'/blob'"*

   ```kusto
    LightIngest "https://ingest-{Cluster name and region}.kusto.windows.net;Fed=True" -db:{Database} -table:Trips -source:"https://{Account}.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}" -creationTimePattern:"'mycontainer/myfolder/'yyyy/MM/dd'/'"
     -pattern:"*.csv.gz" -format:csv -limit:2 -ignoreFirst:true -cr:10.0 -dontWait:true
    ```

### Ingesting blobs using a storage account key or a SAS token

* Ingest 10 blobs under specified storage account `ACCOUNT`, in folder `DIR`, under container `CONT`, and matching the pattern `*.csv.gz`
* Destination is database `DB`, table `TABLE`, and the ingestion mapping `MAPPING` is precreated on the destination
* The tool waits until the ingest operations complete
* Note the different options for specifying the target database and storage account key vs. SAS token

```
LightIngest "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"https://ACCOUNT.blob.core.windows.net/{ROOT_CONTAINER};{StorageAccountKey}"
  -prefix:"DIR"
  -pattern:*.csv.gz
  -format:csv
  -mappingRef:MAPPING
  -limit:10

LightIngest "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True;Initial Catalog=DB"
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
* The tool posts the data for ingestion and doesn't wait for the ingest operations to complete

```
LightIngest "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
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
* The tool posts the data for ingestion and doesn't wait for the ingest operations to complete

```
LightIngest "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
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
* The tool posts the data for ingestion and doesn't wait for the ingest operations to complete
* Diagnostics trace files are written locally under folder `LOGS_PATH`

```
LightIngest "https://ingest-{ClusterAndRegion}.kusto.windows.net;Fed=True"
  -database:DB
  -table:TABLE
  -source:"PATH"
  -pattern:*.json
  -format:json
  -mappingPath:"MAPPING_FILE_PATH"
  -trace:"LOGS_PATH"
```
