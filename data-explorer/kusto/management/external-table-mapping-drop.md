---
title: .alter external table mapping - Azure Data Explorer
description: Learn how to alter an external table mapping for Azure Blob Storage or Azure Data Lake external tables.
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
