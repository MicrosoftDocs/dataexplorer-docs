---
title: point() - Azure Data Explorer | Microsoft Docs
description: This article describes point() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# point()

Returns a dynamic array representation of a point.

**Syntax**

`point(`*latitude*`,`*longitude*`)`

**Arguments**

* *latitude*: Latitude value between -90 and 90.
* *longitude*: Longitude value between -180 and 180.

**Returns**

Returns a dynamic array containing the latitude and longitude values.
If the latitude value is outside [-90, 90] the function returns `null`.
If the longitude value is outside (-180, 180] the value will wrap around.

**Examples**

The following example returns `[1.0, 2.0]`:

```kusto
print point(1, 2)
```

The following example returns `[0.0, -90.0]`:

```kusto
print point(0, 270)
```

The following example returns `null`:

```kusto
print point(91, 0)
```