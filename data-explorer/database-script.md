---
title: Configure a database using a Kusto Query Language script in Azure Data Explorer
description: Learn about how to use database script to run a Kusto Query Language script in Azure Data Explorer
author: orspod
ms.author: orspodek
ms.reviewer: docohe
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/25/2021
---
# Configure a database using a Kusto Query Language script

You can run a Kusto Query Language script to configure your database during ARM template deployment. A Kusto Query Language script is a list of one or more [control commands](kusto/management/index.md), each separated by **exactly** one line break, and is created as a resource that will be accessed with the ARM template. The script can only run control commands that start with the following verbs:

* `.create`
* `.create-or-alter`
* `.create-merge`
* `.alter`
* `.alter-merge`

There are various methods you can use to configure a database with Kusto Query Language scripts. We'll focus on two main methods using ARM template deployment. In the first, [*simple* method](#upload-kusto-query-language-script), you create a script as a blob in an Azure storage account, and provide its details (url and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview)) directly. In the second, [*more advanced* method](#inline-kusto-query-language-script), you provide your Kusto Query Language script **inline**, and a storage account is created during the deployment.

> [!NOTE]
> Each cluster can have a maximum of 50 scripts.
>
> Kusto Query Language scripts don't support scripts stored in storage accounts with [Azure Storage firewall or Virtual Network rules](/azure/storage/common/storage-network-security?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## Upload Kusto Query Language script

This method assumes that you already have a blob in Azure storage account and you provide its details (url and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview)) directly.

### Create the script resource

A Kusto Query Language script is one or more control commands separated by exactly one line break. The first step is to create this script and upload it to a storage account.

1. Create the script containing the control commands you want to use in your database. For example, the code below is a Kusto Query Language script that create two tables: *MyTable* and *MyTable2*.

    ```kusto
    .create table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
    .create table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
    ```

1. Upload your Kusto Query Language script to an Azure storage account. You can create your storage account using [Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal), [PowerShell](/azure/storage/blobs/storage-quickstart-blobs-portal), or [CLI](/azure/storage/blobs/storage-quickstart-blobs-cli).
1. Provide access to this file using [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview). You can do this with [PowerShell](/azure/storage/blobs/storage-blob-user-delegation-sas-create-powershell), [CLI](/azure/storage/blobs/storage-blob-user-delegation-sas-create-cli), or [.NET](/azure/storage/blobs/storage-blob-user-delegation-sas-create-dotnet).

### Run uploaded Kusto Query Language script using ARM template

