---
title: Query acceleration policy (preview)
description: Learn how to use the query acceleration policy to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 11/19/2024
---
# Query acceleration policy (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

An [external table](../query/schema-entities/external-tables.md) is a schema entity that references data stored external to a Kusto database. Queries run over external tables can be less performant than on data that is ingested due to various factors such as network calls to fetch data from storage, the absence of indexes, and more. Query acceleration allows specifying a policy on top of external delta tables. This policy defines a number of days to accelerate data for high-performance queries.

::: moniker range="azure-data-explorer"
Query acceleration is supported in Azure Data Explorer over Azure Data Lake Store Gen2 or Azure blob storage [external tables](external-tables-azure-storage.md).
::: moniker-end

::: moniker range="microsoft-fabric"
Query acceleration is supported in Eventhouse over OneLake, Azure Data Lake Store Gen2, or Azure blob storage [external tables](/fabric/real-time-intelligence/onelake-shortcuts).

To enable query acceleration in the Fabric UI, see [Query acceleration over OneLake shortcuts](https://go.microsoft.com/fwlink/?linkid=2296674).
::: moniker-end

## Limitations

* The number of columns in the external table can't exceed 900.
* Delta tables with checkpoint V2 are not supported.
* Query performance over accelerated external delta tables which have partitions may not be optimal during preview.
* The feature assumes delta tables with static advanced features, for example column mapping doesn't change, partitions don't change, and so on. To change advanced features, first disable the policy, and once the change is made, re-enable the policy.
* Schema changes on the delta table must also be followed with the respective `.alter` external delta table schema, which might result in acceleration starting from scratch if there was breaking schema change.
* Index-based pruning isn't supported for partitions.
* Parquet files with a size higher than 1 GB won't be cached.
::: moniker range="azure-data-explorer"
* Query acceleration isn't supported for external tables with impersonation authentication.
::: moniker-end

## Known issues

* Data in the external delta table that is optimized with the [OPTIMIZE](/azure/databricks/sql/language-manual/delta-optimize) function will need to be reaccelearted.
* If you run frequent MERGE/UPDATE/DELETE operations in delta, the underlying parquet files may be rewritten with changes and Kusto will skip accelerating such files, causing retrieval during query time.
* The system assumes that all artifacts under the delta table directory have the same access level to the selected users. Different files having different access permissions under the delta table directory might result with unexpected behavior.

## Commands for query acceleration

* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy-command.md)
* [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
