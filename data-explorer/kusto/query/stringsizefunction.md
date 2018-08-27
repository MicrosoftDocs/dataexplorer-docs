---
title: string-size() (Azure Kusto)
description: This article describes string-size() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# string-size()

Returns the size, in bytes, of the input string.
		
**Syntax**

`string-size(`*source*`)`

**Arguments**

* *source*: The source string that will be measured for string size.

**Returns**

Returns the length, in bytes, of the input string.

**Examples**

```kusto
print string-size("hello")
```

|print-0|
|---|
|5|

```kusto
print string-size("â’¦â’°â’®â’¯â’ª")
```

|print-0|
|---|
|15|