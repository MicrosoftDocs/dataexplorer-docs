---
title:  replace_string()
description: Learn how to use the replace_string() function to replace all string matches with another string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/07/2025
---
# replace_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Replaces all string matches with a specified string.

> **Deprecated aliases:** replace()

To replace multiple strings, see [replace_strings()](replace-strings-function.md).

## Syntax

`replace_string(`*text*`,` *lookup*`,` *rewrite*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text*| `string` | :heavy_check_mark:|The source string.|
|*lookup*| `string` | :heavy_check_mark:|The string to be replaced.|
|*rewrite*| `string` | :heavy_check_mark:|The replacement string.|

## Returns

Returns the *text* after replacing all matches of *lookup* with evaluations of *rewrite*. Matches don't overlap.

## Examples

### Replace words in a string

The following example uses `replace_string()` to replace the word "cat" with the word "hamster" in the `Message` string.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2MMQrDMBAEe79iucqBgF%2FgIn1CnhAO%2BVCEI52QTpDCj89BvM1usTO1pWJ4SO8cZaUbMscUYC2FHYELbLQC9mnwp%2FrcNNJ0QL4mZcNzWNAsWNGkfjjIqztc4jzhzCm%2FglxCXm%2FO3aTRBVgW3FX3UfGn%2Bg8ZjGaxkAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Message="A magic trick can turn a cat into a dog"
| extend Outcome = replace_string(
        Message, "cat", "hamster")  // Lookup strings
```

**Output**

| Message | Outcome |
|--|--|
| A magic trick can turn a cat into a dog | A magic trick can turn a hamster into a dog |

### Generate and modify a sequence of numbers 

The following example creates a table with column `x` containing numbers from one to five, incremented by one. It adds the column `str` that concatenates  "Number is " with the string representation of the `x` column values using the `strcat()` function. It then adds the `replaced` column where "was" replaces the word "is" in the strings from the `str` column.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0WLOwqAMBBEe08x3RqwsbD0Cl5Boq4hoEnYREzh4d1CsBjmwxuxwTEqdoknepSIAblwQt884Fo4bNplVK22tDRd58ICn0Gd0jr74NpqzI8Lp8OuvI1fmD9IrQP5rEe6bSbzAkZqfYp8AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 5 step 1
| extend str=strcat('Number is ', tostring(x))
| extend replaced=replace_string(str, 'is', 'was')
```

**Output**

| x    | str | replaced|
|---|---|---|
| 1    | Number is 1.000000  | Number was 1.000000|
| 2    | Number is 2.000000  | Number was 2.000000|
| 3    | Number is 3.000000  | Number was 3.000000|
| 4    | Number is 4.000000  | Number was 4.000000|
| 5    | Number is 5.000000  | Number was 5.000000|

## Related content

* To replace multiple strings, see [replace_strings()](replace-strings-function.md).
* To replace strings based on regular expression, see [replace_regex()](replace-regex-function.md).
* To replace a set of characters, see [translate()](translate-function.md).
