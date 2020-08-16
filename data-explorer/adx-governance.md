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

Kusto essential constructs, [tables](kusto/query/schema-entities/tables.md) & [stored functions](kusto/query/schema-entities/stored-functions.md), are what users query against.  When should we put those constructs in a single database, in different databases within the same cluster, in different databases in different clusters?

Let's look at the different parameters a cluster and a database allows us to set:

Parameter|Database|Cluster
-|-|-
Compute|N/A|Compute is configured at the cluster level.  Each cluster can have a different [compute sku](manage-cluster-choose-sku.md) and [horizontal scaling](manage-cluster-horizontal-scaling.md).  VM disks can also be encrypted at rest using [Disk Encryption](cluster-disk-encryption.md).
Networking|N/A|Networking is configured at the cluster level.  A cluster can be [deployed inside a Virtual Network](vnet-deployment.md) and from there all [network security features](security-baseline.md#network-security).
Storage Security|N/A|A storage account is associated with each cluster.  That storage account can be configured to use [customer managed keys](customer-managed-keys-portal.md) for encryption and / or to also encrypt the data at service-level using [double encryption](double-encryption.md).
Access Control|Database is an ARM resource (child of the cluster) and can have [role assignment](kusto/management/access-control/role-based-authorization.md).  Tables currently can't have role assignment (tables can be secured through [restriced view access policy](kusto/management/restrictedviewaccesspolicy) and [row level security policy](kusto/management/rowlevelsecuritypolicy.md), both of which aren't a perfect equivalent to table access control).  Database can hence be seen as the lowest security boundary.|Clusters offer complete isolation both on the control plane (e.g. start / stop cluster) and data plane (e.g. ingestor / viewer)
Policies|Many [policies](kusto/management/policies.md) can be applied at the cluster, database and table level with an overriding semantic (i.e. if a policy is defined at a lower level, it overrides the policy at a higher level).  A database can hence be seen as a *policy container* in order to apply some policies to many tables.|Policies applied at the cluster level apply to all tables in all databases unless overriden.



## Environments

## Hub and Spoke

### Noisy neighbours

## Stricking a balance between exploration and chaos

Best practices on cafeteria refrigerator policies
