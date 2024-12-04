---
title:  replace_regex()
description: Learn how to use the replace_regex() function to replace all regex matches with another string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/04/2024
---
# replace_regex()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Replaces all [regular expression](regex.md) matches with a specified pattern.

> **Deprecated aliases:** replace()

## Syntax

`replace_regex(`*source*`,`*lookup_regex*`,` *rewrite_pattern*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| `string` |  :heavy_check_mark: | The text to search and replace.|
| *lookup_regex*| `string` |  :heavy_check_mark: | The [regular expression](regex.md) to search for in *text*. The expression can contain capture groups in parentheses. To match over multiple lines, use the `m` or `s` flags. For more information on flags, see [Grouping and flags](./regex.md#grouping-and-flags) |
| *rewrite_pattern*| `string` |  :heavy_check_mark: | The replacement regex for any match made by *matchingRegex*. Use `\0` to refer to the whole match, `\1` for the first capture group, `\2` and so on for subsequent capture groups.|

## Returns

Returns the *source* after replacing all matches of *lookup_regex* with evaluations of *rewrite_pattern*. Matches do not overlap.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5KpRSK0oSc1LAfKLbIE4ObFEQ92vNDcptUghs1hBXQeoGiicmZeuUaGpiVBelFqQk5icmmILZcQXpaanVmgAleooOKgDdWrEpGhrqoM45YnFVgoxhuqaAA84qqaHAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 5 step 1
| extend str=strcat('Number is ', tostring(x))
| extend replaced=replace_regex(str, @'is (\d+)', @'was: \1')
```

**Output**

| x | str | replaced|
|---|---|---|
| 1    | Number is 1.000000  | Number was: 1.000000|
| 2    | Number is 2.000000  | Number was: 2.000000|
| 3    | Number is 3.000000  | Number was: 3.000000|
| 4    | Number is 4.000000  | Number was: 4.000000|
| 5    | Number is 5.000000  | Number was: 5.000000|

## Related content

* To replace a single string, see [replace_string()](replace-string-function.md).
* To replace multiple strings, see [replace_strings()](replace-strings-function.md).
* To replace a set of characters, see [translate()](translate-function.md).
