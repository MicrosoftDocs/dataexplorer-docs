---
title: .create-or-alter materialized view - Azure Data Explorer
description: This article describes `.create-or-alter materialized view` in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/08/2020
---
# .create-or-alter materialized-view

Creates a materialized view or alters an existing materialized view.

## Permissions

This command requires [Database Admin or Materialized View Admin](../access-control/role-based-access-control.md) permissions.

## Limitations

The command has the following limitations:

* See limitations in [alter materialized view limitations](materialized-view-alter.md#alter-materialized-view-limitations).
* The `backfill` property isn't supported if the materialized view already exists. If the materialized view already exists, it cannot be backfilled.

## Syntax

`.create-or-alter` `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

For more information on arguments and properties, see the [`.create materialized-view`](materialized-view-create.md) command.

## Example

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```
