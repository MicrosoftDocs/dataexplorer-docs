---
title:  strcat()
description: Learn how to use the strcat() function to concatenate between 1 and 64 arguments.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# strcat()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Concatenates between 1 and 64 arguments.

## Syntax

`strcat(`*argument1*`,` *argument2* [`,` *argument3* ... ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *argument1* ... *argumentN* | scalar |  :heavy_check_mark: | The expressions to concatenate.|

> [!NOTE]
> If the arguments aren't of string type, they'll be forcibly converted to string.

## Returns

The arguments concatenated to a single string.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSguKVKwBZHJiSUaShmpOTn5SjoKSgogojy/KCdFSRMA4dg7JykAAAA=" target="_blank">Run the query</a>
::: moniker-end
  
```kusto
print str = strcat("hello", " ", "world")
```

**Output**

|str|
|---|
|hello world|
