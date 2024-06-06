---
title: .show stored_query_results command
description: Learn how to use the `.show stored_query_result` command to show information on active query results.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/23/2023
---

# .show stored_query_result command

Shows information on active stored query results.

Use `.show` `stored_query_results` to show information about active stored query results in the current database.

Use `.show` `stored_query_result` *storedQueryResultName* `schema` to show the schema of an active stored query result in the current database.

## Permissions

You must have [Database Viewer](../access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

`.show` `stored_query_results`

`.show` `stored_query_result` *storedQueryResultName* `schema`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *StoredQueryResultName* | `string` |  :heavy_check_mark: | Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.|

## Returns

Returns information about active stored query results in the current database.

> [!NOTE]
> Please note that there might be a short delay before recently created stored query results appear in the results.

## Examples

The following example returns information about the stored query result `Events`.

```kusto
.show stored_query_results Events
```

**Output**

| StoredQueryResultId | Name | DatabaseName | PrincipalIdentity | SizeInBytes | RowCount | CreatedOn | ExpiresOn |
| ------------------- | ---- | ------------ | ----------------- | ----------- | -------- | --------- | --------- |
| c522ada3-e490-435a-a8b1-e10d00e7d5c2 | Events | TestDB | aadapp=c28e9b80-2808-bed525fc0fbb | 104372 | 1000000 | 2020-10-07 14:26:49.6971487 | 2020-10-08 14:26:49.6971487 |

The following example shows the schema of the stored query result `Events`.

```kusto
.show stored_query_result Events schema
```

**Output**

| StoredQueryResult | Schema |
| ------------------- | ---- |
| Events | [{"Column":"ID","Type":"guid"},{"Column":"EventName","Type":"string"},{"Column":"Time","Type":"datetime"}] |

## Related content

* [.set stored_query_result command](set-stored-query-result-command.md).
* [.drop stored_query_result command](drop-stored-query-result-command.md).
* [stored_query_result()](../query/stored-query-result-function.md).
