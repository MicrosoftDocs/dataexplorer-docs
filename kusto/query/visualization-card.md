---
title:  Card visualization
description:  This article describes the card visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# Card

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The card visual only shows one element. If there are multiple columns and rows in the output, the first result record is treated as set of scalar values and shows as a card.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `card` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | `string` |  :heavy_check_mark: | Input table name.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`title`       |The title of the visualization (of type `string`).                                |

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2LsQqDQBAFe7/icZX5CAuLJFxjocH+8BZd0D1ZV0Xw42OC1RQz01jS6bmR2JKd2AdSQmPBqChc6+u3r3zpECTiH32O+WdeY0rRXUOXVrGLShJJ0QWN2NkG5MY20l0uYEHL2rNwcI8vTweEO3QAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State=="VIRGINIA" and EventType=="Flood"
| count
| render card with (title="Floods in Virginia")
```

:::image type="content" source="media/card/card.png" alt-text="Screenshot of card visual." lightbox="media/card/card.png":::
