---
title:  Alter materialized view
description:  This article describes how to Alter materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/03/2025
---
# .alter materialized-view

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Altering the [materialized view](materialized-view-overview.md) can be used for changing the query of a materialized view, while preserving the existing data in the view.

> [!WARNING]
> Be extra cautious when altering a materialized view. Incorrect use might lead to data loss.

## Permissions

You must have at least [Materialized View Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] *MaterializedViewName* `on table` *SourceTableName*  `{`  *Query* `}`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *PropertyName*, *PropertyValue* | `string` |  | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties). |
| *MaterializedViewName* | `string` | :heavy_check_mark: | Name of the materialized view. |
| *SourceTableName* | `string` | :heavy_check_mark: | Name of source table on which the view is defined. |
| *Query* | `string` | :heavy_check_mark: | Query definition of the materialized view. |

## Supported properties

The following properties are supported in the `with` `(`*PropertyName* `=` *PropertyValue*`)` clause. All properties are optional.

| Name | Type | Description |
|--|--|--|
| lookback | `timespan` | The time span that limits the period during which duplicates or updates are expected. For more information, see [Lookback period](materialized-view-create.md#lookback-period). |
| lookback_column | `string` | A `string` column in the view that serves as the reference for the lookback period. If the `lookback_column` isn't defined, the lookback period is calculated based on [ingestion_time()](../../query/ingestion-time-function.md). If a `lookback_column` is already defined, its value can't be modified. For more information, see [Lookback period](materialized-view-create.md#lookback-period). |
| autoUpdateSchema | `bool` | Whether to automatically update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)`/`arg_min(Timestamp, *)`/`take_any(*)` (only when the column's argument is `*`). If this option is set to `true`, changes to the source table are automatically reflected in the materialized view. |
| dimensionTables | array | A dynamic argument that includes an array of dimension tables in the view. See [Query parameter](materialized-view-create.md#query-parameter). |
| folder | `string` | The materialized view's folder. |
| docString | `string` | A string that documents the materialized view. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

The examples in this section show how to use the syntax to help you get started.

### Modify the query definition of a materialized view

The following command modifies the query definition of materialized view MyView:

```kusto
.alter materialized-view MyView on table MyTable
{
    MyTable | summarize arg_max(Column3, *) by Column1
}
```

**Output**

| Name | SourceTable | Query | MaterializedTo | LastRun | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime | Lookback |
|--|--|--|--|--|--|--|--|--|--|--|--|--|
| MyView | MyTable | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z | 2023-02-26T16:44:15.9033667Z | Completed | true | true |  |  | false | 2023-02-23T14:01:42.5172342Z |  |

## Use cases

* Add aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
* Change operators other than the summarize operator. For example, filter out some records by altering  `T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`.
* Alter with no change to the query because of a change in source table. For example, assume a view of `T | summarize arg_max(Timestamp, *) by Id`, which isn't set to `autoUpdateSchema` (see [`.create materialized-view`](materialized-view-create.md) command). If a column is added or removed from the source table of the view, the view is automatically disabled. Execute the alter command, with the exact same query, to change the materialized view's schema to align with new table schema. The view still must be explicitly enabled following the change, using the [enable materialized view](materialized-view-enable-disable.md) command.

[!INCLUDE [materialized-view-alter-limitations.md](../../includes/materialized-view-alter-limitations.md)]

## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [.create materialized-view](materialized-view-create.md)
* [.create-or-alter materialized-view](materialized-view-create-or-alter.md)