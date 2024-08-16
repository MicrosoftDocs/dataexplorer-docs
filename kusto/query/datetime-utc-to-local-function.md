---
title:  datetime_utc_to_local()
description:  This article describes the datetime_utc_to_local function.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 08/11/2024
---
# datetime_utc_to_local()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts UTC [datetime](scalar-data-types/datetime.md) to local datetime using a [time-zone specification](timezone.md).

## Syntax

`datetime_utc_to_local(`*from*`,`*timezone*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *from* | `datetime` |  :heavy_check_mark: | The UTC datetime to convert.|
| *timezone* | `string` |  :heavy_check_mark: | The timezone to convert to. This value must be one of the supported [timezones](timezone.md).|

## Returns

A local datetime in the *timezone* that corresponds the UTC datetime.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUUgpsc3LL9fQ5OWqUUitKEnNS1EoSEzOTMtMjk8pUbBVSEksSS3JzE2NLy1Jji/Jj8/JT07M0Ugp0VFQDw3WD4AoVdfUUUhOzEtKLSpKJKjNsbS4pCgxJzNR3xmqRR3Z9pTMtDSgAUiO0EU2GwCn09zktgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print dt=now()
| extend pacific_dt = datetime_utc_to_local(dt, 'US/Pacific'), canberra_dt = datetime_utc_to_local(dt, 'Australia/Canberra')
| extend diff = pacific_dt - canberra_dt
```

**Output**

|dt|pacific_dt|canberra_dt|diff|
|---|---|---|---|
|2022-07-11 22:18:48.4678620|2022-07-11 15:18:48.4678620|2022-07-12 08:18:48.4678620|-17:00:00|

## Related content

* To convert a datetime from local to UTC, see [datetime_local_to_utc()](datetime-local-to-utc-function.md)
* [Timezones](timezone.md)
* [List of supported timezones](datetime-list-timezones.md)
* [format_datetime()](format-datetime-function.md)
