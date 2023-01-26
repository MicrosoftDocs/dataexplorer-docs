---
title: 'Add database principals for Azure Data Explorer by using C#'
description: In this article, you learn how to add database principals for Azure Data Explorer by using C#.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 09/11/2022
---

# Add database principals for Azure Data Explorer by using C#

> [!div class="op_single_selector"]
> * [C#](database-principal-csharp.md)
> * [Python](database-principal-python.md)
> * [Azure Resource Manager template](database-principal-resource-manager.md)

In this article, you'll use C# to add database principals for Azure Data Explorer.

## Prerequisites

* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. You can [create a free cluster](start-for-free-web-ui.md) or [create a full cluster](create-cluster-database-portal.md). To decide which is best for you, check the [feature comparison](start-for-free.md#feature-comparison).

## Install C# NuGet

* Install [Microsoft.Azure.Management.kusto](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install [Microsoft.Rest.ClientRuntime.Azure.Authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication) for authentication.

[!INCLUDE [data-explorer-authentication](includes/data-explorer-authentication.md)]

## Add a database principal

The following example shows you how to add a database principal programmatically.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "PlaceholderClientSecret";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var kustoManagementClient = new KustoManagementClient(serviceCreds)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
string principalAssignmentName = "databasePrincipalAssignment1";
string principalId = "xxxxxxxx";//User email, application ID, or security group name
string role = "Admin";//Admin, Ingestor, Monitor, User, UnrestrictedViewers, Viewer
string tenantIdForPrincipal = tenantId;
string principalType = "App";//User, App, or Group

var databasePrincipalAssignment = new DatabasePrincipalAssignment(principalId, role, principalType, tenantId: tenantIdForPrincipal);
await kustoManagementClient.DatabasePrincipalAssignments.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, principalAssignmentName, databasePrincipalAssignment);
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *PlaceholderClientSecret* | The client secret of the application that can access resources in your tenant. |
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| databaseName | *mykustodatabase* | The name of your database.|
| principalAssignmentName | *databasePrincipalAssignment1* | The name of your database principal resource.|
| principalId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The principal ID, which can be user email, application ID, or security group name.|
| role | *Admin* | The role of your database principal, which can be 'Admin', 'Ingestor', 'Monitor', 'User', 'UnrestrictedViewers', 'Viewer'.|
| tenantIdForPrincipal | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The tenant ID of the principal.|
| principalType | *App* | The type of the principal, which can be 'User', 'App', or 'Group'|

## Next steps

* [Ingest data using the Azure Data Explorer Node library](node-ingest-data.md)
