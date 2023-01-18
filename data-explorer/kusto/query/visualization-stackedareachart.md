---
title: Stacked area chart visualization - Azure Data Explorer
description: This article describes the stacked area chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/03/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Stacked area chart

::: zone pivot="azuredataexplorer"
Stacked area graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |  **[**Click to run sample query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA03LSwqAIBRG4XmruEODRs5bi4j+oeQDrjcyaPEZTZp+nOORq2ngiKanm9AFxdMHZotidIoFTV3z8tcXh42DRw8mamLdDm8Z1gXLQkRnlKC6q+nIZe3zAzEfsitrAAAA)** |

> [!NOTE]
> This visualization can only be used in the context of the [render operator](renderoperator.md).

## Syntax

*T* `|` `render` stackedareachart [`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`]

## Arguments

* *T*: Input table name.
* *PropertyName*/*PropertyValue* indicate additional information to use when rendering.
  All properties are optional. The supported properties are:

    |*PropertyName*|*PropertyValue*                                                                   |
    |--------------|----------------------------------------------------------------------------------|
    |`accumulate`  |Whether the value of each measure gets added to all its predecessors. (`true` or `false`)|
    |`legend`      |Whether to display a legend or not (`visible` or `hidden`).                       |
    |`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
    |`ymin`        |The minimum value to be displayed on Y-axis.                                      |
    |`ymax`        |The maximum value to be displayed on Y-axis.                                      |
    |`title`       |The title of the visualization (of type `string`).                                |
    |`xaxis`       |How to scale the x-axis (`linear` or `log`).                                      |
    |`xcolumn`     |Which column in the result is used for the x-axis.                                |
    |`xtitle`      |The title of the x-axis (of type `string`).                                       |
    |`yaxis`       |How to scale the y-axis (`linear` or `log`).                                      |
    |`ycolumns`    |Comma-delimited list of columns that consist of the values provided per value of the x column.|
    |`ytitle`      |The title of the y-axis (of type `string`).                                       |
    
## Example

::: zone-end

::: zone pivot="azuremonitor"

This visualization isn't supported in Azure Monitor.

::: zone-end