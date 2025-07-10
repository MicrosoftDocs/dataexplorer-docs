---
title: 'Query data in Azure Monitor with Azure Data Explorer'
description: 'In this article, query data in Azure Monitor (Application Insights resource and Log Analytics workspace) by creating Azure Data Explorer cross product queries.'
ms.reviewer: guywi-ms
ms.topic: how-to
ms.date: 05/28/2025

#Customer intent: I want to query data in Azure Monitor using Azure Data Explorer.
---

# Query data in Azure Monitor using Azure Data Explorer

The Azure Data Explorer supports cross-service queries between Azure Data Explorer, [Application Insights resource (AI)](/azure/azure-monitor/app/app-insights-overview), and [Log Analytics workspace (LA)](/azure/azure-monitor/platform/data-platform-logs). You can query your Log Analytics workspace or Application Insights resource using Azure Data Explorer query tools and in a cross-service query. The article shows you how to create a cross-service query and add the Log Analytics workspace or Application Insights resource to the Azure Data Explorer web UI.

The Azure Data Explorer cross-service queries flow:

:::image type="content" source="media/query-monitor-data/query-monitor-workflow.png" alt-text="Diagram showing the Azure Data Explorer cross-service query flow."  lightbox="media/query-monitor-data/query-monitor-workflow.png":::

