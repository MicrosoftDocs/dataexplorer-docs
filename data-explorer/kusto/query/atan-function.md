---
title:  atan()
description: Learn how to use the atan() function to return the inverse operation of tan().
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/03/2022
---
# atan()

Returns the angle whose tangent is the specified number. This is the inverse operation of [`tan()`](tan-function.md).

## Syntax

`atan(`*x*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The number used to calculate the arc tangent.|

## Returns

The value of the arc tangent of `x`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbFNLEnM0zDQM9UEACNi3wIWAAAA" target="_blank">Run the query</a>

```kusto
atan(0.5)
```

**Output**

|result|
|---|
|0.46364760900080609|
