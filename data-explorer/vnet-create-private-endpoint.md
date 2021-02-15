---
title: Using Private Endpoint in your Azure Data Explorer cluster in your virtual network
description: Using Private Endpoint in your Azure Data Explorer cluster in your virtual network
author: orspod
ms.author: orspodek
ms.reviewer: elbirnbo
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/09/2020
---

# Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network (preview)

Use a Private Link with a Private Endpoint to securely access your Azure Data Explorer cluster in your virtual network (VNet). 

To set up your [Private Link service](/azure/private-link/private-link-service-overview), use a Private Endpoint with an IP address from your Azure VNet address space. [Azure Private Endpoint](/azure/private-link/private-endpoint-overview) uses a private IP address from your VNet to connect you privately and securely to Azure Data Explorer. You will also need to reconfigure the [DNS configuration](/azure/private-link/private-endpoint-dns) on your cluster to connect using your Private Endpoint. With this setup, network traffic between a client on your private network and the Azure Data Explorer cluster travels over the VNet and a [Private Link](/azure/private-link/) on the Microsoft backbone network, removing exposure from the public internet. This article shows you how to create and configure a Private Endpoint in your cluster for both query (Engine) and ingestion (data management).


## Prerequisites

* Create an [Azure Data Explorer cluster in your virtual network](./vnet-create-cluster-portal.md)
* Disable network policies:
* In the Azure Data Explorer cluster virtual network, disable the [Private Link Service policy](/azure/private-link/disable-private-link-service-network-policy).
* In the Private Endpoint virtual network, which can be the same as the Azure Data Explorer cluster virtual network, disable the [Private Endpoint policy](/azure/private-link/disable-private-endpoint-network-policy).

## Create Private Link service

To securely link to all services on your cluster, you need to create the [Private Link service](/azure/private-link/private-link-service-overview) twice: once for query (Engine), and once for ingestion (data management).

1. Select the **+ Create a resource** button in the upper-left corner of the portal.
1. Search for *Private Link service*.
1. Under **Private Link service**, select **Create**.

    :::image type="content" source="media/vnet-create-private-endpoint/create-service.gif" alt-text="Gif that shows you the first three steps of creating a private link service in Azure Data Explorer Portal":::

1. In the **Create private link service** pane, fill out the following fields:

    :::image type="content" source="media/vnet-create-private-endpoint/private-link-basics.png" alt-text="Tab 1 in create private link service - Basics":::

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that holds your virtual network cluster.|
    | Resource group | Your resource group | Select the resource group that hold your virtual network cluster. |
    | Name | AzureDataExplorerPLS | Choose a name that identifies your private link service in the resource group. |
    | Region | Same as virtual network | Select the region that matches your virtual network region. |

1. In the **Outbound settings** pane, fill out the following fields:

    :::image type="content" source="media/vnet-create-private-endpoint/private-link-outbound.png" alt-text="Private link tab 2 - Outbound settings":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Load balancer | Your engine or *data management* Load balancer | Select the Load balancer that was created for your cluster engine. You can use either the external or internal Load balancer.  <br> **The Load balancer's engine name will be in the following format:** <br> External Load balancer: *kucompute-{clustername}-elb* <br> Internal Load balancer: *kucompute-{clustername}-ilb* <br> **The Load balancer's data management name will be in the following format:** <br> kudatamgmt-{clustername}-elb <br> kudatamgmt-{clustername}-ilb*|
    | Load balancer frontend IP address | Your engine or data management IP. | Select the Load balancer IP address. |
    | Source NAT subnet | Cluster's subnet | Your subnet, where the cluster is deployed.
    
1. In the **Access security** pane, choose the users who can request access to your private link service.
1. Select **Review + create** to review your private link service configuration. Select **Create** to create the private link service.
1. After the private link service is created, open the resource and save the private link alias for the next step, **Create Private Endpoint**. The example alias is: *AzureDataExplorerPLS.111-222-333.westus.azure.privatelinkservice*

