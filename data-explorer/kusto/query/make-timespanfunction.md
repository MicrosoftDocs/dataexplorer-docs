---
title: make-timespan() (Azure Kusto)
description: This article describes make-timespan() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# make-timespan()

Creates a [timespan](./scalar-data-types/timespan.md) scalar value from the specified time period.

    make-timespan(1,12,30,55.123) == time(1.12:30:55.123)

**Syntax**

`make-timespan(`*hour*,*minute*`)`

`make-timespan(`*hour*,*minute*,*second*`)`

`make-timespan(`*day*,*hour*,*minute*,*second*`)`

**Arguments**

* *day*: day (a positive integer value)
* *hour*: hour (an integer value, from 0 to 23)
* *minute*: minute (an integer value, from 0 to 59)
* *second*: second (a real value, from 0 to 59.9999999)

**Returns**

If creation is successful, result will be a [timespan](./scalar-data-types/timespan.md) value, otherwise, result will be null.
 
**Example**

```kusto
print ['timespan'] = make-timespan(1,12,30,55.123)

```

|timespan|
|---|
|1.12:30:55.1230000|


