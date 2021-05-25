---
title: Kusto query ingestion (set, append, replace) - Azure Data Explorer
description: This article describes Ingest from query (.set, .append, .set-or-append, .set-or-replace) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/30/2020
ms.localizationpriority: high 
---
# Ingest from query (.set, .append, .set-or-append, .set-or-replace)

These commands execute a query or a control command and ingest the results of the query into a table. The difference between these commands, is how they treat
existing or nonexistent tables and data.

|Command          |If table exists                     |If table doesn't exist                    |
|-----------------|------------------------------------|------------------------------------------|
|`.set`           |The command fails                  |The table is created and data is ingested|
|`.append`        |Data is appended to the table      |The command fails                        |
|`.set-or-append` |Data is appended to the table      |The table is created and data is ingested|
|`.set-or-replace`|Data replaces the data in the table|The table is created and data is ingested|

**Syntax**

`.set` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

`.append` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...`])`] `<|` *QueryOrCommand*

`.set-or-append` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

`.set-or-replace` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

**Arguments**

* `async`: If specified, the command will immediately return and continue
  ingestion in the background. The results of the command will include
  an `OperationId` value that can then be used with the `.show operations`
  command, to retrieve the ingestion completion status and results.
* *TableName*: The name of the table to ingest data to.
  The table name is always related to the database in context.
* *PropertyName*, *PropertyValue*: Any number of ingestion properties that affect the ingestion process.

 Ingestion properties that are supported.

|Property        |Description|
|----------------|-----------------------------------------------------------------------------------------------------------------------------|
|`creationTime`   | The datetime value, formatted as an ISO8601 string, to use at the creation time of the ingested data extents. If unspecified, the current value (`now()`) will be used. When specified, make sure the `Lookback` property in the target table's effective [Extents merge policy](../mergepolicy.md) is aligned with the specified value|
|`extend_schema`  | A Boolean value that, if specified, instructs the command to extend the schema of the table. Default is "false". This option applies only to `.append`, `.set-or-append`, and `set-or-replace` commands. The only permitted schema extensions have additional columns added to the table at the end|
|`recreate_schema`  | A Boolean value that. If specified, describes if the command may recreate the schema of the table. Default is "false". This option applies only to the *set-or-replace* command. This option takes precedence over the extend_schema property if both are set|
|`folder`         | The folder to assign to the table. If the table already exists, this property will overwrite the table's folder.|
|`ingestIfNotExists`   | A string value that. If specified, prevents ingestion from succeeding if the table already has data tagged with an `ingest-by:` tag with the same value|
|`policy_ingestiontime`   | A Boolean value. If specified, describes if to enable the [Ingestion Time Policy](../../management/ingestiontime-policy.md) on a table that is created by this command. The default is "true"|
|`tags`   | A JSON string that indicates which validations to run during ingestion|
|`docstring`   | A string documenting the table|

 Property that controls the behavior of the command.

|Property        |Type    |Description|
|----------------|--------|-----------------------------------------------------------------------------------------------------------------------------|
|`distributed`   |`bool`  |Indicates that the command ingests from all nodes executing the query in parallel. Default is "false".  See remarks below.|

* *QueryOrCommand*: The text of a query or a control command whose results will be used as data to ingest.

> [!NOTE]
> Only `.show` control commands are supported.

**Remarks**

* `.set-or-replace` replaces the data of the table if it exists. It drops the existing data shards or creates the target table, if doesn't already exist.
  The table schema will be preserved unless one of `extend_schema` or `recreate_schema`
  ingestion properties is set to "true". If the schema is modified, it happens before the actual data ingestion in its own transaction. A failure to ingest the data doesn't mean the schema wasn't modified.
* `.set-or-append` and `.append` commands will preserve the schema unless the  `extend_schema` ingestion property is set to "true". If the schema is modified, it happens before the actual data ingestion in its own transaction. A failure to ingest the data doesn't mean the schema wasn't modified.
* We recommended that you limit the data for ingestion to less than 1 GB per ingestion
  operation. Multiple ingestion commands may be used, if necessary.
* Data ingestion is a resource-intensive operation that might affect concurrent activities on the cluster, including running queries. Avoid running too many such commands at the same time.
* When matching the result set schema to that of the target table, the comparison is based on the column types. There's no matching of column names. Make sure that the query result schema columns are in the same order as the table. Else data will be ingested into the wrong column.
* Setting the `distributed` flag to "true" is useful when the amount of data being
  produced by the query is large, exceeds 1GB, and the query doesn't
  require serialization, so that multiple nodes can produce output in parallel.
  When the query results are small, don't use this flag, since it might needlessly generate many small data shards.

**Examples** 

Create a new table called :::no-loc text="RecentErrors"::: in the database that has the same schema as :::no-loc text="LogsTable"::: and holds all the error records of the last hour.

```kusto
.set RecentErrors <|
   LogsTable
   | where Level == "Error" and Timestamp > now() - time(1h)
```

Create a new table called "OldExtents" in the database that has a single column, "ExtentId", and holds the extent IDs of all extents in the database that has been created more than 30 days earlier. The database has an existing table named "MyExtents".

```kusto
.set async OldExtents <|
   MyExtents 
   | where CreatedOn < now() - time(30d)
   | project ExtentId
```

Append data to an existing table called "OldExtents" in the current database that has a single column, "ExtentId", and holds the extent IDs of all extents in the database that have been created more than 30 days earlier.
Mark the new extent with tags `tagA` and `tagB`, based on an existing table named "MyExtents".

```kusto
.append OldExtents with(tags='["TagA","TagB"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId
```

Append data to the "OldExtents" table in the current database, or create the table if it doesn't already exist. Tag the new extent with `ingest-by:myTag`. Do so only if the table doesn't already contain an extent tagged with `ingest-by:myTag`, based on an existing table named "MyExtents".

```kusto
.set-or-append async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <|
   MyExtents
   | where CreatedOn < now() - time(30d)
   | project ExtentId
```

Replace the data in the "OldExtents" table in the current database, or create the table if it doesn't already exist. Tag the new extent with `ingest-by:myTag`.

```kusto
.set-or-replace async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId
```

Append data to the "OldExtents" table in the current database, while setting the created extent(s) creation time to a specific datetime in the past.

```kusto
.append async OldExtents with(creationTime='2017-02-13T11:09:36.7992775Z') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId     
```

**Return output**
 
Returns information on the extents created because of the `.set` or `.append` command.

**Example output**

|ExtentId |OriginalSize |ExtentSize |CompressedSize |IndexSize |RowCount | 
|--|--|--|--|--|--|
|23a05ed6-376d-4119-b1fc-6493bcb05563 |1291 |5882 |1568 |4314 |10 |
