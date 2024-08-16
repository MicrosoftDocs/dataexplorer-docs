---
title:  Create and alter Azure Storage delta external tables
description: This article describes how to create and alter delta external tables
ms.reviewer: igborodi
ms.topic: reference
ms.date: 08/11/2024
---
# Create and alter delta external tables on Azure Storage

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The commands in this article can be used to create or alter a delta [external table](../query/schema-entities/external-tables.md) in the database from which the command is executed. A delta external table references Delta Lake table data located in Azure Blob Storage, Azure Data Lake Store Gen1, or Azure Data Lake Store Gen2.

> [!NOTE]
> If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.

## Permissions

To `.create` requires at least [Database User](../access-control/role-based-access-control.md) permissions, and to `.alter` requires at least [Table Admin](../access-control/role-based-access-control.md) permissions.

To `.create-or-alter` an external table using managed identity authentication requires [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* [`(`*Schema*`)`] `kind` `=` `delta` `(`*StorageConnectionString* `)` [`with` `(`*Property* [`,` ...]`)`]  

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|An external table name that adheres to the [entity names](../query/schema-entities/entity-names.md) rules. An external table can't have the same name as a regular table in the same database.|
|*Schema*| `string` ||The optional external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*.  If not specified, it will be automatically inferred from the delta log based on the latest delta table version.|
|*StorageConnectionString*| `string` | :heavy_check_mark:|delta table root folder path, including credentials. Can point to Azure Blob Storage blob container, Azure Data Lake Gen 2 file system or Azure Data Lake Gen 1 container. The external table storage type is determined by the provided connection string. See [storage connection strings](../api/connection-strings/storage-connection-strings.md).|
|*Property*| `string` ||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [optional properties](#optional-properties).|

> [!NOTE]
>
> * If a custom schema is provided, non-existing columns or columns having incompatible types will be filled with null values.
> * Information about partitions is automatically inferred from the delta log. Partition columns are added as virtual columns to the table schema. For more information, see [Virtual columns](external-tables-azure-storage.md#virtual-columns).
> * The path format is automatically inferred from the partitioning information. For more information, see [Path format](external-tables-azure-storage.md#path-format)

> [!TIP]
> For a custom schema, you can use the [infer_storage_schema](../query/infer-storage-schema-plugin.md) plugin to infer the schema based on the external file content.

## Authentication and authorization

The authentication method to access an external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

The supported authentication methods are the same as those supported by [Azure Storage external tables](external-tables-azure-storage.md#authentication-and-authorization).

## Optional properties

| Property         | Type     | Description       |
|------------------|----------|------------------------------------------------------------------------------------|
| `folder`         | `string` | Table's folder                                                                     |
| `docString`      | `string` | String documenting the table                                                       |
| `namePrefix`     | `string` | If set, indicates the prefix of the files. On write operations, all files will be written with this prefix. On read operations, only files with this prefix are read. |
| `fileExtension`  | `string` | If set, indicates file extensions of the files. On write, files names will end with this suffix. On read, only files with this file extension will be read.           |
| `encoding`       | `string` | Indicates how the text is encoded: `UTF8NoBOM` (default) or `UTF8BOM`.             |
| `dryRun` | `bool` | If set, the external table definition isn't persisted. This option is useful for validating the external table definition, especially in conjunction with the `filesPreview` or `sampleUris` parameter. |

> [!NOTE]
> The external delta table is accessed during creation, to infer the partitioning information and, optionally, the schema. Make sure that the table definition is valid and that the storage is accessible.

## Examples

### Create or alter a delta external table with an inferred schema

In the following external table, the schema is automatically inferred from the latest delta table version.

```kusto
.create-or-alter external table ExternalTable  
kind=delta 
( 
   h@'https://storageaccount.blob.core.windows.net/container1;secretKey'
) 
```

### Create a delta external table with a custom schema

In the following external table, a custom schema is specified and overrides the schema of the delta table. If, at some later time, you need to replace the custom schema with the schema based on the latest delta table version, run the `.alter` | `.create-or-alter` command without specifying a schema, like in the previous example.

```kusto
.create external table ExternalTable (Timestamp:datetime, x:long, s:string) 
kind=delta
( 
   h@'abfss://filesystem@storageaccount.dfs.core.windows.net/path;secretKey'
)
```

## Limitations

* Time travel is not supported. Only the latest delta table version is used.

::: moniker range="azure-data-explorer"
## Related content

* [Query external tables](/azure/data-explorer/data-lake-query-data)
::: moniker-end