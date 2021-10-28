---
title: ".alter-merge managed_identity policy command - Azure Data Explorer"
description: This article describes the .alter-merge managed_identity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: slneimer
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/24/2021
---
# .alter-merge managed_identity policy

To add more Managed Identity policy objects to the existing policy, use the .alter-merge command.

> [!NOTE]
> Managed identities should be assigned to the ADX cluster (see [instructions](../../managed-identities.md)), before you can assign them to the Managed Identity policy.

## Syntax

* `.alter-merge` `cluster` `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*
* `.alter-merge` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*

*ArrayOfManagedIdentityPolicyObjects* is a JSON array that has zero or more objects, each containing two properties: `ObjectId` and `AllowedUsages`. The other properties of the managed identity will be automatically filled by Azure Data Explorer, based on the actual properties of the managed identity, with the specified `ObjectId`.

* `ObjectId` can be either the actual ObjectId of the managed identity (in the form of a guid), or the reserved keyword `system` to reference the System Managed Identity of the Azure Data Explorer cluster on which the command runs.
* `AllowedUsages` is a comma-separated list of allowed usages for the managed identity. The allowed usages are:
  * "DataConnection" - Data connections to an EventHub or an EventGrid can be created, and Azure Data Explorer will authenticate using a managed identity.
  * "NativeIngestion" - Native ingestion (using Azure Data Explorer SDK) can be done from an external source (for example, Blob), and Azure Data Explorer will authenticate using a managed identity.
  * "ExternalTable" - External tables can be configured such that the connection strings will have a managed identity, which Azure Data Explorer will use to authenticate.
  * "All" - all current and future usages are allowed

> [!NOTE]
>
> For every item in `ArrayOfManagedIdentityPolicyObjects`:
>
> * If the ObjectId *doesn't exist* in the Managed Identity policy, the item will be added to the policy.
> * If the ObjectId *already exists* in the Managed Identity policy, the item's AllowedUsages will be added to the relevant item in the Managed Identity policy. For example, if the current Managed Identity policy has AllowedUsages="NativeIngestion" for a certain managed identity, then if `ArrayOfManagedIdentityPolicyObjects` has an item for this managed identity with AllowedUsages="ExternalTables", then the AllowedUsages for this managed identity in the Managed Identity policy will become "NativeIngestion, ExternalTables".

Here is how to find the ObjectId in Azure Portal:

:::image type="content" source="images/managed-identity-policy\azure-portal.png" alt-text="Look for 'Object (principal) ID.":::

## Returns

The command updates the cluster's or database's Managed Identity policy, and then returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

If any of the specified managed identities is not assigned to the cluster, an error will be returned, and the Managed Identity policy will not be modified.

## Example

~~~kusto
.alter-merge database db policy managed_identity ```
[
  {
    "ObjectId": "d9989846-1715-42f9-a97f-78e077b693ea",
    "AllowedUsages": "NativeIngestion, ExternalTable"
  }
]
```
~~~
