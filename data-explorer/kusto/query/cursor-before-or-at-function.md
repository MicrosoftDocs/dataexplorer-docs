---
title:  cursor_before_or_at()
description: Learn how to use the cursor_before_or_at() function to compare the ingestion time of the records of a table against the database cursor time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# cursor_before_or_at()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A predicate function runs over the records of a table to compare their ingestion time against the database cursor time.

> [!NOTE]
> This function can only be invoked on records of a table that has the
[IngestionTime policy](../management/ingestion-time-policy.md) enabled.

## Syntax

`cursor_before_or_at(`*RHS*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *RHS* | `string` |  :heavy_check_mark: | Either an empty string literal or a valid database cursor value.|

## Returns

Returns a scalar value of type `bool` that indicates whether the record was ingested
before or at the database cursor *RHS* (`true`) or not (`false`).

## Examples

Suppose you have a table named `MyTable` with an ingestion time policy enabled. To filter records ingested before or at a given database cursor value (`'2024-08-01T12:00:00Z'`), use:

```kusto
MyTable
| where cursor_before_or_at('2024-08-01T12:00:00Z')
```

This query returns only the records ingested before or at the specified cursor time.

## Related content
* [database cursors](../management/database-cursor.md)

