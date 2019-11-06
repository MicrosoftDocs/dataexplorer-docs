---
title: ingestion_time() - Azure Data Explorer | Microsoft Docs
description: This article describes ingestion_time() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
zone_pivot_group_filename: kusto/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# ingestion_time()

Retrieves the record's `$IngestionTime` hidden `datetime` column, or null.

The `$IngestionTime` column is automatically defined when the table's

::: zone pivot="kusto"

[IngestionTime policy](../concepts/ingestiontimepolicy.md) is set (enabled).

::: zone-end

::: zone pivot="loganalytics"

IngestionTime policy is set (enabled).

::: zone-end

If the table does not have this policy defined, a null value is returned.

This function must be used in the context of an actual table in order
to return the relevant data. (For example, it will return null for all records
if it is invoked following a `summarize` operator).

**Syntax**

 `ingestion_time()`

**Returns**

A `datetime` value specifying the approximate time of ingestion into a table.

**Example**

```kusto
T 
| extend ingestionTime = ingestion_time() | top 10 by ingestionTime
```