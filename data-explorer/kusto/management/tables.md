---
title: Tables management - Azure Data Explorer | Microsoft Docs
description: This article describes Tables management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/05/2019
---
# Tables management

This topic discusses the lifecycle of tables and associated control commands:

|Operation                               |Relevant commands               |
|----------------------------------------|--------------------------------|
|Enumerate tables in a database          |`.show tables`                  |
|Create/modify/drop tables               |`.create tables`, `.create table`, `.alter table`, `.alter-merge table`, `.drop tables`, `.drop table`, `.undo drop table`, `.rename table`|
|Data ingestion into a table             |`.ingest`, `.set`, `.append`, `.set-or-append` (see [Data Ingestion](./data-ingestion/index.md) for details).)
|Manage ingestion mapping                |`.create ingestion mapping`, `.show ingestion mappings`, `.alter ingestion mapping`, `.drop ingestion mapping`|
|Manage table display properties         |`.alter table docstring`, `.alter table folder`|

## CRUD Naming Conventions for table (see full details in the sections below)
 
|Command syntax |Semantics|
|---|---|
|`.create entityType entityName ...`       |If an entity of that type and name exists, returns the entity. Otherwise, create the entity.|
|`.create-merge entityType entityName...`  |If an entity of that type and name exists, merge the existing entity with the specified entity. Otherwise, create the entity.|
|`.alter entityType entityName ...`        |If an entity of that type and name does not exist, error. Otherwise, replace it with the specified entity.|
|`.alter-merge entityType entityName ...`  |If an entity of that type and name does not exist, error. Otherwise, merge it with the specified entity.|
|`.drop entityType entityName ...`         |If an entity of that type and name does not exist, error. Otherwise, drop it.|
|`.drop entityType entityName ifexists ...`|If an entity of that type and name does not exist, return. Otherwise, drop it.|
 
"Merge" is a logical merge of two entities:

1. If a property is defined for one entity but not the other, it appears with its original value in the merged entity.
2. If a property is defined for both entities and has the same value in both, it appears once with that value in the merged entity.
3. If a property is defined for both entities but has different values, an error is raised.

## .show tables

```kusto
.show tables
.show tables (T1, ..., Tn)
```

Returns a set that contains the specified, or all tables in the database.

Requires [Database viewer permission](../management/access-control/role-based-authorization.md).

**Output**

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the table.
|DatabaseName  |String |The database that the table belongs to.
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.

**Output example**

|Table Name |Database Name |Folder | DocString
|---|---|---|---
|Table1 |DB1 |Logs |Contains services logs
|Table2 |DB1 | Reporting |
|Table3 |DB1 | | Extended info |
|Table4 |DB2 | Metrics| Contains services performance information

## .show table details

```kusto
.show table T1 details
.show tables (T1, ..., Tn) details
.show tables details
```

Returns a set that contains the specified, or all tables in the database, with a detailed summary of each table's properties.

Requires [Database viewer permission](../management/access-control/role-based-authorization.md).

**Output**

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the table.
|DatabaseName  |String |The database that the table belongs to.
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.
|TotalExtents |Int64 |The total number of extents in the table.
|TotalExtentSize |Double |The total size of extents (compressed size + index size) in the table.
|TotalOriginalSize |Double |The total original size of data in the table. 
|TotalRowCount |Int64 |The total number of rows in the table.
|HotExtents |Int64 |The total number of extents in the table, stored in the hot cache.
|HotExtentSize |Double |The total size of extents (compressed size + index size) in the table, stored in the hot cache.
|HotOriginalSize |Double |The total original size of data in the table, stored in the hot cache.
|HotRowCount |Int64 |The total number of rows in the table, stored in the hot cache.
|AuthorizedPrincipals |String |The table's authorized principals, serialized as JSON.
|RetentionPolicy |String |The table's effective`*` retention policy, serialized as JSON.
|CachingPolicy |String |The table's effective`*` caching policy, serialized as JSON.
|ShardingPolicy |String |The table's effective`*` sharding policy, serialized as JSON.
|MergePolicy |String |The table's effective`*` merge policy, serialized as JSON.
|StreamingIngestionPolicy |String |The table's effective`*` streaming ingestion policy, serialized as JSON.
|MinExtentsCreationTime |DateTime |The minimum creation time of an extent in the table (or null, if there are no extents).
|MaxExtentsCreationTime |DateTime |The maximum creation time of an extent in the table (or null, if there are no extents).

