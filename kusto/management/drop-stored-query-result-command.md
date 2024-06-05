---
title: .drop stored_query_result command
description: Learn how to use the `.drop stored_query_result` command to delete an active query result.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/23/2023
---

# .drop stored_query_result command

Deletes an active stored query result.

Use `.drop` `stored_query_result` *storedQueryResultName* to delete an active stored query result created in the current database.

Use `.drop` `stored_query_results` `by user` *UserPrincipalName* to delete all active stored query results in the current database by the specified user principal.

## Permissions

You must have [Database Viewer](access-control/role-based-access-control.md) permissions to delete stored query results in the database, and [Database Admin](access-control/role-based-access-control.md) permissions to delete stored query results created by specified user principals.

## Syntax

`.drop` `stored_query_result` *storedQueryResultName*

`.drop` `stored_query_results` `by user` *UserPrincipalName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *StoredQueryResultName* | `string` |  :heavy_check_mark: | Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.|
| *UserPrincipalName* | `string` | | The UPN of a specific user for which to return a list of queries. |

## Returns

Returns information about deleted stored query results.

## Example

```kusto
.drop stored_query_results by user 'aadapp=c28e9b80-2808-bed525fc0fbb'
```

**Output**

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |
| 571f1a76-f5a9-49d4-b339-ba7caac19b46 | Traces | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 5212 | 100000 | 2020-10-07 14:31:01.8271231| 2020-10-08 14:31:01.8271231 |

## Related content

* [.set stored_query_result command](set-stored-query-result-command.md).
* [.show stored_query_result command](show-stored-query-result-command.md).
* [stored_query_result()](../query/stored-query-result-function.md).
