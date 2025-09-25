---
title: Time Series Analysis - Trends, Anomalies, and Monitoring
description: Gain insights into time series analysis with KQL, from creating time series to advanced anomaly detection and trend analysis for monitoring solutions.
ms.reviewer: adieldar
ms.topic: how-to
ms.date: 09/25/2025
---
# Time series analysis

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Cloud services and IoT devices generate telemetry you can use to gain insights into service health, production processes, and usage trends. Time series analysis helps you identify deviations from typical baseline patterns.

Kusto Query Language (KQL) has native support for creating, manipulating, and analyzing multiple time series. This article shows how to use KQL to create and analyze thousands of time series in seconds to enable near real-time monitoring solutions and workflows.

## Time series creation

Create a large set of regular time series using the `make-series` operator and fill in missing values as needed.
Partition and transform the telemetry table into a set of time series. The table usually contains a timestamp column, contextual dimensions, and optional metrics. The dimensions are used to partition the data. The goal is to create thousands of time series per partition at regular time intervals.

The input table *demo_make_series1* contains 600K records of arbitrary web service traffic. Use the following command to sample 10 records:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2Pz03MTo0vTi3KTC02VKhRKAFyFQwNADOyzKUbAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_make_series1 | take 10 
```

The resulting table contains a timestamp column, three contextual dimension columns, and no metrics:

| TimeStamp | BrowserVer | OsVer | Country/Region |
| --- | --- | --- | --- |
| 2016-08-25 09:12:35.4020000 | Chrome 51.0 | Windows 7 | United Kingdom |
| 2016-08-25 09:12:41.1120000 | Chrome 52.0 | Windows 10 |   |
| 2016-08-25 09:12:46.2300000 | Chrome 52.0 | Windows 7 | United Kingdom |
| 2016-08-25 09:12:46.5100000 | Chrome 52.0 | Windows 10 | United Kingdom |
| 2016-08-25 09:12:46.5570000 | Chrome 52.0 | Windows 10 | Republic of Lithuania |
| 2016-08-25 09:12:47.0470000 | Chrome 52.0 | Windows 8.1 | India |
| 2016-08-25 09:12:51.3600000 | Chrome 52.0 | Windows 10 | United Kingdom |
| 2016-08-25 09:12:51.6930000 | Chrome 52.0 | Windows 7 | Netherlands |
| 2016-08-25 09:12:56.4240000 | Chrome 52.0 | Windows 10 | United Kingdom |
| 2016-08-25 09:13:08.7230000 | Chrome 52.0 | Windows 10 | India |

Because there are no metrics, build time series representing the traffic count, partitioned by OS:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5XPsQrCQBAE0D5fMWVSCFpLvsFCsQ1rsiGHt3dhbw%2Bi5ONNMAhiZTkw%2B5j1bBAXGkMNi6klT1p2LLERunOTWB2nA2akLELqnrzWy4sTPhvJWFXHwq8GTX8ZNH0bP%2FVixhp374iQpW5jDlZW6Lin7K3eIwZ8FPQaZfvF4jYoGY84DLg9cEpX1kVVDh0rbLlrB1J7AQhHbUsCAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp from min_t to max_t step 1h by OsVer
| render timechart 
```

- Use the [`make-series`](make-series-operator.md) operator to create three time series, where:
  - `num=count()`: traffic count.
  - `from min_t to max_t step 1h`: creates the time series in one hour bins from the table's oldest to newest timestamp.
  - `default=0`: specifies the fill method for missing bins to create regular time series. Alternatively, use [`series_fill_const()`](series-fill-const-function.md), [`series_fill_forward()`](series-fill-forward-function.md), [`series_fill_backward()`](series-fill-backward-function.md), and [`series_fill_linear()`](series-fill-linear-function.md) for different fill behavior.
  - `by OsVer`: partitions by OS.
- The time series data structure is a numeric array of aggregated values for each time bin. Use `render timechart` for visualization.

The table above has three partitions (Windows 10, Windows 7, and Windows 8.1). The chart shows a separate time series for each OS version:

:::image type="content" source="media/time-series-analysis/time-series-partition.png" alt-text="Screenshot of a time series chart with separate lines for Windows 10, Windows 7, and Windows 8.1." lightbox="media/time-series-analysis/time-series-partition.png":::

## Time series analysis functions

