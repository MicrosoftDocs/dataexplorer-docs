---
title: What is Azure Data Explorer?
description: Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.
ms.reviewer: mblythe
ms.topic: overview
ms.date: 08/28/2023
adobe-target: true

# Customer intent: As a data analyst, I want to understand Azure Data Explorer, so I can decide if it's suitable for my analytics workloads.
---

# What is Azure Data Explorer?

Azure Data Explorer is a fully managed, high-performance, big data analytics platform that makes it easy to analyze high volumes of data in near real time. The Azure Data Explorer toolbox gives you an end-to-end solution for data ingestion, query, visualization, and management.

By analyzing structured, semi-structured, and unstructured data across time series, and by using Machine Learning, Azure Data Explorer makes it simple to extract key insights, spot patterns and trends, and create forecasting models. Azure Data Explorer uses a traditional relational model, organizing data into tables with strongly-typed schemas. Tables are stored within databases, and a cluster can manage multiple databases. Azure Data Explorer is scalable, secure, robust, and enterprise-ready, and is useful for log analytics, time series analytics, IoT, and general-purpose exploratory analytics.

Azure Data Explorer capabilities are extended by other services built on its powerful query language: [Kusto Query Language (KQL)](kusto/query/index.md). These services include [Azure Monitor logs](/azure/log-analytics/), [Application Insights](/azure/application-insights/), [Time Series Insights](/azure/time-series-insights/), and [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint).

## When should you use Azure Data Explorer?

Use the following questions to help decide if Azure Data Explorer is right for your use case:

* **Interactive analytics**:  Is interactive analysis part of the solution? For example, aggregation, correlation, or anomaly detection.
* **Variety, Velocity, Volume**: Is your schema diverse? Do you need to ingest massive amounts of data in near real-time?
* **Data organization**: Do you want to analyze raw data? For example, not fully curated star schema.
* **Query concurrency**: Will multiple users or processes use Azure Data Explorer?
* **Build vs Buy**: Do you plan on customizing your data platform?

Azure Data Explorer is ideal for enabling interactive analytics capabilities over high velocity, diverse raw data. Use the following decision tree to help you decide if Azure Data Explorer is right for you:

:::image type="content" source="media/data-explorer-overview/decision-tree.png" alt-text="This image is a schematic workflow image of an Azure Data Explorer decision tree.":::

## What makes Azure Data Explorer unique?

### Data velocity, variety, and volume

With Azure Data Explorer, you can ingest terabytes of data in minutes in batch or streaming mode. You can query petabytes of data, with results returned within milliseconds to seconds. Azure Data Explorer provides high velocity (millions of events per second), low latency (seconds), and linear scale ingestion of raw data. Ingest your data in different formats and structures, flowing from various pipelines and sources.

### User-friendly query language

Query Azure Data Explorer with the [Kusto Query Language (KQL)](kusto/query/index.md), an open-source language initially invented by the team. The language is simple to understand and learn, and highly productive. You can use simple operators and advanced analytics. Azure Data Explorer also supports [T-SQL](t-sql.md).

### Advanced analytics

Use Azure Data Explorer for time series analysis with a large set of functions including: adding and subtracting time series, filtering, regression, seasonality detection, geospatial analysis, anomaly detection, scanning, and forecasting. Time series functions are optimized for processing thousands of time series in seconds. Pattern detection is made easy with cluster plugins that can diagnose anomalies and do root cause analysis. You can also extend Azure Data Explorer capabilities by [embedding python code](kusto/query/pythonplugin.md) in KQL queries.

### Easy-to-use wizard

The [ingestion wizard](./ingest-data-wizard.md) makes the data ingestion process easy, fast, and intuitive. The [Azure Data Explorer web UI](web-query-data.md) provides an intuitive and guided experience that helps you ramp-up quickly to start ingesting data, creating database tables, and mapping structures. It enables one time or a continuous ingestion from various sources and in various data formats. Table mappings and schema are auto suggested and easy to modify.

### Versatile data visualization

