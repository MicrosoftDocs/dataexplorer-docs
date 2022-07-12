---
title: datetime_utc_to_local() - Azure Data Explorer | Microsoft Docs

description: This article describes datetime_utc_to_local() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: 
ms.service: data-explorer
ms.topic: reference
ms.date: 07/11/2022
---
# datetime_utc_to_local()

Converts from UTC [datetime](./scalar-data-types/datetime.md) to local [datetime](./scalar-data-types/datetime.md) in the specified [timezone](https://www.iana.org/time-zones).

## Syntax

`datetime_utc_to_local(`*from*`,`*timezone*`)`

## Arguments

* `from`: UTC [datetime](./scalar-data-types/datetime.md).
* `timezone`: [string](./scalar-data-types/string.md). Timezone string is one of the supported by the [Internet Assigned Numbers Authority (IANA) Time Zone Database](https://www.iana.org/time-zones).


## Returns

A local [datetime](./scalar-data-types/datetime.md) in the `timezone` that corresponds the UTC [datetime](./scalar-data-types/datetime.md).

## Example

```kusto
print dt=now()
| extend pacific_dt = datetime_utc_to_local(dt, 'US/Pacific'), canberra_dt = datetime_utc_to_local(dt, 'Australia/Canberra')
| extend diff = pacific_dt - canberra_dt
```

|dt|pacific_dt|canberra_dt|diff|
|---|---|---|---|
|2022-07-11 22:18:48.4678620|2022-07-11 15:18:48.4678620|2022-07-12 08:18:48.4678620|-17:00:00|



## See also

* For converting from local to UTC, see [datetime_local_to_utc()](datetime_local_to_utc.md).



