---
title: Private Endpoints for Azure Data Explorer
description: 'In this article you will learn about private endpoints for Azure Data Explorer.'
author: herauch
ms.author: herauch
ms.reviewer: basaba
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/09/2022
---

# Private Endpoints for Azure Data Explorer (public preview)

You can use [private endpoints](/azure/private-link/private-endpoint-overview) for your Azure Data Explorer cluster to allow clients on a virtual network (VNet) to securely access data over a [Private Link](/azure/private-link/private-link-overview). The private endpoint uses IP addresses from the VNet address space for your Azure Data Explorer service. Network traffic between the clients on the VNet and the ADX cluster traverses over the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

Using private endpoints for your Azure Data Explorer cluster enables you to:

* Secure your ADX cluster by configuring the firewall to block all connections on the public endpoint for the ADX.
* Increase security for the virtual network (VNet), by enabling you to block exfiltration of data from the VNet.
* Securely connect to ADX clusters from on-premises networks that connect to the VNet using [VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoutes](/azure/expressroute/expressroute-locations) with private-peering.

## Conceptual Overview

A private endpoint is a special network interface for an Azure service in your [Virtual Network](/azure/virtual-network/virtual-networks-overview) (VNet). When you create a private endpoint for your ADX cluster, it provides secure connectivity between clients on your VNet and your ADX. The private endpoint is assigned with IP addresses from the IP address range of your VNet. The connection between the private endpoint and the ADX uses a secure private link.

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-diagram-detail.png)

Applications in the VNet can connect to the ADX over the private endpoint seamlessly, using the same connection strings and authorization mechanisms that they would use otherwise.

When you create a private endpoint for ADX in your VNet, a consent request is sent for approval to the ADX owner. If the user requesting the creation of the private endpoint is also an owner of the ADX, this consent request is automatically approved.

ADX owners can manage consent requests and the private endpoints, through the 'Private endpoints' tab for the ADX in the Azure portal.

You can secure your ADX to only accept connections from your VNet, by configuring the ADX firewall to deny access through its public endpoint by default. You don't need a firewall rule to allow traffic from a VNet that has a private endpoint, since the ADX firewall only controls access through the public endpoint. Private endpoints instead rely on the consent flow for granting subnets access to the ADX.

## Plan subnet size in your VNet

The size of the subnet used to host an Private Endpoint for Azure Data Explorer cluster can't be altered after the subnet is deployed. The Private Endpoint consumes multiple IP addesses in your virtual network. In extreme scenarios (i.e. highend ingestion) the number of IP addresses being consumed by the Private Endpoint might grow. Planning the the size for the subnet is crucial for that purpose.

The variable part of the consumed IP addresses is caused by transient storage accounts which are needed as staging accounts for ingestion into Azure Data Explorer.

The total number of IP addresses consumed by the Private Endpoint:

| Use | Number of addresses |
| --- | --- |
| Engine service | 1 |
| Data management service | 1 |
| Transient storage accounts | 6 |
| Azure reserved addresses | 5 |
| **Total** | **13** |

> [!NOTE]
> The absolute minimum size for the subnet must be **/28** (14 usable IP addresses)

## Connecting to a private endpoint

Clients on a VNet using the private endpoint should use the same connection string for the ADX, as clients connecting to the public endpoint. We rely upon DNS resolution to automatically route the connections from the VNet to the ADX over a private link.

Important: Use the same connection string to connect ADX using private endpoints, as you'd use otherwise. Don't connect to the ADX using its privatelink subdomain URL.

Azure Data Explorer creates a [private DNS zone](/azure/dns/private-dns-overview) attached to the VNet with the necessary updates for the private endpoints, by default. However, if you're using your own DNS server, you may need to make additional changes to your DNS configuration.

![DNS configuration of the private endpoint.](media/security-network-private-endpoint/pe-dns-config.png)

ADX creates multiple customer visible FQDNs as part of the private endpoint deployment. Alongside the Query/Ingestion FQDN it comes with several FQDNs for blob / table / queue endpoints (needed for ingestion scenarios)

## Disable public access

To increase security, you also can disable the public access for the Azure Data Explorer Cluster. You can disable the public internet access manually in the portal.

![Disable public access.](media/security-network-private-endpoint/pe-disable-public-access.png)

## Managed private endpoints

With the help of a managed private endpoint, you will enable the ADX cluster to securely access your event hub via its private endpoint. When you create an ADX cluser, Azure will provision an ADX managed virtual network in the microsoft backbone infrastructure. This Vnet is isolated and hidden to you as you just consume ADX as a PaaS resource. You can create a managed private endpoint via the REST API to provision a private endpoint in the same virtual network where the root service resources of the ADX cluster reside in. This will enable the service to access event hub privately.

![Managed Private Endpoint schema.](media/security-network-private-endpoint/pe-mpe.png)

### Supported services

Azure Data Explorer supports creating Managed Private Endpoints to the following services:

* [Azure Event Hubs](/azure/event-hubs/event-hubs-about)
* [Azure IoT Hubs](/azure/iot-hub/iot-concepts-and-iot-hub)
* [Azure Storage Account](/azure/storage/blobs/storage-blobs-overview)
* [Azure Data Explorer](data-explorer-overview.md)
* [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview)
* [Azure Digital Twins](/azure/digital-twins/overview)
* [Azure Monitor](/azure/azure-monitor/overview)

## Limitations

* Private endpoints are not supported for virtual network injected Azure Data Explorer clusters

## Next steps

* [Create a Private Endpoints for Azure Data Explorer](security-network-private-endpoint-create.md)
* [Create a Managed Private Endpoints for Azure Data Explorer](security-network-managed-private-endpoint-create.md)
* [Howto restrict public access to Azure Data Explorer](security-network-restrict-public-access.md)
* [Howto restrict outbound access from Azure Data Explorer](security-network-restrict-outbound-access.md)
