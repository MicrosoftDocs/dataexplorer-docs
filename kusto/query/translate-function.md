---
title:  translate()
description: Learn how to use the translate() function to replace a set of characters with another set of characters in a given string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/27/2023
---
# translate()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Replaces a set of characters ('searchList') with another set of characters ('replacementList') in a given a string.
The function searches for characters in the 'searchList' and replaces them with the corresponding characters in 'replacementList'

## Syntax

`translate(`*searchList*`,` *replacementList*`,` *source*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *searchList* | `string` |  :heavy_check_mark: | The list of characters that should be replaced.|
| *replacementList* | `string` |  :heavy_check_mark: | The list of characters that should replace the characters in *searchList*.|
| *source* | `string` |  :heavy_check_mark: | A string to search.|

## Returns

*source* after replacing all occurrences of characters in 'replacementList' with the corresponding characters in 'searchList'

## Examples

|Input                                 |Output   |
|--------------------------------------|---------|
|`translate("abc", "x", "abc")`        |`"xxx"`  |
|`translate("abc", "", "ab")`          |`""`     |
|`translate("krasp", "otsku", "spark")`|`"kusto"`|
