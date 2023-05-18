---
title: Write Kusto Query Language queries in the Azure Data Explorer web UI
description: In this article, you learn how to write Kusto Query Language (KQL) queries in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/17/2023
---
# Write KQL queries in the Azure Data Explorer web UI

The [Azure Data Explorer web UI](https://dataexplorer.azure.com/) query editor is designed to help you write [Kusto Query Language (KQL)](kusto/query/index.md) queries with the best practices. The query editor offers various features to enhance the query-writing experience. Some of these features include built-in KQL Intellisense, autocomplete, quick fix pop-ups, and customizable suggestions and warnings for best practices, performance, and correctness. In this article, we'll highlight the tools that you should know when writing KQL in the web UI.

## KQL tools

The **KQL tools** in the toolbar contains useful query-writing resources. There are options to **Duplicate query**, **Open command palette**, and view **Resources**, such as the [KQL to SQL cheat sheet](kusto/query/sqlcheatsheet.md), [keyboard shortcuts](web-ui-query-keyboard-shortcuts.md), and [KQL quick reference documentation](kql-quick-reference.md). 

## Intellisense and autocomplete

The query editor has built-in KQL Intellisence that offers contextual suggestions for functions and operators, and autocomplete that completes your queries, saving time and effort. There are also direct links to documentation from inside the Intellisense. To access the documentation...

## Quick fix

The quick fix feature helps you adhere to best practices while writing queries. Quick fix is relevant for three main scenarios: applying suggested fixes or warnings, converting a value into a variable, and defining functions before their use, thereby improving clarity and maintainability.

## Query recommendations

In your settings, under **Editing**, the **Set query recommendations** option allows you to tailor the query editor recommendations to your specific needs. This setting gives you control over the types of suggestions and warnings that appear, so that you can align them with your preferences and requirements.
