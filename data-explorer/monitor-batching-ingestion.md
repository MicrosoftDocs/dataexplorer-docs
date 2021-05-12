---
title: Monitor batching ingestion in Azure Data Explorer
description: Learn how to use Azure Data Explorer metrics to monitor batching ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 04/23/2021
ms.custom: contperf-fy21q1
---

# Batching Ingestion Monitoring

Batching ingestion is the most performant [method](ingest-data-overview#batching-vs-streaming-ingestion) for ingesting data used by Azure Data Explorer (ADX).

In batching ingestion, ADX optimizes data ingestion for high throughput by batching the incoming data into small chunks based on a configurable [ingestion batching policy](kusto/management/batchingpolicy.md) that is defined on the database or table from which the data is ingested. The small batches of incoming data are then merged and optimized for fast query results.

By monitoring the batching ingestion, you can get information about the *[ingestion result], the *[amount of ingested data], the *[latency of the ingestion], and the *[batching process] itself.

ADX uses Azure monitor to monitor ingestion metrics in Azure portal.

What does the information do for you?
understand what they mean and 
see how to use them to get valuable insights.

Batching ingestion occurs in stages, and each stage is governed by a *component*:

When analyzing the amount of data passing through ingestion and ingestion latency, it is possible to split metrics by **Component Type** to better understand the performance of each of the batching ingestion stages.

1. Prior to ingestion, as the data is retrieved from Event Grid, Event Hub, or IoT Hub, the *Data Connection* component performs initial data rearrangement.
2. The *Batching Manager* optimizes the ingestion throughput by batching the small ingress data chunks that it receives based on the ingestion batching policy.
3. The *Ingestion Manager* starts the data ingestion by sending the ingestion command to the *ADX Storage Engine*.
4. The *ADX Storage Engine* stores the ingested data, making it available for query.



In this tutorial you will learn how to use [ingestion metrics](using-metrics#ingestion-metrics) to monitor [Batching ingestion to ADX](ingest-data-overview) in Azure portal.



By monitoring the batching ingestion, you can get information about the ingestion result, the amount of ingested data, the latency of the ingestion, and the batching process itself.

After reading this tutorial you will know how to answer the following questions:

1. How can I see the result of my ingestion attempts? *(link to the “ingestion result” section)*

2. How much data passes through the ingestion pipeline? *(link to “the amount of ingested data” section)*

3. What is the latency of the ingestion process and does long latency happen in ADX or before data actually arrives in ADX for ingestion? *(link to the “ingestion latency” section)*

4. How can I better understand the batching process of my cluster during ingestion? (*link to “understanding batching policy” section)*

5. When working with Event Hub, Event Grid and IoT Hub ingestion, how can I compare the number of events arrived to ADX to the number of events sent for ingestion *(link to “Compare data connection incoming events to the number of events sent for ingestion” section*)?

When analyzing the amount of data passing through ingestion and ingestion latency, it is possible to split metrics by **Component Type** to better understand the performance of each of the batching ingestion steps.



*(include the text from* [*Use metrics to monitor your Azure Data Explorer resources*](using-metrics#use-metrics-to-monitor-your-azure-data-explorer-resources) *and* [*Work in the metrics pane*](using-metrics#work-in-the-metrics-pane) *which explains how to arrive on the metric pane and work with it in general)*

## Prerequisites

* An Azure subscription. If you don't have one, you can create a [free Azure account](https://azure.microsoft.com/free/).
* A [cluster and database](create-cluster-database-portal.md).

## Use metrics to monitor your Azure Data Explorer resources

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Monitor** from the left-hand navigation bar and select **Metrics** to open the metrics pane. 

   :::image type="content" source="media/monitor-batching-ingestion/monitor-metrics-blade.png" alt-text="Search and select metrics in the Azure portal":::

## Work in the metrics pane

To begin analysis on your cluster in the metrics pane, select specific metrics to track, choose how to aggregate your data, and create metric charts to view on your dashboard.

The **Resource** and **Metric Namespace** pickers are pre-selected for your Azure Data Explorer cluster. 

The numbers in the following image correspond to the numbered list below. They guide you through different options in setting up and viewing your metrics.

1. To create a metric chart, select **Metric** name and relevant **Aggregation** per metric. For more information about different metrics, see [supported Azure Data Explorer metrics](#supported-azure-data-explorer-metrics).
1. Select **Add metric** to see multiple metrics plotted in the same chart.
1. Select **+ New chart** to see multiple charts in one view.
1. Use the time picker to change the time range (default: past 24 hours).
1. Use [**Add filter** and **Apply splitting**](/azure/azure-monitor/platform/metrics-getting-started#apply-dimension-filters-and-splitting) for metrics that have dimensions.
1. Select **Pin to dashboard** to add your chart configuration to the dashboards so that you can view it again.
1. Set **New alert rule** to visualize your metrics using the set criteria. The new alerting rule will include your target resource, metric, splitting, and filter dimensions from your chart. Modify these settings in the [alert rule creation pane](/azure/azure-monitor/platform/metrics-charts#create-alert-rules).

![Metrics pane](media/using-metrics/metrics-pane.png)


In this tutorial, we are analyzing data from the last 48 hours:

1. In the upper right corner above the chart, click on the time selector (*0-time selector.png*):

2. Select the desired timespan for metrics analyzing (in this example – last 48 hours), then select **Apply** *(0.1- time selector.png)*:

## Ingestion Result

The **ingestion result** metric gives information about the total number of sources that either failed or succeeded to be ingested. Splitting the metric by status, you can get detailed information about the status of the ingestion operations.

**Note**:

* Using Event Hub ingestion there is an event pre-aggregation in the data connection component *(link to component section)*. Then, events are treated as a single source to be ingested. Therefore, a few events appear as a single ingestion result after pre-aggregation.
* Transient failures are retried internally to a limited number of attempts. Each transient failure is reported as a transient ingestion result. Therefore, a single ingestion may result with more than one ingestion result.

 
1. In the metrics pane select the following settings (*1- Select ingestion Result metric.png*):
 

| Settings         | Suggested Value                  | Field Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Cluster Name>*            | The name of the ADX cluster                                  |
| Metric Namespace | *Kusto Cluster Standard Metrics* | A namespace that acts like a category for the metric         |
| Metric           | *Ingestion result*               | The metric name                                              |
| Aggregation      | *Sum*                            | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

 

You can now see the number of ingestion sources (that either failed or succeeded to be ingested) over time (*2- ingestion result graph.png*):

2. Select **Apply splitting** above the chart *(3- apply splitting.png):*
3. Choose the **Status** dimension to segment your chart by the status of the ingestion operations (*4- split by status.png*):
4. After selecting the splitting values, click away from the split selector to close it. Now the chart shows how many ingestion sources were tried to be ingested over time, and the status of the ingestions. There are multiple lines, one for each possible ingestion result (*5- ingestion result by status graph.png*).
5. In the chart above, you can see 3 lines: blue for successful ingestion operations, orange for ingestion operations that failed due to “Entity not found” and purple for ingestion operations that failed due to "Bad request”. You can see that most ingestion operations were succeeded.
6. The error in the chart represents the category of the error code. To see the full list of ingestion error codes by categories and try to better understand the possible error reason see [Ingestion error codes in Azure Data Explorer](error-codes).
7. To get more details on an ingestion error, you can set [failed ingestion diagnostic logs.](using-diagnostic-logs?tabs=ingestion#failed-ingestion-operation-log) (take into account that logs emission results with creation of additional resources, and therefore costs money).

**The Amount of Ingested Data:**

The **Blobs Processed**, **Blobs Received** and **Blobs Dropped** metrics give information about the number of blobs that are processed by ingestion components *(link to the beginning of the doc that explains ingestion components)*.

1. In the metrics pane select the following settings (*6- select blobs processed.png*):

| Settings         | Suggested Value                  | Field Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Cluster Name>*            | The name of the ADX cluster                                  |
| Metric Namespace | *Kusto Cluster Standard Metrics* | A namespace that acts like a category for the metric         |
| Metric           | *Blobs Processed*                | The metric name                                              |
| Aggregation      | *Sum*                            | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

2. Select **Apply splitting** above the chart *(3- apply splitting.png)*:
3. Select the **Component Type** dimension to segment the chart by different components through ingestion (*7- split by component type.png)*:
4. If you want to focus on a specific database of your cluster, select **Add filter** above the chart (*8- add filter.png*):
5. Select which database values you want to include when plotting the chart (this example shows filtering out blobs sent to the *GitHub* database) (*9- filter by database.png*):
6. After selecting the filter values, click away from the Filter Selector to close it. Now the chart shows how many blobs that are sent to the *GitHub* database were processed at each of the ingestion components over time (*10- blobs processed by type in DB.png*):
7. In the chart above you can see that at 13 Feb there is a decrease in the number of blobs that were ingested to the *GitHub* database over time. You can also see that the number of blobs that were processed at each of the components is similar, meaning that approximately all data processed in the data connection was also processed successfully by the batching manager, by the ingestion manager and by the storage engine. Therefore, this data is ready for query.
8. To better understand the relation between the number of blobs that were received at each component and the number of blobs that were processed successfully at each component, you can add a new chart to describe the number of blobs that were sent to *GitHub* database and were received at each component. 

Above the Blob processed chart, select **New chart (***11- new chart.png***):**

9. Select the following settings for the new chart (*12- select blob received.png*):
10.  Return steps 2-5 to split the **Blob Received** metric by component type and filter only blob sent to *GitHub* database. You can now see the following charts next to each other (*13- blobs received and processed by type.png*):
11. Comparing the charts, you can see that the number of blobs that were received on each component is like the number of blobs that were processed. That is means that approximately there are not blobs that were dropped during ingestion.
12. You can also analyze the **Blob Dropped** metric following steps 2-5 above to see how many blobs were dropped during ingestion and detect whether there is problem in processing at specific component during ingestion. For each dropped blob you will also get an **Ingestion Result** metric with more information about the failure reason (*link to the ingestion result section*).

 **Ingestion Latency:**

**Note**: According to the default [batching policy](kusto/management/batchingpolicy), the default batching time is 5 minutes. Therefore, the expected latency is at least 5 minutes using the default batching policy.

While ingesting data to ADX, it is important to understand the ingestion latency to know how much time passes until data is ready for query. The metrics **Stage Latency** and **Discovery Latency** aimed to monitor ingestion latency.

The **Stage Latency** indicates the timespan from when a message is discovered by Azure Data Explorer, until its content is received by an ingestion component *(link to the section that explains ingestion components)* for processing.

The **Discovery Latency** is used for ingestion pipelines with data connections (Event Hub, IoT Hub and Event Grid). This metric gives information about the timespan from data enqueue until discovery by ADX data connections. This timespan is upstream to Azure Data Explorer, and therefore it is not included in the **Stage Latency** that measures only latency in ADX.

When you see a long latency until data is ready for query, analyzing **Stage Latency** and **Discovery Latency** can help you to understand whether the long latency is because long latency in ADX, or upstream to ADX. You can also detect the specific component responsible for the long latency.

1. In the metrics pane select the following settings (*14- select stage latency.png*):


| Settings         | Suggested Value                  | Field Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Cluster Name>*            | The name of the ADX cluster                                  |
| Metric Namespace | *Kusto Cluster Standard Metrics* | A namespace that acts like a category for the metric         |
| Metric           | *Stage Latency*                  | The metric name                                              |
| Aggregation      | *Avg*                            | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

2. Select **Apply splitting** above the chart (*3-apply spilitting.png*):
3. Select the **Component Type** dimension to segment the chart by different components through ingestion (*7- split by component type.png*): 
4. If you want to focus on a specific database of your cluster, select **Add filter** above the chart (*8- add filter.png*):

Select which database values you want to include when plotting the chart (this example shows filtering out blobs sent to the *GitHub* database) (*9- filter by database.png*):

5. After selecting the filter values, click away from the Filter Selector to close it. Now the chart shows the latency of ingestion operations that are sent to the GitHub database at each of the components through ingestion over time (*15- stage latency by component type in DB.png*):
6. In the chart above, you can see that the latency at the data connection is approximately 0 seconds. It makes sense since the **Stage Latency** measures only latency from when a message is discovered by ADX.

You can also see that the longest time passes from when the Batching Manager received data to then the Ingestion Manager received data. In the chart above it takes around 5 minutes as we use default [Batching Policy](kusto/management/batchingpolicy) for the *GitHub* database and [**the default time for**](kusto/management/batching-policy#altering-the-ingestionbatching-policy) **batching policy is 5 minutes**, that means that apparently the sole reason for the batching was time. You can see this conclusion in detail in the section about Understanding Batching Process *(link to this section)*.

Finally, looking at the Storage engine latency in the chart, represents the latency when receiving data by the Storage Engine, you can see the average total latency from the time of discovery data by ADX until it ready for query. In the graph above it is take 5.2 minutes in average.

7. If you use ingestion with data connections, you may want to estimate the latency upstream to ADX over time as long latency may also be because of long latency before ADX actually gets the data for ingestion. For that purpose, you can use the **Discovery Latency** metric.
8. Above the chart you have already created, select **New chart**:
9. Select the following settings to see the average **Discovery Latency** over time:
10. Return steps 2-3 above to split the **Discovery Latency** by **Component Type**.
11. After selecting the splitting values, click away from the split selector to close it. Now you have charts for **Discovery Latency (***16- discovery latency graph.png***):**
12. You can see that almost all the time, the discovery Latency is 0 seconds means that ADX gets data immediately after data enqueue. The highest peak of around 300 milliseconds is around 13 Feb 14:00 AM means that at this time ADX cluster got the data around 300 milliseconds after data enqueue.

**Understand the Batching Process:**

The **Batch blob count**, **Batch duration**, **Batch size** and **Batches processed** metrics aimed to give information about the batching process (*link to the intro of this doc*):

* **Batch blob count:** Number of blobs in a completed batch for ingestion.
* **Batch duration:** The duration of the batching phase in the ingestion flow.
* **Batch size:** Uncompressed expected data size in an aggregated batch for ingestion.
* **Batches processed:** Number of batches completed for ingestion.

1. In the metrics pane select the following settings (*17- select batches processed.png*):

| Settings         | Suggested Value                  | Field Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Cluster Name>*            | The name of the ADX cluster                                  |
| Metric Namespace | *Kusto Cluster Standard Metrics* | A namespace that acts like a category for the metric         |
| Metric           | *Batches Processed*              | The metric name                                              |
| Aggregation      | *Sum*                            | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

2. Select **Apply splitting** above the chart (*3-apply spliting.png*):
3. Select the **Batching Type** dimension to segment the chart by the batch seal reason (whether the batch reached the batching time, data size or number of files limit, set by [batching policy](kusto/management/batchingpolicy)) (*18- split by batching type.png*):
4. If you want to focus on a specific database of your cluster, select **Add filter** above the chart (*8- add filter.png*):
5. Select which database values you want to include when plotting the chart (this example shows filtering out blobs sent to the *GitHub* database) (*9- filter by database.png*):
6. After selecting the filter values, click away from the Filter Selector to close it. Now the chart shows the number of sealed batches with data sent to *GitHub* database over time, split by the Batching type (*19- batches processed graph.png*):
7. You can see that there are 2-4 batches per time unit over time, and all batches are split by time as estimated in the stage latency section where you see that it takes around 5 minutes to batch data based on the default batching policy (relevant link to stage latency).
8. Select **Add Chart** above the chart and return steps 1,4-6 above to create additional charts for the **Batch blob count**, **Batch duration** and **Batch size** metrics. Use Avg aggregation while creating these metric charts (*19-22.png*).
9. In the charts you can see some conclusions:

* The average number of blobs in the batches is around 160 blobs over time, then it decrease to 60-120 blobs. As we have around 280 processed blobs over time in the 14 Feb in the batching manager (see the *amount of data section (link)*) and 3 processed batch over time, it indeed makes sense. Based on the default batching policy, a batch can seal when the blob count is 1000 blobs. As we don’t arrive to this number, we indeed don’t see batches sealed by count.
* The average batch duration is 5 minutes. Note that the default batching time defined in the batching policy is 5 minutes, and it may significantly affect the ingestion latency. On the other hand, you should consider that too small batching time may cause ingestion commands to include too small data size and reduce ingestion efficiency as well as requesting post-ingestion resources to optimize the small data shards produced by non-batched ingestion.
* In the batch size chart, you can see that the average size of batches is around 200-500MB over time. Note that the optimal size of data to be ingested in bulk is 1 GB of uncompressed data which is also defined as a seal reason by the default batching policy. As there is no 1GB of data to be batch over time, batches aren’t seal by size. Looking at the size, you should also consider the tradeoff between latency and efficiency as explained above.


**Compare data connection incoming events to the number of events sent for ingestion**

Applying Event Hub, IoT Hub or Event Grid ingestion, it is important to compare the number of events received by ADX to the number of events sent from Event Hub to ADX. The metrics **Events Received,** **Events Processed** and **Events Dropped** aimed to enable this comparison.

1.    In the metrics pane select the following settings (*23- select events received.png*):

| Settings         | Suggested Value                  | Field Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Cluster Name>*            | The name of the ADX cluster                                  |
| Metric Namespace | *Kusto Cluster Standard Metrics* | A namespace that acts like a category for the metric         |
| Metric           | *Events Received*                | The metric name                                              |
| Aggregation      | *Sum*                            | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

2. Select **Add filter** above the chart *(8-add filter.png)*:
3. Select the **Component Name** property to filter the events received by a specific data connection defined on your cluster (*24-filter by component name.png*):
4. After selecting the filtering values, click away from the Filter Selector to close it. Now the chart shows the number of events received by the selected data connection over time (*24- events received graph.png*): 
5. Looking at the chart above you can see that the data connection called **GitHubStreamingEvents** gets around 200-500 events over time.
6. To see if there are events dropped by ADX, you can focus on the **Events Dropped** metric and **Events Processed** metric.
7. On the Chart you have already created, select **Add metric (***25- select add metric.png***):**
8. Select **Events Processed** as the Metric, and *Sum* for the Aggregation.
9. Return steps 8-9 to add **Events Dropped** by the data connection (*26- events graph.png*).
10. The chart now shows the number of Events that were received, processed and dropped by the **GitHubStreamingEvents** data connection over time.
11. In the chart above you can see that almost all received events were processed successfully by the data connection. There is 1 dropped event, which compatible with the failed ingestion result due to bad request that we saw in the first section (*link to first section*).
12. You may also want to compare the number of **Event Received** to the number of events that were sent from Event Hub to ADX.
13. On the chart select **Add metric.**
14. Click on the Scope to select the desired Event Hub namespace as the scope of the metric.
15. In the opened panel, de-selected the ADX cluster, search for the namespace of the Event Hub that send data to your data connection and select it (*27- select a scope.png*)
16. Select **Apply**
17. Select the following settings **(***28- select outgoing messages.png***):**
 
| Settings         | Suggested Value                   | Field Description                                            |
| ---------------- | --------------------------------- | ------------------------------------------------------------ |
| Scope            | *<Your Event Hub Namespace Name>* | The name of the Event Hub namespace which send data  to your data connection |
| Metric Namespace | *Event Hub standard metrics*      | A namespace that acts like a category for the metric         |
| Metric           | *Outgoing Messages*               | The metric name                                              |
| Aggregation      | *Sum*                             | The aggregated function by which the metrics are  aggregated over time. To better understand aggregation see [Changing aggregation](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/metrics-charts#changing-aggregation) |

18. Click away from the settings to get the full chart that compare the number of events processed by ADX data connection to the number of events sent from the Event Hub (*29-all events metrics graph.png*):
19. In the chart above you can see all events that were sent from Event Hub, were processed successfully by ADX data connection.

**Note**: If you have more than one Event Hub in the Event Hub namespace, you should filter **Outgoing Messages** metric by the Entity Name dimension to get only data from the desired Event hub in your Event Hub namespace

**Next Steps**

* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics)
* [Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs?tabs=ingestion)
* [Use Azure Monitor Insights](/azure/azure-monitor/insights/data-explorer)

**Related Articles:**

* For more information about Azure Metric Explorer see [Getting started with Azure Metrics Explorer](/azure/azure-monitor/platform/metrics-getting-started)
* To get the full list of ADX metrics see [Supported Azure Data Explorer metrics](using-metrics#supported-azure-data-explorer-metrics)
