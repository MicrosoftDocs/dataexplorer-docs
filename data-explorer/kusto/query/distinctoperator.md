---
title: distinct operator - Azure Data Explorer
description: Learn how to use the distinct operator to create a table with the distinct combination of the columns of the input table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/11/2022
---
# distinct operator

Produces a table with the distinct combination of the provided columns of the input table.

```kusto
T | distinct Column1, Column2
```

Produces a table with the distinct combination of all columns in the input table.

```kusto
T | distinct *
```

## Example

Shows the distinct combination of fruit and price.

```kusto
Table | distinct fruit, price
```

:::image type="content" source="images/distinctoperator/distinct.PNG" alt-text="Two tables. One has suppliers, fruit types, and prices, with some fruit-price combinations repeated. The second table lists only unique combinations.":::

>[!NOTE]
>
> * Unlike `summarize by ...`, the `distinct` operator supports providing an asterisk (`*`) as the group key, making it easier to use for wide tables.
> * If the group by keys are of high cardinalities, using `summarize by ...` with the [shuffle strategy](shufflequery.md) could be useful.
