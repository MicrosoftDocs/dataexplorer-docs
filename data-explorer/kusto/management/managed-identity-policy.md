---
title: Kusto ManagedIdentity policy
description: Learn about the ManagedIdentity policy to control managed identities.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 05/24/2023
---
# Managed Identity policy

*ManagedIdentity* is a policy that controls which managed identities can be used for what purposes. For example, you can configure a policy that allows a specific managed identity to be used for accessing a storage account for ingestion purposes.

This policy can be enabled at the cluster and database levels. The policy is additive, meaning that for every operation that involves a managed identity, the operation will be permitted if the usage is allowed at either the cluster or database level.

## Permissions

Creating or altering a managed identity policy requires [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions.

## The ManagedIdentity policy object

A cluster or database may have zero or more ManagedIdentity policy objects associated with it.
Each ManagedIdentity policy object has the following user-definable properties: *DisplayName* and *AllowedUsages*.
Other properties are automatically populated from the managed identity associated with the specified *ObjectId* and displayed for convenience.

The following table describes the properties of the ManagedIdentity policy object:

| Property      | Type   | Required | Description                                                                   |
|---------------|--------|----------|-------------------------------------------------------------------------------|
| ObjectId      | `string` |  :heavy_check_mark:  | Either the actual object ID of the managed identity or the reserved keyword `system` to reference the System Managed Identity of the cluster on which the command is run. |
| ClientId      | `string` | Not applicable | The client ID of the managed identity. |
| TenantId      | `string` | Not applicable | The tenant ID of the managed identity. |
| DisplayName   | `string` | Not applicable | The display name of the managed identity. |
| IsSystem      | `bool` | Not applicable | A Boolean value indicating true if the identity is a System Managed Identity; false if otherwise. |
| AllowedUsages | `string` |  :heavy_check_mark:  | A list of comma-separated allowed usage values for the managed identity. See [managed identity usages](#managed-identity-usages). |

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

### Managed identity usages

The following values specify authentication to a `usage` using the configured managed identity:

| Value | Description |
|---|---|
| `All` | All current and future usages are allowed. |
| `AutomatedFlows`| Run a [Continuous Export](./data-export/continuous-data-export.md) or [Update Policy](./update-policy.md) automated flow on behalf of a managed identity. |
| `DataConnection` | Authenticate to data connections to an Event Hub or an Event Grid. |
|`ExternalTable` | Authenticate to external tables using connection strings configured with a managed identity. |
| `NativeIngestion` |  Authenticate to an SDK for native ingestion from an external source. |
| `SandboxArtifacts`| Authenticate to external artifacts referenced in sandboxed plugins (e.g., Python) with a managed identity. This usage needs to be defined on the cluster level managed identity policy. |
