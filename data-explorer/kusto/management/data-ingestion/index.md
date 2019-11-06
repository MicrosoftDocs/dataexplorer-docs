---
title: Data ingestion - Azure Data Explorer | Microsoft Docs
description: This article describes Data ingestion in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/02/2019
---
# Data ingestion

Data ingestion is the process by which data gets added to a table
and made available for query.
Depending on the existence of the table beforehand, the process requires
[database admin, database ingestor, database user, or table admin permissions](../access-control/role-based-authorization.md).

The data ingestion process consists of several steps:

1. Retrieving the data from the data source.
2. Parsing and validating the data.
3. Matching the schema of the data to the schema of the target Kusto table,
   or creating the target table if it doesn't already exists.
4. Organizing the data in columns.
5. Indexing the data.
6. Encoding and compressing the data.
7. Persisting the resulting Kusto storage artifacts in storage.
8. Executing all relevant update policies, if any.
9. "Committing" the data ingest, thus making it available for query.

> [!NOTE]
> Some of the steps above may be skipped, depending on the specific scenario.
> For example, data ingested through the streaming ingestion endpoint skips steps
> 4, 5, 6, and 9 above; these are done in the background as the data is "groomed".
> As another example, if the data source is the results of a Kusto query to the same
> cluster, there's no need to parse and validate the data.)

> [!WARNING]
> Data ingested into a table in Kusto is subject to the table's effective **retention policy**.
> Unless set on a table explicitly, the effective retention policy is derived from
> the database's retention policy. Therefore, users ingesting data into Kusto should make sure
> that the database's retention policy is appropriate for their needs, and explicitly
> override it at the table level if not. Failure to do so might mean "silent" deletion of
> their data due to the database's retention policy. See [retention policy](https://kusto.azurewebsites.net/docs/concepts/retentionpolicy.html)
> for details.



## Ingestion methods

There are a number of methods by which data can be ingested, each with
its own characteristics:

1. **Inline ingestion (push)**: A control command ([.ingest inline](./ingest-inline.md))
   is sent to the engine, with the data to be ingested being a part of the command
   text itself.
   This method is primarily intended for ad-hoc testing
   purposes, and should not be used for production purposes.

2. **Ingest from query**: A control command ([.set, .append, .set-or-append, or .set-or-replace](./ingest-from-query.md))
   is sent to the engine, with the data specified indirectly as the results of a query
   or a command.
   This method is useful for generating reporting tables out of raw data tables,
   or for creating small temporary tables for further analysis.

