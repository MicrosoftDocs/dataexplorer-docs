---
title: Query acceleration policy
description: Learn how to use the query acceleration policy to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 10/10/2024
---
# Query acceleration policy

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Query acceleration allows specifying a policy on top of external delta tables to define the number of days to cache for high-performance queries.

## Add heading here

Running queries on external tables is typically slow due to various factors such as network calls to fetch data from storage, the absence of indexes, and more. The query acceleration policy allows you to set a policy on top of external delta tables to define the number of days to cache to improve query performance.

::: moniker range="azure-data-explorer"
Query acceleration is supported in Azure Data Explorer over Azure Data Lake Store Gen1 or Azure blob storage [external tables](external-tables-azure-storage.md).
::: moniker-end

::: moniker range="microsoft-fabric"
Query acceleration is supported in Eventhouse over OneLake, Azure Data Lake Store Gen1, or Azure blob storage [external tables](/fabric/real-time-intelligence/onelake-shortcuts).
::: moniker-end

## Limitations

* The number of columns in external table must not exceed 900.
* Delta tables should include column statistics. 
* Delta tables shouldn't include partitions. 
* The feature assumes delta tables with static advanced features, that is - column mapping that doesn’t change, partitions that don’t change, etc. If you must do so – first disable the policy, and once the change is made, re-enable the policy. 
* Schema changes on the delta table must also be followed with the respective `. alter` external delta table schema, which might result in acceleration starting from scratch if there was breaking schema change. 
* Catalog prefiltering doesn't support pruning external table partitions. 
* The maximum individual parquet file size is 6 GB (uncompressed).
::: moniker range="azure-data-explorer"
* Query acceleration isn't supported for external tables with impersonation authentication 
::: moniker-end

## Known issues

* OPTIMIZE scenario is currently not optimal for acceleration – it results in reaccelerating all data. 
* Data files that are constantly rewritten (that is, deleted and readded to the delta file) might cause other artifacts to be retrieved externally. 
* The system assumes that all artifacts under the delta table directory should have the same access level to the selected users, for example, different files having different access permissions under the delta table directory might behave unexpectedly. 

## Related content

* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy.md)