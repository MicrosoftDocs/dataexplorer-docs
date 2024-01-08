---
title: Fact and dimension tables - Azure Data Explorer
description: This article describes Fact and dimension tables in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/23/2020
---
# Fact and dimension tables

When designing the schema for an Azure Data Explorer database, think of tables as broadly belonging to one of two categories.
* [Fact tables](https://en.wikipedia.org/wiki/Fact_table)
* [Dimension tables](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)#Dimension_table)

## Fact tables
Fact tables are tables whose records are immutable "facts", such as service logs
and measurement information. Records are progressively appended into the table
in a streaming fashion or in large chunks. The records stay there until they're removed because of cost or because they've lost their value. Records are otherwise never updated.

Entity data is sometimes held in fact tables, where the entity data changes slowly. For example, data about some physical entity, such as a piece of office equipment that infrequently changes location.
Since data in Kusto is immutable, the common practice is to have each table hold two columns:
* An identity (`string`) column that identifies the entity
* A last-modified (`datetime`) timestamp column

Only the last record for each entity identity is then retrieved.

## Dimension tables
Dimension tables:
* Hold reference data, such as lookup tables from an entity identifier to its properties
* Hold snapshot-like data in tables whose entire contents change in a single transaction

Dimension tables aren't regularly ingested with new data. Instead, the entire data content is updated at once, using operations such as [.set-or-replace](../management/data-ingestion/ingest-from-query.md), [.move extents](../management/move-extents.md), or [.rename tables](../management/rename-table-command.md).

Sometimes, dimension tables might be derived from fact tables. This process can be done via an [update policy](../management/update-policy.md) on the fact table, with a query on the table that takes the last record for each entity.

## Differentiate fact and dimension tables

There are processes in Kusto that differentiate between fact tables and dimension tables. 
One of them is [continuous export](../management/data-export/continuous-data-export.md).

These mechanisms are guaranteed to process data in fact tables precisely once. 
They rely on the [database cursor](../management/database-cursor.md) mechanism.

For example, every execution of a continuous export job, exports all records that were ingested since the last update of the database cursor. Continuous export jobs must differentiate between fact tables and dimension tables. Fact tables only process newly ingested data, and dimension tables are used as lookups. As such, the entire table must be taken into account.

There's no way to "mark" a table as being a "fact table" or a "dimension table".
The way data is ingested into the table, and how the table is used, is what identifies its type.