In this section, you'll see how to run a Kusto Query Language script with an [Azure Resource Manager template](/azure/azure-resource-manager/management/overview).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
    "location":{
      "defaultValue": "[resourceGroup().location]",
            "type": "String"
    },
    "scriptUrl": {
            "type": "String"
    },
    "scriptUrlSastoken": {
            "type": "SecureString"
    },
        "forceUpdateTag": {
            "defaultValue": "[utcNow()]",
            "type": "String"
        },
    "continueOnErrors": {
            "defaultValue": false,
            "type": "bool"
        },
    "clusterName": {
            "type": "String"
    },
    "databaseName": {
            "type": "String"
    },
    "scriptName": {
            "type": "String"
    }
    },
  "variables":{
  },
    "resources": [
    {
            "type": "Microsoft.Kusto/Clusters/Databases/Scripts",
            "apiVersion": "2021-01-01",
            "name": "[concat(concat(parameters('clusterName'), '/'), concat(parameters('databaseName'), '/'), parameters('scriptName'))]",
            "properties": {          
                "scriptUrl": "[parameters('scriptUrl')]",
                "scriptUrlSasToken": "[parameters('scriptUrlSasToken')]",
                "continueOnErrors": "[parameters('continueOnErrors')]",
                "forceUpdateTag": "[parameters('forceUpdateTag')]"
            }
        }
    ],
    "outputs": {
  }
}
```

Use the following settings:

|**Setting**  |**Description**  |
|---------|---------|
| Location | The location of the Azure Data Explorer cluster |
|Script URL     |  The URL of the blob, for example 'https://myaccount.blob.core.windows.net/mycontainer/myblob'. |
|Script URL SaS Token   |  The [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview).    |
| Force Update Tag   |  A unique string. If changed, the script will be applied again.  |
|Continue On Errors    |   A flag that indicates whether to continue if one of the commands fails. Default is false.     |
|Cluster Name    |  The name of the cluster.     |
|Database Name   |   The name of the database. The script will run under this database scope.      |
|Script Name   |   The name of the script.      |

## Inline Kusto Query Language script

In this method, you run a Kusto Query Language script by using an [Azure Resource Manager template](/azure/azure-resource-manager/management/overview). You'll provide the Kusto Query Language script inline, and the storage account will be created for you.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "identity": {
            "type": "String"
        },
    "psDeploymentName": {
      "defaultValue": "[newGuid()]",
      "type": "String"
    },
        "storageAccountName": {
            "defaultValue": "scriptsstorageaccount",
            "type": "String"
        },
    "containerName": {
            "defaultValue": "scriptblobs",
            "type": "String"
        },
    "location":{
      "defaultValue": "[resourceGroup().location]",
            "type": "String"
    },
    "scriptFileName": {
      "defaultValue": "script.txt",
            "type": "String"
    },
    "kqlScript": {
      "defaultValue": "",
            "type": "String"
    },
        "forceUpdateTag": {
            "defaultValue": "[utcNow()]",
            "type": "String"
        },
    "continueOnErrors": {
            "defaultValue": false,
            "type": "bool"
        },
    "clusterName": {
            "type": "String"
    },
    "databaseName": {
            "type": "String"
    },
    "scriptName": {
            "type": "String"
    }
    },
  "variables":{
    "doubleQuote": "\"",
    "kqlScriptBase64": "[base64(parameters('kqlScript'))]",
    "locationWithQuotes": "[replace(string(concat(variables('doubleQuote'), parameters('location'), variables('doubleQuote'))), '\"', '\\\"')]",
        "resourceGroupName": "[resourceGroup().name]",
  },
    "resources": [
    {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2021-01-01",
            "name": "[parameters('storageAccountName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard_LRS",
                "tier": "Standard"
            },
            "kind": "StorageV2",
            "properties": {
                "supportsHttpsTrafficOnly": true,
                "accessTier": "Hot"
            }
        },
        {
            "type": "Microsoft.Storage/storageAccounts/blobServices",
            "apiVersion": "2021-01-01",
            "name": "[concat(parameters('storageAccountName'), '/default')]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
            ],
            "sku": {
                "name": "Standard_LRS",
                "tier": "Standard"
            },
            "properties": {
                "cors": {
                    "corsRules": []
                },
                "deleteRetentionPolicy": {
                    "enabled": false
                }
            }
        },
        
        {
            "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
            "apiVersion": "2021-01-01",
            "name": "[concat(parameters('storageAccountName'), '/default/', parameters('containerName'))]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts/blobServices', parameters('storageAccountName'), 'default')]",
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
            ],
            "properties": {
                "defaultEncryptionScope": "$account-encryption-key",
                "denyEncryptionScopeOverride": false,
                "publicAccess": "Blob"
            }
        },
    {
            "type": "Microsoft.Resources/deploymentScripts",
            "apiVersion": "2019-10-01-preview",
            "name": "[parameters('psDeploymentName')]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts/blobServices/containers', parameters('storageAccountName'), 'default', parameters('containerName'))]",
                "[resourceId('Microsoft.Storage/storageAccounts/blobServices', parameters('storageAccountName'), 'default')]",
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
            ],
            "location": "[resourceGroup().location]",
            "kind": "AzurePowerShell",
            "identity": {
                "type": "userAssigned",
                "userAssignedIdentities": {
                    "[parameters('identity')]": {}
                }
            },
            "properties": {
                "forceUpdateTag": "[parameters('forceUpdateTag')]",
                "azPowerShellVersion": "3.0",
                "scriptContent": "
          param([string] $storageAccountName, [string] $resourceGroupName, [string] $region, [string] $kqlScriptBase64, [string] $scriptFileName, [string] $containerName)
          $storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName -ErrorAction SilentlyContinue
          $ctx = $storageAccount.Context 
          $kqlScript = [Text.Encoding]::Utf8.GetString([Convert]::FromBase64String($kqlScriptBase64))
          Set-Content -Path $scriptFileName -Value $kqlScript 
          Set-AzStorageBlobContent -File $scriptFileName -Container $containerName -Blob $scriptFileName -Context $ctx 
          $StartTime = Get-Date \n $EndTime = $startTime.AddHours(2.0) 
          $fullUri = New-AzStorageBlobSASToken -Blob $scriptFileName  -Context $ctx -Container $containerName -Permission racwdl -ExpiryTime $EndTime -FullUri 
          $fileUri, $sasToken = $fullUri.split('?') 
          $DeploymentScriptOutputs = @{} \n $DeploymentScriptOutputs['sasToken'] = $sasToken 
          $DeploymentScriptOutputs['fileUri'] = $fileUri
        ",
                "arguments": "[concat('-storageAccountName', ' ', parameters('storageAccountName'), ' -resourceGroupName ', variables('resourceGroupName'), ' -region ', variables('locationWithQuotes'), ' -kqlScript ', variables('kqlScriptBase64'), ' -scriptFileName ', parameters('scriptFileName'), ' -containerName ', parameters('containerName'))]",
                "timeout": "PT1H",
                "cleanupPreference": "OnSuccess",
                "retentionInterval": "P1D"
            }
        },
    {
            "type": "Microsoft.Kusto/Clusters/Databases/Scripts",
            "apiVersion": "2021-01-01",
            "name": "[concat(concat(parameters('clusterName'), '/'), concat(parameters('databaseName'), '/'), parameters('scriptName'))]",
            "properties": {          
                "scriptUrl": "[reference(parameters('psDeploymentName')).outputs.fileUri]",
                "scriptUrlSasToken": "[reference(parameters('psDeploymentName')).outputs.sasToken]",
                "continueOnErrors": "[parameters('continueOnErrors')]",
                "forceUpdateTag": "[parameters('forceUpdateTag')]"
            }
        }
    ],
    "outputs": {
  }
}
```

