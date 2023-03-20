---
title: Authenticate with a managed identity for continuous export - Azure Data Explorer
description: This article describes how to authenticate with a managed identity in a continuous export flow in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/20/2023
---
# Authenticate with a managed identity

Continuous export jobs that export data to an external table that uses impersonation authentication must run on behalf of a managed identity. In this article, you'll learn how to create and use a managed identity for continuous export.

## Prerequisites

## 1 - Configure the managed identity for your cluster

For instructions, see [Configure managed identities for your Azure Data Explorer cluster](../../../configure-managed-identities-cluster.md).

## 2 - Set the managed identity policy

1. Create the [managed identity policy](../managed-identity-policy.md). `AutomatedFlows` must be listed under the `AllowedUsages` field.

```JSON
{
  "ObjectId": "<objectID>",
  "ClientId": "<clientID>",
  "TenantId": "<tenantID",
  "DisplayName": "myManagedIdentity",
  "IsSystem": false,
  "AllowedUsages": "AutomatedFlows, ExternalTable"
}
```

1. Run the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command to set the managed identity policy for the cluster or database that you'll use for the continuous export.

## 3 - Grant permissions to the managed identity

Run the following command to grant the managed identity at least the Database User security role. Replace `DatabaseName`, `managedIdentityObjectId`, and `tenantId` with the relevant values.

```kusto
.add database <DatabaseName> users ('aadapp={managedIdentityObjectId};{tenantId}')
```

To learn more about the available security roles, see [Role-based access control](../access-control/role-based-access-control.md). For more information on how to use management commands to grant security roles, see [Security roles overview](../security-roles.md).

## 3 - Create the external table

If the external table doesn't yet exist, create it by following the instructions in [Create and alter Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md) or [Create and alter SQL Server external tables](../external-sql-tables.md).

## 4 - Grant the managed identity storage access

If the external table is using impersonation authentication, the managed identity used for the continuous export needs to have the correct write permissions over the external resource. Depending on the authentication method of the external table from step 3, the write permissions will vary. See table that I created before.

## 5 - Create continuous export job

[Create the continuous export job](create-alter-continuous.md) with the `managedIdentity` property. It should contain either `managedIdentity=system` for using the cluster’s system managed identity, or `managedidentity={managedIdentityObjectId}` to use any other managed identity.

## Next steps