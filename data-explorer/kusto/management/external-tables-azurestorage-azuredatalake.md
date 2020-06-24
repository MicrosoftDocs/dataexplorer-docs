---
title: Create and alter external tables in Azure Storage or Azure Data Lake - Azure Data Explorer
description: This article describes how to create and alter external tables in Azure Storage or Azure Data Lake
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---

# Create and alter external tables in Azure Storage or Azure Data Lake

The following command describes how to create an external table located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2. 

## .create or .alter external table

**Syntax**

(`.create` | `.alter`) `external` `table` *[TableName](#table-name)* `(` *[Schema](#schema)* `)`  
`kind` `=` (`blob` | `adl`)  
[`partition` `by` `(` *[Partitions](#partitions)* `)` [`pathformat` `=` `(` *[PathFormat](#path-format)* `)`]]  
`dataformat` `=` *[Format](#format)*  
`(` *[StorageConnectionString](#connection-string)* [`,` ...] `)`   
[`with` `(`*[PropertyName](#properties)* `=` *[Value](#properties)* `,` ... `)`]  

Creates or alters a new external table in the database in which the command is executed.

> [!NOTE]
> * If the table exists, `.create` command will fail with an error. Use `.alter` to modify existing tables. 
> * Altering the schema, format, or the partition definition of an external blob table isn't supported. 
> * The operation requires [database user permission](../management/access-control/role-based-authorization.md) for `.create` and [table admin permission](../management/access-control/role-based-authorization.md) for `.alter`. 

**Parameters**

<a name="table-name"></a>
*TableName*

External table name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.
An external table can't have the same name as a regular table in the same database.

<a name="schema"></a>
*Schema*

External data schema is described using the following format:

&nbsp;&nbsp;*ColumnName* `:` *ColumnType* [`,` *ColumnName* `:` *ColumnType* ...]

where *ColumnName* adheres to [entity naming](../query/schema-entities/entity-names.md) rules, and *ColumnType* is one of [supported data types](../query/scalar-data-types/index.md).

> [!TIP]
> If the external data schema is unknown, use the [infer\_storage\_schema](../query/inferstorageschemaplugin.md) plug-in, which helps infer the schema based on external file contents.

<a name="partitions"></a>
*Partitions*

Comma-separated list of columns by which an external table is partitioned. Partition column can exist in the data file itself, or sa part of the file path (read more on [virtual columns](#virtual-columns)).

Partitions list is any combination of partition columns, specified using one of the following forms:

* Partition, representing a [virtual column](#virtual-columns).

  *PartitionName* `:` (`datetime` | `string`)

* Partition, based on a string column value.

  *PartitionName* `:` `string` `=` *ColumnName*

* Partition, based on a string column value [hash](../query/hashfunction.md), modulo *Number*.

  *PartitionName* `:` `long` `=` `hash` `(` *ColumnName* `,` *Number* `)`

* Partition, based on truncated value of a datetime column. See documentation on [startofyear](../query/startofyearfunction.md), [startofmonth](../query/startofmonthfunction.md), [startofweek](../query/startofweekfunction.md), [startofday](../query/startofdayfunction.md) or [bin](../query/binfunction.md) functions.

  *PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`  
  *PartitionName* `:` `datetime` `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`


<a name="path-format"></a>
*PathFormat*

External data URI file path format, which can be specified in addition to partitions. Path format is a sequence of partition elements and text separators:

&nbsp;&nbsp;[*StringSeparator*] *Partition* [*StringSeparator*] [*Partition* [*StringSeparator*] ...]  

where *Partition* refers to a partition declared in `partition` `by` clause, and *StringSeparator* is any text enclosed in quotes. Consecutive partition elements must be set apart using *StringSeparator*.

Original file path prefix can be constructed using partition elements rendered as strings and separated with corresponding text separators. To specify format used for rendering a datetime partition value, the following macro can be used:

&nbsp;&nbsp;`datetime_pattern` `(` *DateTimeFormat* `,` *PartitionName* `)`  

where *DateTimeFormat* adheres to the .NET format specification, with an extension allowing to enclose format specifiers into curly brackets. For example, the following two formats are equivalent:

&nbsp;&nbsp;`'year='yyyy'/month='MM` and `year={yyyy}/month={MM}`

By default, datetime values are rendered using the following formats:

| Partition function    | Default format |
|-----------------------|----------------|
| `startofyear`         | `yyyy`         |
| `startofmonth`        | `yyyy/MM`      |
| `startofweek`         | `yyyy/MM/dd`   |
| `startofday`          | `yyyy/MM/dd`   |
| `bin(`*Column*`, 1d)` | `yyyy/MM/dd`   |
| `bin(`*Column*`, 1h)` | `yyyy/MM/dd/HH` |
| `bin(`*Column*`, 1m)` | `yyyy/MM/dd/HH/mm` |

If *PathFormat* is omitted from the external table definition, it's assumed that all partitions, in exactly the same order as they're defined, are separated using `/` separator. Partitions are rendered using their default string presentation.

<a name="format"></a>
*Format*

The data format, any of the [ingestion formats](../../ingestion-supported-formats.md).

> [!NOTE]
> Using external table for [export scenario](data-export/export-data-to-an-external-table.md) is limited to the following formats: `CSV`, `TSV`, `JSON` and `Parquet`.

<a name="connection-string"></a>
*StorageConnectionString*

One or more paths to Azure Blob Storage blob containers or Azure Data Lake Store file systems (virtual directories or folders), including credentials.
See [storage connection strings](../api/connection-strings/storage.md) for details.

> [!TIP]
> Provide more than a single storage account to avoid storage throttling while [exporting](data-export/export-data-to-an-external-table.md) large amounts of data to the external table. Export will distribute the writes between all accounts provided. 

<a name="properties"></a>
*Optional Properties*

| Property         | Type     | Description       |
|------------------|----------|-------------------------------------------------------------------------------------|
| `folder`         | `string` | Table's folder                                                                     |
| `docString`      | `string` | String documenting the table                                                       |
| `compressed`     | `bool`   | If set, indicates whether the files are compressed as `.gz` files (used in [export scenario](data-export/export-data-to-an-external-table.md) only) |
| `includeHeaders` | `string` | For CSV or TSV files, indicates whether files contain a header                     |
| `namePrefix`     | `string` | If set, indicates the prefix of the files. On write operations, all files will be written with this prefix. On read operations, only files with this prefix are read. |
| `fileExtension`  | `string` | If set, indicates file extensions of the files. On write, files names will end with this suffix. On read, only files with this file extension will be read.           |
| `encoding`       | `string` | Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.             |

> [!TIP]
> To learn more about the role `namePrefix` and `fileExtension` properties play in data file filtering during query, see [file filtering logic](#file-filtering) section.
 
<a name="examples"></a>
**Examples** 

A non-partitioned external table. Data files are expected to be placed directly under the container(s) defined:

```kusto
.create external table ExternalTable (x:long, s:string)  
kind=blob 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
) 
```

An external table partitioned by date. Date files are expected to be placed in directories of default datetime format `yyyy/MM/dd`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=adl
partition by (Date:datetime = bin(Timestamp, 1d)) 
dataformat=csv 
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
```

An external table partitioned by month, with a directory format of `year=yyyy/month=MM`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=blob 
partition by (Month:datetime = startofmonth(Timestamp)) 
pathformat = (datetime_pattern("'year='yyyy'/month='MM", Month)) 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
) 
```

An external table partitioned first by customer name, then by date. Expected directory structure is, for example, `customer_name=Softworks/2019/02/01`:

```kusto
.create external table ExternalTable (Timestamp:datetime, CustomerName:string) 
kind=blob 
partition by (CustomerNamePart:string = CustomerName, Date:datetime = startofday(Timestamp)) 
pathformat = ("customer_name=" CustomerNamePart "/" Date)
dataformat=csv 
(  
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
)
```

An external table partitioned first by customer name hash (modulo ten), then by date. Expected directory structure is, for example, `customer_id=5/dt=20190201`. Data file names end with `.txt` extension:

```kusto
.create external table ExternalTable (Timestamp:datetime, CustomerName:string) 
kind=blob 
partition by (CustomerId:long = hash(CustomerName, 10), Date:datetime = startofday(Timestamp)) 
pathformat = ("customer_id=" CustomerId "/dt=" datetime_pattern("yyyyMMdd", Date)) 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with (fileExtension = ".txt")
```

**Sample Output**

|TableName|TableType|Folder|DocString|Properties|ConnectionStrings|Partitions|PathFormat|
|---------|---------|------|---------|----------|-----------------|----------|----------|
|ExternalTable|Blob|ExternalTables|Docs|{"Format":"Csv","Compressed":false,"CompressionType":null,"FileExtension":null,"IncludeHeaders":"None","Encoding":null,"NamePrefix":null}|["https://storageaccount.blob.core.windows.net/container1;\*\*\*\*\*\*\*"]|[{"Mod":10,"Name":"CustomerId","ColumnName":"CustomerName","Ordinal":0},{"Function":"StartOfDay","Name":"Date","ColumnName":"Timestamp","Ordinal":1}]|"customer\_id=" CustomerId "/dt=" datetime\_pattern("yyyyMMdd",Date)|

<a name="virtual-columns"></a>
**Virtual columns**

When data is exported from Spark, partition columns (that are specified in dataframe writer's `partitionBy` method) are not written to data files. 
This process avoids data duplication because the data already present in "folder" names. For example, `column1=<value>/column2=<value>/`, and Spark can recognize it upon read.

External tables support the following syntax for specifying virtual columns:

```kusto
.create external table ExternalTable (EventName:string, Revenue:double)  
kind=blob  
partition by (CustomerName:string, Date:datetime)  
pathformat = ("customer=" CustomerName "/date=" datetime_pattern("yyyyMMdd", Date))  
dataformat=parquet
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
```

> [!NOTE]
> Currently, virtual columns are not supported for the following data formats: `CSV`, `TSV`, `TSVE`, `SCsv`, `SOHsv`, `PSV`, `RAW` and `TXT`.

<a name="file-filtering"></a>
**File filtering logic**

When querying an external table, the query engine improves performance by filtering out irrelevant external storage files. The process of iterating on files and deciding whether a file should be processed is described below.

1. Build a URI pattern that represents a place where files are found. Initially, the URI pattern equals a connection string provided as part of the external table definition. If there are any partitions defined, they are rendered using *[PathFormat](#path-format)*, then appended to the URI pattern.

2. For all files found under the URI patterns(s) created, check:

   * Partition values match predicates used in a query.
   * Blob name starts with `NamePrefix`, if such a property is defined.
   * Blob name ends with `FileExtension`, if such a property is defined.

Once all the conditions are met, the file is fetched and processed by the query engine.

> [!NOTE]
> Initial URI pattern is built using query predicate values. This works best for a limited set of string values as well as for a closed time ranges. 

## .show external table artifacts

Returns a list of all files that will be processed when querying a given external table.

> [!NOTE]
> The operation requires [database user permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `table` *TableName* `artifacts` [`limit` *MaxResults*]

where *MaxResults* is an optional parameter, which can be set to limit the number of results.

**Output**

| Output parameter | Type   | Description                       |
|------------------|--------|-----------------------------------|
| Uri              | string | URI of external storage data file |

> [!TIP]
> Iterating on all files referenced by an external table can be quite costly, depending on the number of files. Make sure to use `limit` parameter if you just want to see some URI examples.

**Examples:**

```kusto
.show external table T artifacts
```

**Output:**

| Uri                                                                     |
|-------------------------------------------------------------------------|
| `https://storageaccount.blob.core.windows.net/container1/folder/file.csv` |

## .create external table mapping

`.create` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* *MappingInJsonFormat*

Creates a new mapping. For more information, see [Data Mappings](./mappings.md#json-mapping).

**Example** 
 
```kusto
.create external table MyExternalTable json mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Example output**

| Name     | Kind | Mapping                                                           |
|----------|------|-------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .alter external table mapping

`.alter` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* *MappingInJsonFormat*

Alters an existing mapping. 
 
**Example** 
 
```kusto
.alter external table MyExternalTable json mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Example output**

| Name     | Kind | Mapping                                                                |
|----------|------|------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .show external table mappings

`.show` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* 

`.show` `external` `table` *ExternalTableName* `json` `mappings`

Show the mappings (all or the one specified by name).
 
**Example** 
 
```kusto
.show external table MyExternalTable json mapping "Mapping1" 

.show external table MyExternalTable json mappings 
```

**Example output**

| Name     | Kind | Mapping                                                                         |
|----------|------|---------------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .drop external table mapping

`.drop` `external` `table` *ExternalTableName* `json` `mapping` *MappingName* 

Drops the mapping from the database.
 
**Example** 
 
```kusto
.drop external table MyExternalTable json mapping "Mapping1" 
```
## Next steps

* [External table general control commands](externaltables.md)
* [Create and alter external SQL tables](external-sql-tables.md)
