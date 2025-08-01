---
title: The show ingestion mapping command
description: Learn how to use the show ingestion mapping command to view the ingestion mapping for a table or database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# `.show ingestion mapping`

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Use this command to view a specific ingestion mapping, or all ingestion mappings, for a database or table.

## Syntax

View a specific mapping:

`.show` (`table` | `database`) *EntityName* `ingestion` *MappingKind* `mapping` *MappingName*

View all mappings or all mappings of a specific type:

`.show` (`table` | `database`) *EntityName* `ingestion` [ *MappingKind* ] `mappings`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityName*| `string` | :heavy_check_mark:|The name of the table or database for which to show the ingestion mappings.|
|*MappingKind*| `string` ||The type of mappings to view. Possible values: `csv`, `json`, `avro`, `w3clogfile`, `parquet`, and `orc`.|
|*MappingName*| `string` ||The name of the mapping to view. This argument is required if you specify that you want to view a single `mapping` instead of multiple `mappings` for the entity. See [syntax options](#syntax).|

## Returns

The command returns a table with the columns `Name`, `Kind`, and `Mapping` that describe one or more ingestion mappings names, types, and specifications.

## Example

### Show a specific ingestion mapping

```kusto
.show table MyTable ingestion csv mapping "mapping1" 
```

**Output**

| Name     | Kind | Mapping     |
|----------|------|-------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |

If the table only contained one CSV formatted mapping named `mapping1`, the following query would return the same output as the previous query.

```kusto
.show table MyTable ingestion csv mappings 
```

```kusto
.show database MyDatabase ingestion csv mappings
```

## Related content

* Learn more about [data mappings](mappings.md)
* Use the [`.create ingestion mapping`](create-ingestion-mapping-command.md) command to create a new mapping
* Use the [`.alter ingestion mapping`](alter-ingestion-mapping-command.md) command to change an existing mapping
