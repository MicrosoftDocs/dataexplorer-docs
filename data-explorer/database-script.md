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

You can run a Kusto Query Language script to configure your database during ARM template deployment. A Kusto Query Language script is a list of one or more [control commands](kusto/management/index.md), each separated by **at least** one line break, and is created as a resource that will be accessed with the ARM template. The script can only run control commands that start with the following verbs:

* `.create`
* `.create-or-alter`
* `.create-merge`
* `.alter`
* `.alter-merge`

There are various methods you can use to configure a database with Kusto Query Language scripts. We'll focus on two main methods using ARM template deployment:

1.  [*Inline* method](inline-method):  you provide a script **inline**
1.  [*Storage Account* method](#storage-account-method):, you create a script as a blob in an Azure storage account, and provide its details (url and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview)) directly

> [!NOTE]
> Each cluster can have a maximum of 50 scripts.
>
> Kusto Query Language scripts don't support scripts stored in storage accounts with [Azure Storage firewall or Virtual Network rules](/azure/storage/common/storage-network-security?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal).  This is relevant only for the [*Storage Account* method](#upload-kusto-query-language-script).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## Inline method

This method assumes the Kusto Query Language script is going to be passed *inline* to the script resource.

For example, the code below is a Kusto Query Language script creating two tables: *MyTable* and *MyTable2*.

    ```kusto
    .create table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
    .create table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
    ```
### Run inline Kusto Query Language script using ARM template

In this section, you'll see how to run a Kusto Query Language script with a [JSON Azure Resource Manager template](/azure/azure-resource-manager/templates/overview).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
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
    "variables": {
    },
    "resources": [
        {
            "type": "Microsoft.Kusto/Clusters/Databases/Scripts",
            "apiVersion": "2022-02-01",
            "name": "[concat(parameters('clusterName'), '/', parameters('databaseName'), '/', parameters('scriptName'))]",
            "properties": {
                "scriptContent": "[parameters('kqlScript')]",
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
|KQL Script|The inline Kusto Query Language script. a Kusto Query Language script is one or more control commands separated by **at least** one line break
| Force Update Tag   |  A unique string. If changed, the script will be applied again.  |
|Continue On Errors    |   A flag that indicates whether to continue if one of the commands fails. Default is false.
|Cluster Name    |  The name of the cluster.
|Database Name   |   The name of the database. The script will run under this database scope.
|Script Name   |   The name of the script.

## Omitting update tag

If the `forceUpdateTag` parameter of the script resource **is provided**, it is used to decide if the script is executed (regardless if `scriptContent` changes or not).  This is meant to limit the cluster resource consumption when ARM deployments are done at high frequency.

If the `forceUpdateTag` parameter of the script resource **is not provided** (or is an empty string), the hash of `scriptContent` is computed and if the hash value changes, the script is executed.  This is meant to simplify usage by not forcing the maintenance of an update tag.

## Script file with Bicep

Passing a Kusto Query Language script in parameter to a template can be cumbersome.  [Bicep Azure Resource Manager template](/azure/azure-resource-manager/bicep/overview) enables you to keep and maintain the script in a separate file and load it into the template using the [loadTextContent](/azure/azure-resource-manager/bicep/bicep-functions#file-functions) Bicep function.

Assuming the script is stored in a file `script.kql` located in the same folder as the Bicep file, the following template will produce the same result as the previous example:

```bicep
param forceUpdateTag string = utcNow()
param continueOnErrors bool = false
param clusterName string
param databaseName string
param scriptName string

resource cluster 'Microsoft.Kusto/clusters@2022-02-01' existing = {
    name: clusterName
}

resource db 'Microsoft.Kusto/clusters/databases@2022-02-01' existing = {
    name: databaseName
    parent: cluster
}

resource perfTestDbs 'Microsoft.Kusto/clusters/databases/scripts@2022-02-01' = {
    name: scriptName
    parent: db
    properties: {
        scriptContent: loadTextContent('script.kql')
        continueOnErrors: continueOnErrors
        forceUpdateTag: forceUpdateTag
    }
}
```

Use the following settings:

|**Setting**  |**Description**  |
|---------|---------|
| Force Update Tag   |  A unique string. If changed, the script will be applied again.  |
|Continue On Errors    |   A flag that indicates whether to continue if one of the commands fails. Default is false.
|Cluster Name    |  The name of the cluster.
|Database Name   |   The name of the database. The script will run under this database scope.
|Script Name   |   The name of the script.

## Storage Account method

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

## Next steps

* [Management (control commands) overview](kusto/management/index.md)
