# Understanding make-series - Analytics' native time series
#### (10 min to read)

<br/>
Time series are fundamental for investigating the temporal developments of incidents for root-cause analysis 
and will serve you as a tool for many investigations.
In this tutorial, we introduce operator make-series, which takes values distributed among a few rows, 
and unifies them into a new data type - a time series, which can then be used for further investigation.
 

 
## From a row table to time series 
Let's look at the number of exeptions in our demo application, on each day over two months.

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017)) | summarize count() by bin(timestamp, 1d)  
```

make-series will turn the data into a series in a single row, using the series data type

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) 
```

<p><img src="~/learn/tutorials/images/smart analytics/make_series.jpg" alt="Log Analytics make-series"></p>


## Agreggation functions
We can choose any aggregation function to make the series on, not just counting all rows. 
For example, count just the distinct users associated with the exceptions for each day 

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series dcount(user_Id) on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) 
```

Try another example, now aggregating with a step of 2 days:

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series dcount(user_Id) on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 2d) 
```

## Grouping
We can also add a grouping, which will - in this case - make a series for operation name separately. 
You can see many 0's. make-series put a default value of 0 when there is no value for a point in the series 
(you can override this default) 


```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series dcount(user_Id) on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 2d) by operation_Name 
```

Congratulations! You've completed the tutorial on make series!

