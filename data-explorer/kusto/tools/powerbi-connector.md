---
title: Power BI Kusto Connector - Azure Kusto | Microsoft Docs
description: This article describes Power BI Kusto Connector in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Power BI Kusto Connector

The Power BI Kusto Connector (Preview) is a Power BI Desktop connector for Kusto,
which lets you visually build (efficient) Kusto queries using the Power BI query editor. 



## Using the connector

1. Open Power BI Desktop(download from here: https://powerbi.microsoft.com/desktop). 
2. Click the Get Data button:

![alt text](./Images/KustoTools-PowerBIConnector/step2.png "step2")

3. Select the Kusto connector:

![alt text](./Images/KustoTools-PowerBIConnector/step3.png "step3")

4. Enter the Cluster (and optionally Database and Table/Query) details:

![alt text](./Images/KustoTools-PowerBIConnector/step4.png "step4")

Select the _Data Connectivity mode_ you'd like to use - `Import` or `Direct Query`. You can ready about the differences between the two in the [Power BI Desktop documentation](https://docs.microsoft.com/en-us/power-bi/desktop-directquery-about).

If you provide the database and table name, you can skip to step 7 below, and start
working with your data. Otherwise, you'll be prompted to select a database and table
using the UI, as described in the steps below.

5. Select the Database from the list of databases:

![alt text](./Images/KustoTools-PowerBIConnector/step5.png "step5")


6. If you provided all the details in step 4, you can now preview the data, select `Load` to use it as-is, or `Edit` to continue
manipulate it in Power BI, as seen in the following steps.

![alt text](./Images/KustoTools-PowerBIConnector/step6.png "step6")

> **Note**: At this point, the Connector will generate the following Power BI query:
> ```
> let
>     Source = Kusto.Contents("help", "Samples", "StormEvents", [])
> in
>     Source
> ```

7. If promted, use you Organizational account to sign in (you need to have access to the relevant
Kusto cluster in order to query it in Power BI - see [Authorization and Roles Based Access Control](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) for details)

![alt text](./Images/KustoTools-PowerBIConnector/step7.png "step7")

8. Now that you have your data in the Query Editor, you can start manipulating it:

![alt text](./Images/KustoTools-PowerBIConnector/step8.png "step8")

Selecting `Alabama` from the list above, will result in the following Power BI query:

```
let
    Source = Kusto.Contents("help", "Samples", "StormEvents", []),
    #"Filtered Rows" = Table.SelectRows(Source, each ([State] = "ALABAMA"))
in
    #"Filtered Rows"
```

Which will be translated to the following Kusto query:

```kusto
StormEvents | where State == 'ALABAMA'
```

## Tips, Tricks and Known Issues

### Import or Direct Query

The Power BI Kusto Connector supports both Import and Direct Query connectiviy modes (You can
read about the differences between the two modes in the [Power BI Desktop documentation](https://docs.microsoft.com/en-us/power-bi/desktop-directquery-about)).

You should use **Import** mode when:

 * Your data set is relatively small - Import mode retrieves all the data and retain it with the Power BI reporthh
 * You do not need near-real-time data - data can be refreshed via Scheduled Refresh (at a 30 minutes granularity) 
 * Your data is already aggregated, or you already perform aggregation in Kusto (e.g. via Kusto Functions)

You should use **Direct Query** mode when:
 
 * Your data set is very large - it is not feasible to import it all. DirectQuery requires no large transfer of data, as it is queried in place
 * You need near-real-time data - every time data is displayed, it is being queried directly from your Kusto cluster

### Using complex queries in Power BI

If you have complex queries - queries that are more easily expressed in CSL than in Power Query - it is better to implement
those queries as Kusto Functions, and invoke thsoe functions in Power BI.

One such scenario where this is not only recommended, but required, it when you have `let` statements in your queries, and you
are using Direct Query (which might result in joins). Because Power BI will take 2 queries and join them, this might result in
syntax errors (since `let` statements cannot be used with the join operator). In this scenario, you should save each leg of the
join as a Kusto Function, and let Power BI join between these 2 functions.

### How to simulate `Timestamp < ago(1d)`

PowerBI doesn't have a "relative" date-time operator, such as ago(), which is quite
common in Kusto.

In order to simulate it, we can do use a combination of PowerBI functions -
`DateTime.FixedLocalNow()` and the `#duration` constructor:

```
let
    Source = Kusto.Contents("help", "Samples", "StormEvents", []),
    #"Filtered Rows" = Table.SelectRows(Source, each [StartTime] > (DateTime.FixedLocalNow()-#duration(5,0,0,0)))
in
    #"Filtered Rows"
```
The query is equivalent to one of the following Kusto's CSL queries:

```kusto
    StormEvents | where StartTime > (now()-5d)
    StormEvents | where StartTime > ago(5d)
```

### Bad Requests when sending long queries

Power BI can only send short (&lt;2000) queries to Kusto.

If running a query in Power BI results in an error of: _"DataSource.Error: Web.Contents failed to get contents from..."_, most likely the reason is that the query is longer than 2000 characters. 
Power BI uses Power Query to query Kusto, and does so by issuing a HTTP GET
request which encodes the query as part of the URI being retrieved. This means
that Kusto queries issued by Power BI are limited to the maximum length of
a request URI (2000 characters, minus some small offset). The workaround is
to define a [stored function](../management/functions.md) in Kusto,
and have Power BI use that function in the query.
<br>(Why isn't HTTP POST used instead? Turns out Power Query currently
only supports anonymous HTTP POST requests.)


### Reaching Kusto query limits 

If running a query in Power BI results in an error of: _"[Expression.Error] We cannot convert a value of type Record to type List"_, 
most likely your query returns more data that Kusto's default limits (500,000 rows or 64MB, as described in the [Query Limits](https://kusdoc2.azurewebsites.net/docs/concepts/querylimits.html) section).

This limit is currently not configurable, but we are working on improving this scenario.


## Using Query Parameters

You can use Query Parameters to modify your query dynamically. 

### Using a Query Parameter in the connection details

1. Open the relevant query with the Advanced Editor 
2. Find the following section of the query:

   ```Source = Kusto.Contents("<Cluster>", "<Database>", "<Query>", [])```
   
   For example:

   ```Source = Kusto.Contents("help", "Samples", "StormEvents | where State == 'ALABAMA' | take 100", [])```

3. Replace the relevant part of the query with your parameter. Splitting the query into multiple parts, and concatenate them back using the & sign, along with the parameter.

   For example, in the query above, we'll take the ```State == 'ALABAMA'``` part, and split it to: ```State == '``` and ```'``` and we'll place the ```State``` parameter between them:
   
   ```"StormEvents | where State == '" & State & "' | take 100"```

4. If your query contains double-quotes, make sure to encode them correctly. For example, if we have the query: 

   ``` "StormEvents | where State == "ALABAMA" | take 100" ```

   If will appear in the Advanced Editor as (notice the 2 double-quotes):

   ```"StormEvents | where State == ""ALABAMA"" | take 100"```

   And it should be replaced with (notice the 3 double-quotes):

   ```"StormEvents | where State == """ & State """ | take 100"```


### Using a Query Parameter in the query steps

You can use Query Parameters to in any query step that supports it. For example, to filter the results based on the value of a Parameter:

![alt text](./Images/KustoTools-PowerBIConnector/Filter-using-parameter.png "Filter-using-parameter")


## Supported functions

The following operations are supported by the connector, and will be translated to
the [Kusto Query Language](../query/essentials/index.md). Functions and
operations that are not supported will be handled by the Power BI client.

> **Note**: This list of functions is not complete, and some Power BI, which are
implemented as compositions of other functions are also supported. 

* Byte.From
* Currency.From
* Date.AddDays
* Date.Day
* Date.Month
* Date.Year
* Date.DayOfWeek
* Date.DayOfYear
* Date.WeekOfYear
* Date.WeekOfMonth
* Date.StartOfDay
* Date.StartOfWeek
* Date.StartOfMonth
* Date.StartOfQuarter
* Date.StartOfYear
* Date.EndOfDay
* Date.EndOfWeek
* Date.EndOfMonth
* Date.EndOfYear
* Date.IsInPreviousYear
* Date.IsInPreviousMonth
* Date.IsInCurrentYear
* Date.IsInCurrentQuarter
* Date.IsInCurrentMonth
* Date.IsInNextYear
* Date.IsInNextMonth
* Date.IsInYearToDate
* Date.From
* Date.FromText
* Date.ToText
* DateTime.Date
* DateTime.FixedLocalNow
* DateTime.From
* DateTime.FromText
* DateTime.IsInPreviousNHours
* DateTime.IsInPreviousNMinutes
* DateTime.IsInPreviousNSeconds
* DateTime.IsInPreviousHour
* DateTime.IsInPreviousMinute
* DateTime.IsInPreviousSecond
* DateTime.IsInCurrentHour
* DateTime.IsInCurrentMinute
* DateTime.IsInCurrentSecond
* DateTime.IsInNextHour
* DateTime.IsInNextMinute
* DateTime.IsInNextSecond
* DateTime.IsInNextNHours
* DateTime.IsInNextNMinutes
* DateTime.IsInNextNSeconds
* DateTime.LocalNow
* DateTime.Time
* DateTime.ToText
* Decimal.From
* Duration.FromText
* Duration.ToText
* Int8.From
* Int16.From
* Int32.From
* Int64.From
* Json.Document
* List.Sum
* List.Average
* List.Count
* List.Max
* List.Min
* List.Sum
* List.First
* List.Last
* List.Range
* List.Contains
* List.NotContains  
* Number.FromText
* Number.IsEven
* Number.IsOdd
* Number.From
* Number.Mod
* Number.Random
* Number.RandomBetween
* Number.Round
* Number.RoundDown
* Number.RoundUp
* Number.RoundTowardZero
* Number.RoundAwayFromZero
* Number.Abs
* Number.Sign
* Number.IntegerDivide
* Number.Sqrt
* Number.Ln
* Number.Log10
* Number.Log
* Number.Exp
* Number.Power
* Number.BitwiseAnd
* Number.BitwiseOr
* Number.BitwiseNot
* Number.BitwiseXor
* Single.From                    
* Table.RowCount
* Table.SelectRows
* Text.From
* Text.At
* Text.Combine
* Text.Contains
* Text.NotContains
* Text.End
* Text.EndsWith
* Text.NotEndsWith
* Text.Length
* Text.Lower
* Text.Middle
* Text.Range
* Text.Remove
* Text.RemoveRange
* Text.Replace
* Text.ReplaceRange
* Text.Start
* Text.StartsWith
* Text.NotStartsWith
* Text.Upper
* Text.Insert
* Text.Split
* Text.FromBinary
* Text.Trim
* Text.TrimStart
* Text.TrimEnd
* Time.StartOfHour
* Time.EndOfHour
* Time.Hour
* Time.Minute
* Time.Second
* Time.ToText
* Uri.Parts