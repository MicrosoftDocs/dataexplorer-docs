---
title: Stored query results
description: Learn how to create and use stored query results to store the results of a query on the service for up to 24 hours.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/23/2023
---

# Stored query results

*Stored query results* is a mechanism that stores the result of a query on the service for up to 24 hours. The same principal identity that created the stored query can reference the results in later queries.

Stored query results can be useful in the following scenarios:

* Paging through query results. The initial command runs the query and returns the first "page" of records. Later queries reference other "pages" without the need to rerun the query.
* Drill-down scenarios, in which the results of an initial query are then explored using other queries.

Updates to security policies, such as database access and row level security, aren't propagated to stored query results. Use [`.drop stored_query_results`](#drop-stored_query_results) if there's user permission revocation.

Stored query results behave like tables, in that the order of records isn't preserved. To paginate through the results, we recommended that the query includes [unique ID columns](#pagination). If there are multiple result sets returned by a query, only the first result set will be stored.

> [!NOTE]
>
> * When you have more than 500 columns, an error is raised and the results aren't stored.
> * Query results are stored in a storage account associated with the cluster; the data is not cached in local SSD storage.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.set` [`async`] `stored_query_result` *StoredQueryResultName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *Query*

`.set-or-replace` [`async`] `stored_query_result` *StoredQueryResultName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *Query*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| `async` | string | | If specified, the command will return and continue ingestion in the background. Use the returned `OperationId` with the `.show operations` command to retrieve the ingestion completion status and results. |
| *StoredQueryResultName* | string | &check; | Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.|
| *PropertyName*, *PropertyValue* | string |  | One or more [supported properties](#supported-properties). |
| *Query* | string | &check; | The text of a query whose results will be stored.|

> [!NOTE]
> If the *StoredQueryResultName* exists, `.set` will fail with an error. In contrast, `.set-or-replace` will delete the existing stored-query-result if it exists and then create a new one with the same name.

## Supported properties

| Property | Type | Description |
|--|--|--|
| `expiresAfter` | timespan | Determines when the stored query result will expire. Maximum is 24 hours. |
| `previewCount` | int | The number of rows to return in a preview. Setting this property to `0` (default) makes the command return all the query result rows. The property is ignored when the command is invoked using `async` mode. |
| `distributed`  | bool | If `true`, the command will ingest from all nodes executing the query in parallel. Default is `true`. Set the flag to `false` when the amount of data produced by a query is small, or the number of cluster nodes is large, to prevent creating many small data shards. |

## Returns

A tabular subset of the records produced by the query, referred to as the "preview", or all records. Regardless of how many records are shown on return, all records are stored.

[!INCLUDE [store-query-known-issue.md](../../includes/store-query-character-limitation.md)]

## Retrieve a stored query result

To retrieve a stored query result, use `stored_query_result()` function in your query:

`stored_query_result` `(` 'storedQueryResultName' `)` `|` ...

## Examples

### Simple query

Storing a simple query result:

<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrTi1RKC7JL0pNiS8sTS2qjC9KLS7NKVHwK81NSi0qVrCpUShKzEtPVYhQSCvKz1UwVCjJVzA0AAOgxtQCBUMA3q5PyEQAAAA=" target="_blank">Run the query</a>

```kusto
.set stored_query_result Numbers <| range X from 1 to 1000000 step 1
```

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

Retrieve stored query result:

<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysuyS9KTYkvLE0tqowvSi0uzSnRUPIrzU1KLSpW0gQA2FVHnR4AAAA=" target="_blank">Run the query</a>

```kusto
stored_query_result("Numbers")
```

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

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

## Management commands

### .show stored_query_results

Shows information on active stored query results.

> [!NOTE]
>
> * Users with `DatabaseAdmin` or `DatabaseMonitor` permissions can inspect the presence of active stored query results in the context of the database.
> * Users with `DatabaseUser` or `DatabaseViewer` permissions can inspect the presence of active stored query results created by their principal.

#### Syntax

`.show` `stored_query_results`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Returns

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

### .show stored_query_result schema

Shows schema of active stored query result.

#### Syntax

`.show` `stored_query_result` *storedQueryResultName* `schema`

`Database Viewer` permission is required for invoking this command.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Returns

| StoredQueryResult | Schema |
| ------------------- | ---- |
| Events | [{"Column":"ID","Type":"guid"},{"Column":"EventName","Type":"string"},{"Column":"Time","Type":"datetime"}] |

### .drop stored_query_result

Deletes an active stored query result created in the current database by the current principal.

#### Syntax

`.drop` `stored_query_result` *storedQueryResultName*

`Database Viewer` permission is required for invoking this command.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Returns

Returns information about deleted stored query results, for example:

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

### .drop stored_query_results

Deletes active stored query results created in the current database by the specified principal.

`Database Admin` permission is required for invoking this command.

#### Syntax

`.drop` `stored_query_results` `by user` *PrincipalName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Returns

Returns information on deleted stored query results.

Example:

<!-- csl -->
```kusto
.drop stored_query_results by user 'aadapp=c28e9b80-2808-bed525fc0fbb'
```

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |
| 571f1a76-f5a9-49d4-b339-ba7caac19b46 | Traces | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 5212 | 100000 | 2020-10-07 14:31:01.8271231| 2020-10-08 14:31:01.8271231 |
