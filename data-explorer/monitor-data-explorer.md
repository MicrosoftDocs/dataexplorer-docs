---
title: Monitor Azure Data Explorer
description: Learn how to monitor Azure Data Explorer using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 12/09/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: shsagir
ms.author: shsagir
ms.service: azure-data-explorer
---

# Monitor Azure Data Explorer

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure Data Explorer metrics supported by Azure Monitor](/azure/data-explorer/monitor-data-explorer-reference#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure Data Explorer resource log data supported by Azure Monitor](/azure/data-explorer/monitor-data-explorer-reference#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

### Monitor Azure Data Explorer performance, health, and usage with metrics

Azure Data Explorer metrics provide key indicators as to the health and performance of the Azure Data Explorer cluster resources. Use the metrics to monitor Azure Data Explorer cluster usage, health, and performance in your specific scenario as standalone metrics. You can also use metrics as the basis for operational [Azure Dashboards](/azure/azure-portal/azure-portal-dashboards) and [Azure Alerts](/azure/azure-monitor/alerts/alerts-types#metric-alerts).

To use metrics to monitor your Azure Data Explorer resources in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the left-hand pane of your Azure Data Explorer cluster, search for *metrics*.
1. Select **Metrics** to open the metrics pane and begin analysis on your cluster.

   :::image type="content" source="media/using-metrics/select-metrics.gif" alt-text="Animation shows search and select metrics in the Azure portal.":::

In the metrics pane, select specific metrics to track, choose how to aggregate your data, and create metric charts to view on your dashboard.

The **Resource** and **Metric Namespace** pickers are preselected for your Azure Data Explorer cluster. The numbers in the following image correspond to the numbered list. They guide you through different options in setting up and viewing your metrics.

  :::image type="content" source="media/using-metrics/metrics-pane.png" alt-text="Screenshot shows different options for viewing metrics.":::

1. To create a metric chart, select **Metric** name and relevant **Aggregation** per metric. For more information about different metrics, see [supported Azure Data Explorer metrics](monitor-data-explorer-reference.md#smetrics).
1. Select **Add metric** to see multiple metrics plotted in the same chart.
1. Select **+ New chart** to see multiple charts in one view.
1. Use the time picker to change the time range (default: past 24 hours).
1. Use [**Add filter** and **Apply splitting**](/azure/azure-monitor/platform/metrics-getting-started#apply-dimension-filters-and-splitting) for metrics that have dimensions.
1. Select **Pin to dashboard** to add your chart configuration to the dashboards so that you can view it again.
1. Set **New alert rule** to visualize your metrics using the set criteria. The new alerting rule includes your target resource, metric, splitting, and filter dimensions from your chart. Modify these settings in the [alert rule creation pane](/azure/azure-monitor/platform/metrics-charts#create-alert-rules).

### Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) provide data about the operation of Azure resources. Azure Data Explorer uses diagnostic logs for insights on ingestion, commands, query, and tables. You can export operation logs to Azure Storage, event hub, or Log Analytics to monitor ingestion, commands, and query status. Logs from Azure Storage and Azure Event Hubs can be routed to a table in your Azure Data Explorer cluster for further analysis.

> [!IMPORTANT]
> Diagnostic log data may contain sensitive data. Restrict permissions of the logs destination according to your monitoring needs.

[!INCLUDE [azure-monitor-vs-log-analytics](includes/azure-monitor-vs-log-analytics.md)]

Diagnostic logs can be used to configure the collection of the following log data:

### [Ingestion](#tab/ingestion)

> [!NOTE]
>
> - Ingestion logs are supported for queued ingestion to the **Data ingestion URI** using [Kusto client libraries](/kusto/api/client-libraries?view=azure-data-explorer&preserve-view=true) and [data connectors](integrate-data-overview.md).
> - Ingestion logs aren't supported for streaming ingestion, direct ingestion to the **Cluster URI**, ingestion from query, or `.set-or-append` commands.

> [!NOTE]
>
> Failed ingestion logs are only reported for the final state of an ingest operation, unlike the [Ingestion result](using-metrics.md#ingestion-metrics) metric, which is emitted for transient failures that are retried internally.

- **Successful ingestion operations**: These logs have information about successfully completed ingestion operations.
- **Failed ingestion operations**: These logs have detailed information about failed ingestion operations including error details.
- **Ingestion batching operations**: These logs have detailed statistics of batches ready for ingestion (duration, batch size, blobs count, and [batching types](/kusto/management/batching-policy?view=azure-data-explorer&preserve-view=true#sealing-a-batch)).

### [Commands and Queries](#tab/commands-and-queries)

- **Commands**: These logs have information about admin commands that have reached a final state.
- **Queries**: These logs have detailed information about queries that have reached a final state.

  > [!NOTE]
  > The command and query log data contains the query text.

### [Tables](#tab/tables)

- **TableUsageStatistics**: These logs have detailed information about the tables whose extents were scanned during query execution. This log doesn't record statistics for queries that are part of commands, such as the [.set-or-append](/kusto/management/data-ingestion/ingest-from-query?view=azure-data-explorer&preserve-view=true) command.

  > [!NOTE]
  > The `TableUsageStatistics` log data doesn't contain the command or query text.

- **TableDetails**: These logs have detailed information about the cluster's tables.

### [Journal](#tab/journal)

- **Journal**: These logs have detailed information about metadata operations.

---

You can choose to send the log data to a Log Analytics workspace, a storage account, or stream it to an event hub.

Diagnostic logs are disabled by default. Use the following steps to enable diagnostic logs for your cluster:

1. In the [Azure portal](https://portal.azure.com), select the cluster resource that you want to monitor.
1. Under **Monitoring**, select **Diagnostic settings**.

   :::image type="content" source="media/using-diagnostic-logs/add-diagnostic-logs.png" alt-text="Screenshot shows the Diagnostic settings page where you can add a setting.":::

1. Select **Add diagnostic setting**.
1. In the **Diagnostic settings** window:

   :::image type="content" source="media/using-diagnostic-logs/configure-diagnostics-settings.png" alt-text="Screenshot of the Diagnostic settings screen, on which you configure which monitoring data to collect for your Azure Data Explorer cluster.":::

   1. Enter a **Diagnostic setting name**.
   1. Select one or more destination targets: a Log Analytics workspace, a storage account, or an event hub.
   1. Select logs to be collected: **Succeeded ingestion**, **Failed ingestion**, **Ingestion batching**, **Command**, **Query**, **Table usage statistics**, **Table details**, or **Journal**.
   1. Select [metrics](using-metrics.md#supported-azure-data-explorer-metrics) to be collected (optional).
   1. Select **Save** to save the new diagnostic logs settings and metrics.

Once the settings are ready, logs start to appear in the configured destination targets: a storage account, an event hub, or Log Analytics workspace.

> [!NOTE]
> If you send logs to a Log Analytics workspace, the `SucceededIngestion`, `FailedIngestion`, `IngestionBatching`, `Command`, `Query`, `TableUsageStatistics`, `TableDetails`, and `Journal` logs are stored in Log Analytics tables named: `SucceededIngestion`, `FailedIngestion`, `ADXIngestionBatching`, `ADXCommand`, `ADXQuery`, `ADXTableUsageStatistics`, `ADXTableDetails`, and `ADXJournal` respectively.

## Built in monitoring for Azure Data Explorer

<!-- Add any monitoring mechanisms build in to your service here. -->

<!--## Use Azure Monitor tools to analyze the data-->
[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- [Azure Data Explorer monitoring data reference](monitor-data-explorer-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
