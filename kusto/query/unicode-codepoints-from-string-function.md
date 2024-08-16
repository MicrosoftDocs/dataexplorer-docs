---
title:  unicode_codepoints_from_string()
description: Learn how to use the unicode_codepoints_from_string() function to return a dynamic array of the Unicode codepoints of the input string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# unicode_codepoints_from_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a dynamic array of the Unicode codepoints of the input string. This function is the inverse operation of [`unicode_codepoints_to_string()`](unicode-codepoints-to-string-function.md) function.

> **Deprecated aliases:** to_utf8()

## Syntax

`unicode_codepoints_from_string(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The source string to convert. |

## Returns

Returns a dynamic array of the Unicode codepoints of the characters that make up the string provided to this function.
See [`unicode_codepoints_to_string()`](unicode-codepoints-to-string-function.md))

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvce69202ceceed490b88d.northeurope/databases/Other?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVSjNy0zOT0mNBxEF+UDx4vi0ovzc+OISoKJ0DaVHk5Y9mrTh0aR1jyatfzRplZImADy1iJs9AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = unicode_codepoints_from_string("⒦⒰⒮⒯⒪")
```

**Output**

|arr|
|---|
|[9382, 9392, 9390, 9391, 9386]|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvce69202ceceed490b88d.northeurope/databases/Other?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVSjNy0zOT0mNBxEF+UDx4vi0ovzc+OISoKJ0DaXry69Pvb7w+ozrUxV0FbxLi0vylTQBiYjgf0AAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = unicode_codepoints_from_string("קוסטו - Kusto")
```

**Output**

|arr|
|---|
|[1511, 1493, 1505, 1496, 1493, 32, 45, 32, 75, 117, 115, 116, 111]|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvce69202ceceed490b88d.northeurope/databases/Other?query=H4sIAAAAAAAAAysoyswrUSguKVKwVSjNy0zOT0mNBxEF+UDx4viS/HigXGZeugYWybSi/FyYtJJ3aXFJvpKmJgA5JJpZUQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print str = unicode_codepoints_to_string(unicode_codepoints_from_string("Kusto"))
```

**Output**

|str|
|---|
|Kusto|
