---
title:  stdevif() (aggregation function)
description: Learn how to use the stdevif() function to calculate the standard deviation of an expression where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# stdevif() (aggregation function)

Calculates the [standard deviation](stdev-aggregation-function.md) of *expr* in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`stdevif(`*expr*`,`*predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the standards deviation aggregation calculation. |
| *predicate* | `string` |  :heavy_check_mark: | The predicate that has to evaluate to `true` in order for *expr* to be added to the result. |

## Returns

Returns the standard deviation value of *expr* in records for which *predicate* evaluates to `true`.

## Example

The following example shows the standard deviation in a range of 1 to 100.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0MFAoLkktUDDkqlEoLs3NTSzKrEoFCqWklmWmaVToAFWrKhgp2NoqGGgCABZzSGU/AAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 100 step 1
| summarize stdevif(x, x % 2 == 0)
```

**Output**

|stdevif_x|
|---|
|29.1547594742265|
