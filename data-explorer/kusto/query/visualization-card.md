---
title: Card visualization - Azure Data Explorer
description: This article describes the card visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/03/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Card

::: zone pivot="azuredataexplorer"

First result record is treated as set of scalar values and shows as a card. |  **[**Click to run sample query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2PL04tykwtNuKqUUitKEnNS1GACMSnZZbEG+Vk5qUWa1Rq6iCLggSBYkAdRUD1qUUKCsmJRSkKQFCeWZKhUZGcn1Oam2dboQkA5CRu0GAAAAA=)** |

> [!NOTE]
> This visualization can only be used in the context of the [render operator](renderoperator.md).

## Syntax

*T* `|` `render` card [`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`]

## Arguments

* *T*: Input table name.
* *PropertyName*/*PropertyValue* indicate additional information to use when rendering.
  All properties are optional. The supported properties are:
    
    |*PropertyName*|*PropertyValue*                                                                   |
    |--------------|----------------------------------------------------------------------------------|
    |`title`       |The title of the visualization (of type `string`).                                |

## Example

::: zone-end

::: zone pivot="azuremonitor"

This visualization isn't supported in Azure Monitor.

::: zone-end