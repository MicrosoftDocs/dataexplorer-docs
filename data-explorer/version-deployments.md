---
title: View cluster version deployments
description: Learn how to monitor the version deployments of your Azure Data Explorer cluster.
ms.reviewer: bwatts
ms.topic: how-to
ms.date: 12/19/2023
---

# View cluster version deployments

New versions of Azure Data Explorer are regularly pushed out to your cluster. When a version deployment occurs, a notification is generated in the Azure Activity logs. This article explains how to find and understand these notifications.

Version deployment notifications aren't intended to serve as alerts for upcoming maintenance, as the cluster continues to operate during deployments. Use them for root cause analysis, such as correlating observed cluster behavior with software deployments, or simply to understand deployment duration.

> [!NOTE]
> * Version deployment notifications don't indicate downtime.
> * To check cluster availability, use the **Keep alive** metric under **Monitoring** > **Metrics** in the Azure portal.

## View version deployment

With each Azure Data Explorer software deployment, an Azure Activity log is generated. To see the history of version deployments:

1. In the Azure portal, go to your cluster. From the left menu, select **Activity log**.
1. Find events with an **Operation name** of "Cluster version deployment".

    :::image type="content" source="media/version-deployment-notification/cluster-version-deployment.png" lightbox="media/version-deployment-notification/cluster-version-deployment.png" alt-text="Screenshot of the activity log.":::

1. (Optional) To view details about the deployment, such as start time and duration, select the event. In the **Cluster version deployment** window, select **JSON**.

    :::image type="content" source="media/version-deployment-notification/cluster-version-deployment-json.png" alt-text="Screenshot of the notification event properties.":::

## Send event data to Log Analytics

To further investigate your Activity logs, [send them to an Azure Log Analytics workspace](/azure/azure-monitor/essentials/activity-log?tabs=powershell#send-to-log-analytics-workspace).

The following query shows how to query the version deployment notifications in Azure Log Analytics: 

```kql
AzureActivity
| where OperationName == 'Cluster version deployment'
| project Cluster=Resource, StartTime=todatetime(todynamic(Properties).StartTime), Duration=totimespan(todynamic(Properties).Duration)
```

The results would look something like this:

:::image type="content" source="media/version-deployment-notification/log-analytics-result.png" alt-text="Screenshot of Log Analytics results.":::

## Related content

* Visualize your data in [Azure Data Explorer Dashboards](azure-data-explorer-dashboards.md)
