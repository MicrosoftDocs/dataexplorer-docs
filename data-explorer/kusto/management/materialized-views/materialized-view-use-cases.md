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

* **Update data:** Update data by returning the last record per entity using [`arg_max()` (aggregation function)](../../query/arg-max-aggregation-function.md). For example, create a view that only materializes records ingested from now on:

    ```kusto
    .create materialized-view ArgMax on table T
    {
        T | summarize arg_max(Timestamp, *) by User
    }
    ```

* **Reduce the resolution of data** Reduce the resolution of data by calculating periodic statistics over the raw data. Use various [aggregation functions](materialized-view-create.md#supported-aggregation-functions) by period of time. For example, maintain an up-to-date snapshot of distinct users per day:

    ```kusto
    .create materialized-view UsersByDay on table T
    {
        T | summarize dcount(User) by bin(Timestamp, 1d)
    }
    ```

* **Deduplicate records:** Deduplicate records in a table using [`take_any()` (aggregation function)](../../query/take-any-aggfunction.md). For example, create a materialized view that deduplicates the source table based on the `EventId` column, using a lookback of 6 hours. Records are deduplicated against only records ingested 6 hours before current records.

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

## Advanced scenario

You can use a materialized view for create/update/delete event processing. When handling records with incomplete or outdated information for each column, a materialized view can provide the latest updates for each column, excluding entities that have been deleted.

Consider the following input table named `Events`:

**Input**

| Timestamp | cud | ID | col1 | col2 | col3 |
|--|--|--|--|--|--|
| 2023-10-24 00:00:00.0000000 | C | 1 | 1 | 2 |  |
| 2023-10-24 01:00:00.0000000 | U | 1 |  | 22 | 33 |
| 2023-10-24 02:00:00.0000000 | U | 1 |  | 23 |  |
| 2023-10-24 00:00:00.0000000 | C | 2 | 1 | 2 |  |
| 2023-10-24 00:10:00.0000000 | U | 2 |  | 4 |  |
| 2023-10-24 02:00:00.0000000 | D | 2 |  |  |  |

Create a materialized view to get the latest update per column, using the [arg_max() aggregation function](../../query/arg-max-aggregation-function.md):

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6WTUWvDIBDH3/Mpjj4ZMKBnYUzY0/YR2qcxiq22CJqOxEA39uGnSZs2pCkZMwZOz9//7vDUKsRv6wyQlfWmDsp/Sq2CCXFFYddoWYfKlgcKVkt3TMbu6PjVxKspWjPP3jOI46JCkKEoOCtwCYxJxnIKi9cFBU4h/UghYaRsnMvpNMrP6LpDbxjAqCHEAxYfsGJm/NvUkf4lcyZ5H33IwHKmxKWAt7HEhJ19ZD9gTsGUGvqr3aS7gxew+z2xdTpI0k4k+6j8+YkVjMcZd3vwnFs7Bmo4UsN/qImRmpihFgutG+9VZb8NqOqw8epEhjV3XRupu27sOnnKLbruvudun0gO26/4PH4BCngxSkwDAAA=" target="_blank">Run the query</a>

```kusto
.create materialized-view ItemHistory on table Events
{
    Events
    | extend Timestamp_col1 = iff(isnull(col1), datetime(1970-01-01), Timestamp),
                Timestamp_col2 = iff(isnull(col2), datetime(1970-01-01), Timestamp),
                Timestamp_col3 = iff(isnull(col3), datetime(1970-01-01), Timestamp)
    | summarize arg_max(Timestamp_col1, col1), arg_max(Timestamp_col2, col2), arg_max(Timestamp_col3, col3), arg_max(Timestamp, cud) by id
}
```

**Output**

| ID | Timestamp_col1 | col1 | Timestamp_col2 | col2 | Timestamp_col3 | col3 | Timestamp | cud |
|--|--|--|--|--|--|--|--|--|
| 2 | 2023-10-24 00:00:00.0000000 | 1 | 2023-10-24 00:10:00.0000000 | 4 | 1970-01-01 00:00:00.0000000 |  | 2023-10-24 02:00:00.0000000 | D |
| 1 | 2023-10-24 00:00:00.0000000 | 1 | 2023-10-24 02:00:00.0000000 | 23 | 2023-10-24 01:00:00.0000000 | 33 | 2023-10-24 02:00:00.0000000 | U |

You can create a [stored function](../../query/schema-entities/stored-functions.md) to further clean the results:

```kusto
ItemHistory
| project Timestamp, cud, id, col1, col2, col3
| where cud != "D"
| project-away cud
```

**Final Output**

The latest update for each column for ID `1`, since ID `2` was deleted.

| Timestamp | ID | col1 | col2 | col3 |
|--|--|--|--|--|
| 2023-10-24 02:00:00.0000000 | 1 | 1 | 23 | 33 |

## Materialized views vs. update policies

Materialized views and update policies work differently and serve different use cases. Use the following guidelines to identify which one you should use:

* Materialized views are suitable for *aggregations*, while update policies aren't. Update policies run separately for each ingestion batch, and therefore can only perform aggregations within the same ingestion batch. If you require an aggregation query, always use materialized views.

* Update policies are useful for data transformations, enrichments with dimension tables (usually using [lookup operator](../../query/lookupoperator.md)) and other data manipulations that can run in the scope of a single ingestion.

* Update policies run during ingestion time. Data isn't available for queries in the source table or the target table until all update policies run. Materialized views, on the other hand, aren't part of the ingestion pipeline. The [materialization process](materialized-view-overview.md#how-materialized-views-work) runs periodically in the background, post ingestion. Records in source table are available for queries before they're materialized.

* Both update policies and materialized views can incorporate [joins](../../query/join-operator.md), but their effectiveness is limited to specific scenarios. Specifically, joins are suitable only when the data required for the join from both sides is accessible at the time of the update policy or materialization process. If matching entities are ingested when the update policy or materialization runs, there's a risk of overlooking data. See more about `dimension tables` in  [materialized view query parameter](materialized-view-create.md#query-parameter) and in [fact and dimension tables](../../concepts/fact-and-dimension-tables.md).
  
> [!NOTE]
> If you do need to *materialize* joins, which are not suitable for update policies and materialized views, you can orchestrate your own process for doing so, using [orchestration tools](../../../tools-integrations-overview.md#orchestration) and [ingest from query commands](../data-ingestion/ingest-from-query.md).


## Related content

* [Materialized views overview](materialized-view-overview.md)
* [Materialized views policies](materialized-view-policies.md)
* [Materialized views limitations and known issues](materialized-views-limitations.md)
* [Monitor materialized views](materialized-views-monitoring.md)
* [`.create materialized view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [`{.disable | .enable} materialized-view`](materialized-view-enable-disable.md)
