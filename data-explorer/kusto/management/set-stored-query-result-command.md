---
title: .set stored_query_results command
description: Learn how to use the `.set stored_query_result` command to create a stored query result to store the results of a query on the service for up to 24 hours.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 02/26/2024
---

# .set stored_query_result command

Sets a mechanism that stores a query result on the service for up to 24 hours.

If a stored query result name already exists, `.set` fails. Instead, use `.set-or-replace`, which deletes the existing stored query result and creates a new one with the same name.

## Permissions

You must have [Database Viewer](access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

`.set` [`async`] `stored_query_result` *StoredQueryResultName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *Query*

`.set-or-replace` [`async`] `stored_query_result` *StoredQueryResultName* [`with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *Query*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| `async` | `string` | | If specified, the command will return and continue ingestion in the background. Use the returned `OperationId` with the `.show operations` command to retrieve the ingestion completion status and results. |
| *StoredQueryResultName* | `string` |  :heavy_check_mark: | Stored query result name that adheres to [entity names](../query/schema-entities/entity-names.md) rules.|
| *PropertyName*, *PropertyValue* | `string` |  | One or more [supported properties](#supported-properties). |
| *Query* | `string` |  :heavy_check_mark: | The text of a query whose results will be stored.|

## Supported properties

| Property | Type | Description |
|--|--|--|
| `expiresAfter` | `timespan` | Determines when the stored query result expires. Maximum is 24 hours. |
| `previewCount` | `int` | The number of rows to return in a preview. Setting this property to `0` (default) makes the command return all the query result rows. The property is ignored when the command is invoked using `async` mode. |

## Returns

A tabular subset of the records produced by the query, referred to as the "preview", or all records. Regardless of how many records are shown on return, all records are stored.

[!INCLUDE [store-query-known-issue.md](../../includes/store-query-character-limitation.md)]

## Examples

The following example creates a stored query result named `Numbers`.

<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrTi1RKC7JL0pNiS8sTS2qjC9KLS7NKVHwK81NSi0qVrCpUShKzEtPVYhQSCvKz1UwVCjJVzA0AAOgxtQCBUMA3q5PyEQAAAA=" target="_blank">Run the query</a>

```kusto
.set stored_query_result Numbers <| range X from 1 to 1000000 step 1
```

**Output** 

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

## Related content

* [.show stored_query_result command](show-stored-query-result-command.md).
* [.drop stored_query_result command](drop-stored-query-result-command.md).
* [stored_query_result()](../query/stored-query-result-function.md).
