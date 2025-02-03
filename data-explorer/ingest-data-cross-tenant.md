---
title: Create a cross-tenant data connection for Azure Data Explorer
description: Learn how to create a cross-tenant data connection for an Azure Event Hubs or Azure Event Grid service in a different tenant
ms.reviewer: vilauzon
ms.topic: reference
ms.date: 02/03/2025
---
# Cross-tenant data connection

When you need to create a data connection for an Azure Event Hubs or Azure Event Grid service in a different tenant, use the [Create Data Connections API](/rest/api/azurerekusto/dataconnections/createorupdate) to build the connection.

In this article you learn how to use PowerShell to create a cross-tenant Event Hubs data connection and [auxiliary tokens](/azure/azure-resource-manager/management/authenticate-multi-tenant) to authenticate.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. 
* Create an [event hub with data for ingestion](ingest-data-event-hub-overview.md) with an account in *Tenant1*, acc1@domain1.com. This is the tenant that hosts the source Event Hubs.
* Create [a test cluster and database](create-cluster-and-database.md), with an account in *Tenant2*, acc2@domain2.com. This is the tenant that hosts the destination Data Explorer.

## Permissions

You must have at least [Azure Event Hubs Data Owner](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner) permissions.

> [!NOTE]
> The account can be local or guest to Tenant1 or Tenant2, as long as it has the prerequisite permissions.
> Permissions must be at the Namespace level, and not at the Event Hubs level. Only Event Hubs Namespace keys are used for the connection.

## Assign role to Tenant2 in Event Hubs

1. In the Azure portal, browse to your Event Hubs namespace.

1. In the left menu, select **Access control (IAM)** > **Add role assignments**.

1. In the **Add role assignment** window, enter the settings in the table and then select **Save**.

    | **Setting** | **Suggested value** |
    |--|--|
    | Role | [Azure Event Hubs Data Owner](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner) |
    | Assign access to | User, group, or service principal |
    | Select | The email address of the user in *Tenant2* |

1. When you receive an email invite on the selected address (`acc2@domain2.com account`), accept the invitation.

## Get an Access token for Tenant1

Set up a cross-tenant data connection between Event Hubs and Data Explorer using PowerShell.

# [Entra account](#tab/entra)

