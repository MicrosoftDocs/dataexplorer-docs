---
title: Configure a database using a Kusto Query Language script in Azure Data Explorer
description: Learn about how to use database script to run a Kusto Query Language script in Azure Data Explorer
ms.reviewer: docohe
ms.topic: how-to
ms.custom: devx-track-bicep
ms.date: 09/10/2023
---
# Configure a database using a Kusto Query Language script

You can run a Kusto Query Language script to configure your database during Azure Resource Management (ARM) template deployment. A script is a list of one or more [management commands](kusto/management/index.md), each separated by one line break, and is created as a resource that will be accessed with the ARM template.

The script can only run database level management commands that start with the following verbs:

* `.create`
* `.create-or-alter`
* `.create-merge`
* `.alter`
* `.alter-merge`
* `.add`

> [!NOTE]
> The supported commands must be run at the database level. For example, you can alter a table using the command `.create-or-alter table`. Cluster level commands, such as `.alter cluster` policies, are not suppoerted.

In general, we recommended using the idempotent version of commands so that if they're called more than once with the same input parameters, they have no additional effect. In other words, running the command multiple times has the same effect as running it once. For example, where possible, we recommend using the idempotent command `.create-or-alter` over the regular `.create` command.

There are various methods you can use to configure a database with scripts. We'll focus on the following methods using ARM template deployments:

