---
title: Monitor batching ingestion in Azure Data Explorer
description: Learn how to use Azure Data Explorer metrics to monitor batching ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/25/2021
ms.custom: contperf-fy21q1
---

# Batching Ingestion Monitoring

Batching ingestion is the most performant [method for ingesting data](ingest-data-overview#batching-vs-streaming-ingestion) used by Azure Data Explorer (ADX).

In batching ingestion, ADX optimizes data ingestion for high throughput by batching the incoming data into small chunks based on a configurable [ingestion batching policy](kusto/management/batchingpolicy.md) that is defined on the database or table from which the data is ingested. The small batches of incoming data are then merged and optimized for fast query results.

ADX provides a set of [ingestion metrics](using-metrics#ingestion-metrics) in the Azure monitor in Azure portal. These metrics give you detailed information about the ingestion result, the amount of ingested data, the latency of the ingestion, and each stage of the batching process itself.

In this article you'll learn how to use ingestion metrics to monitor [batching ingestion to ADX](ingest-data-overview) in Azure portal.

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
1. **Pin to dashboard** adds your chart configuration to the dashboard so that you can view it again.
1. Set **New alert rule** to visualize your metrics using the set criteria. The new alerting rule will include the target resource, metric, splitting, and filter dimensions from your chart. You can modify these settings in the [alert rule creation pane](/azure/azure-monitor/platform/metrics-charts#create-alert-rules).

   :::image type="content" source="media/using-metrics/metrics-pane.png" alt-text="Screenshot of the Metrics pane in Azure portal highlighting the settings and options in the pane.":::

For the examples in this article:

* Set **Scope** to the name of your Azure Data Explorer cluster.
* Set **Metric Namespace** to **Kusto Cluster standard metrics**. This is the namespace that contains the ADX ingestion metrics.

   :::image type="content" source="media/monitor-batching-ingestion/metrics-settings-selector.png" alt-text="Screenshot showing how to select settings for a metric in Azure portal.":::

To begin analysis on your cluster in the metrics pane, select specific metrics to track, choose how to aggregate your data, and create metric charts to view on your dashboard.

## Batching ingestion stages and components

Batching ingestion occurs in stages, and each stage is governed by a *component*:

1. Prior to ingestion, as the data is retrieved from Event Grid, Event Hub, or IoT Hub, the *Data Connection* component performs initial data rearrangement.
2. The *Batching Manager* optimizes the ingestion throughput by batching the small ingress data chunks that it receives based on the ingestion batching policy.
3. The *Ingestion Manager* starts the data ingestion by sending the ingestion command to the *ADX Storage Engine*.
4. The *ADX Storage Engine* stores the ingested data, making it available for query.

When analyzing the amount of data passing through ingestion and the ingestion latency, you can split metrics by **Component Type** to better understand the performance of each of the batching ingestion stages.

## View the ingestion result

The **ingestion result** metric provides information about the total number of sources that were successfully ingested and those that failed to be ingested.

In this example, we'll use this metric to see the result of our ingestion attempts, including detailed status information to helps us troubleshoot any failed attempts.

1. Select the **Ingestion result** metric and select **Sum** as the aggregation value. This shows you the ingestion operations over time in one chart line.
1. Select the **Apply splitting** button above the chart and choose **Status** to segment your chart by the status of the ingestion operations. After selecting the splitting values, click away from the split selector to close it.

Now the metric information is split by status, so we can see information about the status of the ingestion operations split into three lines:

1. Blue for successful ingestion operations.
2. Orange for ingestion operations that failed due to *Entity not found*.
3. Purple for ingestion operations that failed due to *Bad request*.

:::image type="content" source="media/monitor-batching-ingestion/ingestion-result-by-status-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of ingestion results aggregated by sum and split by status.":::

Consider the following when looking at the chart of ingestion results:

* When using Event Hub ingestion, there is an event pre-aggregation in the *Data connection component*. During this stage of ingestion, events are treated as a single source to be ingested. Therefore, a few events appear as a single ingestion result after pre-aggregation.
* Transient failures are retried internally in a limited number of attempts. Each transient failure is reported as a transient ingestion result. Therefore, a single ingestion may lead to more than one ingestion result.
* Ingestion errors in the chart are listed by the category of the error code. To see the full list of ingestion error codes by categories and try to better understand the possible error reason, see [Ingestion error codes in Azure Data Explorer](error-codes). 
* To get more details on an ingestion error, you can set [failed ingestion diagnostic logs.](using-diagnostic-logs?tabs=ingestion#failed-ingestion-operation-log). However, It's important to take into account that generating logs results in the creation of additional resources, and therefore costs money.

## View the amount of ingested data

The **Blobs Processed**, **Blobs Received** and **Blobs Dropped** metrics provide information about the number of blobs that are processed by the ingestion components during the stages of batching ingestion.

In this example, we'll use these metrics to see how much data passed through the ingestion pipeline, how much data was received by the ingestion components, and how much data was dropped.

1. Select the **Blobs Processed** metric and select **Sum** as the aggregation value.
1. Select the **Apply splitting** button and then select the **Component Type** dimension to segment the chart by the different ingestion components.
1. To focus on a specific database in your cluster, select the **Add filter** button above the chart and then choose which database values to include when plotting the chart. In this example, we filter on the blobs sent to the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close it.

Now the chart shows how many blobs that are sent to the *GitHub* database were processed at each of the ingestion components over time.

:::image type="content" source="media/monitor-batching-ingestion/blobs-processed-by-component-type-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of blobs processed from the github database, aggregated by sum and split by component type.":::

* In the preceding chart, you can see that on February 13 there is a decrease in the number of blobs that were ingested to the *GitHub* database over time. You can also see that the number of blobs that were processed at each of the components is similar, meaning that approximately all data processed in the data connection was also processed successfully by the batching manager, by the ingestion manager and by the storage engine. Therefore, this data is ready for query.

To better understand the relation between the number of blobs that were received at each component and the number of blobs that were processed successfully at each component, we'll add a new chart:

1. Above the Blob processed chart, select **New chart**.
1. Leave the **Scope**, **Metric Namespace**, and **Aggregation** values the same, and select the **Blobs Received** metric.
1. Select the **Apply splitting** button and select **Component Type** to split the **Blob Received** metric by component type.
1. Select the **Add filter** button and set the same values as before to filter only the blobs sent to the *GitHub* database.

Now we can see both charts next to each other.

:::image type="content" source="media/monitor-batching-ingestion/blobs-received-and-processed-by-component-type-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing charts of blobs processed and blobs received from the github database aggregated by sum and split by component type.":::

* Comparing the charts, we can see that the number of blobs received by each component closely matches the number of blobs that were processed by each component. This indicates that no blobs were dropped during ingestion. However, to determine that information exactly, you should analyze the **Blobs Dropped** metric. This metric shows how many blobs were dropped during ingestion and helps you detect whether there is a problem in processing at a specific ingestion component. For each dropped blob you will also get an **Ingestion Result** metric with more information about the reason for failure.

## View the ingestion latency

The metrics **Stage Latency** and **Discovery Latency** monitor latency in the ingestion process and tell you whether any long latency is occurring in ADX or before data actually arrives in ADX for ingestion.

* **Stage Latency** indicates the time span from when a message is discovered by ADX until its content is received by an ingestion component for processing.
* **Discovery Latency** is used for ingestion pipelines with data connections (such as Event Hub, IoT Hub, and Event Grid). This metric gives information about the time span from data enqueue until discovery by ADX data connections. This time span is upstream to ADX, so it is not included in the **Stage Latency** metric that only measures the latency in ADX.

> [!NOTE]
> According to the default [batching policy](kusto/management/batchingpolicy), the default batching time is 5 minutes. Therefore, the expected latency is at least 5 minutes when using the default batching policy.

When you see a long latency until data is ready for query, analyzing **Stage Latency** and **Discovery Latency** can help you to understand whether the long latency is due to long latency in ADX, or is upstream to ADX. You can also detect the specific component responsible for the long latency.

### Stage Latency

Let's first take a look at the stage latency of our batching ingestion:

1. Select the **Stage Latency** metric and select **Avg** as the aggregation value.
1. Select the **Apply splitting** button and then select the **Component Type** dimension to segment the chart by the different ingestion components.
1. In this example, we filter on the blobs sent to the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close it.

:::image type="content" source="media/monitor-batching-ingestion/stage-latency-by-component-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of stage latency for ingestion from the github database aggregated by avg and split by component type.":::

We can tell the following information from this chart:

* The latency at the *Data Connection* component is approximately 0 seconds. This makes sense, because **Stage Latency** only measures latency from when a message is discovered by ADX.
* The longest time in the ingestion process (approximately 5 minutes) passes from when the Batching Manager received data to when the Ingestion Manager received data. In this example, we use the default batching policy for the *GitHub* database. As noted, the latency time for the default batching policy is 5 minutes, so this indicates that nearly all of the latency time for the batching ingestion was due to the default latency.
* The Storage engine latency in the chart represents the latency when receiving data by the *ADX Storage Engine* component. You can see that the average total latency from the time of data discovery by ADX until its ready for query is 5.2 minutes.

### Discovery Latency

If you use ingestion with data connections, you may want to estimate the latency upstream to ADX over time as long latency may also occur before ADX actually gets the data for ingestion. For that purpose, you can use the **Discovery Latency** metric.

1. Select the **Discovery Latency** metric and select **Avg** as the aggregation value.
1. Select the **Apply splitting** button and then select the **Component Type** dimension to segment the chart by the different ingestion components. After selecting the splitting values, click away from the split selector to close it.

:::image type="content" source="media/monitor-batching-ingestion/discovery-latency-by-component-type.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of discovery latency for ingestion from the github database aggregated by avg and split by component type.":::

* You can see that for most of the duration the discovery latency is 0 seconds, indicating that ADX receives data immediately after data enqueue. Around 11:37 PM there is a small peak of 1.4 seconds, indicating that at this time the ADX cluster received the data 1.4 seconds after data enqueue.

## Understand the batching process

In the second stage of the batching ingestion flow, the *Batching Manager* component optimizes the ingestion throughput by batching the data it receives based on the ingestion batching policy.

The following set of metrics helps you understand how your cluster is being batched during ingestion:

* **Batches processed:** The total number of batches completed for ingestion.
* **Batch size:** The expected size of uncompressed data in a batch aggregated for ingestion.
* **Batch duration:** The duration of the batching phase in the ingestion flow.
* **Batch blob count:** The number of blobs in a completed ingestion batch.

Let's start with an overall view of the batching process by looking at the **Batches processed** metric.

1. Select the **Batches processed** metric and select **Sum** as the aggregation value.
1. Select the **Apply splitting** button above the chart, and select the **Batching Type** dimension to segment the chart based on the reason the batch was sealed. Batches are sealed when the batch reaches the limits set in the batching policy for the batching time, data size, or number of files.
1. In this example, we filter on the blobs sent to the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close it.

The chart shows the number of sealed batches with data sent to the *GitHub* database over time, split by the Batching type.

:::image type="content" source="media/monitor-batching-ingestion/batches-processed-by-batching-type-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of discovery latency for ingestion from the github database aggregated by avg and split by component type.":::

* You can see that there are 2-4 batches per time unit over time, and that all batches are split by time as estimated in the stage latency section where you see that it takes around 5 minutes to batch data based on the default batching policy.

Now let's take a look in more detail at the size, speed, and efficiency of the how the batches are being processed.

1. Select the **Add Chart** button to create additional charts for the **Batch size**, **Batch duration**, and **Batch blob count** metrics.
1. Use **Avg** as the aggregation value for each and use the **Apply splitting** button to split each metric by **Batching Type**. 
1. As in the previous examples, filter each chart on the *GitHub* database by selecting *Database* as the **Property**, *=* as the **Operator**, and *GitHub** in the **Values** drop-down.

:::image type="content" source="media/monitor-batching-ingestion/batch-count-duration-size-graphs.png" alt-text="Screenshot of the Metrics pane in Azure portal showing charts of Batch blob count, Batch duration and Batch size metrics, for ingestion from the github database aggregated by avg and split by batching type.":::

* The average number of blobs in the batches is around 160 blobs over time, then it decreases to 60-120 blobs. As we saw in the [Blobs Processed graph](#view-the-amount-of-ingested-data), we have around 280 processed blobs over time for the February 14 time frame in the batching manager component, so this pattern makes sense. The graph also shows 3 processed batches over time. Based on the default batching policy, a batch can seal when the blob count is 1000 blobs. As we don’t arrive at this number, we don’t see batches sealed by count.

* The average batch duration is 5 minutes. Since the default batching time defined in the batching policy is 5 minutes, it may significantly affect the ingestion latency. On the other hand, a batching time that is too short may cause ingestion commands to include a data size that is too small. This will reduce ingestion efficiency and require post-ingestion resources to optimize the small data shards produced by non-batched ingestion.

* In the batch size chart, you can see that the average size of batches is around 200-500MB over time. The optimal size of data to be ingested in bulk, as defined in the default batching policy, is 1 GB of uncompressed data. This size is also defined as a seal reason by the default batching policy. As there is no 1GB of data to be batched over time, we don't see any batches sealed by size. When looking at the size, you should consider the same tradeoff between latency and efficiency as for the batch duration.

## Compare data connection incoming events to the number of events sent for ingestion

When applying Event Hub, IoT Hub or Event Grid ingestion, it is important to compare the number of events received by ADX to the number of events sent from Event Hub to ADX. The metrics **Events Received**, **Events Processed** and **Events Dropped** allow you to make this comparison.

1. Select the **Events Received** metric and select **Sum** as the aggregation value.
1. Select the **Add filter** button above the chart, and select the **Component Name** property to filter the events received by a specific data connection defined on your cluster. 
1. In this example, we filter on the **GitHubStreamingEvents** data connection by selecting *Component* as the **Property**, *=* as the **Operator**, and *GitHubStreamingEvents** in the **Values** drop-down. After selecting the filter values, click away from the filter selector to close itAfter selecting the filter values, click away from the filter selector to close it.

Now the chart shows the number of events received by the selected data connection over time:

:::image type="content" source="media/monitor-batching-ingestion/events-received-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart of the events received during ingestion from the github database aggregated over time.":::

* Looking at the chart above you can see that the **GitHubStreamingEvents** data connection called receives around 200-500 events over time.

To see if any events were dropped by ADX, use the **Events Processed** and **Events Dropped** metrics.

1. On the Chart you have already created, select **Add metric**.
1. Select the **Events Processed** metric and select **Sum** as the aggregation value.
1. Select **Add metric** again, and select the **Events Dropped** metric with **Sum** as the aggregation value.

The chart now shows the number of Events that were received, processed and dropped by the **GitHubStreamingEvents** data connection over time.

:::image type="content" source="media/monitor-batching-ingestion/events-processed-events-dropped-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart with graphs of the events processed and events dropped during ingestion from the github database aggregated over time.":::

* You can see that almost all of the received events were processed successfully by the data connection. There is 1 dropped event, which is compatible with the failed ingestion result due to bad request that we saw when [viewing the ingestion result metric](#view-the-ingestion-result-metric).

You may also want to compare the number of events received (tracked by the **Events Received** metric) to the number of events that were sent from Event Hub to ADX (tracked by the **Outgoing Messages** metric).

1. On the Chart you have already created, select **Add metric**.
1. Click on the Scope to select the Event Hub namespace as the scope of the metric. In this example GitHubStreamingEvents data connection over time
1. In the opened panel, search for the namespace of the Event Hub that sent data to your data connection and select it.

:::image type="content" source="media/monitor-batching-ingestion/select-a-scope.png" alt-text="Screenshot of the Select a scope dialog in the Azure portal, showing a search for the github4demo namespace in the EventHubs Namespace.":::

1. Select **Apply** 
1. Select the **Outgoing Messages** metric and select **Sum** as the aggregation value.

Click away from the settings to get the full chart that compare the number of events processed by ADX data connection to the number of events sent from the Event Hub.

:::image type="content" source="media/monitor-batching-ingestion/all-event-metrics-graph.png" alt-text="Screenshot of the Metrics pane in Azure portal showing a chart with graphs for all of the events received, processed, dropped and during ingestion from the github database aggregated over time.":::

* You can see all events that were sent from Event Hub were processed successfully by the ADX data connection.

> [!NOTE]
> If you have more than one Event Hub in the Event Hub namespace, you should filter **Outgoing Messages** metric by the **Entity Name** dimension to get only data from the desired Event hub in your Event Hub namespace.

## Next Steps

* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics)
* [Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs?tabs=ingestion)
* [Use Azure Monitor Insights](/azure/azure-monitor/insights/data-explorer)

**Related Articles:**

* For more information about Azure Metric Explorer see [Getting started with Azure Metrics Explorer](/azure/azure-monitor/platform/metrics-getting-started)
* To get the full list of ADX metrics see [Supported Azure Data Explorer metrics](using-metrics#supported-azure-data-explorer-metrics)
