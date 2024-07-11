---
title:  extent_tags()
description: Learn how to use the extent_tags() function to return a dynamic array of the data shard that the current record is in.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/11/2022
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# extent_tags()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a dynamic array with the [extent tags](../management/extent-tags.md) of the [extent](../management/extents-overview.md) that the current record is in.

If you apply this function to calculated data, which isn't attached to a data shard, returns an empty value.

## Syntax

`extent_tags()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

A value of type `dynamic` that is an array holding the current record's extent tags,
or an empty value.

## Examples

Some query operators preserve the information about the data shard hosting the record.
These operators include `where`, `extend`, and `project`.
The following example shows how to get a list the tags of all the data shards
that have records from an hour ago, with a specific value for the
column `ActivityId`.

```kusto
T
| where Timestamp > ago(1h)
| where ActivityId == 'dd0595d4-183e-494e-b88e-54c52fe90e5a'
| extend tags = extent_tags()
| summarize by tostring(tags)
```

The following example shows how to obtain a count of all records from the last hour, which are stored in extents tagged with the tag `MyTag`(and potentially other tags), but not tagged with the tag `drop-by:MyOtherTag`.

```kusto
T
| where Timestamp > ago(1h)
| extend Tags = extent_tags()
| where Tags has_cs 'MyTag' and Tags !has_cs 'drop-by:MyOtherTag'
| count
```

> [!NOTE]
> Filtering on the value of `extent_tags()` performs best when one of the following string operators is used:
> `has`, `has_cs`, `!has`, `!has_cs`.
