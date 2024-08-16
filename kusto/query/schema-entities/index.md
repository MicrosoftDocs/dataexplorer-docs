---
title:  Entities
description:  This article describes Entities.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Entity types

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Kusto queries execute in the context of a Kusto database. Data in the database is arranged in tables, which the query may reference, and within the table it is organized as a rectangular grid of columns and rows. Additionally, queries may reference stored functions in the database, which are query fragments made available for reuse.
:::moniker range="azure-data-explorer"
* Clusters are entities that hold databases. Clusters have no name, but they can be referenced by using the `cluster()` special function with the cluster's URI. For example, `cluster("https://help.kusto.windows.net")` is a reference to a cluster that holds the `Samples` database.
::: moniker-end
* [Databases](databases.md) are named entities that hold tables and stored functions. All Kusto queries run in the context of some database, and the entities of that database may be referenced by the query with no qualifications. Additionally, other databases may be referenced using the [database() special function](../database-function.md). For example, `cluster("https://help.kusto.windows.net").database("Samples")` is a universal reference to a specific database.

* [Tables](tables.md) are named entities that hold data. A table has an ordered set of columns, and zero or more rows of data, each row holding one data value for each of the columns of the table. Tables may be referenced by name only if they are in the database in context of the query, or by qualifying them with a database reference otherwise. For example, `cluster("https://help.kusto.windows.net").database("Samples").StormEvents` is a universal reference to a particular table in the `Samples` database. Tables may also be referenced by using the [table() special function](../table-function.md).

* [Columns](columns.md) are named entities that have a [scalar data type](../scalar-data-types/index.md). Columns are referenced in the query relative to the tabular data stream that is in context of the specific operator referencing them.

* [Stored functions](stored-functions.md) are named entities that allow reuse of Kusto queries or query parts.

* [Views](views.md) are virtual tables based on functions (stored or defined in an ad-hoc fashion).

* [External tables](external-tables.md) are entities that reference data stored outside Kusto database. External tables are used for exporting data from Kusto to external storage as well as for querying external data without ingesting it into Kusto.

## Related content

* [Entity names](entity-names.md).
