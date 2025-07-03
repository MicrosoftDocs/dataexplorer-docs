---
title: Network security for Azure Data Explorer cluster
description: 'Learn about the different options to secure your Azure Data Explorer cluster applying network security measures.'
ms.reviewer: basaba
ms.topic: reference
ms.date: 06/02/2025
---

# Network security for Azure Data Explorer

Azure Data Explorer clusters are designed to be accessible using public URLs. Anyone with valid identity on a cluster can access it from any location. As an organization, securing data may be one your highest priority tasks. As such, you may want to limit and secure access to your cluster, or even only allow access to your cluster through your private virtual network. To achieve this goal, use:

* [Private endpoint](#private-endpoint)

The following section explains how to secure your cluster using private endpoints.

## Private endpoint

A private endpoint is a network interface that uses private IP addresses from your virtual network. This network interface connects you privately and securely to your cluster powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.

:::image type="content" source="media/security-network-private-endpoint/pe-diagram-detail.png" alt-text="Diagram showing the schema of the private endpoint architecture.":::

To successfully deploy your cluster into a private endpoint, you only require a set of private IP addresses.

## Network security features with private endpoints

The following table shows how network security related features can be implemented using a private endpoint:

|   Feature | Private endpoint   |
|--- |--- |
| Inbound IP address filtering | [Manage public access](security-network-restrict-public-access.md) |
| Transitive access to other services (Storage, Event Hubs, etc.) | [Create a managed private endpoint](security-network-managed-private-endpoint-create.md) |
| Restricting outbound access | Use [Callout policies or the AllowedFQDNList](security-network-restrict-outbound-access.md) |

## Related content

* [Private Endpoints for Azure Data Explorer](security-network-private-endpoint.md)