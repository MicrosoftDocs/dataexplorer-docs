---
title: .show ingestion mappings - Azure Data Explorer
description: This article describes .show ingestion mappings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/01/2023
---
# .show ingestion mapping

Use this command to view a specific ingestion mapping, or all ingestion mappings, for a database or table.

## Syntax

View a specific mapping:

`.show` [`table`|`database`] *EntityName* `ingestion` *MappingKind* `mapping` *MappingName*

View all mappings or all mappings of a specific type:

`.show` [`table`|`database`] *EntityName* `ingestion` [ *MappingKind* ] `mappings`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityName*|string|&check;|The name of the table or database for which to show the ingestion mapping(s).|
|*MappingKind*|string||The type of mapping(s) to view. Possible values: `csv`, `json`, `avro`, `w3clogfile`, `parquet`, and `orc`.|
|*MappingName*|string||The name of the mapping to view. This argument is required if you specify that you want to view a single `mapping` instead of multiple `mappings` for the entity. See [syntax options](#syntax).|

## Returns

The command returns a table with the columns `Name`, `Kind`, and `Mapping` that describe the ingestion mapping(s) names, types, and specifications.

## Example

### Show a specific ingestion mapping

```kusto
.show table MyTable ingestion csv mapping "mapping1" 
```

**Output**

| Name     | Kind | Mapping     |
|----------|------|-------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |

If the table only contained one CSV mapping named "mapping1", the following query would return the same output as the previous query.

```kusto
// Specify the mapping type only
.show table MyTable ingestion csv mappings 
```

## Show all mappings for a table

```kusto
.show table MyTable ingestion mappings
```

## Show all csv mappings for a database

```kusto
.show database MyDatabase ingestion csv mappings
```

## See also

* Learn more about [data mappings](mappings.md)
* Use [.create ingestion mapping](create-ingestion-mapping-command.md) to create a new mapping
* Use [.alter ingestion mapping](alter-ingestion-mapping-command.md) to change an existing mapping
