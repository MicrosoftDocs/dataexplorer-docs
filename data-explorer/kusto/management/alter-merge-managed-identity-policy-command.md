---
title:  .alter-merge policy managed_identity command
description: Learn how to use the `.alter-merge policy managed_identity` command to update the ManagedIdentity policy of the cluster or database.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .alter-merge policy managed_identity command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The command updates the ManagedIdentity policy of the cluster or the specified database, adding new managed identities or adding usages to existing managed identities.

> [!NOTE]
> Managed identities should be assigned to a cluster before you can assign them to the ManagedIdentity policy. For more information, see [Configure managed identities for your cluster](/azure/data-explorer/configure-managed-identities-cluster)

## Permissions

You must have [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

`.alter-merge` `cluster` `policy` `managed_identity` *ArrayOfPolicyObjects*

`.alter-merge` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|
|*ArrayOfPolicyObjects*|array| :heavy_check_mark:|A serialized array with zero or more [ManagedIdentity policy](managed-identity-policy.md#the-managedidentity-policy-object) objects defined, each defined with only the *ObjectId* and *AllowedUsages* properties.|

> [!NOTE]
>
> * Policy objects must define the *ObjectId* and *AllowedUsages* properties. Other properties are automatically populated.
>
> * For every item in `ArrayOfManagedIdentityPolicyObjects`:
>
>   * If the ObjectId *doesn't exist* in the ManagedIdentity policy, the item will be added to the policy.
>   * If the ObjectId *already exists* in the ManagedIdentity policy:
>       * The identity's *AllowedUsages* property is added to the relevant item in the policy. For example, if the current policy has AllowedUsages="NativeIngestion" for a specific managed identity, then if `ArrayOfManagedIdentityPolicyObjects` has an item for this managed identity with AllowedUsages="ExternalTables", then the AllowedUsages for this managed identity in the ManagedIdentity policy becomes "NativeIngestion, ExternalTables".
>       * The latest information (such as the `DisplayName`) about the managed identity is retrieved from Microsoft Entra and updated in the policy.

### Getting the managed identity object ID

The object ID is available in the Azure portal on the managed identity's overview page.

:::image type="content" source="media/managed-identity-policy\azure-portal.png" alt-text="Look for 'Object (principal) ID.":::

## Returns

The command updates the ManagedIdentity policy of the cluster or the specified database. The change may add new managed identities or add usages to existing managed identities. Then, the command returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

If any of the specified managed identities isn't assigned to the cluster, an error is returned and the ManagedIdentity policy won't be modified.

## Example

~~~kusto
.alter-merge database db policy managed_identity ```
[
  {
    "ObjectId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
    "AllowedUsages": "NativeIngestion, ExternalTable"
  }
]
```
~~~
