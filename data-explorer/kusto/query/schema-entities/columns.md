---
title:  Columns
description: This article describes Columns in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/13/2020
---
# Columns

Columns are named entities that have a [scalar data type](../scalar-data-types/index.md). Columns are referenced in the query relative to the tabular data stream that is in context of the specific operator referencing them.Every [table](tables.md) in Kusto, and every tabular data stream, is a rectangular grid of columns and rows. The columns of a table or a tabular data stream are ordered, so a column also has a specific position in the table's collection of columns.

> [!NOTE]
>
> * The maximum limit of columns per table is 10,000.
> * Column names are case-sensitive. For more information, see [Identifier naming rules](entity-names.md#identifier-naming-rules).
> * Columns are sometimes called **attributes** and rows are sometimes called **records**.

## Reference columns in queries

In queries, columns are generally referenced by name only. They can only appear in expressions, and the query operator under which the expression appears determines the table or tabular data stream. The column's name doesn't need to be scoped further.

For example, in the following query we have an unnamed tabular data stream that is defined through the [datatable operator](../datatableoperator.md) and has a single column, `c`. The tabular data stream is filtered by a predicate on the value of that column, and produces a new unnamed tabular data stream with the same columns but fewer rows. The [as operator](../asoperator.md) then names the tabular data stream, and its value is returned as the results of the query. Notice how column `c` is referenced by name without referencing its container:

```kusto
datatable (c:int) [int(-1), 0, 1, 2, 3]
| where c*c >= 2
| as Result
```

## Related content

* [Manage columns](../../management/columns.md).
