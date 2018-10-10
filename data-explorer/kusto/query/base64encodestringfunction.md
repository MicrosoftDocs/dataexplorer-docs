---
title: base64_encodestring() - Azure Data Explorer | Microsoft Docs
description: This article describes base64_encodestring() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
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
