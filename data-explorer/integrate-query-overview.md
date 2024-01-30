---
title: Overview of query integrations
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
      > [Visualize integrations](integrate-visualize-overview.md)
   :::column-end:::
:::row-end:::

The following tables summarize the available query connectors, tools, and integrations.

## [Connectors](#tab/connectors)

| Name | Data processing | Roles | Use cases |
|--|--|--|--|
| [Apache Spark](integrate-overview.md#apache-spark) |  |  |  |
| [Apache Spark for Azure Synapse Analytics](integrate-overview.md#apache-spark-for-azure-synapse-analytics) |  |  |  |
| [Azure Functions](integrate-overview.md#azure-functions) |  |  |  |
| [JDBC](integrate-overview.md#jdbc) |  |  | Java-based app |
| [Logic Apps](integrate-overview.md#logic-apps) |  |  | No code experience |
| [Logstash](integrate-overview.md#logstash) |  |  |  |
| [Matlab](integrate-overview.md#matlab) |  |  |  |
| [Microsoft Power Apps](integrate-overview.md#power-apps) |  |  |  |
| [ODBC](integrate-overview.md#odbc) |  |  |  |
| [Power Automate](integrate-overview.md#power-automate) |  |  |  |

## [Tools and integrations](#tab/integrations)

| Name                                                                                                                                            | Functionality                 | Roles                                       | Use Cases                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Azure Monitor](/azure/data-explorer/integrate-overview.md&tabs=integrations#azure-monitor)                                                     | Query and Export              | Data Engineer                               | Low cost data retention                                                                            |
| [Azure Data Lake](/azure/data-explorer/integrate-overview.md&tabs=integrations#azure-data-lake)                                                 | Query                         | Data Engineer, Data Analyst                 | Fast access to data stored in external storage                                                     |
| [Azure Data Studio](/azure/data-explorer/integrate-overview.md&tabs=integrations#azure-data-studio)                                             | Query, Author Notebooks       | Data Engineer, Data Analyst, Data Scientist |                                                                                                    |
| [Jupyter Notebooks](/azure/data-explorer/integrate-overview.md&tabs=integrations#jupyter-notebooks)                                             | Author Notebooks              | Data Engineer, Data Scientist               | Quickly observe trends and anomalies against massive amounts of data stored in Azure Data Explorer |
| [Kusto.Explorer](/azure/data-explorer/integrate-overview.md&tabs=integrations#kustoexplorer)                                                    | Query, Admin and Dashboarding | Data Engineer, Data Analyst, Data Scientist | End-to-end data exploration                                                                        |
| [Kusto CLI](/azure/data-explorer/integrate-overview.md&tabs=integrations#kusto-cli)                                                             | Query and Admin               | Application Developer, Data Engineer        | Parse queries, perform semantic analysis, check for errors, and optimize your queries.             |
| [Kusto Query Language parser](/azure/data-explorer/integrate-overview.md&tabs=integrations#kql-parser)                                          | Query and Schema Exploration  | Application Developer                       | Integrate Monaco Editor in your application.                                                       |
| [Kusto Query Language Monaco editor](/azure/data-explorer/integrate-overview.md&tabs=integrations#monaco-editor-pluginembed)                    | Query, Admin and Dashboarding | Data Engineer, Data Analyst, Data Scientist | End-to-end data exploration                                                                        |
| [Real-Time Analytics in Microsoft Fabric](/azure/data-explorer/integrate-overview.md&tabs=integrations#real-time-analytics-in-microsoft-fabric) | Query, Admin and Dashboarding | Data Engineer, Data Analyst, Data Scientist | End-to-end data exploration                                                                        |
| [Web UI](/azure/data-explorer/integrate-overview.md&tabs=integrations#web-ui)                                                                   | Query                         | Data Analyst, Data Scientist                | Analyze data, develop algorithms and create models.                                                |

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](integrate-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
