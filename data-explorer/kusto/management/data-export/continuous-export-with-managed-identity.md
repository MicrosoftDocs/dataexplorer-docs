---
title: Authenticate with managed identity for continuous export - Azure Data Explorer
description: This article describes how to authenticate with managed identity in a continuous export flow in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/20/2023
---
# Authenticate with managed identity for continuous export

In some cases, you must use a managed identity to successfully configure a continuous export job. For example, if the query of the continuous export references tables in other databases or if the target external table uses impersonation authentication, then the continuous export job must run on behalf of a managed identity.

In this article, you'll learn how to perform continuous export with a managed identity.

## 1 - Configure the managed identity for your cluster

For instructions, see [Configure managed identities for your Azure Data Explorer cluster](../../../configure-managed-identities-cluster.md).

## 2 - Set the managed identity policy

1. Define a [managed identity policy](../managed-identity-policy.md). `AutomatedFlows` must be listed under the `AllowedUsages` field.

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

1. Run the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command to set the managed identity policy for the cluster or database of the continuous export.

## 3 - Grant permissions to the managed identity

Run the following command to grant the managed identity at least the Database User security role. Replace `databaseName`, `managedIdentityObjectId`, and `tenantId` with the relevant values.

```kusto
.add database <databaseName> users ('aadapp={managedIdentityObjectId};{tenantId}')
```

To learn more about the available security roles, see [Role-based access control](../access-control/role-based-access-control.md). For more information on how to use management commands to grant security roles, see [Security roles overview](../security-roles.md).

## 3 - Create the external table

If the external table doesn't yet exist, create it by following the instructions in [Create and alter Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md) or [Create and alter SQL Server external tables](../external-sql-tables.md).

## 4 - Give write permissions to the managed identity

The managed identity used for the continuous export must have write permissions over the external resource. The required write permissions vary based on the type of resource and authentication method.

Depending on your use case, assign the managed identity the relevant **Write permissions** for [Azure Storage](../external-tables-azurestorage-azuredatalake.md#authentication-and-authorization) or [SQL Server](../external-sql-tables.md#authentication-and-authorization) as specified in the **Authentication and authorization** table.

## 5 - Create continuous export job

Use the [.create-or-alter continuous-export](create-alter-continuous.md) command to create the continuous export job.

The `managedIdentity` property must be specified. To specify the `managedIdentity` property, use the syntax relevant to the type of managed identity you created.

* For a system-assigned managed identity: `managedIdentity=system`.
* For a user-assigned managed identity: `managedidentity={objectId}`. Replace `objectId` with the object ID of the managed identity.

## Next steps

* See the [continuous export overview](continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
