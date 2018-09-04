---
title: Data ingestion - Azure Kusto | Microsoft Docs
description: This article describes Data ingestion in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Data ingestion

Data ingestion is the process by which data records from one or more data sources
are appended to a Kusto table.

This page discusses data ingestion commands: The `.ingest` control command
(which has several variants, as discussed below), as well as the `.set`,
`.append`, and `.set-or-append` commands. There are other options for data ingestion,
such as data ingestion through a dedicated REST API (streaming ingestion)
and using external tools.

Please see [data ingestion](https://kusdoc2.azurewebsites.net/docs/concepts/data-ingestion.html) for an overview
of the data ingestion process and the various options of ingesting data.

The transactional guarantees of the different commands listed below appear [here](https://kusdoc2.azurewebsites.net/docs/concepts/data-ingestion-transactional-guarantees.html).

## .ingest

Ingestion is done by sending an `.ingest` command to Kusto. There are two main
ingestion modes for this command:
* *Pull mode*, in which Kusto pulls the data from the external source
  (for example, when ingesting data stored as files in Azure Blob Storage),
  This is the more-common mode of ingestion.
* *Push mode*, in which the data is "pushed" as part of the `.ingest` command
  itself into Kusto. This is primarily used by manual tests and scripts. 

**Syntax**

* `.ingest` [`async`] `into` 'table' *TableName* *SourceDataLocator* [`with` `(` *IngestionPropertyName* `=` *IngestionPropertyValue* [`,` ...] `)`]
* `.ingest` `inline` `into` 'table' *TableName* `[` *Data* `]` ...
* `.ingest` [`compressed`] `csv` `stream` `into` 'table' *TableName* `[` *Data* `]` ...

The first form indicates a pull-mode ingestion. The second and third forms indicate a
push-mode ingestion.

## Ingestion properties

The `.ingest` command accepts zero or more ingestion properties through the
use of the `with` keyword. The supported properties are:  

|Property name      |Property value                                          |Description| 
|----------------------|--------------------------------------------------------|-----------|
|`format`              |Data format                                             |Indicates the data format: `csv`, `tsv`, `json`, etc.|
|`zipPattern`          |Regular-expression                                      |Indicates the names of files/blobs in ZIP archive format to ingest data from.| 
|`csvMapping`          |Json serialization of `List<Dictionary<string, string>>`|CSV mapping - see below|
|`csvMappingReference` |A reference to a csv mapping stored on the table		|CSV mapping - see below|
|`jsonMapping`         |Json serialization of `List<Dictionary<string, string>>`|JSON mapping - see below| 
|`jsonMappingReference`|A reference to a json mapping stored on the table 		|JSON mapping - see below| 
|`avroMapping`         |Json serialization of `List<Dictionary<string, string>>`|Avro mapping - see below| 
|`avroMappingReference`|A reference to a avro mapping stored on the table 		|Avro mapping - see below| 
|`ValidationPolicy`    |`{"ValidationOptions":`*opt*, <br/>`"ValidationImplications":`*implic*`}` |*opt*=<br/>0 = no validation<br/>1 = verify all rows in the csv have the same number of columns <br/>2 = [reserved for internal use] ignores fields that are not enclosed properly with double quotes <br/>*implic* =<br/> 0 = fail<br/>1 = ignore<br/>If not specified, the default validation policy is: {"ValidationOptions":1, "ValidationImplications":1}
|`tags`                |Json serialization of `HashSet<string>`                 |Short strings which can be used to describe and identify the extent or it's data.|
|`ingestIfNotExists`   |Boolean                                                 |Before ingesting data Kusto will check if one of the extents in the table contains "ingest-by:" match to one of the given tags.  If so the ingest operation will return without ingesting the data.|
|`creationTime`        |Date/time value in ISO8601 format as string             |Force a specific value for the ingest data's creation time indicator (used for retention)| 
|`ignoreFirstRecord`   |Boolean                                                 |When set to `true`, ignores first record in data represented in tabular format. Used in order to avoid ingestion of headers as part of data.|

## Supported data formats

- CSV - Comma-separated values (`format` = "csv")
- TSV - Tab-separated values (`format` = "tsv")   
- PSV - Pipe (vertical bar) separated values (`format` = "psv")
- SCSV - Semicolon-separated values (used by Azure Storage Diagnostics) (`format` is in ("scsv","log","storageanalyticslogformat"))
- SOHsv - SOH (ASCII 1) separated values (used by Hive on HDInsight) (`format` = "sohsv")
- JSON - JavaScript Object Notation. See [Json Mapping](#json-mapping) below. (`format` = "json")
- AVRO - Avro (binary data serialization). Supported codecs: `null`, `deflate`. See [Avro Mapping](#avro-mapping) below. (`format` = "avro") 

## Pull-mode ingestion
 
```kusto
.ingest [async] into table_name source_data_pointer [with ( property_name = value, ... )] 

.ingest [async] into table_name (source_data_pointer1,...,source_data_pointerN) [with ( property_name = value, ... )] 
```
 
* `async`: run in the background. The command returns without waiting for ingestion to complete. The command result contains the OperationId of the ingest operation.

    Use .show operations OperationId to see the status of the operation.
* `table_name`: an existing Kusto table that the ingested data will be appended to. Existing data is unaffected. The table schema is not changed. 
    The ingested data's schema is adjusted to match the table schema by a process called "mapping".
* `source_data_pointer`: A path (or paths) to a blob in Azure Blob Storage, appended with ";" + account key or a path to a blob in Azure Blob Storage with rwd SAS. For example:

    `h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;account_key=="` 

    `h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"` 

    `(h"https://fabrikam.blob.core.windows.net/container/path/to/file1.csv;account_key=="`,`h"https://fabrikam.blob.core.windows.net/container/path/to/file2.csv;account_key==")`

    > It is strongly recommended to use [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals) `h"..."` when sending secrets to Kusto. Kusto will scrub them from any traces.
 
If the file's extension is ".csv" or ".tsv" or ".zip" then Kusto picks up the right format automatically. Otherwise, indicate the formatting of this file using additional properties. 

 
### CSV Mapping

When the source file is a csv and its schema doesn't match the current Kusto table schema, csvMapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in Kusto table, they will be added. 

Each element in the list describes a single column as a dictionary: 

* `Name`
* `DataType`
* `Ordinal` - the column order number in csv
* `ConstantValue` - the constant value to be used for a column instead of some value inside the csv

`Ordinal` and `ConstantValue` are mutually exclusive.

Example of the CSV mapping:

``` json
[
{ "Name" : "rownumber", "Ordinal" : 0},
{ "Name" : "rowguid", "Ordinal" : 1 },
{ "Name" : "xdouble", "Ordinal" : 2},
{ "Name" : "xfloat", "Ordinal" : 3},
{ "Name" : "xbool", "Ordinal" : 4 },
{ "Name" : "xint16", "Ordinal" : 5 },
{ "Name" : "xint32", "Ordinal" : 6 },
{ "Name" : "xint64", "Ordinal" : 7 },
{ "Name" : "xuint8", "Ordinal" : 8 },
{ "Name" : "xuint16", "Ordinal" : 9 },
{ "Name" : "xuint32", "Ordinal" : 10 },
{ "Name" : "xuint64", "Ordinal" : 11 },
{ "Name" : "xdate", "Ordinal" : 12 },
{ "Name" : "xsmalltext", "Ordinal" : 13 },
{ "Name" : "xtext", "Ordinal" : 14},
{ "Name" : "xnumberAsText", "Ordinal" : 15 },
{ "Name" : "xtime", "Ordinal" : 16},
{ "Name" : "xtextWithNulls", "Ordinal" : 17 },
{ "Name" : "xdynamicWithNulls", "Ordinal" : 18 },
{ "Name" : "xanothertext", "Ordinal" : 19 },
{ "Name" : "constvalue", "ConstValue" : "some value"}
]
```      

 Csv mapping can be [precreated](../controlCommands/tables.md#create-ingestion-mapping) and be referenced from the ingest command `csvMappingReference` parameter.
 
 * Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: `.ingest into Table123 (@"source1", @"source2") with @'{"csvMapping": "[{\"Name\":\"rownumber\",\"Ordinal\":0},{\"Name\":\"rowguid\",\"Ordinal\":1},...]","format":"csv"}'`
 
 Csv mapping can be applied on all the delimiter-separated formats, meaning : CSV, TSV, PSV, SCSV, SOHsv.

### JSON Mapping

When the source file is in JSON format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Json mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary: 

* `Column`: the target column name 
* `Columns`: the target columns' names to be mapped to the same property
 * Can be used instead of `Column` (or in addition to `Column`)
* `DataType`: the datatype with which to create the mapped column if not already exists in the Kusto table (optional)
* `Path`  
 * If starts with `$`: json path to the content of the column in the json document 
 * Otherwise a constant value is used. 
* `Transform` (optional): the transformation that should be applied on the content:
 * Path dependent transform:
   * `PropertyBagArrayToDictionary` - creating a dictionary from the array content of the field and serializes it to JSON.
   * `GetPathElement(index)` - Extract an element from the given path according to the given index (e.g. Path: $.a.b.c, GetPathElement(0) == "c", GetPathElement(-1) == "b", type string.
 * Path independent transform:
   * `SourceLocation` - Name of the storage artifact that provided the data, type string (e.g. the blob's "BaseUri" field).
   * `SourceLineNumber` - Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).

 
Example of the JSON Mapping:

``` json
[
  { "column" : "rownumber", "path" : "$.rownumber"},
  { "column" : "rowguid", "path" : "$.rowguid" },
  { "column" : "xdouble", "path" : "$.xdouble" },
  { "column" : "xfloat", "path" : "$.xfloat" },
  { "column" : "xbool", "path" : "$.xbool" },
  { "column" : "xint16", "path" : "$.xint16" },
  { "column" : "xint32", "path" : "$.xint32" },
  { "column" : "xint64", "path" : "$.xint64" },
  { "column" : "xuint8", "path" : "$.xuint8" },
  { "column" : "xuint16", "path" : "$.xuint16" },
  { "column" : "xuint32", "path" : "$.xuint32" },
  { "column" : "xuint64", "path" : "$.xuint64" },
  { "column" : "xdate", "path" : "$.xdate" },
  { "column" : "xsmalltext", "path" : "$.xsmalltext" },
  { "column" : "xtext", "path" : "$.xtext" },
  { "column" : "xnumberAsText", "path" : "$.xnumberAsText" },
  { "column" : "xtime", "path" : "$.xtime" },
  { "column" : "xtextWithNulls", "path" : "$.xtextWithNulls" },
  { "column" : "xdynamicWithNulls", "path" : "$.xdynamicWithNulls" },
  { "column" : "sourceLocation", "transform" : "SourceLocation" },
  { "column" : "sourceLineNumber", "transform" : "SourceLineNumber" },
  { "column" : "xanothertext", "path" : "$.xanothertext", "datatype" : "string" }
]
```      

Json mapping can be [precreated](../controlCommands/tables.md#create-ingestion-mapping) and be referenced from the ingest command `jsonMappingReference` parameter.

* Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: `.ingest into Table123 (@"source1", @"source2") with @'{"jsonMapping" : "[{\"column\":\"rownumber\",\"path\":\"$.rownumber\"},{\"column\":\"rowguid\",\"path\":\"$.rowguid\"},...]","format":"json"}'`

### AVRO Mapping

When the source file is in AVRO format, this maps the Avro file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the Avro Mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary: 

* `column`: the name of the column in Kusto table
* `field`: the name of the filed in Avro record
 
Example of the AVRO mapping:

``` json
[
  {"column": "rownumber", "field": "RowNumber" },
  {"column": "rowguid", "field": "RowGuid" },
  {"column": "xdouble", "field": "XDouble" },
  {"column": "xfloat", "field": "XFloat" },
  {"column": "xboolean", "field": "XBoolean" },
  {"column": "xint16", "field": "XInt16" },
  {"column": "xint32", "field": "XInt32" },
  {"column": "xint64", "field": "XInt64" },
  {"column": "xuint8", "field": "XUInt8" },
  {"column": "xuint16", "field": "XUInt16" },
  {"column": "xuint32", "field": "XUInt32" },
  {"column": "xuint64", "field": "XUInt64" },
  {"column": "xdate", "field": "XDate" },
  {"column": "xsmalltext", "field": "XSmallText" },
  {"column": "xtext", "field": "XText" },
  {"column": "xnumberastext", "field": "XNumberAsText" },
  {"column": "xtime", "field": "XTime" },
  {"column": "xtextwithnulls", "field": "XTextWithNulls" },
  {"column": "xdynamicwithnulls", "field": "XDynamicWithNulls" },
  {"column": "xanothertext", "field": "XAnotherText" }
]
``` 

* Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: `.ingest into Table123 (@"source1", @"source2") with @'{"avroMapping": "[{\"column\":\"rownumber\",\"field\":\"RowNumber\"},{\"column\":\"rowguid\",\"field\":\"RowGuid\"},...]","format":"avro"}'`

Avro mapping can be [precreated](../controlCommands/tables.md#create-ingestion-mapping) and be referenced from the ingest command `avroMappingReference` parameter.

## Ingestion failures

Use .show ingestion failures [OperationId] command to get details about ingestion operation failures [per OperationId].

```kusto
.show ingestion failures
 
.show ingestion failures with(OperationId="f412da70-35bf-41f9-a8ab-e8216f5bb0f6")
```

## Ingest inline

The .ingest command can take the data to be ingested as part of the command text itself. 
This is appropriate only for small amounts of data, but is very useful for testing purposes and when coming up with your Blob Storage account is impossible or hard. 
The data being specified in the command must be written as CSV. Optionally, it can be compressed (using ZIP) and then base-64-encoded to reduce its size.
No ingestion properties are supported by this command. 

```kusto
.ingest inline into table <tableName> '[' <record1> ']' '[' <record2> ']'
 
.ingest compressed csv stream into table <tableName> '[' <encoded stream> ']'
```

**Example**

Ingest two records into a table called TABLE that has two columns, 'str' (string) and 'num' (int): 

```kusto
.ingest inline into table TABLE [This is an unquoted string,123]["This is a string with ""quotes"", and commas",321]
```

Note that the general rules for CSV apply. Fields that include commas and double-quotes must be double-quoted in their entirety, and any embedded double-quote must be doubled. Adding strings with newlines is not supported. 

It is possible to generate inline ingests commands using the Kusto.Data client library. (Note that compression does allow one to embed newlines in quoted fields) 

    Kusto.Data.Common.CslCommandGenerator.GenerateTableIngestPushCommand(tableName, compressed: true, csvData: csvStream);

## .set, .append, .set-or-append, .set-or-replace

`.set` creates a new table and stores in it the results of a data query command, metadata query command, or a metadata control command, will fail if the table already exists.
 
`.append` adds the data to the existing table.

`.set-or-append` adds the data to the table if it exists, or creates it if doesn't exist.

`.set-or-replace` replaces the data of the table if it exists (drops the existing shards of the data), or creates it if doesn't exist. 
Will preserve the schema of the table unless extend_schema or recreate_schema parameters are set to true. Schema change is not performed in the same transaction with the data replace.
So, in case the data ingestion fails for some reason, the schema change still will be applied.

**Notes**
- Refrain from storing huge amounts of data in a table using a single invocation of either of these commands.
  - When data size surpasses a few GBs, it's recommended that you split the commands to multiple ones, each covering
    a different subset of the source data.
  - The latter could be achieved, for example, by using [extent-id()](../query/extentidfunction.md) 
    and/or [hash()](../query/hashfunction.md), and/or any other sensible filtering, in the query 
    part of your command.
- Refrain from running a large number of either of these commands concurrently against the same cluster.
  - Limit the concurrency to a few command invocations at any a given moment.  
- Test the query part of your command before invoking it as part of the command, To verify that it both returns the data and schema
  as you expect, as well as that it returns within a reasonable time period.
- The schema of the query result should fit exactly the target table schema (if the table exists) in terms of the order and the types of the columns.
The column names in the two schemas don't have to fit and there is no automatic column mapping based on their names.
Tips: You can use [getschema](../query/getschemaoperator.md) operator on the target table and the query to compare the schemas. You can use project / project-away commands to get the desired target schema. 
 
**Syntax** 
 
`.set` [`async`] *TableName* [`with(`*Specifications*`)`] `<|` *QueryOrCommand*

`.append` [`async`] *TableName* [`with(`*Specifications*`)`] `<|` *QueryOrCommand*

`.set-or-append` [`async`] *TableName* [`with(`*Specifications*`)`] `<|` *QueryOrCommand*

`.set-or-replace` [`async`] *TableName* [`with(`*Specifications*]`)`] `<|` *QueryOrCommand*

* `async` (optional) specifies whether or not the command is executed asynchronously (in which case, an Operation ID (Guid) is returned,
  and the operation's status can be monitored using the [.show operations](./cluster.md#show-operations) command).
* *TableName* is the name of the table into which data is added.
  The table must not exist prior to running the `.set` command,
  and must exist prior to the `.append` command.
* *QueryOrCommand* is the data query, metadata query, or metadata control command to run. 
  * *Note*: When using control commands, only `.show` control commands are allowed.
* *Specifications* is a comma-separated list of the following *optional* definitions:
  * *TagsDefinitions* are optional extent tags to use with the extent/s
    being created.
    * Example: `tags='["Tag1","Tag2"]'`
  * *CreationTimeDefinition* is an optional DateTime value in ISO8601 format as string,
    which can be used to force a specific value for the ingested data's creation time indicator (used for retention).
    * Example: `creationTime='2017-02-13T11:09:36.7992775Z'`
  * *IngestIfNotExistsDefinition* are optional 'ingestIfNotExists' values to use with the extent
    being created - allows preventing data from being ingested if there's already an extent with 
    this specific `ingest-by:` tag in the target table 
    (see: [Extent Tagging](https://kusdoc2.azurewebsites.net/docs/concepts/extents.html#extent-tagging)).
    * Example: `ingestIfNotExists='["Tag1", "Tag2"]'`
  * *FolderSpecification* is an optional string value which specifies the folder name to set for the table.
    * For an `.append` or `.set-or-append` command that doesn't create the table, the current folder name gets overridden.
    * Example: `folder='MyFolder'`
  * *IngestionTimePolicySpecification* is an optional value which specifies a value for the 
  table's [Ingestion Time Policy](https://kusdoc2.azurewebsites.net/docs/concepts/ingestiontimepolicy.html), that should be
  set as part of the execution of a command which creates a new table (if not specified,
  policy is not set).
      * This won't have an effect for commands which are executed against already existing tables.
      * Example: `policy_ingestiontime=true`
  * *ExtendSchemaSpecification* is an optional boolean value which specifies whether or not the command
  could extend the schema of the target table (defaults to `false`).
      * Allowed schema changes are only ones which **add** new column(s) at the **end** of the existing schema.
        * Examples: 
          - Having *Original table schema* = `(a:string, b:int)` and *Result table schema* = `(a:string, b:int, c:datetime, d:string)` is **valid** (as columns `c` and `d` are
          added at the end).
          - Having *Original table schema* = `(a:string, b:int)` and *Result table schema* = `(a:string, c:datetime, d:string)` is **not valid** (as column `b` is removed).
      * Example: `extend_schema=true`
  * *RecreateSchemaSpecification* is an optional boolean value which specifies whether or not the command
  could recreate the schema of the target table (defaults to `false`). Applicable only for set-or-replace command.
      * Any schema changes are allowed with this option. The schema changes are not transactional with the data ingestion. 
      If both options extend_schema and recreate_schema are set, extend_schema option is ignorred.
      * Example: `recreate_schema=true`

**Examples** 

Create a new table called "RecentErrors" in the current database that has the same schema as "KustoLogs" 
and holds all the error records of the last hour:

```kusto
.set RecentErrors <| 
   KustoLogs 
   | where Level == "Error" and Timestamp > now() - time(1h)
```

Create a new table called "OldExtents" in the current database that has a single column ("ExtentId") 
and holds the extent IDs of all extents in the database that have been created more than 30 days ago,
based on an existing table named "MyExtents":

```kusto
.set async OldExtents <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId 	
```

Append data to an existing table called "OldExtents" in the current database that has a single column ("ExtentId") 
and holds the extent IDs of all extents in the database that have been created more than 30 days ago,
while tagging the new extent with tags `tagA` and `tagB`, based on an existing table named "MyExtents":

```kusto
.append OldExtents with(tags='["TagA","TagB"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId 	
```
 
Append data to the "OldExtents" table in the current database (or create the table if it doesn't already exist), 
while tagging the new extent with `ingest-by:myTag`. Do so only if the table doesn't already contain an extent 
tagged with `ingest-by:myTag`, based on an existing table named "MyExtents":

```kusto
.set-or-append async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId 	
```

Replace the data in the "OldExtents" table in the current database (or create the table if it doesn't already exist), 
while tagging the new extent with `ingest-by:myTag`.

```kusto
.set-or-replace async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId 	
```

Append data to the "OldExtents" table in the current database, while setting the created extent(s) creation time
to a specific datetime in the past:

```kusto
.append async OldExtents with(creationTime='2017-02-13T11:09:36.7992775Z') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId 	
```

**Return output**
 
Returns information on the extent/s created as a result of the `.set` or `.append` command.

**Example output**

|ExtentId |OriginalSize |ExtentSize |CompressedSize |IndexSize |RowCount | 
|--|--|--|--|--|--|
|23a05ed6-376d-4119-b1fc-6493bcb05563 |1291 |5882 |1568 |4314 |10 |

## Duplicate next ingestion

**Syntax**

`.dup-next-ingest` `into` *TableName* `to` *h@'Path to Azure blob container'* 

`.dup-next-failed-ingest` `into` *TableName* `to` *h@'Path to Azure blob container'* 


The command is meant for on-demand troubleshooting the data ingestion 'pull' flow.

Invoking the command causes the next (and only the next) data-pull ingestion into the specified table to be *duplicated* to the specified storage container.
* *duplicate* - upload the source files which were successfully downloaded, and an additional file containing metadata on the ingestion request.
* `.dup-next-ingest` duplicates the next ingestion regardless of its outcome, while `dup-next-failed-ingest` duplicates the next ingestion only in case of failure.

**Notes**

- The command requires `ClusterAdmin` permissions
- The command runs in the context of a specific database.
- All file uploads to the target storage container are done by the node doing the actual downloads and ingestion.
- The "duplication configuration" is not persisted, and is gone upon admin node changes (which would require re-running the command).
- Only azure blob containers are currently supported.

**Result**

|Output parameter         |Type   |Description                                                                                                                                                            |
|-------------------------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
|TableName                |String | The name of the table which the next ingestion to will be duplicated.                                                                                                 |
|StorageContainerPath     |String | The path to the storage container to which the next ingestion will be duplicated to (source files and a file with the ingestion file request will be uploaded to it). |
|IngestionCommandFilePath |String | The path to file with the ingestion file request within the storage container.                                                                                        |

**Example** 

```kusto
.dup-next-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter;storagekey...==' 
```

**Example Result**

|TableName   |StorageContainerPath                                                                    |IngestionCommandFilePath                                                   |
|------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
|PerfCounter |https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter | ingestionrequest-KustoEH-PerfCounter-083736db-8cf7-4166-85fd-74ef54e491d1 |