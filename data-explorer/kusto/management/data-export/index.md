---
title: Data export
description: Learn how to export data.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/27/2024
---
# Data export

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Data export involves executing a Kusto query and saving its results. This process can be carried out either on the client side or the service side.

## Export types

For scalable data export, the service offers various `.export` management commands to export query results.
This approach enhances scalability by avoiding the bottleneck of streaming through a single network connection.

**One-time export**

Use a one-time `.export` command to run a query and export its current results to a supported destination. This option is useful for ad hoc exports or exports managed by an external scheduler.

* [Export to cloud storage](export-data-to-storage.md)
* [Export to an external table](export-data-to-an-external-table.md)
* [Export to a SQL table](export-data-to-sql.md)

**Continuous data export**

Continuous export automatically exports newly ingested data to an external table by using a recurring query. This option keeps exported data up to date without requiring you to run each export manually.

* [Continuous data export overview](continuous-data-export.md)

> [!NOTE]
> The `.export` management commands are limited by the available data export capacity of your database. Run the [.show capacity command](../show-capacity-command.md) to view the total, consumed, and remaining data export capacity.

## Related content

* [Export to cloud storage](export-data-to-storage.md)
* [Export to an external table](export-data-to-an-external-table.md)
* [Export to a SQL table](export-data-to-sql.md)
* [Continuous data export overview](continuous-data-export.md)
