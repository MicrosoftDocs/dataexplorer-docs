---
title:  series_clean_anomalies_fl() - Azure Data Explorer
description: Learn how to use the series_clean_anomalies_fl() function to clean anomalous points in a series.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/14/2023
---
# series_clean_anomalies_fl()

Cleans anomalous points in a series.

The function `series_clean_anomalies_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes a dynamic numerical array as input and another numerical array of anomalies and replaces the anomalies in the input array with interpolated value of their adjacent points.

## Syntax

`series_clean_anomalies_fl(`*y_series*`,` *anomalies*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *y_series* | dynamic | &check; | The input array of numeric values.|
| *anomalies* | dynamic | &check; | The anomalies array containing either 0 for normal points or any other value for anomalous points.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_clean_anomalies_fl()`, see [Example](#example).

```kusto
let series_clean_anomalies_fl = (y_series:dynamic, anomalies:dynamic)
{
    let fnum = array_iff(series_not_equals(anomalies, 0), real(null), y_series);  //  replace anomalies with null values
    series_fill_linear(fnum)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Replace anomalies by interpolated value", skipvalidation = "true")
series_clean_anomalies_fl(y_series:dynamic, anomalies:dynamic)
{
    let fnum = array_iff(series_not_equals(anomalies, 0), real(null), y_series);  //  replace anomalies with null values
    series_fill_linear(fnum)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEAG2OzYrCQBCE74G8Qx8TMJJkQVwkz%2bBB8TqMkxbDTk%2bHmQ4q%2bPBmTPw57LGq66tqiwLUOSXQQKsFpSPM6rJaFeW6qH%2fzTZrYGNHX%2fyM%2fVYy0SKxI%2f6EK6DsMVZrcIepi0uAGagwPTrIc2MF%2brNiJph5Onml%2bQHieCYI91CXB8QbbcEAf2%2fAq6FrQjknbWNnA1K1aNEw9B1TvYzbuLaBcrvMvdPSU%2bWDGonYfRJ3sRL2dJ%2btHEv1s3sxZe4FLJ2fIXhbbgVxovrE0eQDAQen6VwEAAA%3d%3d" target="_blank">Run the query</a>

```kusto
let series_clean_anomalies_fl = (y_series:dynamic, anomalies:dynamic)
{
    let fnum = array_iff(series_not_equals(anomalies, 0), real(null), y_series);  //  replace anomalies with null values
    series_fill_linear(fnum)
}
;
let min_t = datetime(2016-08-29);
let max_t = datetime(2016-08-31);
demo_make_series1
| make-series num=count() on TimeStamp from min_t to max_t step 20m by OsVer
| extend anomalies = series_decompose_anomalies(num, 0.8)
| extend num_c = series_clean_anomalies_fl(num, anomalies)
| render anomalychart with (anomalycolumns=anomalies)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let min_t = datetime(2016-08-29);
let max_t = datetime(2016-08-31);
demo_make_series1
| make-series num=count() on TimeStamp from min_t to max_t step 20m by OsVer
| extend anomalies = series_decompose_anomalies(num, 0.8)
| extend num_c = series_clean_anomalies_fl(num, anomalies)
| render anomalychart with (anomalycolumns=anomalies)
```

---

**Output**

:::image type="content" source="images/series-clean-anomalies-fl/series-clean-anomalies-chart.png" alt-text="Graph of a time series with anomalies before and after cleaning." border="false":::
