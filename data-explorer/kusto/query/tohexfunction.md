---
title: tohex() - Azure Data Explorer
description: This article describes tohex() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/05/2023
---
# tohex()

Converts input to a hexadecimal string.

## Syntax

`tohex(`*value*`,` [`,` *minLength* ]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | int or long | &check; | The value that will be converted to a hex string.|
| *minLength* | int | | The value representing the number of leading characters to include in the output.  Values between 1 and 16 are supported. Values greater than 16 will be truncated to 16. If the string is longer than *minLength* without leading characters, then *minLength* is effectively ignored. Negative numbers may only be represented at minimum by their underlying data size, so for an integer (32-bit) the *minLength* will be at minimum 8, for a long (64-bit) it will be at minimum 16.|

## Returns

If conversion is successful, result will be a string value.
If conversion is not successful, result will be `null`.

## Examples

```kusto
tohex(256) == '100'
tohex(-256) == 'ffffffffffffff00' // 64-bit 2's complement of -256
tohex(toint(-256), 8) == 'ffffff00' // 32-bit 2's complement of -256
tohex(256, 8) == '00000100'
tohex(256, 2) == '100' // Exceeds min length of 2, so min length is ignored.
```
