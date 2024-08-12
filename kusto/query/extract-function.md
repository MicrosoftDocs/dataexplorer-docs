---
title:  extract()
description: Learn how to use the extract() function to get a match for a regular expression from a source string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# extract()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Get a match for a [regular expression](re2.md) from a source string.

Optionally, convert the extracted substring to the indicated type.

## Syntax

`extract(`*regex*`,` *captureGroup*`,` *source* [`,` *typeLiteral*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *regex* | `string` |  :heavy_check_mark: | A [regular expression](re2.md).|
| *captureGroup* | `int` |  :heavy_check_mark: | The capture group to extract. 0 stands for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, and 2 or more for subsequent parentheses.|
| *source* | `string` |  :heavy_check_mark:| The string to search.|
| *typeLiteral* | `string` | | If provided, the extracted substring is converted to this type. For example, `typeof(long)`.

## Returns

If *regex* finds a match in *source*: the substring matched against the indicated capture group *captureGroup*, optionally converted to *typeLiteral*.

If there's no match, or the type conversion fails: `null`.

## Examples

The example string `Trace` is searched for a definition for `Duration`.
The match is converted to `real`, then multiplied it by a time constant (`1s`) so that `Duration` is of type `timespan`. In this example, it's equal to 123.45 seconds:

```kusto
T
| extend Trace="A=1, B=2, Duration=123.45, ..."
| extend Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s) 
```

This example is equivalent to `substring(Text, 2, 4)`:

```kusto
extract("^.{2,2}(.{4,4})", 1, Text)
```

## Related content

* [extract-all function](extract-all-function.md)
* [extract-json function](extract-json-function.md)
* [parse operator](parse-operator.md)