Use the following settings:

|**Setting**  |**Description**  |
|---------|---------|
| Identity | Resource ID of a [user assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview). This identity must have a contributor-level permission on the subscription  |
| PowerShell Deployment Name | The name of the PowerShell script deployment name. This script uploads the **inline** Kusto Query Language script into a blob in the storage account. By default the name of this PowerShell deployment script will be random Guid. |
| Storage Account Name | The name of the storage account that will be created to host the Kusto Query Language script.
| Container Name | The name of the container that will be created to host the Kusto Query Language script.
| Location | The location of the Azure Data Explorer cluster |
| Script File Name | The Kusto Query Language script will be upload as a blob on the storage account. This parameter is the name of the file that will be created. Default value: *script.txt*. 
|KQL script     | The inline Kusto Query Language script.  a Kusto Query Language script is one or more control commands separated by **exactly** one line break.  |
|Script URL SaS Token   |  The [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview).    |
| Force Update Tag   |  A unique string. If changed, the script will be applied again.  |
|Continue On Errors    |   Flag that indicates whether to continue if one of the commands fails. Default is false.     |
|Cluster Name    |  The name of the cluster.     |
|Database Name   |   The name of the database. The script will run under this database scope.      |
|Script Name   |   The name of the script.      |

## Next steps

* [Management (control commands) overview](kusto/management/index.md)
