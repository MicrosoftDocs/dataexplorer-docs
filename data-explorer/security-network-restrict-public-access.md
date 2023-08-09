---
title: Control public access to your Azure Data Explorer cluster
description: Learn how to control public access to your Azure Data Explorer cluster.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 08/09/2023
---

# Control public access to your Azure Data Explorer cluster

This article describes how to allow, limit, or prevent public access to your Azure Data Explorer cluster. 

## Control public access

To allow, limit, or prevent public access to your cluster, follow these steps:

1. In the [Azure portal](https://ms.portal.azure.com/), go to your cluster.

1. From the left-hand menu, under **Security + Networking**, select **Networking**.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access.png" alt-text="Screenshot of the networking public access page." lightbox="media/security-network-restrict-access/networking-public-access.png":::

1. Within the **Public network access** area, select one of the following three options:
   
   * **Enabled from all networks**: This option allows access from public networks.
  
   * **Enabled from selected IP addresses**: This option allows you to define a firewall allowlist of IP addresses that can connect to the public endpoint your cluster.
  
   * **Disabled**: This option prevents access to the cluster from public networks and instead requires connection through a private endpoint.

1. Select **Save**.

## See also

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
