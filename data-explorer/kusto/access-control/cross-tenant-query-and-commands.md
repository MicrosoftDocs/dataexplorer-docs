---
title: Allow cross-tenant queries and commands in Azure Data Explorer
description: Learn how to allow queries or commands from multiple tenants on Azure Data Explorer.
ms.reviewer: orhasban
ms.topic: reference
ms.date: 05/30/2022
---

# Allow cross-tenant queries and commands

Principals from multiple tenants can run queries and commands in a single Azure Data Explorer cluster. In this article, you'll learn how to give cluster access to principals from another tenant.

To set the `trustedExternalTenants` on the cluster, use [ARM Templates](/azure/templates/microsoft.kusto/clusters?tabs=json#trustedexternaltenant-object), [AZ CLI](/cli/azure/kusto/cluster#az-kusto-cluster-update-optional-parameters), [PowerShell](/powershell/module/az.kusto/new-azkustocluster), [Azure Resource Explorer](https://resources.azure.com/), or send an [API request](/rest/api/azurerekusto/clusters/createorupdate#request-body).

The following examples show how to define trusted tenants in the portal and with an API request.

> [!NOTE]
> The principal who will run queries or commands must also have a relevant database role. See also [role-based access control](../management/access-control/role-based-access-control.md). Validation of correct roles takes place after validation of trusted external tenants.

## [Portal](#tab/portal)

1. In the Azure portal, go to your Azure Data Explorer cluster page.

1. In the left-hand menu, under **Settings**, select **Security**.

1. Define the desired tenants permissions.

:::image type="content" source="../../media/define-trusted-external-tenants/trusted-external-tenants.png" alt-text="Screenshot of the Security blade." lightbox="../../media/define-trusted-external-tenants/trusted-external-tenants.png":::

## [API](#tab/api)

### Syntax

**Allow specific tenants**

`trustedExternalTenants: [ {"value": "tenantId1" }, { "value": "tenantId2" }, ... ]`

**Allow all tenants**

The trustedExternalTenants array supports also all-tenants star ('*') notation, which allows queries and commands from all tenants. 

`trustedExternalTenants: [ { "value": "*" }]`

> [!NOTE]
> The default value for `trustedExternalTenants` is all tenants: `[ { "value": "*" }]`. If the external tenants array was not defined on cluster creation, it can be overridden with a cluster update operation. An empty array means that only identities of the clusters tenant are allowed to authenticate to this cluster.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

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

After updating the `trustedExternalTenants` property, you can give access to principals from the approved tenants. Use the Azure portal to give a principal [cluster level permissions](../../manage-cluster-permissions.md) or [database permissions](../../manage-database-permissions.md). Alternatively, to give access to a database, table, function, or materialized view level, use [management commands](../management/security-roles.md).

## Limitations

The configuration of this feature applies solely to Microsoft Entra identities (Users, Applications, Groups) trying to connect to Azure Data Explorer. It has no impact on cross Microsoft Entra ingestion.
