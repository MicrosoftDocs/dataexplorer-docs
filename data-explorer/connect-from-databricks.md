---
title: Connect to Azure Data Explorer from Azure Databricks
description: This topic shows you how to use Azure Databricks to access data from Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: maraheja
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/21/2020

# Customer intent: I want to use Azure Databricks to access data from Azure Data Explorer.
---

# Connect to Azure Data Explorer from Azure Databricks

[Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/what-is-azure-databricks) is an Apache Spark-based analytics platform that's optimized for the Microsoft Azure platform. This article shows you how to use Azure Databricks to access data from Azure Data Explorer. There are several ways to authenticate with Azure Data Explorer, including a device login and an Azure Active Directory (Azure AD) app.
 
## Prerequisites

- [Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
- [Create an Azure Databricks workspace](/azure/azure-databricks/quickstart-create-databricks-workspace-portal#create-an-azure-databricks-workspace). Under **Azure Databricks Service**, in the **Pricing Tier** drop-down list, select **Premium**. This selection enables you to use Azure Databricks secrets to store your credentials and reference them in notebooks and jobs.

- [Create a cluster](https://docs.azuredatabricks.net/user-guide/clusters/create.html) in Azure Databricks with the default settings.

 ## Install the Kusto Spark connector on your Azure Databricks cluster

To install the [spark-kusto-connector](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/spark-kusto-connector) on your Azure Databricks cluster:

1. Go to your Azure Databricks workspace and [create a library](https://docs.azuredatabricks.net/user-guide/libraries.html#create-a-library).
1. Search for the *spark-kusto-connector* package on Maven Central, install the latest version, and attach to your cluster. 

## Connect to Azure Data Explorer by using a device authentication

[Sample code](https://github.com/Azure/azure-kusto-spark/blob/master/samples/src/main/python/pyKusto.py).

## Connect to Azure Data Explorer by using an Azure AD app

1. Create Azure AD app by [provisioning an Azure AD application](kusto/management/access-control/how-to-provision-aad-app.md).
1. Grant access to your Azure AD app in your Azure Data Explorer database as follows:

    ```kusto
    .set database <DB Name> users ('aadapp=<AAD App ID>;<AAD Tenant ID>') 'AAD App to connect Spark to ADX
    ```

    | Parameter | Description |
    | - | - |
    | `DB Name` | your database name |
    | `AAD App ID` | your Azure AD app ID |
    | `AAD Tenant ID` | your Azure AD tenant ID |

### Find your Azure AD tenant ID

To authenticate an application, Azure Data Explorer uses your Azure AD tenant ID. 
To find your tenant ID, use the following URL. Substitute your domain for *YourDomain*.

```
https://login.windows.net/<YourDomain>/.well-known/openid-configuration/
```

For example, if your domain is *contoso.com*, the URL is: [https://login.windows.net/contoso.com/.well-known/openid-configuration/](https://login.windows.net/contoso.com/.well-known/openid-configuration/). Select this URL to see the results. The first line is as follows: 

```
"authorization_endpoint":"https://login.windows.net/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize"
```

Your tenant ID is `6babcaad-604b-40ac-a9d7-9fd97c0b779f`. 

### Store and secure your Azure AD app ID and key (optional)  

Store and secure your Azure AD app ID and key by using Azure Databricks [secrets](https://docs.azuredatabricks.net/user-guide/secrets/index.html#secrets) as follows:

1. [Set up the CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#set-up-the-cli).
1. [Install the CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#install-the-cli). 
1. [Set up authentication](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#set-up-authentication).
1. Configure the [secrets](https://docs.azuredatabricks.net/user-guide/secrets/index.html#secrets) by using the following sample commands:

    ```databricks secrets create-scope --scope adx```

    ```databricks secrets put --scope adx --key myaadappid```

    ```databricks secrets put --scope adx --key myaadappkey```

    ```databricks secrets list --scope adx```

### Sample Code

1. [Sample code](https://github.com/Azure/azure-kusto-spark/blob/master/samples/src/main/python/pyKusto.py). 
1. Update the placeholder values with your cluster name, database name, table name, Azure AD tenant ID, AAD App ID, and AAD App Key. If you are storing your credentials in databricks secrets store, update the code accordingly to retrieve values from dbutils.
