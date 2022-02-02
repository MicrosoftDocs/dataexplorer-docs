---
title: 'Manage cluster horizontal scaling (scale out) to match demand in Azure Data Explorer'
description: This article describes steps to scale out and scale in an Azure Data Explorer cluster based on changing demand.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 12/09/2019
---

# Manage cluster horizontal scaling (scale out) in Azure Data Explorer to accommodate changing demand

Sizing a cluster appropriately is critical to the performance of Azure Data Explorer. A static cluster size can lead to under-utilization or over-utilization, neither of which is ideal. Because demand on a cluster can’t be predicted with absolute accuracy, it's better to *scale* a cluster, adding and removing capacity and CPU resources with changing demand. 

There are two workflows for scaling an Azure Data Explorer cluster: 
* Horizontal scaling, also called scaling in and out.
* [Vertical scaling](manage-cluster-vertical-scaling.md), also called scaling up and down.
This article explains the horizontal scaling workflow.

## Configure horizontal scaling

By using horizontal scaling, you can scale the instance count automatically, based on predefined rules and schedules. To specify the autoscale settings for your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under **Settings**, select **Scale out**. 

2. In the **Scale out** window, select the autoscale method that you want: **Manual scale**, **Optimized autoscale**, or **Custom autoscale**.

### Manual scale

Manual scale is the default setting during cluster creation. The cluster has a static capacity that doesn't change automatically. You select the static capacity by using the **Instance count** bar. The cluster's scaling remains at that setting until you make another change.

   ![Manual scale method.](media/manage-cluster-horizontal-scaling/manual-scale-method.png)

### Optimized autoscale

Optimized autoscale is the recommended scaling method. This method optimizes cluster performance and cost. If the cluster  underutilized, it will be scaled in. This action lowers cost without affecting the required performance. If the cluster is over-utilized, it will be scaled out to maintain optimal performance. To configure optimized autoscale:

1. Select **Optimized autoscale**. 

1. Specify a minimum instance count and a maximum instance count. The cluster autoscaling ranges between these values based on load.

1. Select **Save**.

   ![Optimized autoscale method.](media/manage-cluster-horizontal-scaling/optimized-autoscale-method.png)

Optimized autoscale starts working. Its actions can be viewed in the cluster’s activity log in Azure.

#### Logic of optimized autoscale 

Optimized autoscale is managed either by reactive or predictive logic.
The predictive logic tracks the usage pattern of the cluster and when it shows seasonality with high confidence level, the predictive flow will take over the cluster scaling.
The reactive logic is tracking the actual usage of the cluster and makes decisions on cluster scale operations according to the current level of resource usage.
The main metrics for both the predictive and reactive flows are:
* CPU
* Cache utilization factor
* Ingestion utilization
Both predictive and reactive autoscale are bound to the cluster size boundaries (min and max number of instances) as defined in the Optimized auto scale configuration.
Frequent cluster scale out and scale in are undesirable since the operations also take a toll on cluster resources and require time for adding or removing instances and rebalancing the hot cache across all nodes.

##### Predictive autoscale
The predictive logic forecasts the clusters usage for the next day based on the cluster's usage pattern over the last few weeks. Based on this forecast, it creates a schedule of scale in/out operations to adjust the cluster size ahead of time, so the scaling will be ready just as the load changes. This logic is effective especially for seasonal patterns, e.g., daily or weekly ingestion spikes, etc. However, in case there is a unique spike in usage that exceeds the forecast, the optimize autoscale will fall back to the reactive logic. In that mode the scale in/out operations are done in ad-hoc manner, based on the latest level of resource usage. 

##### Reactive autoscale
**Scale out**
When the cluster approaches a state of over-utilization, scale out will take place to maintain optimal performance. Scale out will occur when at least one of the following occurs:
* The cache utilization is high for over an hour.
* The CPU is high for over an hour.
* The ingestion utilization is high for over an hour.


**Scale in**

When the cluster is underutilized, scale -in will take place to lower costs while maintaining optimal performance. Multiple metrics are used to verify that it's safe to scale in the cluster. The following rules are evaluated before scale -in is performed:
* To ensure that there's no overloading of resources, the following metrics are evaluated before scale in is performed: 
    * Cache utilization isn't high
    * CPU is below average  
    * Ingestion utilization is below average 
    * Streaming ingest utilization (if streaming ingest is used) isn't high
    * Keep alive metric is above a defined minimum, processed properly, and on time (which means the cluster is responsive).
    * There is no query throttling 
    * Number of failed queries are below a defined minimum.

> [!NOTE]
> The scale in logic currently requires a 1-day evaluation before implementation of optimized scale in. This evaluation takes place once every hour. If an immediate change is needed, use [manual scale](#manual-scale).

### Custom autoscale

By using custom autoscale, you can scale your cluster dynamically based on metrics that you specify. The following graphic shows the flow and steps to configure custom autoscale. More details follow the graphic.

1. In the **Autoscale setting name** box, enter a name, such as *Scale-out: cache utilization*. 

   ![Scale rule.](media/manage-cluster-horizontal-scaling/custom-autoscale-method.png)

2. For **Scale mode**, select **Scale based on a metric**. This mode provides dynamic scaling. You can also select **Scale to a specific instance count**.

3. Select **+ Add a rule**.

4. In the **Scale rule** section on the right, enter values for each setting.

    **Criteria**

    | Setting | Description and value |
    | --- | --- |
    | **Time aggregation** | Select an aggregation criteria, such as **Average**. |
    | **Metric name** | Select the metric you want the scale operation to be based on, such as **Cache Utilization**. |
    | **Time grain statistic** | Choose between **Average**, **Minimum**, **Maximum**, and **Sum**. |
    | **Operator** | Choose the appropriate option, such as **Greater than or equal to**. |
    | **Threshold** | Choose an appropriate value. For example, for cache utilization, 80 percent is a good starting point. |
    | **Duration (in minutes)** | Choose an appropriate amount of time for the system to look back when calculating metrics. Start with the default of 10 minutes. |
    |  |  |

    **Action**

    | Setting | Description and value |
    | --- | --- |
    | **Operation** | Choose the appropriate option to scale in or scale out. |
    | **Instance count** | Choose the number of nodes or instances you want to add or remove when a metric condition is met. |
    | **Cool down (minutes)** | Choose an appropriate time interval to wait between scale operations. Start with the default of five minutes. |
    |  |  |

5. Select **Add**.

6. In the **Instance limits** section on the left, enter values for each setting.

    | Setting | Description and value |
    | --- | --- |
    | **Minimum** | The number of instances that your cluster won't scale below, regardless of utilization. |
    | **Maximum** | The number of instances that your cluster won't scale above, regardless of utilization. |
    | **Default** | The default number of instances. This setting is used if there are problems with reading the resource metrics. |
    |  |  |

7. Select **Save**.

You've now configured horizontal scaling for your Azure Data Explorer cluster. Add another rule for vertical scaling. If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Next steps

* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
* [Manage cluster vertical scaling](manage-cluster-vertical-scaling.md) for appropriate sizing of a cluster.
