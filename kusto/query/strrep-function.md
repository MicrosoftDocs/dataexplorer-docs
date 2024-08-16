---
title:  strrep()
description: Learn how to use the strrep() function to repeat the input value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# strrep()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Replicates a [string](scalar-data-types/string.md) the number of times specified.

## Syntax

`strrep(`*value*`,` *multiplier*`,` [ *delimiter* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The string to replicate. |
| *multiplier* | `int` |  :heavy_check_mark: | The amount of times to replicate the string. Must be a value from 1 to 67108864.|
| *delimiter* | `string` | | The delimeter used to separate the string replications. The default delimiter is an empty string.|

> [!NOTE]
> If *value* or *delimiter* isn't a `string`, they'll be forcibly converted to string.

## Returns

The *value* string repeated the number of times as specified by *multiplier*, concatenated with *delimiter*.

If *multiplier* is more than the maximal allowed value of 1024, the input string will be repeated 1024 times.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgrys+NLy4pUrBVAJJFqQUa6o5Ozuo6CkaaOhBJkCq4pKGRsY6xjrqeOky2JDM3FSFtXKxjpKOuoK4JAHPzDvRdAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print from_str = strrep('ABC', 2), from_int = strrep(123,3,'.'), from_time = strrep(3s,2,' ')
```

**Output**

|from_str|from_int|from_time|
|---|---|---|
|ABCABC|123.123.123|00:00:03 00:00:03|
