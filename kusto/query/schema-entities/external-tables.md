---
title:  External tables
description:  This article describes External tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# External tables

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

An external table is a schema entity that references data stored external to a Kusto database.

Similar to [tables](tables.md), an external table has a well-defined schema (an ordered list of column name and data type pairs).
:::moniker range="azure-data-explorer"
Unlike tables where data is ingested into your cluster, external tables operate on data stored and managed outside your cluster.
::: moniker-end

Supported external data stores are:

* Files stored in Azure Blob Storage or in Azure Data Lake. Most commonly the data is stored in some standard format such as CSV, JSON, Parquet, AVRO, etc. For the list of supported formats, refer to [supported formats](../../ingestion-supported-formats.md).
* SQL table (SQL Server, MySql, PostgreSql, and Cosmos DB).

See the following ways of creating external tables:

* [Create or alter Azure Blob Storage/ADLS external tables](../../management/external-tables-azure-storage.md)
* [Create or alter delta external tables](../../management/external-tables-delta-lake.md)
* [Create and alter SQL external tables](../../management/external-sql-tables.md)
::: moniker range="azure-data-explorer"
* [Create external table using Azure Data Explorer web UI Wizard](/azure/data-explorer/external-table)
::: moniker-end

An **external table** can be referenced by its name using the [external_table()](../../query/external-table-function.md) function.

Use the following commands to manage external tables:

* [`.drop external table`](../../management/drop-external-table.md)
* [`.show external tables`](../../management/show-external-tables.md)
* [`.show external table schema`](../../management/show-external-table-schema.md)

::: moniker range="azure-data-explorer"
For more information about how to query external tables, and ingested and uningested data, see [Query data in Azure Data Lake using Azure Data Explorer](/azure/data-explorer/data-lake-query-data).
::: moniker-end

> [!NOTE]
>
> * The maximum limit of external tables per database is 1,000.
> * External table names are case-sensitive, and can't overlap with Kusto table names. For more information, see [Identifier naming rules](entity-names.md#identifier-naming-rules).
> * Azure Data Explorer supports [export](../../management/data-export/export-data-to-an-external-table.md) and [continuous export](../../management/data-export/continuous-data-export.md) to an external table.
> * [Data purge](../../concepts/data-purge.md) isn't applied on external tables. Records are never deleted from external tables.
> * [Row level security policy](../../management/row-level-security-policy.md) can't be configured on external tables.
