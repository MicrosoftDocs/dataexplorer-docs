---
title: 'Azure Data Explorer data visualization'
description: 'Learn about the different ways you can visualize your Azure Data Explorer data'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/02/2020
---

# Data visualization with Azure Data Explorer 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data that is used to build complex analytics solutions for vast amounts of data. Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. This data can be transformed into actionable insights to make an impact on your business.

Data visualization and reporting is a critical step in the data analytics process. Azure Data Explorer supports many BI services so you can use the one that best fits your scenario and budget.

## Azure Data Explorer dashboards

Azure Data Explorer dashboards is a web application that enables you to run queries and build dashboards in the stand-alone web application, the [Web UI](web-query-data.md). Azure Data Explorer dashboards provide three main advantages:

* Natively export queries from the Web UI to Azure Data Explorer dashboards. 
* Explore the data in the Web UI.
* Optimized dashboard rendering performance.

For more information see, [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

## Kusto query language visualizations

The Kusto query language [`render operator`](kusto/query/renderoperator.md) offers various visualizations such as tables, pie charts, and bar charts to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more.

## Power BI

Azure Data Explorer provides the capability to connect to [Power BI](https://powerbi.microsoft.com) using various methods: 

  * [Built-in native Power BI connector](power-bi-connector.md)

  * [Query import from Azure Data Explorer into Power BI](power-bi-imported-query.md)
 
  * [SQL query](power-bi-sql-query.md)

## Microsoft Excel

Azure Data Explorer provides the capability to connect to [Microsoft Excel](https://products.office.com/excel) using the [built-in native Excel connector](excel-connector.md), or [import a query](excel-blank-query.md) from Azure Data Explorer into Excel.

## Grafana

[Grafana](https://grafana.com) provides an Azure Data Explorer plugin that enables you to visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize the data](grafana.md). 

## Kibana

Azure Data Explorer provides the capability to connect to [Kibana](https://www.elastic.co/guide/en/kibana/6.8/discover.html) using K2Bridge, an open source connector. You [set up Azure Data Explorer as a data source for Kibana, and then visualize the data](k2bridge.md).

## ODBC connector

Azure Data Explorer provides an [Open Database Connectivity (ODBC) connector](connect-odbc.md) so any application that supports ODBC can connect to Azure Data Explorer.

## Tableau

Azure Data Explorer provides the capability to connect to [Tableau](https://www.tableau.com)
 using the [ODBC connector](connect-odbc.md) and then [visualize the data in Tableau](tableau.md).

## Qlik

Azure Data Explorer provides the capability to connect to [Qlik](https://www.qlik.com) using the [ODBC connector](connect-odbc.md) and then create Qlik Sense dashboards and visualize the data. Using the following video, you can learn to visualize Azure Data Explorer data with Qlik. 

> [!VIDEO https://www.youtube.com/embed/nhWIiBwxjjU]  

## Sisense

Azure Data Explorer provides the capability to connect to [Sisense](https://www.sisense.com) using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize the data](sisense.md).

## Redash

You can use [Redash](https://redash.io/) to build dashboards and visualize data. [Set up Azure Data Explorer as a data source for Redash, and then visualize the data](redash.md).
