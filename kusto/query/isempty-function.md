---
title:  isempty()
description: Learn how to use the isempty() function to check if the argument is an empty string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/03/2023
---
# isempty()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns `true` if the argument is an empty string or is null.

## Syntax

`isempty(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
|*value*| `string` | :heavy_check_mark:| The value to check if empty or null.|

## Returns

A boolean value indicating whether *value* is an empty string or is null.

## Example

|x|isempty(x)|
|---|---|
| "" | true|
|"x" | false|
|parsejson("")|true|
|parsejson("[]")|false|
|parsejson("{}")|false|
