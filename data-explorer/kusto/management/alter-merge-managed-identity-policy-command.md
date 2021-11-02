---
title: ".alter-merge managed_identity policy command - Azure Data Explorer"
description: This article describes the .alter-merge managed_identity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: slneimer
ms.service: data-explorer
ms.topic: reference
ms.date: 11/03/2021
---
# .alter-merge managed_identity policy

The command updates the ManagedIdentity policy of the cluster or the specified database, adding new managed identities, or adding usages to existing managed identities.

> [!NOTE]
> Managed identities should be assigned to the cluster (see [instructions](../../managed-identities.md)) before you can assign them to the ManagedIdentity policy.

## Syntax

* `.alter-merge` `cluster` `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*
* `.alter-merge` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*

## Arguments

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *ArrayOfManagedIdentityPolicyObjects* | array | &check; | An array with zero or more ManagedIdentity policy objects defined. |
| *DatabaseName* | string | &check; | The name of the database. |

ManagedIdentity policy object:

Each ManagedIdentity policy object defines two properties. Other properties are obtained from the managed identity associated with the specified ObjectId.

~~~kusto
{
  "ObjectId": "d99c9846-1615-a2f9-a96f-78e136ba93eb",
  "AllowedUsages": "NativeIngestion, ExternalTable"
}
~~~

Where:

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *ObjectId* | string | &check; | Either the actual object ID of the managed identity or the reserved keyword `system` to reference the System Managed Identity of the cluster on which the command is run. |
| *AllowedUsages* | string | &check; | List of comma-separated allowed usages for the managed identity. Possible values are:<br />- "DataConnection": Data connections to an Event Hub or an Event Grid can be created authenticated using the specified managed identity<br />- "NativeIngestion": Native ingestions from an external source (for example, Blob) using Data Explorer's SDK and authenticated using the specified managed identity<br />- "ExternalTable": External tables using connection strings configured with a managed identity. Data Explorer uses the configured managed identity to authenticate<br />- "All": All current and future usages are allowed |

> [!NOTE]
>
> For every item in `ArrayOfManagedIdentityPolicyObjects`:
>
> * If the ObjectId *doesn't exist* in the Managed Identity policy, the item will be added to the policy.
> * If the ObjectId *already exists* in the Managed Identity policy, the item's AllowedUsages will be added to the relevant item in the Managed Identity policy. For example, if the current Managed Identity policy has AllowedUsages="NativeIngestion" for a certain managed identity, then if `ArrayOfManagedIdentityPolicyObjects` has an item for this managed identity with AllowedUsages="ExternalTables", then the AllowedUsages for this managed identity in the Managed Identity policy will become "NativeIngestion, ExternalTables".

### Getting the managed identity object ID

The object ID is available in the Azure portal on the managed identity's overview page.

:::image type="content" source="images/managed-identity-policy\azure-portal.png" alt-text="Look for 'Object (principal) ID.":::

## Returns

The command updates the ManagedIdentity policy of the cluster or the specified database, adding new managed identities, or adding usages to existing managed identities, and then returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

If any of the specified managed identities is not assigned to the cluster, an error will be returned, and the ManagedIdentity policy will not be modified.

## Example

~~~kusto
.alter-merge database db policy managed_identity ```
[
  {
    "ObjectId": "d99c9846-1615-a2f9-a96f-78e136ba93eb",
    "AllowedUsages": "NativeIngestion, ExternalTable"
  }
]
```
~~~
