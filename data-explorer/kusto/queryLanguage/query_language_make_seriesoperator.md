# make-series operator

Create series of specified aggregated values along specified axis. 

    T | make-series sum(amount) default=0, avg(price) default=0 on timestamp in range(datetime(2016-01-01), datetime(2016-01-10), 1d) by fruit, supplier

A table that shows arrays of the numbers and average prices of each fruit from each supplier ordered by the timestamp with specified range. There's a row in the output for each distinct combination of fruit and supplier. The output columns show the fruit, supplier and arrays of: count, average and the whole time line (from 2016-01-01 until 2016-01-10). All arrays are sorted by the respective timestamp and all gaps are filled with default values (0 in this example). All other input columns are ignored.

**Syntax**

*T* `| make-series`
      [*Column* `=`] *Aggregation* [`default` `=` *DefaultValue*] [`,` ...]
    `on` *AxisColumn* `in` `range(`*start*`,` *stop*`,` *step*`)`
    [`by`
      [*Column* `=`] *GroupExpression* [`,` ...]]

**Arguments**

* *Column:* Optional name for a result column. Defaults to a name derived from the expression.
* *DefaultValue:* Default value which will be used instead of absent values. If there is no row with specific values of *AxisColumn* and *GroupExpression* then in the results the corresponding element of the array will be assigned with a *DefaultValue*. If `default =` *DefaultValue* is omitted then 0 is assumed. 
* *Aggregation:* A call to an [aggregation function](query_language_make_seriesoperator.md#list-of-aggregation-functions) such as `count()` or `avg()`, with column names as arguments. See the [list of aggregation functions](query_language_make_seriesoperator.md#list-of-aggregation-functions). Note that only aggregation functions that return numeric result can be used with `make-series` operator.
* *AxisColumn:* A column on which the series will be ordered. It could be considered as timeline, but besides `datetime` any numeric types are accepted.
* *start*: The low bound value of the *AxisColumn* for each the series will be built. Similar to the `range` function *start*, *stop* and *step* are used to build array of *AxisColumn* values within a given range and using specified *step*. All *Aggregation* values are ordered respectively to this array. This *AxisColumn* array is also the last output column in the output with the same name as *AxisColumn*.
* *stop*: The high bound value of the *AxisColumn* for each the series will be built or the least value that is greater than the last element in the resulting array and within an integer multiple of *step* from *start*.
* *step*: The difference between two consecutive elements of the *AxisColumn* array (i.e. the bin size).
* *GroupExpression:* An expression over the columns, that provides a set of distinct values. Typically it's a column name that already provides a restricted set of values. 

**Returns**

The input rows are arranged into groups having the same values of the `by` expressions and `bin(`*AxisColumn*`, `*step*`)` expression. Then the specified aggregation functions are computed over each group, producing a row for each group. The result contains the `by` columns, *AxisColumn* column and also at least one column for each computed aggregate. (Aggregation that multiple columns or non-numeric results are not supported.)

This intermediate result has as many rows as there are distinct combinations of `by` and `bin(`*AxisColumn*`,` *step*`)` values.

Finally the rows from the intermediate result arranged into groups having the same values of the `by` expressions and all aggregated values are arranged into arrays (values of `dynamic` type). For each aggregation there is one column containing its array with the same name. The last column in the output of the range function with all *AxisColumn* values. Its value is repeated for all rows. 

Note that due to the fill missing bins by default value, the resulting pivot table has the same number of bins (i.e. aggregated values) for all series  

**Note**

Although you can provide arbitrary expressions for both the aggregation and grouping expressions, it's more efficient to use simple column names.
 

## List of aggregation functions

|Function|Description|
|--------|-----------|
|[any()](query_language_any_aggfunction.md)|Returns random non-empty value for the group|
|[avg()](query_language_avg_aggfunction.md)|Retuns average value across the group|
|[count()](query_language_count_aggfunction.md)|Returns count of the group|
|[countif()](query_language_countif_aggfunction.md)|Returns count with the predicate of the group|
|[dcount()](query_language_dcount_aggfunction.md)|Returns approximate distinct count of the group elements|
|[max()](query_language_max_aggfunction.md)|Returns the maximum value across the group|
|[min()](query_language_min_aggfunction.md)|Returns the minimum value across the group|
|[stdev()](query_language_stdev_aggfunction.md)|Returns the standard deviation across the group|
|[sum()](query_language_sum_aggfunction.md)|Returns the sum of the elements withing the group|
|[variance()](query_language_variance_aggfunction.md)|Returns the variance across the group|

## List of series analysis functions

|Function|Description|
|--------|-----------|
|[series_fir()](query_language_series_firfunction.md)|Applies [Finite Impulse Response](https://en.wikipedia.org/wiki/Finite_impulse_response) filter|
|[series_iir()](query_language_series_iirfunction.md)|Applies [Infinite Impulse Response](https://en.wikipedia.org/wiki/Infinite_impulse_response) filter||[series_fit_line()](query_language_series_fit_linefunction.md)|Finds a straight line that is the best approximation of the input|
|[series_fit_line()](query_language_series_fit_linefunction.md)|Finds a line that is the best approximation of the input|
|[series_fit_line_dynamic()](query_language_series_fit_line_dynamicfunction.md)|Finds a line that is the best approximation of the input, returning dynamic object|
[series_fit_2lines()](query_language_series_fit_2linesfunction.md)|Finds two lines that is the best approximation of the input|
|[series_fit_2lines_dynamic()](query_language_series_fit_2lines_dynamicfunction.md)|Finds two lines that is the best approximation of the input, returning dynamic object|
|[series_outliers()](query_language_series_outliersfunction.md)|Scores anomaly points in a series|
|[series_periods_detect()](query_language_series_periods_detectfunction.md)|Finds the most significant periods that exist in a time series|
|[series_periods_validate()](query_language_series_periods_validatefunction.md)|Checks whether a time series contains periodic patterns of given lengths|
|[series_stats_dynamic()](query_language_series_stats_dynamicfunction.md)|Return multiple columns with the common statistics (min/max/variance/stdev/average)|
|[series_stats()](query_language_series_statsfunction.md)|Generates a dynamic value with the common statistics (min/max/variance/stdev/average)|
  
## List of series interpolation functions
|Function|Description|
|--------|-----------|
|[series_fill_backward()](query_language_series_fill_backwardfunction.md)|Performs backward fill interpolation of missing values in a series|
|[series_fill_const()](query_language_series_fill_constfunction.md)|Replaces missing values in a series with a specified constant value|
|[series_fill_forward()](query_language_series_fill_forwardfunction.md)|Performs forward fill interpolation of missing values in a series|
|[series_fill_linear()](query_language_series_fill_linearfunction.md)|Performs linear interpolation of missing values in a series|

* Note: Interpolation functions by default assume `null` as a missing value. Therefore it is recommended to specify `default=`*double*(`null`) in `make-series` if you intend to use interpolation functions for the series. 

## Examples
  
<!-- csl -->
```
T | make-series PriceAvg=avg(Price) default=0
on Purchase in range(datetime(2016-09-10), datetime(2016-09-12), 1d) by Supplier, Fruit
```
  
![](./Images/aggregations/makeseries.png)
  

```
let data=datatable(timestamp:datetime, metric: real)
[
  datetime(2016-12-31T06:00), 50,
  datetime(2017-01-01), 4,
  datetime(2017-01-02), 3,
  datetime(2017-01-03), 4,
  datetime(2017-01-03T03:00), 6,
  datetime(2017-01-05), 8,
  datetime(2017-01-05T13:40), 13,
  datetime(2017-01-06), 4,
  datetime(2017-01-07), 3,
  datetime(2017-01-08), 8,
  datetime(2017-01-08T21:00), 8,
  datetime(2017-01-09), 2,
  datetime(2017-01-09T12:00), 11,
  datetime(2017-01-10T05:00), 5,
];
let interval = 1d;
let stime = datetime(2017-01-01);
let etime = datetime(2017-01-09);
data
| make-series avg(metric) on timestamp in range(stime, etime, interval)  
```
  
|avg_metric|timestamp|
|---|---|
|[ 4.0, 3.0, 5.0, 0.0, 10.5, 4.0, 3.0, 8.0, 6.5 ]|[ "2017-01-01T00:00:00.0000000Z", "2017-01-02T00:00:00.0000000Z", "2017-01-03T00:00:00.0000000Z", "2017-01-04T00:00:00.0000000Z", "2017-01-05T00:00:00.0000000Z", "2017-01-06T00:00:00.0000000Z", "2017-01-07T00:00:00.0000000Z", "2017-01-08T00:00:00.0000000Z", "2017-01-09T00:00:00.0000000Z" ]|  

