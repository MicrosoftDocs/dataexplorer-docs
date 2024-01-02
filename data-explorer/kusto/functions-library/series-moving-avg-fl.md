---
title:  series_moving_avg_fl()
description: This article describes series_moving_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# series_moving_avg_fl()

Applies a moving average filter on a series.

The function `series_moving_avg_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a dynamic numerical array as input and applies on it a [simple moving average](https://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) filter.

## Syntax

`series_moving_avg_fl(`*y_series*`,` *n* [`,` *center* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*|dynamic|&check;|An array cell of numeric values.|
|*n*|int|&check;|The width of the moving average filter.|
|*center*|bool||Indicates whether the moving average is either applied symmetrically on a window before and after the current point or applied on a window from the current point backwards. By default, *center* is `false`.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `series_moving_avg_fl()`, see [Example](#example).

```kusto
let series_moving_avg_fl = (y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate moving average of specified width")
series_moving_avg_fl(y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PsU7EMAyG9zzFPzZS0KnDLUV9BMTAiTVKW7cX0SSV41ZUwLuTcgcTlhfr1/fZnkmQiT1lG9Lm42TdNtlxRotqt7ekGfbogu8NYuOjGPQUhbjpUprb0c2ZtPpQKHU3jZ7/YAOmhZxUdcG1gfBKvwatvtSjOp1KA08/6+E2YjcR0ogzOh/zkQ8Ukg3uje7SWn3iGB9uI+Ia2j6tUSqNFHHxgV7EhQVZaEF9RbfjOb8SF47eheJwIMXY/vd7VTKDs8Gl3KoLwgUghhRtf3Us3/KQTtk1AQAA" target="_blank">Run the query</a>

```kusto
let series_moving_avg_fl = (y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
};
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_fl(num, 5, True)
| render timechart 
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_fl(num, 5, True)
| render timechart 
```

---

**Output**

:::image type="content" source="images/series-moving-avg-fl/moving-average-five-bins.png" alt-text="Graph depicting moving average of 5 bins." border="false":::
