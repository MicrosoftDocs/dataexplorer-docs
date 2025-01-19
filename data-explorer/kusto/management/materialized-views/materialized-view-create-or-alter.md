---
title:  .create-or-alter materialized view
description:  This article describes `.create-or-alter materialized view`.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/11/2024
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

| Name                            | Type   | Required | Description    |
|---------------------------------|--------|----------|---------|
| *PropertyName*, *PropertyValue* | `string` |          | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties).                                                                                                                        |
| *MaterializedViewName*          | `string` |  :heavy_check_mark:  | Name of the materialized view. The view name can't conflict with table or function names in the same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
| *SourceTableName*               | `string` |  :heavy_check_mark:  | Name of source table on which the view is defined.                                                                                                                                                                                   |
| *Query*                         | `string` |  :heavy_check_mark:  | Query definition of the materialized view.                                                                                                                                                                                                        |

## Supported properties

### New table

If the table is new, the following properties are supported in the `with(`*PropertyName* `=` *PropertyValue* `)`. All properties are optional.

[!INCLUDE [materialized-view-create-properties](../../includes/materialized-view-create-properties.md)]

### Existing table

If the table already exists, only the following subset of properties are supported in the `with(`*PropertyName* `=` *PropertyValue* `)`. All properties are optional.

| Name                      | Type     | Description  |
|---------------------------|--------- |--------|
| lookback | `timespan` | Time span limiting the period of time in which duplicates are expected. (see [Lookback period](../management/extents-overview.md#Lookback-period)). If a lookback_column is defined, the lookback period cannot be increased. |
| lookback_column | `string` | A `datetime` column in the view which serves as the reference for the lookback period (see [Lookback period](../management/extents-overview.md#Lookback-period)). If a lookback_column is already defined, the lookback_column name cannot be modified. |
| autoUpdateSchema          | `bool` | Whether to automatically update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)`/`arg_min(Timestamp, *)`/`take_any(*)` (only when the column's argument is `*`). If this option is set to `true`, changes to the source table will be automatically reflected in the materialized view.       |
| dimensionTables           | array    | A dynamic argument that includes an array of dimension tables in the view. See [Query parameter](materialized-view-create.md#query-parameter).      |
| folder                    | `string` | The materialized view's folder.          |
| docString                 | `string` | A string that documents the materialized view.       |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Create or alter a materialized view

The following command creates a new or alters an existing materialized view called ArgMax:

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```

**Output**

| Name   | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ArgMax | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |

## Remarks

If the materialized view does not exist, this command behaves just like [.create materialized-view](materialized-view-create.md).

For more information, see the [Query parameter](materialized-view-create.md#query-parameter) and [Properties](materialized-view-create.md#supported-properties) sections.

[!INCLUDE [materialized-view-alter-limitations.md](../../includes/materialized-view-alter-limitations.md)]
