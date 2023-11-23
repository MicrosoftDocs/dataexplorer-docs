---
title: Write Kusto Query Language queries in the Azure Data Explorer web UI
description: In this article, you learn how to write Kusto Query Language (KQL) queries in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/28/2023
---
# Write Kusto Query Language queries in the Azure Data Explorer web UI

The [Azure Data Explorer web UI](https://dataexplorer.azure.com/) query editor offers various features to help you write [Kusto Query Language (KQL)](kusto/query/index.md) queries. Some of these features include built-in KQL Intellisense and autocomplete, inline documentation, and quick fix pop-ups. In this article, we'll highlight what you should know when writing KQL queries in the web UI.

## KQL Intellisense and autocomplete

The query editor has built-in KQL Intellisense that offers contextual suggestions for functions and operators, and autocomplete that completes your queries to save you time and effort.

To use KQL Intellisense and autocomplete:

1. Start typing a query in the query editor.

1. KQL Intellisense activates, presenting dropdown options for entities, operators, functions, and more. Move between these options using the arrow keys on your keyboard, and select one by pressing *Enter* or selecting the option with your mouse.

1. If you notice underlined keywords, hover over them to reveal errors or suggestions that triggered the highlighting.

:::image type="content" source="media/web-ui-kql/intellisense-autocomplete.gif" alt-text="Moving screenshot showing how intellisense and autocomplete work." lightbox="media/web-ui-kql/intellisense-autocomplete.gif":::

## View documentation inline

The query editor provides inline access to documentation for KQL operators, functions, and management commands.

To view inline documentation:

1. Hover over the operator, function, or command in the Intellisense.

1. Select the right arrow icon to open an inline preview of the documentation.

    :::image type="content" source="media/web-ui-kql/inline-documentation-preview.png" alt-text="Screenshot of inline KQL operator documentation." lightbox="media/web-ui-kql/inline-documentation-preview.png":::

    > [!NOTE]
    > The preview remains active until you close it or end your session, even for other operators and functions.

1. If you'd like to open the full documentation in your browser, select **view online**.

## Quick fix: Query suggestion or warning

The query editor provides suggestions and warnings as you write your queries. The quick fix feature can be used to adjust the query based on these suggestions and warnings.

To fix a query based on a suggestion or warning:

1. Hover over the term to view the suggestion or warning.

1. Select **Quick fix** to show the available quick fix options.

1. Select the desired quick fix option.

:::image type="content" source="media/web-ui-kql/quick-fix-suggestion.gif" alt-text="Screenshot of quick fix based on performance suggestion." lightbox="media/web-ui-kql/quick-fix-suggestion.gif":::

> [!TIP]
> To customize the suggestions and warnings that you receive, see [Customize settings in Azure Data Explorer web UI](web-customize-settings.md).

## Quick fix: Extract value into a variable

The quick fix feature can also be used to extract out a value into a variable:

1. Select the value to extract.

1. Select the light bulb icon or press *Ctrl + .* to open the quick fix options.

1. Select **Extract value**.

:::image type="content" source="media/web-ui-kql/quick-fix-extract-value.gif" alt-text="Screenshot of quick fix to extract value to variable." lightbox="media/web-ui-kql/quick-fix-extract-value.gif":::

## Quick fix: Define functions inline

The quick fix feature can also be used to define an existing function inline before its use. Adding an inline function definition may be useful to improve readability and maintainability of your queries.

To show a function definition:

1. Write and select the function name.

1. Select the light bulb icon or press *Ctrl + .* to open the quick fix options.

1. To define the function inline, select **Inline (Inline function)** or **Inline Recursive (Inline function)**.

:::image type="content" source="media/web-ui-kql/quick-fix-define-function.gif" alt-text="Moving screenshot of the define function quick fix feature." lightbox="media/web-ui-kql/quick-fix-define-function.gif":::

## Use KQL tools

The **KQL tools** in the toolbar help you quickly duplicate a query, open the command palette, or access documentation.

To use KQL tools:

1. In the toolbar, select **KQL tools**.

1. Choose from options like **Duplicate query**, **Open command palette**, or hover over **Resources** to access documentation links. This list includes resources such as the [KQL to SQL cheat sheet](kusto/query/sqlcheatsheet.md), [Keyboard shortcuts](web-ui-query-keyboard-shortcuts.md), and [KQL quick reference documentation](kql-quick-reference.md).

:::image type="content" source="media/web-ui-kql/kql-tools.jpg" alt-text="Screenshot of the KQL tools option in the web UI toolbar." lightbox="media/web-ui-kql/kql-tools.jpg":::

## Related content

* [Tutorial: Learn common operators](kusto/query/tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](kusto/query/tutorials/use-aggregation-functions.md)
* [Tutorial: Join data from multiple tables](kusto/query/tutorials/join-data-from-multiple-tables.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
