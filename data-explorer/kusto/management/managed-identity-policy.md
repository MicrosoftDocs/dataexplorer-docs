---
title: Kusto ManagedIdentity policy - Azure Data Explorer
description: This article describes ManagedIdentity policy in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 11/03/2021
---
# Managed Identity policy

*ManagedIdentity* is a policy that controls which managed identities can be used for what purposes. For example, you can configure a policy that allows a specific managed identity to be used for accessing a storage account for ingestion purposes.

This policy can be enabled at the cluster and database levels. The policy is additive, meaning that for every operation that involves a managed identity, Azure Data Explorer will allow the operation if the usage is allowed at either the cluster or database level.

> [!NOTE]
> creating and modifying the managed identity policy requires [all databases admin user permission](../management/access-control/role-based-authorization.md).

## The ManagedIdentity policy object

A cluster or database may have zero or more ManagedIdentity policy objects associated with it.
Each ManagedIdentity policy object has the following user-definable properties: *DisplayName* and *AllowedUsages*.
Other properties are automatically populated from the managed identity associated with the specified *ObjectId* and displayed for convenience.

The following table describes the properties of the ManagedIdentity policy object:

| Property      | Type   | Required | Description                                                                   |
|---------------|--------|----------|-------------------------------------------------------------------------------|
| ObjectId      | string | &check;  | Either the actual object ID of the managed identity or the reserved keyword `system` to reference the System Managed Identity of the cluster on which the command is run. |
| ClientId      | string | Not applicable | The client ID of the managed identity. |
| TenantId      | string | Not applicable | The tenant ID of the managed identity. |
| DisplayName   | string | Not applicable | The display name of the managed identity. |
| IsSystem      | bool   | Not applicable | A Boolean value indicating true if the identity is a System Managed Identity; false if otherwise. |
| AllowedUsages | string | &check;  | A list of comma-separated allowed usages for the managed identity. Possible values are:<br />- "DataConnection": Data connections to an Event Hub or an Event Grid can be created authenticated using the specified managed identity<br />- "NativeIngestion": Native ingestions from an external source (for example, Blob) using Data Explorer's SDK and authenticated using the specified managed identity<br />- "ExternalTable": External tables using connection strings configured with a managed identity. Data Explorer uses the configured managed identity to authenticate<br />- "All": All current and future usages are allowed |

The following is an example of a ManagedIdentity policy object:

```json
{
  "ObjectId": "<objectID>",
  "ClientId": "<clientID>",
  "TenantId": "<tenantID",
  "DisplayName": "myManagedIdentity",
  "IsSystem": false,
  "AllowedUsages": "NativeIngestion, ExternalTable"
}
```
