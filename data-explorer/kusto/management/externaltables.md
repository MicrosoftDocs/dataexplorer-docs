---
title: External tables commands (preview) - Azure Data Explorer | Microsoft Docs
description: This article describes External tables commands (preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/15/2019
---
# External tables commands (preview)

See [external tables](../query/schema-entities/externaltables.md) for an overview of external tables. 

## Common external tables control commands
The following commands are relevant to _any_ external table (of any type).

### .show external tables

Returns all external tables in the database (or a specific external table).

Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `tables`

`.show` `external` `table` *TableName*

**Output**

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the external table.
|TableType  |String |The type of external table (e.g., blob).
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.
|Properties|String|The table's json serialized properties (specific to the type of table).


**Examples:**

```kusto
.show external tables
.show external table T
```

|TableName|TableType|Folder|DocString|Properties|
|---|---|---|---|----------------------------------|
|T|Blob|ExternalTables|Docs|{}|


### .show external table schema
Returns the schema of the external table, as json or csl. 

Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `table` *TableName* `schema` `as` (`json` | `csl`)

`.show` `external` `table` *TableName* `cslschema`

**Output**

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the external table.
|Schema|String|The table's schema (name, csl type) as json.
|DatabaseName|String|The table's database name.
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.

**Examples:**

```kusto
.show external table T schema as json
```

```kusto
.show external table T schema as csl
.show external table T cslschema
```

**Output:**

*json:*

|TableName|Schema|DatabaseName|Folder|DocString|
|---|---|---|---|---|
|T|{"Name":"ExternalBlob",<br>"Folder":"ExternalTables",<br>"DocString":"Docs",<br>"OrderedColumns":[{"Name":"x","Type":"System.Int64","CslType":"long","DocString":""},{"Name":"s","Type":"System.String","CslType":"string","DocString":""}]}|DB|ExternalTables|Docs|


*csl:*

|TableName|Schema|DatabaseName|Folder|DocString|
|---|---|---|---|---|
|T|x:long,s:string|DB|ExternalTables|Docs|


### .drop external table

Drops an external table. The external table definition cannot be restored after this operation.

Requires [Database admin permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.drop` `external` `table` *TableName*

**Output**

Returns the properties of the dropped table. See [.show external tables](#show-external-tables).

**Examples:**
```kusto
.drop external table ExternalBlob
```

|TableName|TableType|Folder|DocString|Schema|Properties|
|---|---|---|---|-------|----------------------------------|
|T|Blob|ExternalTables|Docs|[{ "Name": "x",  "CslType": "long"},<br> { "Name": "s",  "CslType": "string" }]|{}|

## External Tables in Azure Storage

The following command describes how to create an External Tables located in Azure Storage / Azure Data Lake. 
Location can be Azure Blob Storage, Azure Data Lake Store Gen1 and Azure Data Lake Store Gen2. 
Please refer to [storage connection strings](../api/connection-strings/storage.md) on how to create the connection string for each of these options. 

### .create or alter external table

**Syntax**

(`.create` | `.alter`) `external` `table` *TableName* ([columnName:columnType], ...)<br>
`kind` `=` (`blob` | `adl`)  <br>
[`partition` [`format_datetime` = *DateTimePartitionFormat*] `by` `bin(`*TimestampColumnName*`,` *PartitionByTimeSpan*`)`]<br>
`dataformat` `=` *Format* <br>
`(` <br>*StorageConnectionString* [`,` ...] <br>`)`
 <br>[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]

Creates or alters a new external table in the database in which the command is executed. <br>
The external table can optionally be partitioned by DateTime. If the table is partitioned, export operations to the external
table will write the exported artifacts to separate folders / directories according to a Timestamp column of the exported records. See examples below. 

*Parameters:*

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table cannot have the same name as a regular table in the same database.
* *Format* - The format of blobs. One of `csv` | `tsv` | `json` | `parquet`. 
* *DateTimePartitionFormat* - The format of the desired directory structure in the output path. The parameter is optional, 
even if partitioning is defined. If partitioning is defined and format isn't specified, the default used is "yyyy/MM/dd/HH/mm", based on the *PartitionByTimeSpan*. 
e.g., if partition by is 1d, structure would be "yyyy/MM/dd". If it's 1h, structure would be "yyyy/MM/dd/HH", and so on.  
* *TimestampColumnName* - a datetime column, based on which the table is partitioned (optional). Timestamp column must exist both in the external table schema definition, 
and in the output of the export query, when exporting to the external table. 
* *PartitionByTimeSpan* - a timespan literal to partition by. 
* *StorageConnectionString* - One or several paths to Azure Blob Storage blob containers / Azure Data Lake Store file systems (or virtual directories / folders), including credentials. See [storage connection strings](../api/connection-strings/storage.md) for details. It is highly recommended to provide more than a single storage account to avoid storage throttling if [exporting](data-export/export-data-to-an-external-table.md) large amounts of data to the external table. Export will distribute the writes between all accounts provided. 

*Optional Properties*:

|Property        |Type    |Description                                                                                                  |
|----------------|--------|-------------------------------------------------------------------------------------------------------------|
|`folder` |`string` |The table's folder.
|`docString` |`string` |A string documenting the table.
|`compressed`|`bool`  |If set, indicates whether the blobs are compressed as `.gz` files.|
|`includeHeaders`|`string`|For CSV or TSV blobs, indicates whether blobs contain a header.|
|`namePrefix`|`string`|If set, indicates the prefix of the blobs (on write operations, all blobs will be written with this prefix. On reads, only blobs with this prefix are read).|
|`encoding`|`string`|Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.|

*Notes:* 

* If the table exists, `.create` command will fail with an error. Use `.alter` to modify existing tables. 
* Altering the schema and/or format of an external blob table is not supported. 

Requires [Database admin permission](../management/access-control/role-based-authorization.md).
 
**Example** 

A non partitioned external table (all artifacts are expected to be directly under the container(s) defined):

```kusto
.create external table ExternalBlob (x:long, s:string) 
kind=blob
dataformat=csv
( 
   h@'http://storageaccount.blob.core.windows.net/container1;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables",
   namePrefix="Prefix"
)  
```

A partitioned external table (artifacts reside in directories in the format of "yyyy/MM/dd" under the path(s) defined):

```
.create external table ExternalAdlGen2 (Timestamp:datetime, x:long, s:string) 
kind=adl
partition by bin(Timestamp, 1d)
dataformat=csv
( 
   @'h"abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables",
   namePrefix="Prefix"
)  
```

**Output**

|TableName|TableType|Folder|DocString|Properties|ConnectionStrings|
|---|---|---|---|---|---|
|ExternalAdlGen2|Adl|ExternalTables|Docs|{"Format":"Csv","Compressed":false,"CompressionType":null,"FileExtension":"csv","IncludeHeaders":"None","Encoding":null,"NamePrefix":"Prefix"}|["abfss://filesystem@storageaccount.dfs.core.windows.net/path;*******"]}|"<br>]|

## External SQL Table

### .create or alter external sql table

**Syntax**

(`.create` | `.alter`) `external` `table` *TableName* ([columnName:columnType], ...)<br>
`kind` `=` `sql` <br>
`table` `=` *SqlTableName* <br>
`(`*SqlServerConnectionString*`)`
 <br>[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]

Creates or alters an external table of type sql in the database in which the command is executed. <br> 

*Parameters:*

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table cannot have the same name as a regular table in the same database.
* *SqlTableName* - The name of the SQL table.
* *SqlServerConnectionString* - The connection string to the sql server. Can be one of: 

1. **AAD integrated authentication** (`Authentication="Active Directory Integrated"`): 
The user or application authenticates via AAD to Kusto, and the same token is then used to access the SQL Server network
   endpoint.

2. **Username/Password authentication** (`User ID=...; Password=...;`). If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be by this method and not AAD integrated. 

> [!WARNING]
> Connection strings and queries that include confidential
> information or information that should be otherwise guarded should be
> obfuscated so that they'll be omitted from any Kusto tracing.
> Please see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals) for more details.

*Optional Properties*:

|Property        |Type    |Description                                                                                                  |
|----------------|----------|-------------------------------------------------------------------------------------------------------------|
|`folder` |`string` |The table's folder.
|`docString` |`string` |A string documenting the table.
|`firetriggers` |`true`/`false`|If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information see [BULK INSERT](https://msdn.microsoft.com/en-us/library/ms188365.aspx) and [System.Data.SqlClient.SqlBulkCopy](https://msdn.microsoft.com/en-us/library/system.data.sqlclient.sqlbulkcopy(v=vs.110).aspx))|
|`createifnotexists`|`true`/ `false`|If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column which is the primary key. The default is `false`.|
|`primarykey`|`string`|If `createifnotexists` is `true`, indicates the name of the column in the result that will be used as the SQL table's primary key if it is created by this command.|


*Notes:* 

* If the table exists, `.create` command will fail with an error. Use `.alter` to modify existing tables. 
* Altering the schema and/or format of an external sql table is not supported. 

Requires [Database admin permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.create external table ExternalSql (x:long, s:string) 
kind=sql
table=MySqlTable
( 
   h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables", 
   createifnotexists = true,
   primarykey = x,
   firetriggers=true
)  
```

**Output**

|TableName|TableType|Folder|DocString|Properties|
|---|---|---|---|---|
|ExternalSql|Sql|ExternalTables|Docs|{<br>  "TargetEntityKind": "sqltable",<br>  "TargetEntityName": "MySqlTable",<br>  "TargetEntityConnectionString": "Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;",<br>  "FireTriggers": true,<br>  "CreateIfNotExists": true,<br>  "PrimaryKey": "x"<br>}|