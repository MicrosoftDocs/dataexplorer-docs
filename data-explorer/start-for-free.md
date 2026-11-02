---
title: Start for Free with Azure Data Explorer
description: Start exploring Azure Data Explorer with a free cluster—no subscription or credit card required. Learn how to create, query, and manage your data today.
#customer intent: As a new user, I want to create a free Azure Data Explorer cluster so that I can explore its features without needing an Azure subscription.
ms.reviewer: avnera
ms.topic: how-to
ms.date: 11/01/2026
---


# What is a free Azure Data Explorer cluster?

Free cluster allows anyone with a Microsoft account or a Microsoft Entra user identity to create a [free Azure Data Explorer cluster](start-for-free-web-ui.md) without needing an Azure subscription or a credit card.

The free cluster can be used for any purpose and is the ideal solution for anyone who wants to get started quickly with Azure Data Explorer. It allows you to explore the wide range of [data ingestion](ingest-data-overview.md) methods, use the [Kusto Query Language](/kusto/query/index?view=azure-data-explorer&preserve-view=true), and experience the incredible ingestion and query performance.

> [!IMPORTANT]
> 
> * Microsoft grants you the right to access and use the **one** Free Cluster at no charge for commercial or non-commercial use for a period of one year.
> * Microsoft may automatically renew the trial period.
> * Your data is stored at a location of your choosing in one of three available geographies (Europe, Asia and North America).
> * The cluster is provided free of charge, and as such is not subject to service layer agreement.
> * You can move to a paid Azure Data Explorer cluster at any time by creating a new cluster and migrating your data. Your free cluster isn't converted, moved, or deleted automatically. For more information, see [Move to a paid cluster](#move-to-a-paid-cluster).
> * You can also get started with Eventhouse in Microsoft Fabric for free. Eventhouse uses the same Kusto engine and Kusto Query Language, with no cluster to manage. For more information, see [Try Eventhouse in Microsoft Fabric for free](#try-eventhouse-in-microsoft-fabric-for-free).
> * For additional terms and conditions, see the [Disclaimer](#disclaimer) section below.

Start your journey by [creating your own free cluster](https://aka.ms/kustofree) and reviewing the [Microsoft Software License Terms](https://aka.ms/kustofreeeula).

## Try Eventhouse in Microsoft Fabric for free

[Eventhouse](/fabric/real-time-intelligence/eventhouse) in Microsoft Fabric uses the same Kusto engine and Kusto Query Language as Azure Data Explorer, with no cluster to create or manage. You can try it as part of a free [Microsoft Fabric trial](/fabric/fundamentals/fabric-trial) and move to a paid Fabric capacity when you're ready. Your KQL queries, tables, and functions work the same way.

To get started:

1. [Start a Microsoft Fabric trial](/fabric/fundamentals/fabric-trial): sign in to the [Fabric portal](https://app.fabric.microsoft.com) and select **Start trial** in the account manager. No credit card is required.
1. [Create an eventhouse](/fabric/real-time-intelligence/create-eventhouse) in your workspace. A KQL database is created with it.
1. Get data: [upload a local file](/fabric/real-time-intelligence/get-data-local-file), connect to Azure Storage, or stream data with Eventstream.
1. Query your data with KQL and build a Real-Time Dashboard. For an end-to-end walkthrough, see the [Real-Time Intelligence tutorial](/fabric/real-time-intelligence/tutorial-1-resources).

> [!NOTE]
> The Fabric trial requires a work or school account. If you use a personal Microsoft account, see [Start a Microsoft Fabric free trial with your personal email](/fabric/fundamentals/free-trial-account-personal-email).

To move data from your free cluster into an eventhouse, export your tables to Azure Storage and then use **Get data** in the eventhouse. For more information, see [Move your data to an eventhouse instead](start-for-free-move-to-paid.md#move-your-data-to-an-eventhouse-instead).

## Move to a paid cluster

When you're ready for production workloads, create a paid Azure Data Explorer cluster in your Azure subscription and move your data to it. Paid clusters remove the free cluster quotas and provide the full feature set listed in [Feature comparison](#feature-comparison), including a service level agreement.

> [!NOTE]
> Your free cluster isn't converted, moved, or deleted automatically. You create the new cluster, migrate the data, and delete the free cluster yourself. The free cluster stays in place until you delete it, subject to the terms in the [Disclaimer](#disclaimer).

The move has four steps:

1. **Create a new cluster.** In the Azure portal, [create an Azure Data Explorer cluster and database](create-cluster-and-database.md) in your subscription. Choose the same region as your free cluster to keep latency low.
1. **Export and import your data.** Export the schema and data from the free cluster and import them into the new cluster. Reapply permissions, data connections, and client connection strings.
1. **Validate and switch.** Compare row counts, run your queries on the new cluster, and point your applications, dashboards, and ingestion to the new cluster URI.
1. **Delete the free cluster.** After everything runs on the paid cluster, delete the free cluster from **My cluster**. This action is permanent.

For step-by-step instructions and commands, see [Move from a free cluster to a paid Azure Data Explorer cluster](start-for-free-move-to-paid.md).

## Specifications

The following table describes specifications and quotas for a free cluster.

| Item | Value |
|--|--|
| Storage (uncompressed) | ~100 GB (20 GB compressed) |
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

## Disclaimer

The following special terms apply to Azure Data Explorer Free Clusters

* Free clusters are provided "as-is," "with all faults," and "as available," and are excluded from all service level agreements and warranties.
* Microsoft may suspend or delete clusters, if it is deemed necessary for preventing unauthorized access, abusive or malicious use.
* Unless otherwise noted, you should not use the free cluster to process Personal Data or other data that is subject to legal or regulatory compliance requirements. 
* The following terms in the DPA do not apply to this Free Cluster: Processing of Personal Data; GDPR, Data Security, and HIPAA Business Associate.
* Microsoft may change or discontinue the Free Cluster service at any time without notice.

## Related content

* [Get started with your free cluster](start-for-free-web-ui.md)
* [Manage Event Hubs data connections in your free cluster](start-for-free-event-hubs.md)
* [Move from a free cluster to a paid Azure Data Explorer cluster](start-for-free-move-to-paid.md)
* [Eventhouse overview](/fabric/real-time-intelligence/eventhouse)
* [Try Microsoft Fabric for free](/fabric/fundamentals/fabric-trial)
* [Learn more about Azure Data Explorer](data-explorer-overview.md)
* [Learn more about Kusto Query Language](/kusto/query/index?view=azure-data-explorer&preserve-view=true)
