---
title: Time chart visualization - Azure Data Explorer
description: This article describes the time chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/03/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Time chart

Visualization in the context of the [render operator](renderoperator.md).

Line graph. First column is x-axis, and must be datetime. Other (numeric) columns are y-axes. There's one string column whose values are used to "group" the numeric columns and create different lines in the chart (further string columns are ignored). |  **[**Click to run sample query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQ3WrDMAyF7/sUukvCnDXJGIOVPEULuwxqoixm/gm2+jf28JObFjbYrmyho3M+yRCD1a5jaGFAJtaW8qaqX8qqLqvnYrMySYHnvxRNWT1B07xW1U03JFEzbVYDWd9Z/KAuUtAUm9UXpLJcSnAH2+LxPZe3AO9gJ6ZbRjvDGLy9EbG/BUemOXnvLxD1AOJ1mijQtWhbyHbbOgOA9RogkqGeAaXn3g1BooVb6OiDNHpD6CjAUccDGv2JrL0TSzozuQHyPYqHdqRkDKN3aBRwkJaCQJIoQ4VsuXh2A/Xezj5SWkVBWSvI0vSoOSsWpLtEpyDwY4KTW8nnJ5ws+2+eAhSyOxjkd+HDVVcIfHplp2TYTxgYTpqnnDUbarM32gPO86PY4jjqfmGw3vGkftNlCi5xNprbWW5kYvENQQnqDh8CAAA=)** |

## Syntax

*T* `|` `render` timechart [`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...] `)`]

## Arguments

* *T*: Input table name.
* *PropertyName*/*PropertyValue* indicate additional information to use when rendering.
  All properties are optional. The supported properties are:

::: zone pivot="azuredataexplorer"

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
    |`ysplit`      |How to split multiple the visualization. For more information, see [Multiple y-axes](#multiple-y-axes).                             |
    |`ytitle`      |The title of the y-axis (of type `string`).                                       |

::: zone-end

::: zone pivot="azuremonitor"

    |*PropertyName*|*PropertyValue*                                                                   |
    |--------------|----------------------------------------------------------------------------------|
    |`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
    |`title`       |The title of the visualization (of type `string`).                                |

::: zone-end

## Example