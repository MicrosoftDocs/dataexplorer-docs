---
title: Use one-click ingestion to ingest data into Azure Data Explorer
description: Overview of ingesting (loading) data into Azure Data Explorer simply, using one-click ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: overview
ms.date: 03/29/2020
---

# What is one-click ingestion? 

Ingesting data can be a confusing process, but one-click ingestion makes the process easy, fast, and intuitive. You can ingest data in a matter of minutes using the Azure Data Explorer Web UI. Choose from a number of data sources (local file, blob, and container up to 10,000 blobs) in a variety of [formats](#file-formats), and ingest into new or existing tables. Table creation and mapping are suggested to you based on your data and navigated through a wizard. The process also provides automatic definition of Event Grid for continuous ingestion from a container in only four clicks. 

One-click ingestion is particularly useful when ingesting data for the first time, or when your data's schema is unfamiliar to you.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## File formats

One-click ingestion supports ingesting a new table from source data in any of the following formats:
* JSON
* CSV
* TSV
* SCSV
* SOHSV
* TSVE
* PSV

## One-click ingestion wizard

The one-click ingestion wizard guides you through the one-click ingestion process. 

> [!Note]
> This section describes the wizard in general. The options you select depend on what data format you are ingesting, what kind of data source you are ingesting from, and whether you are ingesting into a new or existing table. 
>
> For sample scenarios, see:
> * Ingest into [a new table](one-click-ingestion-new-table.md)
> * Ingest into an [existing table](one-click-ingestion-existing-table.md) 
    
1. To access the wizard, right-click the **database** or **table** row in left menu of the Azure Data Explorer web UI and select **Ingest new data (preview)**.

    :::image type="content" source="media/ingest-data-one-click/one-click-ingestion-in-webui.png" alt-text="Select one-click ingestion in the web UI":::
    
1. The wizard guides you through the following options:
    * Ingest into an [existing table](one-click-ingestion-existing-table.md)
    * Ingest into [a new table](one-click-ingestion-new-table.md)
    * Ingest data from:
      * Blob storage
      * A local file
      * A container
       
1. If you're ingesting data from a container, you can filter the data so that only files with specific prefixes or file extensions are ingested. For example, you might only want to ingest files with filenames beginning with the word *Europe*, or only files with the extension *.json*. 

1. For other sources (not a container), when you've successfully selected the data source, a preview of the data is displayed. 

1. Click **Edit schema**. Review and adjust the auto-generated schema and ingestion properties (data format, mapping name, etc.). The service automatically identifies if the source is compressed or not by looking at its name.

1. Start the data ingestion process.

> [!Note]
> If your data source is a container, note that Azure Data Explorer's data ingestion aggregation (batching) policy is designed to optimize the ingestion process. By default, the policy is configured to 5 minutes or 500 MB of data, so you may experience latency. See [batching policy](kusto/management/batchingpolicy.md) for aggregation options. When ingesting data from other sources, the ingestion will take immediate effect.

## Next steps

* Decide if you'll use one-click ingestion to ingest data into [an existing table](one-click-ingestion-existing-table.md) or [a new table](one-click-ingestion-new-table.md)
* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
