---
title: Automated deployments in Azure Data Explorer
description: This article is a map to different articles on automated deployments for Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: 
ms.service: data-explorer
ms.topic: how-to
ms.date: 
---

Automated deployment is a critical part of DevOps / DataOps and enables us to:

*   Easily maintain multiple [environments](https://en.wikipedia.org/wiki/Deployment_environment)
*   Keep traces of deployments in source control
*   More easily rollback
*   Shorten development lifecycle
*   Implement Continuous Integration / Continuous Deployment (CI / CD)
*   Facilitates automated testing

In this article, we will look at different facets of deployment with Azure Data Explorer, from the infrastructure to the schema entities to the data preparation.

# ARM Templates

Azure Resource Manager Templates (ARM Templates) are [JSON files](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) or [Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview) defining the infrastructure and configuration of a deployment.

ARM templates can be used to deploy [clusters](https://docs.microsoft.com/en-us/azure/templates/microsoft.kusto/clusters?tabs=json), [databases](https://docs.microsoft.com/en-us/azure/templates/microsoft.kusto/clusters/databases?tabs=json), [data connections](https://docs.microsoft.com/en-us/azure/templates/microsoft.kusto/clusters/databases/dataconnections?tabs=json) and many other infrastructure components.  See [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-resource-manager) for an example.

ARM templates can also be used to deploy [command scripts](https://docs.microsoft.com/en-us/azure/templates/microsoft.kusto/clusters/databases/scripts?tabs=json), effectively creating a database schema and defining policies.  See [Configure a database using a Kusto Query Language script](https://docs.microsoft.com/en-us/azure/data-explorer/database-script) for an example.

[Azure Quickstart Templates](https://azure.microsoft.com/en-us/resources/templates/) also contains multiple samples.

# Terraform

Terraform is an open-source infrastructure as code software tool  providing a consistent CLI workflow to manage cloud services.  Terraform codifies cloud APIs into declarative configuration files.

Terraform offers the same capabilities as ARM templates with Azure Data Explorer and can be used to deploy [clusters](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_cluster), [databases](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_database), [data connections](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_eventgrid_data_connection) and other infrastructure components.

Terraform can also be used to deploy [command scripts](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kusto_script).

# Imperative deployment

ARM & Terraform are the two main declarative ways to deploy Azure Data Explorer infrastructure (cluster, databases, etc.).

Infrastructure can also be created imperatively using different platforms:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-cli)
* [PowerShell](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-powershell)
* SDKs
  * [.NET SDK](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-csharp)
  * [Python SDK](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-python)
  * [Go SDK](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-go)

Kusto Schema Entities can be created / updated by running Kusto scripts consisting of [Control Commands](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/).

There are many ways to automate this:

* [Kusto CLI](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-cli)
* SDKs
    * [.NET SDK](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/about-kusto-data)
    * [Python SDK](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/python/kusto-python-client-library)
    * [Java SDK](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/java/kusto-java-client-library)
    * [Node SDK](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/node/kusto-node-client-library)
    * [Go SDK](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/golang/kusto-golang-client-library)
* Tools
  * [Sync Kusto](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/synckusto)
  * [Delta Kusto](https://github.com/microsoft/delta-kusto)

[Sync Kusto](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/synckusto) is an interactive developer tool.  In the context of automated deployment, it can extract the schema / control commands script of an ADX Database (this step is manual).  That script could then be deployed automatically.

[Delta Kusto](https://github.com/microsoft/delta-kusto) is a Command Line Interface (CLI) tool designed to be invoked in a CI/CD pipeline.  It can compare two sources (a control commands script or an ADX database) and compute a *delta* script, i.e. a script of control commands that would bring one source structurally identical to the other.  It can also push that script to an ADX database.

# Data

After deploying Azure Data Explorer infrastructure & its schema entities, we often need to deploy data in its databases (e.g. to run tests or recreate an environment).

This can be automated in many ways:

* SDKs
    * [.NET SDK](https://docs.microsoft.com/en-us/azure/data-explorer/net-sdk-ingest-data)
    * [Python SDK](https://docs.microsoft.com/en-us/azure/data-explorer/python-ingest-data)
    * [Java SDK](https://docs.microsoft.com/en-us/azure/data-explorer/java-ingest-data)
    * [Node SDK](https://docs.microsoft.com/en-us/azure/data-explorer/node-ingest-data)
    * [Go SDK](https://docs.microsoft.com/en-us/azure/data-explorer/go-ingest-data)
* [LightIngest](https://docs.microsoft.com/en-us/azure/data-explorer/lightingest) (CLI tool)
* Triggering an [Azure Data Factory Pipeline](https://docs.microsoft.com/en-us/azure/data-explorer/data-factory-integration)
