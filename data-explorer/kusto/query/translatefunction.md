---
title: translate() - Azure Data Explorer
description: This article describes translate() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# translate()

Replaces a set of characters ('searchList') with another set of characters ('replacementList') in a given a string.
The function searches for characters in the 'searchList' and replaces them with the corresponding characters in 'replacementList'

## Syntax

`translate(`*searchList*`,` *replacementList*`,` *source*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *searchList* | string | &check; | The list of characters that should be replaced.|
| *replacementList* | string | &check; | The list of characters that should replace the characters in *searchList*.|
| *source* | string | &check; | A string to search.|

## Returns

*source* after replacing all ocurrences of characters in 'replacementList' with the corresponding characters in 'searchList'

## Examples

|Input                                 |Output   |
|--------------------------------------|---------|
|`translate("abc", "x", "abc")`        |`"xxx"`  |
|`translate("abc", "", "ab")`          |`""`     |
|`translate("krasp", "otsku", "spark")`|`"kusto"`|
