# Understanding series_line_fit - finding the line of best fit
#### (10 min to read)

<br/>
> [!Note]
> Before you start...
> If you haven't completed the [Time Series tutorial](~/learn/tutorials/smart analytics/make_series.md) yet, we recommend that you do so.


Time series are fundamental for investigating the temporal developments of incidents for root-cause analysis 
and will serve you as a tool for many investigations.
In this tutorial, we learn how to analyze time series with series_line_fit, a machine learning operator that 
learns the line of best fit to your data, and will serve you in identofying trends and developments.


## Computing the line of best fit

Let's look at a time series of exceptions over two months:

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series y = count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) 
| render timechart 
```

And now, add a line fit to the series, named y, using the series_fit_line operator.

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series y = count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) 
| extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(y)
| render timechart 
```

Here is how the result looks like. The green line is the numer of exceptions on each day, and the blue line is the line of best fot to the series.

<p><img src="~/learn/tutorials/images/smart analytics/line_fit.jpeg" alt="Log Analytics linefit"></p>

## Using series_line_fit for investigating time series

Suppose that we want to investigate if application versions can be correlated with the exceptions time series.
We can make a series for each application_Version: 

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series y = count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) by application_Version
| extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(y)
| render timechart 
```

There are quite a few lines to look at manually.  let's continue to process.

<p><img src="~/learn/tutorials/images/smart analytics/line_fit_many_lines.jpeg" alt="Log Analytics linefit many lines"></p>

In these cases series_line_fit lets you investiagte properties on the lines.
A central property is the slope of the fitted line.
Zero slope means that the line of best fit during two months is pretty stable on average.

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series y = count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) by application_Version 
| extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(y) 
```

Typically, changes and anomalies are interesting. You can narrow down on lines which exhibit a change, by sorting by the absolute value of the slope.

```AIQL
exceptions
| where timestamp between (datetime(01-01-2017)..datetime(02-28-2017))  
| make-series y = count() on timestamp in range(datetime(01-01-2017),datetime(02-28-2017), 1d) by application_Version 
| extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(y) | extend abs_Slope = iff(Slope<0, (-1)*Slope, Slope) 
| sort by abs_Slope desc
| take 5
| render timechart 
````
<p><img src="~/learn/tutorials/images/smart analytics/line_fit_high_slope.jpg" alt="Log Analytics linefit high slope"></p>


