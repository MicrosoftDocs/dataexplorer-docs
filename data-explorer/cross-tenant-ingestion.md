---
title: Allow cross-tenant ingestion from Event Hub in Azure Data Explorer
description: Learn how to allow ingestion to Azure Data Explorer from an Event Hub in a different tenant
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: reference
ms.date: 04/11/2021
---
# Allow cross-tenant ingestion

If you want to ingest data from Event Hub to Azure Data Explorer, and the two services are in different tenants, this article will show you how. The process involves invoking [Kusto API](/rest/api/azurerekusto/dataconnections/createorupdate) through PowerShell to build a Kusto data connection. You will use [auxiliary tokens](/azure/azure-resource-manager/management/authenticate-multi-tenant) to authenticate.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create an [Event Hub with data for ingestion](ingest-data-event-hub.md#create-an-event-hub) with an account in *Tenant1*, acc1@domain1.com.
* Create [a test cluster and database](create-cluster-database-portal.md), with an account in *Tenant2*, acc2@domain2.com.

## Assign role to Tenant2 in Event Hub

1. In the Azure portal, browse to your Event Hub namespace. 
1. In the left menu, select **Access control (IAM)** > **Add role assignments**
   
    :::image type="content" source="media/cross-tenant-ingestion/access-control.png" alt-text="Screenshot of Event Hub namespace.":::

1. The **Add role assignment** window opens. Fill out the following information:

    :::image type="content" source="media/cross-tenant-ingestion/add-role-assignment.png" alt-text="Screenshot of Add role assignment window in the Azure portal.":::

    |**Setting** | **Suggested value** |
    |---|---|
    | Role | Azure Event Hubs Data Receiver
    | Assign access to | User, group, or service principal
    | Select | email address of user in *Tenant2*
    
    Select **Save**.

1. When you receive an email invite on the acc2@domain2.com account, accept the invitation.

## Get access token for Tenant1

1. The source code for “Get-AzCachedAccessToken” function can be found at [PowerShell gallery](https://www.powershellgallery.com/packages/AzureSimpleREST/0.2.64/Content/internal%5Cfunctions%5CGet-AzCachedAccessToken.ps1). You can include this in your personal PowerShell profile to make it easier to call, or run the following function and use it in further commands.
    
    ```PowerShell
    function Get-AzCachedAccessToken()
    {
        $ErrorActionPreference = 'Stop'
        if(-not (Get-Module Az.Accounts)) {
            Import-Module Az.Accounts
        }
        $azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
        if(-not $azProfile.Accounts.Count) {
            Write-Error "Ensure you have logged in before calling this function."    
        }
        $currentAzureContext = Get-AzContext
        $profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
        Write-Debug ("Getting access token for tenant" + $currentAzureContext.Tenant.TenantId)
        $token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
        $token.AccessToken
    }
    
    ```

1.	Connect to *Tenant1*:

    ```PowerShell
    Connect-AzAccount
    ```
    
1.	Set variable with token from Tenant1:
    
    ```PowerShell
    $tokenfromtenant1 = Get-AzCachedAccessToken
    ```

1.	Set auxiliary token:
    
    ```PowerShell
    $auxpat="Bearer $tokenfromtenant1"
    ```
    
1.	Grant ‘acc1@domain1.com’ access on Kusto cluster. 
1.	Set the Kusto cluster’s subscription ID:
    
    ```PowerShell
    Set-AzContext -SubscriptionId "<subscription ID>"
    ```
    
1.	Set variable with token from *Tenant2*:
    
    ```PowerShell
    $tokenfromtenant2 = Get-AzCachedAccessToken
    ```
    
1.	Set the pat variable as primary token:
    
    ```PowerShell
    $pat="Bearer $tokenfromtenant2"   
    ```
    
1.	Set an http request body to invoke web/REST request:

    ```PowerShell
    $requestbody ='{"location": "Australia East","kind": "EventHub","properties": { "eventHubResourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.EventHub/namespaces/<event hub namespace name>/eventhubs/<event hub name>","consumerGroup": "$Default","dataFormat": "JSON", "tableName": "<ADX table name>", "mappingRuleName": "<ADX table mapping name>"}}'
    ```
    
1.	Set the URI to invoke web/REST request:

    ```PowerShell
    $adxdcuri="https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Kusto/clusters/<adx cluster name>/databases/<adx db name>/dataconnections/<adx data connection name>?api-version=2020-02-15"
    ```
    
1.	Add ‘acc1@domain1.com’ as contributor in Kusto cluster.
1.	Invoke a web request with all values set in above steps.
    
    ```PowerShell
    Invoke-WebRequest -Headers @{Authorization = $pat; 'x-ms-authorization-auxiliary' = $auxpat} -Uri $adxdcuri -Body $requestbody -Method PUT -ContentType 'application/json'
    ```
    
Now you will be able to see the newly created Kusto data connection on Azure portal.

> [!NOTE]
> Aaccess for account/app was used in this process to build the data connection. If this access is revoked on Event Hub, make sure you delete the Kusto data connection. Otherwise, Azure Data Epxlorer will continue to ingest data even if access on Event Hub is revoked.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
