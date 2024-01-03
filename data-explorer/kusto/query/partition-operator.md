---
title:  partition operator
description: Learn how to use the partition operator to partition the records of the input table into multiple subtables.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/05/2023
---
# partition operator

The partition operator partitions the records of its input table into multiple subtables according to values in a key column. The operator runs a subquery on each subtable, and produces a single output table that is the union of the results of all subqueries.

This operator is useful when you need to perform a subquery only on a subset of rows that belongs to the same partition key, and not query the whole dataset. These subqueries could include aggregate functions, window functions, top *N* and others.

The partition operator supports several strategies of subquery operation:

* [Native](#native-strategy) - use with an implicit data source with thousands of key partition values.
* [Shuffle](#shuffle-strategy) - use with an implicit source with millions of key partition values.
* [Legacy](#legacy-strategy) - use with an implicit or explicit source for 64 or less key partition values.

## Syntax

*T* `|` `partition` [ `hint.strategy=`*Strategy* ] [ *Hints* ] `by` *Column* `(` *TransformationSubQuery* `)`

*T* `|` `partition` [ `hint.strategy=legacy` ] [ *Hints* ] `by` *Column* `{` *SubQueryWithSource* `}`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The input tabular source.|
| *Strategy* | string | | The value `legacy`, `shuffle`, or `native`. This hint defines the execution strategy of the partition operator.</br></br> If no strategy is specified, the `legacy` strategy is used. For more information, see [Strategies](#strategies). | 
| *Column*| string | &check; | The name of a column in *T* whose values determine how to partition the input tabular source.|
| *TransformationSubQuery*| string | &check; | A tabular transformation expression. The source is implicitly the subtables produced by partitioning the records of *T*. Each subtable is homogenous on the value of *Column*.</br></br> The expression must provide only one tabular result and shouldn't have other types of statements, such as `let` statements.|
| *SubQueryWithSource*| string | &check; | A tabular expression that includes its own tabular source, such as a table reference. This syntax is only supported with the [legacy strategy](#legacy-strategy). The subquery can only reference the key column, *Column*, from *T*. To reference the column, use the syntax `toscalar(`*Column*`)`.</br></br> The expression must provide only one tabular result and shouldn't have other types of statements, such as `let` statements.|
| *Hints*| string | | Zero or more space-separated parameters in the form of: *HintName* `=` *Value* that control the behavior of the operator. See the [supported hints](#supported-hints) per strategy type.

### Supported hints

|Hint name|Type|Strategy|Description|
|--|--|--|--|
|`hint.shufflekey`| string | [shuffle](#shuffle-strategy) | The partition key used to run the partition operator with the `shuffle` strategy. |
|`hint.materialized`| bool | [legacy](#legacy-strategy) | If set to `true`, will materialize the source of the `partition` operator. The default value is `false`. |
|`hint.concurrency`| int | [legacy](#legacy-strategy) | Determines how many partitions to run in parallel. The default value is `16`.|
|`hint.spread`| int | [legacy](#legacy-strategy) | Determines how to distribute the partitions among cluster nodes. The default value is `1`.</br></br> For example, if there are *N* partitions and the spread hint is set to *P*, then the *N* partitions will be processed by *P* different cluster nodes equally in parallel/sequentially depending on the concurrency hint.|

## Returns

The operator returns a union of the results of the individual subqueries.

## Strategies

The partition operator supports several strategies of subquery operation: [native](#native-strategy), [shuffle](#shuffle-strategy), and [legacy](#legacy-strategy).

> [!NOTE]
> The distinction between the `native` and `shuffle` strategies allows the caller to indicate the cardinality and execution strategy of the subquery. This choice may affect how long the subquery takes to complete but doesn't change the end result.

### Native strategy

This strategy should be applied when the number of distinct values of the partition key isn't large, roughly in the thousands.

The subquery must be a tabular transformation that doesn't specify a tabular source. The source is implicit and is assigned according to the subtable partitions. Only certain [supported operators](#supported-operators-for-the-native-and-shuffle-strategies) can be used in the subquery. There's no restriction on the number of partitions.

To use this strategy, specify `hint.strategy=native`.

### Shuffle strategy

This strategy should be applied when the number of distinct values of the partition key is large, in the millions.

The subquery must be a tabular transformation that doesn't specify a tabular source. The source is implicit and is assigned according to the subtable partitions. Only certain [supported operators](#supported-operators-for-the-native-and-shuffle-strategies) can be used in the subquery. There's no restriction on the number of partitions.

To use this strategy, specify `hint.strategy=shuffle`. For more information about shuffle strategy and performance, see [shuffle query](shufflequery.md).

### Supported operators for the native and shuffle strategies

The following list of operators can be used in subqueries with the native or shuffle strategies:

* [count](count-operator.md)
* [distinct](distinct-operator.md)
* [extend](extend-operator.md)
* [make-series](make-series-operator.md)
* [mv-apply](mv-apply-operator.md)
* [mv-expand](mvexpandoperator.md)
* [parse](parse-operator.md)
* [parse-where](parse-where-operator.md)
* [project](project-operator.md)
* [project-away](project-away-operator.md)
* [project-keep](project-keep-operator.md)
* [project-rename](project-rename-operator.md)
* [project-reorder](project-reorder-operator.md)
* [reduce](reduceoperator.md)
* [sample](sampleoperator.md)
* [sample-distinct](sampledistinct-operator.md)
* [scan](scan-operator.md)
* [search](searchoperator.md)
* [serialize](serializeoperator.md)
* [sort](sort-operator.md)
* [summarize](summarizeoperator.md)
* [take](takeoperator.md)
* [top](topoperator.md)
* [top-hitters](tophittersoperator.md)
* [top-nested](topnestedoperator.md)
* [where](whereoperator.md)

> [!NOTE]
> * Operators that reference a table source other than the subtable partitions aren't compatible with the `native` and `shuffle` strategies. For example, [join](join-operator.md), [union](unionoperator.md), [externaldata](externaldata-operator.md), and [evaluate](evaluate-operator.md) (plugins). For such scenarios, resort to the [legacy strategy](#legacy-strategy).
> * The [fork](fork-operator.md) operator isn't supported for any strategy type, as the subquery must return a single tabular result.

### Legacy strategy

For historical reasons, the `legacy` strategy is the default strategy. However, we recommend favoring the [native](#native-strategy) or [shuffle](#shuffle-strategy) strategies, as the `legacy` approach is limited to 64 partitions and is less efficient.

In some scenarios, the `legacy` strategy might be necessary due to its support for including a tabular source in the subquery. In such cases, the subquery can only reference the key column, *Column*, from the input tabular source, *T*. To reference the column, use the syntax `toscalar(`*Column*`)`.

If the subquery is a tabular transformation without a tabular source, the source is implicit and is based on the subtable partitions.

To use this strategy, specify `hint.strategy=legacy` or omit any other strategy indication.

> [!NOTE]
> An error will occur if the partition column, *Column*, contains more than 64 distinct values.

## Examples


### Find top values

In some cases, it's more performant and easier to write a query using the `partition` operator than using the [`top-nested`](topnestedoperator.md) operator. The following query runs a subquery calculating `summarize` and `top` for each `State` starting with `W`: "WYOMING", "WASHINGTON", "WEST VIRGINIA", and "WISCONSIN".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2NsQ6CQBBEe75iOyAhNtZ0WlhjYn2Sjbcm3JHdOQiGj/cEdYtJJvN2pkPU4TxxgBUrzZ6VqYMDk8EpbBZ4Km9lDsfsBRIDeQk4GDRjj6UNDjIx3ZfvY0H5qk0tDYNTeTHtE20fU0BVN3QJz6TC1mak+pmTKPeoP1Ubf11GbvbWrW4lxJGO/9z2rfoN+O3/98UAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where State startswith 'W'
| partition hint.strategy=native by State 
    (
    summarize Events=count(), Injuries=sum(InjuriesDirect) by EventType, State
    | top 3 by Events 
    ) 
```

**Output** 

|EventType|State|Events|Injuries|
|---|---|---|---|
|Hail|WYOMING|108|0|
|High Wind|WYOMING|81|5|
|Winter Storm|WYOMING|72|0|
|Heavy Snow|WASHINGTON|82|0|
|High Wind|WASHINGTON|58|13|
|Wildfire|WASHINGTON|29|0|
|Thunderstorm Wind|WEST VIRGINIA|180|1|
|Hail|WEST VIRGINIA|103|0|
|Winter Weather|WEST VIRGINIA|88|0|
|Thunderstorm Wind|WISCONSIN|416|1|
|Winter Storm|WISCONSIN|310|0|
|Hail|WISCONSIN|303|1|

### Native strategy

The following query returns the top 2 `EventType` values by `TotalInjuries` for each `State` that starts with 'W':

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOsQ7CMAxE936Ft7YLAzsbDMytxJwiixiRpHKurYL68STphAdLp+d78oCg7rayR2x22iwr0wADpgijiJvAUvtoM5xzFkjwZMXjFKH57JXoQt5AVqYpHdWG8nR1x8U5o/JlGgPM5+7fC6twzKWMupJLvIryE30x1F/GNB+WnRBmOhfwL6i0/wEF39OovgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where State startswith 'W'
| partition hint.strategy = native by State
    (
    summarize TotalInjueries = sum(InjuriesDirect) by EventType
    | top 2 by TotalInjueries
    )
```

**Output** 

|EventType|TotalInjueries|
|---|---|
|Tornado|4|
|Hail|1|
|Thunderstorm Wind|1|
|Excessive Heat|0|
|High Wind|13|
|Lightning|5|
|High Wind|5|
|Avalanche|3|

### Shuffle strategy

The following query returns the top 3 `DamagedProperty` values foreach `EpisodeId` and the columns `EpisodeId` and `State`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22OsQ6DMBBDd77iRiohFuZuZeiGxBcEOCAV5KKLQYrUjyewsODBi+0ntxBd650dQvYnbxQWVhzN1qEMUAOe4jvM2zguTF2k2tsgA3+HjJLyyyGeqjP8mNVM3Kh4VsQrS1CVH/e4lwW1SNziqf5KL3rZHA7GAN74mQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| partition hint.strategy=shuffle by EpisodeId
    (
    top 3 by DamageProperty
    | project EpisodeId, State, DamageProperty
    )
| count
```

**Output** 

|Count|
|---|
|22345|

### Legacy strategy with explicit source

The following query runs two subqueries:

* When `x == 1`, the query returns all rows from `StormEvents` that have `InjuriesIndirect == 1`.
* When `x == 2`, the query returns all rows from `StormEvents` that have `InjuriesIndirect == 2`.

The final result is the union of these two subqueries.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAxXMwRGCMBAF0LtV/AqcwXuOHjhbQYxrCCO7zOajZsDehQLe86hZ8MXTbUIHGi6olBndacMcnYXFFENRnis9UnILL8kxNdzbDtcbzafrW5QVGz6D+PGFgF7HxYvUXh/FJfG3j8kW5R+3ariUdAAAAA==" target="_blank">Run the query</a>

```kusto
range x from 1 to 2 step 1
| partition hint.strategy=legacy by x {StormEvents | where x == InjuriesIndirect}
| count 
```

**Output** 

|Count|
|---|
|113|

### Partition reference

The following example shows how to use the [as operator](as-operator.md) to give a "name" to each data partition and then reuse that name within the subquery. This approach is only relevant to the `legacy` strategy.

```kusto
T
| partition by Dim
(
    as Partition
    | extend MetricPct = Metric * 100.0 / toscalar(Partition | summarize sum(Metric))
)
```
