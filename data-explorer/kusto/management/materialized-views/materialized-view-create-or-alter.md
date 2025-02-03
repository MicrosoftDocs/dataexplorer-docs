---
title:  .create-or-alter materialized view
description:  This article describes `.create-or-alter materialized view`.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/03/2025
---
# .create-or-alter materialized-view

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Creates a materialized view or alters an existing materialized view.

## Permissions

You must have at least [Materialized View Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create-or-alter` `materialized-view` [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] *MaterializedViewName* `on table` *SourceTableName* `{` *Query* `}`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *PropertyName*, *PropertyValue* | `string` |  | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties). |
| *MaterializedViewName* | `string` | :heavy_check_mark: | Name of the materialized view. The view name can't conflict with table or function names in the same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
| *SourceTableName* | `string` | :heavy_check_mark: | Name of source table on which the view is defined. |
| *Query* | `string` | :heavy_check_mark: | Query definition of the materialized view. |

## Supported properties

### New table

If the table is new, the following properties are supported in the `with(`*PropertyName* `=` *PropertyValue* `)`. All properties are optional.

[!INCLUDE [materialized-view-create-properties](../../includes/materialized-view-create-properties.md)]

### Existing table

If the table already exists, only the following subset of properties are supported in the `with(`*PropertyName* `=` *PropertyValue* `)`. All properties are optional.

| Name                      | Type     | Description  |
|---------------------------|--------- |--------|
| lookback | `timespan` | The time span that limits the period during which duplicates or updates are expected. For more information, see [Lookback period](materialized-view-create.md#lookback-period). |
| lookback_column | `string` | A `string` column in the view that serves as the reference for the lookback period. If the `lookback_column` isn't defined, the lookback period is calculated based on [ingestion_time()](../../query/ingestion-time-function.md). If a `lookback_column` is already defined, its value can't be modified. For more information, see [Lookback period](materialized-view-create.md#lookback-period). |
| autoUpdateSchema | `bool` | Whether to automatically update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)`/`arg_min(Timestamp, *)`/`take_any(*)` (only when the column's argument is `*`). If this option is set to `true`, changes to the source table are automatically reflected in the materialized view. |
|--|--|--|
| folder | `string` | The materialized view's folder. |
| docString | `string` | A string that documents the materialized view. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

The examples in this section show how to use the syntax to help you get started.

### Create or alter a materialized view

The following example creates a new materialized view or alters an existing one called `ArgMax` that's based on table `T`. It contains the most recent record based on the `Timestamp` column, for each user from table `T`.

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```

**Output**

| Name | SourceTable | Query | MaterializedTo | LastRun | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime | Lookback |
|--|--|--|--|--|--|--|--|--|--|--|--|--|
| ArgMax | T | T \| summarize arg_max(Timestamp, *) by User | 2023-02-26T16:40:03.3345704Z | 2023-02-26T16:44:15.9033667Z | Completed | true | true |  |  | false | 2023-02-23T14:01:42.5172342Z |  |

## Remarks

If the materialized view doesn't exist, this command behaves just like [.create materialized-view](materialized-view-create.md).

For more information, see the [Query parameter](materialized-view-create.md#query-parameter) and [Properties](materialized-view-create.md#supported-properties) sections.

[!INCLUDE [materialized-view-alter-limitations.md](../../includes/materialized-view-alter-limitations.md)]

## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [.create materialized-view](materialized-view-create.md)
* [.alter materialized-view](materialized-view-alter.md)