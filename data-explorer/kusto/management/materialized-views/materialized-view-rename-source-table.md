---
title: Rename materialized view source table - Azure Data Explorer
description: This article describes how to rename the source table of a materialized view.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 10/17/2021
---

# Rename source table of a materialized view

If a source table of a materialized view is renamed using the [`.rename table`](../rename-table-command.md) command, the materialized view will not be updated with the new name, and view will start failing due to missing source table.

To rename a table, and update all materialized views referencing the table in a transactional way, you can use the following property in the `.rename` command:

`.rename` `table` *OldName* `to` *NewName* `with (updateMaterializedViews=true)`

All materialized views referencing *OldName* will be updated to point to *NewName*, as part of the  [`.rename table`](../rename-table-command.md) command.

> [!NOTE]
> The command will only work if the source table is referenced directly in the materialized view query. If it is referenced from a stored function invoked by the view query, the command will fail, since it cannot update the stored function.
