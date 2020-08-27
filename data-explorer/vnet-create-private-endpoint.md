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

# Using Private Endpoint in your Azure Data Explorer cluster in your virtual network

Securely access the Azure Data Explorer cluster over Private link using Private Endpoint.
The Private Endpoint uses an IP address from your Azure VNet address space. Network traffic between a client on your private network and the Azure Data Explorer cluster traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public Internet.

For more information, see:

1. [What is Azure Private Endpoint?](/azure/private-link/private-endpoint-overview)
1. [What is Azure Private Link service?](https://docs.microsoft.com/azure/private-link/private-link-service-overview)
1. [Azure Private Endpoint DNS configuration](https://docs.microsoft.com/azure/private-link/private-endpoint-dns) 

## Prerequisites
1. [Azure Data Explorer cluster in your virtual network](https://docs.microsoft.com/azure/data-explorer/vnet-create-cluster-portal)

## Create Private Link Service

To create the Private Link Service for the Engine:

1. Select the **+ Create a resource** button in the upper-left corner of the portal.
1. Search for *Private Link Service*.
1. Under **Private Link Service**, select **Create**.
1. In the **Create Private Link Service** pane, fill out the following fields:

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
    | Load Balancer | Your engine Load Balancer | Select the Load Balancer that was created for your cluster engine, Load Balancer that point to your engine public IP.  The Load Balancer name should be in the following format: kucompute-{clustername}-elb|
    | Load balancer frontend IP address | Your engine public IP | Select the Load Balancer public IP address. |
    | Source NAT subnet | Cluster's subnet | Your subnet, where the cluster is deployed.
    
1. In the **Access security** pane, choose the users who can request access to your private link service.
1. Select **Review + create** to review your private link service configuration. Select **Create** to create the private link service.
1. After the private link service is created, open the resource and save the private link alias for the next step, **Create Private Endpoint**. The example alias is: **AzureDataExplorerPLS.111-222-333.westus.azure.privatelinkservice**

> [!NOTE]
> To create the Private Link Service for ingestion (Data Management), follow the steps 1-8 with the following change:
>   In the **Outbound settings** pane:
>   1. Choose the ingestion Load Balancer. The Load Balancer name should be in the following format: kudatamgmt-{clustername}-elb.
>   1. Choose your ingestion public IP.

## Create Private Endpoint

To create the Private Endpoint for the Engine:

1. Select the **+ Create a resource** button in the upper-left corner of the portal.
1. Search for *Private Endpoint*.
1. Under **Private Endpoint**, select **Create**.
1. In the **Create a Private Endpoint** pane, fill out the following fields:

    :::image type="content" source="media/vnet-create-private-endpoint/step-one-basics.png" alt-text="Create private endpoint form step 1 - basics":::

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
    | Connection method | Your Private Link Service Alias |
    | Resource ID or alias | Your Engine Private Link Service Alias. The example alias is: **AzureDataExplorerPLS.111-222-333.westus.azure.privatelinkservice**  |
    
1. Select **Review + create** to review your private endpoint configuration, and **Create** the private endpoint service.
1. To create the Private Endpoint for ingestion (Data Management), follow the same instructions with the following change:
    1. In the **Resource** pane, Choose Your ingestion (Data Management) Private Link Service Alias.

> [!NOTE]
> You can connect to the Private Link Service from multiple Private Endpoints.

## Approve your Private Endpoint in your Private Link Service

> [!NOTE]
> If you chose *auto-approve* option in the the **Access security** pane when creating the Private Link Service, this step is not mandatory.

1. In your Private Link Service, choose **Private endpoint connections** under settings.
1. Choose your Private Endpoint from the connections list, and select **Approve**.

:::image type="content" source="media/vnet-create-private-endpoint/private-link-approve.png" alt-text="Approval step to create private endpoint"::: 

## DNS configuration for your Private Endpoint

When you deploy an Azure Data Explorer cluster in your virtual network, we update the DNS entry to point to the canonical name with *privatelink* between the record name and the zone host name. This entry is updated both for Engine and ingestion (Data Management).

For example, if your Engine DNS name is myadx.westus.kusto.windows.net the name resolution will be:

|Name |Type |Value |Remark |
|-----|-----|------|-------|
|myadx.westus.kusto.windows.net|CNAME|myadx.privatelink.westus.kusto.windows.net|
|myadx.privatelink.westus.kusto.windows.net|A|40.122.110.154|This value is your Engine public IP address, which was provided by you when you created the cluster.|

Set up a private DNS server or an Azure private DNS zone. For tests, you can modify the host entry of your test machine.
Create the following DNS zone:**privatelink.region.kusto.windows.net**. The DNS zone in the example is: **privatelink.westus.kusto.windows.net**. 
Register the record for your Engine with a A record and the Private Endpoint IP.

For example, the name resolution will be:

|Name |Type |Value |Remark |
|-----|-----|------|-------|
|myadx.westus.kusto.windows.net|CNAME|myadx.privatelink.westus.kusto.windows.net|
|myadx.privatelink.westus.kusto.windows.net|A|10.3.0.9|This value is your Private Endpoint IP (that you already connected to the Engine private link service)|

After setting this DNS configuration, you can reach your Engine inside your Virtual Network privately with the following URL: myadx.region.kusto.windows.net.

To reach ingestion (Data Management) privately, register the record for your ingestion (Data Management) with an A record and the ingestion Private Endpoint IP.