In this section, we'll perform typical series processing functions. Once a set of time series is created, KQL supports a growing list of functions to process and analyze them. We'll describe a few representative functions for processing and analyzing time series.

### Filtering

Filtering is a common practice in signal processing and useful for time series processing tasks (for example, smooth a noisy signal, change detection).

- There are two generic filtering functions:
  - [`series_fir()`](series-fir-function.md): Applying FIR filter. Used for simple calculation of moving average and differentiation of the time series for change detection.
  - [`series_iir()`](series-iir-function.md): Applying IIR filter. Used for exponential smoothing and cumulative sum.
- `Extend` the time series set by adding a new moving average series of size 5 bins (named *ma_num*) to the query:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPwWrEMAxE7%2FsVc7QhhebQ05Jv6KGlV6MmCmsa2UGWIVv24%2BuQZaH01Itg0MzTaGGDxBQMAyyXkRZSN7HkIPTFobBGLj1uKFWENH7zbnfvUfjNSFbvz6dlZ9D2LwZtvxl%2F7Kcbdvl0SKQqw5hrMucx8Ux1seEZOeFBwaxZ7r9Yvhcqxiv6Cz6veC0frI3Km3Ga2j7szAMf5qiuyQ7KK5O5vsOL72Ba%2BZi%2BJbXlWGHt4nghtR%2FaGr7%2BPAEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp from min_t to max_t step 1h by OsVer
| extend ma_num=series_fir(num, repeat(1, 5), true, true)
| render timechart
```

:::image type="content" source="media/time-series-analysis/time-series-filtering.png" alt-text="Time series filtering."lightbox="media/time-series-analysis/time-series-filtering.png":::

### Regression analysis

A segmented linear regression analysis can be used to estimate the trend of the time series.

- Use [series_fit_line()](series-fit-line-function.md) to fit the best line to a time series for general trend detection.
- Use [series_fit_2lines()](series-fit-2lines-function.md) to detect trend changes, relative to the baseline, that are useful in monitoring scenarios.

Example of `series_fit_line()` and  `series_fit_2lines()` functions in a time series query:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2PL04tykwtNuKqUUitKEnNS1GACMSnZZbEG+Vk5qUWa1Rq6iCLggSBYkAdRUD1qUUKIIHkjMSiEoXyzJIMjYrk/JzS3DzbCk0AUIIJ02EAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_series2
| extend series_fit_2lines(y), series_fit_line(y)
| render linechart with(xcolumn=x)
```

:::image type="content" source="media/time-series-analysis/time-series-regression.png" alt-text="Time series regression."lightbox="media/time-series-analysis/time-series-regression.png":::

- Blue: original time series
- Green: fitted line
- Red: two fitted lines

> [!NOTE]
> The function accurately detected the jump (level change) point.

### Seasonality detection

Many metrics follow seasonal (periodic) patterns. User traffic of cloud services usually contains daily and weekly patterns that are highest around the middle of the business day and lowest at night and over the weekend. IoT sensors measure in periodic intervals. Physical measurements such as temperature, pressure, or humidity may also show seasonal behavior.

The following example applies seasonality detection on one month traffic of a web service (2-hour bins):

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2PL04tykwtNuaqUShKzUtJLVIoycxNTc5ILCoBAHrjE80fAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_series3
| render timechart 
```

:::image type="content" source="media/time-series-analysis/time-series-seasonality.png" alt-text="Time series seasonality."lightbox="media/time-series-analysis/time-series-seasonality.png":::

- Use [series_periods_detect()](series-periods-detect-function.md) to automatically detect the periods in the time series, where:
  - `num`: the time series to analyze
  - `0.`: the minimum period length in days (0 means no minimum)
  - `14d/2h`: the maximum period length in days, which is 14 days divided into 2-hour bins
  - `2`: the number of periods to detect
- Use [series_periods_validate()](series-periods-validate-function.md) if we know that a metric should have specific distinct periods and we want to verify that they exist.

> [!NOTE]
> It's an anomaly if specific distinct periods don't exist

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OwQ6CMBBE737FHKmpVtAr39IguwkYyzZ0IZj48TZSLx533szOEAfxieeR0/XwRpzlwb2iilkSShapl5mTQYvd5QvxxJqd1bQEi8vZor6RawaLxsA5FewcOjBKBOP0PXUMXL7lyrCeeIvdRPjrzIw35Qyoe6W2GY4qJMv9yb91xtX0AS7N323BAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_series3
| project (periods, scores) = series_periods_detect(num, 0., 14d/2h, 2) //to detect the periods in the time series
| mv-expand periods, scores
| extend days=2h*todouble(periods)/1d
```

