---
ms.topic: include
ms.date: 08/05/2026
---
## Stat

You can use Stat in Azure Data Explorer dashboards and Fabric Real-Time Dashboards. It shows a single scalar value. Select it from the dashboard visual picker.

> [!NOTE]
> Until `render stat` is implemented, you can't select the Stat visual through the KQL `render` operator. For compatible clients, `render card` provides the closest query-level equivalent.

### Example query

```kusto
StormEvents
| summarize TotalEvents = count()
```

Select **Stat** as the visual type.

## Multi Stat

Multi Stat displays several values in a grid of slots. Select the visual through the dashboard visual picker.

The query should return a label column and a value column. You can explicitly select the **Label column** and **Value column** in the visual settings.

### Example query

```kusto
datatable(Status:string, Count:long)
[
    "Active", 42,
    "Mitigated", 18,
    "Resolved", 73
]
```

In the visual settings, select the first output column as the **Label column**, and the second output column as the **Value column**.

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

:::image type="content" source="/azure/data-explorer/media/dashboard-customize-visuals/funnel.png" alt-text="Screenshot of Dashboard results pane showing a funnel chart visualization of the example query.":::

## Heatmap

A heatmap shows values for a main variable of interest across two axis variables as a grid of colored squares.

To render a heatmap, the query must generate a table with three columns. The data used for the *value* field must be numeric. The columns that will be used for *x* and *y* values use the following rules:

- If the values in column *x* are in the `string` format, the values in column *y* must be in the `string` format.
- If the values in column *x* are in the `datetime` format, the values in column *y* must be numeric.

> [!NOTE]
> We recommend specifying each data field, instead of letting the tool infer the data source.

### Example query

```kusto
StormEvents
| summarize count(EventId) by State, EventType
```

:::image type="content" source="/azure/data-explorer/media/dashboard-customize-visuals/heatmap.png" alt-text="Screenshot of a heatmap visual from the Azure Data Explorer dashboard.":::
