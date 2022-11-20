---
title: binary_or() - Azure Data Explorer
description: This article describes binary_or() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# binary_or()

Returns a result of the bitwise `or` operation of the two values.

## Syntax

`binary_or(`*value1*`,` *value2* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | long | &check; | Left-hand value of the bitwise `OR` operation. |
| *value2* | long | &check; | Right-hand value of the bitwise `OR` operation. |

## Returns

Returns logical OR operation on a pair of numbers: value1 | value2.
