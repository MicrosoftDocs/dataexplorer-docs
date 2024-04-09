---
title: Stored query results
description: Learn how to manage stored query results.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 04/08/2024
---

# Stored query results

*Stored query results* store the result of a query on the service for up to 24 hours. The same principal identity that created the stored query can reference the results in later queries.

Stored query results can be useful in the following scenarios:

* Paging through query results. The initial command runs the query and returns the first "page" of records. Later queries reference other "pages" without the need to rerun the query.
* Drill-down scenarios, in which the results of an initial query are then explored using other queries.

Updates to security policies, such as database access and row level security, aren't propagated to stored query results. Use [`.drop stored_query_results`](drop-stored-query-result-command.md) if there's user permission revocation.

Stored query results behave like tables, in that the order of records isn't preserved. To paginate through the results, we recommended that the query includes [unique ID columns](../query/stored-query-result-function.md#pagination). If a query returns multiple result sets, only the first result set is stored.

> [!NOTE]
>
> * When you have more than 500 columns, an error is raised and the results aren't stored.
> * Query results are stored in a storage account associated with the cluster. The data is not cached in local SSD storage.
> * A follower cluster needs it's own writable database to store query results.

The following table lists the management commands and functions used for managing stored query results:

|Command| Description|
|---|---|
|[.set stored_query_result command](set-stored-query-result-command.md)| Creates a stored query result to store the results of a query on the service for up to 24 hours.|
|[.show stored_query_result command](show-stored-query-result-command.md)| Shows information on active query results. |
|[.drop stored_query_result command](drop-stored-query-result-command.md)| Deletes active query results.|
|[stored_query_result()](../query/stored-query-result-function.md)| Retrieves a stored query result. |
