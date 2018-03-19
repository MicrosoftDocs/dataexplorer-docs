# Charts and Diagrams
#### (5 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Advanced Aggregation functions](~/learn/tutorials/advanced_aggregations.md) tutorial yet, we recommend that you do so.

This tutorial reviews various visualizations Azure Log Analytics offers to display your data in a clear way. You can also use [render](~/queryLanguage/query_language_renderoperator.md) operator to embed the visualization within the querty itself.

## Charting the results
Let's review how many computers we have per operating system, according the last hour:
```OQL
Heartbeat
| where TimeGenerated > ago(1h)
| summarize count(Computer) by OSType  
```

By default, results display as a table:
<p><img src="~/learn/tutorials/images/charts/table_display.png" alt="Log Analytics table view"></p>


We can do better than the table view. Let's select "Chart", and choose the "Pie" option to view at the results nicely:
<p><img src="~/learn/tutorials/images/charts/charts_and_diagrams_pie.png" alt="Log Analytics pie chart"></p>


## Timecharts
Show the average, 50th and 95th percentiles of processor time in bins of 1 hour. The query generates multiple series and you can then select which series to show in the time chart

```OQL
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
```

Select the Line chart display option:

<p><img src="~/learn/tutorials/images/charts/charts_and_diagrams_multiSeries.png" alt="Log Analytics timechart"></p>

#### Reference line

If you want to add a reference line to help you easily identifying if the metric exceeded a specifc threshold, we can extend the dataset with a constanst column.

```OQL
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
| extend Threshold = 20
```
<p><img src="~/learn/tutorials/images/charts/charts_and_diagrams_multiSeriesThreshold.png" alt="Log Analytics reference line"></p>

## Multiple dimensions

Multiple expressions in the `by` clause creates multiple rows, one for each combination of values.

```OQL
SecurityEvent
| where TimeGenerated > ago(1d)
| summarize count() by tostring(EventID), AccountType, bin(TimeGenerated, 1h)
```

<p><img src="~/learn/tutorials/images/charts/charts_and_diagrams_multiDimension1.png" alt="Log Analytics multi dimensions"></p>

Dimensions must be of `string` type, hence the EventID is casted to string. The query returns data segemted by two dimensions and you can switch between the two dimensions. You can also chart the results without splitting by any dimension.

<p><img src="~/learn/tutorials/images/charts/charts_and_diagrams_multiDimension2.png" alt="Log Analytics multi dimensions"></p>

## Next steps
Continue with our advanced tutorials:
* [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md)
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)