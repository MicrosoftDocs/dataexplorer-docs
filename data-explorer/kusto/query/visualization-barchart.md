---
title: Bar chart visualization - Azure Data Explorer
description: This article describes the bar chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/03/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Bar chart

First column is the x-axis and can be text, datetime or numeric. Other columns are numeric, displayed as horizontal strips. |  **[**Click to run sample query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5lIAghqF4tLc3MSizKpUhVSQcHxyfmleiS2Y1NBUSKpUCC5JLEmFKi7PSC1CUahgp2BoAJUsKMrPSk0ugWjQQVYFVVCUmpeSWqSQlFiUnJFYVAIAB5xR2owAAAA=)** 

> [!NOTE]
> This visualization can only be used in the context of the [render operator](renderoperator.md).

## Syntax

*T* `|` `render` barchart [`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`]

## Arguments

* *T*: Input table name.
* *PropertyName*/*PropertyValue* indicate additional information to use when rendering.
  All properties are optional. The supported properties are:

::: zone pivot="azuredataexplorer"

  |*PropertyName*|*PropertyValue*                                                                   |
  |--------------|----------------------------------------------------------------------------------|
  |`accumulate`  |Whether the value of each measure gets added to all its predecessors. (`true` or `false`)|
  |`kind`        |Further elaboration of the visualization kind.  For more information, see [`kind` property](#kind-property).                         |
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
  |`ysplit`      |How to split multiple the visualization. For more information, see [Multiple y-axes](#multiple-y-axes).                             |
  |`ytitle`      |The title of the y-axis (of type `string`).                                       |

::: zone-end

::: zone pivot="azuremonitor"

  |*PropertyName*|*PropertyValue*                                                                   |
  |--------------|----------------------------------------------------------------------------------|
  |`kind`        |Further elaboration of the visualization kind. For more information, see [`kind` property](#kind-property).                        |
  |`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
  |`title`       |The title of the visualization (of type `string`).                                |

::: zone-end

### `kind` property

Some visualizations can be further elaborated by providing the `kind` property.
These are:

| `kind` value | Description                                                        |
|--------------|--------------------------------------------------------------------|
| `default`    | Each "bar" stands on its own.                                      |
| `unstacked`  | Same as `default`.                                                 |
| `stacked`    | Stack "bars".                                                      |
| `stacked100` | Stack "bars" and stretch each one to the same width as the others. |

## Example