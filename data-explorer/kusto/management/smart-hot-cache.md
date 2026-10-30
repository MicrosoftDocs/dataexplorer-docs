---
title: Smart hot cache for query acceleration
description: Learn how smart hot cache automatically adjusts the query acceleration hot period for external delta tables.
ms.reviewer: sharmaanshul
ms.topic: concept-article
ms.date: 09/22/2026
---

# Smart hot cache for query acceleration

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The [query acceleration policy](query-acceleration-policy.md) uses the `Hot` property to determine the rolling period of external delta table data to accelerate. With a static policy, you set `Hot` manually and update it as query patterns change.

Smart hot cache automatically adjusts `Hot` based on observed query patterns. You define the allowed range with `MinHot` and `MaxHot`, and the system periodically selects a value within that range.

> [!NOTE]
> Smart hot cache adjusts only the rolling `Hot` period. It doesn't create or modify `HotWindows`.

## Optimization profiles

Use the `Profile` property to control what happens when no query signal is available.

| Profile | No-signal behavior | Recommended use case |
|---|---|---|
| `Performance` | Keeps the current `Hot` value. This profile is the default. | You want to optimize for query performance. |
| `Cost` | Sets `Hot` to `MinHot`, reducing caching to the configured minimum when there are no queries. | You want to optimize cost by minimizing the hot-cache footprint during periods without query activity. |

When query signal is available, both profiles use the calculated P95 lookback constrained by `MinHot` and `MaxHot`.

## How smart hot cache works

Smart hot cache observes query patterns and adjusts `Hot` once a day based on the 95th percentile (P95) query lookback over the previous seven days. The adjusted value is constrained to the range from `MinHot` through `MaxHot`.

If you configure `HotDateTimeColumn`, smart hot cache uses query patterns for that column. Otherwise, it uses the first datetime column in the external table schema that has observed query activity.

## Configure smart hot cache

Set `MinHot` and `MaxHot` to different values to enable smart hot cache. Both properties are required.

The following example configures a range of one through 30 days and uses the default `Performance` profile:

```kusto
.alter external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "MinHot": "1.00:00:00", "MaxHot": "30.00:00:00", "Profile": "Performance"}'
```

When you configure `MinHot` and `MaxHot`, don't specify `Hot`. The system initializes `Hot` to `MinHot` and then manages its value within the configured range.

## Configuration rules

* Set `MinHot` and `MaxHot` together.
* `MinHot` must be less than or equal to `MaxHot`.
* `MinHot` must be at least one day.
* Don't specify `Hot` when configuring smart hot cache. The system manages this value.
* Enable smart hot cache only when the policy is enabled and `MinHot` and `MaxHot` have different values.
* If `MinHot` and `MaxHot` are equal, the policy uses a static `Hot` period.

## Return to a static hot period

Set `MinHot` and `MaxHot` to the same value to use a static hot period. When both values are equal, smart hot cache doesn't adjust the period.

```kusto
.alter external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "MinHot": "7.00:00:00", "MaxHot": "7.00:00:00"}'
```

## Related content

* [Query acceleration policy](query-acceleration-policy.md)
* [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md)
* [`.alter-merge query acceleration policy` command](alter-merge-query-acceleration-policy-command.md)
* [`.show query acceleration policy` command](show-query-acceleration-policy-command.md)
