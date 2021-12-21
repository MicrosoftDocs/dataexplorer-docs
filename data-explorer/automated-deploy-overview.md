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

Automated provisioning is a process that allows you to quickly deploy and configure the resources you need to run your Azure Data Explorer cluster, optionally with data. It's a critical part of a DevOps or DataOps workflow. The provisioning process does not require you to manually configure the cluster, does not require human intervention, and it's to easy set up.

Some of the key benefits of automated provisioning include:

* Easily define and maintain multiple [environments](https://en.wikipedia.org/wiki/Deployment_environment)
* Implement Continuous Integration / Continuous Deployment (CI / CD)
* Keep traces of deployments in source control - CI/CD
* More easily rollback - CI/CD/Source Control
* Facilitates automated testing - build in dedicated test environments

This article provides an overview of the different mechanisms and tools for automating the provisioning of Azure Data Explorer including infrastructure, schema entities, and data preparation.

<!-- 

Link between  infrastructure and schema entities/ingest in overall script. Where/how is it defined.
Example command to create schema entities and ingest data.

-->

## Infrastructure

Infrastructure deployment pertains to the deployment of Azure resources:  clusters, databases, data connections, etc.

### ARM Templates

Azure Resource Manager Templates (ARM Templates) are [JSON files](/azure/azure-resource-manager/templates/overview) or [Bicep](/azure/azure-resource-manager/bicep/overview) defining the infrastructure and configuration of a deployment.

ARM templates can be used to deploy [clusters](/azure/templates/microsoft.kusto/clusters?tabs=json), [databases](/azure/templates/microsoft.kusto/clusters/databases?tabs=json), [data connections](/azure/templates/microsoft.kusto/clusters/databases/dataconnections?tabs=json) and many other infrastructure components.  See [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](/azure/data-explorer/create-cluster-database-resource-manager) for an example.

ARM templates can also be used to deploy [command scripts](/azure/templates/microsoft.kusto/clusters/databases/scripts?tabs=json), effectively creating a database schema and defining policies.  See [Configure a database using a Kusto Query Language script](/azure/data-explorer/database-script) for an example.

[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) also contains multiple samples.

### Terraform

Terraform is an open-source infrastructure as code software tool  providing a consistent CLI workflow to manage cloud services.  Terraform codifies cloud APIs into declarative configuration files.

Terraform offers the same capabilities as ARM templates with Azure Data Explorer and can be used to deploy [clusters](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_cluster), [databases](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_database), [data connections](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_eventgrid_data_connection) and other infrastructure components.

Terraform can also be used to deploy [command scripts](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_script).

### Deploying infrastructure imperatively

ARM & Terraform are the two main declarative ways to deploy Azure Data Explorer infrastructure (cluster, databases, etc.).

Infrastructure can also be created imperatively using different platforms:

* [Azure CLI](/azure/data-explorer/create-cluster-database-cli)
* [PowerShell](/azure/data-explorer/create-cluster-database-powershell)
* SDKs
  * [.NET SDK](/azure/data-explorer/create-cluster-database-csharp)
  * [Python SDK](/azure/data-explorer/create-cluster-database-python)
  * [Go SDK](/azure/data-explorer/create-cluster-database-go)

## Deploying Schema Entities

Kusto Schema Entities deployment is about deployment Kusto tables, functions, policies, permissions, etc.  .  Entities can be created / updated by running Kusto scripts consisting of [Control Commands](/azure/data-explorer/kusto/management/).

There are many ways to automate this:

* [Kusto CLI](/azure/data-explorer/kusto/tools/kusto-cli)
* SDKs
    * [.NET SDK](/azure/data-explorer/kusto/api/netfx/about-kusto-data)
    * [Python SDK](/azure/data-explorer/kusto/api/python/kusto-python-client-library)
    * [Java SDK](/azure/data-explorer/kusto/api/java/kusto-java-client-library)
    * [Node SDK](/azure/data-explorer/kusto/api/node/kusto-node-client-library)
    * [Go SDK](/azure/data-explorer/kusto/api/golang/kusto-golang-client-library)
* [ARM Templates](/azure/templates/microsoft.kusto/clusters/databases/scripts?tabs=json)
* [Terraform scripts](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_script)
* Tools
  * [Sync Kusto](/azure/data-explorer/kusto/tools/synckusto)
  * [Delta Kusto](https://github.com/microsoft/delta-kusto)
  * [Azure DevOps Task](/azure/data-explorer/devops) for Azure Data Explorer

[Sync Kusto](/azure/data-explorer/kusto/tools/synckusto) is an interactive developer tool.  In the context of automated deployment, it can extract the schema / control commands script of an ADX Database (this step is manual).  That script could then be deployed automatically.

[Delta Kusto](https://github.com/microsoft/delta-kusto) is a Command Line Interface (CLI) tool designed to be invoked in a CI/CD pipeline.  It can compare two sources (a control commands script or an ADX database) and compute a *delta* script, i.e. a script of control commands that would bring one source structurally identical to the other.  It can also push that script to an ADX database.

## Ingesting Data

Finally, after deploying Azure Data Explorer infrastructure & its schema entities, we often need to ingest data in its databases, e.g. to run tests or recreate an environment.

This can be automated in many ways:

* SDKs
    * [.NET SDK](/azure/data-explorer/net-sdk-ingest-data)
    * [Python SDK](/azure/data-explorer/python-ingest-data)
    * [Java SDK](/azure/data-explorer/java-ingest-data)
    * [Node SDK](/azure/data-explorer/node-ingest-data)
    * [Go SDK](/azure/data-explorer/go-ingest-data)
* [LightIngest](/azure/data-explorer/lightingest) (CLI tool)
* Triggering an [Azure Data Factory Pipeline](/azure/data-explorer/data-factory-integration)

## Next steps

* Create an Azure Data Explorer [cluster and database by using an Azure Resource Manager template](/azure/data-explorer/create-cluster-database-resource-manager)
* Configure a database using a [Kusto Query Language script](/azure/data-explorer/database-script)
