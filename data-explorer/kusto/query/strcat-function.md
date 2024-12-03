---
title:  strcat()
description: Learn how to use the strcat() function to concatenate between 1 and 64 arguments.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/28/2024
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

### Concatenated string

The following example uses the `strcat()` function to concatenate the strings provided to form the string, "hello world." The results are assigned to the variable `str`.

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

### Concatenated multi-line string

The following example uses the `strcat()` function to create a concatenated multi-line string which is saved to the variable, `MultiLineString`. It uses the newline character to break the string into new lines.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUfAtzSnJ9MnMSw0uAfLTFWwVikuKkhNLNJRAggqGMXlKOgoQthES21hJEwDpW0wqQAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print MultiLineString = strcat("Line 1\n", "Line 2\n", "Line 3")
```

**Output**


The results show the expanded row with the multiline string.

|MultiLineString|
|---|
|1. "MultiLineString": Line 1<br />2. Line 2<br />3. Line 3|
