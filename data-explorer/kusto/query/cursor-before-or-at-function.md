---
title:  cursor_before_or_at()
description: Learn how to use the cursor_before_or_at() function to compare the ingestion time of the records of a table against the database cursor time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# cursor_before_or_at()

::: zone pivot="azuredataexplorer, fabric"

A predicate function run over the records of a table to compare their ingestion time against the database cursor time.

> [!NOTE]
> This function can only be invoked on records of a table that has the
[IngestionTime policy](../management/ingestion-time-policy.md) enabled.

## Syntax

`cursor_before_or_at(`*RHS*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *RHS* | `string` |  :heavy_check_mark: | Either an empty string literal or a valid database cursor value.|

## Returns

A scalar value of type `bool` that indicates whether the record was ingested
before or at the database cursor *RHS* (`true`) or not (`false`).

## Related content

* [database cursors](../management/database-cursor.md)

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
