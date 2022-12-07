---
title: Allow cross-tenant queries and commands in Azure Data Explorer
description: Learn how to allow queries or commands from multiple tenants on Azure Data Explorer.
ms.reviewer: orhasban
ms.topic: reference
ms.date: 05/30/2022
---

# Allow cross-tenant queries and commands

Multiple tenants can run queries and commands in a single Azure Data Explorer cluster. In this article, you will learn how to give cluster access to principals from another tenant.

Cluster owners can protect their cluster from queries and commands from other tenants. You can define permissions at the cluster level using the portal, or use the `trustedExternalTenants` property to define which tenants are allowed to run queries and commands on the cluster. 

Permissions can be set using the portal, the [ARM Templates](/azure/templates/microsoft.kusto/clusters?tabs=json#trustedexternaltenant-object), [AZ CLI](/cli/azure/kusto/cluster#az-kusto-cluster-update-optional-parameters), [PowerShell](/powershell/module/az.kusto/new-azkustocluster), or the [Azure Resource Explorer](https://resources.azure.com/). See also [Azure Data Explorer cluster request body](/rest/api/azurerekusto/clusters/createorupdate#request-body).

> [!NOTE]
> The principal who will run queries or commands must also have a relevant database role. See also [role-based access control](./kusto/management/access-control/role-based-authorization.md). Validation of correct roles takes place after validation of trusted external tenants.

## [Portal](#tab/portal)

1. In the Azure portal, go to your Azure Data Explorer cluster page.

1. In the left-hand menu, under **Settings**, select **Security**.

1. Define the desired tenants permissions.

:::image type="content" source="media/define-trusted-external-tenants/trusted-external-tenants.png" alt-text="Screenshot of the Security blade" lightbox="media/define-trusted-external-tenants/trusted-external-tenants.png":::

## [API](#tab/api)

### Syntax

**Allow specific tenants**

`trustedExternalTenants: [ {"value": "tenantId1" }, { "value": "tenantId2" }, ... ]`

**Allow all tenants**

The trustedExternalTenants array supports also all-tenants star ('*') notation, which allows queries and commands from all tenants. 

`trustedExternalTenants: [ { "value": "*" }]`

> [!NOTE]
> The default value for `trustedExternalTenants` is all tenants: `[ { "value": "*" }]`. If the external tenants array was not defined on cluster creation, it can be overridden with a cluster update operation. An empty array means that only identities of the clusters tenant are allowed to authenticate to this cluster.

### Examples

The following example allows specific tenants to run queries on the cluster:

```json
{
    "properties": { 
        "trustedExternalTenants": [
            { "value": "tenantId1" }, 
            { "value": "tenantId2" }, 
            ...
        ]
    }
}
```

The following example allows all tenants to run queries on the cluster:

```json
{
    "properties": { 
        "trustedExternalTenants": [  { "value": "*" }  ]
    }
}
```

### Update the cluster

Update the cluster using the following operation:

```http
PATCH https://management.azure.com/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorgtest/providers/Microsoft.Kusto/clusters/kustoclustertest?api-version=2020-09-18
```

---

## Add Principals

After updating the `trustedExternalTenants` property, you must give cluster access to principals from the approved tenants using the `.add` command. For more information, see [identities - AAD Tenants](./kusto/management/access-control/principals-and-identity-providers.md#azure-ad-tenants).

## Limitations
The configuration of this feature applies solely to Azure Active Directory identities (Users, Applications) trying to connect to the Azure Data Explorer data plane. It has no impact on [cross Azure Active Directory ingestion](cross-tenant-query-and-commands.md).
