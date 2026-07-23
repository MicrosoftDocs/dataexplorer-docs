---
title: What is Azure Data Explorer?
description: Azure Data Explorer is a fast, fully managed, and highly scalable data analytics service for log and telemetry data.
ms.reviewer: mblythe
ms.topic: overview
ms.date: 07/23/2026
ai-usage: ai-assisted
adobe-target: true

# Customer intent: As a data analyst, I want to understand Azure Data Explorer, so I can decide if it's suitable for my analytics workloads.
---

# What is Azure Data Explorer?

Azure Data Explorer is a fully managed, high-performance, big data analytics platform that makes it easy to analyze high volumes of data in near real time. The Azure Data Explorer toolbox gives you an end-to-end solution for data ingestion, query, visualization, and management.

By analyzing structured, semi-structured, and unstructured data across time series, and by using machine learning, Azure Data Explorer makes it simple to extract key insights, spot patterns and trends, and create forecasting models. Azure Data Explorer uses a traditional relational model, organizing data into tables with strongly typed schemas. Tables are stored within databases, and a cluster can manage multiple databases. Azure Data Explorer is scalable, secure, robust, and enterprise-ready. It's useful for log analytics, time series analytics, IoT, and general-purpose exploratory analytics.

Other services built on its query language, [Kusto Query Language (KQL)](/kusto/query/index?view=azure-data-explorer&preserve-view=true), extend Azure Data Explorer capabilities. These services include [Azure Monitor Logs](/azure/azure-monitor/logs/log-analytics-overview), [Application Insights](/azure/azure-monitor/app/app-insights-overview), and [Microsoft Defender for Endpoint](/defender-endpoint/microsoft-defender-endpoint).

## When should you use Azure Data Explorer?

Use the following questions to help decide if Azure Data Explorer is right for your use case:

* **Interactive analytics**: Is interactive analysis part of the solution? For example, aggregation, correlation, or anomaly detection.
* **Variety, velocity, volume**: Is your schema diverse? Do you need to ingest massive amounts of data in near real time?
* **Data organization**: Do you want to analyze raw data? For example, data that isn't a fully curated star schema.
* **Query concurrency**: Will multiple users or processes use Azure Data Explorer?
* **Build vs. buy**: Do you plan on customizing your data platform?

Azure Data Explorer is ideal for enabling interactive analytics capabilities over high-velocity, diverse raw data. Use the following decision tree to help you decide if Azure Data Explorer is right for you:

:::image type="content" source="media/data-explorer-overview/decision-tree.png" alt-text="Decision tree diagram that guides you through when to use Azure Data Explorer based on your analytics needs.":::

## What makes Azure Data Explorer unique?

### Data velocity, variety, and volume

With Azure Data Explorer, you can ingest terabytes of data in minutes via queued ingestion or streaming ingestion. You can query petabytes of data, with results returned within milliseconds to seconds. Azure Data Explorer provides high velocity (millions of events per second), low latency (seconds), and linear scale ingestion of raw data. Ingest your data in different formats and structures, flowing from various pipelines and sources.

### User-friendly query language

Query Azure Data Explorer by using [Kusto Query Language (KQL)](/kusto/query/index?view=azure-data-explorer&preserve-view=true), an open-source language that the Azure Data Explorer team created. The language is simple to understand and learn, and highly productive. You can use simple operators and advanced analytics. Azure Data Explorer also supports [T-SQL](t-sql.md).

### Advanced analytics

Use Azure Data Explorer for time series analysis with a large set of functions, including adding and subtracting time series, filtering, regression, seasonality detection, geospatial analysis, anomaly detection, scanning, and forecasting. Time series functions are optimized to process thousands of time series in seconds. Pattern detection is easy with cluster plugins that can diagnose anomalies and do root-cause analysis. You can also extend Azure Data Explorer capabilities by [embedding Python code](/kusto/query/python-plugin?view=azure-data-explorer&preserve-view=true) in KQL queries.

### Easy-to-use wizard

The [get data experience](ingest-data-overview.md) makes the data ingestion process easy, fast, and intuitive. The [Azure Data Explorer web UI](web-query-data.md) provides an intuitive and guided experience that helps you quickly start ingesting data, creating database tables, and mapping structures. It enables one-time or continuous ingestion from various sources and in various data formats. Table mappings and schema are automatically suggested and easy to modify.

### Versatile data visualization

