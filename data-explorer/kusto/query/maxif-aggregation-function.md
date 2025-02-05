---
title:  maxif() (aggregation function)
description: Learn how to use the maxif() function to calculate the maximum value of an expression where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# maxif() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the maximum value of *expr* in records for which *predicate* evaluates to `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

See also - [max()](max-aggregation-function.md) function, which returns the maximum value across the group without predicate expression.

## Syntax

`maxif(`*expr*`,`*predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *predicate* | `string` |  :heavy_check_mark: | The expression used to filter rows. |

## Returns

Returns the maximum value of *expr* in records for which *predicate* evaluates to `true`.

## Example

This example shows the maximum damage for events with no casualties.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzWMPQ7CMAxGdyTu4BEEAxfw1DAwgJB6AkMNRMIJsl2UIg4PbWB6+n70Ws8q2ycnt/nsDVycUweBhK6MFY3mh8HqVx6/idWHNQQmvxlWhKh89vE1xV3qpmJ0Wi9CGl8MeypVcsgNWU93j2woVOJlUYe/FRBhs4TTAK2T8wcBsgcBpgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| extend Damage=DamageCrops + DamageProperty, Deaths=DeathsDirect + DeathsIndirect
| summarize MaxDamageNoCasualties=maxif(Damage, Deaths == 0) by State
```

**Output**

The results table shown includes only the first 10 rows.

| -- | -- |
|--|--|
| TEXAS | 25000000 |
| KANSAS | 37500000 |
| IOWA | 15000000 |
| ILLINOIS | 5000000 |
| MISSOURI | 500005000 |
| GEORGIA | 344000000 |
| MINNESOTA | 38390000 |
| WISCONSIN | 45000000 |
| NEBRASKA | 4000000 |
| NEW YORK | 26000000 |
| ... | ... |

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [minif() (aggregation function)](minif-aggregation-function.md)
* [max_of()](max-of-function.md)
* [arg_max() (aggregation function)](arg-max-aggregation-function.md)