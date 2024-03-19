---
title: Start for free using Azure Data Explorer
description: This article shows you how to get started with a free Azure Data Explorer cluster.
ms.reviewer: avnera
ms.topic: how-to
ms.date: 07/02/2023
---

# What is a free Azure Data Explorer cluster?

Free cluster allows anyone with a Microsoft account or a Microsoft Entra user identity to create a [free Azure Data Explorer cluster](start-for-free-web-ui.md) without needing an Azure subscription or a credit card.

The free cluster can be used for any purpose and is the ideal solution for anyone who wants to get started quickly with Azure Data Explorer. It allows you to explore the wide range of [data ingestion](ingest-data-overview.md) methods, use the [Kusto Query Language](kusto/query/index.md), and experience the incredible ingestion and query performance.

The cluster's trial period is for a year and may automatically be extended. The cluster is provided *as-is* and isn't subject to the Azure Data Explorer service level agreement. At any time, you can upgrade the cluster to a full Azure Data Explorer cluster.

Start your journey by [creating your own free cluster](https://aka.ms/kustofree) and reviewing the [Microsoft Software License Terms](https://aka.ms/kustofreeeula).

## Specifications

The following table describes specifications and quotas for a free cluster.

| Item | Value |
|--|--|
| Storage (uncompressed) | ~100 GB |
| Databases | Up to 10 |
| Tables per database | Up to 100 |
| Columns per table | Up to 200 |
| Materialized views per database | Up to 5 |

## Feature comparison

The free cluster is a subset of the full Azure Data Explorer cluster that provides a reduced set of functionality. The following table lists the features and their availability in both offerings.

| Feature | Full cluster | Free cluster |
|--|--|--|
| Kusto Query Language |  :heavy_check_mark: |  :heavy_check_mark: |
| Database objects (tables, columns, functions) |  :heavy_check_mark: |  :heavy_check_mark: |
| Materialized views |  :heavy_check_mark: |  :heavy_check_mark: |
| Tools (Azure Data Explorer web UI) |  :heavy_check_mark: |  :heavy_check_mark: |
| Dashboards (PowerBI, Azure Data Explorer web UI, Grafana) |  :heavy_check_mark: |  :heavy_check_mark: |
| Streaming ingestion |  :heavy_check_mark: | :heavy_check_mark: |
| Azure Data Studio notebooks |  :heavy_check_mark: |  :heavy_check_mark: |
| SDKs (all languages) |  :heavy_check_mark: |  :heavy_check_mark: |
| Time series and Machine Learning functions |  :heavy_check_mark: |  :heavy_check_mark: |
| Geospatial functions |  :heavy_check_mark: |  :heavy_check_mark: |
| Soft delete |  :heavy_check_mark: |  :heavy_check_mark: |
| Microsoft Power Automate and Azure Logic Apps connectors |  :heavy_check_mark: |  :heavy_check_mark: |
| Event Hub connector |  :heavy_check_mark: |  :heavy_check_mark: |
| Event Grid connector |   :heavy_check_mark: | |
| External tables |  :heavy_check_mark: | |
| Continuous export |  :heavy_check_mark: | |
| Workload groups |  :heavy_check_mark: | |
| Purge |  :heavy_check_mark: | |
| Follower clusters |  :heavy_check_mark: | |
| Partitioning policy |  :heavy_check_mark: | |
| Python and R plugins |  :heavy_check_mark: | |
| Enterprise readiness (Customer managed keys, Virtual Network, disk encryption, managed identities) |  :heavy_check_mark: | |
| Autoscale |  :heavy_check_mark: | |
| Azure Monitor and Insights |  :heavy_check_mark: | |
| Azure Resource Manager (ARM) templates |  :heavy_check_mark: | |

## Related content

* [Get started with your free cluster](start-for-free-web-ui.md)
* [Manage Event Hubs data connections in your free cluster](start-for-free-event-hubs.md)
* [Learn more about Azure Data Explorer](data-explorer-overview.md)
* [Learn more about Kusto Query Language](kusto/query/index.md)
