---
title: Stored query results (Preview) - Azure Data Explorer
description: This article describes how to create and use stored query results in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mispecto
ms.service: data-explorer
ms.topic: reference
ms.date: 12/3/2020
---

# Stored query results (Preview)

Stored query results is a mechanism that temporarily stores the result of a query on the service. You can reference this data in later queries.
Create the stored query object with a command that uses the name of the created entity and the executed query.
This command returns a subset of the records produced by the query, referred to as the "preview", but stores all records.

Stored query results can be useful in the following scenarios:
* Paging through query results. The initial command runs the query and returns the first "page" of records.
  Later queries reference other "pages" without the need to rerun the query.
* Drill-down scenarios, in which the results of an initial query are then
  explored using other queries.

> [!NOTE]
> * The stored query results are in preview phase, and shouldn't be used for production scenarios. 
> * This feature is only available when [EngineV3](../../engine-v3.md) is enabled.

Stored query results can be accessed for up to 24 hours from the moment of creation. Updates to security policies (for example, database access, row level security, and so on) aren't propagated to stored query results. Use [`.drop stored_query_results`](#drop-stored_query_results) if there is user permission revocation. A stored query result can only be accessed by the same principal identity that created the stored query. 

Stored query results behave like tables, in that the order of records isn't preserved. To paginate through the results, it's recommended that the query includes unique ID columns. For more information, see [examples](#examples). If there are multiple result sets returned by a query, only the first result set will be stored. 

Using stored query results requires `Database Viewer` or higher access role.

## Store the results of a query

**Syntax**

`.set` [`async`] `stored_query_result` *StoredQueryResultName* 
[`with` `(`*PropertyName* `=` *PropertyValue* `,` ... `)`]
<| *Query*

**Arguments**

* `async`: If specified, the command will immediately return and continue running in the background. The results of the command will include an `OperationId` value. This value can then be used with the [.show operation details](operations.md#show-operation-details) command to retrieve the command completion status and results.
* *StoredQueryResultName*: Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.
* *Query*: A potentially heavyweight KQL query whose results will be stored.
* *PropertyName*: (all properties are optional)
    
    | Property       | Type       | Description       |
    |----------------|------------|-------------------------------------------------------------------------------------|
    | `expiresAfter` | `timespan` | A timespan literal indicating when the stored query result will expire (maximum of 24 hours). |
    | `previewCount` | `int`      | The number of rows to return in a preview. Setting this property to `0` (default) makes the command return all the query result rows. The property is ignored when the command is invoked using `async` mode. |
    | `distributed`  | `bool`     | Indicates that the command stores query results from all nodes executing the query in parallel. Default is *true*. Setting `distributed` flag to *false* is useful when the amount of data produced by a query is small, or the number of cluster nodes is large, to prevent creating many small data shards. |

## Retrieve a stored query result

To retrieve a stored query result, use `stored_query_result()` function in your query:

`stored_query_result` `(` 'StoredQueryResultName' `)` `|` ...

## Examples

### Simple query

Storing a simple query result:

<!-- csl -->
```kusto
.set stored_query_result Numbers <| range X from 1 to 1000000 step 1
```

**Output:**

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

Retrieve stored query result:

<!-- csl -->
```kusto
stored_query_result("Numbers")
```

**Output:**

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

**Output:**

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

**Output:**

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 100 | 2020-01-01 00:00:00.0000000 | CoolAds | 301 |
| 101 | 2020-01-01 00:00:00.0000000 | DreamAds | 254 |
| 102 | 2020-01-02 00:00:00.0000000 | SuperAds | 123 |
| ... | ... | ... | ... |

## Control commands

### .show stored_query_results

Shows information on active stored query results.

>[!NOTE]
> * Users with `DatabaseAdmin` or `DatabaseMonitor` permissions can inspect the presence of active stored query results in the context of the database.
> * Users with `DatabaseUser` or `DatabaseViewer` permissions can inspect the presence of active stored query results created by their principal.

#### Syntax

`.show` `stored_query_results`

#### Returns

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

### .drop stored_query_result

Deletes an active stored query result created in the current database by the current principal.

#### Syntax

`.drop` `stored_query_result` *StoredQueryResultName*

`Database Viewer` permission is required for invoking this command.

#### Returns

Returns information about deleted stored query results, for example:

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

### .drop stored_query_results

Deletes active stored query results created in the current database by the specified principal.

`Database Admin` permission is required for invoking this command.

#### Syntax

`.drop` `stored_query_results` `created-by` *PrincipalName*

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
