---
title: isnotempty() - Azure Data Explorer
description: This article describes isnotempty() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/09/2022
---
# isnotempty()

Returns `true` if the argument isn't an empty string, and it isn't null.

```kusto
isnotempty("") == false
```

> **Deprecated aliases:** notempty()

## Syntax

`isnotempty(`[*value*]`)`

## Example

```kusto
T
| where isnotempty(fieldName)
| count
```
