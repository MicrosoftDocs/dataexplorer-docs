---
title: 'Create an Azure Data Explorer cluster and database'
description: Learn how to create an Azure Data Explorer cluster and database.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/04/2023
---

# Create an Azure Data Explorer cluster and database

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you'll learn how to create a cluster and a database using either the Azure portal, C#, Python, Go, the Azure CLI, Powershell, or an Azure Resource Manager (ARM) template.

## Prerequisites

* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

## Authentication

For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Create an Azure Data Explorer cluster

In this section, you'll create an Azure Data Explorer cluster that can contain databases and tables.

### [Portal](#tab/portal)

### [C#](#tab/csharp)

### [Python](#tab/python)

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Create an Azure Data Explorer database

In this section, you'll create a database within the cluster created in the previous section.

### [Portal](#tab/portal)

### [C#](#tab/csharp)

### [Python](#tab/python)

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Clean up resources

If you want to remove the cluster and database, you can simply delete the cluster since when you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

### [Portal](#tab/portal)

### [C#](#tab/csharp)

### [Python](#tab/python)

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Next steps
