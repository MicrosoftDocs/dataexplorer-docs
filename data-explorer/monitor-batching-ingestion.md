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

By monitoring the batching ingestion, you can get information about the ingestion result, the amount of ingested data, the latency of the ingestion, and the batching process itself.

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

For more information about different metrics, see [supported Azure Data Explorer metrics](#supported-azure-data-explorer-metrics).

After reading this tutorial you will know how to answer the following questions:

1. How can I see the result of my ingestion attempts? *(link to the “ingestion result” section)*
2. How much data passes through the ingestion pipeline? *(link to “the amount of ingested data” section)*
3. What is the latency of the ingestion process and does long latency happen in ADX or before data actually arrives in ADX for ingestion? *(link to the “ingestion latency” section)*
4. How can I better understand the batching process of my cluster during ingestion? (*link to “understanding batching policy” section)*
5. When working with Event Hub, Event Grid and IoT Hub ingestion, how can I compare the number of events arrived to ADX to the number of events sent for ingestion *(link to “Compare data connection incoming events to the number of events sent for ingestion” section*)?

## Prerequisites

* An Azure subscription. If you don't have one, you can create a [free Azure account](https://azure.microsoft.com/free/).
* A [cluster and database](create-cluster-database-portal.md).

## Use metrics to monitor your Azure Data Explorer resources

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Monitor** from the left-hand navigation bar and select **Metrics** to open the metrics pane.

   :::image type="content" source="media/monitor-batching-ingestion/monitor-metrics-blade.png" alt-text="Search and select metrics in the Azure portal":::

The numbers in the following list correspond to the numbers in the image below it. They guide you through different options in setting up and viewing your metrics.

1. To create a metric chart, select the **Metric** name and the relevant **Aggregation** per metric. In this article we'll be using the **Aggregation** values *sum* and *avg*.
1. **Add metric** allows you to plot additional metrics in the same chart.
1. **+ New chart** allows you to see multiple charts in one view.
1. Use the time selector to change the time range for the chart. In this article we'll be using the value **Last 48 hours**.
1. Use [**Add filter** and **Apply splitting**](/azure/azure-monitor/platform/metrics-getting-started#apply-dimension-filters-and-splitting) for metrics that have dimensions. We'll be using the **Apply splitting** command.
1. **Pin to dashboard** adds your chart configuration to the dashboards so that you can view it again.
1. Set **New alert rule** to visualize your metrics using the set criteria. The new alerting rule will include the target resource, metric, splitting, and filter dimensions from your chart. You can modify these settings in the [alert rule creation pane](/azure/azure-monitor/platform/metrics-charts#create-alert-rules).

   :::image type="content" source="media/using-metrics/metrics-pane.png" alt-text="Screenshot of the Metrics pane in Azure portal highlighting the settings and options in the pane.":::

For the examples in this article:

* Set **Scope** to the name of your Azure Data Explorer cluster.
* Set **Metric Namespace** to **Kusto Cluster standard metrics**. This is the namespace that contains the ingestion metrics.

   :::image type="content" source="media/monitor-batching-ingestion/metrics-settings-selector.png" alt-text="Screenshot showing how to select settings for a metric in Azure portal.":::

To begin analysis on your cluster in the metrics pane, select specific metrics to track, choose how to aggregate your data, and create metric charts to view on your dashboard.

## View the ingestion result metric

The **ingestion result** metric provides information about the total number of sources that were successfully ingested and those that failed to be ingested.

In this example, we'll use this metric to see the result of our ingestion attempts, including detailed status information to helps us troubleshoot any failed attempts.

1. Select the **Ingestion result** metric and select **Sum** as the aggregation value. This shows you the ingestion operations over time in one chart line.
1. Select the **Apply splitting** button above the chart and choose **Status** to segment your chart by the status of the ingestion operations. After selecting the splitting values, click away from the split selector to close it.

Now the metric information is split by status, so we can see detailed information about the status of the ingestion operations. The chart shows 3 lines.

1. Blue for successful ingestion operations.
2. Orange for ingestion operations that failed due to *Entity not found*.
3. Purple for ingestion operations that failed due to *Bad request*.

:::image type="content" source="media/monitor-batching-ingestion/ingestion-result-by-status-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of ingestion results aggregated by sum and split by status.":::

1. The error in the chart represents the category of the error code. To see the full list of ingestion error codes by categories and try to better understand the possible error reason see [Ingestion error codes in Azure Data Explorer](error-codes).
1. To get more details on an ingestion error, you can set [failed ingestion diagnostic logs.](using-diagnostic-logs?tabs=ingestion#failed-ingestion-operation-log). However, It's important to take into account that generating logs results in the creation of additional resources, and therefore costs money).

### Considerations

Consider the following when looking at the chart of ingestion results:

* When using Event Hub ingestion, there is an event pre-aggregation in the *Data connection component*. During this stage of ingestion, events are treated as a single source to be ingested. Therefore, a few events appear as a single ingestion result after pre-aggregation.
* Transient failures are retried internally to a limited number of attempts. Each transient failure is reported as a transient ingestion result. Therefore, a single ingestion may result with more than one ingestion result.

## View the amount of ingested data

The **Blobs Processed**, **Blobs Received** and **Blobs Dropped** metrics provide information about the number of blobs that are processed by the ingestion components during the stages of batching ingestion. 

In this example, we'll use these metrics to see how much data passed through the ingestion pipeline, how much data was received by the ingestion components, and how much data was dropped.

1. Select the **Blobs Processed** metric and select **Sum** as the aggregation value.
1. Select the **Apply splitting** button and then select the **Component Type** dimension to segment the chart by the different ingestion components.
1. To focus on a specific database in your cluster, select the **Add filter** button above the chart and then choose which database values to include when plotting the chart. In this example, we filter on the blobs sent to the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close it.

Now the chart shows how many blobs that are sent to the *GitHub* database were processed at each of the ingestion components over time.

:::image type="content" source="media/monitor-batching-ingestion/blobs-processed-by-component-type-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of blobs processed from the github database, aggregated by sum and split by component type.":::

In the preceding chart, you can see that on Februrary 13 there is a decrease in the number of blobs that were ingested to the *GitHub* database over time. You can also see that the number of blobs that were processed at each of the components is similar, meaning that approximately all data processed in the data connection was also processed successfully by the batching manager, by the ingestion manager and by the storage engine. Therefore, this data is ready for query.

To better understand the relation between the number of blobs that were received at each component and the number of blobs that were processed successfully at each component, we'll add a new chart to describe the number of blobs that were sent to *GitHub* database and were received at each component.

1. Above the Blob processed chart, select **New chart**.
1. Leave the **Scope**, **Metric Namespace**, and **Aggregation** values the same, and select the **Blobs Received** metric.
1. Select the **Apply splitting** button and select **Component Type** to split the **Blob Received** metric by component type.
1. Select the **Add filter** button and set the same values as before to filter only the blobs sent to the *GitHub* database. 

You can now see both charts next to each other.

:::image type="content" source="media/monitor-batching-ingestion/blobs-received-and-processed-by-component-type-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing charts of blobs processed and blobs received from the github database aggregated by sum and split by component type.":::

Comparing these charts, you can see that the number of blobs that were received by each component closely matches the number of blobs that were processed. This indicates that no blobs were dropped during ingestion. 

However, to determine that information exactly, you can also analyze the **Blob Dropped** metric following steps 2-5 above to see how many blobs were dropped during ingestion and detect whether there is problem in processing at specific component during ingestion. For each dropped blob you will also get an **Ingestion Result** metric with more information about the failure reason.

## View the ingestion latency

**Note**: According to the default [batching policy](kusto/management/batchingpolicy), the default batching time is 5 minutes. Therefore, the expected latency is at least 5 minutes using the default batching policy.

While ingesting data to Azure Data Explorer, it is important to understand the ingestion latency to know how much time passes until your data is ready for query. The metrics **Stage Latency** and **Discovery Latency** help you monitor ingestion latency.

* **Stage Latency** indicates the timespan from when a message is discovered by ADX until its content is received by an ingestion component for processing.
* **Discovery Latency** is used for ingestion pipelines with data connections (such as Event Hub, IoT Hub, and Event Grid). This metric gives information about the timespan from data enqueue until discovery by ADX data connections. This timespan is upstream to ADX, and therefore it is not included in the **Stage Latency** metric that measures only latency in ADX.

When you see a long latency until data is ready for query, analyzing **Stage Latency** and **Discovery Latency** can help you to understand whether the long latency is due to long latency in ADX, or is upstream to ADX. You can also detect the specific component responsible for the long latency.

Let's first take a look at the stage latency of our batching ingestion:

1. Select the **Stage Latency** metric and select **Avg** as the aggregation value.
1. Select the **Apply splitting** button and then select the **Component Type** dimension to segment the chart by the different ingestion components.
1. In this example, we filter on the blobs sent to the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close it.

:::image type="content" source="media/monitor-batching-ingestion/stage-latency-by-component-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of stage latency for ingestion from the github database aggregated by avg and split by component type.":::

We can tell the following information from this chart:

* The latency at the data connection is approximately 0 seconds. This makes sense, because **Stage Latency** only measures latency from when a message is discovered by ADX.
* The longest time in the ingestion process (approximately 5 minutes) passes from when the Batching Manager received data to when the Ingestion Manager received data. In this example, we use the default [Batching Policy](kusto/management/batchingpolicy) for the *GitHub* database. The latency time for the default batching policy is [5 minutes](kusto/management/batching-policy#altering-the-ingestionbatching-policy). This indicates that nearly all of the latency time for the batching ingestion was due to the default latency. You can see this conclusion in detail in the section about Understanding Batching Process *(link to this section)*.
* The Storage engine latency in the chart represents the latency when receiving data by the Storage Engine. You can see that the average total latency from the time of data discovery by ADX until it ready for query is 5.2 minutes.

Now we'll examine the discovery latency:

7. If you use ingestion with data connections, you may want to estimate the latency upstream to ADX over time as long latency may also be because of long latency before ADX actually gets the data for ingestion. For that purpose, you can use the **Discovery Latency** metric.
8. Above the chart you have already created, select **New chart**:
9. Select the following settings to see the average **Discovery Latency** over time:
10. Return steps 2-3 above to split the **Discovery Latency** by **Component Type**.
11. After selecting the splitting values, click away from the split selector to close it. 

Now you have charts for **Discovery Latency**:

:::image type="content" source="media/monitor-batching-ingestion/discovery-latency-by-component-type.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of discovery latency for ingestion from the github database aggregated by avg and split by component type.":::

You can see that almost all the time, the discovery Latency is 0 seconds means that ADX gets data immediately after data enqueue. The highest peak of around 300 milliseconds is around 13 Feb 14:00 AM means that at this time ADX cluster got the data around 300 milliseconds after data enqueue.

## Understand the batching process

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
