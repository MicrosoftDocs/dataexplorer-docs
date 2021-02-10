---
title: .create-or-alter materialized view - Azure Data Explorer
description: This article describes .create-or-alter materialized view in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2020
---
# .create-or-alter materialized-view

Creates a materialized view or alters an existing materialized view.

## Limitations

The command has the following limitations:

* See limitations in [alter materialized view limitations](materialized-view-alter.md#alter-materialized-view-limitations).

* The `backfill` property is not supported, in case the materialized view already exists (because if the materialized view already exists, it cannot be backfilled).

Creating a materialized view requires [database admin permission](../management/access-control/role-based-authorization.md). If the materialized view already exists, the [database user](../management/access-control/role-based-authorization.md) who originally created the materialized view is also allowed to alter it.

## Syntax

`.create-or-alter` `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

For more information on arguments and properties, see the [.create materialized-view](materialized-view-create.md) command.

## Example

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```
