# Date and Time Operations
#### (10 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Getting started with the Analytics portal](~/learn/tutorials/getting_started_with_analytics_portal.md) and [Getting started with queries](~/learn/tutorials/getting_started_with_queries.md) tutorials yet, we recommend that you do so. 

## In this tutorial
Need to work with dates and times? This tutorial will walk you through the different functions available options in the query language for you to do so.

Relevant functions:   
[ago](~/query/query_language_agofunction.md)  
[now](~/query/query_language_nowfunction.md)  
[todatetime](~/query/query_language_todatetimefunction.md) | [totimespan](~/query/query_language_totimespanfunction.md)  
[bin](~/query/query_language_binfunction.md)  
[datepart](~/query/query_language_datetime_partfunction.md) | [getmonth](~/query/query_language_getmonthfunction.md) | [monthofyear](~/query/query_language_monthofyearfunction.md) | [getyear](~/query/query_language_getyearfunction.md)  
[dayofmonth](~/query/query_language_dayofmonthfunction.md) | [dayofweek](~/query/query_language_dayofweekfunction.md) | [dayofyear](~/query/query_language_dayofyearfunction.md) | [weekofyear](~/query/query_language_weekofyearfunction.md)   
[endofday](~/query/query_language_endofdayfunction.md) | [endofweek](~/query/query_language_endofweekfunction.md) | [endofmonth](~/query/query_language_endofmonthfunction.md) | [endofyear](~/query/query_language_endofyearfunction.md) | [startofday](~/query/query_language_startofdayfunction.md) | [startofweek](~/query/query_language_startofweekfunction.md) | [startofmonth](~/query/query_language_startofmonthfunction.md) | [startofyear](~/query/query_language_startofyearfunction.md)

## Basics
The query language has two main data types associated with dates and times: datetime and timespan. 

All dates are expressed in UTC. While multiple datetime formats are supported, the ISO8601 format is strongly preferred. 

Timespans are expressed as a decimal followed by a time unit:

|shorthand   | time unit    |
-------------|--------------|
|d           | day          |
|h           | hour         |
|m           | minute       |
|s           | second       |
|ms          | millisecond  |
|microsecond | microsecond  |
|tick        | nanosecond   |

Datetimes can be created by casting a string using the todatetime operator. For example, imagine we had an incident that we were investigating exceptions for. We want to define our start and end time as parameters so that we can reuse them in multiple places in the query. Note the convenient [between operator](~/query/query_language_betweenoperator.md) available to us. Also note that we can to do basic arithmetic such as subtracting and adding datetimes, in this case to create a new column called *timeFromStart* that will show us how long after the incident started a given exception took place.
```AIQL
let startDatetime = todatetime("2015-12-31 20:12:42.9");
let endDatetime = todatetime("2016-01-02 06:32:27.2");
exceptions
| where timestamp between(startDatetime .. endDatetime)
| extend timeFromStart = timestamp - startDatetime
```

Between is extremely convenient to specify a time range. Another very common situation is one where we'll  want to compare a datetime to the present. For example, if I wanted to see all requests over the last two minutes, I can use the now operator together with a timespan that represents two minutes:
```AIQL
requests
| where timestamp > now() - 2m
```
A shortcut is also available for this:
```AIQL
requests
| where timestamp > now(-2m)
```
The shortest and most readable way do so however is using the ago operator:
```AIQL
requests
| where timestamp > ago(2m)
```

To go back to the previous example of needing to find exceptions: imagine this time, instead of knowing the start and end time, we know the start time and how long the incident took place. We can re-write our query as follows:
```AIQL
let startDatetime = todatetime("2015-12-31 20:12:42.9");
let incidentDuration = totimespan(35m);
exceptions
| where timestamp between(startDatetime .. (startDatetime+incidentDuration) )
| extend timeFromStart = timestamp - startDatetime
```

