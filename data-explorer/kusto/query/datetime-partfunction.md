---
title: datetime-part() (Azure Kusto)
description: This article describes datetime-part() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# datetime-part()

Extracts the requested date part as an integer value.

    datetime-part("Day",datetime(2015-12-14))

**Syntax**

`datetime-part(`*part*`,`*datetime*`)`

**Arguments**

* `date`: `datetime`.
* `part`: `string`. 

Possible values of *part*: 
- Year
- Quarter
- Month
- WeekOfYear
- Day
- DayOfYear
- Hour
- Minute
- Second
- Millisecond
- Microsecond
- Nanosecond

**Returns**

An integer representing the extracted part.

**Examples**

```kusto
let dt = datetime(2017-10-30 01:02:03.7654321); 
print 
year = datetime-part("year", dt),
quarter = datetime-part("quarter", dt),
month = datetime-part("month", dt),
weekOfYear = datetime-part("weekOfYear", dt),
day = datetime-part("day", dt),
dayOfYear = datetime-part("dayOfYear", dt),
hour = datetime-part("hour", dt),
minute = datetime-part("minute", dt),
second = datetime-part("second", dt),
millisecond = datetime-part("millisecond", dt),
microsecond = datetime-part("microsecond", dt),
nanosecond = datetime-part("nanosecond", dt)

```

|year|quarter|month|weekOfYear|day|dayOfYear|hour|minute|second|millisecond|microsecond|nanosecond|
|---|---|---|---|---|---|---|---|---|---|---|---|
|2017|4|10|44|30|303|1|2|3|765|765432|765432100|