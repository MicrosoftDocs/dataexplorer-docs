---
title: Write Kusto Query Language queries in the Azure Data Explorer web UI
description: In this article, you learn how to write Kusto Query Language (KQL) queries in the Azure Data Explorer web UI.
ms.topic: conceptual
ms.date: 05/17/2023
---
# Write KQL queries in the Azure Data Explorer web UI

The [Azure Data Explorer web UI](https://dataexplorer.azure.com/) query editor is designed to help you write [Kusto Query Language (KQL)](kusto/query/index.md) queries with the best practices. The query editor offers various features to enhance the query-writing experience. Some of these features include built-in KQL Intellisense, autocomplete, quick fix pop-ups, and customizable suggestions and warnings for best practices, performance, and correctness. In this article, we'll highlight the tools that you should know when writing KQL in the web UI.

## KQL Intellisense and autocomplete

The query editor has built-in KQL Intellisense that offers contextual suggestions for functions and operators, and autocomplete that helps completes your queries to save you time and effort.

:::image type="content" source="media/web-ui-kql/intellisense-autocomplete.gif" alt-text="Moving screenshot showing how intellisense and autocomplete work." lightbox="media/web-ui-kql/intellisense-autocomplete.gif":::

## Access KQL documentation

KQL documentation is directly accessible from the query editor. To view the documentation inline, hover over the operator or function when it appears in the KQL Intellisense, then select the right arrow icon to open the documentation. From there, you can also open the full documentation in your browser by selecting **View online**.

:::image type="content" source="media/web-ui-kql/inline-documentation.png" alt-text="Screenshot of inline KQL operator documentation." lightbox="media/web-ui-kql/inline-documentation.png":::

## Enhance queries with Quick fix

The quick fix feature helps you adhere to best practices while writing queries. Quick fix is relevant for three main scenarios: to apply suggested fixes or warnings, to convert a value into a variable, and to define functions before their use, thereby improving clarity and maintainability.

### Apply suggestions or warnings

:::image type="content" source="media/web-ui-kql/quick-fix-optimization.png" alt-text="Screenshot of quick fix based on performance suggestion." lightbox="media/web-ui-kql/quick-fix-optimization.png":::

### Convert a value into a variable

:::image type="content" source="media/web-ui-kql/quick-fix-extract-value.gif" alt-text="Screenshot of quick fix to extract value to variable." lightbox="media/web-ui-kql/quick-fix-extract-value.gif":::

### Define functions before use

:::image type="content" source="media/web-ui-kql/quick-fix-define-function.gif" alt-text="Moving screenshot of the define function quick fix feature." lightbox="media/web-ui-kql/quick-fix-define-function.gif":::

## Set query recommendations

In your settings, under **Editing**, the **Set query recommendations** option allows you to tailor the query editor recommendations to your specific needs. This setting gives you control over the types of suggestions and warnings that appear, so that you can align them with your preferences and requirements.

:::image type="content" source="media/web-ui-kql/set-query-recommendations-dialog.png" alt-text="Screenshot of the set query recommendations dialog box." lightbox="media/web-ui-kql/set-query-recommendations-dialog.png":::

## KQL tools

The **KQL tools** in the toolbar contains useful query-writing resources. There are options to **Duplicate query**, **Open command palette**, and view **Resources**, such as the [KQL to SQL cheat sheet](kusto/query/sqlcheatsheet.md), [keyboard shortcuts](web-ui-query-keyboard-shortcuts.md), and [KQL quick reference documentation](kql-quick-reference.md).

:::image type="content" source="media/web-ui-kql/kql-tools.jpg" alt-text="Screenshot of the KQL tools option in the web UI toolbar." lightbox="media/web-ui-kql/kql-tools.jpg":::

## See also

* [Tutorial: Learn common operators](kusto/query/tutorials/learn-common-operators.md)
* [Tutorial: Use aggregation functions](kusto/query/tutorials/use-aggregation-functions.md)
* [Tutorial: Join data from multiple tables](kusto/query/tutorials/join-data-from-multiple-tables.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
