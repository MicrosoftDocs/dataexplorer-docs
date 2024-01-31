---
title: Query integrations overview
description: Learn about the available query integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 01/30/2024

# CustomerIntent: As a data ingestor, I want to know what query connectors and tools are available, so that I can choose the right one for my use case.
---
# Query integrations overview

Kusto Query Language (KQL) is a powerful tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and more. Use KQL to explore your data in different environments, and in other Microsoft services.

Use the following filters to see other connectors, tools, and integrations that are available for your use case.

:::row:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Overview](integrate-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Data integrations](integrate-data-overview.md)
   :::column-end:::
   :::column span="":::
      > [!div class="nextstepaction"]
      > [Visualization integrations](integrate-visualize-overview.md)
   :::column-end:::
:::row-end:::

The following tables summarize the available query connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name                                                                                                       | Functionality         | Roles                                | Use cases                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Apache Spark](integrate-overview.md#apache-spark)                                                         | Query, Ingest, and Export | Data Analyst, Data Scientist         | Machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics scenarios using any Spark cluster                            |
| [Apache Spark for Azure Synapse Analytics](integrate-overview.md#apache-spark-for-azure-synapse-analytics) | Query, Ingest, and Export | Data Analyst, Data Scientist         | Machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics scenarios using Synapse Analytics Spark cluster              |
| [Azure Functions](integrate-overview.md#azure-functions)                                                   | Query, Ingest, and Orchestrate   | Data Engineer, Application Developer | Integrate Azure Data Explorer into your serverless workflows to ingest data and run queries against your cluster                    |
| [JDBC](integrate-overview.md#jdbc)                                                                         | Query                   | Application Developer                | Use JDBC to connect to Azure Data Explorer databases and execute queries                                                            |
| [Logic Apps](integrate-overview.md#logic-apps)                                                             | Query and Orchestrate   | Low Code Application Developer       | Run queries and commands automatically as part of a scheduled or triggered task.                                                    |
| [Matlab](integrate-overview.md#matlab)                                                                     | Query                   | Data Analyst, Data Scientist         | Analyse data, develop algorithms and create models.                                                                                 |
| [ODBC](integrate-overview.md#odbc)                                                                         | Query                   | Application Developer                | Establish a connection to Azure Data Explorer from any application that is equipped with support for the ODBC driver for SQL Serve. |
| [Power Apps](integrate-overview.md#power-apps)                                                             | Query and Orchestrate   | Low Code Application Developer       | Build a low code, highly functional app to make use of data stored in Azure Data Explorer                                           |
| [Power Automate](integrate-overview.md#power-automate)                                                     | Query and Orchestrate   | Low Code Application Developer       | Orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task                            |

## [Tools and integrations](#tab/integrations)

| Name                                                                                                                                            | Functionality                 | Roles                                       | Use Cases                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Azure Data Lake](integrate-overview.md#azure-data-lake)                                                 | Query                         | Data Engineer, Data Analyst                 | Fast access to data stored in external storage                                                                                                                                          |
| [Azure Data Studio](integrate-overview.md#azure-data-studio)                                             | Query, Author Notebooks       | Data Engineer, Data Analyst, Data Scientist | Quickly observe trends and anomalies against massive amounts of data stored in Azure Data Explorer                                                                             |
| [Azure Monitor](integrate-overview.md#azure-monitor)                                                     | Query and Export              | Data Engineer                               | Low cost data retention                                                                                                                                                        |
| [Jupyter Notebooks](integrate-overview.md#jupyter-notebooks)                                             | Author Notebooks              | Data Engineer, Data Scientist               | Create and share documents containing live code, equations, visualizations for statistical modeling, data visualization, and machine learning using data stored in Azure Data Explorer. |
| [Kusto.Explorer](/azure/data-explorer/integrate-overview?tabs=integrations#kustoexplorer)                                                    | Query, Ingest, Admin and Dashboarding | Data Engineer, Data Analyst, Data Scientist | End-to-end data exploration                                                                                                                                                             |
| [Kusto CLI](integrate-overview.md#kusto-cli)                                                             | Query and Admin               | Aplication Admin, System Administrator       |     Send queries and control commands to an Azure Data Explorer cluster using command line utility                                                                                      |
| [Kusto Query Language parser](integrate-overview.md#kql-parser)                                          | Query and Schema Exploration  | Application Developer                       | Parse queries, perform semantic analysis, check for errors, and optimize your queries.                                                                                                  |
| [Kusto Query Language Monaco editor](integrate-overview.md#monaco-editor-pluginembed)                    | Query, Admin, and Dashboarding | Application Developer, Data Engineer | Integrate Monaco Editor in your application                                                                                                                                             |
| [Real-Time Analytics in Microsoft Fabric](integrate-overview.md#real-time-analytics-in-microsoft-fabric) | Query, Ingest, Admin, and Dashboarding | Data Engineer, Data Analyst, Data Scientist | End-to-end data exploration                                                                                                                                                             |
| [Web UI](integrate-overview.md#web-ui)                                                                   | Query, Ingest, Admin, and Dashboarding                         | Data Engineer, Data Analyst, Data Scientist                | End-to-end data exploration                                                                                                                                                             |

---

For more information about connectors and tools, see [Integrations overview](integrate-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
