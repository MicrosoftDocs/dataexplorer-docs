---
title: .show ingestion mappings - Azure Data Explorer
description: This article describes .show ingestion mappings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/01/2023
---
# .show ingestion mapping

Use this command to view the ingestion mapping(s) for a database or table.

## Syntax

Use the following syntax to view a specific mapping based on the mapping name.

`.show` [`table`|`database`] *EntityName* `ingestion` `mapping` *MappingName*

Use the following syntax to view all mappings of a certain type or all mappings for the specified table or database.

`.show` [`table`|`database`] *EntityName* `ingestion` [ *MappingKind* ] `mappings`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityName*|string|&check;|The name of the table or database for which to view the ingestion mapping(s).|
|*MappingName*|string|&check;|The name of the mapping to view. This argument is only required if you specify that you want to view a single `mapping` instead of multiple `mappings` for the entity. See [syntax options](#syntax).|
|*MappingKind*|string||The type of mappings to view. The options are `CSV`, `JSON`, `AVRO`, `W3CLOGFILE`, `Parquet`, and `ORC`. If unspecified, all mappings are returned.|

## Returns

The command returns a table with the columns `Name`, `Kind`, and `Mapping` that describe the ingestion mapping(s) names, types, and specifications.

## Example

For a table that only contains one CSV mapping named "mapping1", the following two queries would both return the same output.

```kusto
// Specify the mapping name
.show table MyTable ingestion csv mapping "mapping1" 

// Specify the mapping type only
.show table MyTable ingestion csv mappings 
```

**Output**

| Name     | Kind | Mapping     |
|----------|------|-------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
