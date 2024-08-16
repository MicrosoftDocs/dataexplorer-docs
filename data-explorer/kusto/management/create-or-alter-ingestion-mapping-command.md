---
title: .create-or-alter ingestion mapping command
description: Learn how to use the `.create-or-alter ingestion mapping` command to create or alter an ingestion mapping.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/26/2023
---
# .create-or-alter ingestion mapping command

Creates or alters an ingestion mapping that can be associated with a specific format and a specific table or database.

If the ingestion mapping doesn't exist, the command will create it. If the ingestion mapping already exists, the command will modify it.

> [!NOTE]
> New columns introduced in an ingestion mapping, which aren't present in the source table, will be added to the table during the initial data ingestion for that column. This behavior is only supported for queued ingestion and is contingent on specifying a valid data type for the column.

## Permissions

At least [Database Ingestor](access-control/role-based-access-control.md) permissions are required to create a database ingestion mapping, and at least [Table Ingestor](access-control/role-based-access-control.md) permissions are required to create a table ingestion mapping.

## Syntax

`.create-or-alter` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

`.create-or-alter` `database` *DatabaseName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table.|
| *DatabaseName* | `string` |  :heavy_check_mark: | The name of the database.|
| *MappingKind* | `string` |  :heavy_check_mark: | The type of mapping. Valid values are `CSV`, `JSON`, `avro`, `parquet`, and `orc`.|
| *MappingName* | `string` |  :heavy_check_mark: | The name of the mapping.|
| *MappingFormattedAsJson* | `string` |  :heavy_check_mark: | The ingestion mapping definition formatted as a JSON value.|

> [!NOTE]
>
> * Once created, the mapping can be referenced by its name in ingestion commands, instead of specifying the complete mapping as part of the command.
> * If a mapping with the same name is created in both the table scope and the database scope, the mapping in the table scope will have a higher priority.
> * When ingesting into a table and referencing a mapping whose schema does not match the ingested table schema, the ingest operation will fail.

## Example

```kusto
.create table MyTable ingestion csv mapping "Mapping1"
'['
'   { "column" : "rownumber", "DataType":"int", "Properties":{"Ordinal":"0"}},'
'   { "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"}}'
']'

.create-or-alter table MyTable ingestion json mapping "Mapping1"
'['
'    { "column" : "rownumber", "datatype" : "int", "Properties":{"Path":"$.rownumber"}},'
'    { "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}'
']'
```

**Output**

| Name | Kind | Mapping | Database | Table |
|--|--|--|
| mapping1 | JSON | [{"Properties":{"Path":"$.rownumber"},"column":"rownumber","datatype":"int"},{"Properties":{"Path":"$.rowguid"},"column":"rowguid","datatype":""}] | MyDatabase | MyTable |

## Related content

* For detailed descriptions of various ingestion mapping formats such as CSV, JSON, Avro, Parquet, and Orc, see [Data mappings](mappings.md).
