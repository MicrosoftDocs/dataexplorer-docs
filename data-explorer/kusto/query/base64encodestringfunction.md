---
title: base64-encodestring() (Azure Kusto)
description: This article describes base64-encodestring() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# base64-encodestring()

Encodes a string as base64 string

**Syntax**

`base64-encodestring(`*String*`)`

**Arguments**

* *String*: Input string to be encoded as base64 string.


**Returns**

Returns the string encoded as base64 string.

**Example**

```kusto
range x from 1 to 1 step 1
| project base64-encodestring("Kusto")
```

|Column1|
|---|
|S3VzdG8=|
