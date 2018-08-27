---
title: trim-start() (Azure Kusto)
description: This article describes trim-start() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# trim-start()

Removes leading match of the specified regular expression.

**Syntax**

`trim-start(`*regex*`,` *text*`)`

**Arguments**

* *regex*: String or [regular expression](re2.md) to be trimmed from the beginning of *text*.  
* *text*: A string.

**Returns**

*text* after trimming match of *regex* found in the beginning of *text*.

**Example**

Statement bellow trims *substring*  from the start of *string-to-trim*:

```kusto
let string-to-trim = @"http://bing.com";
let substring = "http://";
range x from 1 to 1 step 1
| project string-to-trim = string-to-trim,trimmed-string = trim-start(substring,string-to-trim)
```

|string-to-trim|trimmed-string|
|---|---|
|http://bing.com|bing.com|

Next statement trims all non-word characters from the beginning of the string:

```kusto
range x from 1 to 5 step 1
| project str = strcat("-  ","Te st",x,@"// $")
| extend trimmed-str = trim-start(@"[^\w]+",str)
```

|str|trimmed-str|
|---|---|
|-  Te st1// $|Te st1// $|
|-  Te st2// $|Te st2// $|
|-  Te st3// $|Te st3// $|
|-  Te st4// $|Te st4// $|
|-  Te st5// $|Te st5// $|

 