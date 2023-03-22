---
title: Start for free using Azure Data Explorer
description: This article shows you how to get started with a free Azure Data Explorer cluster.
ms.reviewer: avnera
ms.topic: how-to
ms.date: 01/25/2023
---

# What is a free Azure Data Explorer cluster?

Free cluster allows anyone with a Microsoft account or an Azure Active Directory user identity to create a [free Azure Data Explorer cluster](start-for-free-web-ui.md) without needing an Azure subscription or a credit card.

It's a frictionless way to create a free cluster that can be used for any purpose. It's the ideal solution for anyone who wants to get started quickly with Azure Data Explorer and experience the incredible engine performance and enjoy the productive Kusto Query Language.

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

| Feature | Full Azure Data Explorer cluster | Free cluster |
|--|--|--|
| Kusto Query Language | &check; | &check; |
| Database objects (tables, columns, functions) | &check; | &check; |
| Materialized views | &check; | &check; |
| Tools (Azure Data Explorer web UI) | &check; | &check; |
| Dashboards (PowerBI, Azure Data Explorer web UI, Grafana) | &check; | &check; |
| Azure Data Studio notebooks | &check; | &check; |
| SDKs (all languages) | &check; | &check; |
| Time series and Machine Learning functions | &check; | &check; |
| Geospatial functions | &check; | &check; |
| Soft delete | &check; | &check; |
| Microsoft Power Automate and Azure Logic Apps connectors | &check; | &check; |
| External tables | &check; | |
| Continuous export | &check; | |
| Workload groups | &check; | |
| Purge | &check; | |
| Follower clusters | &check; | |
| Partitioning policy | &check; | |
| Streaming ingestion | &check; | |
| Python and R plugins | &check; | |
| Enterprise readiness (Customer managed keys, VNet, disk encryption, managed identities) | &check; | |
| Autoscale | &check; | |
| Azure Monitor and Insights | &check; | |
| Event Hubs and Event Grid connectors | &check; | Event Hubs only |
| Azure Resource Manager (ARM) templates | &check; | |

## Next steps

* [Get started with your free cluster](start-for-free-web-ui.md)
* [Manage Event Hubs data connections in your free cluster](start-for-free-event-hubs.md)
* [Learn more about Azure Data Explorer](data-explorer-overview.md)
* [Learn more about Kusto Query Language](kusto/query/index.md)
