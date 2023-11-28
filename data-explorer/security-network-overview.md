---
title: Network security for Azure Data Explorer cluster
description: 'Learn about the different options to secure your Azure Data Explorer cluster applying network security measures.'
ms.reviewer: basaba
ms.topic: reference
ms.date: 04/05/2022
---

# Network security for Azure Data Explorer

Azure Data Explorer clusters are designed to be accessible using public URLs. Anyone with valid identity on a cluster can access it from any location. As an organization, securing data may be one your highest priority tasks. As such, you may want to limit and secure access to your cluster, or even only allow access to your cluster through your private virtual network. You can use one of the following options to achieve this goal:

* [Private endpoint](#private-endpoint) (recommended)
* [Virtual network (VNet) injection](#virtual-network-injection)

We highly recommended using *private endpoints* to secure network access to your cluster. This option has many advantages over *virtual network injection* that results in lower maintenance overhead, including a simpler deployment process and being more robust to virtual network changes.

The following section explains how to secure your cluster using private endpoints and virtual network injection.

## Private endpoint

A private endpoint is a network interface that uses private IP addresses from your virtual network. This network interface connects you privately and securely to your cluster powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.

:::image type="content" source="media/security-network-private-endpoint/pe-diagram-detail.png" alt-text="Diagram showing the schema of the private endpoint architecture.":::

To successfully deploy your cluster into a private endpoint, you only require a set of private IP addresses.

> [!NOTE]
> Private endpoints aren't supported for a cluster that's injected into a virtual network.

## Virtual network injection

> [!IMPORTANT]
> Consider a Azure Private Endpoint based solution for implementing network security with Azure Data Explorer. It is less error-prone and provides [feature parity](security-network-overview.md#comparison-and-recommendation).

Virtual network injection allows you to directly deploy your cluster into a virtual network. The cluster can be privately accessed from within the virtual network and over a VPN gateway, or Azure ExpressRoute from on-premises networks. Injecting a cluster into a virtual network enables you to manage all of its traffic. This includes the traffic to access the cluster and all of its data ingestion or exports. Additionally, you're responsible to allow Microsoft to access the cluster for management and health monitoring.

:::image type="content" source="media/vnet-deployment/vnet-diagram.png" alt-text="Diagram showing the schema of the virtual network injection architecture.":::

To successfully inject your cluster into a virtual network, you must configure your virtual network to meet the following requirements:

* You must delegate the subnet to *Microsoft.Kusto/clusters* to enable the service and to define its preconditions for deployment in the form of *network intent policies*
* The subnet needs to be well scaled to support future growth of the cluster's usage
* Two public IP addresses are required to manage the cluster and ensure that it's healthy
* Optionally, if you're using an additional firewall appliance to secure your network, you must allow your cluster to connect to a set of Fully Qualified Domain Names (FQDNs) for outgoing traffic

## Private endpoint vs. virtual network injection

Virtual network injection can lead to a high maintenance overhead, as a result of implementation details such as maintaining FQDN lists in firewalls or deploying public IP addresses in a restricted environment. Therefore, we recommend using a private endpoint to connect to your cluster.

The following table shows how network security related features could be implemented based on a cluster injected into a virtual network or secured using a private endpoint.

|   Feature | Private endpoint   | Virtual network injection   |
|--- |--- |--- |
| Inbound IP address filtering | [Manage public access](security-network-restrict-public-access.md) | [Create an inbound Network Security Group rule](/azure/virtual-network/network-security-groups-overview) |
| Transitive access to other services (Storage, Event Hubs, etc.) | [Create a managed private endpoint](security-network-managed-private-endpoint-create.md) | [Create a private endpoint to the resource](./vnet-endpoint-storage-event-hub.md) |
| Restricting outbound access | Use [Callout policies or the AllowedFQDNList](security-network-restrict-outbound-access.md) | Use a [virtual appliance](/azure/firewall/tutorial-firewall-deploy-portal) to the subnet's filter outgoing traffic |

## Related content

* [Private Endpoints for Azure Data Explorer](security-network-private-endpoint.md)
* [Deploy Azure Data Explorer into your Virtual Network](vnet-deployment.md)