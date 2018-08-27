---
title: make-datetime() (Azure Kusto)
description: This article describes make-datetime() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# make-datetime()

Creates a [datetime](./scalar-data-types/datetime.md) scalar value from the specified date and time.

    make-datetime(2017,10,01,12,10) == datetime(2017-10-01 12:10)

**Syntax**

`make-datetime(`*year*,*month*,*day*`)`

`make-datetime(`*year*,*month*,*day*,*hour*,*minute*`)`

`make-datetime(`*year*,*month*,*day*,*hour*,*minute*,*second*`)`

**Arguments**

* *year*: year (an integer value, from 0 to 9999)
* *month*: month (an integer value, from 1 to 12)
* *day*: day (an integer value, from 1 to 28-31)
* *hour*: hour (an integer value, from 0 to 23)
* *minute*: minute (an integer value, from 0 to 59)
* *second*: second (a real value, from 0 to 59.9999999)

**Returns**

If creation is successful, result will be a [datetime](./scalar-data-types/datetime.md) value, otherwise, result will be null.
 
**Example**

```kusto
print year-month-day = make-datetime(2017,10,01)
```

|year-month-day|
|---|
|2017-10-01 00:00:00.0000000|




```kusto
print year-month-day-hour-minute = make-datetime(2017,10,01,12,10)
```

|year-month-day-hour-minute|
|---|
|2017-10-01 12:10:00.0000000|




```kusto
print year-month-day-hour-minute-second = make-datetime(2017,10,01,12,11,0.1234567)
```

|year-month-day-hour-minute-second|
|---|
|2017-10-01 12:11:00.1234567|

