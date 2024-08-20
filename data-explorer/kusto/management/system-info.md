---
title: System information
description: Learn how to use system information commands available to database admins and database monitors to explore usage, track operations and investigate ingestion failures.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# System information

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This section summarizes commands that are available to Database Admins and Database Monitors to explore usage, track operations, and investigate ingestion failures. For more information on security roles, see [Kusto role-based access control](../access-control/role-based-access-control.md).

* [`.show journal`](journal.md) - displays history of the metadata operations.
* [`.show operations`](show-operations.md) - displays administrative operations both running and completed, since Admin node was last elected.
* [`.show queries`](show-queries-command.md) - displays information on completed and running queries.
* [`.show commands`](show-commands.md) - displays information on completed commands and their resources utilization.
* [`.show commands-and-queries`](commands-and-queries.md) - displays information on completed commands and queries, and their resources utilization.
* [`.show ingestion failures`](ingestion-failures.md) - displays information on failures encountered during data ingestion.
* [`.show table details`](estimate-table-size.md) - displays information on table size and other table statistics.
* [`.show table data statistics`](show-table-data-statistics.md) - displays table data statistics per column.
