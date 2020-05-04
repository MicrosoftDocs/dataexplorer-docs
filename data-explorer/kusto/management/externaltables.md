---
title: External table management - Azure Data Explorer | Microsoft Docs
description: This article describes External table management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---
# External table management

See [external tables](../query/schema-entities/externaltables.md) for an overview of external tables. 

## Common external tables control commands

The following commands are relevant to _any_ external table (of any type).

### .show external tables

* Returns all external tables in the database (or a specific external table).
* Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `tables`

`.show` `external` `table` *TableName*

**Output**

| Output parameter | Type   | Description                                                         |
|------------------|--------|---------------------------------------------------------------------|
| TableName        | string | Name of external table                                             |
| TableType        | string | Type of external table                                              |
| Folder           | string | Table's folder                                                     |
| DocString        | string | String documenting the table                                       |
| Properties       | string | Table's JSON serialized properties (specific to the type of table) |


**Examples:**

```kusto
.show external tables
.show external table T
```

| TableName | TableType | Folder         | DocString | Properties |
|-----------|-----------|----------------|-----------|------------|
| T         | Blob      | ExternalTables | Docs      | {}         |


### .show external table schema

* Returns the schema of the external table, as JSON or CSL. 
* Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `table` *TableName* `schema` `as` (`json` | `csl`)

`.show` `external` `table` *TableName* `cslschema`

**Output**

| Output parameter | Type   | Description                        |
|------------------|--------|------------------------------------|
| TableName        | string | Name of external table            |
| Schema           | string | The table schema in a JSON format |
| DatabaseName     | string | Table's database name             |
| Folder           | string | Table's folder                    |
| DocString        | string | String documenting the table      |

**Examples:**

```kusto
.show external table T schema as JSON
```

```kusto
.show external table T schema as CSL
.show external table T cslschema
```

**Output:**

*json:*

| TableName | Schema    | DatabaseName | Folder         | DocString |
|-----------|----------------------------------|--------------|----------------|-----------|
| T         | {"Name":"ExternalBlob",<br>"Folder":"ExternalTables",<br>"DocString":"Docs",<br>"OrderedColumns":[{"Name":"x","Type":"System.Int64","CslType":"long","DocString":""},{"Name":"s","Type":"System.String","CslType":"string","DocString":""}]} | DB           | ExternalTables | Docs      |


*csl:*

| TableName | Schema          | DatabaseName | Folder         | DocString |
|-----------|-----------------|--------------|----------------|-----------|
| T         | x:long,s:string | DB           | ExternalTables | Docs      |

### .drop external table

* Drops an external table 
* The external table definition can't be restored following this operation
* Requires [database admin permission](../management/access-control/role-based-authorization.md).

**Syntax:**  

`.drop` `external` `table` *TableName*

**Output**

Returns the properties of the dropped table. See [.show external tables](#show-external-tables).

**Examples:**

```kusto
.drop external table ExternalBlob
```

| TableName | TableType | Folder         | DocString | Schema       | Properties |
|-----------|-----------|----------------|-----------|-----------------------------------------------------|------------|
| T         | Blob      | ExternalTables | Docs      | [{ "Name": "x",  "CslType": "long"},<br> { "Name": "s",  "CslType": "string" }] | {}         |

## External tables in Azure Storage or Azure Data Lake

The following command describes how to create an external table. The table can be located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2. 
[Storage connection strings](../api/connection-strings/storage.md) describes creating the connection string for each of these options. 

### .create or .alter external table

**Syntax**

(`.create` | `.alter`) `external` `table` *TableName* (*Schema*)  
`kind` `=` (`blob` | `adl`)  
[`partition` `by` *Partition* [`,` ....]]  
`dataformat` `=` *Format*  
`(`  
*StorageConnectionString* [`,` ...]  
`)`  
[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]

Creates or alters a new external table in the database in which the command is executed.

**Parameters**

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.
* *Schema* - External data schema in format: `ColumnName:ColumnType[, ColumnName:ColumnType ...]`. If the external data schema is unknown, use the [infer_storage_schema](../query/inferstorageschemaplugin.md) plug-in, which can infer the schema based on external file contents.
* *Partition* - One or several partition definitions (optional). See partition syntax below.
* *Format* - The data format. Any of the [ingestion formats](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats) are supported for querying. Using external table for [export scenario](data-export/export-data-to-an-external-table.md) is limited to the following formats: `CSV`, `TSV`, `JSON`, `Parquet`.
* *StorageConnectionString* - One or several paths to Azure Blob Storage blob containers or Azure Data Lake Store file systems (virtual directories or folders), including credentials. See [storage connection strings](../api/connection-strings/storage.md) for details. It is highly recommended to provide more than a single storage account to avoid storage throttling if [exporting](data-export/export-data-to-an-external-table.md) large amounts of data to the external table. Export will distribute the writes between all accounts provided. 

**Partition syntax**

[`format_datetime =` *DateTimePartitionFormat*] `bin(`*TimestampColumnName*, *PartitionByTimeSpan*`)`  
|   
[*StringFormatPrefix*] *StringColumnName* [*StringFormatSuffix*])

