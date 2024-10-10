---
title: Query acceleration policy
description: Learn how to use the query acceleration policy to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 10/10/2024
---
# Query acceleration policy

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

## Add heading here

Running queries on external tables is typically slow due to various factors such as network calls to fetch data from storage, the absence of indexes, and more.  Customers who are used to running performant queries on top of ingested data in Kusto, desire to have similar performance on top of external tables without going through the hassle of managing the ingestion pipeline. 

The query acceleration policy allows customers to set a policy on top of external delta tables to define the number of days to cache. Behind the scenes, Kusto continuously indexes and caches the data for that period, allowing customers to run performant queries on top. 

::: moniker range="azure-data-explorer"

Query acceleration is supported by Azure Data Explorer over ADLSgen2/blob storage.

::: moniker-end

::: moniker range="microsoft-fabric"

Query acceleration is supported by in Eventhouse over OneLake/ADLSgen2/blob storage.

::: moniker-end

## Related content

* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy.md)