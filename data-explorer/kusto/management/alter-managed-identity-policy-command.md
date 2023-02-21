---
title: ".alter managed_identity policy command - Azure Data Explorer"
description: "This article describes the .alter managed_identity policy command in Azure Data Explorer."
ms.reviewer: slneimer
ms.topic: reference
ms.date: 02/21/2023
---
# .alter managed_identity policy

The command sets the ManagedIdentity policy of the cluster or the specified database, overriding the existing policy.

> [!NOTE]
> Managed identities should be assigned to the cluster (see [instructions](../../configure-managed-identities-cluster.md)) before you can assign them to the ManagedIdentity policy.

## Permissions

The command to alter the cluster policy requires [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions, and the command to alter the database policy requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

* `.alter` `cluster` `policy` `managed_identity` *ArrayOfPolicyObjects*
* `.alter` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfPolicyObjects*

## Arguments

|Name|Type|Required|Description|
|--|--|--|--|
|*ArrayOfPolicyObjects*|array|&check;|An array with zero or more [ManagedIdentity policy](managed-identity-policy.md#the-managedidentity-policy-object) objects defined.|
|*DatabaseName*|string|&check;|The name of the database.|

> [!NOTE]
> Policy objects must define the *ObjectId* and *AllowedUsages* properties. Other properties are automatically populated.

### Getting the managed identity object ID

The object ID is available in the Azure portal on the managed identity's overview page.

:::image type="content" source="images/managed-identity-policy\azure-portal.png" alt-text="Look for 'Object (principal) ID.":::

## Returns

The command sets the cluster's or database's ManagedIdentity policy object, overriding any current policy,
and then returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

If any of the specified managed identities is not assigned to the cluster, an error will be returned and the ManagedIdentity policy will not be modified.

## Example

~~~kusto
.alter database db policy managed_identity ```
[
  {
    "ObjectId": "d99c9846-1615-a2f9-a96f-78e136ba93eb",
    "AllowedUsages": "NativeIngestion, ExternalTable"
  }
]
```
~~~