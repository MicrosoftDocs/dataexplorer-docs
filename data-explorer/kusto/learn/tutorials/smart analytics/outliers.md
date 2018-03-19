# Detecting anomalies in a series
#### (10 min to read)

<br/>
> [!Note]
> Before you start...
> If you haven't completed the [Time Series tutorial](~/learn/tutorials/smart analytics/make_series.md) yet, we recommend that you do so. 

In this tutorial, we demonstrate how to use series_outliers, a function which runs on time series and gives each point in the series an anomaly score, according to how anomalous the poiont is, either on the incline or on the decline.

Let's start by looking at one of the most interesting metrics for dev ops engineers - request duration for a service. In this case we look at the hourly average.

First, we retrieve as as row table:
```AIQL
requests | where (timestamp >= datetime(06-25-2017) and timestamp <= datetime(07-03-2017)) | summarize avg(duration) by bin(timestamp, 1h)
```

And now, visualized as a timechart:
```AIQL
requests | where (timestamp >= datetime(06-25-2017) and timestamp <= datetime(07-03-2017)) | summarize avg(duration) by bin(timestamp, 1h) | render timechart 
```

In order to use series_outliers, we make a time series out of the values. Just in order to be able to better view the results later on, we divide the duration by 10. 
```AIQL
requests | where (timestamp >= datetime(06-25-2017) and timestamp <= datetime(07-03-2017)) | extend duration_10 = duration/10 | make-series avg(duration_10) default=-1 on timestamp in range(datetime(06-25-2017),datetime(07-03-2017), 1h) 
```

// We are now ready to do outlier detection. We pipe the results into series_outliers, and get in return a score for each point.
// These scores form the green line.
```AIQL
requests | where (timestamp >= datetime(06-25-2017) and timestamp <= datetime(07-03-2017)) | extend duration_10 = duration/10 | make-series avg(duration_10) default=-1 on timestamp in range(datetime(06-25-2017),datetime(07-03-2017), 1h) | extend outliers = series_outliers(avg_duration_10) | render timechart 
```
<p><img src="~/learn/tutorials/images/smart analytics/outliers_anomaly.jpg" alt="Log Analytics outliers anomaly"></p>

Values on the green line that are less than 0, indicate anomaly on the decline of the corresponding point on the blue line. Values greater than 0, indicate an anomaly on the incline.
For example, on June 30th, 2017 at 00:00:00, the most significant anomaly in this series occurs. You may now use the anomaly values for further processing. The method used to score the outliers is the Tukey test, on which you can read in the following link: https://en.wikipedia.org/wiki/Outlier#Tukey.27s_test .

