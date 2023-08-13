---
title: Create a free Azure Data Explorer cluster.
description: This article you'll learn how to create a free cluster, ingest data, and run queries to gain insights into your data using your free cluster.
ms.reviewer: avnera
ms.topic: how-to
ms.date: 09/11/2022
---

# Create a free Azure Data Explorer cluster

Creating your own [free cluster](start-for-free.md) gives you the opportunity to explore some of the incredible capabilities of Azure Data Explorer. In particular, it's a great way to experience our fast and highly scalable data exploration service for log and telemetry data, and use the powerful and intuitive Kusto Query Language to gain business insights into your data.

In this article, we'll show you how to create a free cluster, ingest data,  and run queries using your free cluster.

## Prerequisites

A Microsoft account or an Azure Active Directory user identity to create a free cluster. You do not require an Azure subscription or a credit card.

## Create your free cluster

[!INCLUDE [create-free-cluster](includes/create-free-cluster.md)]

## Work with your free cluster

:::image type="content" source="media/start-for-free-web-ui/start-for-free-overview-page.png" alt-text="Screenshot of a free cluster, showing the overview page." lightbox="media/start-for-free-web-ui/start-for-free-overview-page.png":::

On your cluster's overview page, you'll see the following:

1. Your cluster's name, the option to upgrade to a full cluster, and the option to delete the cluster.
1. Your cluster's location, policies, and URI links for connecting to your cluster via our [APIs](kusto/api/index.md) or other tools.
1. [Quick actions](#quick-actions) you can take to get started with your cluster.
1. A list of databases in your cluster.
1. A list of data connections in your cluster.

### Quick actions

Quick actions make it easy to get started with your cluster. You can create a database, ingest data, or run a query.

To start a quick action, under **Actions**, select the action you want to perform:

* **Ingest data**: Use this action to load data into your cluster. For more information, see the [ingestion wizard](./ingest-data-wizard.md#ingestion-wizard).
* **Query data**: Use this action to run a query against data in your cluster. For more information, see [Run queries](web-query-data.md#run-queries).
* **Create database**: Use this action if you want to create a new database in your cluster.
    1. In the **Create new database** card, select **Create**.
    1. On the **Create database** page, enter a name for the database, and then select **Create Database**.

        :::image type="content" source="media/start-for-free-web-ui/start-for-free-create-database.png" alt-text="Screenshot of Create database page, showing the details for the new database.":::

## Next steps

* [Upgrade your free cluster](start-for-free-upgrade.md)
* [Manage Event Hubs data connections in your free cluster](start-for-free-event-hubs.md)
* [Learn more about Azure Data Explorer](data-explorer-overview.md)
* [Learn more about Kusto Query Language](kusto/query/index.md)