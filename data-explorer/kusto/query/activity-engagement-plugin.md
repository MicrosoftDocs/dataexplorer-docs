---
title: activity-engagement plugin (Azure Kusto)
description: This article describes activity-engagement plugin in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# activity-engagement plugin

Calculates activity engagement ratio based on ID column over a sliding timeline window.

activity-engagement plugin can be used for calculating DAU/WAU/MAU (daily/weekly/monthly activities).

    T | evaluate activity-engagement(id, datetime-column, 1d, 30d)

**Syntax**

*T* `| evaluate` `activity-engagement(`*IdColumn*`,` *TimelineColumn*`,` [*Start*`,` *End*`,`] *InnerActivityWindow*`,` *OuterActivityWindow* [`,` *dim1*`,` *dim2*`,` ...]`)`

**Arguments**

* *T*: The input tabular expression.
* *IdColumn*: The name of the column with ID values that represent user activity. 
* *TimelineColumn*: The name of the column that represent timeline.
* *Start*: (optional) Scalar with value of the analysis start period.
* *End*: (optional) Scalar with value of the analysis end period.
* *InnerActivityWindow*: Scalar with value of the inner-scope analysis window period.
* *OuterActivityWindow*: Scalar with value of the outer-scope analysis window period.
* *dim1*, *dim2*, ...: (optional) list of the dimensions columns that slice the activity metrics calculation.

**Returns**

Returns a table that has (distinct count of ID values inside inner-scope window, distinct count of ID values inside outer-scope window, and the activity ratio)for each inner-scope window period and for eaach existing dimensions combination.

Output table schema is:

|TimelineColumn|dcount-activities-inner|dcount-activities-outer|activity-ratio|dim1|..|dim-n|
|---|---|---|---|--|--|--|--|--|--|
|type: as of *TimelineColumn*|long|long|double|..|..|..|


**Examples**

### DAU/WAU calculation

The following example calculates DAU/WAU (Daily Active Users / Weekly Active Users ratio) over a randomly generated data.

```kusto
// Generate random data of user activities
let _start = datetime(2017-01-01);
let _end = datetime(2017-01-31);
range _day from _start to _end  step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+100*r-1), 1) 
| mvexpand id=_users to typeof(long) limit 1000000
// Calculate DAU/WAU ratio
| evaluate activity-engagement(['id'], _day, _start, _end, 1d, 7d)
| project _day, Dau-Wau=activity-ratio*100 
| render timechart 
```

![](./images/queries/activity-engagement-dau-wau.png)

### DAU/MAU calculation

The following example calculates DAU/WAU (Daily Active Users / Weekly Active Users ratio) over a randomly generated data.

```kusto
// Generate random data of user activities
let _start = datetime(2017-01-01);
let _end = datetime(2017-05-31);
range _day from _start to _end  step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+100*r-1), 1) 
| mvexpand id=_users to typeof(long) limit 1000000
// Calculate DAU/MAU ratio
| evaluate activity-engagement(['id'], _day, _start, _end, 1d, 30d)
| project _day, Dau-Mau=activity-ratio*100 
| render timechart 
```

![](./images/queries/activity-engagement-dau-mau.png)

### DAU/MAU calculation with additional dimensions

The following example calculates DAU/WAU (Daily Active Users / Weekly Active Users ratio) over a randomly generated data with additional dimension (`mod3`).

```kusto
// Generate random data of user activities
let _start = datetime(2017-01-01);
let _end = datetime(2017-05-31);
range _day from _start to _end  step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+100*r-1), 1) 
| mvexpand id=_users to typeof(long) limit 1000000
| extend mod3 = strcat("mod3=", id % 3)
// Calculate DAU/MAU ratio
| evaluate activity-engagement(['id'], _day, _start, _end, 1d, 30d, mod3)
| project _day, Dau-Mau=activity-ratio*100, mod3 
| render timechart 
```

![](./images/queries/activity-engagement-dau-mau-mod3.png)
