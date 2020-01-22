---
title: Ingest from query (.set, .append, .set-or-append, .set-or-replace) - Azure Data Explorer | Microsoft Docs
description: This article describes Ingest from query (.set, .append, .set-or-append, .set-or-replace) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 01/13/2020
---
# Ingest from query (.set, .append, .set-or-append, .set-or-replace)

These commands execute a query or a control command, and ingest the results of the query
into a table. The difference between these commands is how they treat
existing or unexisting tables and data:

|Command          |If table exists                     |If table doesn't exist                 |
|-----------------|------------------------------------|---------------------------------------|
|`.set`           |The command fails.                  |The table is created and data ingested.|
|`.append`        |Data is appended to the table.      |The command fails.                     |
|`.set-or-append` |Data is appended to the table.      |The table is created and data ingested.|
|`.set-or-replace`|Data replaces the data in the table.|The table is created and data ingested.|

**Syntax**

`.set` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

`.append` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...`])`] `<|` *QueryOrCommand*

`.set-or-append` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

`.set-or-replace` [`async`] *TableName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *QueryOrCommand*

**Arguments**

* `async`: If specified, the command will return immediately, and continue
  ingestion in the background. The results of the command will include
  an `OperationId` value that can then be used with the `.show operation`
  command to retrieve the ingestion completion status and results.

* *TableName*: The name of the table to ingest data to.
  The table name is always relative to the database in context.

* *PropertyName*, *PropertyValue*: Any number of
  [ingestion properties](./index.md#ingestion-properties) that affect the ingestion process.

  In addition, there are several properties that control the behavior of the command itself:

|Property        |Type    |Description|
|----------------|--------|---------------------------------------------------------------------------------------------------------------------------|
|`distributed`   |`bool`  |Indicates that the command ingests from all nodes executing the query in parallel. (Defaults to `false`.)  

* *QueryOrCommand*: The text of a query or a control command whose results will be used as data
  to ingest.

> [!NOTE]
> Only `.show` control commands are supported.

**Remarks**

* `.set-or-replace` replaces the data of the table if it exists (drops the existing data shards),
  or creates the target table if doesn't already exist.
  The table schema will be preserved unless one of `extend_schema` or `recreate_schema`
  ingestion property is set to `true`. If the schema is modified, this happens before the actual data
  ingestion in its own transaction, so a failure to ingest the data doesn't mean the schema wasn't modified.

* It is **strongly recommended** that the data for ingestion be limited to less than 1 GB per ingestion
  operation. Multiple ingestion commands may be used if necessary.

* Data ingestion is a resource-intensive operation that might affect concurrent activities on the cluster,
  including running queries. Avoid running "too many" such commands together at the same time.

* When matching the result set schema to that of the target table, the comparison is based on the
  column types. There is no matching of column names, so one must make sure that the query result
  schema columns are in the correct order that matches the table's, otherwise data will be ingested into
  the wrong column.
 
**Examples** 

Create a new table called "RecentErrors" in the current database that has the same schema as "LogsTable" and holds all the error records of the last hour:

```kusto
.set RecentErrors <| 
   LogsTable
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

