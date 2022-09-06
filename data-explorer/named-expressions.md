---
title: Named expressions in Azure Data Explorer
description: Learn how to optimally use named expressions in Azure Data Explorer.
ms.reviewer: zivc
ms.topic: reference
ms.date: 09/04/2022

---
# Named expressions

This article discusses how to optimize repeat use of named expressions in a query.

In Kusto Query Language, you can bind names to complex expressions in several different ways:

* In a [let statement](kusto/query/letstatement.md)
* In the [as operator](kusto/query/asoperator.md)
* In the formal argument list of [user-defined functions](kusto/query/functions/user-defined-functions.md)

When you reference these named expressions in a query, the following steps occur:
1. The calculation within the named expression is evaluated. This calculation produces either a scalar or tabular value.
1. The named expression is replaced with the calculated value.

If the same bound name is used multiple times, then the underlying calculation will be repeated multiple times. When is this a concern?

* When the calculations consume many resources and is used many times.
* When the calculation is non-deterministic, but the query assumes all invocations to return the same value.

## Mitigation

To mitigate these concerns, you can materialize the calculation results in memory during the query. Depending on the way the named calculation is defined, you'll use different materialization strategies:

* **let statements and function arguments**: Use the [materialize()](kusto/query/materializefunction.md) function.
* **as operator**: Set the `hint.materialized` hint value to `true`.

## Example

For example, the following query uses the non-deterministic [sample operator](kusto/query/sampleoperator.md):

> [!NOTE]
> Tables aren't sorted in general, so any table reference in a query is, by definition, non-deterministic.

### Behavior without using the materialize function

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 100 step 1
| sample 1
| as T
| union T
```

**Output:**

|x|
|---|
|63|
|92|

### Behavior using the materialize function

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 100 step 1
| sample 1
| as hint.materialized=true T
| union T
```

**Output:**

|x|
|---|
|95|
|95|
