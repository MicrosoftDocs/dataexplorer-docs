---
title: azure digital twins query request plugin - Azure Data Explorer
description: This article describes the azure digital twins query request plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 06/06/2021
---
# azure_digital_twins_query_request plugin

Runs an Azure Digital Twins query as part of the KQL query.

Using the plugin, you can reason across data in both Azure Digital Twins and any data source accessible through the Kusto Query Language (KQL). For example, you can use the plugin to contextualize time series data in Kusto by joining it with knowledge graph data held in Azure Digital Twins.

## Syntax

  `evaluate` `azure_digital_twins_query_request` `(` *AdtInstanceEndpoint* `,` *AdtQuery* `)`

## Arguments

* *AdtInstanceEndpoint*: A `string` literal indicating the Azure Digital Twins instance endpoint to be queried.

* *AdtQuery*: A `string` literal indicating the query that is to be executed against the Azure Digital Twins endpoint. This query is written in a custom SQL-like query language for Azure Digital Twins, referred to as the **Azure Digital Twins query language**. For more information on the query language, see [**Query language | Azure Digital Twins documentation**](https://docs.microsoft.com/azure/digital-twins/concepts-query-language).

## Authentication and Authorization

The user of the azure_digital_twins_query_request plugin must be granted the **Azure Digital Twins Data Reader** role, as the user's Azure AD token is used to authenticate. Information on how to assign this role can be found in [**Security for Azure Digital Twins solutions | Azure Digital Twins documentation**](https://docs.microsoft.com/azure/digital-twins/concepts-security#authorization-azure-roles-for-azure-digital-twins).

## Setup

This plugin is disabled by default. To enable the plugin on your cluster, run the following command:
`.enable plugin azure_digital_twins_query_request`. This command requires **All Databases admin** permission. 

For more information on this command, see [**.enable plugin | Azure Data Explorer documentation**](../management/enable-plugin.md). For more information on role-based authorization in Kusto, see [**Role-based Authorization in Kusto | Azure Data Explorer documentation**](../management/access-control/role-based-authorization).

## Examples

The following examples show how you can perform various queries, along with using additional Kusto expressions.

### Retrieval of all twins within an Azure Digital Twins instance

This example returns all digital twins within an Azure Digital Twins instance.

```kusto
evaluate azure_digital_twins_query_request(
  'https://contoso.api.wcus.digitaltwins.azure.net',
  'SELECT T AS Twins FROM DIGITALTWINS T')
```

The result looks like this:

![The twins present in the Azure Digital Twins instance](images/adt-twins.png "The twins present in the Azure Digital Twins instance")

### Projection of twin properties as columns along with additional Kusto expressions

This example returns the result from the plugin as separate columns, and then performs additional operations using Kusto expressions.

```kusto
evaluate azure_digital_twins_query_request(
  'https://contoso.api.wcus.digitaltwins.azure.net',
  'SELECT T.Temperature, T.Humidity FROM DIGITALTWINS T WHERE IS_PRIMITIVE(T.Temperature) AND IS_PRIMITIVE(T.Humidity)')
| where Temperature > 20
| project TemperatureInC = Temperature, Humidity
```

The result looks like this:

|TemperatureInC|Humidity|
|---|---|
|21|48|
|49|34|
|80|32|

### Joining the plugin results with another data source

This example shows how to perform complex analysis, such as anomaly detection, through a `join` operation between the plugin results and a table containing historical data in a Kusto table, based on the ID column (`$dtid`).

```kusto
evaluate azure_digital_twins_query_request(
  'https://contoso.api.wcus.digitaltwins.azure.net',
  'SELECT T.$dtId AS tid, T.Temperature FROM DIGITALTWINS T WHERE IS_PRIMITIVE(T.$dtId) AND IS_PRIMITIVE(T.Temperature)')
| project tostring(tid), todouble(Temperature)
| join kind=inner (
    ADT_Data_History
) on $left.tid == $right.twinId
| make-series num=avg(value) on timestamp from min_t to max_t step dt by tid
| extend (anomalies, score , baseline) = 
          series_decompose_anomalies(num, 1.5, -1, 'linefit')
| render anomalychart with(anomalycolumns=anomalies, title= 'Test, anomalies')
```

ADT_Data_History is a table whose schema as follows:

|timestamp|twinId|modelId|name|value|relationshipTarget|relationshipId|
|---|---|---|---|---|---|---|
|2021-02-01 17:24|contosoRoom|dtmi:com:contoso:Room;1|Temperature|24|...|..|

The output looks like this:

![Anomaly chart of the above expression](images/adt-anomaly.png "Highlighted point is the anomaly")
