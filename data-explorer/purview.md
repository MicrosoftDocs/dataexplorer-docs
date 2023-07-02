---
title: Integrate Azure Data Explorer with Microsoft Purview
description: Learn how to use Azure Data Explorer with Purview.
ms.topic: conceptual
ms.date: 05/29/2023
---

# Integrate Azure Data Explorer with Microsoft Purview

Microsoft Purview simplifies data governance by offering a unified service to manage your data from various sources. This article explains how to integrate Azure Data Explorer with Purview to achieve improved governance across your data ecosystem, enhancing your ability to manage and leverage your data effectively.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Connect to Azure Data Explorer in Purview

For information on how to connect to Azure Data Explorer in Purview, see the following topics:

* [Connect to and manage Azure Data Explorer in Purview](/azure/purview/register-scan-azure-data-explorer)
* [HowTo: Azure Data Explorer integration into Azure Purview](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/howto-azure-data-explorer-integration-into-azure-purview/ba-p/1963911)

## Example use case

The following section describes an example use case for integrating Azure Data Explorer with Purview.

### View resource properties in multi-tenant deployment

In Purview, you can configure scans on multiple clusters to gain insights into various cluster resources and their properties. This feature allows you to easily move between scans and get a summary of different cluster resources. For example, you can identify which databases are located in specific regions across multiple clusters.

To view the properties of an Azure Data Explorer resource, follow these steps:

1. [Set up a scan of your cluster in Purview](/azure/purview/register-scan-azure-data-explorer#scan).
1. Select the desired resource.

    > [!NOTE]
    > Tables have limited metadata. For more details, select **Related assets** and then select the parent database.

1. Select the **Properties** tab. View the resource **createTime**, **location**, **resourceGroupName**, **subscriptionId**, and more.
