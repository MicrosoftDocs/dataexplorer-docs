---
title: binary_and() - Azure Data Explorer
description: This article describes binary_and() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# binary_and()

Returns a result of the bitwise `AND` operation between two values.

## Syntax

`binary_and(`*value1*`,`*value2*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | long | &check; | Left-hand value of the bitwise `AND` operation. |
| *value2* | long | &check; | Right-hand value of the bitwise `AND` operation. |

## Returns

Returns logical `AND` operation on a pair of numbers: value1 & value2.
