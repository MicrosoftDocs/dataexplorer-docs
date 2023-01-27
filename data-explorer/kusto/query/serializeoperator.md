---
title: serialize operator - Azure Data Explorer
description: Learn how to use the serialize operator to mark the input row set as serialized and ready for window functions.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/22/2023
---
# serialize operator

Marks that the order of the input row set is safe to use for window functions.

The operator has a declarative meaning. It marks the input row set as serialized (ordered), so that [window functions](./windowsfunctions.md) can be applied to it. It does not sort the input row set. 

```kusto
T | serialize rn=row_number()
```

## Syntax

`serialize` [*Name1* `=` *Expr1* [`,` *Name2* `=` *Expr2*]...]

* The *Name*/*Expr* pairs are similar to those pairs in the [extend operator](./extendoperator.md). Following the same behaviour, an un-aliased expression will be  automatically named and a bare column will make no change to the output row set. 

## Example

```kusto
Traces
| where ActivityId == "479671d99b7b"
| serialize

Traces
| where ActivityId == "479671d99b7b"
| serialize rn = row_number()
```

The output row set of the following operators is marked as serialized.

[range](./rangeoperator.md), [sort](./sort-operator.md), [top](./topoperator.md), [top-hitters](./tophittersoperator.md), [getschema](./getschemaoperator.md).

The output row set of the following operators is marked as non-serialized.

[sample](./sampleoperator.md), [sample-distinct](./sampledistinctoperator.md), [distinct](./distinctoperator.md), [join](./joinoperator.md), 
[top-nested](./topnestedoperator.md), [count](./countoperator.md), [summarize](./summarizeoperator.md), [facet](./facetoperator.md), [mv-expand](./mvexpandoperator.md), 
[evaluate](./evaluateoperator.md), [reduce by](./reduceoperator.md), [make-series](./make-seriesoperator.md)

All other operators preserve the serialization property. 
If the input row set is serialized, then the output row set is also serialized.
