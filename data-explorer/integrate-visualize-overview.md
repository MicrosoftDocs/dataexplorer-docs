---
title: Overview of visualize integrations
description: Learn about the available visualize integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 11/26/2023
# CustomerIntent: As a data ingestor, I want to know what visualize connectors and tools are available, so that I can choose the right one for my use case.
---
# Visualize integrations overview

amounts of data. Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. This data can be transformed into actionable insights to make an impact on your business.

Data visualization and reporting is a critical step in the data analytics process. Azure Data Explorer supports many BI services so you can use the one that best fits your scenario and budget.

Use the following filters to see other connectors, tools, and integrations are available for your use case.

:::row:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Overview](tools-integrations-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Data integrations](integrate-data-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Query integrations](integrate-query-overview.md)
   :::column-end:::
:::row-end:::

The following tables summarizes the available visualize connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name | Functionality | Supports streaming? | Supports free cluster? | Type | Use cases |
|--|--|:-:|--|--|--|

## [Tools and integrations](#tab/integrations)

### Azure Data Explorer dashboards

Azure Data Explorer dashboards is a web application that enables you to run queries and build dashboards in the stand-alone web application, the [Azure Data Explorer web UI](web-query-data.md). Azure Data Explorer dashboards provide three main advantages:

* Natively export queries from the Azure Data Explorer web UI to Azure Data Explorer dashboards.
* Explore the data in the Azure Data Explorer web UI.
* Optimized dashboard rendering performance.

For more information, see, [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

### Kusto Query Language visualizations

The Kusto Query Language [`render operator`](kusto/query/renderoperator.md) offers various visualizations such as tables, pie charts, and bar charts to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more.

### Power BI

Azure Data Explorer provides the capability to connect to [Power BI](https://powerbi.microsoft.com) using various methods:

* [Built-in native Power BI connector](power-bi-data-connector.md?tabs=connector)

* [Query import from Azure Data Explorer into Power BI](power-bi-data-connector.md)

* [SQL query](power-bi-sql-query.md)

### Microsoft Excel

Azure Data Explorer provides the capability to connect to [Microsoft Excel](https://products.office.com/excel) using the [built-in native Excel connector](excel-connector.md), or [import a query](excel-blank-query.md) from Azure Data Explorer into Excel.

### Grafana

[Grafana](https://grafana.com) provides an Azure Data Explorer plugin that enables you to visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize the data](grafana.md).

### Kibana

Azure Data Explorer provides the capability to connect to [Kibana](https://www.elastic.co/guide/en/kibana/6.8/discover.html) using K2Bridge, an open source connector. You [set up Azure Data Explorer as a data source for Kibana, and then visualize the data](k2bridge.md).

### ODBC connector

Azure Data Explorer provides an [Open Database Connectivity (ODBC) connector](connect-odbc.md) so any application that supports ODBC can connect to Azure Data Explorer.

### Tableau

Azure Data Explorer provides the capability to connect to [Tableau](https://www.tableau.com)
 using the [ODBC connector](connect-odbc.md) and then [visualize the data in Tableau](tableau.md).

### Qlik

Azure Data Explorer provides the capability to connect to [Qlik](https://www.qlik.com) using the [ODBC connector](connect-odbc.md) and then create Qlik Sense dashboards and visualize the data. Using the following video, you can learn to visualize Azure Data Explorer data with Qlik.

> [!VIDEO https://www.youtube.com/embed/nhWIiBwxjjU]

### Sisense

Azure Data Explorer provides the capability to connect to [Sisense](https://www.sisense.com) using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize the data](sisense.md).

### Redash

You can use [Redash](https://redash.io/) to build dashboards and visualize data. [Set up Azure Data Explorer as a data source for Redash, and then visualize the data](redash.md).

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](tools-integrations-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Query integrations overview](integrate-query-overview.md)
