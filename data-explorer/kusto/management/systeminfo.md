---
title: System information
description: Learn how to use system information commands available to database admins and database monitors to explore usage, track operations and investigate ingestion failures.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/21/2023
---
# System information

This section summarizes commands that are available to `Database Admins` and `Database Monitors` roles to explore usage, track operations and investigate ingestion failures.

* [`.show queries`](queries.md) - displays information on completed and running queries.
* [`.show capacity`](show-capacity-command.md) - displays an estimated capacity for various cluster resources.
* [`.show commands`](commands.md) - displays information on completed commands and their resources utilization.
* [`.show commands-and-queries`](commands-and-queries.md) - displays information on completed commands and queries, and their resources utilization.
* [`.show journal`](journal.md) - displays history of the metadata operations.
* [`.show operations`](operations.md) - displays administrative operations both running and completed, since Admin node was last elected.
* [`.show ingestion failures`](ingestionfailures.md) - displays information on failures encountered during data ingestion to the cluster.
* [`.show table details`](estimate-table-size.md) - displays information on table size and other table statistics.
* [`.show table data statistics`](show-table-data-statistics.md) - displays table data statistics per column.
