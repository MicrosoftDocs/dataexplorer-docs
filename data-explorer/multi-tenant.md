---
title: Comparing different multitenant solutions with Azure Data Explorer
description: Learn about the different ways to architect a multitenant solution in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 05/11/2026
---
# How to architect a multitenant solution with Azure Data Explorer

The concept of multi-tenancy in Azure Data Explorer refers to serving different tenants and storing their data in a single cluster.

> [!IMPORTANT]
>
> A multitenant solution can also be architected in Microsoft Fabric's [Real-Time Intelligence](/fabric/real-time-intelligence/overview) workload, using KQL databases inside an [Eventhouse](/fabric/real-time-intelligence/eventhouse).

[!INCLUDE [multitenancy](includes/cross-repo/multitenancy.md)]

## Related content

* [Workload groups](/kusto/management/workload-groups?view=azure-data-explorer&preserve-view=true)
* [Role-based access control](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true)
* [Row Level Security](/kusto/management/row-level-security-policy?view=azure-data-explorer&preserve-view=true)
* [Restrict statement](/kusto/query/restrict-statement?view=azure-data-explorer&preserve-view=true)
* [Partitioning policy](/kusto/management/partitioning-policy?view=azure-data-explorer&preserve-view=true)