Data visualization helps you gain important insights. Azure Data Explorer offers built-in visualization and [dashboarding](azure-data-explorer-dashboards.md) out of the box, with support for various charts and visualizations. It has native integration with [Power BI](power-bi-data-connector.md?tabs=connector), native connectors for [Grafana](grafana.md), [Kibana](k2bridge.md), and Databricks, and ODBC support for [Tableau](tableau.md), [Sisense](sisense.md), Qlik, and more.

### Automatic ingest, process, and export

Azure Data Explorer supports server-side stored functions, continuous ingest, and continuous export to Azure Data Lake Storage. It also supports ingestion-time mapping transformations on the server side, update policies, and precomputed scheduled aggregates with materialized views.

## Azure Data Explorer flow

The following diagram shows the different aspects of working with Azure Data Explorer.

:::image type="content" source="media/data-explorer-overview/workflow.png" alt-text="Diagram that shows the Azure Data Explorer workflow, from creating a database through ingesting, querying, and visualizing data.":::

When you interact with Azure Data Explorer, you typically follow this workflow:

> [!NOTE]
> You can access your Azure Data Explorer resources either in the [Azure Data Explorer web UI](web-query-data.md) or by using [SDKs](/kusto/api/index?view=azure-data-explorer&preserve-view=true).

1. **Create a database:** Create a *cluster*, and then create one or more *databases* in that cluster. Each Azure Data Explorer cluster can hold up to 10,000 databases, and each database can hold up to 10,000 tables. The data in each table is stored in data shards, also called *extents*. All data is automatically indexed and partitioned based on the ingestion time. This storage architecture means you can store a large amount of varied data, and you get fast access when querying it. [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)

1. **Ingest data:** Load data into database tables so that you can run queries against it. Azure Data Explorer supports several [ingestion methods](ingest-data-overview.md), each with its own target scenarios. These methods include ingestion tools, connectors and plugins to diverse services, managed pipelines, programmatic ingestion using SDKs, and direct access to ingestion. Get started with the [get data experience](ingest-data-overview.md).

1. **Query a database:** Azure Data Explorer uses [Kusto Query Language](/kusto/query/index?view=azure-data-explorer&preserve-view=true), which is an expressive, intuitive, and highly productive query language. It offers a smooth transition from simple one-liners to complex data processing scripts, and it supports querying structured, semi-structured, and unstructured (text search) data. The language has a wide variety of query operators and functions, including [aggregation](/kusto/query/aggregation-functions?view=azure-data-explorer&preserve-view=true), filtering, [time series functions](/kusto/query/time-series-analysis?view=azure-data-explorer&preserve-view=true), [geospatial functions](/kusto/query/geospatial-grid-systems?view=azure-data-explorer&preserve-view=true), [joins](/kusto/query/join-operator?view=azure-data-explorer&preserve-view=true), and [unions](/kusto/query/union-operator?view=azure-data-explorer&preserve-view=true). KQL supports [cross-cluster and cross-database queries](/kusto/query/cross-cluster-or-database-queries?view=azure-data-explorer&preserve-view=true), and it's feature rich for parsing formats such as JSON and XML. The language also natively supports advanced analytics.

    Use the web application to run, review, and share queries and results. You can also send queries programmatically (using an SDK) or to a REST API endpoint. If you're familiar with SQL, get started with the [SQL to Kusto cheat sheet](/kusto/query/sql-cheat-sheet?view=azure-data-explorer&preserve-view=true) and [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md).

1. **Visualize results:** Use different visual displays of your data in the native Azure Data Explorer [dashboards](azure-data-explorer-dashboards.md). You can also display your results by using connectors to some of the [leading visualization services](integrate-visualize-overview.md), such as [Power BI](power-bi-data-connector.md?tabs=connector) and [Grafana](grafana.md). Azure Data Explorer also has [ODBC](connect-odbc.md) and JDBC connector support for tools such as [Tableau](tableau.md) and [Sisense](sisense.md).

## Provide feedback

To share feedback about Azure Data Explorer and Kusto Query Language, use the following resources:

* Ask questions:
  * [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-data-explorer)
  * [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Azure-Data-Explorer/bd-p/Kusto)
* [Submit product suggestions on the Azure feedback forum](https://feedback.azure.com/d365community/forum/a952add5-eb24-ec11-b6e6-000d3a4f0da0)

## Related content

* [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
* [Quickstart: Ingest data from an event hub into Azure Data Explorer](create-event-hubs-connection.md)
* [Quickstart: Query data in Azure Data Explorer](web-query-data.md)
* [Find an Azure Data Explorer partner](find-my-partner.md)