3. **Ingest from storage (pull)**: A control command ([.ingest into](./ingest-from-storage.md))
   is sent to the engine, with the data stored in some external storage (e.g., Azure
   Blob Storage) accessible by the engine and pointed-to by the command.
   This method allows efficient bulk ingestion of data, but puts some burden on
   the client performing the ingestion to not overtax the cluster with concurrent
   ingestions (or risk consuming all cluster resources by data ingestion, reducing
   the performance of queries.

4. **Queued ingestion**: Data is uploaded to external storage (e.g., Azure Blob
   Storage) and then a notification is sent to a queue (e.g., Azure Queue, or Event Hub).
   This is the primary method used in production, as it has very high availability,
   doesn't require the client to perform capacity management itself, and handles bulk
   appends well. This is sometimes called "native ingestion".



|Method             |Latency                 |Production|Bulk|Availability|Synchronicity|
|-------------------|------------------------|----------|----|------------|-------------|
|Inline ingestion   |Seconds + ingest time   |No        |No  |Kusto Engine|Synchronous  |
|Ingest from query  |Query time + ingest time|Yes       |Yes |Kusto Engine|Synchronous  |
|Ingest from storage|Seconds + ingest time   |Yes       |Yes |Kusto Engine|Both         |
|Queued ingestion   |Minutes                 |Yes       |Yes |Storage     |Asynchronous |

## Ingestion properties

Ingestion commands may zero on more ingestion properties through the
use of the `with` keyword. The supported properties are:  

* `avroMapping`, `csvMapping`, `jsonMapping`: A string value that indicates
  how to map data from the source file to the actual columns in the table.
  See [data mappings](../mappings.md).

* `avroMappingReference`, `csvMappingReference`, `jsonMappingReference`:
  A string value that indicates how to map data from the source file to the
  actual columns in the table using a named mapping policy object.
  See [data mappings](../mappings.md).

* `creationTime`: The datetime value (formatted as a ISO8601 string) to use
  as the creation time of the ingested data extents. If unspecified, the current
  value (`now()`) will be used. Overriding the default is useful when ingesting
  older data, so that retention policy will be applied correctly.
  For example: `with (creationTime="2017-02-13T11:09:36.7992775Z")`.

* `extend_schema`: A Boolean value that, if specified, instructs the command
  to extend the schema of the table (defaults to `false`). This option applies only
  to `.append` and `.set-or-append` commands. Note that the only allowed schema extensions
  have additional columns added to the table at the end.<br>
  For example, if the original table schema is `(a:string, b:int)` then a
  valid schema extension would be `(a:string, b:int, c:datetime, d:string)`,
  but `(a:string, c:datetime)` would not.

* `folder`: For [ingest-from-query](./ingest-from-query.md) commands,
  the folder to assign to the table (if the table already exist this will
  override the table's folder).
  For example: `with (folder="Tables/Temporary")`.

* `format`: The data format (see below for supported values and their meaning).
  For example: `with (format="csv")`.

* `ingestIfNotExists`: A string value that, if specified, prevents ingestion
  from succeeding if the table already has data tagged with an `ingest-by:` tag
  with the same value. This ensure idempotent data ingestion.
  For more information see [ingest-by: tags](../extents-overview.md#ingest-by-extent-tags).
  For example, the properties `with (ingestIfNotExists='["Part0001"]', tags='["ingest-by:Part0001"]')`
  indicate that if data with the tag `ingest-by:Part0001` already exists, then
  we should not complete the current ingestion. If it doesn't already exist,
  then this new ingestion should have this tag set (in case a future ingestion
  attempts to ingest the same data again in the future.)

* `ignoreFirstRecord`: A Boolean value that, if set to `true`, indicates that
  ingestion should ignore the first record of every file. This is useful for
  files formatted in `csv` (and similar formats) if the first record in the file
  is a header record specifying the column names. By default `false` is assumed.
  For example: `with (ignoreFirstRecord=false)`.

* `persistDetails`: A Boolean value that, if specified, indicates that the command
  should persist the detailed results (even if successful) so that the
  [.show operation details](../operations.md#show-operation-details) command could retrieve them.
  Defaults to `false`.
  For example: `with (persistDetails=true)`.

* `policy_ingestiontime`: A Boolean value that, if specified, describes whether
  to enable the [Ingestion Time Policy](../../concepts/ingestiontimepolicy.md)
  on a table that is created by this command. (The default is `true`.)
  For example: `with (policy_ingestiontime=false)`.

* `recreate_schema`: A Boolean value that, if specified, describes whether the
  command may recreate the schema of the table. This option applies only
  to the `.set-or-replace` command. This takes precedence over the `extend_schema`
  option if both are set.
  For example, `with (recreate_schema=true)`.

* `tags`: A list of [tags](../extents-overview.md#extent-tagging) to associate
  with the ingested data, formatted as a JSON string.
  For example: `with (tags="['Tag1', 'Tag2']")`.

* `validationPolicy`: A JSON string that indicates what validations to run
  during ingestion. See below for an explanation of the different options.
  For example: `with (validationPolicy='{"ValidationOptions":1, "ValidationImplications":1}')`
  (this is actually the default policy).

* `zipPattern`: When ingesting data from storage that has a ZIP archive,
  a string value indicating the regular expression to use when selecting which
  files in the ZIP archive to ingest. All other files in the archive will be
  ignored.
  For example: `with (zipPattern="*.csv")`.

<!-- TODO: Fill-in the following
The following table shows which property applies to each method of ingestion.

|Property|.set|.append|.set-or-append|.set-or-replace|.ingest inline|.ingest (pull)|

-->

## Supported data formats

For all ingestion methods other than ingest-from-query, the data must be
formatted in one of the supported data formats:

|Format   |Extension   |Description|
|---------|------------|-----------|
|avro     |`.avro`     |An [Avro container file](https://avro.apache.org/docs/current/). The following codes are supported: `null`, `deflate` (`snappy` is currently not supported).|
|csv      |`.csv`      |A text file with comma-separated values (`,`). See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt).|
|json     |`.json`     |A text file with JSON objects delimited by `\n` or `\r\n`. See [JSON Lines (JSONL)](http://jsonlines.org/).|
|multijson|`.multijson`|A text file with a JSON array of property bags (each representing a record), or any number of property bags delimited by whitespace. (This format is to preferred over json, unless the data is non-property bags.)|
|parquet  |`.parquet`  |A [Parquet file](https://en.wikipedia.org/wiki/Apache_Parquet).|
|psv      |`.psv`      |A text file with pipe-separated values (<code>&#124;</code>).|
|raw      |`.raw`      |A text file whose entire contents is a single string value.|
|scsv     |`.scsv`     |A text file with semicolon-separated values (`;`).|
|sohsv    |`.sohsv`    |A text file with SOH-separated values. (SOH is ASCII codepoint 1; this format is used by Hive on HDInsight.)|

|tsv      |`.tsv`      |A text file with tab-separated values (`\t`).|
|tsve     |`.tsv`      |A text file with tab-separated values (`\t`). A backslash character (`\`) is used for escaping.|
|txt      |`.txt`      |A text file with lines delimited by `\n`.|

Blobs and files can be optionally compressed through any of the following
compression algorithms:

|Compression|Extension|
|-----------|---------|
|GZip       |.gz      |
|Zip        |.zip     |

The name of the blob or file should indicate compression by appending the extension
noted above to the name of the blob or file. Thus, `MyData.csv.zip` indicates
a blob or a file whose format is CSV and that has been compressed via Zip
(either as an archive or as a single file), and `MyData.csv.gz` indicates
a blob or a file whose format is CSV and that has been compressed via GZip.

Blob or file names that do not include the format extension but just compression
(for example, `MyData.zip`) are also supported, but in this case the file format
must be specified as an ingestion property as it cannot be inferred.

> [!NOTE]
> Some compression formats keep track of the original file extension as part
> of the compressed stream. This extension is generally ignored for the purpose
> of determining the file format. If this can't be determined from the (compressed)
> blob or file name, it must be specified through the `format` ingestion property.

## Validation policy during ingestion

When ingesting from storage, the source data gets validated as part of parsing.
The validation policy indicates how to react to parsing failures. It consists
of two properties:

* `ValidationOptions`: Here, `0` means that no validation should be performed,
  `1` validates that all records have the same number of fields (useful for
  CSV files and similar), and `2` indicates to ignore fields that are not
  double-quoted.

* `ValidationImplications`: `0` indicates that validation failures should fail
  the whole ingestion,
  and `1` indicates that validation failures should be ignored.