| periods | scores | days |
| --- | --- | --- |
| 84 | 0.820622786055595 | 7 |
| 12 | 0.764601405803502 | 1 |

The function detects daily and weekly seasonality. The daily scores less than the weekly because weekend days are different from weekdays.

### Element-wise functions

Arithmetic and logical operations can be done on a time series. Using [series_subtract()](series-subtract-function.md) we can calculate a residual time series, that is, the difference between original raw metric and a smoothed one, and look for anomalies in the residual signal:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WQzU4DMQyE732KUU%2B7UlG7B05on4EDFRxX7q5XjcjPKnFoQX14HFIVECcukcb2fBnbssAZPwh6SEgjWYrNxC4Mjl55SBwNpw4XpOwcRfPBZbzZG8dPQm5p24eVLQw6%2F4tB59%2BMP%2BOrC4q8qxI%2Bu34M2UvTYuKZspV%2Bh%2BBxo2COwV13kXANlIQXdEcc3vGYnjkqlc%2FCftL%2BUJgVP8wmNio3iLwwSdNtcN9uIDFzfdtvZ%2BRkpkz2pz%2Flg0QapUIqu8V2q0H0HGO2JHwzQjQzqlOxpyNHrvHQ91i%2FGD%2BFU0K3WwPKwGysaE%2BX1ZaWy3pvJimpnJIwWiavA%2BORokCJUWOqLt981T4BEhxSG%2BUBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_make_series1 | summarize min(TimeStamp));
let max_t = toscalar(demo_make_series1 | summarize max(TimeStamp));
demo_make_series1
| make-series num=count() default=0 on TimeStamp from min_t to max_t step 1h by OsVer
| extend ma_num=series_fir(num, repeat(1, 5), true, true)
| extend residual_num=series_subtract(num, ma_num) //to calculate residual time series
| where OsVer == "Windows 10"   // filter on Win 10 to visualize a cleaner chart 
| render timechart
```

:::image type="content" source="media/time-series-analysis/time-series-operations.png" alt-text="Time series operations." lightbox="media/time-series-analysis/time-series-operations.png":::

- Blue: original time series
- Red: smoothed time series
- Green: residual time series

## Time series workflow at scale

This example shows anomaly detection running at scale on thousands of time series in seconds. To see sample telemetry records for a DB service read count metric over four days, run the following query:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2Pz03Mq4wvTi3KTC025KpRKEnMTlUwAQArfAiiGgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_many_series1
| take 4 
```

| TIMESTAMP                   | Loc   | Op                  | DB  | DataRead |
| --------------------------- | ----- | ------------------- | --- | -------- |
| 2016-09-11 21:00:00.0000000 | Loc 9 | 5117853934049630089 | 262 | 0        |
| 2016-09-11 21:00:00.0000000 | Loc 9 | 5117853934049630089 | 241 | 0        |
| 2016-09-11 21:00:00.0000000 | Loc 9 | -865998331941149874 | 262 | 279862   |
| 2016-09-11 21:00:00.0000000 | Loc 9 | 371921734563783410  | 255 | 0        |

View simple statistics:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2Pz03Mq4wvTi3KTC025KpRKC7NzU0syqxKVcgrzbVNzi/NK9HQ1FHIzcyLL7EFkhohnr6uwSGOvgEg0cQKkGhiBZIoAEq2dK9VAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_many_series1
| summarize num=count(), min_t=min(TIMESTAMP), max_t=max(TIMESTAMP) 
```

| num | min_t | max_t |
| --- | --- | --- |
| 2177472 | 2016-09-08 00:00:00.0000000 | 2016-09-11 23:00:00.0000000 |

A time series in 1-hour bins of the read metric (four days × 24 hours = 96 points) shows normal hourly fluctuation:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPMQvCMBCF9%2F6KG5NBsLN0EHRwKIh2D0d72mCTyOXUVvrjTbE46OT44Hsf73Uk4Kw3AgVIiDV2yKohF4xDP5hIbCnmMEK8OYdsnzThqtqV22O1LvdarwCybrJg%2F5cF%2B2%2FLTyEbE3ahxTsCEzaxwPtZbVDwkJKG4OFjgRMHN7%2BRMA%2BKQlfI26Ri8g0xiHVUt8gCDyutGhJfLPULu%2Bat2AgBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP from min_t to max_t step 1h
| render timechart with(ymin=0) 
```

