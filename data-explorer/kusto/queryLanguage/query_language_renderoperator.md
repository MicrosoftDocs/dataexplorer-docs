# render operator

Renders results in as graphical output.

    T | render timechart

The render operator should be the last operator in the query expression.

**Syntax**

*T* `|` `render` *Visualization* [`kind` `=` *VisualizationKind*] [`title` `=` *Title*] [`by` *By*] [`accumulate` `=` *Accumulate*]

Where:
* *Visualization* indicates the kind of visualization to perform. Supported values are:

|*Visualization*     ||
|--------------------|-|
| `areachart`        | Area graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `barchart`         | First column is x-axis, and can be text, datetime or numeric. Other columns are numeric, displayed as horizontal strips.|
| `columnchart`      | Like `barchart`, with vertical strips instead of horizontal strips.|
| `piechart`         | First column is color-axis, second column is numeric. |
| `scatterchart`     | Points graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `table`            | Default - results are shown as a table.|
| `timechart`        | Line graph. First column is x-axis, and should be datetime. Other columns are y-axes.|

* *VisualizationKind* is an optional identifier that chooses between the available kinds of the
  chosen *Visualization* (such as `barchart` and `columnchart`), if more than one kind is supported:

|*Visualization*|*VisualizationKind*|Description                     |
|---------------|-------------------|--------------------------------|
|`areachart`    |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each "area" to its own          |
|               |`stacked`          |"Areas" are stacked to the right|
|               |`stacked100`       |"Areas" are stacked to the right, and stretched to the same width|
|`barchart`     |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each bar to its own             |
|               |`stacked`          |Bars are stacked to the right   |
|               |`stacked100`       |Bars are stacked to the right, and stretched to the same width|
|`columnchart`  |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each column to its own          |
|               |`stacked`          |Columns are stacked upwards     |
|               |`stacked100`       |Columns are stacked upwards, and stretched to the same height|

* *Title* is an optional `string` value that holds the title for the results.

* *By* is an optional list of columns that is used by some visualizations (e.g. `timepivot`) to control
  which "axis" is driven by which column in the data.

* *Accumulate* is an optional value that can be set to either `true` or `false` (the default),
  and indicates whether to accumulate y-axis numeric values for presentation.

**Tips**

* Only positive values are displayed.
* Use `where`, `summarize` and `top` to limit the volume that you display.
* Sort the data to define the order of the x-axis.
* If you use more than one y-axis column, you might have to multiply the columns by suitable factors to make them visible on the same scale. 

**Examples**

[Rendering examples in the tutorial](~/learn/tutorials/charts.md).


