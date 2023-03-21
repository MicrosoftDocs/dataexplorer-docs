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

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to create a continuous export.

## 1 - Create an external table

Continuous export jobs export data to an [external table](../../query/schema-entities/externaltables.md) with a periodically run query. The results are stored in the external table, which defines the destination and the schema of the exported data.

If you don't yet have an external table for your continuous export, [Create an Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md) or [Create an SQL Server external tables](../external-sql-tables.md).

## 2 - Create the managed identity

[Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity) or [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity) for your cluster.

An Azure Data Explorer cluster can only have one system-assigned managed identity. This identity is tied to your cluster and deleted if your resource is deleted. On the other hand, a user-assigned managed identity is a standalone Azure resource, and multiple of these identities can be assigned to your cluster.

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

## 3 - Grant Azure Data Explorer permissions

The managed identity needs at least the [Database User](../access-control/role-based-access-control.md) role for the Azure Data Explorer database containing your external table in order to perform the continuous export.

To grant the managed identity the Database User role, run the following command.

```kusto
.add database <databaseName> users ('aadapp={managedIdentityObjectId};{tenantId}')
```

For more information on how to use management commands to grant security roles, see [Security roles overview](../security-roles.md).

## 4 - Grant external resource permissions

The managed identity used for the continuous export must have write permissions over the external resource to perform continuous export. The required permissions vary depending on the resource type.

Grant the managed identity the relevant write permissions on the external resource based on the following table.

| External resource | Required permissions|
|--|--|--|
|Azure Blob Storage / Data Lake Storage Gen2|Storage Blob Data Contributor|
|Data Lake Storage Gen1|Contributor|
|SQL Server|CREATE, UPDATE, and INSERT|

For more information, see the **Authentication and authorization** section of [Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md#authentication-and-authorization) or [SQL Server external tables](../external-sql-tables.md#authentication-and-authorization).

## 5 - Create the continuous export job

Use the [.create-or-alter continuous-export](create-alter-continuous.md) command to create the continuous export job.

The `managedIdentity` property must be specified. To specify the `managedIdentity` property, use the syntax relevant to the type of managed identity you created.

* For a system-assigned managed identity: `managedIdentity=system`.
* For a user-assigned managed identity: `managedidentity={objectId}`. Replace `objectId` with the object ID of the managed identity.

## Next steps

* See the [continuous export overview](continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
