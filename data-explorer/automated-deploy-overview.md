---
title: Automated provisioning in Azure Data Explorer
description: This article is a map to different articles for automating the provisioning of Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: vplauzon
ms.service: data-explorer
ms.topic: how-to
ms.date: 12/19/2021
---

# Automated provisioning in Azure Data Explorer

Automated provisioning is a process that allows you to quickly deploy and configure the resources you need to run your Azure Data Explorer cluster, optionally with data. It's a critical part of a DevOps or DataOps workflow. The provisioning process does not require you to manually configure the cluster, does not require human intervention, and is to easy set up.

A common use case for automated provisioning is to deploy a pre-configured cluster with data as part of a CI/CD pipeline. Some of the key benefits of doing so include the ability to:

* Easily define and maintain multiple [environments](https://en.wikipedia.org/wiki/Deployment_environment)
* Keep track of deployments in source control
* More easily rollback to previous versions
* Facilitates automated testing by provisioning dedicated test environments

This article provides an overview of the different mechanisms for automating the provisioning of Azure Data Explorer environments, including infrastructure, schema entities, and data preparation. It also provides references to the different tools and techniques used to automate the provisioning process.

## Infrastructure

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

## Deploying schema entities

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

## Ingesting Data

If you have data you need to ingest into your cluster, such as when you want to run tests or recreate an environment, you can use the following methods:

* SDKs
    * [.NET SDK](/azure/data-explorer/net-sdk-ingest-data)
    * [Python SDK](/azure/data-explorer/python-ingest-data)
    * [Java SDK](/azure/data-explorer/java-ingest-data)
    * [Node SDK](/azure/data-explorer/node-ingest-data)
    * [Go SDK](/azure/data-explorer/go-ingest-data)
* [LightIngest](/azure/data-explorer/lightingest) CLI tool
* Triggering an [Azure Data Factory Pipeline](/azure/data-explorer/data-factory-integration)

## Next steps

* Create a [cluster and database by using an Azure Resource Manager template](/azure/data-explorer/create-cluster-database-resource-manager)
* Configure a database using a [KQL script](/azure/data-explorer/database-script)
