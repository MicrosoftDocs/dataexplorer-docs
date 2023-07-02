---
title: Create a cross-tenant data connection for Azure Data Explorer
description: Learn how to create a cross-tenant data connection for an Azure Event Hubs or Azure Event Grid service in a different tenant
ms.reviewer: miwalia
ms.topic: reference
ms.date: 02/14/2022
---
# Cross-tenant data connection

When you need to create a data connection for an Azure Event Hubs or Azure Event Grid service in a different tenant, use our [API](/rest/api/azurerekusto/dataconnections/createorupdate) to build the connection.

In the following example, you'll use PowerShell to create a cross-tenant Event Hubs data connection and [auxiliary tokens](/azure/azure-resource-manager/management/authenticate-multi-tenant) to authenticate.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create an [event hub with data for ingestion](ingest-data-event-hub.md#create-an-event-hub) with an account in *Tenant1*, acc1@domain1.com.
* Create [a test cluster and database](create-cluster-and-database.md), with an account in *Tenant2*, acc2@domain2.com.

## Assign role to Tenant2 in Event Hubs

1. In the Azure portal, browse to your Event Hubs namespace.
1. In the left menu, select **Access control (IAM)** > **Add role assignments**

    :::image type="content" source="media/cross-tenant-ingestion/access-control.png" alt-text="Screenshot of Event Hubs namespace.":::

1. In the **Add role assignment** window, fill out the following information, and then select **Save**.

    :::image type="content" source="media/cross-tenant-ingestion/add-role-assignment.png" alt-text="Screenshot of Add role assignment window in the Azure portal.":::

    |**Setting** | **Suggested value** |
    |---|---|
    | Role | [Azure Event Hubs Data Receiver](/azure/role-based-access-control/built-in-roles) |
    | Assign access to | User, group, or service principal |
    | Select | The email address of the user in *Tenant2* |

1. When you receive an email invite on the selected address (`acc2@domain2.com account`), accept the invitation.

## Get an access token for Tenant1

Before you begin, you'll need the `Get-AzCachedAccessToken` function to get the access token for *Tenant1*. The source code for the function can be found in the [PowerShell gallery](https://www.powershellgallery.com/packages/AzureSimpleREST/0.2.64/Content/internal%5Cfunctions%5CGet-AzCachedAccessToken.ps1). You can include this code in your personal PowerShell profile to make it easier to call, or you can run it and then use it in these steps.

1. Run the following command to connect to *Tenant1*:

    ```PowerShell
    Connect-AzAccount
    ```

1. Add a variable with the token for *Tenant1*:

    ```PowerShell
    $tokenfromtenant1 = Get-AzCachedAccessToken
    ```

1. Add an auxiliary token variable for *Tenant1*:

    ```PowerShell
    $auxpat="Bearer $tokenfromtenant1"
    ```

1. Grant `acc1@domain1.com` access to the cluster.
1. Set the cluster's subscription ID:

    ```PowerShell
    Set-AzContext -SubscriptionId "<subscription ID>"
    ```

1. Add a variable with the token for *Tenant2*:

    ```PowerShell
    $tokenfromtenant2 = Get-AzCachedAccessToken
    ```

1. Add a `pat` variable to be used as the primary token:

    ```PowerShell
    $pat="Bearer $tokenfromtenant2"
    ```

1. Add an HTTP body request variable to use when invoking the web request:

    ```PowerShell
    $requestbody ='{"location": "Australia East","kind": "EventHub","properties": { "eventHubResourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.EventHub/namespaces/<event hub namespace name>/eventhubs/<event hub name>","consumerGroup": "$Default","dataFormat": "JSON", "tableName": "<ADX table name>", "mappingRuleName": "<ADX table mapping name>"}}'
    ```

1. Add a URI variable to use when invoking the web request:

    ```PowerShell
    $adxdcuri="https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Kusto/clusters/<adx cluster name>/databases/<adx db name>/dataconnections/<adx data connection name>?api-version=2020-02-15"
    ```

1. Add `acc1@domain1.com` as a contributor in the cluster.
1. Invoke the following web request that uses the previously defined variables.

    ```PowerShell
    Invoke-WebRequest -Headers @{Authorization = $pat; 'x-ms-authorization-auxiliary' = $auxpat} -Uri $adxdcuri -Body $requestbody -Method PUT -ContentType 'application/json'
    ```

You should now be able to see the newly created data connection in the Azure portal.

> [!NOTE]
> If the access used to build the data connection is revoked on Event Hubs, make sure you delete the data connection. Otherwise, Azure Data Explorer will continue to ingest data even if access on Event Hubs is revoked.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
