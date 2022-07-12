---
title: datetime_local_to_utc() - Azure Data Explorer
description: This article describes the datetime_local_to_utc function in Azure Data Explorer.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 07/12/2022
---
# datetime_utc_to_local()

Converts from local [datetime](./scalar-data-types/datetime.md) in the [timezone](https://www.iana.org/time-zones) to the UTC [datetime](./scalar-data-types/datetime.md).

## Syntax

`datetime_local_to_utc(`*from*`,`*timezone*`)`

## Arguments

* *from*: local [datetime](./scalar-data-types/datetime.md).
* *timezone*: [string](./scalar-data-types/string.md). The timezone string must be supported by the [Internet Assigned Numbers Authority (IANA) Time Zone Database](https://www.iana.org/time-zones).

## Returns

A UTC [datetime](./scalar-data-types/datetime.md) that corresponds the local [datetime](./scalar-data-types/datetime.md) in the specified `timezone`.

## Example

```kusto
datatable(local_dt: datetime, tz: string)
[ datetime(2020-02-02 20:02:20), 'US/Pacific', 
  datetime(2020-02-02 20:02:20), 'America/Chicago', 
  datetime(2020-02-02 20:02:20), 'Europe/Paris']
| extend utc_dt = datetime_local_to_utc(local_dt, tz)
```

**Output**

|local_dt|tz|utc_dt|
|---|---|---|
|2020-02-02 20:02:20.0000000|Europe/Paris|2020-02-02 19:02:20.0000000|
|2020-02-02 20:02:20.0000000|America/Chicago|2020-02-03 02:02:20.0000000|
|2020-02-02 20:02:20.0000000|US/Pacific|2020-02-03 04:02:20.0000000|

## See also

* To convert from UTC to local, see [datetime_utc_to_local()](datetime_utc_to_local.md).
