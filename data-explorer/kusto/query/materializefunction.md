---
title: materialize() - Azure Data Explorer | Microsoft Docs
description: This article describes materialize() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# materialize()

Allows caching a sub-query result during the time of query execution in a way that other subqueries can reference the partial result.

 
**Syntax**

`materialize(`*expression*`)`

**Arguments**

* *expression*: Tabular expression to be evaluated and cached during query execution.

**Tips**

* Use materialize when you have join/union where their operands has mutual sub-queries that can be executed once (see the examples below).

* Materialize is allowed to be used only in let statements by giving the cached result a name.

* Materialize has a cache size limit which is **5 GB**. 
  This limit is per cluster node and is mutual for all queries running concurrently.
  If a query uses `materialize()` and the cache cannot hold any additional data,
  the query aborts with an error.

**Examples**

Assuming that we are interested in finding the Retention of Pages views.

Using `materialize()` operator to improve runtime performance:

```kusto
let totalPagesPerDay = PageViews
| summarize by Page, Day = startofday(Timestamp)
| summarize count() by Day;
let materializedScope = PageViews
| summarize by Page, Day = startofday(Timestamp);
let cachedResult = materialize(materializedScope);
cachedResult
| project Page, Day1 = Day
| join kind = inner
(
    cachedResult
    | project Page, Day2 = Day
)
on Page
| where Day2 > Day1
| summarize count() by Day1, Day2
| join kind = inner
    totalPagesPerDay
on $left.Day1 == $right.Day
| project Day1, Day2, Percentage = count_*100.0/count_1


```

|Day1|Day2|Percentage|
|---|---|---|
|2016-05-01 00:00:00.0000000|2016-05-02 00:00:00.0000000|34.0645725975255|
|2016-05-01 00:00:00.0000000|2016-05-03 00:00:00.0000000|16.618368960101|
|2016-05-02 00:00:00.0000000|2016-05-03 00:00:00.0000000|14.6291376489636|

Using self-join without caching the mutual sub-query :

```kusto
let totalPagesPerDay = PageViews	
| summarize by Page, Day = startofday(Timestamp)
| summarize count() by Day;
let subQuery = (PageViews	
| summarize by Page, Day = startofday(Timestamp));
subQuery
| project Page, Day1 = Day
| join kind = inner
(
    subQuery
    | project Page, Day2 = Day
)
on Page
| where Day2 > Day1
| summarize count() by Day1, Day2
| join kind = inner
    totalPagesPerDay
on $left.Day1 == $right.Day
| project Day1, Day2, Percentage = count_*100.0/count_1
```

|Day1|Day2|Percentage|
|---|---|---|
|2016-05-01 00:00:00.0000000|2016-05-02 00:00:00.0000000|34.0645725975255|
|2016-05-01 00:00:00.0000000|2016-05-03 00:00:00.0000000|16.618368960101|
|2016-05-02 00:00:00.0000000|2016-05-03 00:00:00.0000000|14.6291376489636|


The same works for union, for example, getting the Pages which are one of the top 2 viewed, or top 2 with bytes delivered (not in both groups): 

Using `materialize()` :

```kusto
let JunkPagesSuffix = ".jpg";
let JunkPagesSuffix = "";
let materializedScope = PageViews
| where Timestamp > datetime(2016-05-01 00:00:00.0000000)
| summarize sum(BytesDelivered), count() by Page
| where Page !endswith JunkPagesSuffix
| where isempty(Page) == false;
let cachedResult = materialize(materializedScope);
union (cachedResult | top 2 by count_ | project Page ), (cachedResult | top 2 by sum_BytesDelivered | project Page)
| summarize count() by Page | where count_ < 2 | project Page
```

|Page|
|---|
|de|
|ar|
|Special:Log/block|
|Special:Search|


Using regular union without caching the result:

```kusto
let JunkPagesSuffix = ".jpg";
let JunkPagesSuffix = "";
let subQuery = PageViews
| where Timestamp > datetime(2016-05-01 00:00:00.0000000)
| summarize sum(BytesDelivered), count() by Page
| where Page !endswith JunkPagesSuffix
| where isempty(Page) == false;
union (subQuery | top 2 by count_| project Page ), (subQuery | top 2 by sum_BytesDelivered| project Page)
| summarize count() by Page
| where count_ < 2
| project Page
```

|Page|
|---|
|Special:Log/block|
|Special:Search|
|de|
|ar|