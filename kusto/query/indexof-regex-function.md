---
title:  indexof_regex()
description: Learn how to use the indexof_regex() function to return the zero-based index position of a `regex` input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# indexof_regex()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the zero-based index of the first occurrence of a specified lookup [regular expression](re2.md) within the input string.

See [`indexof()`](indexof-function.md).

## Syntax

`indexof_regex(`*string*`,`*match*`[,`*start*`[,`*length*`[,`*occurrence*`]]])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*string*| `string` |  :heavy_check_mark: | The source string to search.|  
|*match*| `string` |  :heavy_check_mark: | The [regular expression](re2.md) lookup string.|
|*start*| `int` | | The search start position. A negative value will offset the starting search position from the end of the *string* by this many steps: `abs(`*start*`)`. |
|*length*| `int` | | The number of character positions to examine. A value of -1 means unlimited length.|
|*occurrence*| `int` | | The number of the occurrence. The default is 1.|

## Returns

The zero-based index position of *match*.

* Returns -1 if *match* isn't found in *string*.
* Returns `null` if:
  * *start* is less than 0.
  * *occurrence* is less than 0.
  * *length* is less than -1.

> [!NOTE]
>
> * Overlapping matches lookup aren't supported.
> * Regular expression strings may contain characters that require either escaping or using @'' string-literals.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42Qy07DMBBF93zFVTalkqGkwIIFEj/AN1QTe+JYGDvyo8qCj2dSatjwsmd3Nef4ek4ulAvIcWbp8QgXDC9xPCS2vFx2NGiZTuGpo2vdbRV2O/gYX+qMMdZgZEFmrgW5CMs21v4nluHRfvIUbhQeFPYC/i/59s9XKvQKV/0XtkyceJMRIjLrKOyodU2Jg+ZVI7kElPSERMFyU919p5JLZxV9FGgqMT1T0RNnmBg2BfHIydOMHDFW71s9TWs48Llns93/XuyNhm51bU+VXDiSd0b+hlI5nNZAydZXDuUd3NbxhNUBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print
    idx1 = indexof_regex("abcabc", @"a.c"), // lookup found in input string
    idx2 = indexof_regex("abcabcdefg", @"a.c", 0, 9, 2),  // lookup found in input string
    idx3 = indexof_regex("abcabc", @"a.c", 1, -1, 2),  // there's no second occurrence in the search range
    idx4 = indexof_regex("ababaa", @"a.a", 0, -1, 2), // Matches don't overlap so full lookup can't be found 
    idx5 = indexof_regex("abcabc", @"a|ab", -1)  // invalid start argument
```

**Output**

|idx1|idx2|idx3|idx4|idx5|
|----|----|----|----|----|
|0   |3   |-1  |-1  |    |
