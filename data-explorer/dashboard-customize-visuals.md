---
title: Customize Azure Data Explorer dashboard visuals
description: Easily customize your Azure Data Explorer dashboard visuals
ms.reviewer: gabil
ms.topic: how-to
ms.date: 08/02/2023
---

# Customize Azure Data Explorer dashboard visuals

Visuals are essential part of any Azure Data Explorer Dashboard. For a full list of available visuals, see [Visualization](kusto/query/renderoperator.md#visualization).
In this article, you'll learn how to customize different visuals. For general information, see [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

> [!NOTE]
> You must have dashboard editing permissions to customize dashboards.

## Prerequisites

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## Customize visuals

To make any changes in your dashboard, you'll first need to switch from viewing to editing mode.

1. On the top menu, select **Viewing** and toggle to **Editing** mode.

    :::image type="content" source="media/dashboard-customize-visuals/enter-editing-mode.png" alt-text="Screenshot of entering editing mode in dashboards in Azure Data Explorer web UI.":::

1. Browse to the tile you wish to change. Select the **Edit** icon.

    :::image type="content" source="media/dashboard-customize-visuals/edit-tile.png" alt-text="Screenshot of how to edit a tile in dashboards in Azure Data Explorer web UI.":::

1. Once you've finished making changes in the visual pane, select **Apply changes** to return to the dashboard and view your changes.

    :::image type="content" source="media/dashboard-customize-visuals/save-changes-dashboard.png" alt-text="Screenshot of how to save the changes to your dashboard tile in Azure Data Explorer web UI.":::

[!INCLUDE [customize-visuals](includes/customize-visuals.md)]


### Conditional formatting

> [!NOTE]
> This feature is supported for table, stat and multi stat visuals.

Conditional formatting is used to format the visual data points by their values using colors, tags, and icons.  Conditional formatting can be applied to a specific set of cells in a predetermined column or to entire rows.
Each visual can have one or more conditional formatting rules defined. When multiple rules conflict, the last rule will override previous rules.

#### Add a conditional formatting rule

1. Enter the editing mode of the table, stat, or multi stat visual you wish to conditionally format.
1. In the **Visual formatting** pane, scroll to the bottom and toggle **Conditional formatting** to **Show**.

    :::image type="content" source="media/dashboard-customize-visuals/add-conditional-formatting.png" alt-text="Screenshot of adding conditional formatting in dashboards in Azure Data Explorer web UI.":::

1. Select **Add rule**. A new rule appears with default values.

    :::image type="content" source="media/dashboard-customize-visuals/edit-new-rule.png" alt-text="Screenshot of editing new rule in dashboards in Azure Data Explorer.":::

1. Select the **Edit** icon. The **Conditional formatting** pane opens. You can either [Color by condition](#color-by-condition) or [Color by value](#color-by-value).

#### Color by condition

1. In this example, we're going to create a rule that will color the cells of states in which the damage column is a value greater than zero. Enter the following information:

    :::image type="content" source="media/dashboard-customize-visuals/edit-conditional-formatting.png" alt-text="Screenshot of editing conditional formatting in dashboards in Azure Data Explorer web UI.":::

    Field | Description | Suggested value
    |---|---|---|
    | Rule type | Condition-based rules or absolute value-based rules. | Color by condition
    | Rule name | Enter a name for this rule. If not defined, the condition column will be used by default. | Nonzero damage
    | Color style | Color formatting cell fill or text. |Bold
    | **Conditions**
    | Column | The column to be used for the condition definition. |  Damage
    | Operator | The operator to be used to define the condition. | Greater than ">"
    | Value | The value to be compared to the condition. |
    |**Formatting**
    | Apply options | Apply the formatting to cells in a specific column or to the entire row. | Apply to cells
    | Column | The column on which the formatting is applied. By default, this column is the condition column. This option is only available when **Formatting: Apply options** is set to *Apply to cells*. | State
    | Hide text | Hides the text in the formatted column. This option is only available when **Formatting: Apply options** is set to *Apply to cells*. | Off
    | Color | The color to apply to the formatted column/rows. | Red
    | Tag | Optional tag to add to the formatted column. This option is only available when **Formatting: Apply options** is set to *Apply to cells*. | Blank
    | Icon | Optional icon to add to the formatted column. This option is only available when **Formatting: Apply options** is set to *Apply to cells*. | No icon

1. Select **Save**. The visual will now be colored conditionally. Note in this example that the *State* column is highlighted when the *Damage* column is greater than zero.

    :::image type="content" source="media/dashboard-customize-visuals/color-by-condition.png" alt-text="Screenshot of resulting graph from color by condition.":::

#### Color by value

1. In this example, we're going to create a rule that will color the cells of event count on a gradient determined by the value of this count.  Enter the following information:

    :::image type="content" source="media/dashboard-customize-visuals/color-by-value.png" alt-text="Screenshot of conditional formatting to color by value.":::

    Field | Description | Suggested value
    |---|---|---|
    | Rule type | Condition-based rules or absolute value-based rules. | Color by value
    | Rule name | Enter a name for this rule. If not defined, the condition column will be used by default. |Event count
    | Column | The column to be used for the condition definition. | event
    | Theme | Color scheme. | Cold
    | Min value | Optional minimum value for conditional coloring.
    | Max value |  Optional maximum value for conditional coloring.
    | Apply options | Apply the formatting to cells in a specific column or to the entire row. | Apply to cells |

1. Select **Save**. The visual will now be colored conditionally. Note the color changes based on the value in the **event** column.

    :::image type="content" source="media/dashboard-customize-visuals/color-by-value-results.png" alt-text="Screenshot of results for coloring by value.":::

## Next steps

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* Explore query results with the [web UI results grid](web-results-grid.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* Use [Dashboard-specific visuals](dashboard-visuals.md)
