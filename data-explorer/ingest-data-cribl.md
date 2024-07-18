---
title: 'Ingest data from Cribl stream into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Cribl stream.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/18/2024

#Customer intent: As an integration developer, I want to build integration pipelines from Cribl stream into Azure Data Explorer, so I can make data available for near real time analytics.
---
# Ingest data from Cribl stream into Azure Data Explorer

[!INCLUDE [ingest-data-cribl](includes/cross-repo/ingest-data-cribl.md)]

For a complete list of data connectors, see [Data integrations overview](integrate-data-overview.md).

## Prerequisites

* A [Cribl stream account](https://cribl.io)
* An Azure Data Explorer [cluster and database](/azure/data-explorer/create-cluster-and-database) with the default cache and retention policies.
* [Azure Data Explorer query environment](https://dataexplorer.azure.com/)

[!INCLUDE [ingest-data-cribl-2](includes/cross-repo/ingest-data-cribl-2.md)]

<!--[!INCLUDE [ingest-data-cribl-3](includes/cross-repo/ingest-data-cribl-3.md)]-->

## Clean up resources

To delete the Azure Data Explorer resources, use [az cluster delete](/cli/azure/kusto/cluster#az-kusto-cluster-delete) or [az Kusto database delete](/cli/azure/kusto/database#az-kusto-database-delete):

```azurecli-interactive
az kusto cluster delete -n <cluster name> -g <resource group name>
az kusto database delete -n <database name> --cluster-name <cluster name> -g <resource group name>
```

## Target URI

You'll need your Kusto cluster URI for the *Cluster base URI* value.  For the *Ingestion service URI* the URI is in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](add-cluster-connection.md#add-a-cluster-connection).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
