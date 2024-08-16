---
title:  substring()
description: Learn how to use the substring() function to extract a substring from the source string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# substring()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Extracts a substring from the source string starting from some index to the end of the string.

Optionally, the length of the requested substring can be specified.

## Syntax

`substring(`*source*`,` *startingIndex* [`,` *length*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source* | `string` |  :heavy_check_mark: | The string from which to take the substring.|
| *startingIndex* | `int` |  :heavy_check_mark: | The zero-based starting character position of the requested substring. If a negative number, the substring will be retrieved from the end of the source string.|
| *length* | `int` | | The requested number of characters in the substring. The default behavior is to take from *startingIndex* to the end of the *source* string.|

## Returns

A substring from the given string. The substring starts at startingIndex (zero-based) character position and continues to the end of the string or length characters if specified.

## Examples

```kusto
substring("123456", 1)        // 23456
substring("123456", 2, 2)     // 34
substring("ABCD", 0, 2)       // AB
substring("123456", -2, 2)    // 56
```
