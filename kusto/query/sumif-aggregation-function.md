---
title:  sumif() (aggregation function)
description: Learn how to use the sumif() (aggregation function) function to calculate the sum of an expression value in records for which the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# sumif() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sum of *expr* in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

You can also use the [sum()](sum-aggregation-function.md) function, which sums rows without predicate expression.

## Syntax

`sumif(`*expr*`,`*predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *predicate* | `string` |  :heavy_check_mark: | The expression used to filter rows. If the predicate evaluates to `true`, the row will be included in the result.|

## Returns

Returns the sum of *expr* for which *predicate* evaluates to `true`.

## Example showing the sum of damages based on no casualty count

This example shows the sum total damage for storms without casualties.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXBJzE1MT/XLd04sLk3MKclMLbYFSmamaWhAZJyL8guKtSHsACA7taikUlNHwyU1sSSj2CWzKDW5RBvC8cxLAXM1bW0NNBWSKhWCSxJLUgF0hdWZeAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize DamageNoCasualties=sumif((DamageCrops+DamageProperty),(DeathsDirect+DeathsIndirect)==0) by State
```

**Output**

The results table shown includes only the first 10 rows.

| State                | DamageNoCasualties |
| -------------------- | ------------------ |
| TEXAS                | 242638700          |
| KANSAS               | 407360000          |
| IOWA                 | 135353700          |
| ILLINOIS             | 120394500          |
| MISSOURI             | 1096077450         |
| GEORGIA              | 1077448750         |
| MINNESOTA            | 230407300          |
| WISCONSIN            | 241550000          |
| NEBRASKA             | 70356050           |
| NEW YORK             | 58054000           |
| ... | ... |

## Example showing the sum of birth dates

This example shows the sum of the birth dates for all names that have more than 4 letters.

```kusto
let T = datatable(name:string, day_of_birth:long)
[
   "John", 9,
   "Paul", 18,
   "George", 25,
   "Ringo", 7
];
T
| summarize sumif(day_of_birth, strlen(name) > 4)
```

**Output**

|sumif_day_of_birth|
|----|
|32|
