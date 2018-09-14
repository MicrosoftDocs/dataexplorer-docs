---
title: base64_encodestring() - Azure Kusto | Microsoft Docs
description: This article describes base64_encodestring() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# base64_encodestring()

Encodes a string as base64 string

**Syntax**

`base64_encodestring(`*String*`)`

**Arguments**

* *String*: Input string to be encoded as base64 string.

**Returns**

Returns the string encoded as base64 string.

**Example**

```kusto
print Quine=base64_encodestring("Kusto")
```

|Quine   |
|--------|
|S3VzdG8=|
