---
title: ".alter managed_identity policy command - Azure Data Explorer"
description: This article describes the .alter managed_identity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: slneimer
ms.service: data-explorer
ms.topic: reference
ms.date: 11/03/2021
---
# .alter managed_identity policy

The command sets the ManagedIdentity policy of the cluster or the specified database, overriding the existing policy.

> [!NOTE]
> Managed identities should be assigned to the cluster (see [instructions](../../managed-identities.md)) before you can assign them to the ManagedIdentity policy.

## Syntax

* `.alter` `cluster` `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*
* `.alter` `database` *DatabaseName* `policy` `managed_identity` *ArrayOfManagedIdentityPolicyObjects*

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
