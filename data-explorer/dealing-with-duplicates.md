---
title: Handle duplicate data in Azure Data Explorer
description: The article shows you various approaches to deal with duplicate data when using Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 11/03/2025
#Customer intent: I want to learn how to deal with duplicate data.
---
# Handle duplicate data in Azure Data Explorer

Devices that send data to the cloud maintain a local cache of the data. Depending on the data size, the local cache might store data for days or even months. You want to protect your analytical databases from malfunctioning devices that resend the cached data and cause data duplication in the analytical database. Duplicates can affect the number of records returned by a query. This issue is relevant when you need a precise count of records, such as when counting events. This article outlines best practices for handling duplicate data for these types of scenarios.

The best solution for data duplication is preventing the duplication. If possible, fix the issue earlier in the data pipeline. This approach saves costs associated with data movement along the data pipeline and avoids spending resources on coping with duplicate data ingested into the system. However, in situations where you can't modify the source system, you can use various methods to address this scenario.

## Understand the impact of duplicate data

Monitor the percentage of duplicate data. Once you discover the percentage of duplicate data, you can analyze the scope of the issue and business impact and choose the appropriate solution.

Sample query to identify the percentage of duplicate records:

```kusto
let _sample = 0.01; // 1% sampling
let _data =
DeviceEventsAll
| where EventDateTime between (datetime('10-01-2018 10:00') .. datetime('10-10-2018 10:00'));
let _totalRecords = toscalar(_data | count);
_data
| where rand()<= _sample
| summarize recordsCount=count() by hash(DeviceId) + hash(EventId) + hash(StationId)  // Use all dimensions that make row unique. Combining hashes can be improved
| summarize duplicateRecords=countif(recordsCount  > 1)
| extend duplicate_percentage = (duplicateRecords / _sample) / _totalRecords  
```

## Solutions for handling duplicate data

### Solution 1: Don't remove duplicate data

Understand your business requirements and tolerance for duplicate data. Some datasets can manage with a certain percentage of duplicate data. If the duplicated data doesn't have a major impact, you can ignore its presence. The advantage of not removing the duplicate data is that it adds no extra overhead on the ingestion process or query performance.

### Solution 2: Handle duplicate rows during query

Another option is to filter out the duplicate rows in the data during query. You can use the [`arg_max()`](/kusto/query/arg-max-aggregation-function?view=azure-data-explorer&preserve-view=true) aggregation function to filter out the duplicate records and return the last record based on the timestamp (or another column). The advantage of using this method is faster ingestion since deduplication occurs during query time. In addition, all records (including duplicates) are available for auditing and troubleshooting. The disadvantage of using the `arg_max` function is the extra query time and load on the CPU every time the data is queried. Depending on the amount of data being queried, this solution might become nonfunctional or memory-consuming and require switching to other options.

In the following example, we query the last record ingested for a set of columns that determine the unique records:

```kusto
DeviceEventsAll
| where EventDateTime > ago(90d)
| summarize hint.strategy=shuffle arg_max(EventDateTime, *) by DeviceId, EventId, StationId
```

You can also place this query inside a function instead of directly querying the table:

```kusto
.create function DeviceEventsView
{
    DeviceEventsAll
    | where EventDateTime > ago(90d)
    | summarize arg_max(EventDateTime, *) by DeviceId, EventId, StationId
}
```

### Solution 3: Use materialized views to deduplicate

You can use [materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true) for deduplication by using the [take_any()](/kusto/query/take-any-aggregation-function?view=azure-data-explorer&preserve-view=true)/[arg_min()](/kusto/query/arg-min-aggregation-function?view=azure-data-explorer&preserve-view=true)/[arg_max()](/kusto/query/arg-max-aggregation-function?view=azure-data-explorer&preserve-view=true) aggregation functions (see example #4 in [materialized view create command](/kusto/management/materialized-views/materialized-view-create#examples?view=azure-data-explorer&preserve-view=true)).

> [!NOTE]
> Materialized views consume cluster resources, which might not be negligible. For more information, see materialized views [performance considerations](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true#performance-considerations).

### Solution 4: Use soft delete to remove duplicates

[Soft delete](/kusto/concepts/data-soft-delete?view=azure-data-explorer&preserve-view=true) supports the ability to delete individual records, so you can use it to delete duplicates. Use this option only for infrequent deletes, not if you constantly need to deduplicate all incoming records.

#### Choose between materialized views and soft delete for data deduplication

Consider the following factors when choosing between materialized views and soft delete for deduplication:

* *Management and orchestration*: Materialized views are a fully managed solution. You define a view once, and the system handles deduplication for all incoming records. Soft delete requires orchestration and management. If materialized views work for your use case, choose this option.
* *When records are deduped*: With soft delete, you first add duplicate records to a table and then delete them. So, between the ingestion and soft delete processes, the table contains duplicates. With materialized views, records in the view are *always* deduped, as the system dedupes them *before* entering the view.
* *Frequency*: If you need to constantly deduplicate a table, use materialized views. If duplicates are infrequent and you can identify them during ingestion, the soft delete process usually performs better than materialized views. For example, if your ingestions don't normally have duplicates but occasionally include a stream known to contain duplicates, it's better to handle these duplicates with soft delete rather than defining a materialized view that constantly attempts to deduplicate *all* records.

### Solution 5: `ingest-by` extent tags

You can use ['ingest-by:' extent tags](/kusto/management/extent-tags?view=azure-data-explorer&preserve-view=true) to prevent duplicates during ingestion. This solution is relevant only in use cases where each ingestion batch has no duplicates, and duplicates occur only if the same ingestion batch is ingested more than once.

## Summary

You can handle data duplication in multiple ways. Evaluate the options carefully, taking into account price and performance, to determine the best method for your business.

## Related content

* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
