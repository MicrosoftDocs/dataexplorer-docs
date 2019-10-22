---
title: isnull() - Azure Data Explorer | Microsoft Docs
description: This article describes isnull() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/21/2019

---
# isnull()

Evaluates its sole argument and returns a `bool` value indicating if the argument evaluates to a null value.

```kusto
isnull(parse_json("")) == true
```

**Syntax**

`isnull(`*Expr*`)`

**Returns**

True or false depending on the whether the value is null or not null.

**Notes**

* `string` values cannot be null. Use [isempty](./isemptyfunction.md)
  to determine if a value of type `string` is empty or not.

|x                |`isnull(x)`|
|-----------------|-----------|
|`""`             |`false`    |
|`"x"`            |`false`    |
|`parse_json("")`  |`true`     |
|`parse_json("[]")`|`false`    |
|`parse_json("{}")`|`false`    |

**Example**

```kusto
T | where isnull(PossiblyNull) | count
```