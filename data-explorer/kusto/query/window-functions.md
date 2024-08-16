---
title:  Window functions
description: Learn how to use window functions on rows in a serialized set.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/02/2023
---
# Window functions overview

Window functions operate on multiple rows (records) in a row set at a time. Unlike aggregation functions, window functions require that the rows in the row set be serialized (have a specific order to them). Window functions may depend on the order to determine the result.

Window functions can only be used on serialized sets. The easiest way to serialize a row set is to use the [serialize operator](./serialize-operator.md). This operator "freezes" the order of rows in an arbitrary manner. If the order of serialized rows is semantically important, use the [sort operator](./sort-operator.md) to force a particular order.

The serialization process has a non-trivial cost associated with it. For example, it might prevent query parallelism in many scenarios. Therefore, don't apply serialization unnecessarily. If necessary, rearrange the query to perform serialization on the smallest row set possible.

## Serialized row set

An arbitrary row set (such as a table, or the output of a tabular operator) can
be serialized in one of the following ways:

1. By sorting the row set. See below for a list of operators that emit sorted
   row sets.
2. By using the [serialize operator](./serialize-operator.md).

Many tabular operators serialize output whenever the input is already serialized, even if the operator doesn't itself guarantee that the result is serialized. For example, this property is guaranteed for the [extend operator](./extend-operator.md), the [project operator](./project-operator.md), and the [where operator](./where-operator.md).

## Operators that emit serialized row sets by sorting

* [sort operator](./sort-operator.md)
* [top operator](./top-operator.md)
* [top-hitters operator](./top-hitters-operator.md)

## Operators that preserve the serialized row set property

* [extend operator](./extend-operator.md)
* [mv-expand operator](./mv-expand-operator.md)
* [parse operator](./parse-operator.md)
* [project operator](./project-operator.md)
* [project-away operator](./project-away-operator.md)
* [project-rename operator](./project-rename-operator.md)
* [take operator](./take-operator.md)
* [where operator](./where-operator.md)