`*` *Taking into account policies of parent entities (such as database/cluster).*

**Output example**

|TableName |DatabaseName |Folder |DocString |TotalExtents |TotalExtentSize |TotalOriginalSize |TotalRowCount |HotExtents |HotExtentSize |HotOriginalSize |HotRowCount |AuthorizedPrincipals |RetentionPolicy |CachingPolicy |ShardingPolicy |MergePolicy |StreamingIngestionPolicy|MinExtentsCreationTime |MaxExtentsCreationTime
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |---|--- |---
|Operations |Operations | | |1164 |37687203 |53451358 |223325 |29 |838752 |1388213 |5117 |[{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] |{"SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 } |{ "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } |{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } |{ "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } |null 
ServiceOperations |Operations | | |1109 |76588803 |91553069 |110125 |27 |2635742 |2929926 |3162 |[{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] |{ "SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 } |{ "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } |{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } |{ "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } |null |2018-02-08 15:30:38.8489786 |2018-02-14 07:47:28.7660267

## .show table schema

```kusto
.show table TableName cslschema 
```

Gets the schema to use in create/alter commands and additional table metadata.

Requires [Database user permission](../management/access-control/role-based-authorization.md).

|Output parameter|Type|Description
|---|---|---
|TableName |String |The name of the table.
|Schema |String |The table schema as should be used for table create / alter 
|DatabaseName |String |The database to which the table belongs
|Folder |String |Table's folder.
|DocString |String |Table's docstring.

```kusto
.show table TableName schema as json
```

Gets the schema in JSON format and additional table metadata.

Requires [Database user permission](../management/access-control/role-based-authorization.md).

|Output parameter|Type|Description
|---|---|---
|TableName |String |The name of the table.
|Schema |String |The table schema in a json format 
|DatabaseName |String |The database to which the table belongs
|Folder |String |Table's folder.
|DocString |String |Table's docstring.

## .create table 

**Syntax**

`.create` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

Creates a new empty table. 
The command must run in context of a specific database. 
If the table already exists the command will return success.

`.create-merge` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

Creates a new table or extends an existing table.
The command must run in context of a specific database. 

If the table doesn't exist, functions exactly as ".create table" command.

If the table exists: 

* New columns you specify will be added at the end of the existing schema.
* If the passed schema doesn't contain some table columns they won't be deleted.
* If you specified an existing column with a different type, the command will fail.

Requires [Database user permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.create table MyLogs ( Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32 ) 
```
 
**Return output**

Returns the table's schema in JSON format, same as:

```kusto
.show table MyLogs schema as json
```

Note: for multiple table creation, use [.create tables](#create-tables) command for better performance and lower load on the cluster.

## .create tables

**Syntax**

`.create` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ]

Creates new empty tables as a bulk operation. 
The command must run in context of a specific database. 
If any table already exists the command will return success.

Requires [Database user permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.create tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```

**Return output**

|TableName|DatabaseName|Folder|DocString|
|---|---|---|---|
|MyLogs|TopComparison|||
|MyUsers|TopComparison|||

## .create-merge tables

**Syntax**

`.create-merge` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ]

This commands allows creating and/or extending the schemas of existing tables in a single bulk operation, in the context of a specific database.

- Specified tables which don't exist will be created.
- Specified tables which already exist will have their schemas extended:
    - Non-existing columns will be added at the *end* of the existing table's schema.
    - Existing columns which aren't specified in the command will not be removed from the existing table's schema.
    - Existing columns which are specified with a different data type in the command will than in the existing table's schema will lead to a failure (no tables will be created nor extended).

Requires [Database user permission](../management/access-control/role-based-authorization.md), in
addition to [Table admin permission](../management/access-control/role-based-authorization.md)
for the extension of existing tables.
 
**Example** 

```kusto
.create-merge tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```

**Return output**

|TableName|DatabaseName|Folder|DocString|
|---|---|---|---|
|MyLogs|TopComparison|||
|MyUsers|TopComparison|||


## .alter table and .alter-merge table

The `.alter table` command sets a new column schema, docstring, and folder to an existing table,
overriding the existing column schema, docsting, and folder. Data in existing columns
that are "preserved" by the command is preserved (so this command can be used,
for example, to reorder the columns of a table).

The `.alter-merge table` command adds new columns, docstring, and folder folder to an existing table.
Data in existing columns is preserved.

Both commands must run in the context of a specific database that scopes the table name.

Require [Database user permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.alter` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

`.alter-merge` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

Specify the columns the table should have after successful completion. 

> [!WARNING]
> Using the `.alter` command incorrectly may lead to data loss.
> please carefully read the differences between `.alter` and `.alter-merge` below.

`.alter-merge`:

 * Columns that don't exist and which you specify are added at the end of the existing schema.
 * If the passed schema doesn't contain some table columns they won't be deleted.
 * If you specified an existing column with a different type, the command will fail.

`.alter` only (not `.alter-merge`):

 * The table will have exactly the same columns, in the same order, as specified.
 * Existing columns that are not specified in the command will be **dropped** (as in
 `.drop column`) and data in them is **lost**.
 * Altering a column type is not supported when altering a table. Use the [.alter column](columns.md#alter-column) command instead.

> Tip: Use `.show table [TableName] cslschema` to get the existing column schema before you alter it. 

Some points that apply for both commands:

1. Existing data is not physically modified by these commands. Data in removed columns is ignored. Data in new columns is assumed to be null.
2. Depending on how the cluster is configured, data ingestion might modify the table's column schema even without user interaction. Therefore, when making changes to a table's column schema, one must ensure that ingestion will not add needed columns that the command will then remove.

> [!WARNING]
> Data ingestion processes into the table that happen in parallel with the
> `.alter table` command that modifies the table's column schema might be performed
> in a way that is agnostic to the order of columns in the table, or there is a
> risk that data will be ingested into the wrong columns. For example, this could
> be done by stopping ingestion during such commands, or by making sure that such
> ingestion operations always use a mapping object.

**Examples**

```kusto
.alter table MyTable (ColumnX:string, ColumnY:int) 
.alter table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
.alter-merge table MyTable (ColumnX:string, ColumnY:int) 
.alter-merge table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")

```
 
## .rename table

The `.rename` `table` command changes the name of an existing table.

**Syntax**

`.rename` `table` *OldName* `to` *NewName*

Requires [Database  admin permission](../management/access-control/role-based-authorization.md).

## .rename tables

The `.rename` `tables` command changes the name of a number of tables
as a single atomic transaction.

**Syntax**

`.rename` `tables` *NewName* = *OldName* [`ifexists`] [`,` ...]

* *OldName* is the name of an existing table. An error is raised and
  the whole command fails (has no effect) if *OldName* does not name
  an existing table, unles `ifexists` is specified (in which case
  this part of the rename command is ignored).
  is not an existing valid
* *NewName* is the new name of the existing table that used to be called
  *OldName*.
* `ifexists`: If specified, modifies the behavior of the command to
  ignore rename parts of non-existent tables.

Note that *NewName* might be the name of an existing table
as well, in which case that table *also* be renamed. In other words, this
command doesn't create new tables nor does it remove existing tables, and the
transofmration must be such that the number of tables remains the same.

Requires [Database  admin permission](../management/access-control/role-based-authorization.md).

**Examples**

Imagine a database with the following tables: `A`, `B`, `C`, and `A_TEMP`.
The following command will swap `A` and `A_TEMP` (so that the table that used
to be called `A_TEMP` will now be called `A` and the other way around), rename
`B` into `NEWB`, and keep `C` as-is. 

```kusto
.rename tables A=A_TEMP, NEWB=B, A_TEMP=A
``` 

The following sequence of commands  creates a new temporary table and then have it
replace an existing or non-existing table:

```kusto
// Drop the temporary table if it exists
.drop table TempTable ifexists

// Create a new table
.set TempTable <| ...

// Swap the two tables
.rename tables TempTable=Table ifexists, Table=TempTable

// Drop the temporary table (which used to be Table) if it exists
.drop table TempTable ifexists
```

## .drop table

The `.drop` `table` command drops a table from the database.

**Syntax**

`.drop` `table` *TableName* [`ifexists`]

* `ifexists`: If specified, modifies the behavior of the command to
  not fail for a non-existent table.

**Returns**

This command returns a list of the remaining tables in the database. 

|Output parameter |Type |Description 
|---|---|---
|TableName  |String |The name of the table. 
|DatabaseName  |String |The database that the table belongs to. 
 
Requires [Table admin permission](../management/access-control/role-based-authorization.md).

## .undo drop table

The `.undo` `drop` `table` command reverts a drop table operation to a specific database version.

**Syntax**

`.undo` `drop` `table` *TableName* [`as` *NewTableName*] `version=v` *DB_MajorVersion.DB_MinorVersion*

The command must be executed with database context.

**Returns**

This command returns the original table extents list, for each extent it specified the number of records the extent contains, if the recover operation succeeded or failed, and the failure reason if relevant.

|ExtentId|NumberOfRecords|Status|FailureReason
|--------|---------------|------|-------------
ef296c9e-d75d-44bc-985c-b93dd2519691 | 100  | Recovered                |
370b30d7-cf2a-4997-986e-3d05f49c9689 | 1000 | Recovered                |
861f18a5-6cde-4f1e-a003-a43506f9e8da | 855  | Unable to recover extent | Extent container: 4b47fd84-c7db-4cfb-9378-67c1de7bf154 wasn't found, the extent was removed from storage and can't be restored

**How to find the required database version**

You can find the database version before the drop operation was executed by using `.show` `journal` command :

```kusto
.show database TestDB journal | where Event == "DROP-TABLE" and EntityName == "TestTable" | project OriginalEntityVersion 
```

|OriginalEntityVersion|
|---------------------|
v24.3 |

**Limitations**

If Purge command was executed on this database, undo drop table command can't be executed to a version earlier to the purge execution.

Extent can be recovered only if the hard delete period of the extent container it resides in wasn't reached yet.

The command requires [Database admin permission](../management/access-control/role-based-authorization.md).

**Examples**
```kusto
// Recover TestTable table to database version 24.3
.undo drop table TestTable version="v24.3"
```

```kusto
// Recover TestTable table to database version 10.3 with new table name, NewTestTable (can be used if table with the same name already created since the dropped)  
.undo drop table TestTable as NewTestTable version="v10.3"
```

## .drop tables

The `.drop` `tables` command drops tables from the database.

**Syntax**

`.drop` `tables` (*TableName1*, *TableName2*,..) [ifexists]

**Returns**

This command returns a list of the remaining tables in the database. 

|Output parameter |Type |Description 
|---|---|---
|TableName  |String |The name of the table. 
|DatabaseName  |String |The database that the table belongs to. 
 
Requires [Table admin permission](../management/access-control/role-based-authorization.md).

**Example** 
 
```kusto
.drop tables (Table1, Table2, Table3) ifexists
```

## .create ingestion mapping

Creates an ingestion mapping that is associated with a specific table and a specific format.

**Syntax**

`.create` `table` *TableName* `ingestion`  `mapping` *MappingName* *MappingFormattedAsJson*

`.create` `table` *TableName* `ingestion`  `mapping` *MappingName* *MappingFormattedAsJson*

**Notes:** 

* Once created, the mapping can be referenced by its name in ingestion commands, instead of specifying the complete mapping as part of the command.
* Valid values for *MappingKind* are: `csv`, `json`, `avro`, `parquet`
* If a mapping by the same name already exists for the table:
    * `.create` will fail.
    * `.create-or-alter` will alter the existing mapping.
 
**Example** 
 
```kusto
.create table MyTable ingestion csv mapping "Mapping1" '[{ "Name" : "rownumber", "DataType":"int", "Ordinal" : 0},{ "Name" : "rowguid", "DataType":"string", "Ordinal" : 1 }]'

.create-or-alter table MyTable ingestion json mapping "Mapping1" '[{ "column" : "rownumber", "datatype" : "int", "path" : "$.rownumber"},{ "column" : "rowguid", "path" : "$.rowguid" }]'
```

**Example output**

|Name|Kind|Mapping
|---|---|---
|mapping1|CSV|[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]


## .alter ingestion mapping

Alters an existing ingestion mapping that is associated with a specific table and a specific format (full mapping replace).

**Syntax**

`.alter` `table` *TableName* `ingestion` `csv` `mapping` *MappingName* *MappingFormattedAsJson*

**Notes:**

* This mapping can be referenced by its name by ingestion commands, instead of specifying the complete mapping as part of the command.
* Valid values for *MappingKind* are: `csv`, `json`, `avro`, `parquet`

 
**Example** 
 
```kusto
.alter table MyTable ingestion csv mapping "Mapping1" '[{ "Name" : "rownumber", "DataType":"int", "Ordinal" : 0},{ "Name" : "rowguid", "DataType":"string", "Ordinal" : 1 }]'

.alter table MyTable ingestion json mapping "Mapping1" '[{ "column" : "rownumber", "path" : "$.rownumber"},{ "column" : "rowguid", "path" : "$.rowguid" }]'
```
**Example output**

|Name|Kind|Mapping
|---|---|---
|mapping1|CSV|[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]


## .show ingestion mappings

`.show` `table` *TableName* `ingestion` `csv` `mappings`

`.show` `table` *TableName* `ingestion` `csv` `mapping` *MappingName* 

`.show` `table` *TableName* `ingestion` `json` `mappings`

`.show` `table` *TableName* `ingestion` `json` `mapping` *MappingName* 

Show the ingestion mappings (all or the one specified by name).
 
**Example** 
 
```kusto
.show table MyTable ingestion csv mapping "Mapping1" 

.show table MyTable ingestion csv mappings 
```
**Example output**

|Name|Kind|Mapping
|---|---|---
|mapping1|CSV|[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]


## .drop ingestion mapping

`.drop` `table` *TableName* `ingestion` `csv` `mapping` *MappingName* 

`.drop` `table` *TableName* `ingestion` `json` `mapping` *MappingName* 

Drops the ingestion mapping from the database.
 
**Example** 
 
```kusto
.drop table MyTable ingestion csv mapping "Mapping1" 

.drop table MyTable ingestion json mappings "Mapping1" 
```

## .alter table docstring

`.alter` `table` *TableName* `docstring` *Documentation*

Alters the DocString value of an existing table. 

**Notes:** 
- Requires [Database admin permission](../management/access-control/role-based-authorization.md)
- Modification of the table is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the table 
- If the table does not exist - error is returned. For creating new table - see [.create table](#create-table)

**Example** 

```kusto
.alter table LyricsAsTable docstring "This is the theme to Garry's show"
```
    
## .alter table folder

`.alter` `table` *TableName* `folder` *Folder*

Alters the Folder value of an existing table. 

**Notes:** 
- Requires [Database admin permission](../management/access-control/role-based-authorization.md)
- Modification of the table is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the table 
- If the table does not exist - error is returned. For creating new table - see [.create table](#create-table)

**Example** 

```kusto
.alter table MyTable folder "Updated folder"
```

```kusto
.alter table MyTable folder @"First Level\Second Level"
```