---
title:  Materialized views use cases
description: Learn about common and advanced use cases for materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 11/16/2023
---

# Materialized views use cases

[Materialized views](materialized-view-overview.md) expose an *aggregation* query over a source table or another materialized view. This article covers common and advanced use cases for materialized views.

## Common use cases

The following are common scenarios that can be addressed by using a materialized view:

* **Update data:** Update data by returning the last record per entity using [`arg_max()` (aggregation function)](../../query/arg-max-aggfunction.md). For example, create a view that will materialize only records ingested from now on:

    ```kusto
    .create materialized-view ArgMax on table T
    {
        T | summarize arg_max(Timestamp, *) by User
    }
    ```

* **Reduce the resolution of data** Reduce the resolution of data by calculating periodic statistics over the raw data. Use various [aggregation functions](materialized-view-create.md#supported-aggregation-functions) by period of time. For example, maintain an up-to-date snapshot of distinct users per day:

    ```kusto
    .create materialized-view ArgMax on table T
    {
        T | summarize dcount(User) by bin(Timestamp, 1d)
    }
    ```

* **Deduplicate records:** Deduplicate records in a table using [`take_any()` (aggregation function)](../../query/take-any-aggfunction.md). For example, create a materialized view that deduplicates the source table based on the `EventId` column, using a lookback of 6 hours. Records will be deduplicated against only records ingested 6 hours before current records.

    ```kusto
    .create materialized-view with(lookback=6h) DeduplicatedTable on table T
    {
        T
        | summarize take_any(*) by EventId
    }
    ```

    > [!NOTE]
    > You can conceal the source table by creating a function with the same name as the table that references the materialized view instead. This pattern ensures that callers querying the table access the deduplicated materialized view because [functions override tables with the same name](../../query/schema-entities/tables.md). To avoid cyclic references in the view definition, use the [table()](../../query/tablefunction.md) function to reference the source table: 
    >
    >    ```kusto
    >    .create materialized-view DeduplicatedTable on table T
    >    {
    >        table('T')
    >        | summarize take_any(*) by EventId
    >    } 
    >    ```

For more examples, see the [.create materialized-view command](materialized-view-create.md#examples).

## Advanced scenarios

## Related content

* [Materialized views overview](materialized-view-overview.md)
* [Materialized views policies](materialized-view-policies.md)
* [Materialized views limitations and known issues](materialized-views-limitations.md)
* [Monitor materialized views](materialized-views-monitoring.md)
* [`.create materialized view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [`{.disable | .enable} materialized-view`](materialized-view-enable-disable.md)
