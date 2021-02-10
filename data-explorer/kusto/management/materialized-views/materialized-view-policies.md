---
title: Materialized views policies - Azure Data Explorer
description: This article describes materialized views policies in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---

# Materialized views policies

## Retention and caching policy

A materialized view has a [retention policy](../retentionpolicy.md) and [caching policy](../cachepolicy.md), like any Azure Data Explorer table.

The materialized view derives the database retention and caching policies by default. These policies can be changed using [retention policy control commands](../retention-policy.md) or [caching policy control commands](../cache-policy.md).

* Both policies are applied on the *materialized part* of the materialized view only.  For an explanation of the differences between the *materialized part* and *delta* part, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).
  * Ffor example, if the caching policy of a materialized view is set to 7d, but the caching policy of its source table is set to 0d, there may still be disk misses when querying the materialized view. This will happen because the source table (*delta part*) participates in the query as well.
* The retention policy of the materialized view is unrelated to the retention policy of the source table.
* If the source table records aren't otherwise used, the retention policy of the source table can be dropped to a minimum. The materialized view will still store the data according to the retention policy set on the view.
* While materialized views are in preview mode, the recommendation is to allow a minimum of at least seven days and recoverability set to true. This setting allows for fast recovery for errors and for diagnostic purposes.

> [!NOTE]
> Zero retention policy on the source table is currently not supported.

## Partitioning policy

[Partitioning policy](../partitioningpolicy.md) can be applied on a materialized view. Configuring a partitioning policy on a materialized view is recommended when most or all of the view queries filter by one of the materialized view's group-by keys. This is typically common in multi-tenant solutions, where one of the materialized view's group-by keys is the tenant's identifer (e.g., `tenantId`, `customerId`). See the 1st use case described in the [partitioning policy common scenarios](../partitioningpolicy.md#common-scenarios) page.

The commands to alter a materialized view's partitioning policy are documented in the [partitioning policy commands](../partitioning-policy.md#alter-and-alter-merge-policy) page.

Adding a partitioning policy on a materialized views will naturally increase the number of extents in the materialized view, and will create more "work" for the materialization process (why? see the extents rebuild process mentioned in [how materialized views work](materialized-view-overview.md#how-materialized-views-work)). In [EngineV3](../../../engine-v3.md) clusters, this process is much more efficient than in V2. Therefore, **it it recommended to add a partitioning policy on a materialized view only if the cluster is a V3 cluster (preview).**

## Row level security policy

A [row level security](../rowlevelsecuritypolicy.md) can be applied on a materialized view, with several limitations:

* The policy can be applied only to materialized views with [arg_max()](../../query/arg-max-aggfunction.md)/[arg_min()](../../query/arg-min-aggfunction.md)/[any()](../../query/any-aggfunction.md) aggregation functions.
* The policy is applied to the [materialized part](materialized-view-overview.md#how-materialized-views-work) of the view only.
  * If the same RLS policy is **not** defined on the source table of the materialized view, then querying the materialized view may return records that should be hidden by the policy (since [querying the materialized view](materialized-view-overview.md#materialized-views-queries) queries the source table as well).
  * Typically, it is recommended to define the same RLS policy both on the source table and the materialized view (if it is an [arg_max()](../../query/arg-max-aggfunction.md)/[arg_min()](../../query/arg-min-aggfunction.md)/[any()](../../query/any-aggfunction.md) view).

* When defining a RLS policy on a *source* table of an [arg_max()](../../query/arg-max-aggfunction.md)/[arg_min()](../../query/arg-min-aggfunction.md)/[any()](../../query/any-aggfunction.md) materialized view, the command will fail if there is no RLS policy defined on the materialized view itself. The purpose of the failure is to alert the user of a potential data leak, since the materialized view may expose similar information as the source table, but an RLS is defined only on the source table. To mitigate this error you can:
  * Define the RLS over the materialized view.
  * Choose to ignore the error by adding `allowMaterializedViewsWithoutRowLevelSecurity` property to the alter policy command. For example:

```kusto
    .alter table SourceTable policy row_level_security enable with (allowMaterializedViewsWithoutRowLevelSecurity=true) "RLS_function"
```

Commands for configuring a row level security policy on a materialized view are documented in the [row_level_security policy commands](../row-level-security-policy.md) page.
