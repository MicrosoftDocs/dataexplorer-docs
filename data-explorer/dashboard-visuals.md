---
title: Dashboard-specific visuals
description: Visualizations available in Azure Data Explorer web UI or dashboards
ms.reviewer: gabil
ms.topic: how-to
ms.date: 08/13/2023
---
# Dashboard-specific visuals

All visualizations that are created in the context of the [render operator](kusto/query/renderoperator.md) are available in dashboard visualizations. However, the following visualizations are only available in [Azure Data Explorer dashboards](azure-data-explorer-dashboards.md) or [web UI](add-query-visualization.md), and not with the render operator.

To learn how to customize any dashboard visuals, see [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)

For general information on dashboards in Azure Data Explorer, see [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

## Funnel chart

A funnel chart visualizes a linear process that has sequential, connected stages. Each funnel stage represents a percentage of the total. So, in most cases, a funnel chart is shaped like a funnel, with the first stage being the largest, and each subsequent stage smaller than its predecessor.

The following example uses data from the `ContosoSales` database from the publicly available [help cluster](https://dataexplorer.azure.com/clusters/help) to show the number of sales for washers and dryers in Canada out of the total sum of sales in 2007.

### Example query

```kusto

let interestingSales = SalesTable
| where DateKey between (datetime(2007) .. datetime(2008))
| join kind=inner Products on ProductKey;
let totalSales = interestingSales
| summarize sum(SalesAmount)
| extend Name="Total";
//totalSales
let homeAppliancesSales = interestingSales
| where ProductCategoryName == "Home Appliances"
| summarize sum(SalesAmount)
| extend Name="Home Appliances";
//homeAppliancesSales
let washersAndDryersSales = interestingSales
| where ProductCategoryName == "Home Appliances"
| where ProductSubcategoryName == "Washers & Dryers"
| summarize sum(SalesAmount)
| extend Name="Washers & Dryers";
//washersAndDryersSales
let canadaSales = interestingSales
| where ProductCategoryName == "Home Appliances"
| where ProductSubcategoryName == "Washers & Dryers"
| where Country == "Canada"
| summarize sum(SalesAmount)
| extend Name="Canada";
//canadaSales
totalSales
| union homeAppliancesSales
| union washersAndDryersSales
| union canadaSales
| project Name, SalesAmount=sum_SalesAmount
| sort by SalesAmount desc
```

:::image type="content" source="media/dashboard-customize-visuals/funnel.png" alt-text="Screenshot of Dashboard results pane showing a funnel chart visualization of the example query.":::

## Heatmap

A heatmap shows values for a main variable of interest across two axis variables as a grid of colored squares.

To render a heatmap, the query must generate a table with three columns. The columns that will be used for x and y values must be in the `string` format, and the data used for the *value* field must be numeric.

> [!NOTE]
> We recommend specifying each data field, instead of letting the tool infer the data source.

### Example query

```kusto
StormEvents
| summarize count(EventId) by State, EventType
```

:::image type="content" source="media/dashboard-customize-visuals/heatmap.png" alt-text="Screenshot of a heatmap visual from the Azure Data Explorer dashboard.":::
