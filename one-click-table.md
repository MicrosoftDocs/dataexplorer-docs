---
title: How to create a table in Azure Data Explorer
description: Learn how to easily create a table in Azure Data Explorer with the one-click experience.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/06/2020
---

# Create a table (preview)

Overview- why do you need to create a table, what you are going to do here, what will you get when you're done.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a table

1. In the left menu of the Web UI, right-click a *database* or *table* and select **Create table**

    :::image type="content" source="data-explorer/media/one-click-table/create-table.png" alt-text="Create a table in the Azure Data Explorer Web UI":::

1. In the **Create table** window, the **Source** tab is selected.

1. In **Table name**, enter a name for your table. 
1. Select **Ingestion type** from the dropdown menu. You can 
    :::image type="content" source="data-explorer/media/one-click-table/source-tab.png" alt-text="Source of data for create table in one-click in Azure Data Explorer":::

    :::image type="content" source="data-explorer/media/one-click-table/data-from-file.png" alt-text="Create a table based on data from a local file ":::

1. Select **Edit Schema** to continue to the **Schema** tab.

    :::image type="content" source="data-explorer/media/one-click-table/schema-tab.png" alt-text="Edit schema tab in create table in one-click experience in Azure Data Explorer":::

1. 
    :::image type="content" source="data-explorer/media/one-click-table/table-completed.png" alt-text="Table creation completed in create a table in one click experience - Azure Data Explorer":::


If you click on database, you have option to create table
Looks like before, except table name is input field and not dropdown
Source type- select
On next table you have option to create mapping or not
If not, Next you have quick queries/tools
If yes mapping, shows table created mapping created – options to open command just like ingestions

## Next steps

* [Data ingestion overview](data-explorer/ingest-data-overview.md)
* [One-click ingestion](data-explorer/ingest-data-one-click.md)
* 
