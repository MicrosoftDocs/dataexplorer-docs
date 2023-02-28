---
title: .create-or-alter materialized view - Azure Data Explorer
description: This article describes `.create-or-alter materialized view` in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .create-or-alter materialized-view

Creates a materialized view or alters an existing materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Limitations

The command has the following limitations:

* See limitations in [alter materialized view limitations](materialized-view-alter.md#alter-materialized-view-limitations).
* The `backfill` property isn't supported if the materialized view already exists. If the materialized view already exists, it can't be backfilled.

## Syntax

`.create-or-alter` `materialized-view` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] *viewName* `on table` *sourceTableName*
`{`
    &nbsp;&nbsp;&nbsp;&nbsp;*query*
`}`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*ViewName*|string|&check;|The name of the materialized view.|
|*PropertyName*, *PropertyValue*|string||A list of [properties](materialized-view-create.md#properties).|
|*SourceTableName*|string|&check;|The name of the source table on which the view is defined.|
|*Query*|string|&check;|The materialized view query.|

## Example

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```
