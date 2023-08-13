---
title: Tables management
description: Learn how to use table management commands to display, create, and alter tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/23/2023
---
# Tables management

This topic discusses the life cycle of tables and associated management commands that are helpful for exploring, creating and altering tables.

Select the links in the table below for more information about them.

| Commands | Operation|
|---|---|
| [`.alter table docstring`](alter-table-docstring-command.md), [`.alter table folder`](alter-table-folder-command.md) | Manage table display properties |
| [`.create ingestion mapping`](create-ingestion-mapping-command.md), [`.show ingestion mappings`](show-ingestion-mapping-command.md), [`.alter ingestion mapping`](alter-ingestion-mapping-command.md), [`.drop ingestion mapping`](drop-ingestion-mapping-command.md) | Manage ingestion mapping |
| [`.create tables`](create-tables-command.md), [`.create table`](create-table-command.md), [`.alter table`](alter-table-command.md), [`.alter-merge table`](alter-table-command.md), [`.drop tables`](drop-table-command.md), [`.drop table`](drop-table-command.md), [`.undo drop table`](undo-drop-table-command.md), [`.rename table`](rename-table-command.md) | Create/modify/drop tables  |
| [`.show tables`](show-tables-command.md) [`.show table details`](show-table-details-command.md)[`.show table schema`](show-table-schema-command.md)   | Enumerate tables in a database  |
| `.ingest`, `.set`, `.append`, `.set-or-append` (see [Data Ingestion](../../ingest-data-overview.md#ingest-management-commands) for details).  | Data ingestion into a table     |
| [`.clear table data`](clear-table-data-command.md) | Clears all the data of a table  |

## CRUD naming conventions for tables

(See full details in the sections linked to in the table, above.)

| Command syntax                             | Semantics                                                                                                             |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `.create entityType entityName ...`        | If an entity of that type and name exists, returns the entity. Otherwise, create the entity.                          |
| `.create-merge entityType entityName...`   | If an entity of that type and name exists, merge the existing entity with the specified entity. Otherwise, create the entity. |
| `.alter entityType entityName ...`         | If an entity of that type and name does not exist, error. Otherwise, replace it with the specified entity.            |
| `.alter-merge entityType entityName ...`   | If an entity of that type and name does not exist, error. Otherwise, merge it with the specified entity.              |
| `.drop entityType entityName ...`          | If an entity of that type and name does not exist, error. Otherwise, drop it.                                         |
| `.drop entityType entityName ifexists ...` | If an entity of that type and name does not exist, return. Otherwise, drop it.                                        |

> [!NOTE]
> "Merge" is a logical merge of two entities:
>
> * If a property is defined for one entity but not the other, it appears with its original value in the merged entity.
> * If a property is defined for both entities and has the same value in both, it appears once with that value in the merged entity.
> * If a property is defined for both entities but has different values, an error is raised.
