---
title: Private endpoints for Azure Data Explorer
description: Discover how private endpoints enhance Azure Data Explorer security by enabling private network access and blocking public connections.
ms.reviewer: basaba
ms.topic: how-to
ms.date: 09/28/2025
---

# Private endpoints for Azure Data Explorer

Use [private endpoints](/azure/private-link/private-endpoint-overview) for your cluster to let clients on a [virtual network](/azure/virtual-network/virtual-networks-overview) securely access data over a [private link](/azure/private-link/private-link-overview). Private endpoints use private IP addresses from your virtual network address space to connect to your cluster securely. Network traffic between clients on the virtual network and the cluster traverses the virtual network and a private link on the [Microsoft backbone network](/azure/networking/microsoft-global-network), avoiding exposure to the public internet.

Private endpoints for your cluster let you:

* Secure the cluster by setting the firewall to block all connections on the public endpoint.
* Increase virtual network security by blocking data exfiltration.
* Securely connect to clusters from on-premises networks through a [VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoutes](/azure/expressroute/expressroute-locations) with private peering.

## Overview

A private endpoint is a special network interface for an Azure service in your virtual network. It's assigned IP addresses from the IP address range of your virtual network. Creating a private endpoint for your cluster provides secure connectivity between clients on your virtual network and your cluster. The private endpoint and the cluster connect using a secure private link.

:::image type="content" source="media/security-network-private-endpoint/pe-diagram-detail.png" alt-text="Screenshot of the private endpoint architecture schema for Azure Data Explorer.":::

Applications in the virtual network connect to the cluster over the private endpoint. The connection strings and authorization mechanisms are the same as those used to connect to a public endpoint.

Creating a private endpoint for a cluster in your virtual network sends a consent request to the cluster owner for approval. If the user requesting the creation of the private endpoint is also an owner of the cluster, the request is automatically approved. Cluster owners can manage consent requests and private endpoints for the cluster in the Azure portal, under **Private endpoints**.

Secure your cluster to accept connections only from your virtual network by configuring the cluster firewall to deny access through its public endpoint by default. You don't need a firewall rule to allow traffic from a virtual network that has a private endpoint because the cluster firewall only controls access for the public endpoint. In contrast, private endpoints rely on the consent flow for granting subnets access to the cluster.

## Plan the size of the subnet in your virtual network

The size of the subnet that hosts a private endpoint for a cluster can't be changed after the subnet is deployed. The private endpoint consumes multiple IP addresses in your virtual network. In extreme scenarios, like high-end ingestion, the number of IP addresses used by the private endpoint can increase. The cause of this increase is due an increased number of transient storage accounts required as staging accounts for ingesting into your cluster. If this scenario applies to your environment, plan for it when determining the subnet size.

