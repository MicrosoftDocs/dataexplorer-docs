---
title: Network security for Azure Data Explorer
description: 'In this article you will learn about the different options to secure your Azure Data Explorer cluster applying network security measures.'
author: herauch
ms.author: herauch
ms.reviewer: basaba
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2022
---

# Network security for Azure Data Explorer

Keeping your data secure in the cloud should be one of the most prioritized task of an IT department. Today, Azure Data Explorer is accessible through Internet-reachable URLs. Anyone with valid identity on the cluster can access it from any location. In some scenarios, it's necessary that Azure Data Explorer can only be accessed from the private virtual network. There are essentially two options to accomplish this connectivity:

1. Virtual Network Injection
1. Private Endpoints

This document provides an overview of those two options.

## Virtual Network Injection

Virtual Network Injection allows you to directly deploy Azure Data Explorer into a Virtual Network. The service can be privately accessed from within the virtual network and over VPN/ER from on-premises. Injecting a cluster into a virtual network enables you to manage all of its traffic. This includes the traffic to access the cluster and all of its data ingestions or exports. Additionally you are responsible to allow Microsoft to access the cluster for management and health monitoring.

![Schematic virtual network injection architecture.](media/vnet-deployment/vnet-diagram.png)

To achive a successful injection of Azure Data Explorer into a virtual network several requirements need to be in place

* You must delegate the subnet to Microsoft.Kusto/clusters to allow Microsoft to  enable the service to define its pre-conditions for deployment in the form of Network Intent Policies
* The subnet needs to be well scaled to support future growth of the Azure Data Explorer usage
* Two public IPs are needed in order to provide access for Microsoft to manage the cluster and ensure that its health is ok
* In case you are using an additional firewall applicance to secure your network you must allow Azure Data Explorer to connect to a set of Fully Qualified Domain Names (FQDNs) for outgoing traffic

## Private Endpoints (public preview)

A private endpoint is a network interface that uses private IP addresses from your virtual network. This network interface connects you privately and securely to Azure Data Explorer powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-diagram-detail.png)

Besides the need for a set of private IP addresses for the private endpoint there are no other requirements for a successful deployment.

Private endpoints are not supported for ADX cluster which have been injected into a virtual network.

## Comparison and recommendation

The following table shows how network security related features could be implemented based on an Azure Data Explorer cluster injected into a virtual netowrk or secured using a private endpoint.

|   Feature | Private Endpoint   | Virtual Network Injection   |
|--- |--- |--- |
| Inbound IP filtering | [Restrict public access](security-network-restrict-public-access.md) | [Create an inbound Network Security Group rule](/azure/virtual-network/network-security-groups-overview)   |
| Transitive access to other services (Storage, EventHub, etc) | [Create a managed private endpoint](security-network-managed-private-endpoint-create.md) | [Create a private endpoint to the resource](/azure/data-explorer/vnet-endpoint-storage-event-hub)   |
| Restricting outbound access | Use [Callout policies or the AllowedFQDNList](security-network-restrict-outbound-access.md)	| Use a [virtual appliance](/azure/firewall/tutorial-firewall-deploy-portal) to filter outgoing traffic of the subnet |

It's recommended to use a private endpoint based approach to connect privately to your Azure Data Explorer cluster. Maintaining FQDN lists in firewalls or deploying public IP addresses in a restricted environment lead to a high maintenance effort for a virtual network injection based deployment.

## Next steps

* [Private Endpoints for Azure Data Explorer](secuurity-network-private-endpoint.md)
* [Deploy Azure Data Explorer into your Virtual Network](vnet-deployment.md)