> [!IMPORTANT]
> Starting July 1, 2025, querying log data and events requires TLS 1.2 or higher when using [query API endpoints for Log Analytics or Application Insights](/azure/azure-monitor/fundamentals/azure-monitor-network-access#logs-query-api-endpoints). For more information, see [Secure data in transit](/azure/azure-monitor/fundamentals/best-practices-security#secure-logs-data-in-transit).

## Add a Log Analytics workspace/Application Insights resource to Azure Data Explorer client tools

Add a Log Analytics workspace or Application Insights resource to Azure Data Explorer client tools to enable cross-service queries for your clusters.

1. Verify your Azure Data Explorer native cluster (such as **help** cluster) appears on the left menu before you connect to your Log Analytics workspace or Application Insights resource.

    :::image type="content" source="media/query-monitor-data/web-ui-help-cluster.png"  lightbox="media/query-monitor-data/web-ui-help-cluster.png" alt-text="Screenshot showing the left menu with the help cluster selected as an Azure Data Explorer native cluster.":::

1. In the [Azure Data Explorer UI](https://dataexplorer.azure.com/clusters), select **+ Add** then **Connection**.

1. In the *Add Connection* window, add the URL and display name of the Log Analytics (LA) workspace or Application Insights (AI) resource.

    * For Log Analytics (LA) workspace: `https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>`
    * For Application Insights (AI) resource: `https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`

    > [!NOTE]
    > Specify `https://ade.applicationinsights.io/subscriptions/<subscription-id>` to see all databases in the subscription. This syntax also works for Log Analytics workspace clusters.

1. Select **Add**.

    :::image type="content" source="media/query-monitor-data/add-connection.png" alt-text="Screenshot showing the add connection window." lightbox="media/query-monitor-data/add-connection.png":::

    >[!NOTE]
    >
    >* There are different endpoints for the following:
    >* Azure Government- `adx.monitor.azure.us/`
    >* Azure China- `adx.monitor.azure.cn/`
    >* If you add a connection to more than one Log Analytics workspace/Application insights resource, give each a different name. Otherwise they'll all have the same name in the left pane.

1. After the connection is established, your Log Analytics workspace or Application Insights resource will appear in the left pane with your native Azure Data Explorer cluster.

    :::image type="content" source="media/query-monitor-data/la-adx-clusters.png" alt-text="Screenshot showing the Log Analytics workspace and Azure Data Explorer clusters.":::

> [!NOTE]
> Queries you run from Azure Data Explorer on data in Azure Monitor are subject to [cross-resource query limits](/azure/azure-monitor/logs/cross-workspace-query#cross-resource-query-limits).

## Run queries

You can run the queries using client tools that support Kusto queries, such as: Kusto Explorer, Azure Data Explorer web UI, Jupyter Kqlmagic, Flow, PowerQuery, PowerShell, Lens, REST API.

> [!NOTE]
> Cross-service querying is used for data retrieval only. For more information, see [Function supportability](#function-supportability).

> [!TIP]
>
> * The database should have the same name as the resource specified in the cross-service query. Names are case sensitive.
> * In cross-service queries, make sure that Application Insights resource and Log Analytics workspace names are correct.
> * If names contain special characters, they are replaced by URL encoding in the cross-service query.
> * If names include characters that don't meet [KQL identifier name rules](/kusto/query/schema-entities/entity-names?view=azure-data-explorer&preserve-view=true), they are replaced by the dash **-** character.

### Direct query on your Log Analytics workspace or Application Insights resources from Azure Data Explorer client tools

You can run queries on your Log Analytics workspace or Application Insights resources from Azure Data Explorer client tools.

1. Verify that your workspace is selected in the left pane.

1. Run the following query:

```kusto
Perf | take 10 // Demonstrate cross-service query on the Log Analytics workspace
```

:::image type="content" source="media/query-monitor-data/query-la.png" alt-text="Screenshot showing the Query Log Analytics workspace.":::

### Cross query of your Log Analytics workspace or Application Insights resource and the Azure Data Explorer native cluster

When you run cross cluster service queries, verify that your Azure Data Explorer native cluster is selected in the left pane. The following examples demonstrate combining Azure Data Explorer cluster tables (using `union`) with a Log Analytics workspace.

Run the following queries:

```kusto
union StormEvents, cluster('https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>').Perf
| take 10
```

```kusto
let CL1 = 'https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>';
union <ADX table>, cluster(CL1).database(<workspace-name>).<table name>
```

:::image type="content" source="media/query-monitor-data/cross-query.png" alt-text="Screenshot showing cross service query from the Azure Data Explorer web U I.":::

> [!TIP]
> Using the [`join` operator](/kusto/query/join-operator), instead of union, may require a [`hint`](/kusto/query/join-operator?view=azure-data-explorer&preserve-view=true#hints) to run it on an Azure Data Explorer native cluster.

### Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries between the services aren't supported. You're signed in to a single tenant for running the query spanning both resources.

If the Azure Data Explorer resource is in *tenant-name-a* and Log Analytics workspace is in *tenant-name-b*, use one of the following two methods:

1. Azure Data Explorer allows you to add roles for principals in different tenants. Add your user ID in *tenant-name-b* as an authorized user on the Azure Data Explorer cluster. Validate the *['TrustedExternalTenant'](/powershell/module/az.kusto/update-azkustocluster)* property on the Azure Data Explorer cluster contained in *tenant-name-b*. Run the cross-query fully in *tenant-name-b*.

1. Use [Lighthouse](/azure/lighthouse/) to project the Azure Monitor resource into *tenant-name-a*.

### Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you into the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, the `tenantId` has to be explicitly specified in the connection string:
`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=<TenantId>`

>[!NOTE]
>
> The `tenantId` parameter is not directly configurable in the Azure Data Explorer web UI. For the `tenantId` use the Microsoft Entra identity.

## Function supportability

The Azure Data Explorer cross-service queries support functions for both Application Insights resource and Log Analytics workspace.
This capability enables cross-cluster queries to reference an Azure Monitor tabular function directly.
The following commands are supported with the cross-service query:

* `.show functions`
* `.show function` [*FunctionName*]
* `.show database` [*DatabaseName*] `schema as json`

## Limitations

* Cross-service queries support only `.show functions`. This capability enables cross-cluster queries to reference an Azure Monitor, Azure Data Explorer, or Azure Resource Graph tabular function directly. The following commands are supported with the cross-service query:
    * `.show functions`
    * `.show function` [*FunctionName*]
    * `.show database` [*DatabaseName*] `schema as json`


* Private Link (private endpoints) and IP restrictions don't support cross-service queries.

## Additional syntax examples

The following syntax options are available when calling the Application Insights resource or Log Analytics workspaces:

|Syntax Description |Application Insights resource |Log Analytics workspace |
|----------------|---------|---------|
| Database within a cluster that contains only the defined resource in this subscription (**recommended for cross cluster queries**) | `cluster('https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>').database('<ai-app-name>')` | cluster('`https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>`') |
| Cluster that contains all apps/workspaces in this subscription | `cluster('https://adx.monitor.azure.com/subscriptions/<subscription-id>')` | cluster('`https://adx.monitor.azure.com/subscriptions/<subscription-id>`') |
|Cluster that contains all apps/workspaces in the subscription and are members of this resource group | cluster('`https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>`') | `cluster('https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>')` |
|Cluster that contains only the defined resource in this subscription | cluster('`https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`')    |  `cluster('https://adx.monitor.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>')` |
|For Endpoints in the UsGov | `cluster('https://adx.monitor.azure.us/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>')`|
|For Endpoints in the China 21Vianet | `cluster('https://adx.monitor.azure.cn/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>')` |

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
