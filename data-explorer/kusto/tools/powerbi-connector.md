---
title: Power BI Kusto Connector - Azure Data Explorer | Microsoft Docs
description: This article describes Power BI Kusto Connector in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# Power BI Kusto Connector

The Power BI Kusto Connector is a Power BI Desktop connector for Azure Data Explorer,
which lets you visually build (efficient) Kusto queries using the Power BI query editor. 

## Using the connector

1. Open Power BI Desktop (download from here: https://powerbi.microsoft.com/desktop). 
2. Click the Get Data button:

![alt text](./Images/KustoTools-PowerBIConnector/step2.png "step2")

3. Select the Azure Data Explorer connector:

![alt text](./Images/KustoTools-PowerBIConnector/step3.png "step3")

4. Enter the Cluster (and optionally Database and Table/Query) details:

![alt text](./Images/KustoTools-PowerBIConnector/step4.png "step4")

Select the _Data Connectivity mode_ you'd like to use - `Import` or `Direct Query`. You can ready about the differences between the two in the [Power BI Desktop documentation](https://docs.microsoft.com/power-bi/desktop-directquery-about).

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
Kusto cluster in order to query it in Power BI - see [Authorization and Roles Based Access Control](../management/access-control/role-based-authorization.md) for details)

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
read about the differences between the two modes in the [Power BI Desktop documentation](https://docs.microsoft.com/power-bi/desktop-directquery-about)).

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

### Reaching Kusto query limits 

Kusto queries return by default up to 500,000 rows or 64MB, as described in the [Query Limits](../concepts/querylimits.md) section). You can override these defaults using the Advances options section of the connection form:

![alt text](./Images/KustoTools-PowerBIConnector/step4.png "step4")

These options issue [set statements](../query/setstatement.md) with your query, so change Kusto's query limits:

  * **Limit query result record number** generates a `set truncationmaxrecords`
  * **Limit query result data size in Bytes** generates a `set truncationmaxsize`
  * **Disable result-set truncation** generates a `set notruncation`


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

   ```"StormEvents | where State == """ & State & """ | take 100"```


### Using a Query Parameter in the query steps

You can use Query Parameters to in any query step that supports it. For example, to filter the results based on the value of a Parameter:

![alt text](./Images/KustoTools-PowerBIConnector/Filter-using-parameter.png "Filter-using-parameter")
