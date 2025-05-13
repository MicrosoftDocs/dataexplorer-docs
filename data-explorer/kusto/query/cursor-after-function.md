---
title:  cursor_after()
description: Learn how to use the cursor_after() function to compare the ingestion time of the records of a table against the database cursor time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# cursor_after()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A predicate runs over the records of a table to compare their ingestion time against a database cursor.

> [!NOTE]
> This function can only be invoked on records of a table that has the
[IngestionTime policy](../management/ingestion-time-policy.md) enabled.

## Syntax

`cursor_after(`*RHS*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *RHS* | `string` |  :heavy_check_mark: | Either an empty string literal or a valid database cursor value.|

## Returns

Returns a scalar value of type `bool` that indicates whether the record was ingested
after the database cursor *RHS* (`true`) or not (`false`).


## Examples

The following query returns records ingested after a specific database cursor:

```kusto
MyTable
| where cursor_after('2024-08-01T00:00:00Z')
```

This filters `MyTable` to only include records ingested after August 1, 2024.

## Related content

* [database cursors](../management/database-cursor.md)