# Converting time units
Sometimes, it is useful to express a datetime or timespan in a time unit other than the default one. For example, let's say we're viewing an event log for events of type "Customer Load" over the last 36 hours, with a calculated column showing how long ago the event happened:
```AIQL
customEvents
| where timestamp > ago(36h)
| where name == "Customer Load"
| extend timeAgo = now() - timestamp 
```
Note a sample row returned:
|name|timestamp|timeAgo|...|
|--|--|--|--|
|Customer Load|2017-05-25T16:55:15.357Z|05:56:31.1062516|...|
The timeAgo column is expressed in hh:mm:ss.fffffff. This is sometimes convenient, but for our investigation, we prefer to look at times as minutes passed from the beginning. We can rewrite our query as follows to get the output we want:
```AIQL
customEvents
| where timestamp > ago(36h)
| where name == "Customer Load"
| extend timeAgo = now() - timestamp
| extend timeAgoMinutes = timeAgo/1m 
```
Our output is now:
|name|timestamp|timeAgo|timeAgoMinutes|...|
|--|--|--|--|--|
|Customer Load|2017-05-25T16:55:15.357Z|05:56:31.1062516|356.5184375267|...|
Exactly what we were looking for - 5 hours, 56 minutes, and 31 seconds converted into 356.51 minutes!

We can use this division by a timespan synthax to convert to any time unit supported by the timespan mechanism.

## Aggregations and bucketing by time intervals
Another very common scenario is the need to obtain statistics over a certain time period in a particular time grain. For this, a bin() operator is available that can be used as part of the summarize clause. Let's explore a few examples to see how this works:

If we wanted to get the number of distinct users we had each day over the last week, we can use the following query:
```AIQL
requests
| where timestamp > ago(7d)
| summarize dcount(user_Id) by bin(timestamp, 1d) 
```
This produces the following table:  
|timestamp|dcount_user_Id|
|--|--|
|2017-05-18T00:00:00Z|51   |
|2017-05-19T00:00:00Z|2,292|
|2017-05-20T00:00:00Z|1,831|
|2017-05-21T00:00:00Z|1,837|
|2017-05-22T00:00:00Z|2,177|
|2017-05-23T00:00:00Z|2,157|
|2017-05-24T00:00:00Z|2,000|
|2017-05-25T00:00:00Z|2,126|

Or, if we wanted to view the 95th percentile of the duration of incoming requests for every five minutes over the last half hour:
```AIQL
requests
| where timestamp > ago(30m)
| summarize percentile(duration, 95) by bin(timestamp, 5m)
```
|timestamp|percentile_duration_95|
|--|--|
|2017-05-25T23:05:00Z|121.2473|
|2017-05-25T23:10:00Z|117.1978|
|2017-05-25T23:15:00Z|113.1422|
|2017-05-25T23:20:00Z|119.6415|
|2017-05-25T23:25:00Z|112.2826|
|2017-05-25T23:30:00Z|122.4392|

Let's say we wanted to look at the number of pageViews we had every month over the last 3 months. We can use the following query:
```AIQL
pageViews
| where timestamp > ago(90d)
| summarize count() by bin(timestamp, 30d)
```
Which executed on May 25th, 2017, results in the following: 
|timestamp|count_|
|--|--|
|2017-02-21T00:00:00Z|921|
|2017-04-22T00:00:00Z|639|
|2017-03-23T00:00:00Z|832|
|2017-05-22T00:00:00Z|149|
Looks like the tool used the current date to base its 30 day buckets on. What if we wanted to report on the start of each month instead of based on the current date? We can use the _startofmonth_ function to do so:
```AIQL
pageViews
| where timestamp > ago(90d)
| summarize count() by startofmonth(timestamp)
```
Which produces the following:
|timestamp|count_|
|--|--|
|2017-02-01T00:00:00Z|32|
|2017-03-01T00:00:00Z|1,132|
|2017-04-01T00:00:00Z|759|
|2017-05-01T00:00:00Z|618|
Perfect! Many other functions similar to _startofmonth_ are avialable to you, documented in the Language Reference section.

## Time zones
Since all datetimes are expressed in UTC, it is often useful to convert these into our local timezone. For simply viewing data, we can add a column using datetime math to add or subtract the necessary number of hours. For example, to convert UTC times to PST times for the customEvents table:
```AIQL
customEvents
| extend localTimestamp = timestamp - 8h 
```

## Next steps
Continue with our advanced tutorials:
* [String operations](~/learn/tutorials/string_operations.md)
* [Aggregation functions](~/learn/tutorials/aggregations.md)
* [Advanced aggregations](~/learn/tutorials/advanced_aggregations.md)
* [Charts and diagrams](~/learn/tutorials/charts.md)
* [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md)
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)