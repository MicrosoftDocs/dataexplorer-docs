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

[VP] This is awfully long before getting to recommendations...  Could we get away with a just the diagram?

Kusto essential constructs, [tables](kusto/query/schema-entities/tables.md) & [stored functions](kusto/query/schema-entities/stored-functions.md), are what users query against.  When should we put those constructs in a single database, in different databases within the same cluster, in different databases in different clusters?

![Cluster vs Database](media/adx-governance/cluster-vs-database.png)

Let's look at the different parameters a cluster and a database allows us to set.

Parameter|Database|Cluster
-|-|-
Compute|N/A|Compute is configured at the cluster level.  Each cluster can have a different [compute sku](manage-cluster-choose-sku.md) and [horizontal scaling](manage-cluster-horizontal-scaling.md).  VM disks can also be encrypted at rest using [Disk Encryption](cluster-disk-encryption.md).
Networking|N/A|Networking is configured at the cluster level.  A cluster can be [deployed inside a Virtual Network](vnet-deployment.md) and from there all [network security features](security-baseline.md#network-security).
Storage Security|N/A|A storage account is associated with each cluster.  That storage account can be configured to use [customer managed keys](customer-managed-keys-portal.md) for encryption and / or to also encrypt the data at service-level using [double encryption](double-encryption.md).
Access Control|Database is an ARM resource (child of the cluster) and can have [role assignment](kusto/management/access-control/role-based-authorization.md).  Tables currently can't have role assignment (tables can be secured through [restriced view access policy](kusto/management/restrictedviewaccesspolicy.md) and [row level security policy](kusto/management/rowlevelsecuritypolicy.md), both of which aren't a perfect equivalent to table access control).  Database can hence be seen as the lowest security boundary.|Clusters offer complete isolation both on the control plane (e.g. start / stop cluster) and data plane (e.g. ingestor / viewer)
Policies|Many [policies](kusto/management/policies.md) can be applied at the cluster, database and table level with an overriding semantic (i.e. if a policy is defined at a lower level, it overrides the policy at a higher level).  A database can hence be seen as a *policy container* in order to apply some policies to many tables.|Policies applied at the cluster level apply to all tables in all databases unless overriden.

On top of that, we can make those general observations:

* Compute drives the cost
* [Cross-cluster queries](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/cross-cluster-or-database-queries?pivots=azuredataexplorer) are often less performant than if they were done within the same cluster
* Cross-database queries (within the same cluster) have the same performance than if they were done on tables in the same database

For those reasons, although clusters provide more isolation, we typically try to consolidate where it makes sense.

Those are no hard rules but guidance on when to use a given pattern

### When to use a single databases

* When all tables should have similar access control rules in querying, ingestion and administration
* When tables share the same policies or have table-specific policies

### When to use multiple databases

* When tables should have different access control rules in querying, ingestion and administration:  we can use a database as a security boundary
* When groups of tables should share similar policies:  use a database as a policy container

### When to use multiple clusters

* When different compute should be used for different workloads
* When different networking configuration must be used for different workloads, e.g. cluster A should be accessible from VNET X but not from VNET Y
* When hard boundaries should be implemented between workloads, e.g. it should be impossible for user to join data from data set A & B
* In general, it is a good practice to isolate environments using different clusters, at least production vs non-production, so that configuration changes can be tested in non-production environments without impacting the production.  See more detailed in the [Environments section](#environments)

## Environments

## Hub and Spoke

### Noisy neighbours

## Stricking a balance between exploration and chaos

Best practices on cafeteria refrigerator policies
