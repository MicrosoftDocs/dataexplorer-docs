---
title:  series_outliers() - Azure Data Explorer
description: Learn how to use the series_outliers() function to score anomaly points in a series.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/15/2023
---
# series_outliers()

Scores anomaly points in a series.

The function takes an expression with a dynamic numerical array as input, and generates a dynamic numeric array of the same length. Each value of the array indicates a score of a possible anomaly, using ["Tukey's test"](https://en.wikipedia.org/wiki/Outlier#Tukey's_fences). A value greater than 1.5 in the same element of the input indicates a rise or decline anomaly. A value less than -1.5, indicates a decline anomaly.

## Syntax

`series_outliers(`*series* [`,` *kind* ] [`,` *ignore_val* ] [`,` *min_percentile* ] [`,` *max_percentile* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | dynamic | &check; | An array of numeric values.|
| *kind* | string | | The algorithm to use for outlier detection. The supported options are `"tukey"`, which is traditional "Tukey", and  `"ctukey"`, which is custom "Tukey". The default is `"ctukey"`.|
| *ignore_val* | int, long, or real | | A numeric value indicating the missing values in the series. The default is `double(`*null*`)`. The score of nulls and ignore values is set to `0`.|
| *min_percentile* | int, long, or real | | The minimum percentile to use to calculate the normal inter-quantile range. The default is 10. The value must be in the range `[2.0, 98.0]`. This parameter is only relevant for the `"ctukey"` *kind*.|
| *max_percentile* | int, long, or real | | The maximum percentile to use to calculate the normal inter-quantile range. The default is 90. The value must be in the range `[2.0, 98.0]`. This parameter is only relevant for the `"ctukey"` *kind*.|

The following table describes differences between `"tukey"` and `"ctukey"`:

| Algorithm | Default quantile range | Supports custom quantile range |
|-----------|----------------------- |--------------------------------|
| `"tukey"` | 25% / 75%              | No                             |
| `"ctukey"`| 10% / 90%              | Yes                            |

> [!TIP]
> The best way to use this function is to apply it to the results of the [make-series](make-series-operator.md) operator.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEAF2Q0U6EMBBF3038h%2bsb7KILu%2bob30ImMCyNtMXpoGD8eLvLYtCkaTrT2zP3VsidGRNa8RY51OP0%2boygPKDA%2fd03eFJ2DRQlGlJWYzk55sfTY17ElWKPotlNG%2bUclUKuSVLsUOT%2fbkzbJtY77Xw7M0miKR5KbDuD8Edspxnm%2fTGPe4rDAWd2LHE%2bCIHs0DMCi%2bGAT6Md%2fKi9YQkgRWskaPQ6w7dgqruFfvERRmtJzBdf41h646o3QeO0bMVt23O6Mb%2bOKBdhtdbJUm%2blgw8VOW%2bpX4gkQnN1SX57exaOUaTi95H6kKyoDMXTS7RSZMivPIk0Fiysue5I9Jo3mWrfj9aVGr9nOa6%2bsl%2f1rf3HTKT%2bAI%2bfv2rxAQAA" target="_blank">Run the query</a>

```kusto
range x from 0 to 364 step 1 
| extend t = datetime(2023-01-01) + 1d*x
| extend y = rand() * 10
| extend y = iff(monthofyear(t) != monthofyear(prev(t)), y+20, y) // generate a sample series with outliers at first day of each month
| summarize t = make_list(t), series = make_list(y)
| extend outliers=series_outliers(series)
| extend pos_anomalies = array_iff(series_greater_equals(outliers, 1.5), 1, 0)
| render anomalychart with(xcolumn=t, ycolumns=series, anomalycolumns=pos_anomalies)
```

:::image type="content" source="media/series-outliersfunction/series-outliers.png" alt-text="Chart of a time series with outliers." border="false":::
