---
title: isempty() - Azure Data Explorer | Microsoft Docs
description: This article describes isempty() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# isempty()

Returns `true` if the argument is an empty string or is null.
    

```
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

```
T
| where isempty(fieldName)
| count
```