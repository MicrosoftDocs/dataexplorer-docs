---
title: .drop external table mapping command
description: Learn how to use the `.drop external table mapping` command to drop an external table mapping for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 05/24/2023
---

# .drop external table mapping command

Drops an external table mapping.

## Syntax

`.drop` `external` `table` *ExternalTableName* `mapping` *MappingName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|

## Example

```kusto
.drop external table MyExternalTable mapping "Mapping1" 
```
