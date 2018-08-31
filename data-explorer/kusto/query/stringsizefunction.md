---
title: string_size() - Azure Kusto | Microsoft Docs
description: This article describes string_size() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# string_size()

Returns the size, in bytes, of the input string.
		
**Syntax**

`string_size(`*source*`)`

**Arguments**

* *source*: The source string that will be measured for string size.

**Returns**

Returns the length, in bytes, of the input string.

**Examples**

```kusto
print string_size("hello")
```

|print_0|
|---|
|5|

```kusto
print string_size("â’¦â’°â’®â’¯â’ª")
```

|print_0|
|---|
|15|