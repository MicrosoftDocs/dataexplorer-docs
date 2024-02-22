---
title: .show stored_query_results command
description: Learn how to use the `.show stored_query_result` command to show information on active query results.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/23/2023
---

# .show stored_query_results command

Shows information on active stored query results.

## Permissions

* You must have `DatabaseAdmin` or `DatabaseMonitor` permissions to inspect active stored query results in a database.
* You must have `DatabaseUser` or `DatabaseViewer` permissions to inspect active stored query results created by the principal.

## Syntax

`.show` `stored_query_results`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

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

## Related content
