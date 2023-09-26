---
title:  Materialized views policies
description: This article describes materialized views policies in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 04/30/2023
---

# Materialized views policies

This article includes information about policies that can be set on materialized views.

## Retention and caching policy

A materialized view has a [retention policy](../retentionpolicy.md) and [caching policy](../cachepolicy.md). The materialized view derives the database retention and caching policies by default. These policies can be changed using [retention policy management commands](../show-table-retention-policy-command.md) or [caching policy management commands](../show-table-cache-policy-command.md).

Both policies are applied on the *materialized part* of the materialized view only.  For an explanation of the differences between the *materialized part* and *delta part*, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work). For example, if the caching policy of a materialized view is set to 7d, but the caching policy of its source table is set to 0d, there may still be disk misses when querying the materialized view. This behavior occurs because the source table (*delta part*) also participates in the query.

The retention policy of the materialized view is unrelated to the retention policy of the source table. Retention policy of source table can be shorter than the retention policy of the materialized view, if source records are required for a shorter period. We recommend a minimum retention policy of at least few days, and recoverability set to true on the source table. This setting allows for fast recovery for errors and for diagnostic purposes.

> [!NOTE]
> Zero retention policy on the source table isn't supported.

The retention and caching policies both depend on [Extent Creation time](../extents-overview.md#extent-creation-time). The last update for a record determines the extent creation time for a materialized view.

> [!NOTE]
> The materialization process attempts to minimize the amount of updates to the [materialized part of the view](materialized-view-overview.md#how-materialized-views-work). In cases where a record doesn't *have* to be updated in the view, it won't be updated. For example, when the materialized view is a `take_any(*)` aggregation, new records of same group-by keys won't be re-ingested into the view, and therefore the retention policy would be by earliest record ingested.

## Partitioning policy

A [partitioning policy](../partitioningpolicy.md) can be applied on a materialized view. We recommend configuring a partitioning policy on a materialized view only when most or all of the view queries filter by one of the materialized view's group-by keys. This situation is common in multi-tenant solutions, where one of the materialized view's group-by keys is the tenant's identifier (for example, `tenantId`, `customerId`). For more information, see the first use case described in the [partitioning policy supported scenarios](../partitioningpolicy.md#supported-scenarios) page.

For the commands to alter a materialized view's partitioning policy, see [partitioning policy commands](../show-table-partitioning-policy-command.md).

Adding a partitioning policy on a materialized view increases the number of extents in the materialized view, and creates more "work" for the materialization process. For more information on the reason for this behavior, see the extents rebuild process mentioned in [how materialized views work](materialized-view-overview.md#how-materialized-views-work).

## Row level security policy

A [row level security](../rowlevelsecuritypolicy.md) can be applied on a materialized view, with several limitations:

* The policy can be applied only to materialized views with [arg_max()](../../query/arg-max-aggfunction.md)/[arg_min()](../../query/arg-min-aggfunction.md)/[take_any()](../../query/take-any-aggfunction.md) aggregation functions.
* The policy is applied to the [materialized part](materialized-view-overview.md#how-materialized-views-work) of the view only.
  * If the same row level security policy isn't defined on the source table of the materialized view, then querying the materialized view may return records that should be hidden by the policy. This happens because [querying the materialized view](materialized-view-overview.md#materialized-views-queries) queries the source table as well.
  * We recommend defining the same row level security policy both on the source table and the materialized view if the view is an [arg_max()](../../query/arg-max-aggfunction.md) or [arg_min()](../../query/arg-min-aggfunction.md)/[take_any()](../../query/take-any-aggfunction.md).
* When defining a row level security policy on the source table of an [arg_max()](../../query/arg-max-aggfunction.md) or [arg_min()](../../query/arg-min-aggfunction.md)/[take_any()](../../query/take-any-aggfunction.md) materialized view, the command fails if there's no row level security policy defined on the materialized view itself. The purpose of the failure is to alert the user of a potential data leak, since the materialized view may expose information. To mitigate this error, do one of the following actions:
  * Define the row level security policy over the materialized view.
  * Choose to ignore the error by adding `allowMaterializedViewsWithoutRowLevelSecurity` property to the alter policy command. For example:

```kusto
    .alter table SourceTable policy row_level_security enable with (allowMaterializedViewsWithoutRowLevelSecurity=true) "RLS_function"
```

For commands for configuring a row level security policy on a materialized view, see [row_level_security policy commands](../show-table-row-level-security-policy-command.md).
