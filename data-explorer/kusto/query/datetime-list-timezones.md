---
title:  "datetime_list_timezones()"
description: Get a list of all supported timezones.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 08/11/2024
---
# datetime_list_timezones()

Provides a list of supported timezones [a time-zone specification](timezone.md).

## Syntax

`datetime_list_timezones()`

## Parameters

None, the function doesn't have any parameters.

## Returns

Returns a list of timezones supported by the [Internet Assigned Numbers Authority (IANA) Time Zone Database](https://www.iana.org/time-zones).

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJLEktycxNjc%2FJLC6JB7Gq8vNSizU0AQnW1vofAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print datetime_list_timezones()
```

**Output**
print datetime_list_timezones()

## Related content

* To convert from UTC to local, see [datetime_utc_to_local()](datetime-utc-to-local-function.md)
* To convert a datetime from local to UTC, see [datetime_local_to_utc()](datetime-local-to-utc-function.md)
* [Timezones](timezone.md)
* [format_datetime()](format-datetime-function.md)
