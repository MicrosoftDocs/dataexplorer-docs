---
title:  countof()
description: Learn how to use the countof() function to count the occurrences of a substring in a string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2022
---
# countof()

Counts occurrences of a substring in a string. Plain string matches may overlap; regex matches don't.

## Syntax

`countof(`*source*`,` *search* [`,` *kind*]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source* | `string` |  :heavy_check_mark: | The value to search. |
| *search* | `string` |  :heavy_check_mark: | The value or [regular expression](regex.md) to match inside *source*. |
| *kind* | `string` | | The value `normal` or `regex`. The default is `normal`. |

## Returns

The number of times that the *search* value can be matched in the *source* string. Plain string matches may overlap; regex matches don't.

## Examples

|Function call|Result|
|---|---
|`countof("aaa", "a")`| 3
|`countof("aaaa", "aa")`| 3 (not 2!)
|`countof("ababa", "ab", "normal")`| 2
|`countof("ababa", "aba")`| 2
|`countof("ababa", "aba", "regex")`| 1
|`countof("abcabc", "a.c", "regex")`| 2
