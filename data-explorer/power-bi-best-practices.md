---
title: 'Best practices for using Power BI to query and visualize Azure Data Explorer data'
description: 'In this article, you learn best practices for using Power BI to query and visualize Azure Data Explorer data.'
ms.reviewer: gabil
ms.topic: how-to
ms.date: 01/01/2023

# Customer intent: As a data analyst, I want to visualize my data for additional insights using Power BI.
---

# Best practices for using Power BI to query and visualize Azure Data Explorer data

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. [Power BI](/power-bi/) is a business analytics solution that lets you visualize your data and share the results across your organization. To import data into Power BI, see [import a query from Azure Data Explorer into Power BI](power-bi-data-connector.md), or use a [SQL query](power-bi-sql-query.md). This article supplies you with tips for querying and visualizing your Azure Data Explorer data with Power BI.

## Best practices for using Power BI

When working with terabytes of fresh raw data, follow these guidelines to keep Power BI dashboards and reports snappy and updated:

* **Travel light** - Bring only the data that you need for your reports to Power BI. For deep interactive analysis, use the [Azure Data Explorer web UI](web-query-data.md) that is optimized for ad-hoc exploration with the Kusto Query Language.

* **Composite model** - Use [composite model](/power-bi/desktop-composite-models) to combine aggregated data for top-level dashboards with filtered operational raw data. You can clearly define when to use raw data and when to use an aggregated view.

* **Import mode versus [DirectQuery](/power-bi/connect-data/desktop-directquery-about) mode**:

  * Use **Import** mode for interaction of smaller datasets.

  * Use **DirectQuery** mode for large, frequently updated datasets. For example, create dimension tables using **Import** mode since they're small and don't change often. Set the refresh interval according to the expected rate of data updates. Create fact tables using **DirectQuery** mode since these tables are large and contain raw data. Use these tables to present filtered data using Power BI [drillthrough](/power-bi/desktop-drillthrough). When using **DirectQuery**, you can use [**Query Reduction**](/power-bi/connect-data/desktop-directquery-about#report-design-guidance) to prevent reports from loading data before you're ready.

* **Parallelism** – Azure Data Explorer is a linearly scalable data platform, therefore, you can improve the performance of dashboard rendering by increasing the parallelism of the end-to-end flow as follows:

  * Increase the number of [concurrent connections in DirectQuery in Power BI](/power-bi/desktop-directquery-about#maximum-number-of-connections-option-for-directquery).

  * Use [weak consistency to improve parallelism](kusto/concepts/queryconsistency.md). This may have an impact on the freshness of the data.

* **Effective slicers** – Use [sync slicers](/power-bi/visuals/power-bi-visualization-slicers#sync-and-use-slicers-on-other-pages) to prevent reports from loading data before you're ready. After you structure the dataset, place all visuals, and mark all the slicers, you can select the sync slicer to load only the data needed.

* **Use filters** - Use as many Power BI filters as possible to focus the Azure Data Explorer search on the relevant data shards.

* **Efficient visuals** – Select the most performant visuals for your data.

## Tips for using the Azure Data Explorer connector for Power BI to query data

To learn about tips and tricks for using Kusto Query Language in Power BI reports and visualizations, see [Tips for using the Azure Data Explorer Connector to query data](/power-query/connectors/azuredataexplorer#tips-for-using-the-azure-data-explorer-connector-to-query-data).

## Related content

* [Use Azure Data Explorer data in Power BI](power-bi-data-connector.md)