**Partition Parameters**

* *DateTimePartitionFormat* - The format of the required directory structure in the output path (optional). If partitioning is defined and format isn't specified, the default is "yyyy/MM/dd/HH/mm", based on the PartitionByTimeSpan. For example, if you partition by 1d, structure will be "yyyy/MM/dd". If you partition by 1h, structure will be "yyyy/MM/dd/HH".
* *TimestampColumnName* - Datetime column on which the table is partitioned. Timestamp column must exist in the external table schema definition and output of the export query, when exporting to the external table.
* *PartitionByTimeSpan* - Timespan literal by which to partition.
* *StringFormatPrefix* - A constant string literal that will be part of the artifact path, concatenated before the table value (optional).
* *StringFormatSuffix* - A constant string literal that will be part of the artifact path, concatenated after the table value (optional).
* *StringColumnName* - String column on which the table is partitioned. String column must exist in the external table schema definition.

**Optional Properties**:

| Property         | Type     | Description       |
|------------------|----------|-------------------------------------------------------------------------------------|
| `folder`         | `string` | Table's folder                                                                     |
| `docString`      | `string` | String documenting the table                                                       |
| `compressed`     | `bool`   | If set, indicates whether the blobs are compressed as `.gz` files                  |
| `includeHeaders` | `string` | For CSV or TSV blobs, indicates whether blobs contain a header                     |
| `namePrefix`     | `string` | If set, indicates the prefix of the blobs. On write operations, all blobs will be written with this prefix. On read operations, only blobs with this prefix are read. |
| `fileExtension`  | `string` | If set, indicates file extensions of the blobs. On write, blobs names will end with this suffix. On read, only blobs with this file extension will be read.           |
| `encoding`       | `string` | Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.             |

