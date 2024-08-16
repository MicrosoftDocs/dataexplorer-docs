---
title:  case()
description: Learn how to use the case() function to evaluate a list of predicates and return the first expression for which the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# case()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Evaluates a list of predicates and returns the first result expression whose predicate is satisfied.

If none of the predicates return `true`, the result of the `else` expression is returned.
All `predicate` arguments must be expressions that evaluate to a  `boolean` value.
All `then` arguments and the `else` argument must be of the same type.

## Syntax

`case(`*predicate_1*, *then_1*,
       [*predicate_2*, *then_2*, ...]
       *else*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *predicate* | `string` |  :heavy_check_mark: | An expression that evaluates to a `boolean` value. |
| *then* | `string` |  :heavy_check_mark: | An expression that gets evaluated and its value is returned from the function if *predicate* is the first predicate that evaluates to `true`. |
| *else* | `string` |  :heavy_check_mark: | An expression that gets evaluated and its value is returned from the function if neither of the *predicate_i* evaluate to `true`. |

## Returns

The value of the first *then_i* whose *predicate_i* evaluates to `true`, or the value of *else* if neither of the predicates are satisfied.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA33LQQpAQACF4b1yh9esKAtDdtyAlRMMHolBY5Tk8KTs5F9/v1FTR5T9QbRm1pCwM2SC1XJB5DonuFtODaqtHmiRoVYrvWdIM8QBRKnVOIoAroPvXizDWxds+k3/cZEr01H4FzbjCsCbAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range Size from 1 to 15 step 2
| extend bucket = case(Size <= 3, "Small", 
                       Size <= 10, "Medium", 
                       "Large")
```

**Output**

|Size|bucket|
|---|---|
|1|Small|
|3|Small|
|5|Medium|
|7|Medium|
|9|Medium|
|11|Large|
|13|Large|
|15|Large|
