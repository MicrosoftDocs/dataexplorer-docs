---
title: todatetime() - Azure Data Explorer | Microsoft Docs
description: This article describes todatetime() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# todatetime()

Converts input to [datetime](./scalar-data-types/datetime.md) scalar.

```kusto
todatetime("2015-12-24") == datetime(2015-12-24)
```

**Syntax**

`todatetime(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to [datetime](./scalar-data-types/datetime.md). 

**Returns**

If conversion is successful, result will be a [datetime](./scalar-data-types/datetime.md) value.
If conversion is not successful, result will be null.
 
*Note*: Prefer using [datetime()](./scalar-data-types/datetime.md) when possible.