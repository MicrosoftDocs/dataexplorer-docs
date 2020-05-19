---
title: Search data in Kusto.Explorer
description: Learn how to use the Search++ feature of Kusto.Explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/13/2020
---

# Search++ mode

Search++ mode enables you to search for a term using search syntax across one or more tables.

1. In the Home tab, in the Query dropdown, select **Search++**.
1. Select **Multiple tables**.
1. Under **Choose tables**, define which tables to search.
1. In the edit box, enter your search phrase and select **Go**.
1. A heat-map of the table/time-slot grid shows which terms appear and where they appear.

[![](./Images/kusto-explorer-search-mode/search-plus-plus.png "Search++")](./Images/kusto-explorer-search-mode/search-plus-plus.png#lightbox)

1. Select a cell in the grid and select **View Details** to show the relevant entries in the results pane.

[![](./Images/kusto-explorer-search-mode/search-plus-plus-results.png "Search++ results")](./Images/kusto-explorer-search-mode/search-plus-plus-results.png#lightbox)

## Next steps

* Learn about [querying data in Kusto.Explorer](kusto-explorer-query-data.md)
* Learn about [sharing query results by email](kusto-explorer-share-queries.md)
* Learn about [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)
