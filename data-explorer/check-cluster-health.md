---
title: Check the health of an Azure Data Explorer cluster
description: This article describes steps to monitor the health of your Azure Data Explorer cluster.
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 09/24/2018
---

# Check the health of an Azure Data Explorer cluster

There are several factors that impact the health of an Azure Data Explorer cluster, including CPU, memory, and the disk subsystem. This article shows some basic steps you can take to gauge the health of a cluster.

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

1. In the left pane, select your cluster, and run the following command.

    ```Kusto
    .show diagnostics
    | project IsHealthy, NotHealthyReason, IsAttentionRequired, AttentionRequiredReason, IsScaleOutRequired
    ```
    
    **Output**

    |Output parameter |Description|
    |---|---|
    |IsHealthy |An output of 1 indicates that the cluster is healthy. An output of 0 indicates that the cluster is unhealthy.|
    |NotHealthyReason |The reason that the cluster is unhealthy. This field is only relevant when the output of *IsHealthy* is 0.|
    |IsAttentionRequired |An output of 1 indicates that the cluster requires attention.|
    |AttentionRequiredReason |The reason that the cluster requires attention. This field is only relevant when the output of *IsAttentionRequired* is 1.|
    |IsScaleOutRequired |An output of 1 indicates it is recommended to [scale out](manage-cluster-horizontal-scaling.md) the cluster.|

1. Sign into the [Azure portal](https://portal.azure.com), and navigate to your cluster.

1. Under **Monitoring**, select **Metrics**, then select **Keep Alive**, as shown in the following image. An output close to 1 means a healthy cluster.

    ![Cluster Keep Alive metric.](media/check-cluster-health/portal-metrics.png)

1. It's possible to add other metrics to the chart. Select the chart then **Add metric**. Select another metric - this example shows **CPU**.

    ![Add metric.](media/check-cluster-health/add-metric.png)
    
1. Review the resource and ingestion metrics listed in [cluster metrics](using-metrics.md#cluster-metrics) and review the recommendations in the metric description column.

1. If you need assistance diagnosing issues with the health of a cluster, please open a support request in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).
