---
title: Apply conditional formatting to Azure Data Explorer dashboard visuals
description: Learn how to apply conditional formatting to Azure Data Explorer dashboard visuals.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 09/21/2023
---

# Apply conditional formatting to Azure Data Explorer dashboard visuals

Conditional formatting allows you to format the visual representation of data points based on their values, utilizing colors, tags, and icons. Conditional formatting can be applied either to a specific set of cells within a designated column or to entire rows.

For each visual, you have the flexibility to define one or more conditional formatting rules. In cases where multiple rules conflict, the last rule defined takes precedence over any previous ones.

## Prerequisites

* Editor permissions on a [Azure Data Explorer dashboard](azure-data-explorer-dashboards.md)
* A table, stat, or multi stat dashboard visual

## Add a conditional formatting rule

1. On the tile that you'd like to customize, select the **Edit** icon.

1. In the **Visual formatting** pane, scroll to the bottom and toggle **Conditional formatting** from **Hide** to **Show**.

    :::image type="content" source="media/dashboard-customize-visuals/add-conditional-formatting.png" alt-text="Screenshot of adding conditional formatting in dashboards in Azure Data Explorer web UI.":::

1. Select **Add rule**. A new rule appears with default values.

    :::image type="content" source="media/dashboard-customize-visuals/edit-new-rule.png" alt-text="Screenshot of editing new rule in dashboards in Azure Data Explorer.":::

1. On the new rule, select the **Edit** icon. The **Conditional formatting** pane opens. For table visuals, you can either [color by condition](#color-by-condition) or [color by value](#color-by-value). For stat and multi stat visuals, you can only [color by condition](#color-by-condition).

## Color by condition

The color by condition rule allows you to set one or more logical conditions that must be met for a value to be colored. This option is available for table, stat, and multi stat visuals.

To color your results by condition:

1. In the **Conditional formatting** window, set the **Rule type** to **Color by condition**. For stat and multi stat visuals, color by condition is the only option.

1. Enter information for the following fields:

    | Field | Required | Description |
    |--|--|--|
    | **Rule name** |  | A name for the rule. If not defined, the condition column is used. |
    | **Color style** | &check; | Determines the color formatting: **Bold** or **Light**. |
    | **Column** | &check; | The column for the condition definition. |
    | **Operator** | &check; | The operator for the condition definition. |
    | **Value** | &check; | The value for the condition definition. |
    | **Color** | &check; | The color to apply to the rows that meet the condition: **Red**, **Yellow**, **Green**, or **Blue**. |
    | **Tag** |  | A tag to add to the formatted column. |
    | **Icon** |  | An icon to add to the formatted column. |

    For table visuals, enter information for the following extra fields:

    | Field | Required | Description |
    |--|--|--|
    | **Apply options** | &check; | Apply the formatting to cells in a specific column or to the entire row. |
    | **Column**| &check; | The column to which to apply the formatting.|
    | **Hide text** | | A toggle option to hide text within a formatted column. This option is only available when applying formatting to cells, not to rows. Instead of coloring the cell and displaying the text, the cell is colored without revealing its content.|

    > [!NOTE]
    > To define more than one condition, select **Add condition** at the end of the **Conditions** section.

1. Select **Save**. In the following example, the `State` column is highlighted when the `Damage` column is greater than zero.

    :::image type="content" source="media/dashboard-customize-visuals/color-by-condition.png" alt-text="Screenshot of resulting graph from color by condition.":::

## Color by value

The color by value rule allows you to visualize values on a color gradient. This option is available for table visuals.

To color your results by value:

1. In the **Conditional formatting** window, set the **Rule type** to **Color by value**.

    :::image type="content" source="media/dashboard-conditional-formatting/color-by-value.png" alt-text="Screenshot of option to color by value." lightbox="media/dashboard-conditional-formatting/color-by-value.png":::

1. Enter information for the following fields:

    | Field | Required | Description |
    |--|--|--|
    | **Rule name** |  | A name for the rule. If not defined, the condition column is used. |
    | **Column** | &check; | The column to be used for the condition definition. |
    | **Theme** | &check; | The color theme: **Traffic lights**, **Cold**, **Warm**, **Blue**, **Red**, or **Yellow**. The default is **Traffic lights**. |
    | **Min value** |  | Minimum value for conditional coloring. |
    | **Max value** |  | Maximum value for conditional coloring. |
    | **Reverse colors** |  | A toggle option that defines the direction of the gradient. |
    | **Apply options** | &check; | Apply the formatting to cells in a specific column or to the entire row. |

1. Select **Save**. In the following example, the color changes based on the value in the `Event` column.

    :::image type="content" source="media/dashboard-customize-visuals/color-by-value-results.png" alt-text="Screenshot of results for coloring by value.":::

## Related content

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards)
* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
