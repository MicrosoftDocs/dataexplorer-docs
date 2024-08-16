---
title: .show external table mapping command
description: Learn how to use the `.show external table mapping` command to show external table mappings for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 08/11/2024
---

# .show external table mapping command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Show the mappings for an external table, either the one specified by name or all mappings.

## Syntax

`.show` `external` `table` *ExternalTableName* `mapping` *MappingName*

`.show` `external` `table` *ExternalTableName* `mappings`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|

## Returns

Returns a table containing the mapping name, mapping kind, and new mapping definition of all relevant mappings.

## Example

```kusto
.show external table MyExternalTable mapping "Mapping1" 
```

**Output**

| Name | Kind | Mapping |
|--|--|--|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |
