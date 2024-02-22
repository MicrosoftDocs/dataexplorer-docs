---
title: .drop stored_query_results command
description: Learn how to use the `.drop stored_query_result` command to delete an active query result.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/23/2023
---

# .drop stored_query_result command

Deletes an active stored query result created in the current database by the current principal.

## Permissions

You must have Database viewer permissions to run this command.

## Syntax

`.drop` `stored_query_result` *storedQueryResultName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

Returns information about deleted stored query results, for example:

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

## .drop stored_query_results

Deletes active stored query results created in the current database by the specified principal.

`Database Admin` permission is required for invoking this command.

#### Syntax

`.drop` `stored_query_results` `by user` *PrincipalName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Returns

Returns information on deleted stored query results.

## Example

<!-- csl -->
```kusto
.drop stored_query_results by user 'aadapp=c28e9b80-2808-bed525fc0fbb'
```

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |
| 571f1a76-f5a9-49d4-b339-ba7caac19b46 | Traces | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 5212 | 100000 | 2020-10-07 14:31:01.8271231| 2020-10-08 14:31:01.8271231 |

## Related content
