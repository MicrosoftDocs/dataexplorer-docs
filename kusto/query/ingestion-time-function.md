---
title:  ingestion_time()
description: Learn how to use the ingestion_time() function to return the approximate time of the data's ingestion. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# ingestion_time()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

::: moniker range="microsoft-fabric  || azure-data-explorer"

Returns the approximate [datetime](../query/scalar-data-types/datetime.md) in UTC format indicating when the current record was ingested. 

This function must be used in context of a table for which the [IngestionTime policy](../management/ingestion-time-policy.md) is enabled. Otherwise, this function produces null values.

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

Retrieves the `datetime` when the record was ingested and ready for query.

::: moniker-end

> [!NOTE]
> The value returned by this function is only approximate, as the ingestion process may take several minutes to complete and multiple ingestion activities may take place concurrently. To process all records of a table with exactly-once guarantees, use [database cursors](../management/database-cursor.md).

> [!TIP]
> The ingestion_time() function returns values according to the service clock as measured when ingestion was completed. As a result, this value cannot be used to "order" ingestion operations, as two operations that overlap in time might have any ordering of these values. If ordering records is important for application semantics, one should ensure that the table has a timestamp column as measured by the source of the data instead of relying on the ingestion_time() value.

## Syntax

`ingestion_time()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

A `datetime` value specifying the approximate time of ingestion into a table.

## Example

```kusto
T
| extend ingestionTime = ingestion_time() | top 10 by ingestionTime
```
