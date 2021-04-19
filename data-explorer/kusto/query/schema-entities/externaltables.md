---
title: External tables - Azure Data Explorer | Microsoft Docs
description: This article describes External tables in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 01/22/2020
---
# External tables

An **external table** is a Kusto schema entity that references data stored outside the Azure Data Explorer database.

Similar to [tables](tables.md), an external table has a well-defined schema (an ordered list of column name and data type pairs). Unlike tables, data is stored and managed outside the cluster. Most commonly the data is stored in some standard format such as CSV, Parquet, Avro, and isn't ingested by Azure Data Explorer.

An **external table** is created once. See the following commands for external table creation:
* [External table general control commands](../../management/external-table-commands.md)
* [Create and alter external SQL tables](../../management/external-sql-tables.md)
* [Create and alter tables in Azure Storage or Azure Data Lake](../../management/external-tables-azurestorage-azuredatalake.md)
* [Create an external table](../../../external-table.md)

An **external table** can be referenced by its name using the [external_table()](../../query/externaltablefunction.md) function. 

**Notes**

* External table names:
   * Case-sensitive.
   * Can’t overlap with Kusto table names.
   * Follow the rules for [entity names](./entity-names.md).
* Maximum limit of external tables per database is 1,000.
* Kusto supports [export](../../management/data-export/export-data-to-an-external-table.md) and [continuous export](../../management/data-export/continuous-data-export.md) to an external table, and [querying external tables](../../../data-lake-query-data.md).
* [Data purge](../../concepts/data-purge.md) isn't applied on external tables. Records are never deleted from external tables.