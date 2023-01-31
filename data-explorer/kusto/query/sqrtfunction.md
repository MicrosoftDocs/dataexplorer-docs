---
title: sqrt() - Azure Data Explorer
description: This article describes sqrt() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# sqrt()

Returns the square root function.  

## Syntax

`sqrt(`*number*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | int, long, or real | &check; | The number for which to calculate the square root.|

## Returns

* A positive number such that `sqrt(x) * sqrt(x) == x`
* `null` if the argument is negative or cannot be converted to a `real` value.
