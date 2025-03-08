---
title:  covariance() (aggregation function)
description: Learn how to use the covariance() aggregation function to calculate the sample covariance of two random variables.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/08/2025
---
# covariance() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sample covariance of two random variables *expr1* and *expr2*.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

The following formula is used:

:::image type="content" source="media/covariance-aggfunction/covariance-sample.png" alt-text="Image showing a covariance sample formula.":::

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`covariance(`*expr1* `,` *expr2 `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr1* | `real` |  :heavy_check_mark: | First random variable expression.|
|*expr2* | `real` |  :heavy_check_mark: | Second random variable expression.|

## Returns

Returns the covariance value of *expr1* and *expr2*.

## Example

The example in this section shows how to use the syntax to help you get started.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAEtJLAHCpJxUjQqrotTEHB2FSjCtqRDNy6UABIZ6BjoKhiZAEsI3AvMN4HxjMN8czgepVDBCyJuC%2bKYQfiwvV41CcWlubmJRZlWqQnJ%2bGZCRmJcMtBxoryYvFy8XAHd2q0eQAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(x:real, y:real) [
    1.0, 14.0,
    2.0, 10.0,
    3.0, 17.0,
    4.0, 20.0,
    5.0, 50.0,
]
| summarize covariance(x, y)
```

**Output**

|covariance_x_y|
|---|---|
|20.5|
