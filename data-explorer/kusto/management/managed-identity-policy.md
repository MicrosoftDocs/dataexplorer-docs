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
| AllowedUsages | string | &check;  | A list of comma-separated allowed usages for the managed identity. See [Managed Identity usages](#managed-identity-usages). |

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
| `DataConnection` | Authenticate to data connections to an Event Hub or an Event Grid. |
| `NativeIngestion` |  Authenticate to an SDK for native ingestions from an external source. |
|`ExternalTable` | Authenticate to external tables using connection strings configured with a managed identity. |
| `AutomatedFlow`| Run a continuous export automated flow on behalf of a managed identity. |
| `All` | All current and future usages are allowed. |