> [!NOTE]
> The relevant ingestion scenarios that would be responsible for scaling out the transient storage accounts are [ingestion from a local file](/kusto/api/netfx/kusto-ingest-client-examples?view=azure-data-explorer&preserve-view=true#ingest-from-local-file) and [async ingestion from a blob](/kusto/api/netfx/kusto-ingest-client-examples?view=azure-data-explorer&preserve-view=true#async-ingestion-from-a-single-azure-blob).

Use the following information to help you determine the total number of IP addresses required by your private endpoint:

| Use | Number of IP addresses |
| --- | --- |
| Engine service | 1 |
| Data management service | 1 |
| Transient storage accounts | 6 |
| Azure reserved addresses | 5 |
| **Total** | **13** |

> [!NOTE]
> The absolute minimum size for the subnet is **/28** (14 usable IP addresses). If you plan to create an Azure Data Explorer cluster for extreme ingestion workloads, use a **/24** netmask to stay on the safe side.

If you created a subnet that is too small, you can delete it and create a new one with a larger address range. After recreating the subnet, create a new private endpoint for the cluster.

## Connect to a private endpoint

Clients on a virtual network using a private endpoint should use the same connection string for the cluster as clients connecting to a public endpoint. DNS resolution automatically routes connections from the virtual network to the cluster over a private link.

> [!IMPORTANT]
> Use the same connection string to connect to the cluster using private endpoints as you'd use to connect to a public endpoint. Don't connect to the cluster using its private link subdomain URL.

By default, Azure Data Explorer creates a [private DNS zone](/azure/dns/private-dns-overview) attached to the virtual network with the necessary updates for the private endpoints. However, if you're using your own DNS server, you might need to make more changes to your DNS configuration.

> [!IMPORTANT]
> For optimal configuration, we recommend that you align your deployment with the recommendations in the [Private Endpoint and DNS configuration at Scale](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale) Cloud Adoption Framework article. Use the information in the article to automate Private DNS entry creation using Azure Policies, making it easier to manage your deployment as you scale.

:::image type="content" source="media/security-network-private-endpoint/pe-dns-config-inline.png" alt-text="Screenshot of the DNS configuration page, showing the DNS configuration of the private endpoint." lightbox="media/security-network-private-endpoint/pe-dns-config-inline.png":::

Azure Data Explorer creates multiple customer visible FQDNs as part of the private endpoint deployment. In addition to the *query* and *ingestion* FQDN, it comes with several FQDNs for blob / table / queue endpoints (needed for ingestion scenarios).

## Disable public access

To increase security, you also can disable public access to the cluster in the Azure portal.

:::image type="content" source="media/security-network-private-endpoint/pe-disable-public-access.png" alt-text="Screenshot of the networking page in Azure Data Explorer showing the disable public access option." lightbox="media/security-network-private-endpoint/pe-disable-public-access.png":::

## Managed private endpoints

You can use a managed private endpoint to either enable the cluster to securely access your ingestion- or query-related services via their private endpoint. The Azure Data Explorer cluster can then access your resources via a private IP address.

:::image type="content" source="media/security-network-private-endpoint/pe-mpe.png" alt-text="Diagram of the managed private endpoint architecture for Azure Data Explorer." lightbox="media/security-network-private-endpoint/pe-mpe.png":::

> [!NOTE]
> We recommend using Managed Identity connect to [Azure Storage](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-to-trusted-azure-services) and [Azure Event Hubs](/azure/event-hubs/event-hubs-ip-filtering#trusted-microsoft-services) instead of managed private endpoints. To connect using managed identities, configure the Azure Storage or Event Hubs resources to recognize Azure Data Explorer as a trusted service. Then, use [Managed Identity](/azure/data-explorer/managed-identities-overview) to grant access by creating a network rule exception for trusted Azure services.```

### Supported services

Azure Data Explorer supports creating managed private endpoints to the following services:

* [Azure Event Hubs](/azure/event-hubs/event-hubs-about)
* [Azure IoT Hubs](/azure/iot-hub/iot-concepts-and-iot-hub)
* [Azure Storage Account](/azure/storage/blobs/storage-blobs-overview)
* [Azure Data Explorer](data-explorer-overview.md)
* [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview)
* [Azure Digital Twins](/azure/digital-twins/overview)

## Limitations

Private endpoints aren't supported for virtual network injected Azure Data Explorer clusters.

## Implications on cost

Private endpoints or managed private endpoints are resources that incur extra costs. The cost varies depending on the selected solution architecture. For more information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Related content

* [Create a Private Endpoints for Azure Data Explorer](security-network-private-endpoint-create.md)
* [Create a Managed Private Endpoints for Azure Data Explorer](security-network-managed-private-endpoint-create.md)
* [How to restrict public access to Azure Data Explorer](security-network-restrict-public-access.md)
* [How to restrict outbound access from Azure Data Explorer](security-network-restrict-outbound-access.md)
* [Connect a cluster behind a private endpoint to a Power BI service](power-bi-private-endpoint.md)
