---
title:  series_periods_detect()
description: Learn how to use the series_periods_detect() function to find the most significant periods that exist in a time series.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/18/2024
---
# series_periods_detect()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds the most significant periods within a time series.

The series_periods_detect() function is useful for detecting periodic patterns in data, such as daily, weekly, or monthly cycles.

## Syntax

`series_periods_detect(`*series*`,` *min_period*`,` *max_period*`,` *num_periods*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values, typically the resulting output of the [make-series](make-series-operator.md) or [make_list](make-list-aggregation-function.md) operators.|
| *min_period* | `real` |  :heavy_check_mark: | The minimal period length for which to search.|
| *max_period* | `real` |  :heavy_check_mark: | The maximal period length for which to search.|
| *num_periods* | `long` |  :heavy_check_mark: | The maximum number of periods to return. This number is the length of the output dynamic arrays.|

> [!IMPORTANT]
>
> * The algorithm can detect periods containing at least 4 points and at most half of the series length.
> * Set the *min_period* a little below and *max_period* a little above the periods you expect to find in the time series. For example, if you have an hourly aggregated signal, and you look for both daily and weekly periods (24 and 168 hours respectively), you can set *min_period*=0.8\*24, *max_period*=1.2\*168, and leave 20% margins around these periods.
> * The input time series must be regular. That is, aggregated in constant bins, which is always the case if it has been created using [make-series](make-series-operator.md). Otherwise, the output is meaningless.

## Returns

The function returns a table with two columns:

* *periods*: A dynamic array containing the periods found, in units of the bin size, ordered by their scores.
* *scores*: A dynamic array containing values between 0 and 1. Each array measures the significance of a period in its respective position in the *periods* array.

## Example

The following query embeds a snapshot of application traffic for one month. The amount of traffic is aggregated twice a day, meaning the bin size is 12 hours. The query produces a line chart clearly showing a pattern in the data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2OvW7DMAyE9z4FRwfwINrW35AnKYJCcITEQaIGgocKyMP3LnY7kDiS95F81qWs0o7nVtJjmbvPYHrRMfYSPISicqEXOyGgrSJGOpCCg5jQibRaVHFiB3C0FAA8Rk53GNPJ77AfyAx/DG6oIeTYN0pltifcuN20dluhfEINvwiRimxgqUze/isMIn+An2vf8b7BZMgGrlKWgXcH3TFVHvLmdPh4ybN+3/K8ys+xpnLJHUyp1tS+7rlc1mvXDvAimgjcNZdzrnJfSp6vqa6/5GXgcmIBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print y=dynamic([80, 139, 87, 110, 68, 54, 50, 51, 53, 133, 86, 141, 97, 156, 94, 149, 95, 140, 77, 61, 50, 54, 47, 133, 72, 152, 94, 148, 105, 162, 101, 160, 87, 63, 53, 55, 54, 151, 103, 189, 108, 183, 113, 175, 113, 178, 90, 71, 62, 62, 65, 165, 109, 181, 115, 182, 121, 178, 114, 170])
| project x=range(1, array_length(y), 1), y  
| render linechart
```

:::image type="content" source="media/series-periods/series-periods.png" alt-text="Series periods.":::

Let's run `series_periods_detect()` on the same series to identify the recurring patterns. The query returns the two most significant periods within the defined period range. This means the function considers all possible period lengths between 0 and 25 days and search for patterns within those ranges. The returned periods represent the two most prominent cycles or patterns detected in the data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA01Qy26DMBC89yt8BAlFXsCvQ76kihAKVkKUEmQ41FI+vjNAqx52Pbs7s7PynMZpVfk85Kn/Gq/Fp9eVkiZUyjsAQWV9pUyLADaCaMhA8hagRSeQalCFlh2IgyGAwGFk5RBj2rpD7Gpq6l8NPERTZNnXQqT3I2yzexqzrxAeIZpX+EBErWcpTM78IQwCbwCfa7fYPJg0tZ6rhKWnby2HTIRGTl/Kj7ea0+sRr6v6Pqd+usUCpD6lPnfPON3We5FLcBFZqX/sJaYxLt2M5zUs3RBXdItcKX3iX2y5Ln8A3Zvs/YABAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print y=dynamic([80, 139, 87, 110, 68, 54, 50, 51, 53, 133, 86, 141, 97, 156, 94, 149, 95, 140, 77, 61, 50, 54, 47, 133, 72, 152, 94, 148, 105, 162, 101, 160, 87, 63, 53, 55, 54, 151, 103, 189, 108, 183, 113, 175, 113, 178, 90, 71, 62, 62, 65, 165, 109, 181, 115, 182, 121, 178, 114, 170])
| project x=range(1, array_length(y), 1), y  
| project series_periods_detect(y, 0.0, 50.0, 2)
```

**Output**

| series\_periods\_detect\_y\_periods  | series\_periods\_detect\_y\_periods\_scores |
|-------------|-------------------|
| [14, 0] | [0.84, 0]  |

The value in series\_periods\_detect\_y\_periods\_scores is truncated.

> [!NOTE]
> There is also a daily pattern visible in the chart, but this is not returned by the query because the sampling is too coarse (12h bin size). A daily period of 2 bins is below the minimum period size of 4 points, required by the algorithm.

## Related content

* [Regular expressions](/dotnet/standard/base-types/regular-expression-language-quick-reference)
* [series_periods_validate()](series-periods-validate-function.md)
