---
title: Automated provisioning in Azure Data Explorer
description: This article is a map to different articles for automating the provisioning of Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: vplauzon
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/01/2022
---

# Automated provisioning in Azure Data Explorer

Automated provisioning is a process that allows you to quickly deploy and configure the resources you need to run your Azure Data Explorer cluster, optionally with data. It's a critical part of a DevOps or DataOps workflow. The provisioning process does not require you to manually configure the cluster, does not require human intervention, and is easy to set up.

A common use case for automated provisioning is to deploy a pre-configured cluster with data as part of a CI/CD pipeline. Some of the key benefits of doing so include the ability to:

* Easily define and maintain multiple [environments](https://en.wikipedia.org/wiki/Deployment_environment)
* Keep track of deployments in source control
* More easily rollback to previous versions
* Facilitates automated testing by provisioning dedicated test environments

This article provides an overview of the different mechanisms for automating the provisioning of Azure Data Explorer environments, including [infrastructure](#deploy-infrastructure), [schema entities](#deploy-schema-entities), and [data ingestion](#ingest-data). It also provides references to the different tools and techniques used to automate the provisioning process.

:::image type="content" source="media/automated-deploy-overview/general-flow.png" alt-text="Image showing the deployment general flow.":::

## Deploy Infrastructure

Infrastructure deployment pertains to the deployment of Azure resources including clusters, databases, data connections, and more. There are several different types of infrastructure deployments, including:

* [ARM template deployment](#arm-template-deployment)
* [Terraform deployment](#terraform-deployment)
* [Imperative deployment](#imperative-deployment)

ARM templates and Terraform scripts are the two main declarative ways to deploy Azure Data Explorer infrastructure.

### ARM Template deployment

Azure Resource Manager (ARM) Templates are [JSON](/azure/azure-resource-manager/templates/overview) or [Bicep](/azure/azure-resource-manager/bicep/overview) files defining the infrastructure and configuration of a deployment. They can be used to deploy [clusters](/azure/templates/microsoft.kusto/clusters?tabs=json), [databases](/azure/templates/microsoft.kusto/clusters/databases?tabs=json), [data connections](/azure/templates/microsoft.kusto/clusters/databases/dataconnections?tabs=json) and many other infrastructure components. For more information, see [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](/azure/data-explorer/create-cluster-database-resource-manager).

ARM templates can also be used to deploy [command scripts](/azure/templates/microsoft.kusto/clusters/databases/scripts?tabs=json) that can be used to create a database schema and define policies. For more information, see [Configure a database using a Kusto Query Language script](/azure/data-explorer/database-script).

You can find more example templates on the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) site.

### Terraform deployment

Terraform is an open-source infrastructure as code software tool providing a consistent CLI workflow to manage cloud services. Terraform codifies cloud APIs into declarative configuration files.

Terraform offers the same capabilities as ARM templates and can be used to deploy [clusters](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_cluster), [databases](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_database), [data connections](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_eventgrid_data_connection) and other infrastructure components.

Terraform can also be used to deploy [command scripts](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_script) that can be used to create a database schema and define policies.

### Imperative deployment

Infrastructure can also be deployed imperatively using any of the supported platforms:

* [Azure CLI](/azure/data-explorer/create-cluster-database-cli)
* [PowerShell](/azure/data-explorer/create-cluster-database-powershell)
* SDKs
  * [.NET SDK](/azure/data-explorer/create-cluster-database-csharp)
  * [Python SDK](/azure/data-explorer/create-cluster-database-python)
  * [Go SDK](/azure/data-explorer/create-cluster-database-go)

## Deploy schema entities

Schema entities provisioning pertains to deploying tables, functions, policies, permissions, and more. Entities can be created or updated by running scripts consisting of [control commands](kusto/management/management-best-practices.md).

You can automate schema entities deployment using the following methods:

* [ARM Templates](/azure/templates/microsoft.kusto/clusters/databases/scripts?tabs=json)
* [Terraform scripts](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_script)
* [Kusto CLI](/azure/data-explorer/kusto/tools/kusto-cli)
* SDKs
    * [.NET SDK](/azure/data-explorer/kusto/api/netfx/about-kusto-data)
    * [Python SDK](/azure/data-explorer/kusto/api/python/kusto-python-client-library)
    * [Java SDK](/azure/data-explorer/kusto/api/java/kusto-java-client-library)
    * [Node SDK](/azure/data-explorer/kusto/api/node/kusto-node-client-library)
    * [Go SDK](/azure/data-explorer/kusto/api/golang/kusto-golang-client-library)
* Tools
    * [Sync Kusto](/azure/data-explorer/kusto/tools/synckusto). This is an interactive developer tool that can be used to extract the database schema or control command script. The extracted content command script can then be used for automatic deployment.
    * [Delta Kusto](https://github.com/microsoft/delta-kusto) is a tool designed to be invoked in a CI/CD pipeline. It can compare two sources, such as database schema or control command script, and compute a *delta* control command script. The extracted content command script can then be used for automatic deployment.
    * [Azure DevOps Task](/azure/data-explorer/devops) for Azure Data Explorer

## Ingest data

If you have data you need to ingest into your cluster, such as when you want to run tests or recreate an environment, you can use the following methods:

* SDKs
    * [.NET SDK](/azure/data-explorer/net-sdk-ingest-data)
    * [Python SDK](/azure/data-explorer/python-ingest-data)
    * [Java SDK](/azure/data-explorer/java-ingest-data)
    * [Node SDK](/azure/data-explorer/node-ingest-data)
    * [Go SDK](/azure/data-explorer/go-ingest-data)
* [LightIngest](/azure/data-explorer/lightingest) CLI tool
* Triggering an [Azure Data Factory Pipeline](/azure/data-explorer/data-factory-integration)

## Example deployment using a CI/CD pipeline

In the following example, you'll use a Azure DevOps CI/CD pipeline running tools to automate the deployment of infrastructure, schema entities, and data. This is one example of a pipeline using a given set of tools. Other tools and steps can be used. For example, in a production environment you may want to create a pipeline that doesn't ingest data. You can also add further steps to the pipeline, such as running automated tests on the created cluster.

You'll use the following tools:

|Deployment type|Tool|Task|
|--|--|--|
|Infrastructure|ARM Templates|Create a cluster and a database|
|Schema entities|Kusto CLI|Create tables in the database|
|Data|LightIngest|Ingest data into one table|

:::image type="content" source="media/automated-deploy-overview/flow-sample.png" alt-text="Image showing the deployment an example flow.":::

Use the following steps to create a pipeline.

### Step 1: Create a service connection

Define a [service connection](/azure/devops/pipelines/library/service-endpoints) of type *Azure Resource Manager* pointing to the subscription and resource group where you want to deploy our cluster to. This will create the Azure Service Principal that you'll use to deploy the ARM template. You can use the same principal to deploy the schema entities and ingest data, you must explicitly pass the credentials to Kusto CLI and LightIngest tools.

### Step 2: Create a pipeline

Define the pipeline (*deploy-environ*) that will be used to deploy the cluster, create schema entities, and ingest data.

You'll want to [create secret variables](/azure/devops/pipelines/process/variables?view=azure-devops&tabs=classic%2Cbatch&preserve-view=true) for the following:

| Variable Name | Description |
|--|--|
| clusterName | Name of Azure Data Explorer cluster |
| serviceConnection | Name of Azure DevOps connection used to deploy the ARM template |
| appId | Client ID of the service principal used to interact with the cluster |
| appSecret | Secret of the service principal |
| appTenantId | Tenant ID of the service principal |
| location | Azure region where the cluster will be deployed. For example, `eastus` |

```yml
resources:
- repo: self

stages:
- stage: deploy_cluster
  displayName: Deploy cluster
  variables: []
    clusterName: specifyClusterName
    serviceConnection: specifyServiceConnection
    appId: specifyAppId
    appSecret: specifyAppSecret
    appTenantId: specifyAppTenantId
    location: specifyLocation
  jobs:
  - job: e2e_deploy
    pool:
      vmImage: windows-latest
    variables: []
    steps:
    - bash: |
        nuget install Microsoft.Azure.Kusto.Tools -Version 5.3.1
        # Rename the folder (including the most recent version)
        mv Microsoft.Azure.Kusto.Tools.* kusto.tools
      displayName: Download required Kusto.Tools Nuget package
    - task: AzureResourceManagerTemplateDeployment@3
      displayName: Deploy Infrastructure
      inputs:
        deploymentScope: 'Resource Group'
        # subscriptionId and resourceGroupName are specified in the serviceConnection
        azureResourceManagerConnection: $(serviceConnection)
        action: 'Create Or Update Resource Group'
        location: $(location)
        templateLocation: 'Linked artifact'
        csmFile: deploy-infra.json
        overrideParameters: "-clusterName $(clusterName)"
        deploymentMode: 'Incremental'
    - bash: |
        # Define connection string to cluster's database, including service principal's credentials
        connectionString="https://$(clusterName).$(location).kusto.windows.net/myDatabase;Fed=true;AppClientId=$(appId);AppKey=$(appSecret);TenantId=$(appTenantId)"
        # Execute a KQL script against the database
        kusto.tools/tools/Kusto.Cli $connectionString -script:MyDatabase.kql
      displayName: Create Schema Entities
    - bash: |
        connectionString="https://ingest-$(CLUSTERNAME).$(location).kusto.windows.net/;Fed=true;AppClientId=$(appId);AppKey=$(appSecret);TenantId=$(appTenantId)"
        kusto.tools/tools/LightIngest $connectionString -table:Customer -sourcePath:customers.csv -db:myDatabase -format:csv -ignoreFirst:true
      displayName: Ingest Data
```

### Step 3: Create an ARM template to deploy the cluster

Define the ARM template (*deploy-infra.json*) that will be used to deploy the cluster to your subscription and resource group.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "clusterName": {
            "type": "string",
            "minLength": 5
        }
    },
    "variables": {
    },
    "resources": [
        {
            "name": "[parameters('clusterName')]",
            "type": "Microsoft.Kusto/clusters",
            "apiVersion": "2021-01-01",
            "location": "[resourceGroup().location]",
            "sku": {
                "name": "Dev(No SLA)_Standard_E2a_v4",
                "tier": "Basic",
                "capacity": 1
            },
            "resources": [
                {
                    "name": "myDatabase",
                    "type": "databases",
                    "apiVersion": "2021-01-01",
                    "location": "[resourceGroup().location]",
                    "dependsOn": [
                        "[resourceId('Microsoft.Kusto/clusters', parameters('clusterName'))]"
                    ],
                    "kind": "ReadWrite",
                    "properties": {
                        "softDeletePeriodInDays": 365,
                        "hotCachePeriodInDays": 31
                    }
                }
            ]
        }
    ]
}
```

### Step 4: Create a KQL script to create the schema entities

Define the KQL script (*MyDatabase.kql*) that will be used to create the tables in the databases.

```kusto
.create table Customer(CustomerName:string, CustomerAddress:string)

//  Set the ingestion batching policy to trigger ingestion quickly
//  This is to speedup reaction time for the sample
//  Do not do this in production
.alter table Customer policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'

.create table CustomerLogs(CustomerName:string, Log:string)
```

### Step 5: Create a KQL script to ingest data

Create the CSV data file (*customer.csv*) to ingest.

```text
customerName,customerAddress
Contoso Ltd,Paris
Datum Corporation,Seattle
Fabrikam,NYC
```

:::image type="content" source="media/automated-deploy-overview/devops-job.png" alt-text="Image showing a Job run of the example flow.":::

The cluster is created using the service principal credentials you specified in the pipeline. Use the steps in [Manage Azure Data Explorer database permissions](manage-database-permissions.md) to give permissions to your users.

:::image type="content" source="media/automated-deploy-overview/deployed-database.png" alt-text="Image showing the deployed database with its two tables in Kusto Web UI.":::

You can verify the deployment by running a query against the *Customer* table. You should see the three records that were imported from the CSV file.

## Next steps

* Create a [cluster and database by using an Azure Resource Manager template](/azure/data-explorer/create-cluster-database-resource-manager)
* Configure a database using a [KQL script](/azure/data-explorer/database-script)