## Create Private Endpoint

To securely link to all services on your cluster, you need to create the [Private Endpoint](/azure/private-link/private-endpoint-overview) twice: once for query (Engine), and once for ingestion (data management).

1. Select the **+ Create a resource** button in the upper-left corner of the portal.
1. Search for *Private Endpoint*.
1. Under **Private Endpoint**, select **Create**.
1. In the **Create a Private Endpoint** pane, fill out the following fields:

    :::image type="content" source="media/vnet-create-private-endpoint/step-one-basics.png" alt-text="Create Private Endpoint form step 1 - basics":::

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your Private Endpoint.|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Name | AzureDataExplorerPE | Choose a name that identifies your virtual network in the resource group.
    | Region | *West US* | Select the region that best meets your needs.
    
1. In the **Resource** pane, fill out the following fields:

    :::image type="content" source="media/vnet-create-private-endpoint/step-two-resource.png" alt-text="Create virtual network form step 2- Resource":::

    **Setting** | **Value**
    |---|---|
    | Connection method | Your Private Link service Alias |
    | Resource ID or alias | Your Engine Private Link service Alias. The example alias is: *AzureDataExplorerPLS.111-222-333.westus.azure.privatelinkservice*  |
    
1. Select **Review + create** to review your Private Endpoint configuration, and **Create** the Private Endpoint service.
1. To create the Private Endpoint for ingestion (data management), follow the same instructions with the following change:
    1. In the **Resource** pane, Choose Your ingestion (data management) Private Link service Alias.

> [!NOTE]
> You can connect to the Private Link service from multiple Private Endpoints.

## Approve your Private Endpoint

> [!NOTE]
> If you chose *auto-approve* option in the the **Access security** pane when creating the Private Link service, this step is not mandatory.

1. In your Private Link service, choose **Private Endpoint connections** under settings.
1. Choose your Private Endpoint from the connections list, and select **Approve**.

:::image type="content" source="media/vnet-create-private-endpoint/private-link-approve.png" alt-text="Approval step to create Private Endpoint"::: 

## Set DNS configuration

When you deploy an Azure Data Explorer cluster in your virtual network, we update the [DNS entry](/azure/private-link/private-endpoint-dns) to point to the canonical name with *privatelink* between the record name and the zone host name. This entry is updated both for Engine and ingestion (data management). 

For example, if your Engine DNS name is myadx.westus.kusto.windows.net the name resolution will be:

* **name**: myadx.westus.kusto.windows.net
    <br> **type**: CNAME
    <br> **value**: myadx.privatelink.westus.kusto.windows.net
* **name**: myadx.privatelink.westus.kusto.windows.net
    <br> **type**: A
    <br> **value**: 40.122.110.154
    > [!NOTE]
    > This value is your query (Engine) public IP address, which was provided by you when you created the cluster.

Set up a private DNS server or an Azure private DNS zone. For tests, you can modify the host entry of your test machine.

Create the following DNS zone: **privatelink.region.kusto.windows.net**. The DNS zone in the example is: *privatelink.westus.kusto.windows.net*. 
Register the record for your Engine with a A record and the Private Endpoint IP.

For example, the name resolution will be:

* **name**: myadx.westus.kusto.windows.net
    <br>**type** : CNAME 
    <br>**value**: myadx.privatelink.westus.kusto.windows.net
* **name**: myadx.privatelink.westus.kusto.windows.net
    <br>**type**: A
    <br>**value**: 10.3.0.9
    > [!NOTE]
    > This value is your Private Endpoint IP. You have already connected the IP to the query (Engine) private link service.

After setting this DNS configuration, you can reach the query (Engine) inside your Virtual Network privately with the following URL: myadx.region.kusto.windows.net.

To reach ingestion (data management) privately, register the record for your ingestion (data management) with an A record and the ingestion Private Endpoint IP.

## Next steps

* [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
* [Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network](vnet-deploy-troubleshoot.md)
