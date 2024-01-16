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

| Name                                                                                                       | Type                                                           | Use cases             |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------- |
| [Apache Spark](integrate-overview.md#apache-spark)                                                         | [Open source](https://github.com/Azure/azure-kusto-spark/)     | Telemetry             |
| [Apache Spark for Azure Synapse Analytics](integrate-overview.md#apache-spark-for-azure-synapse-analytics) | First party                                                    | Telemetry             |
| [Azure Functions](integrate-overview.md#azure-functions)                                                   | First party                                                    | Workflow integrations |
| [JDBC](integrate-overview.md#jdbc)                                                                         |                                                                |                       |
| [Logstash](integrate-overview.md#logstash)                                                                 | [Open source](https://github.com/Azure/logstash-output-kusto/) | Logs                  |
| [Microsoft Power Apps](integrate-overview.md#power-apps)                                                   | First party                                                    | Data orchestration    |
| [ODBC](integrate-overview.md#odbc)                                                                         |                                                                |                       |
| [Power Automate](integrate-overview.md#power-automate)                                                     | First party                                                    | Data orchestration    |

## [Tools and integrations](#tab/integrations)

| Name                                                                                  | Type              | Use cases                                                                                                                                                 |
| ------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Kusto Query Language parser](integrate-overview.md#kql-parser)                       | Open source       | A .NET core repository for the Kusto Query Language parser and semantic tree.                                                                             |
| [Kusto Query Language Monaco editor](integrate-overview.md#monaco-editor-pluginembed) | Open source       | [Kusto Query Language plugin](https://github.com/Azure/monaco-kusto)  [Embed the Azure Data Explorer web UI](./kusto/api/monaco/host-web-ux-in-iframe.md) |
| [Azure Monitor](integrate-overview.md#azure-monitor)                                  | Query integration |                                                                                                                                                           |
| [Azure Data Lake](integrate-overview.md#azure-data-lake)                              | Query integration |                                                                                                                                                           |
| [Azure Synapse Analytics](integrate-overview.md#azure-synapse-analytics)              | Query integration |                                                                                                                                                           |
| [Azure Data Studio](integrate-overview.md#azure-data-studio)                          | Query integration |                                                                                                                                                           |

---

For more information about connectors and tools, see [Data connectors, tools, and integrations overview](integrate-overview.md#detailed-descriptions).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Visualize integrations overview](integrate-visualize-overview.md)
