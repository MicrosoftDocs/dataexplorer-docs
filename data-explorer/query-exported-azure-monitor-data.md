---
title: Query exported data from Azure Monitor in Azure Data Explorer
description: Use Azure Data Explorer to query data that was exported from your Log Analytics workspace to an Azure Storage account.
ms.topic: conceptual
ms.reviewer: osalzberg
ms.date: 06/13/2023
---

# Query exported data from Azure Monitor in Azure Data Explorer

Exporting data from Azure Monitor to an Azure Storage account enables low-cost retention and the ability to reallocate logs to different regions. Use Azure Data Explorer to query data that was exported from your Log Analytics workspaces. After configuration, supported tables that are sent from your workspaces to a storage account will be available as a data source for Azure Data Explorer.

The process flow is to:

1. Export data from the Log Analytics workspace to the storage account.
1. Create an external table in your Azure Data Explorer cluster and mapping for the data types.
1. Query data from Azure Data Explorer.

:::image type="content" source="media/query-exported-monitor-data/exported-data-query.png" alt-text="Diagram that shows Azure Data Explorer exported data querying flow.":::

## Send data to Azure Storage

Azure Monitor logs can be exported to a storage account by using any of the following options:

- Export all data from your Log Analytics workspace to a storage account or event hub. Use the Log Analytics workspace data export feature of Azure Monitor Logs. For more information, see [Log Analytics workspace data export in Azure Monitor](/azure/azure-monitor/logs/logs-data-export).
- Scheduled export from a log query by using a logic app workflow. This method is similar to the data export feature but allows you to send filtered or aggregated data to Azure Storage. This method is subject to [log query limits](/azure/azure-monitor/service-limits#log-analytics-workspaces). For more information, see [Archive data from a Log Analytics workspace to Azure Storage by using Azure Logic Apps](/azure/azure-monitor/logs/logs-export-logic-app).
- One-time export by using a logic app workflow. For more information, see [Azure Monitor Logs connector for Azure Logic Apps](/azure/connectors/connectors-azure-monitor-logs).
- One-time export to a local machine by using a PowerShell script. For more information, see [Invoke-AzOperationalInsightsQueryExport](https://www.powershellgallery.com/packages/Invoke-AzOperationalInsightsQueryExport).

> [!TIP]
> You can use an existing Azure Data Explorer cluster or create a new dedicated cluster with the needed configurations.

## Create an external table in Azure Data Explorer

An [external table](/azure/data-explorer/kusto/query/schema-entities/externaltables) in Azure Data Explorer is a schema entity that refers to data stored outside of your cluster, such as in Azure Blob Storage or Azure Data Lake Store Gen2. Similar to tables, an external table has a defined schema. However, unlike tables, the data is stored and managed externally, separate from your cluster.

To access your exported Azure Monitor data, follow these steps to create an external table:

1. Use the [getschema](/azure/data-explorer/kusto/query/getschemaoperator) operator from Log Analytics to get the schema of the exported table. This information includes the table's columns and their data types.

    :::image type="content" source="media\query-exported-monitor-data\exported-data-map-schema.jpg" alt-text="Screenshot that shows a Log Analytics table schema.":::

1. [Create an external table using the Azure Data Explorer web UI wizard](external-table.md). In the [schema tab](external-table.md#schema-tab), the tool attempts to automatically detect a schema. Make sure that the detected schema matches the schema from the previous step. If there are any discrepancies, adjust the schema by selecting the arrow on a column and accessing the menu.

    :::image type="content" source="media/query-exported-monitor-data/schema-adjustments.png" alt-text="Screenshot of schema adjustment menu." lightbox="media/query-exported-monitor-data/schema-adjustments.png":::

## Query the exported data from Azure Data Explorer

Query the exported data from Azure Data Explorer with the [external_table](/azure/data-explorer/kusto/query/externaltablefunction) function, as shown in the following example:

```kusto
external_table("HBTest","map") | take 10000
```

[![Screenshot that shows the Query Log Analytics exported data.](media/query-exported-monitor-data/external-table-query.png)](media/query-exported-monitor-data/external-table-query.png#lightbox)

## Related content

* [Query data in the Web UI](web-ui-query-overview.md)
