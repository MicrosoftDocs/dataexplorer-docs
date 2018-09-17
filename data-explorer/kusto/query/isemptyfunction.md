---
title: isempty() - Azure Data Explorer | Microsoft Docs
description: This article describes isempty() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# isempty()

Returns `true` if the argument is an empty string or is null.
    
```kusto
isempty("") == true
```

**Syntax**

`isempty(`[*value*]`)`

**Returns**

Indicates whether the argument is an empty string or isnull.

|x|isempty(x)
|---|---
| "" | true
|"x" | false
|parsejson("")|true
|parsejson("[]")|false
|parsejson("{}")|false

**Example**

```kusto
T
| where isempty(fieldName)
| count
```