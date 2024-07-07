---
title:  Pivot chart visualization
description:  This article describes the pivot chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/13/2024
monikerRange: "azure-data-explorer"
---
# Pivot chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

::: moniker range="azure-data-explorer"

Displays a pivot table and chart. You can interactively select data, columns, rows, and various chart types.

> [!NOTE]
>
> * This visualization can only be used in the context of the [render operator](render-operator.md).
> * This visualization can be used in Kusto.Explorer but is not available in the Azure Data Explorer web UI.

## Syntax

*T* `|` `render` `pivotchart`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | Input table name. |

## Example

```kusto
SalesFact
| join kind= inner Products on ProductKey
| where ProductCategoryName has "Computers" and ProductName has "Contoso"
| where DateKey between (datetime(2006-12-31) .. datetime(2007-02-01))
| project SalesAmount, ProductName, DateKey
| render pivotchart
```

:::image type="content" source="media/visualize-pivotchart/pivotchart.png" alt-text="Screenshot of query result showing a pivot chart visualization."  lightbox="media/visualize-pivotchart/pivotchart.png":::
