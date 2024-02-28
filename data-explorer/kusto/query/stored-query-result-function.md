---
title:  stored_query_result()
description: Learn how to use the `stored_query_result()` function to reference a stored query result.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 02/19/2024
---

# stored_query_result()

Retrieves a previously created [stored query result](../management/stored-query-results.md).

To set a stored query result, see [.set stored_query_result command](../management/set-stored-query-result-command.md).

## Syntax

`stored_query_result(` *StoredQueryResultName* `)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *StoredQueryResultName* | `string` | :heavy_check_mark: | The name of the stored query result. |

## Examples

References the stored query result named `Numbers`.

```kusto
stored_query_result("Numbers")
```

**Output**

| X |
|---|
| 1 |
| 2 |
| 3 |
| ... |

### Pagination

The following example retrieves clicks by Ad network and day, for the last seven days:

```kusto
.set stored_query_result DailyClicksByAdNetwork7Days with (previewCount = 100) <|
Events
| where Timestamp > ago(7d)
| where EventType == 'click'
| summarize Count=count() by Day=bin(Timestamp, 1d), AdNetwork
| order by Count desc
| project Num=row_number(), Day, AdNetwork, Count
```

**Output**

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 1 | 2020-01-01 00:00:00.0000000 | NeoAds | 1002 |
| 2 | 2020-01-01 00:00:00.0000000 | HighHorizons | 543 |
| 3 | 2020-01-01 00:00:00.0000000 | PieAds | 379 |
| ... | ... | ... | ... |

Retrieve the next page:

```kusto
stored_query_result("DailyClicksByAdNetwork7Days")
| where Num between(100 .. 200)
```

**Output**

| Num | Day | AdNetwork | Count |
|-----|-----|-----------|-------|
| 100 | 2020-01-01 00:00:00.0000000 | CoolAds | 301 |
| 101 | 2020-01-01 00:00:00.0000000 | DreamAds | 254 |
| 102 | 2020-01-02 00:00:00.0000000 | SuperAds | 123 |
| ... | ... | ... | ... |

## Related content

* [Stored query result](../management/stored-query-results.md).
* [.show stored_query_result command](show-stored-query-result-command.md).
* [.drop stored_query_result command](drop-stored-query-result-command.md).
