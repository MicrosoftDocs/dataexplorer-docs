---
title:  not()
description: Learn how to use the not() function to reverse the value of its boolean argument.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# not()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Reverses the value of its `bool` argument.

## Syntax

`not(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr*|scalar| :heavy_check_mark:|An expression that evaluates to a boolean value. The result of this expression will be reversed.|

## Returns

Returns the reversed logical value of its `bool` argument.

## Example

> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjLL9FIS8wpTtVUsLVVKCkqTQUAozQnchgAAAA=" target="_blank">Run the query</a>

```kusto
print not(false) == true
```

**Output**

|print_0|
|--|
|true|
