---
title: preview plugin - Azure Data Explorer
description: Learn how to use the preview plugin to return two tables, one with the specified number of rows, and the other with the total number of records. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/12/2023
---
# preview plugin

Returns a table with up to the specified number of rows from the input record set, and the total number of records in the input record set.

```kusto
T | evaluate preview(50)
```

## Syntax

`T` `|` `evaluate` `preview(` *NumberOfRows* `)`

## Returns

The `preview` plugin returns two result tables:

* A table with up to the specified number of rows.
  For example, the sample query above is equivalent to running `T | take 50`.
* A table with a single row/column, holding the number of records in the
  input record set.
  For example, the sample query above is equivalent to running `T | count`.

> [!TIP]
> If `evaluate` is preceded by a tabular source that includes a complex filter, or a filter that references most of the source table columns, prefer to use the [`materialize`](materializefunction.md) function. For example:

```kusto
let MaterializedT = materialize(T);
MaterializedT | evaluate preview(50)
```
