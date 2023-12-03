---
title: Check the version deployments of an Azure Data Explorer cluster
description: Learn how to monitor the version deployments of your Azure Data Explorer cluster.
ms.reviewer: bwatts
ms.topic: how-to
ms.date: 12/03/2023
---

# Check the version deployments of an Azure Data Explorer cluster

Azure Data Explorer regularly releases new versions to your cluster. When a version deployment occurs in Azure Data Explorer, a notification is generated in the Azure Activity logs. This article explains how to find and understand these notifications.

These notifications aren't designed to alert you about upcoming maintenance. Instead, they can serve as a tool for root cause analysis, allowing you to correlate observed cluster behavior with software deployments.

> [!NOTE]
> A version deployment notification doesn't necessarily indicate downtime. Whenever possible, the cluster continues to operate during deployments. To check cluster availability, use the **Keep alive** metric under **Monitoring** > **Metrics** in the Azure portal.

## View version deployment history

An event is generated anytime there is an Azure Data Explorer software deployment. To see the history of version deployments:

1. In the Azure portal, go to your cluster. From the left menu, select **Activity log**.
1. Find events with an **Operation name** of "Cluster version deployment".

    :::image type="content" source="media/version-deployment-notification/activity-log-event.png" lightbox="media/version-deployment-notification/activity-log-event.png" alt-text="Screenshot of the activity log.":::

1. (Optional) To view details about the deployment, such as start time, end time, and duration, select the event. In the **Cluster version deployment** window, select **JSON**.

    :::image type="content" source="media/version-deployment-notification/event-properties.png" lightbox="media/version-deployment-notification/event-properties.png" alt-text="Screenshot of the notification event properties.":::

## Send data to Log Analytics

To further investiage your Activity logs, [send them to an Azure Log Analytics workspace](/azure/azure-monitor/essentials/activity-log?tabs=powershell#send-to-log-analytics-workspace).

The following query shows how to query the version deployment notifications in Azure Log Analytics: 

```
AzureActivity
| where OperationName == 'Cluster version deployment'
| project Cluster=Resource,StartTime=todatetime(todynamic(Properties).StartTime), EndTime=todatetime(todynamic(Properties).EndTime), Duration=totimespan(todynamic(Properties).Duration)
```

The results would look something like this:

:::image type="content" source="media/version-deployment-notification/la-result.png" alt-text="Screenshot of log anayltics results.":::

Set up alerts via Azure Monitor or visualize it using tools such as [Azure Workbooks](https://learn.microsoft.com/azure/azure-monitor/visualize/workbooks-overview), [Azure Data Explorer Dashboards](https://learn.microsoft.com/azure/data-explorer/azure-data-explorer-dashboards), or [Grafana](https://learn.microsoft.com/azure/azure-monitor/visualize/grafana-plugin).

## Conclusion

This notification provides transparency on when and how long software deployment takes. This notification is not an indication of downtime and can not be utilized to determine SLA of the clusters.