1. [*Inline script*](#inline-script): The script is provided inline as a parameter to a JSON ARM template.
1. [*Bicep script*](#bicep-script): The script is provided as a separate file used by a Bicep ARM template.
1. [*Storage Account*](#storage-account-script): The script is created as a blob in an Azure storage account and its details (URL and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview) provided as parameters to the ARM template.

> [!NOTE]
> Each cluster can have a maximum of 50 scripts.

## Example script with management commands

We'll use the following example that shows a script with commands that create two tables: *MyTable* and *MyTable2*.

```kusto
.create-merge table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)

.create-merge table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)
```

Notice the two commands are idempotent. When first run, they create the tables, on subsequent runs they have no effect.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Security

The principal, such as a user or service principal, used to deploy a script must have the following security roles:

* [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role on the cluster
* [Admin](./kusto/management/access-control/role-based-access-control.md) role on the database

> [!IMPORTANT]
> The principal provisioning the cluster automatically gets the `All Databases Admin` role on the cluster.

## Inline script

Use this method to create an ARM template with the script defined as an inline parameter. If your script has one or more management commands, separate the commands by *at least* one line break.

### Run inline script using an ARM template

The following template shows how to run the script using a [JSON Azure Resource Manager template](/azure/azure-resource-manager/templates/overview).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "kqlScript": {
            "defaultValue": ".create-merge table MyTable (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)\n\n.create-merge table MyTable2 (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32)",
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
| *kqlScript* | The inline Kusto Query Language script. Use `\n` to add new line characters. |
| *forceUpdateTag* | A unique string. If changed, the script will be applied again. |
| *continueOnErrors* | A flag indicating whether to continue if one of the commands fails. Default value: false. |
| *clusterName* | The name of the cluster where the script will run. |
| *databaseName* | The name of the database under which the script will run. |
| *scriptName* | The name of the script when using an external file to supply the script.  This is the name of the actual ARM template resource of type *script*.|

### Omit update tag

Running a KQL script at every ARM template deployment isn't recommended as it consumes cluster resources. You can prevent the running of the script in consecutive deployments using the following methods:

* Specify the `forceUpdateTag` property and keeping the same value between deployments.
* Omit the `forceUpdateTag` property, or leave it empty, and use the same script between deployments.

The best practice is to omit the `forceUpdateTag` property, so that any script changes are run the next time the template is deployed. Only use the `forceUpdateTag` property if you need to force the script to run.

## Bicep script

Passing a script as parameter to a template can be cumbersome.  [Bicep Azure Resource Manager template](/azure/azure-resource-manager/bicep/overview) enables you to keep and maintain the script in a separate file and load it into the template using the [loadTextContent](/azure/azure-resource-manager/bicep/bicep-functions#file-functions) Bicep function.

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

| Setting | Description |
|--|--|
| *forceUpdateTag* | A unique string. If changed, the script will be applied again. |
| *continueOnErrors* | A flag indicating to continue if one of the commands fails. Default value: false. |
| *clusterName* | The name of the cluster where the script will run. |
| *databaseName* | The name of the database under which the script will run. |
| *scriptName* | The name of the script when using an external file to supply the script. |

The Bicep template can be deployed using similar tools as the JSON ARM template. For example, you can use the following Azure CLI commands to deploy the template:

```azurecli
az deployment group create -n "deploy-$(uuidgen)" -g "MyResourceGroup" --template-file "json-sample.json" --parameters clusterName=MyCluster databaseName=MyDb
```

Bicep templates are transpiled into JSON ARM template before deployment. n our example, the script file is embedded inline in the JSON ARM template. For more information, see [Bicep overview](/azure/azure-resource-manager/bicep/overview).

## Storage account script

This method assumes that you already have a blob in an Azure Storage account and you provide its details (URL and [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview)) directly in the ARM template.

> [!NOTE]
> Scripts can't be loaded from storage accounts configured with an [Azure Storage firewall or Virtual Network rules](/azure/storage/common/storage-network-security?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal).

### Create the script resource

The first step is to create a script and upload it to a storage account.

1. Create a [script containing the management commands](#example-script-with-management-commands) you want to use to create the table in your database.

1. Upload your script to your Azure Storage account. You can create your storage account using the [Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal), [PowerShell](/azure/storage/blobs/storage-quickstart-blobs-portal), or Azure [CLI](/azure/storage/blobs/storage-quickstart-blobs-cli).
1. Provide access to this file using [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview). You can do this with [PowerShell](/azure/storage/blobs/storage-blob-user-delegation-sas-create-powershell), Azure [CLI](/azure/storage/blobs/storage-blob-user-delegation-sas-create-cli), or [.NET](/azure/storage/blobs/storage-blob-user-delegation-sas-create-dotnet).

### Run the script using an ARM template

In this section, you'll learn how to run a script stored in Azure Storage with an [Azure Resource Manager template](/azure/azure-resource-manager/management/overview).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
  "variables": {
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

| **Setting** | **Description** |
|--|--|
| *scriptUrl* | The URL of the blob. For example, 'https://myaccount.blob.core.windows.net/mycontainer/myblob'. |
| *scriptUrlSastoken* | A string with the [shared access signatures (SaS)](/azure/storage/common/storage-sas-overview). |
| *forceUpdateTag* | A unique string. If changed, the script will be applied again. |
| *continueOnErrors* | A flag indicating whether to continue if one of the commands fails. Default value: false. |
| *clusterName* | The name of the cluster where the script will run. |
| *databaseName* | The name of the database under which the script will run. |
| *scriptName* | The name of the script when using an external file to supply the script. |

## Limitations

* Script is only supported in Azure Data Explorer; it isn't supported in Synapse Data Explorer pools
* Two scripts can't be added, modified, or removed in parallel on the same cluster. This results in the following error: `Code="ServiceIsInMaintenance"`.  You can work around the issue by placing a dependency between the two scripts so that they're created or updated sequentially.
* To create functions with [cross-cluster queries](kusto/query/cross-cluster-or-database-queries.md) using scripts, you must set the `skipvalidation` property to `true` in the [.create function command](kusto/management/create-function.md).

## Troubleshooting

Commands run by a script resource don't appear in the results of the [.show commands-and-queries](kusto/management/commands-and-queries.md) command. You can trace the script execution using the [.show journal](kusto/management/journal.md) command.

## Related content

* [Management commands overview](kusto/management/index.md)
