---
title: Stored Query Results (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes how to create and use stored query results in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 01/12/2020
---

# Stored query results (Preview)

Save results of a heavyweight query and retrieve it quickly, when needed.

Use cases of stored query results:
* Implement results pagination. A stored query result is created based on a query, and a preview is shown on the first page. Every subsequent page shows the next portion of the pre-calculated result without the need to run the initial query again.
* Temporarily save query results during data exploration.

`Database User` or a higher access role is required for creating and using stored query results.

The stored query results are in preview phase. We recommend that you don't create a production dependency on this feature, at this time.

> [!NOTE] 
> * Stored query results can be accessed for up to 24 hours from the moment of creation.
> * Updates to security policies (e.g. database access, row level security, etc.) are not propagated to stored query results. Database administrators can use [command](#drop-stored\_query\_results) for deleting stored query results created by a specific principal.
> * A stored query result can only be accessed by the same principal identity that created it.
> * Stored query results behave like tables, in that the order of records isn't preserved. To paginate through the results, it's recommended that the query includes unique ID columns. For more information, see [examples](#examples).
> * If there are multiple result sets returned by a query, only the first result set will be stored.


## Store the results of a query

**Syntax**

`.set` `stored_query_result` *[StoredQueryResultName](#name)* 
[`with` `(`*[PropertyName](#properties)* `=` *[PropertyValue](#properties)* `,` ... `)`]
<| *[Query](#query)*

**Parameters**

<a name="name"></a>
*StoredQueryResultName*

Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.

<a name="query"></a>
*Query*

A potentially heavyweight KQL query whose results will be stored.

<a name="properties"></a>
*Optional Properties*

| Property       | Type       | Description       |
|----------------|------------|-------------------------------------------------------------------------------------|
| `expiresAfter` | `timespan` | A timespan literal indicating when the stored query result should be expired (can't be more than 24 hours). |
| `previewCount` | `int`      | The number of rows to return in a preview. Setting this property to `0` (default) makes the command return all the query result rows. |
| `distributed`  | `bool`     | Indicates that the command stores query results from all nodes executing the query in parallel. Default is "true". Setting `distributed` flag to "false" is useful when the amount of data produced by a query is small, or a number of cluster nodes is big, to prevent creating many small data shards. |

## Retrieve a stored query result

To retrieve a stored query result, use `stored_query_result()` function in your query:

`stored_query_result` `(` 'StoredQueryResultName' `)` `|` ...


## Examples

### Simple example

An example of storing a simple query result:

<!-- csl -->
```kusto
.set stored_query_result Numbers <| range X from 1 to 1000000 step 1
```

Output:

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

Output:

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

### Pagination example

Retrieve clicks by Ad network and day for the last 7 days:

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

Example output:

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 1 | 2020-01-01 00:00:00.0000000 | NeoAds | 1002 |
| 2 | 2020-01-01 00:00:00.0000000 | HighHorizons | 543 |
| 3 | 2020-01-01 00:00:00.0000000 | PieAds | 379 |
| ... | ... | ... | ... |

Retrieve next page:

<!-- csl -->
```kusto
stored_query_result("DailyClicksByAdNetwork7Days")
| where Num between(100 .. 200)
```

Example output:

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 100 | 2020-01-01 00:00:00.0000000 | CoolAds | 301 |
| 101 | 2020-01-01 00:00:00.0000000 | DreamAds | 254 |
| 102 | 2020-01-02 00:00:00.0000000 | SuperAds | 123 |
| ... | ... | ... | ... |


## Control commands

### show stored\_query\_results

Shows information on active stored query results.

 * Users with `DatabaseAdmin` or `DatabaseMonitor` permissions can inspect presence of active stored query results in context of the database.
 * Users with `DatabaseUser` or `DatabaseViewer` permissions can inspect presence of active stored query results created by their principal.

#### Syntax

`.show` `stored_query_results`

#### Result

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |


### drop stored\_query\_result

Deletes an active stored query result created in current database by current principal.

#### Syntax

`.drop` `stored_query_result` *[StoredQueryResultName](#name)*

`Database User` permission is required for invoking this command.

#### Result

The command returns info on deleted stored query result, for example:

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |


### drop stored\_query\_results

Deletes active stored query results created in current database by the specified principal.

`Database Admin` permission is required for invoking this command.

#### Syntax

`.drop` `stored_query_results` `created-by` *PrincipalName*

#### Result

The command returns info on deleted stored query results.

Example:

<!-- csl -->
```kusto
.drop stored_query_results by user 'aadapp=c28e9b80-2808-bed525fc0fbb'
```

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |
| 571f1a76-f5a9-49d4-b339-ba7caac19b46 | Traces | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 5212 | 100000 | 2020-10-07 14:31:01.8271231| 2020-10-08 14:31:01.8271231 |
