---
title: Query acceleration policy
description: Learn how to use the query acceleration policy to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 09/16/2025
---
# Query acceleration policy

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

An [external table](../query/schema-entities/external-tables.md) is a schema entity that references data stored external to a Kusto database. Queries run over external tables can be less performant than on data that is ingested due to various factors such as network calls to fetch data from storage, the absence of indexes, and more. Query acceleration allows specifying a policy on top of external delta tables. This policy defines the number of days to accelerate data for high-performance queries.

::: moniker range="azure-data-explorer"
Query acceleration is supported in Azure Data Explorer over Azure Data Lake Store Gen2 or Azure blob storage [external tables](external-tables-azure-storage.md).
::: moniker-end

::: moniker range="microsoft-fabric"
Query acceleration is supported in Eventhouse over OneLake, Azure Data Lake Store Gen2, or Azure blob storage [external tables](/fabric/real-time-intelligence/onelake-shortcuts).

To enable query acceleration in the Fabric UI, see [Query acceleration over OneLake shortcuts](https://go.microsoft.com/fwlink/?linkid=2296674).
::: moniker-end

> [!IMPORTANT]
> To troubleshoot problems with query acceleration, see [Troubleshoot query acceleration over external delta tables](query-acceleration-tsg.md).

## Limitations

* The number of columns in the external table can't exceed 900.
* Delta tables with checkpoint V2 aren't supported.
* Query performance over accelerated external delta tables that have more than 2.5 million data files may not be optimal.
* The feature assumes delta tables with static advanced features, for example column mapping doesn't change, partitions don't change, and so on. To change advanced features, first disable the policy, and once the change is made, re-enable the policy.
* Schema changes on the delta table must also be followed with the respective `.alter` external delta table schema, which might result in acceleration starting from scratch if there was breaking schema change.
* Parquet files larger than 1 GB won't be cached.
* Manual edits to the delta table are not allowed and can lead to unexpected results.

> [!NOTE]
> The query acceleration caching operations are limited by the available query acceleration capacity of your cluster. Run the [`.show capacity command`](show-capacity-command.md) to view the total, consumed, and remaining query acceleration capacity.

## Known issues

* Data in the external delta table that's optimized with the [OPTIMIZE](/azure/databricks/sql/language-manual/delta-optimize) function will need to be reaccelerated.
* Frequent MERGE/UPDATE/DELETE operations in delta may result in reacceleration of the updated files. If you run these operations frequently where most of the files in the delta table are touched, this can be equivalent of reacceleration of the entire table.
* The system assumes that all artifacts under the delta table directory have the same access level to the selected users. Different files having different access permissions under the delta table directory might result with unexpected behavior.

## Commands for query acceleration

* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.alter-merge query acceleration policy command](alter-merge-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy-command.md)
* [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
