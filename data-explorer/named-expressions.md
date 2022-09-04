---
title: Named expressions in Azure Data Explorer
description: Learn how to optimally use named expressions in Azure Data Explorer.
ms.reviewer: zivc
ms.topic: reference
ms.date: 09/04/2022

---
# Named expressions

In Kusto Query Language, you can bind names to complex expressions in a number of different ways:

* In a [let statement](kusto/query/letstatement.md)
* In the [as operator](kusto/query/asoperator.md)
* In the formal argument list of [user-defined functions](kusto/query/functions/user-defined-functions.md)

The calculation can then be evaluated and replaced by the resulting
value (be it a scalar value or a tabular value) by referencing the named expression.

If the same bound name is used multiple times, then it's possible that
the underlying calculation will be repeated multiple times. In most cases,
this is not a concern. However, in two scenarios users need to be aware
of this behavior:

* When the complex calculations consumes a lot of resources and is used
   many times.
* When the complex calculation is non-deterministic, but the query assumes
   all invocations to return the same value.

    For example, the following query uses the [sample operator](kusto/query/sampleoperator.md) and is therefore non-deterministic:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 100 step 1
| sample 1
| as T
| union T
```

|x|
|---|
|63|
|92|

(Please note that tables are not sorted in general, so any table reference in
a query is by-definition non-deterministic.)

In cases where the behavior above is not desired, it's possible to indicate that
the results of the calculation be materialized in memory for the duration of the
query. The way to do this differs depending on how the named calculation is defined:

1. In let statements and function arguments, use the [materialize()](kusto/query/materializefunction.md) function.

1. When using the as operator, be sure to set the `hint.materialized` hint value
   to `true`.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 100 step 1
| sample 1
| as hint.materialized=true T
| union T
```

|x|
|---|
|95|
|95|
