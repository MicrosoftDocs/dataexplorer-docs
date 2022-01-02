---
title: Use one-click manage database wizard to create and update an Azure Data Explorer database
description: In this article, you learn how to create and update an Azure Data Explorer database.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: talzamir
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/12/2021
---

# Quickstart: Create and update an Azure Data Explorer database

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest data into a database so that you can run queries against it.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
If you don't have a cluster, create a [cluster](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal) before you begin.

## Create a database

In this wizard you can create a new database or update an existing one, by selecting New database / Existing database accordingly.

1. On the **Data** tab, under `Database` CLICK **Manage**.

    -image from: https://preview.dataexplorer.azure.com/oneclick-

1. Fill out the form with the following information.

    -image from: https://preview.dataexplorer.azure.com/oneclick/manageDatabase-

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Cluster | *TestCluster* | The cluster you wish to create / update the database in.
    | Database name | *TestDatabase* | The database name must be unique within the cluster.
    | Retention period | *365* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested.
    | Cache period | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage.
    | | | |

1. Select **Manage database** to create/update the database. The action typically takes less than a minute. When the process is complete.

## Run basic commands in the database

After you managed the database, you can run queries and commands. New database doesn't have data yet, but you can still see how the tools work.

1. Go to **Query** tab. under your cluster, select your managed database. Paste the command `.show databases` into the query window, then select **Run**.

    -image with the query command from Query tab from https://preview.dataexplorer.azure.com/-

    The result set shows the managed database under the cluster.

1. Paste the command `.show tables` into the query window and select **Run**.

    If this is a new database, the command returns an empty result set because you don't have any tables yet.
    
    ## Next steps

> [!div class="nextstepaction"]
> [Ingest data into Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-data-one-click) 
