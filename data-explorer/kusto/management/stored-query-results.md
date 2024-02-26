---
title: Stored query results
description: Learn how to create and use stored query results to store the results of a query on the service for up to 24 hours.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 02/22/2024
---

# Stored query results

*Stored query results* is a mechanism that stores the result of a query on the service for up to 24 hours. The same principal identity that created the stored query can reference the results in later queries.

Stored query results can be useful in the following scenarios:

* Paging through query results. The initial command runs the query and returns the first "page" of records. Later queries reference other "pages" without the need to rerun the query.
* Drill-down scenarios, in which the results of an initial query are then explored using other queries.

Updates to security policies, such as database access and row level security, aren't propagated to stored query results. Use [`.drop stored_query_results`](drop-stored-query-results-command.md) if there's user permission revocation.

Stored query results behave like tables, in that the order of records isn't preserved. To paginate through the results, we recommended that the query includes [unique ID columns](#pagination). If there are multiple result sets returned by a query, only the first result set will be stored.

> [!NOTE]
>
> * When you have more than 500 columns, an error is raised and the results aren't stored.
> * Query results are stored in a storage account associated with the cluster; the data is not cached in local SSD storage.

The following table lists the management commands and functions used for managing stored query results:

|Command| Description|
|---|---|
|[.set stored_query_result command](set-stored-query-result-command.md)| Creates a stored query result to store the results of a query on the service for up to 24 hours.|
|[.show stored_query_result command](show-stored-query-result-command.md)| Shows information on active query results. |
|[.drop stored_query_result command](drop-stored-query-result-command.md)| Deletes active query results.|
|[stored_query_result()](../query/stored-query-result-function.md)| Retrieves a stored query result. |



### Pagination

Retrieve clicks by Ad network and day, for the last seven days:

<!-- csl -->
```kusto
.set stored_query_result DailyClicksByAdNetwork7Days with (previewCount = 100) <|
Events
| where Timestamp > ago(7d)
| where EventType == 'click'
| summarize Count=count() by Day=bin(Timestamp, 1d), AdNetwork
| order by Count desc
| project Num=row_number(), Day, AdNetwork, Count
```

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 1 | 2020-01-01 00:00:00.0000000 | NeoAds | 1002 |
| 2 | 2020-01-01 00:00:00.0000000 | HighHorizons | 543 |
| 3 | 2020-01-01 00:00:00.0000000 | PieAds | 379 |
| ... | ... | ... | ... |

Retrieve the next page:

<!-- csl -->
```kusto
stored_query_result("DailyClicksByAdNetwork7Days")
| where Num between(100 .. 200)
```

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 100 | 2020-01-01 00:00:00.0000000 | CoolAds | 301 |
| 101 | 2020-01-01 00:00:00.0000000 | DreamAds | 254 |
| 102 | 2020-01-02 00:00:00.0000000 | SuperAds | 123 |
| ... | ... | ... | ... |

## Related content

* [.set stored_query_result command](set-stored-query-result-command.md).
* [.show stored_query_result command](show-stored-query-result-command.md).
* [.drop stored_query_result command](drop-stored-query-result-command.md).
* [stored_query_result()](../query/stored-query-result-function.md).
