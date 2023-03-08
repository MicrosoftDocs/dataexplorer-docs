---
title: Create and alter Azure Storage external tables - Azure Data Explorer
description: This article describes how to create and alter external tables based on Azure Blob Storage or Azure Data Lake
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/08/2023
---

# Create and alter Azure Storage external tables

The following command describes how to create an external table located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2.

For an introduction to the external Azure Storage tables feature, see [Query data in Azure Data Lake using Azure Data Explorer](../../data-lake-query-data.md).

## Permissions

To `.create` requires at least [Database User](../management/access-control/role-based-access-control.md) permissions and to `.alter` requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions.

To `.create-or-alter` an external table using managed identity authentication requires [AllDatabasesAdmin](../management/access-control/role-based-access-control.md) permissions.

## Authentication and authorization

The authentication method to access an external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

The following table lists the supported authentication methods for Azure Storage external tables and the permissions needed to read or write to the table.

| Authentication method | Azure Blob Storage / Data Lake Storage Gen2 | Data Lake Storage Gen1 |
|--|--|--|
|[Impersonation](../api/connection-strings/storage-authentication-methods.md#impersonation)|Read permissions: Storage Blob Data Reader<br/>Write permissions:Storage Blob Data Contributor|Read permissions: Reader<br/>Write permissions: Contributor|
|[Managed identity](../api/connection-strings/storage-authentication-methods.md#managed-identity)|Read permissions: Storage Blob Data Reader<br/>Write permissions: Storage Blob Data Contributor|Read permissions: Reader<br/>Write permissions: Contributor|
|[Shared Access (SAS) token](../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token)|Read permissions: List + Read<br/>Write permissions: Write|This authorization method isn't supported in Gen1.|
|[Azure AD access token](../api/connection-strings/storage-authentication-methods.md#azure-ad-access-token)|||
|[Storage account access key](../api/connection-strings/storage-authentication-methods.md#storage-account-access-key)||This authorization method isn't supported in Gen1.|

## .create or .alter external table

### Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *tableName* `(`*schema*`)` `kind` `=` `storage` [`partition` `by` `(`*partitions*`)` [`pathformat` `=` `(`*path-format*`)`]] `dataformat` `=` *format* `(`*storageConnectionString* [`,` ...] `)` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]  

Creates or alters a new external table in the database in which the command is executed.

> [!NOTE]
>
> * If the table exists, `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.
> * The external table is not accessed during creation time. It will only be accessed during query / export. You can use the `validateNotEmpty` (optional) property during creation time to make sure the external table definition is valid and that the underlying storage is accessible.

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*tableName*|string|&check;|An external table name that adheres to the [entity names](../query/schema-entities/entity-names.md) rules. An external table can't have the same name as a regular table in the same database.|
|*schema*|string|&check;|The external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*. If the schema is unknown, use [infer\_storage\_schema](../query/inferstorageschemaplugin.md) to infer the schema based on external file contents.|
|*kind*|string|&check;|The type of the external table. In this case, `storage` should be used instead of `sql`. Deprecated terms: `blob` for Blob Azure Storage or Azure Data Lake Gen 2 Storage, and `adl` for Azure Data Lake Gen 1 Storage.|
|*partitions*|string|| A comma-separated list of columns by which the external table is partitioned. Partition column can exist in the data file itself, or as part of the file path. See [partitions formatting](#partitions-formatting) to learn how this value should look.|
|*pathFormat*|string||An external data folder URI path format to use with partitions. See [partitions formatting](#partitions-formatting).|
|*format*|string|&check;|The data format, which can be any of the [ingestion formats](../../ingestion-supported-formats.md). It's recommended to use the `Parquet` format for external tables to improve query and export performance, unless you use `JSON` paths mapping. When using an external table for [export scenario](data-export/export-data-to-an-external-table.md), you're limited to the following formats: `CSV`, `TSV`, `JSON` and `Parquet`.|
|*storageConnectionString*|string|&check;|One or more comma-separated paths to Azure Blob Storage blob containers, Azure Data Lake Gen 2 file systems or Azure Data Lake Gen 1 containers, including credentials. The external table storage type is determined by the provided connection strings. See [storage connection strings](../api/connection-strings/storage-connection-strings.md) for details.|
|*propertyName*, *propertyValue*|string||A comma-separated list of key-value property pairs. See [optional properties](#optional-properties).|

> [!TIP]
> Provide more than a single storage account to avoid storage throttling while [exporting](data-export/export-data-to-an-external-table.md) large amounts of data to the external table. Export will distribute the writes between all accounts provided.

> [!TIP]
> For CSV data files, having files with non-identical schema under the same storage container might result in data appearing shifted or missing. If some CSV files miss columns or have extra columns, move them to a different storage container(s) and define another external table(s) matching their schema, so that each external table covers a set of storage containers containing files of an identical schema.

### Partitions formatting

The partitions list is any combination of partition columns, specified using one of the forms described in the following table.

|Partition Type|Syntax|Notes|
|--|--|--|
|Virtual column|*PartitionName* `:` (`datetime` \| `string`)|Read more on [virtual columns](#virtual-columns).|
|String column value|*PartitionName* `:` `string` `=` *ColumnName*||
|String column value [hash](../query/hashfunction.md)|*PartitionName* `:` `long` `=` `hash(`*ColumnName*`,` *Number*`)`|The hash is modulo *Number*.|
|Truncated datetime column (value)|*PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`|See documentation on [startofyear](../query/startofyearfunction.md), [startofmonth](../query/startofmonthfunction.md), [startofweek](../query/startofweekfunction.md), or [startofday](../query/startofdayfunction.md) functions.|
|Truncated Datetime Column Value (bin)|*PartitionName* `:` `datetime` `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`|Read more about the [bin](../query/binfunction.md) function.|

*PathFormat* is a way to specify the format for the external data folder URI path in addition to partitions. It consists of a sequence of partition elements and text separators. A partition element refers to a partition that is declared in the partition `by` clause, and the text separator is any text enclosed in quotes. Consecutive partition elements must be set apart using the text separator.

[ *StringSeparator* ] *Partition* [ *StringSeparator* ] [*Partition* [ *StringSeparator* ] ...]

To construct the original file path prefix, partition elements are rendered as strings and separated with corresponding text separators. You can use the `datetime_pattern` macro (`datetime_pattern(`*DateTimeFormat*`,` *PartitionName*`)`) to specify the format used for rendering a datetime partition value. The macro adheres to the .NET format specification, and allows format specifiers to be enclosed in curly brackets. For example, the following two formats are equivalent:

* 'year='yyyy'/month='MM
* year={yyyy}/month={MM}

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

> [!TIP]
> To check *Partitions* and *PathFormat* definition correctness, use the property `sampleUris` or `filesPreview` when creating an external table.

### Optional properties

| Property         | Type     | Description       |
|------------------|----------|-------------------------------------------------------------------------------------|
| `folder`         | `string` | Table's folder                                                                     |
| `docString`      | `string` | String documenting the table                                                       |
| `compressed`     | `bool`   | If set, indicates whether the files are compressed as `.gz` files (used in [export scenario](data-export/export-data-to-an-external-table.md) only) |
| `includeHeaders` | `string` | For delimited text formats (CSV, TSV, ...), indicates whether files contain a header. Possible values are: `All` (all files contain a header), `FirstFile` (first file in a folder contains a header), `None` (no files contain a header). |
| `namePrefix`     | `string` | If set, indicates the prefix of the files. On write operations, all files will be written with this prefix. On read operations, only files with this prefix are read. |
| `fileExtension`  | `string` | If set, indicates file extensions of the files. On write, files names will end with this suffix. On read, only files with this file extension will be read.           |
| `encoding`       | `string` | Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.             |
| `sampleUris`     | `bool`   | If set, the command result provides several examples of simulated external data files URI as they're expected by the external table definition. This option helps validate whether the *Partitions* and *PathFormat* parameters are defined properly. |
| `filesPreview`   | `bool`   | If set, one of the command result tables contains a preview of [.show external table artifacts](#show-external-table-artifacts) command. Like `sampleUri`, the option helps validate the *Partitions* and *PathFormat* parameters of external table definition. |
| `validateNotEmpty` | `bool`   | If set, the connection strings are validated for having content in them. The command will fail if the specified URI location doesn't exist, or if there are insufficient permissions to access it. |
| `dryRun` | `bool` | If set, the external table definition isn't persisted. This option is useful for validating the external table definition, especially in conjunction with the `filesPreview` or `sampleUris` parameter. |

> [!TIP]
> To learn more about the role `namePrefix` and `fileExtension` properties play in data file filtering during query, see [file filtering logic](#file-filtering) section.

### Examples

A non-partitioned external table. Data files are expected to be placed directly under the container(s) defined:

```kusto
.create external table ExternalTable (x:long, s:string)  
kind=storage 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
) 
```

An external table partitioned by date. Data files are expected to be placed under directories of the default datetime format `yyyy/MM/dd`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=storage
partition by (Date:datetime = bin(Timestamp, 1d)) 
dataformat=csv 
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
```

An external table partitioned by month, with a directory format of `year=yyyy/month=MM`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=storage 
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
kind=storage 
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
kind=storage 
partition by (CustomerId:long = hash(CustomerName, 10), Date:datetime = startofday(Timestamp)) 
pathformat = ("customer_id=" CustomerId "/dt=" datetime_pattern("yyyyMMdd", Date)) 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with (fileExtension = ".txt")
```

To filter by partition columns in a query, specify original column name in query predicate:

```kusto
external_table("ExternalTable")
 | where Timestamp between (datetime(2020-01-01) .. datetime(2020-02-01))
 | where CustomerName in ("John.Doe", "Ivan.Ivanov")
```

**Sample Output**

|TableName|TableType|Folder|DocString|Properties|ConnectionStrings|Partitions|PathFormat|
|---------|---------|------|---------|----------|-----------------|----------|----------|
|ExternalTable|Blob|ExternalTables|Docs|{"Format":"Csv","Compressed":false,"CompressionType":null,"FileExtension":null,"IncludeHeaders":"None","Encoding":null,"NamePrefix":null}|["https://storageaccount.blob.core.windows.net/container1;\*\*\*\*\*\*\*"]|[{"Mod":10,"Name":"CustomerId","ColumnName":"CustomerName","Ordinal":0},{"Function":"StartOfDay","Name":"Date","ColumnName":"Timestamp","Ordinal":1}]|"customer\_id=" CustomerId "/dt=" datetime\_pattern("yyyyMMdd",Date)|

<a name="virtual-columns"></a>
**Virtual columns**

When data is exported from Spark, partition columns (that are provided to the dataframe writer's `partitionBy` method) aren't written to data files.
This process avoids data duplication because the data is already present in the folder names (for example, `column1=<value>/column2=<value>/`), and Spark can recognize it upon read.

External tables support reading this data in the form of `virtual colums`. Virtual columns can be of either type `string` or `datetime`, and are specified using the following syntax:

```kusto
.create external table ExternalTable (EventName:string, Revenue:double)  
kind=storage  
partition by (CustomerName:string, Date:datetime)  
pathformat = ("customer=" CustomerName "/date=" datetime_pattern("yyyyMMdd", Date))  
dataformat=parquet
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
```

To filter by virtual columns in a query, specify partition names in query predicate:

```kusto
external_table("ExternalTable")
 | where Date between (datetime(2020-01-01) .. datetime(2020-02-01))
 | where CustomerName in ("John.Doe", "Ivan.Ivanov")
```

<a name="file-filtering"></a>
**File filtering logic**

When querying an external table, the query engine improves performance by filtering out irrelevant external storage files. The process of iterating files and deciding whether a file should be processed is as follows:

1. Build a URI pattern that represents a place where files are found. Initially, the URI pattern equals a connection string provided as part of the external table definition. If there are any partitions defined, they're rendered using *PathFormat*, then appended to the URI pattern.

2. For all files found under the URI pattern(s) created, check that:

   * Partition values match predicates used in a query.
   * Blob name starts with `NamePrefix`, if such a property is defined.
   * Blob name ends with `FileExtension`, if such a property is defined.

Once all the conditions are met, the file is fetched and processed by the query engine.

> [!NOTE]
> Initial URI pattern is built using query predicate values. This works best for a limited set of string values as well as for a closed time ranges.

## .show external table artifacts

Returns a list of all files that will be processed when querying a given external table.

> [!NOTE]
> The operation requires [database user permission](./access-control/role-based-access-control.md).

**Syntax:** 

`.show` `external` `table` *tableName* `artifacts` [`limit` *MaxResults*]

where *MaxResults* is an optional parameter, which can be set to limit the number of results.

**Output**

| Output parameter | Type   | Description                       |
|------------------|--------|-----------------------------------|
| Uri              | string | URI of external storage data file |
| Size             | long   | File length in bytes              |
| Partition        | dynamic | Dynamic object describing file partitions for partitioned external table |

> [!TIP]
> Iterating over all files referenced by an external table can be quite costly, depending on the number of files. Make sure to use `limit` parameter if you just want to see some URI examples.

**Examples:**

```kusto
.show external table T artifacts
```

**Output:**

| Uri                                                                     | Size | Partition |
|-------------------------------------------------------------------------| ---- | --------- |
| `https://storageaccount.blob.core.windows.net/container1/folder/file.csv` | 10743 | `{}`   |

For partitioned table, `Partition` column will contain extracted partition values:

**Output:**

| Uri                                                                     | Size | Partition |
|-------------------------------------------------------------------------| ---- | --------- |
| `https://storageaccount.blob.core.windows.net/container1/customer=john.doe/dt=20200101/file.csv` | 10743 | `{"Customer": "john.doe", "Date": "2020-01-01T00:00:00.0000000Z"}` |

## .create external table mapping

`.create` `external` `table` *ExternaltableName* `mapping` *MappingName* *MappingInJsonFormat*

Creates a new mapping. For more information, see [Data Mappings](./json-mapping.md).

**Example**

```kusto
.create external table MyExternalTable mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Example output**

| Name     | Kind | Mapping                                                           |
|----------|------|-------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .alter external table mapping

`.alter` `external` `table` *ExternaltableName* `mapping` *MappingName* *MappingInJsonFormat*

Alters an existing mapping.

**Example**

```kusto
.alter external table MyExternalTable mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Example output**

| Name     | Kind | Mapping                                                                |
|----------|------|------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .show external table mappings

`.show` `external` `table` *ExternaltableName* `mapping` *MappingName*

`.show` `external` `table` *ExternaltableName* `mappings`

Show the mappings (all or the one specified by name).

**Example**

```kusto
.show external table MyExternalTable mapping "Mapping1" 

.show external table MyExternalTable mappings 
```

**Example output**

| Name     | Kind | Mapping                                                                         |
|----------|------|---------------------------------------------------------------------------------|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .drop external table mapping

`.drop` `external` `table` *ExternaltableName* `mapping` *MappingName*

Drops the mapping from the database.

**Example**

```kusto
.drop external table MyExternalTable mapping "Mapping1" 
```

## Next steps

* [Query external tables](../../data-lake-query-data.md).
* [Export data to an external table](data-export/export-data-to-an-external-table.md).
* [Continuous data export to an external table](data-export/continuous-data-export.md).
