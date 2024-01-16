---
title: Overview of query integrations
description: Learn about the available query integrations.
ms.reviewer: aksdi
ms.topic: conceptual
ms.date: 01/16/2024
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

| Name                                                                                                               | Type                                                           | Use cases             |
| -------------------------------------------------------------------------------------------------------------------| -------------------------------------------------------------- | --------------------- |
| [Apache Spark](integrate-overview.md#apache-spark)                                                        | [Open source](https://github.com/Azure/azure-kusto-spark/)     | Telemetry             |
| [Apache Spark for Azure Synapse Analytics](integrate-overview.md#apache-spark-for-azure-synapse-analytics)| First party                                                    | Telemetry             |
| [Azure Functions](integrate-overview.md#azure-functions)                                                  | First party                                                    | Workflow integrations |
| [Logstash](integrate-overview.md#logstash)                                                                | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs                  |
| [Power Automate](integrate-overview.md#power-automate)                                                    | First party                                                    | Data orchestration    |

## [Tools and integrations](#tab/integrations)

| Name                                                                                                                                                       | Type              | Use cases                                                                                            |
| -------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| [Kusto Query Language parser](https://github.com/microsoft/Kusto-Query-Language)                   | Open source       | A .NET core repository for the Kusto Query Language parser and semantic tree.                                                                             |
| [Kusto Query Language Monaco editor](./kusto/api/monaco/monaco-kusto.md)                           | Open source       | [Kusto Query Language plugin](https://github.com/Azure/monaco-kusto)  [Embed the Azure Data Explorer web UI](./kusto/api/monaco/host-web-ux-in-iframe.md) |
| [Azure Monitor](query-monitor-data.md)                                                             | Query integration |                                                                                                   |
| [Azure Data Lake](data-lake-query-data.md)                                                         | Query integration |                                                                                                   |
| [Azure Synapse Apache Spark](/azure/synapse-analytics/quickstart-connect-azure-data-explorer?coxt) | Query integration |                                                                                                   |
| [Apache Spark](spark-connector.md)                                                                 | Query integration |                                                                                                   |
| [Microsoft Power Apps](power-apps-connector.md)                                                    | Query integration |                                                                                                   |
| [Azure Data Studio](/sql/azure-data-studio/extensions/kusto-extension?context=%252fazure%252fda    | Query integration |                                                                                                   |

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](integrate-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
