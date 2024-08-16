---
title:  azure_digital_twins_query_request plugin
description: Learn how to use the azure_digital_twins_query_request plugin to run an Azure Digital Twins query as part of a Kusto query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# azure_digital_twins_query_request plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

The `azure_digital_twins_query_request` plugin runs an Azure Digital Twins query as part of a Kusto Query Language (KQL) query. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

Using the plugin, you can query across data in both Azure Digital Twins and any data source accessible through KQL. For example, you can [perform time series analytics](#perform-time-series-analytics).

For more information about the plugin, see [Azure Digital Twins query plugin](/azure/digital-twins/concepts-data-explorer-plugin#using-the-plugin).

## Syntax

`evaluate` `azure_digital_twins_query_request` `(` *AdtInstanceEndpoint* `,` *AdtQuery* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *AdtInstanceEndpoint* | `string` |  :heavy_check_mark: | The Azure Digital Twins instance endpoint to be queried. |
| *AdtQuery* | `string` |  :heavy_check_mark: | The query to run against the Azure Digital Twins endpoint. This query is written in a custom SQL-like query language for Azure Digital Twins, called the Azure Digital Twins query language. For more information, see [Query language for Azure Digital Twins](/azure/digital-twins/concepts-query-language).|

## Authentication and authorization

The `azure_digital_twins_query_request` plugin uses the Microsoft Entra account of the user running the query to authenticate. To run a query, a user must at least be granted the **Azure Digital Twins Data Reader** role. Information on how to assign this role can be found in [Security for Azure Digital Twins solutions](/azure/digital-twins/concepts-security#authorization-azure-roles-for-azure-digital-twins).

## Examples

The following examples show how you can run various Azure Digital Twins queries, including queries that use additional Kusto expressions.

### Retrieval of all twins within an Azure Digital Twins instance

The following example returns all digital twins within an Azure Digital Twins instance.

```kusto
evaluate azure_digital_twins_query_request(
  'https://contoso.api.wcus.digitaltwins.azure.net',
  'SELECT T AS Twins FROM DIGITALTWINS T')
```

:::image type="content" source="media/azure-digital-twins-query-request-plugin/adt-twins.png" alt-text="Screenshot of the twins present in the Azure Digital Twins instance.":::

### Projection of twin properties as columns along with additional Kusto expressions

The following example returns the result from the plugin as separate columns, and then performs additional operations using Kusto expressions.

```kusto
evaluate azure_digital_twins_query_request(
  'https://contoso.api.wcus.digitaltwins.azure.net',
  'SELECT T.Temperature, T.Humidity FROM DIGITALTWINS T WHERE IS_PRIMITIVE(T.Temperature) AND IS_PRIMITIVE(T.Humidity)')
| where Temperature > 20
| project TemperatureInC = Temperature, Humidity
```

**Output**

|TemperatureInC|Humidity|
|---|---|
|21|48|
|49|34|
|80|32|

## Perform time series analytics

You can use the data history integration feature of Azure Digital Twins to historize digital twin property updates. To learn how to view the historized twin updates, see [View the historized twin updates](/azure/digital-twins/how-to-use-data-history?tabs=cli#view-the-historized-twin-updates-in-azure-data-explorer)
