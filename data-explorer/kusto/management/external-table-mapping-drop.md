---
title:  .droo external table mapping
description: Learn how to drop an external table mapping for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 04/09/2023
---

# .drop external table mapping

Drops an external table mapping.

## Syntax

`.drop` `external` `table` *ExternalTableName* `mapping` *MappingName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|

## Example

```kusto
.drop external table MyExternalTable mapping "Mapping1" 
```