:::image type="content" source="media/time-series-analysis/time-series-at-scale.png" alt-text="Screenshot of a time series chart showing average reads over four days with normal hourly fluctuations." lightbox="media/time-series-analysis/time-series-at-scale.png":::

This behavior is misleading because the single normal time series is aggregated from thousands of instances that can have abnormal patterns. Create a time series per instance defined by Loc (location), Op (operation), and DB (specific machine).

How many time series can you create?

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2Pz03Mq4wvTi3KTC025KpRKC7NzU0syqxKVUiqVPDJT9ZR8C/QUXBxAkol55fmlQAAWEsFxjQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_many_series1
| summarize by Loc, Op, DB
| count
```

| Count |
| --- |
| 18339 |

Create 18,339 time series for the read count metric. Add the `by` clause to the make-series statement, apply linear regression, and select the top two time series with the most significant decreasing trend:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPvU4DMRCE%2BzzFdLGlUBxpQCgFKBRIREEk%2FWlx9hKLs32s90KC8vA4P6KAinJWM9%2FstKwIPtaKCTRlRy2JWXFIdaC4rzOL51zhgNyHQOK%2F%2BGg3y6fZ42J5P3ux9g4YtEcK7f5Fod1vyp%2FA4FBs73x1lhCmVZ7Qdm2mpPRalEWK%2BKGgkRQuazRdHsrKHaoN3vZ4Tm6EeTfC9KGQeaccVzCSP3oSHiG3qWNbFpzr6sZr3frI5tRrS0RTh%2Bsj6WQFZYdylYJhgfrAbkOi%2BPS6Meq15clwwbL1jrEUahrvMO%2BV1owmSSH5mJWiK9NM6hWpQXUzHt%2Faof0G4rlHgJcBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP from min_t to max_t step 1h by Loc, Op, DB
| extend (rsquare, slope) = series_fit_line(reads)
| top 2 by slope asc 
| render timechart with(title='Service Traffic Outage for 2 instances (out of 18339)')
```

:::image type="content" source="media/time-series-analysis/time-series-top-2.png" alt-text="Screenshot of two time series with sharply declining read counts compared to normal traffic.":::

Display the instances:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPzU4CQRCE7zxFHWeS9YBXwwGDBxOJRrlP2t1GR%2BfPmYYshIdnFjaG4Mljdaq%2B6nIs8DYYwQwSS0uOsurYR%2BMp7EzhbLlMcUDZeE%2FZ7nmwq9Xj8uFtNV%2B%2BaH0HTNxAof5fFOqvKX8Ck0O1ffPNWSIzdWVG2w%2B1IKHXqjRiwC8F6xz9uEbi%2BFARTph%2B4n2Hp9g2eE4NFveVzL1w6KBy%2BdlQ5gbFxcS6LjjXmbUV42xgderVNSIx4XYgnayg0tZjyvGLW7mkj6wjdnlJdFwBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let min_t = toscalar(demo_many_series1 | summarize min(TIMESTAMP));  
let max_t = toscalar(demo_many_series1 | summarize max(TIMESTAMP));  
demo_many_series1
| make-series reads=avg(DataRead) on TIMESTAMP from min_t to max_t step 1h by Loc, Op, DB
| extend (rsquare, slope) = series_fit_line(reads)
| top 2 by slope asc
| project Loc, Op, DB, slope 
```

| Loc | Op | DB | slope |
| --- | --- | --- | --- |
| Loc 15 | 37 | 1151 | -104,498.46510358342|
| Loc 13 | 37 | 1249 | -86,614.02919932814 |

In under two minutes, the query analyzes nearly 20,000 time series and detects two with a sudden read count drop.

These capabilities and the platform performance provide a powerful solution for time series analysis.

## Related content

- [Anomaly detection and forecasting](anomaly-detection.md) with KQL.
- [Machine learning capabilities](anomaly-diagnosis.md) with KQL.
