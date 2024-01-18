---
title:  Create and alter Azure Storage external tables
description: This article describes how to create and alter external tables based on Azure Blob Storage or Azure Data Lake
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/09/2023
---

# Create and alter Azure Storage external tables

The commands in this article can be used to create or alter an Azure Storage [external table](../query/schema-entities/external-tables.md) in the database from which the command is executed. An Azure Storage external table references data located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2.

> [!NOTE]
> If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.

## Permissions

To `.create` requires at least [Database User](../management/access-control/role-based-access-control.md) permissions, and to `.alter` requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions.

To `.create-or-alter` an external table using managed identity authentication requires [AllDatabasesAdmin](../management/access-control/role-based-access-control.md) permissions.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* `(`*Schema*`)` `kind` `=` `storage` [`partition` `by` `(`*Partitions*`)` [`pathformat` `=` `(`*PathFormat*`)`]] `dataformat` `=` *DataFormat* `(`*StorageConnectionString* [`,` ...] `)` [`with` `(`*Property* [`,` ...]`)`]  

> [!NOTE]
> `kind` is `storage` for all Azure Storage external data store types. `blob` and `adl` are deprecated terms.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|An external table name that adheres to the [entity names](../query/schema-entities/entity-names.md) rules. An external table can't have the same name as a regular table in the same database.|
|*Schema*|string| :heavy_check_mark:|The external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*. If the schema is unknown, use [infer\_storage\_schema](../query/infer-storage-schema-plugin.md) to infer the schema based on external file contents.|
|*Partitions*|string|| A comma-separated list of columns by which the external table is partitioned. Partition column can exist in the data file itself, or as part of the file path. See [partitions formatting](#partitions-formatting) to learn how this value should look.|
|*PathFormat*|string||An external data folder URI path format to use with partitions. See [path format](#path-format).|
|*DataFormat*|string| :heavy_check_mark:|The data format, which can be any of the [ingestion formats](../../ingestion-supported-formats.md). We recommend using the `Parquet` format for external tables to improve query and export performance, unless you use `JSON` paths mapping. When using an external table for [export scenario](data-export/export-data-to-an-external-table.md), you're limited to the following formats: `CSV`, `TSV`, `JSON` and `Parquet`.|
|*StorageConnectionString*|string| :heavy_check_mark:|One or more comma-separated paths to Azure Blob Storage blob containers, Azure Data Lake Gen 2 file systems or Azure Data Lake Gen 1 containers, including credentials. The external table storage type is determined by the provided connection strings. See [storage connection strings](../api/connection-strings/storage-connection-strings.md).|
|*Property*|string||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [optional properties](#optional-properties).|

> [!NOTE]
> CSV files with non-identical schema might result in data appearing shifted or missing. We recommend separating CSV files with distinct schemas to separate storage containers and defining an external table for each storage container with the proper schema.

> [!TIP]
> Provide more than a single storage account to avoid storage throttling while [exporting](data-export/export-data-to-an-external-table.md) large amounts of data to the external table. Export will distribute the writes between all accounts provided.

## Authentication and authorization

The authentication method to access an external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

The following table lists the supported authentication methods for Azure Storage external tables and the permissions needed to read or write to the table.

| Authentication method | Azure Blob Storage / Data Lake Storage Gen2 | Data Lake Storage Gen1 |
|--|--|--|
|[Impersonation](../api/connection-strings/storage-authentication-methods.md#impersonation)|**Read permissions:** Storage Blob Data Reader<br/>**Write permissions:** Storage Blob Data Contributor|**Read permissions:** Reader<br/>**Write permissions:** Contributor|
|[Managed identity](../api/connection-strings/storage-authentication-methods.md#managed-identity)|**Read permissions:** Storage Blob Data Reader<br/>**Write permissions:** Storage Blob Data Contributor|**Read permissions:** Reader<br/>**Write permissions:** Contributor|
|[Shared Access (SAS) token](../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token)|**Read permissions:** List + Read<br/>**Write permissions:** Write|This authentication method isn't supported in Gen1.|
|[Microsoft Entra access token](../api/connection-strings/storage-authentication-methods.md#azure-ad-access-token)|No additional permissions required.|No additional permissions required.|
|[Storage account access key](../api/connection-strings/storage-authentication-methods.md#storage-account-access-key)|No additional permissions required.|This authentication method isn't supported in Gen1.|

## Partitions formatting

The partitions list is any combination of partition columns, specified using one of the forms shown in the following table.

|Partition Type|Syntax|Notes|
|--|--|--|
|Virtual column|*PartitionName* `:` (`datetime` \| `string`)|Read more on [virtual columns](#virtual-columns).|
|String column value|*PartitionName* `:` `string` `=` *ColumnName*||
|String column value [hash](../query/hash-function.md)|*PartitionName* `:` `long` `=` `hash(`*ColumnName*`,` *Number*`)`|The hash is modulo *Number*.|
|Truncated datetime column (value)|*PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`|See documentation on [startofyear](../query/startofyear-function.md), [startofmonth](../query/startofmonth-function.md), [startofweek](../query/startofweek-function.md), or [startofday](../query/startofday-function.md) functions.|
|Truncated Datetime Column Value (bin)|*PartitionName* `:` `datetime` `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`|Read more about the [bin](../query/bin-function.md) function.|

### Path format

The *PathFormat* parameter allows you to specify the format for the external data folder URI path in addition to partitions. It consists of a sequence of partition elements and text separators. A partition element refers to a partition that is declared in the partition `by` clause, and the text separator is any text enclosed in quotes. Consecutive partition elements must be set apart using the text separator.

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

### Virtual columns

When data is exported from Spark, partition columns (that are provided to the dataframe writer's `partitionBy` method) aren't written to data files.
This process avoids data duplication because the data is already present in the folder names (for example, `column1=<value>/column2=<value>/`), and Spark can recognize it upon read.

External tables support reading this data in the form of `virtual colums`. Virtual columns can be of either type `string` or `datetime`, and are specified using the following syntax:

```kusto
.create external table ExternalTable (EventName:string, Revenue:double)  
kind=storage  
partition by (CustomerName:string, Date:datetime)  
pathformat=("customer=" CustomerName "/date=" datetime_pattern("yyyyMMdd", Date))  
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

## Optional properties

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
| `filesPreview`   | `bool`   | If set, one of the command result tables contains a preview of [.show external table artifacts](show-external-table-artifacts.md) command. Like `sampleUri`, the option helps validate the *Partitions* and *PathFormat* parameters of external table definition. |
| `validateNotEmpty` | `bool`   | If set, the connection strings are validated for having content in them. The command will fail if the specified URI location doesn't exist, or if there are insufficient permissions to access it. |
| `dryRun` | `bool` | If set, the external table definition isn't persisted. This option is useful for validating the external table definition, especially in conjunction with the `filesPreview` or `sampleUris` parameter. |

> [!NOTE]
> The external table isn't accessed during creation, only during query and export. Use the `validateNotEmpty` optional property during creation to make sure the table definition is valid and the storage is accessible.

> [!TIP]
> To learn more about the role `namePrefix` and `fileExtension` properties play in data file filtering during query, see [file filtering logic](#file-filtering-logic) section.

### File filtering logic

When querying an external table, performance is improved by filtering out irrelevant external storage files. The process of iterating files and deciding whether a file should be processed is as follows:

1. Build a URI pattern that represents a place where files are found. Initially, the URI pattern equals a connection string provided as part of the external table definition. If there are any partitions defined, they're rendered using *PathFormat*, then appended to the URI pattern.

2. For all files found under the URI pattern(s) created, check that:

   * Partition values match predicates used in a query.
   * Blob name starts with `NamePrefix`, if such a property is defined.
   * Blob name ends with `FileExtension`, if such a property is defined.

Once all the conditions are met, the file is fetched and processed.

> [!NOTE]
> Initial URI pattern is built using query predicate values. This works best for a limited set of string values as well as for a closed time ranges.

## Examples

### Non-partitioned external table

In the following non-partitioned external table, the files are expected to be placed directly under the container(s) defined:

```kusto
.create external table ExternalTable (x:long, s:string)  
kind=storage 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
) 
```

### Partitioned by date

In the following external table partitioned by date, the files are expected to be placed under directories of the default datetime format `yyyy/MM/dd`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=storage
partition by (Date:datetime = bin(Timestamp, 1d)) 
dataformat=csv 
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
```

### Partitioned by month

In the following external table partitioned by month, the directory format is `year=yyyy/month=MM`:

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=storage 
partition by (Month:datetime = startofmonth(Timestamp)) 
pathformat=(datetime_pattern("'year='yyyy'/month='MM", Month)) 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
) 
```

### Partitioned by name and date

In the following external table, the data is partitioned first by customer name and then by date, meaning that the expected directory structure is, for example, `customer_name=Softworks/2019/02/01`:

```kusto
.create external table ExternalTable (Timestamp:datetime, CustomerName:string) 
kind=storage 
partition by (CustomerNamePart:string = CustomerName, Date:datetime = startofday(Timestamp)) 
pathformat=("customer_name=" CustomerNamePart "/" Date)
dataformat=csv 
(  
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey' 
)
```

### Partitioned by hash and date

The following external table is partitioned first by customer name hash (modulo ten), then by date. The expected directory structure is, for example, `customer_id=5/dt=20190201`, and data file names end with the `.txt` extension:

```kusto
.create external table ExternalTable (Timestamp:datetime, CustomerName:string) 
kind=storage 
partition by (CustomerId:long = hash(CustomerName, 10), Date:datetime = startofday(Timestamp)) 
pathformat=("customer_id=" CustomerId "/dt=" datetime_pattern("yyyyMMdd", Date)) 
dataformat=csv 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
)
with (fileExtension = ".txt")
```

### Filter by partition columns in a query

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

## Related content

* [Query external tables](../../data-lake-query-data.md).
* [Export data to an external table](data-export/export-data-to-an-external-table.md).
* [Continuous data export to an external table](data-export/continuous-data-export.md).
