---
title:  totimespan()
description: Learn how to use the totimespan() function to convert the input to a `timespan` scalar value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# totimespan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input to a [timespan](scalar-data-types/timespan.md) scalar value.

> **Deprecated aliases:** totime()

> [!NOTE]
> When possible, we recommend using [timespan literals](../query/scalar-data-types/timespan.md#timespan-literals) instead.

## Syntax

`totimespan(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The value to convert to a [timespan](scalar-data-types/timespan.md).|

## Returns

If conversion is successful, result is a [timespan](scalar-data-types/timespan.md) value.
Else, result is null.

## Example

The following example checks whether the input matches the defined timespan. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJL8nMTS0uSMzTUDLQMzCwMjC0MjBQ0lSwtVUAyWgY5mbmaQIAkicpMSwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
totimespan("0.00:01:00") == time(1min)
```

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [timespan datatype](scalar-data-types/timespan.md)
* [make-timespan function](make-timespan-function.md)
