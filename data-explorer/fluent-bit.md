---
title: Ingest data with Fluent Bit into Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Fluent Bit.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 12/02/2024
---

# Ingest data with Fluent Bit into Azure Data Explorer

[!INCLUDE [fluent-bit](includes/cross-repo/fluent-bit.md)]

For a complete list of data connectors, see [Data connectors overview](integrate-overview.md).

## Prerequisites

* [Fluent Bit](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A query environment. For more information, see [Query integrations overview](integrate-query-overview.md). <a id=ingestion-uri></a>
* Your Kusto cluster URI for the *Ingestion_endpoint* value in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](add-cluster-connection.md#add-a-cluster-connection).

[!INCLUDE [fluent-bit-2](includes/cross-repo/fluent-bit-2.md)]

<!--[!INCLUDE [fluent-bit-3](includes/cross-repo/fluent-bit-3.md)]-->

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Kusto Query Language (KQL) overview](/kusto/query/)
* [Write queries](/kusto/query/tutorials/learn-common-operators?view=azure-data-explorer&preserve-view=true)
