---
title: Monitoring data reference for Azure Data Explorer
description: This article contains important reference material you need when you monitor Azure Data Explorer by using Azure Monitor.
ms.date: 12/09/2024
ms.custom: horz-monitor
ms.topic: reference
author: shsagir
ms.author: shsagir
ms.service: azure-data-explorer

# Azure Data Explorer monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Data Explorer](monitor-data-explorer.md) for details on the data you can collect for Azure Data Explorer and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Kusto/clusters

The following table lists the metrics available for the Microsoft.Kusto/clusters resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Kusto/clusters](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-kusto-clusters-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- CommandType
- ComponentName
- ComponentType
- ContinuousExportName
- Database
- FailureKind
- IngestionKind
- IngestionResultDetails
- Kind
- MaterializedViewName
- QueryStatus
- Result
- RoleInstance
- SealReason
- State
- Table

## Resource logs

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Kusto/clusters

[!INCLUDE [Microsoft.Kusto/clusters](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-kusto-clusters-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Data Explorer Microsoft.Kusto/Clusters

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [FailedIngestion](/azure/azure-monitor/reference/tables/failedingestion#columns)

  For information about error codes, see [Ingestion error codes](error-codes.md)

- [SucceededIngestion](/azure/azure-monitor/reference/tables/succeededingestion#columns)
- [ADXIngestionBatching](/azure/azure-monitor/reference/tables/adxingestionbatching#columns)

  For information about batching types, see [Batching policy](/kusto/management/batching-policy?view=azure-data-explorer&preserve-view=true#sealing-a-batch)

- [ADXCommand](/azure/azure-monitor/reference/tables/adxcommand#columns)
- [ADXQuery](/azure/azure-monitor/reference/tables/adxquery#columns)
- [ADXTableUsageStatistics](/azure/azure-monitor/reference/tables/adxtableusagestatistics#columns)
- [ADXTableDetails](/azure/azure-monitor/reference/tables/adxtabledetails#columns)
- [ADXJournal](/azure/azure-monitor/reference/tables/adxjournal#columns)

## Activity log

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Analytics resource provider operations](/azure/role-based-access-control/resource-provider-operations#analytics)

## Related content

- See [Monitor Azure Data Explorer](monitor-data-explorer.md) for a description of monitoring [TODO-replace-with-service-name].
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.