Data visualization helps you gain important insights. Azure Data Explorer offers built-in visualization and [dashboarding](azure-data-explorer-dashboards.md) out of the box, with support for various charts and visualizations. It has native integration with [Power BI](power-bi-data-connector.md?tabs=connector), native connectors for [Grafana](grafana.md), [Kibana](k2bridge.md) and Databricks, ODBC support for [Tableau](tableau.md), [Sisense](sisense.md), Qlik, and more.

### Automatic ingest, process, and export

Azure Data Explorer supports server-side stored functions, continuous ingest, and continuous export to Azure Data Lake store. It also supports ingestion time-mapping transformations on the server side, update policies, and precomputed scheduled aggregates with materialized views.

## Azure Data Explorer flow

The following diagram shows the different aspects of working with Azure Data Explorer.

![Azure Data Explorer flow.](media/data-explorer-overview/workflow.png)

Generally speaking, when you interact with Azure Data Explorer, you're going to go through the following workflow:  

> [!NOTE]
> You can access your Azure Data Explorer resources either in the [Azure Data Explorer web UI](web-query-data.md) or by using [SDKs](kusto/api/index.md).

1. **Create database:** Create a *cluster* and then create one or more *databases* in that cluster. Each Azure Data Explorer cluster can hold up to 10,000 databases and each database up to 10,000 tables. The data in each table is stored in data shards also called "extents". All data is automatically indexed and partitioned based on the ingestion time. This means you can store a lot of varied data and because of the way it's stored, you get fast access to querying it. [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)

1. **Ingest data:** Load data into database tables so that you can run queries against it. Azure Data Explorer supports several [ingestion methods](ingest-data-overview.md), each with its own target scenarios. These methods include ingestion tools, connectors and plugins to diverse services, managed pipelines, programmatic ingestion using SDKs, and direct access to ingestion. Get started with the [ingestion wizard](./ingest-data-wizard.md).

1. **Query database:** Azure Data Explorer uses the [Kusto Query Language](kusto/query/index.md), which is an expressive, intuitive, and highly productive query language. It offers a smooth transition from simple one-liners to complex data processing scripts, and supports querying structured, semi-structured, and unstructured (text search) data. There's a wide variety of query language operators and functions ([aggregation](kusto/query/aggregation-functions.md), filtering, [time series functions](./kusto/query/time-series-analysis.md), [geospatial functions](kusto/query/geospatial-grid-systems.md), [joins](kusto/query/joinoperator.md), [unions](kusto/query/unionoperator.md), and more) in the language. KQL supports [cross-cluster and cross-database queries](kusto/query/cross-cluster-or-database-queries.md), and is feature rich from a parsing (json, XML, and more) perspective. The language also natively supports advanced analytics.

    Use the web application to run, review, and share queries and results. You can also send queries programmatically (using an SDK) or to a REST API endpoint. If you're familiar with SQL, get started with the [SQL to Kusto cheat sheet](kusto/query/sqlcheatsheet.md). [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md)

1. **Visualize results:**  Use different visual displays of your data in the native Azure Data Explorer [Dashboards](azure-data-explorer-dashboards.md). You can also display your results using connectors to some of the [leading visualization services](viz-overview.md), such as [Power BI](power-bi-data-connector.md?tabs=connector) and [Grafana](grafana.md). Azure Data Explorer also has [ODBC](connect-odbc.md) and JDBC connector support to tools such as [Tableau](tableau.md) and [Sisense](sisense.md).

## How to provide feedback

We would be thrilled to hear your feedback about Azure Data Explorer and the Kusto Query Language at:

* Ask questions
  * [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-data-explorer)
  * [Microsoft Q&A](/answers/topics/azure-data-explorer.html)
  * [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Azure-Data-Explorer/bd-p/Kusto)
* [Make product suggestions in User Voice](https://aka.ms/AzureDataExplorer.UserVoice)

## Next steps

* [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
* [Quickstart: Ingest data from an event hub into Azure Data Explorer](ingest-data-event-hub.md)
* [Quickstart: Query data in Azure Data Explorer](web-query-data.md)
* [Find an Azure Data Explorer partner](find-my-partner.md)