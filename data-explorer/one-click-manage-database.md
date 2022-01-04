---
title: Use the one-click database wizard to create or update an Azure Data Explorer database
description: In this article, you learn how to create or update an Azure Data Explorer database.
author: orspod
ms.author: orspodek
ms.reviewer: talzamir
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/02/2022
---

# One-click database management

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest data into a database so that you can run queries against it.'

In this article, you learn how to create or update a database using the one-click database management wizard.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create a [cluster](create-cluster-database-portal.md).

## Manage a database

The one-click database management wizard guides you through the one-click process to create or update a database.

[!INCLUDE [data-explorer-one-click-manage-database](includes/data-explorer-one-click-manage-database.md)]

## Run basic commands in the database

After you've managed the database, you can run queries and commands. If you created a new database that doesn't any have data yet, you can still the following to see how the tools work.

1. Under your cluster, select **Query**. Select your managed database and paste the command `.show databases` into the query window, then select **Run**.

    :::image type="content" source="media/one-click-manage-database/run-basic-query.png" alt-text="Screenshot of query page, showing basic command run.":::

    The result set shows the managed database under the cluster.

1. Paste the command `.show tables` into the query window and select **Run**.

    If this is a new database, the command returns an empty result set because you don't have any tables yet.

## Next steps

> [!div class="nextstepaction"]
> [Ingest data into Azure Data Explorer](ingest-data-one-click.md)

