---
title:  stored_query_result()
description: Learn how to use the `stored_query_result()` function to reference a stored query result.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 02/19/2024
---

# stored_query_result()

References a [stored query result](../management/stored-query-results.md).

The `stored_query_result()` function is used for querying a previously created [stored query result](../management/stored-query-results.md).

## Syntax

`stored_query_result(` *StoredQueryResultName* `)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *StoredQueryResultName* | `string` | :heavy_check_mark: | The name of the stored query result. |

## Example

Query stored query result named `Numbers`.

```kusto
stored_query_result("Numbers")
```

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

## Related content

* [Stored query result](../management/stored-query-results.md).
