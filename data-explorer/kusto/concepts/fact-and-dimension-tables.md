---
title: Fact and dimension tables - Azure Data Explorer | Microsoft Docs
description: This article describes Fact and dimension tables in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/19/2020
---
# Fact and dimension tables

When designing the schema for a Kusto database, it's useful to think of tables
as broadly belonging to one of two categories:
* [Fact tables](https://en.wikipedia.org/wiki/Fact_table) and
* [Dimension tables](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)#Dimension_table).

**Fact tables** are tables whose records are immutable "facts", such as service logs
and measurements information. Records are appended into the table progressively
(in a streaming fashion or in large chunks), and are kept there until they have to be removed
for cost reasons or because they lose their value. Records are otherwise never updated.

**Dimension tables** hold reference data (such as lookup tables from an entity
identifier to its properties), and snapshot-like data (tables whose entire
contents changes in a single transaction). Usually, such tables are not regularly
ingested with new data. Instead, the entire data content is updated at once
using operations such as [.set-or-replace](../management/data-ingestion/ingest-from-query.md),
[.move extents](../management/extents-commands.md#move-extents),
or [.rename tables](../management/rename-table-command.md).
In some cases, dimension tables might be derived from fact tables via an [update policy](../management/updatepolicy.md) on the fact table, plus
some query over the table that takes the last record for each entity.

It's important to realize that there's no way to "mark" a table in Kusto as being
a fact table or a dimension table. How data is ingested into the
table and how the tables is used is what's important.

> [!NOTE]
> Sometimes, Kusto is used to hold entity data in fact tables, such that the entity
> data changes slowly. For example, data regarding some physical entity (say,
> a piece of office equipment) which changes location infrequently.
> As data in Kusto is immutable, the common practice is to have each table hold
> two columns: an identity (`string`) column that identifies the entity, and a last-modified
> (`datetime`) timestamp column. Only the last record for each entity identity
> is then retrieved.



## Commands that differentiate fact and dimension tables

There are processes in Kusto that differentiate between fact tables and
dimension tables. 
* [continuous export](../management/data-export/continuous-data-export.md)
<#ifdef MICROSOFT>* [Materialized views](../management/materialized-views.md)