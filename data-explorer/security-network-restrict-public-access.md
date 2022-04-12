---
title: Restrict public access to your Azure Data Explorer cluster
description: In this article, you'll learn how to public access to your Azure Data Explorer cluster.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 04/05/2022
---

# Restrict public access to your Azure Data Explorer cluster

To restrict public access to your cluster, you must turn off access from public endpoints. Once completed, users won't be able to connect to the cluster from public networks, and must instead use a private endpoint.

1. In the Azure portal, navigate to your cluster and then select **Networking**.

1. Select **Public access**, and then under **Public network access**, select **Disabled**.

    :::image type="content" source="media/security-network-restrict-access/restrict-public-access-inline.png" alt-text="Screenshot of the networking page, showing the disable public access option." lightbox="media/security-network-restrict-access/restrict-public-access.png":::

1. Optionally, you can define a list of IP addresses that can connect to the public endpoint your cluster.

1. Select **Save**.

## Next steps

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
