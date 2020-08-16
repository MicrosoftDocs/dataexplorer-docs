---
title: Governance with Azure Data Explorer clusters
description: Learn about different governance patterns with Azure Data Explorer clusters.
author: '?'
ms.author: '?'
ms.reviewer: '?'
ms.service: data-explorer
ms.topic: '?'
ms.date: 17/08/2020
---

[VP]  I would see this article under straight under *Concepts*.  Same level than [Data Viz Overview](https://docs.microsoft.com/en-us/azure/data-explorer/viz-overview).

# Governance with Azure Data Explorer clusters

This article looks at different governance patterns with Azure Data Explorer clusters.

[VP] We need to flesh out the intro once the content of the article is clearer

## Clusters vs Databases

Kusto essential constructs, tables & functions, are what users query against.  When should we put those constructs in a single database, in different databases within the same cluster, in different databases in different clusters?

Let's look at the different parameters a cluster and a database allows us to set:

Parameter|Database|Cluster
-|-|-
Compute|N/A|Compute is configured at the cluster level.  Each cluster can have a different [compute sku](manage-cluster-choose-sku.md) and [horizontal scaling](manage-cluster-horizontal-scaling.md).  VM disks can also be encrypted at rest using [](cluster-disk-encryption.md).
Networking|N/A|Networking is configured at the cluster level.  A cluster can be [deployed inside a Virtual Network](vnet-deployment.md) and from there all [network security features](security-baseline.md#network-security).
Storage Security|N/A|A storage account is associated with each cluster.  [customer managed keys](customer-managed-keys-portal.md)
[double encryption](double-encryption.md)

Access Control|
Policies|

## Environments

## Hub and Spoke

### Noisy neighbours

## Stricking a balance between exploration and chaos

Best practices on cafeteria refrigerator policies
