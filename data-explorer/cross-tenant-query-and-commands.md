---
title: Cross-tenant queries and commands
description: Learn how to query / run commands on Azure Data Explorer from multiple tenants.
author: orhasban
ms.author: orspodek
ms.reviewer: rkarlin 
ms.service: data-explorer
ms.topic: how-to
ms.date: 12/25/2020
ms.localizationpriority: high
---
# Cross-tenant queries and commands (How to allow principals from another tenant to access your cluster)

Azure Data Explorer is capable to run queries and commands from multiple tanants. 

In order that a principal would be able to run queries or commands on a cluster it should have a relevant database role on the the relevant database (for more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md)).

Azure Data Explorer cluster allow the cluster owners to protect their cluster  getting queries and commands from another tenants. Those requests are blocked in gateway layer, before the principal authorization validation check. This is done by managing TrustedExternalTenants cluster property (for more information regarding create or update cluster request body and in particular trustedExternalTenants property, see [Azure Data Explorer cluster request body](https://docs.microsoft.com/en-us/rest/api/azurerekusto/clusters/createorupdate#request-body)).

This property is an array that defines explicitly which tenants are allowed to run queries and commands on the cluster. Its structure is as follows:

```
trustedExternalTenants: [ { "value": "tenantId1" }, { "value": "tenantId2" }, ... ]
```

The trustedExternalTenants array supports also _all-tenants_ star ('*') notion (allows queries and commands from all tenants). 

```
trustedExternalTenants: [ { "value": "*" }]
```

When an Azure Data Explorer cluster is created, if this array isn't mentioned (property is not required), the default value is `[ { "value": "*" }]`. In case cluster owner didn't define that array on creation, it can be overridden with cluster update operation. Pay attention empty array isn't accepted.
