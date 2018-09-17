---
title: translate() - Azure Data Explorer | Microsoft Docs
description: This article describes translate() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# translate()

Replaces a set of characters ('searchList') with another set of characters ('replacementList') in a given a string.
The function searches for characters in the 'searchList' and replaces them with the corresponding characters in 'replacementList'

**Syntax**

`translate(`*searchList*`,` *replacementList*,` *text*`)`

**Arguments**

* *searchList*: The list of characters that should be replaced
* *replacementList*: The list of characters that should replace the characters in 'searchList'
* *text*: A string to search

**Returns**

*text* after replacing all ocurrences of characters in 'replacementList' with the corresponding characters in 'searchList'

**Examples**

|||
|---|---
|`translate("abc", "x", "abc")`| "xxx" 
|`translate("abc", "", "ab")`| ""
|`translate("krasp", "otsku", "spark")`| "kusto"
    