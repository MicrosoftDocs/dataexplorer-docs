For cross tenant ingestions where Azure Data Explorer is in different Azure Active Directory tenant than Event Hub, you can invoke [Kusto API](https://docs.microsoft.com/en-us/rest/api/azurerekusto/dataconnections/createorupdate) through PowerShell to build Kusto data connection. You have to use [auxiliary tokens](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/authenticate-multi-tenant) to authenticate in such cross tenant scenarios.
Follow these steps with your Azure environment resource’s values -
1.	First of all, you need an account that has access on both tenants. For example Event Hub is in *Tenant1* with acc1@domain1.com and Kusto is in *Tenant2* with acc2@domain2.com. Grant ‘acc2@domain2.com’ permission on *Tenant1*  as ‘Azure Event Hubs Data Receiver’ role, it will automatically be added as a guest user.
2.	You will get an invite through email on ‘acc2@domain2.com’ account, accept it.
3.	Source code for “Get-AzCachedAccessToken” function is given on [PowerShell gallery](https://www.powershellgallery.com/packages/AzureSimpleREST/0.2.64/Content/internal%5Cfunctions%5CGet-AzCachedAccessToken.ps1). You can include this in your personal PowerShell profile to make it easier to call or just run the following function and use it in further commands.
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
5.	Connect to *Tenant1* -
```PowerShell
Connect-AzAccount
```
5.	Set variable with token from Tenant1 -
```PowerShell
$tokenfromtenant1 = Get-AzCachedAccessToken
```
6.	Set auxiliary token
```PowerShell
$auxpat="Bearer $tokenfromtenant1"
```
7.	Grant ‘acc1@domain1.com’ access on Kusto cluster. 
8.	Set Kusto cluster’s subscription ID
```PowerShell
Set-AzContext -SubscriptionId "<subscription ID>"
```
9.	Set variable with token from *Tenant2*
```PowerShell
$tokenfromtenant2 = Get-AzCachedAccessToken
```
10.	Set pat variable as primary token
```PowerShell
$pat="Bearer $tokenfromtenant2"   
```
11.	Set http request body to invoke web/REST request -
```PowerShell
$requestbody ='{"location": "Australia East","kind": "EventHub","properties": { "eventHubResourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.EventHub/namespaces/<event hub namespace name>/eventhubs/<event hub name>","consumerGroup": "$Default","dataFormat": "JSON", "tableName": "<ADX table name>", "mappingRuleName": "<ADX table mapping name>"}}'
```
12.	Set uri to invoke web/REST request -
```PowerShell
$adxdcuri="https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Kusto/clusters/<adx cluster name>/databases/<adx db name>/dataconnections/<adx data connection name>?api-version=2020-02-15"
```
13.	Add ‘acc1@domain1.com’ as contributor in Kusto cluster
14.	Invoke web request with all values set in above steps -
```PowerShell
Invoke-WebRequest -Headers @{Authorization = $pat; 'x-ms-authorization-auxiliary' = $auxpat} -Uri $adxdcuri -Body $requestbody -Method PUT -ContentType 'application/json'
```
Now you will be able to see newly created Kusto data connection on Azure portal.


> [!IMPORTANT]
> If the access for account/app(used in this process to build the data connection) is revoked on event hub, make sure you delete the Kusto data connection too otherwise it will continue to ingest the data even if access on Event Hub is revoked.

