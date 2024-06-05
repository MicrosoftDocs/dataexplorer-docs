---
title: .alter external table mapping command
description: Learn how to use the `.alter external table mapping` command to alter an external table mapping for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 05/24/2023
---

# .alter external table mapping command

Alters an existing external table mapping. For more information, see [Data mappings](mappings.md).

## Syntax

`.alter` `external` `table` *ExternalTableName* `mapping` *MappingName* *MappingInJsonFormat*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|
|*MappingInJsonFormat*|The mapping definition in JSON format.|

## Returns

Returns a table containing the mapping name, mapping kind, and new mapping definition.

## Example

```kusto
.alter external table MyExternalTable mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Output**

| Name | Kind | Mapping |
|--|--|--|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |
