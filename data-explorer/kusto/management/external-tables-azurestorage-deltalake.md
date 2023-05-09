---
title: Create and alter Azure Storage Delta Lake external tables - Azure Data Explorer
description: This article describes how to create and alter Delta Lake external tables
ms.reviewer: igborodi
ms.topic: reference
ms.date: 05/08/2023
---

# Create and alter Delta external tables on Azure Storage

The commands in this article can be used to create or alter an Delta [external table](../query/schema-entities/externaltables.md) in the database from which the command is executed. A Delta external table references a Delta Lake table data located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2.

> [!NOTE]
> If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.

## Permissions

To `.create` requires at least [Database User](../management/access-control/role-based-access-control.md) permissions, and to `.alter` requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions.

To `.create-or-alter` an external table using managed identity authentication requires [AllDatabasesAdmin](../management/access-control/role-based-access-control.md) permissions.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* [`(`*Schema*`)`] `kind` `=` `delta` `(`*StorageConnectionString* `)` [`with` `(`*Property* [`,` ...]`)`]  

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|An external table name that adheres to the [entity names](../query/schema-entities/entity-names.md) rules. An external table can't have the same name as a regular table in the same database.|
|*Schema*|string||The optional external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*.  If not specified, it will be automatically inferred from the Delta log based on the latest Delta table version. Otherwise, the provided schema is applied on Delta table data.|
|*StorageConnectionString*|string|&check;|Delta table root folder path, including credentials. Can point to Azure Blob Storage blob container, Azure Data Lake Gen 2 file system or Azure Data Lake Gen 1 container. The external table storage type is determined by the provided connection string. See [storage connection strings](../api/connection-strings/storage-connection-strings.md).|
|*Property*|string||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [optional properties](#optional-properties).|

> [!NOTE]
> * If a custom schema is provided, non-existing columns or columns having incompatible types will be filled with null values.
> * Information about partitions is automatically inferred from the Delta log. Partition columns are added as virtual columns to the table schema. Read more on [Virtual columns](external-tables-azurestorage-azuredatalake.md#virtual-columns).
> * Path format is automatically inferred from the partitioning information. Read more on [Path format](external-tables-azurestorage-azuredatalake.md#path-format)

> [!TIP]
>  For a custom schema, one can use [infer\_storage\_schema](../query/inferstorageschemaplugin.md) to infer the schema based on external file contents.


## Authentication and authorization

The authentication method to access an external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

The supported authentication methods are same as for [Azure Storage external tables](external-tables-azurestorage-azuredatalake.md#authentication-and-authorization).


## Optional properties

| Property         | Type     | Description       |
|------------------|----------|-------------------------------------------------------------------------------------|
| `folder`         | `string` | Table's folder                                                                     |
| `docString`      | `string` | String documenting the table                                                       |
| `namePrefix`     | `string` | If set, indicates the prefix of the files. On write operations, all files will be written with this prefix. On read operations, only files with this prefix are read. |
| `fileExtension`  | `string` | If set, indicates file extensions of the files. On write, files names will end with this suffix. On read, only files with this file extension will be read.           |
| `encoding`       | `string` | Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.             |
| `dryRun` | `bool` | If set, the external table definition isn't persisted. This option is useful for validating the external table definition, especially in conjunction with the `filesPreview` or `sampleUris` parameter. |

> [!NOTE]
> The external Delta table is accessed during creation, to infer the partitioning information and (optionally) the schema. Make sure the table definition is valid and the storage is accessible.


## Examples

### Delta external table with inferred schema

In the following external table, the schema is automatically inferred from the latest Delta table version.

```kusto
.create-or-alter external table ExternalTable  
kind=delta 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
) 
```

### Delta external table with custom schema

In the following external table, a custom schema is specified and overrides the schema of the Delta table. It is always possible to run `.alter` | `.create-or-alter` command without specifying a schema, to replace the custom schema with the schema based on the latest Delta table version, like in previous example.

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=delta
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
```


## Limitations

* Time travel is not supported yet. Only the latest Delta table version is used.
* Export/Continuous Export into Delta external tables is not supported yet.


## Next steps

* [Query external tables](../../data-lake-query-data.md).
