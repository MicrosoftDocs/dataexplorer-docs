---
title: ".alter-merge managed_identity policy command - Azure Data Explorer"
description: This article describes the .alter-merge managed_identity policy command in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge managed_identity policy

The command updates the ManagedIdentity policy of the cluster or the specified database, adding new managed identities or adding usages to existing managed identities.

> [!NOTE]
> Managed identities should be assigned to the cluster (see [instructions](../../configure-managed-identities-cluster.md)) before you can assign them to the ManagedIdentity policy.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

* `.alter-merge` `cluster` `policy` `managed_identity` *ArrayOfPolicyObjects*
* `.alter-merge` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfPolicyObjects*

## Arguments

|Name|Type|Required|Description|
|--|--|--|--|
|*ArrayOPolicyObjects*|array|&check;|An array with zero or more [ManagedIdentity policy](managed-identity-policy.md#the-managedidentity-policy-object) objects defined.|
|*DatabaseName*|string|&check;|The name of the database.|

> [!NOTE]
>
> * Policy objects must define the *ObjectId* and *AllowedUsages* properties. Other properties are automatically populated.
>
> * For every item in `ArrayOfManagedIdentityPolicyObjects`:
>
>   * If the ObjectId *doesn't exist* in the ManagedIdentity policy, the item will be added to the policy.
>   * If the ObjectId *already exists* in the ManagedIdentity policy, the identity's AllowedUsages property will be added to the relevant item in the policy. For example, if the current policy has AllowedUsages="NativeIngestion" for a specific managed identity, then if `ArrayOfManagedIdentityPolicyObjects` has an item for this managed identity with AllowedUsages="ExternalTables", then the AllowedUsages for this managed identity in the Managed Identity policy will become "NativeIngestion, ExternalTables".

### Getting the managed identity object ID

The object ID is available in the Azure portal on the managed identity's overview page.

:::image type="content" source="images/managed-identity-policy\azure-portal.png" alt-text="Look for 'Object (principal) ID.":::

## Returns

The command updates the ManagedIdentity policy of the cluster or the specified database, adding new managed identities or adding usages to existing managed identities, and then returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

If any of the specified managed identities is not assigned to the cluster, an error will be returned and the ManagedIdentity policy will not be modified.

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