1. Create the `Get-AzCachedAccessToken` function to get the access token for *Tenant1*. The source code for the function can be found in the [PowerShell gallery](https://www.powershellgallery.com/packages/AzureSimpleREST/0.2.64/Content/internal%5Cfunctions%5CGet-AzCachedAccessToken.ps1). You can include this code in your personal PowerShell profile to make it easier to call, or you can run it and then use it in these steps. <!--to add the code here as in the wiki? -->

1. Run the following command to connect to *Tenant1* and subscription:

    ```PowerShell
    Connect-AzAccount -TenantId <Tenant ID> -Subscription "<SubscriptionName>"
    ```

1. Add a variable to store the access token for *Tenant1*:

    ```PowerShell
    $tokenfromtenant1 = Get-AzCachedAccessToken
    ```

1. Add an auxiliary token variable for *Tenant1*:

    ```PowerShell
    $auxpat="Bearer $tokenfromtenant1"
    ```

1. Grant the Data Explorer tenant `acc1@domain1.com` access to the cluster, and set the subscription ID.

    ```PowerShell
    Connect-AzAccount -TenantId <Tenant ID> -SubscriptionId "<SubscriptionName>"
    ```

    > [!NOTE]
    > Note: Ensure that you use the ID for the tenant (for example, 92f988bf-76f1-41ak-91ab-2d7cd010db47) and the subscription string name (for example, "Visual Studio Enterprise Subscription").

1. Add a variable with the token for *Tenant2*:

    ```PowerShell
    $tokenfromtenant2 = Get-AzCachedAccessToken
    ```

1. Add a `pat` variable to be used as the primary token:

    ```PowerShell
    $pat="Bearer $tokenfromtenant2"
    ```

1. Add an HTTP body request variable to use as an Event Hub resource, when invoking the web request:

    ```PowerShell
    $requestbody ='{"location": "Australia East","kind": "EventHub","properties": { "eventHubResourceId": "/subscriptions/<subscription ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.EventHub/namespaces/<EventHubNamespaceName>/eventhubs/<EventHubName>","consumerGroup": "$Default","dataFormat": "JSON", "tableName": "<ADXTableName>", "mappingRuleName": "<ADXTableMappingName>"}}'
    ```

1. Add a URI variable to use as a Data Explorer resource, when invoking the web request:

    ```PowerShell
    $adxdcuri="https://management.azure.com/subscriptions/<subscriptionID>/resourceGroups/<resource group name>/providers/Microsoft.Kusto/clusters/<ADXClusterName>/databases/<ADXdbName>/dataconnections/<ADXDataConnectionName>?api-version=2020-02-15"
    ```

1. Add `acc1@domain1.com` as a contributor in the cluster.

1. Invoke the following web request that uses the previously defined variables, to create the data connection.

    ```PowerShell
    Invoke-WebRequest -Headers @{Authorization = $pat; 'x-ms-authorization-auxiliary' = $auxpat} -Uri $adxdcuri -Body $requestbody -Method PUT -ContentType 'application/json'
    ```

1. *Optional*: Once the data connection is established, consider revoking or deleting any unnecessary permissions or accounts in both Data Explorer and Event Hubs.

You should now be able to see the newly created data connection in the Azure portal.

> [!IMPORTANT]
> If the access used to build the data connection is revoked on Event Hubs, make sure you delete the data connection. Otherwise, Azure Data Explorer continues to ingest data even if access on Event Hubs is revoked.

# [Service Principal](#tab/SPA)

1. Create the `Get-AzCachedAccessToken` function to get the access token for *Tenant1*. The source code for the function can be found in the [PowerShell gallery](https://www.powershellgallery.com/packages/AzureSimpleREST/0.2.64/Content/internal%5Cfunctions%5CGet-AzCachedAccessToken.ps1). You can include this code in your personal PowerShell profile to make it easier to call, or you can run it and then use it in these steps.

1. Generate the Service Principal credential:

    ```PowerShell
    $ServicePrincipleID = "<Application(Client)ID>"
    ```

    ```PowerShell
    $Password = ConvertTo-SecureString -String "<Secret>" -AsPlainText -Force
    ```

    ```PowerShell
    $Credential = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $ServicePrincipalID, $Password
    ```

1. Connect to the Event Hubs Tenant and Subscription, and store the access tokens in variables:

    ```PowerShell
    Connect-AzAccount -TenantId <Tenant ID> -Subscription "<SubscriptionName>" -ServicePrincipal -Credential $Credential
    ```

    ```PowerShell
    $tokenfromtenant1 = Get-AzCachedAccessToken
    ```

    ```PowerShell
    $auxpat="Bearer $tokenfromtenant1"
    ```

1. Connect to the Data Explorer Tenant and Subscription, and store the access tokens in variables:

    ```PowerShell
    Connect-AzAccount -TenantId <Tenant ID> -Subscription "<SubscriptionName>" -ServicePrincipal -Credential $Credential
    ```

    > [Note:]
    > Ensure that you use the ID for the tenant (for example, 92f988bf-76f1-41ak-91ab-2d7cd010db47) and the subscription string name (for example, "Visual Studio Enterprise Subscription").

    ```powershell
    $tokenfromtenant2 = Get-AzCachedAccessToken
    ```

    ```powershell
    $pat="Bearer $tokenfromtenant2"
    ```

1. Add Event Hub resource details to a variable:

    ```PowerShell
    $requestbody = '{"location": "East US", "kind": "EventHub", "properties": { "eventHubResourceId": "/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.EventHub/namespaces/<EventHubNamespaceName>/eventhubs/<EventHubName>", "consumerGroup": "$Default", "dataFormat": "MultiJSON", "tableName": "<ADXTableName>", "mappingRuleName": "<ADXTableMappingName>"}}'
    ```

1. Add Data Explorer resource details to a variable:

    ```PowerShell
    $adxdcuri="https://management.azure.com/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Kusto/clusters/<ADXClusterName>/databases/<ADXdbName>/dataconnections/<ADXDataConnectionName>?api-version=2020-02-15"
    ```

1. Send the request to create the data connection

    ```PowerShell
    Invoke-WebRequest -Headers @{Authorization = $pat; 'x-ms-authorization-auxiliary' = $auxpat} -Uri $adxdcuri -Body $requestbody -Method PUT -ContentType 'application/json'
    ```

1. *Optional*: Once the data connection is established, consider revoking or deleting any unnecessary permissions or accounts in both Data Explorer and Event Hubs.

You should now be able to see the newly created data connection in the Azure portal.

## Backend Process

Azure validates the Entra account for Contributor or Owner permissions in Data Explorer before processing the new data connection request. More explicitly: Microsoft.Kusto/clusters/databases/dataConnections/write.
Simultaneously, Azure checks that the account has the necessary permissions to list the keys of the Event Hub namespace. More explicitly: Microsoft.EventHub/namespaces/listKeys/action.
If both permissions are valid, Event Hub keys are used to establish the connection in Data Explorer.

Afterward, Entra account permissions can be removed, as Event Hub keys are used for data ingestion authentication.

## Related content

* [Query data in Azure Data Explorer](web-query-data.md)
* [Convert to multitenant](/entra/identity-platform/howto-convert-app-to-be-multi-tenant)
