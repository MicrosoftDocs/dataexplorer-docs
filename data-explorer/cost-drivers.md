---
title: Breaking Down Azure Data Explorer Cost per GB Ingested
description: Learn how cost per GB ingested is calculated in Azure Data Explorer and what factors drive it.
ms.topic: overview
ms.date: 07/14/2025
---

# Breaking Down Azure Data Explorer Cost per GB Ingested

## Introduction

Azure Data Explorer (ADX) is a fast, fully managed analytics platform built for high-performance, real-time analysis over large-scale telemetry and log data. Its pricing reflects the underlying infrastructure, compute, storage, and networking, along with a service markup to cover development and operational costs.
In the world of big data analytics, pricing models are diverse and sometimes complex. Many platforms base their pricing on a combination of factors such as query volume, data ingestion, storage duration, and compute resources. This complexity makes it challenging to compare pricing across different products.
To address this challenge and to allow users to better understand the cost of using Azure Data Explorer service, this document uses the common metric **cost per GB ingested**, defined as the **total cluster cost** (compute, storage, networking, and service markup) divided by the **total original-sized data ingested** during that period.

> [!NOTE]
> All cost figures in this document reflect list prices, not accounting for discounts or commitment-based savings.

To ground the analysis, we analyzed a representative snapshot of ADX clusters in **June 2025**.
The following sections shows the main results from the analysis, explain what drives these differences and how users can optimize cost per GB ingested without compromising performance.

---

## Cost Per GB Ingested

The chart below shows **median daily GB ingested** in original size (Y-axis) vs. **median cost per GB ingested** (X-axis) for each cost group. Bubble size represents the group’s share of total data ingested into the service.

:::image type="content" source="media/cost-drivers/cost-graph.png" alt-text="Bubble chart showing cost per GB ingested.":::

**Cost per GB ingested varies across clusters, but several patterns stand out**:

- **Most data (78%)** is ingested at a cost between **$0.02 and $0.10 per GB** (before discounts).
- **3% of the data** is ingested at **less than $0.02 per GB**.
- Even within the same usage category (or "bubble"), there's significant variation. For example, in the largest bubble, one cluster may ingest at **$0.02 per GB**, while another reaches **$0.10 per GB**. A **5X difference**. The sections below outline key reasons for this variation.
- Clusters with **higher cost per GB are less common** and tend to have **lower ingestion volumes**. In general, the smaller the data volume, the higher the cost per GB (see below).
  
💡 The bubble graph shows that cost per GB ingested varies across clusters. This variation doesn’t indicate good or bad practices but rather reflects the different scenarios, configurations and usage patterns of the service.
  For instance, one cluster may retain data longer for compliance, increasing storage costs. Another may use update policies that process data during ingestion, raising compute usage. These are intentional design choices aligned with specific goals, and they naturally affect cost per GB. The next section outlines the key drivers behind these differences.

---

## What Drives Cost per GB Ingested

Below are the key factors behind variation in cost per GB ingested per cluster:

- **Storage duration**: The longer data is stored, the higher the cost, see [retention policy](/kusto/management/show-table-retention-policy-command?view=azure-data-explorer&preserve-view=true).
- **High CPU usage**: Caused by actions such as heavy queries, data processing, or transformations.
- **Cache settings**: Caching more data boosts performance but may increase costs, see [cache policy](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true).
- **Cold data usage**: Queries accessing cold data trigger read transactions that add to cost, see [hot and cold cache](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true).
- **Data transformation and optimization**: Features like Update Policies, Materialized Views, and Partitioning consume CPU resources and may raise cost, see [Update policies](/kusto/management/update-policy?view=azure-data-explorer&preserve-view=true), [Materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true) and [partitions](/kusto/management/partitioning-policy?view=azure-data-explorer&preserve-view=true).
- **Ingestion volume**: Clusters tend to operate more cost-effectively at higher ingestion volumes.
- **Streaming vs. Queued ingestion**: Each has a different cost profile depending on the use case, see [streaming](/kusto/management/streaming-ingestion-policy?view=azure-data-explorer&preserve-view=true) and [Queued](/kusto/management/data-ingestion/queued-ingestion-overview?view=azure-data-explorer&preserve-view=true).
- **Schema design**: Wide tables with many columns require more compute and storage resources, raising costs.
- **Advanced features**: Options like followers, private endpoints, and Python sandboxes consume more resources and can add to cost.
- **Data pipeline choice**: Some ingestion paths cost less. For example, Event Grid ingestion is typically cheaper than Event Hub.
- **Autoscale**: Clusters without autoscale often cost more because they don’t adjust their size based on demand.

Most of these factors are configurable, allowing users to optimize both performance and cost.

---

## A Closer Look at Key Cost Drivers

### Data Retention Impact on Cost

In ADX, all ingested data is stored in persistent storage. Each table and materialized view has a **retention policy** that defines how long the data is kept. The longer the data is retained, the higher the cost, based on Azure Storage pricing. When long-term storage is required (e.g., for compliance), the cost per GB ingested increases because it includes that ongoing storage expense.

### Cluster Size

- Cluster size refers to the number of machines (nodes) in the cluster. Each machine adds cost, depending on its type (SKU). With **autoscale**, which adjusts the cluster size based on CPU usage, the system can optimize both cost and performance by avoiding idle or redundant resources.
- A **large cache** combined with low ingestion volume often leads to a higher cost per GB, since you're paying for capacity that isn’t fully utilized. In addition, cache size can indirectly affect autoscale, as large caches require more SSD space, potentially causing the cluster to scale up, leading to more resources and higher costs.
- Clusters that run many queries or doing CPU-heavy tasks like Materialized Views, Update Policies, or Partitioning may scale up, raising the cost per GB. However, these features can reduce query CPU usage and improve overall efficiency.

### Volume of Data Ingested

As a cluster grows, more nodes are added, increasing total cost. However, that cost is spread across all ingested data.
So, the more data you ingest, the lower the cost per GB.

### Cold Data Usage

When queries frequently access cold data that stored on the disk, they cause read transactions that consume more resources, may increasing overall cluster cost.

### Streaming vs. Queued Ingestion

Each ingestion method has different cost, latency, and functionality characteristics, making each better suited for different scenarios. Regarding cost, **streaming ingestion** is cheaper when ingesting many small tables with trickling data, while **queued ingestion** is more cost-effective for large table.

---

> [!TIP] **Tips for Optimizing Cost per GB Ingested**
> Review the configurations of the parameters listed in this document to ensure they align with your cluster’s needs and workload requirements for optimal efficiency. In particular:
> 1. Ensure that query over cold data is minimized, to reduce read transaction.
> 2. Enable autoscale to dynamically match cluster size to demand.
