---
title: .drop ingestion mapping command
description: Learn how to use the `.drop ingestion mapping` command to drop the ingestion mapping from a table or a database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/15/2023
---
# .drop ingestion mapping command

Drops the ingestion mapping from a database or table.

## Permissions

The command to drop a database ingestion mapping requires at least [Database Ingestor](../access-control/role-based-access-control.md) permissions, and the command to drop a table ingestion mapping requires at least [Table Ingestor](../access-control/role-based-access-control.md) permissions.

## Syntax

`.drop` (`table` | `database`) *TableOrDatabaseName* `ingestion` *MappingKind*  `mapping` *MappingName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableOrDatabaseName*| `string` | :heavy_check_mark:|The name of the table or database containing the ingestion mapping to drop.|
|*MappingKind*| `string` | :heavy_check_mark:|The kind of the ingestion mapping. Valid values are `csv`, `json`, `avro`, `parquet`, and `orc`.|
|*MappingName*| `string` | :heavy_check_mark:|The name of the ingestion mapping to drop.|

## Examples

### Drop a CSV table mapping

```kusto
.drop table MyTable ingestion csv mapping "Mapping1" 
```

### Drop a JSON table mapping

```kusto
.drop table MyTable ingestion json mapping "Mapping1" 
```

### Drop a CSV database mapping

```kusto
.drop database MyDatabase ingestion csv mapping "Mapping2" 
```
