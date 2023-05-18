---
title: Write Kusto Query Language queries in the Azure Data Explorer web UI
description: In this article, you learn how to write Kusto Query Language (KQL) queries in the Azure Data Explorer web UI.
ms.topic: conceptual
ms.date: 05/18/2023
---
# Write Kusto Query Language queries in the Azure Data Explorer web UI

The [Azure Data Explorer web UI](https://dataexplorer.azure.com/) query editor offers various features to help you write [Kusto Query Language (KQL)](kusto/query/index.md) queries. Some of these features include built-in KQL Intellisense and autocomplete, inline documentation, and quick fix pop-ups. In this article, we'll highlight what you should know when writing KQL queries in the web UI.

## Intellisense and autocomplete

The query editor has built-in KQL Intellisense that offers contextual suggestions for functions and operators, and autocomplete that helps completes your queries to save you time and effort.

:::image type="content" source="media/web-ui-kql/intellisense-autocomplete.gif" alt-text="Moving screenshot showing how intellisense and autocomplete work." lightbox="media/web-ui-kql/intellisense-autocomplete.gif":::

## View documentation inline

The query editor provides inline access to documentation for KQL operators, functions, and management commands.

To view the documentation:

1. Hover over the operator, function, or command in the Intellisense.

1. Select the right arrow icon to open a preview of the documentation inline.

1. To open the documentation in your browser, select **View online**.

:::image type="content" source="media/web-ui-kql/inline-documentation.png" alt-text="Screenshot of inline KQL operator documentation." lightbox="media/web-ui-kql/inline-documentation.png":::

## Enhance queries with quick fix

Quick fix is relevant for three main scenarios: to fix the query based on a suggestion or warning, to extract a value into a variable, and to define functions before their use.

### Fix query based on suggestion or warning

The query editor provides suggestions and warnings as you write your queries. To customize the suggestions and warnings that you receive, see [Customize settings in Azure Data Explorer web UI](web-customize-settings.md).

To fix a query based on a suggestion or warning:

1. Hover over the term to view the suggestion or warning.

1. Select **Quick fix** to show the available quick fix options.

1. Select the desired quick fix option.

:::image type="content" source="media/web-ui-kql/quick-fix-suggestion.gif" alt-text="Screenshot of quick fix based on performance suggestion." lightbox="media/web-ui-kql/quick-fix-suggestion.gif":::

### Extract value into a variable

To extract a value out into a variable:

1. Select the value to extract.

1. Select the lightbulb icon or use the *Ctrl + .* keyboard shortcut to open the quick fix options.

1. Select **Extract value**.

:::image type="content" source="media/web-ui-kql/quick-fix-extract-value.gif" alt-text="Screenshot of quick fix to extract value to variable." lightbox="media/web-ui-kql/quick-fix-extract-value.gif":::

### Define functions inline

Use quick fix to define an existing function inline before its use, which can improve readability and maintainability of your queries.

To show a function definition:

1. Write and select the function name.

1. Select the lightbulb icon or use the *Ctrl + .* keyboard shortcut to open the quick fix options.

1. To define the function inline, select **Inline (Inline function)** or **Inline Recursive (Inline function)**.

:::image type="content" source="media/web-ui-kql/quick-fix-define-function.gif" alt-text="Moving screenshot of the define function quick fix feature." lightbox="media/web-ui-kql/quick-fix-define-function.gif":::

## Use KQL tools

The **KQL tools** in the toolbar contains useful query-writing resources. There are options to **Duplicate query**, **Open command palette**, and view **Resources**, such as the [KQL to SQL cheat sheet](kusto/query/sqlcheatsheet.md), [keyboard shortcuts](web-ui-query-keyboard-shortcuts.md), and [KQL quick reference documentation](kql-quick-reference.md).

:::image type="content" source="media/web-ui-kql/kql-tools.jpg" alt-text="Screenshot of the KQL tools option in the web UI toolbar." lightbox="media/web-ui-kql/kql-tools.jpg":::

## Next steps

* [Tutorial: Learn common operators](kusto/query/tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](kusto/query/tutorials/use-aggregation-functions.md)
* [Tutorial: Join data from multiple tables](kusto/query/tutorials/join-data-from-multiple-tables.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