For more information about external table parameters in queries, see [artifact filtering logic](#artifact-filtering-logic).

> [!NOTE]
> * If the table exists, `.create` command will fail with an error. Use `.alter` to modify existing tables. 
> * Altering the schema, format, or the partition definition of an external blob table is not supported. 

Requires [Database user permission](../management/access-control/role-based-authorization.md) for `.create` and [Table admin permission](../management/access-control/role-based-authorization.md) for `.alter`. 
 
**Example** 

A non-partitioned external table. All artifacts are expected to be directly under the container(s) defined:

```kusto
.create external table ExternalBlob (x:long, s:string) 
kind=blob
dataformat=csv
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables"
)  
```

An external table partitioned by dateTime. Artifacts reside in directories in "yyyy/MM/dd" format under the path(s) defined:

```kusto
.create external table ExternalAdlGen2 (Timestamp:datetime, x:long, s:string) 
kind=adl
partition by bin(Timestamp, 1d)
dataformat=csv
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables"
)  
```

An external table partitioned by dateTime with a directory format of "year=yyyy/month=MM/day=dd":

```kusto
.create external table ExternalPartitionedBlob (Timestamp:datetime, x:long, s:string) 
kind=blob
partition by format_datetime="'year='yyyy/'month='MM/'day='dd" bin(Timestamp, 1d)
dataformat=csv
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables"
)
```

An external table with monthly data partitions and a directory format of "yyyy/MM":

```kusto
.create external table ExternalPartitionedBlob (Timestamp:datetime, x:long, s:string) 
kind=blob
partition by format_datetime="yyyy/MM" bin(Timestamp, 1d)
dataformat=csv
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables"
)
```

An external table with two partitions. The directory structure is the concatenation of both partitions: formatted CustomerName followed by default dateTime format. 
For example "CustomerName=softworks/2011/11/11":

```kusto
.create external table ExternalMultiplePartitions (Timestamp:datetime, CustomerName:string) 
kind=blob
partition by 
   "CustomerName="CustomerName,
   bin(Timestamp, 1d)
dataformat=csv
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables"   
)
```

**Output**

|TableName|TableType|Folder|DocString|Properties|ConnectionStrings|Partitions|
|---|---|---|---|---|---|---|
|ExternalMultiplePartitions|Blob|ExternalTables|Docs|{"Format":"Csv","Compressed":false,"CompressionType":null,"FileExtension":"csv","IncludeHeaders":"None","Encoding":null,"NamePrefix":null}|["https://storageaccount.blob.core.windows.net/container1;*******"]}|[{"StringFormat":"CustomerName={0}","ColumnName":"CustomerName","Ordinal":0},PartitionBy":"1.00:00:00","ColumnName":"Timestamp","Ordinal":1}]|

#### Artifact filtering logic

When querying an external table, Kusto makes everything possible to filter out irrelevant external storage artifacts (blobs)
for improving query performance. Here we describe the process of iterating on blobs, and deciding whether a blob should be processed.

First, we build a URI pattern that represents a place where blobs are to be found. Initially, URI pattern equals to a connection string
provided as part of external table definition. If there are any partitions defined, they and appended to the URI pattern.
For instance, if a connection string is: `https://storageaccount.blob.core.windows.net/container1` and there's datetime partition defined:
`partition by format_datetime="yyyy-MM-dd" bin(Timestamp, 1d)`, then the corresponding URI pattern would be:
`https://storageaccount.blob.core.windows.net/container1/yyyy-MM-dd`, and we'll be looking for blobs under locations that match this pattern.
If there's an additional string partition `"CustomerId" customerId` defined, then the corresponding URI pattern is:
`https://storageaccount.blob.core.windows.net/container1/yyyy-MM-dd/CustomerId=*`, etc.

For all *direct* blobs found under the URI patterns(s) that we've created, we check:

 * That partition values match predicates used in a query.
 * That blob name starts with `NamePrefix`, if such property is defined.
 * That blob name ends with `FileExtension`, if such property is defined.

Once all the above conditions are met, the blob is fetched and processed by the query engine.

#### Spark virtual columns support

When data is exported from Spark, partition columns (that are specified in dataframe writer's `partitionBy` method) are not written to data files. 
This is done to avoid data duplication because the data already present in "folder" names (for example, `column1=<value>/column2=<value>/`), and Spark can
recognize it upon read. However, Kusto requires that partition columns are present in the data itself. Support for virtual columns in Kusto is planned. Until then, use the following workaround: when exporting data from Spark, create a copy of all columns that data is partitioned by before writing a dataframe:

```kusto
df.withColumn("_a", $"a").withColumn("_b", $"b").write.partitionBy("_a", "_b").parquet("...")
```

When defining an external table in Kusto specify partition columns like in the following example:

```kusto
.create external table ExternalSparkTable(a:string, b:datetime) 
kind=blob
partition by 
   "_a="a,
   format_datetime="'_b='yyyyMMdd" bin(b, 1d)
dataformat=parquet
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
```

### .show external table artifacts

* Returns a list of all artifacts that will be processed when querying a given external table.
* Requires [database user permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `table` *TableName* `artifacts`

**Output**

| Output parameter | Type   | Description                       |
|------------------|--------|-----------------------------------|
| Uri              | string | URI of external storage artifact |

**Examples:**

```kusto
.show external table T artifacts
```

**Output:**

| Uri                                                                     |
|-------------------------------------------------------------------------|
| `https://storageaccount.blob.core.windows.net/container1/folder/file.csv` |

### .create external table mapping

`.create` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* *MappingInJsonFormat*

Creates a new mapping. For more information, see [Data Mappings](./mappings.md#json-mapping).

**Example** 
 
```kusto
.create external table MyExternalTable JSON mapping "Mapping1" '[{ "column" : "rownumber", "datatype" : "int", "path" : "$.rownumber"},{ "column" : "rowguid", "path" : "$.rowguid" }]'
```

**Example output**

| Name     | Kind | Mapping                                                           |
|----------|------|-------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","ColumnType":"int","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","ColumnType":"","Properties":{"Path":"$.rowguid"}}] |

### .alter external table mapping

`.alter` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* *MappingInJsonFormat*

Alters an existing mapping. 
 
**Example** 
 
```kusto
.alter external table MyExternalTable JSON mapping "Mapping1" '[{ "column" : "rownumber", "path" : "$.rownumber"},{ "column" : "rowguid", "path" : "$.rowguid" }]'
```

**Example output**

| Name     | Kind | Mapping                                                                |
|----------|------|------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","ColumnType":"","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","ColumnType":"","Properties":{"Path":"$.rowguid"}}] |

### .show external table mappings

`.show` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* 

`.show` `external` `table` *ExternalTableName* `json` `mappings`

Show the mappings (all or the one specified by name).
 
**Example** 
 
```kusto
.show external table MyExternalTable JSON mapping "Mapping1" 

.show external table MyExternalTable JSON mappings 
```

**Example output**

| Name     | Kind | Mapping                                                                         |
|----------|------|---------------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","ColumnType":"","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","ColumnType":"","Properties":{"Path":"$.rowguid"}}] |

### .drop external table mapping

`.drop` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* 

Drops the mapping from the database.
 
**Example** 
 
```kusto
.drop external table MyExternalTable JSON mapping "Mapping1" 
```

## External SQL table

### .create or alter external sql table

Creates or alters an external SQL table in the database in which the command is executed.  

**Syntax**

(`.create` | `.alter`) `external` `table` *TableName* ([columnName:columnType], ...)  
`kind` `=` `sql`  
`table` `=` *SqlTableName*  
`(`*SqlServerConnectionString*`)`  
[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]


**Parameters:**

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.
* *SqlTableName* - The name of the SQL table.
* *SqlServerConnectionString* - The connection string to the SQL server. Can be one of the following: 
    * **AAD integrated authentication** (`Authentication="Active Directory Integrated"`): 
The user or application authenticates via AAD to Kusto, and the same token is then used to access the SQL Server network endpoint.
    * **Username/Password authentication** (`User ID=...; Password=...;`). If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be performed by using this method. 

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. See [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals) for more information.

**Optional Properties**
| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `folder`            | `string`        | The table's folder.                  |
| `docString`         | `string`        | A string documenting the table.      |
| `firetriggers`      | `true`/`false`  | If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information see [BULK INSERT](https://msdn.microsoft.com/library/ms188365.aspx) and [System.Data.SqlClient.SqlBulkCopy](https://msdn.microsoft.com/library/system.data.sqlclient.sqlbulkcopy(v=vs.110).aspx)) |
| `createifnotexists` | `true`/ `false` | If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column which is the primary key. The default is `false`.  |
| `primarykey`        | `string`        | If `createifnotexists` is `true`, indicates the name of the column in the result that will be used as the SQL table's primary key if it is created by this command.                  |

> [!NOTE]
> * If the table exists, the `.create` command will fail with an error. Use `.alter` to modify existing tables. 
> * Altering the schema or format of an external SQL table is not supported. 

Requires [database user permission](../management/access-control/role-based-authorization.md) for `.create` and [table admin permission](../management/access-control/role-based-authorization.md) for `.alter`. 
 
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

| TableName   | TableType | Folder         | DocString | Properties                            |
|-------------|-----------|----------------|-----------|---------------------------------------|
| ExternalSql | Sql       | ExternalTables | Docs      | {<br>  "TargetEntityKind": "sqltable",<br>  "TargetEntityName": "MySqlTable",<br>  "TargetEntityConnectionString": "Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;",<br>  "FireTriggers": true,<br>  "CreateIfNotExists": true,<br>  "PrimaryKey": "x"<br>} |

### Querying an external table of type SQL 
Similarl to other types of external tables, querying an external SQL table is supported. See [querying external tables](https://docs.microsoft.com/azure/data-explorer/data-lake-query-data). 
Note that the SQL external table query implementation will execute a full 'SELECT *' 
(or select relevant columns) from the SQL table, while the rest of the query will execute on the Kusto side. Consider the following external table query: 

```kusto
external_table('MySqlExternalTable') | count
```

Kusto will execute a 'SELECT * from TABLE' query to the SQL database, followed by a count on Kusto side. 
In such cases, performance is expected to be better if written in T-SQL directly ('SELECT COUNT(1) FROM TABLE') 
and executed using the [sql_request plugin](../query/sqlrequestplugin.md), instead of using the external table function. 
Similarly, filters are not pushed to the SQL query.  
It is recommended to use the external table to query the SQL table when the query requires reading the entire table (or relevant columns) for further execution on Kusto side. 
When an SQL query can be significantly optimized in T-SQL, use the [sql_request plugin](../query/sqlrequestplugin.md).
