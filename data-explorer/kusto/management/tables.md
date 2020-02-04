---
title: Tables management - Azure Data Explorer | Microsoft Docs
description: This article describes Tables management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/02/2020
---
# Tables management

This topic discusses the life cycle of tables and associated control commands.

Select the links in the table below for more information about them.

| Commands                                                                                                                 | Operation                       |
|--------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| [`.alter table docstring`](altertabledocstring.md), [`.alter table folder`](/altertablefolder.md)                                                                                                                                                                                                   | Manage table display properties |
| [`.create ingestion mapping`](/createingestionmapping.md), [`.show ingestion mappings`](/showingestionmapping.md), [`.alter ingestion mapping`](/alteringestionmapping.md), [`.drop ingestion mapping`](/dropingestionmapping.md)                                                                    | Manage ingestion mapping        |
| [`.create tables`](/createtables.md), [`.create table`](/createtable.md), [`.alter table`](/altertable.md), [`.alter-merge table`](altermergetable.md), [`.drop tables`](/droptable.md), [`.drop table`](/droptable.md), [`.undo drop table`](/undodroptable.md), [`.rename table`](/renametable.md) | Create/modify/drop tables       |
| [`.show tables`](/showtables.md)                                                                                        | Enumerate tables in a database  |
| `.ingest`, `.set`, `.append`, `.set-or-append` (see [Data Ingestion](./data-ingestion/index.md) for details).)                                                                                                                                                                                      | Data ingestion into a table     |

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