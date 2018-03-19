# Aggregation Functions Are Your Friends
#### (8 min to read)

<br/>

This guide reviews various aggregation functions that offer useful ways to analyze your data.

## Counts

### count, countif
*count* is useful to count the number of rows available, after previous filters were applied. For example:

```AIQL
requests 
| where timestamp > ago(30m) 
| summarize count()
```
It returns the total number of rows in the *"requests"* table, from the last 30 minutes. 
The result (e.g. "1,540") is returned in a column named *"count_"*. To use a specific column name for the result, set it explicitly in the aggregation:
```AIQL
requests 
| where timestamp > ago(30m) 
| summarize num_of_latest_requests=count() 
```

*count* visualization is useful for viewing a trend of incoming *"requests"* per time interval. For example:
```AIQL
requests 
| where timestamp > ago(30m) 
| summarize count() by bin(timestamp, 5m)
| render timechart
```

We see the requests count trendline in 5 minutes' intervals:

<p><img src="~/learn/tutorials/images/aggregations/count_trend.png" alt="Log Analytics count trend"></p>


### dcount, dcountif
*dcount* and *dcountif* are used to count distinct values in a specific column.
The following query evaluates how many distinct users sent requests in the last hour:
```AIQL
requests 
| where timestamp > ago(1h) 
| summarize dcount(user_Id)  
```

Counting the distinct users affected by failed requests can be achieved with *dcountif*:
```AIQL
requests 
| where timestamp > ago(1h) 
| summarize dcountif(user_Id, success==False) 
```

### Evaluating sub-groups
To perform a count (or other aggregations) on different groups in your data, use the *"by"* keyword.
For example, this is how you can count the number of distinct users affected by failed requests **in each country**:
```AIQL
requests 
| where timestamp > ago(1h) 
| summarize dcountif(user_Id, success==False) by client_CountryOrRegion  
```

<p><img src="~/learn/tutorials/images/aggregations/dcount_by_country.png" alt="Log Analytics dcount"></p>

To analyze even smaller sub-groups of your data, add additional column names to the *"by"* section.<br/>
For example, you might want to find how many requests from different countries get different results:
```AIQL
requests 
| where timestamp > ago(1h) 
| summarize dcountif(user_Id, success==False) by client_CountryOrRegion, resultCode
```

## Percentiles and Variance
When evaluating numerical values, a common practice is to average them. (`summarize avg(expression)` does that for you).
The problem with averages is that they're affected (dramatically) by outliers - extreme values that characterize only a few cases.
To handle that, we can use less sensitive functions, such as median or variance.

### Percentile
Going back to the requests use case, an interesting property is the request duration.
To find the median value, we can use the *percentile()* function and select the 50th percentile:
```AIQL
requests 
| where timestamp between(datetime(2016-11-6) .. datetime(2016-11-7)) 
| summarize percentile(duration, 50) by client_CountryOrRegion
```

We see that during the given period, requests duration coming from the US is performant and returned in 1.6 millisecond:
<p><img src="~/learn/tutorials/images/aggregations/median_by_country.png" alt="Log Analytics median"></p>

### Percentiles
To get better understanding of the requests' performance, we should review different percentiles:
```AIQL
requests 
| where timestamp between(datetime(2016-11-6) .. datetime(2016-11-7)) 
| summarize percentiles(duration, 25, 50, 75, 90) by client_CountryOrRegion
```
The results reveal some new information...
<p><img src="~/learn/tutorials/images/aggregations/percentiles_by_country.png" alt="Log Analytics percentiles"></p>

Now we can see that *"requests"* duration coming from the US is actually less performant than most other countries in the 90th percentile, reaching 205.4 milliseconds.

To get an even wider picture of requests patterns, we can combine different statistical functions, such as *dcount()*, *avg()* and *percentiles()*:
```AIQL
requests 
| where timestamp between(datetime(2016-11-6) .. datetime(2016-11-7)) 
| summarize dcount(user_Id), avg(duration), percentiles(duration, 25, 50, 75, 90) by client_CountryOrRegion
```
Adding the distinct user count (dcount_user_Id) helps to see the significance of the issue:
<p><img src="~/learn/tutorials/images/aggregations/percentiles_count_avg_by_country.png" alt="Log Analytics percentiles count average"></p>


### Variance
To directly evaluate the variance of a value, use the standard deviation and variance methods:
```AIQL
requests 
| where timestamp between(datetime(2016-11-6) .. datetime(2016-11-7)) 
| summarize stdev(duration), variance(duration) by client_CountryOrRegion
```

## Next steps
Continue with our advanced tutorials:
* [Advanced aggregations](~/learn/tutorials/advanced_aggregations.md)
* [Charts and diagrams](~/learn/tutorials/charts.md)
* [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md)
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)
