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

You can run a Kusto Query Language script to configure your database during ARM template deployment. A Kusto Query Language script is a list of one or more [control commands](kusto/management/index.md), each separated by one line break, and is created as a resource that will be accessed with the ARM template. The script can only run control commands that start with the following verbs:

* `.create`
* `.create-or-alter`
* `.create-merge`
* `.alter`
* `.alter-merge`

In general, we recommended using the idempotent version of commands so that if they are called more than once with the same input parameters, they have no additional effect. In other words, running the command multiple times has the same effect as running it once. For example, where possible, we recommend using the idempotent command `.create-or-alter` over the regular `.create` command.

There are various methods you can use to configure a database with Kusto Query Language scripts. We'll focus on two main methods using ARM template deployment:

1. [*Inline*](#inline-script): You provide a script inline
1. [*Storage Account*](#storage-account-script): You create a script as a blob in an Azure storage account, and provide its details (url and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview))

> [!NOTE]
> Each cluster can have a maximum of 50 scripts.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## Security

The principal, such as a user or service principal, used to deploy a script must have the following security roles:

1. [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role on the cluster
1. [Admin](/azure/data-explorer/kusto/management/access-control/role-based-authorization) role on the database

> [!IMPORTANT]
> The principal provisioning the cluster automatically gets the `All Databases Admin` role on the cluster.

## Inline script

In this method, the script is provided inline in the ARM template. A Kusto Query Language script is one or more control commands separated by *at least* one line break.

For example, the code below is a Kusto Query Language script that creates two tables: *MyTable* and *MyTable2*.

```kusto
.create-merge table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)

.create-merge table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
```

### Run inline script using an ARM template

In this section, you'll see how to run a Kusto Query Language script with a [JSON Azure Resource Manager template](/azure/azure-resource-manager/templates/overview).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "kqlScript": {
            "defaultValue": "", // SCRIPT??
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

| Setting | Description |
|--|--|
| KQL Script | The inline Kusto Query Language script. |
| Force Update Tag | A unique string. If changed, the script will be applied again. |
| Continue On Errors | A flag that indicates whether to continue if one of the commands fail. Default value: false. |
| Cluster Name | The name of the cluster. |
| Database Name | The name of the database under which the script will run. |
| Script Name | The name of the script. |

## Omitting update tag

It might not be desireable to run a KQL script every time the ARM template is deployed.  Running a KQL script consumes cluster resources.  For that reason, a KQL script **isn't executed** on the cluster if one of the following conditions is met for two consecutive deployments:

* The same non-empty `forceUpdateTag` is specified
* `forceUpdateTag` is not specified (or is empty) and the same script content is specified

The best practice is to omit `forceUpdateTag`:  the script will then be executed when the script content changes between deployments.

Use `forceUpdateTag` only to force the execution of the script.

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

## Storage account script

This method assumes that you already have a blob in Azure storage account and you provide its details (url and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview)) directly.

> [!NOTE]
> Kusto Query Language scripts doesn't support scripts stored in storage accounts with [Azure Storage firewall or Virtual Network rules](/azure/storage/common/storage-network-security?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal).

### Create the script resource

A Kusto Query Language script is one or more control commands separated by exactly one line break. The first step is to create this script and upload it to a storage account.

1. Create the script containing the control commands you want to use in your database. For example, the code below is a Kusto Query Language script that create two tables: *MyTable* and *MyTable2*.

    ```kusto
    .create-merge table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
    
    .create-merge table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
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
|Script URL     |  The URL of the blob, for example 'https://myaccount.blob.core.windows.net/mycontainer/myblob'. |
|Script URL SaS Token   |  The [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview).    |
| Force Update Tag   |  A unique string. If changed, the script will be applied again.  |
|Continue On Errors    |   A flag that indicates whether to continue if one of the commands fails. Default is false.     |
|Cluster Name    |  The name of the cluster.     |
|Database Name   |   The name of the database. The script will run under this database scope.      |
|Script Name   |   The name of the script.      |

## Next steps

* [Management (control commands) overview](kusto/management/index.md)
