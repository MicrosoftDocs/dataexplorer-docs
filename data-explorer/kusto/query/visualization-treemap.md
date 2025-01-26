---
title:  Treemap visualization
description: Learn how to use the treemap visualization to visualize data.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
monikerRange: "azure-data-explorer"
---
# Treemap

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Treemaps display hierarchical data as a set of nested rectangles. Each level of the hierarchy is represented by a colored rectangle (branch) containing smaller rectangles (leaves).

> [!NOTE]
>
> * This visualization can only be used in the context of the [render operator](render-operator.md).
> * This visualization can be used in Kusto.Explorer but is not available in the Azure Data Explorer web UI.

## Syntax

*T* `|` `render` `treemap` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | `string` |  :heavy_check_mark: | Input table name.
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

All properties are optional.

|***PropertyName***|***PropertyValue***                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|

## Example

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

```kusto
StormEvents
| summarize StormEvents=count() by EventType, State
| sort by StormEvents
| limit 30
| render treemap with(title="Storm Events by EventType and State")
```

:::image type="content" source="media/visualization-treemap/treemap.png" alt-text="Screenshot of treemap visualization output." lightbox="media/visualization-treemap/treemap.png":::
