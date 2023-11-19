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

The following are advanced scenarios that can be addressed by using a materialized view:

* **Create/Update/Delete event processing:** Given an input of create/update/delete records, in which the data doesn't contain the latest information for each column, you can use a materialized view to get the latest update for each column. Since delete records indicate that the entire record should be deleted, the latest updates for each column will only be shown for the entities that weren't deleted. 

    To implement such a materialized view, use the [`arg_max()` (aggregation function)](../../query/arg-max-aggfunction.md) per column. Consider the following input table:

    **Input**

    | Timestamp | cud | id | col1 | col2 | col3 |
    |--|--|--|--|--|--|
    | 2023-10-24 00:00:00.0000000 | C | 1 | 1 | 2 |  |
    | 2023-10-24 01:00:00.0000000 | U | 1 |  | 22 | 33 |
    | 2023-10-24 02:00:00.0000000 | U | 1 |  | 23 |  |
    | 2023-10-24 00:00:00.0000000 | C | 2 | 1 | 2 |  |
    | 2023-10-24 00:10:00.0000000 | U | 2 |  | 4 |  |
    | 2023-10-24 02:00:00.0000000 | D | 2 |  |  |  |
    
    ```kusto
    .create materialized-view ItemHistory on table T
    {
        T
        | extend Timestamp_col1 = iff(isnull(col1), datetime(1970-01-01), Timestamp),
                 Timestamp_col2 = iff(isnull(col2), datetime(1970-01-01), Timestamp),
                 Timestamp_col3 = iff(isnull(col3), datetime(1970-01-01), Timestamp)
        | summarize arg_max(Timestamp_col1, col1), arg_max(Timestamp_col2, col2), arg_max(Timestamp_col3, col3), arg_max(Timestamp, cud) by id
    }
    ```

    **Output**

    | id | Timestamp_col1 | col1 | Timestamp_col2 | col2 | Timestamp_col3 | col3 | Timestamp | cud |
    |--|--|--|--|--|--|--|--|--|
    | 2 | 2023-10-24 00:00:00.0000000 | 1 | 2023-10-24 00:10:00.0000000 | 4 | 1970-01-01 00:00:00.0000000 |  | 2023-10-24 02:00:00.0000000 | D |
    | 1 | 2023-10-24 00:00:00.0000000 | 1 | 2023-10-24 02:00:00.0000000 | 23 | 2023-10-24 01:00:00.0000000 | 33 | 2023-10-24 02:00:00.0000000 | U |

    To view specific information, create a [stored function](../../query/schema-entities/stored-functions.md) to manipulate the results:

    ```kusto
    ItemHistory
    | project Timestamp, cud, id, col1, col2, col3
    | where cud != "D"
    | project-away cud
    ```

    **Final Output**

    The latest update for each column for id `1`, since id `2` was deleted.

    | Timestamp | id | col1 | col2 | col3 |
    |--|--|--|--|--|
    | 2023-10-24 02:00:00.0000000 | 1 | 1 | 23 | 33 |

## Related content

* [Materialized views overview](materialized-view-overview.md)
* [Materialized views policies](materialized-view-policies.md)
* [Materialized views limitations and known issues](materialized-views-limitations.md)
* [Monitor materialized views](materialized-views-monitoring.md)
* [`.create materialized view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [`{.disable | .enable} materialized-view`](materialized-view-enable-disable.md)
