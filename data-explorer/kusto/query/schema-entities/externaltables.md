---
title: External tables - Azure Data 
r
description: This article describes External tables in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/25/2022
---
# External tables

An **external table** is a Kusto schema entity that references data stored outside the Azure Data Explorer database.

Similar to [tables](tables.md), an external table has a well-defined schema (an ordered list of column name and data type pairs). Unlike tables where data is ingested into Azure Data Explorer cluster, external tables operate on data stored and managed outside Azure Data Explorer cluster.

Supported external data stores are:

* Files stored in Azure Blob Storage or in Azure Data Lake. Most commonly the data is stored in some standard format such as CSV, JSON, Parquet, AVRO, etc. For the list of supported formats, refer to [supported formats](../../../ingestion-supported-formats.md).
* SQL Server table.

See the following ways of creating external tables:

* [Create and alter Azure Storage external tables](../../management/external-tables-azurestorage-azuredatalake.md)
* [Create and alter SQL Server external tables](../../management/external-sql-tables.md)
* [Create external table using Azure Data Explorer web UI Wizard](../../../external-table.md)

An **external table** can be referenced by its name using the [external_table()](../../query/externaltablefunction.md) function.

Use the following commands to manage external tables:

* [`.drop external table`](../../management/drop-external-table.md)
* [`.show external tables`](../../management/show-external-tables.md)
* [`.show external table schema`](../../management/show-external-table-schema.md)

For more information about how to query external tables, and ingested and uningested data, see how to [query data in Azure Data Lake using Azure Data Explorer](../../../data-lake-query-data.md).

**Notes**

* External table names:
  * Case-sensitive.
  * Can’t overlap with Kusto table names.
  * Follow the rules for [entity names](./entity-names.md).
* Maximum limit of external tables per database is 1,000.
* Kusto supports [export](../../management/data-export/export-data-to-an-external-table.md) and [continuous export](../../management/data-export/continuous-data-export.md) to an external table.
* [Data purge](../../concepts/data-purge.md) isn't applied on external tables. Records are never deleted from external tables.
