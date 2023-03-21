---
title: Authenticate with a managed identity for continuous export - Azure Data Explorer
description: This article describes how to authenticate with a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/21/2023
---
# Authenticate with a managed identity for continuous export

Continuous export jobs periodically transfer data to an [external table](../../query/schema-entities/externaltables.md) by running a query. In certain situations, such as when the query for continuous export refers to tables in other databases or when the target external table uses impersonation authentication, a [managed identity](../../../managed-identities-overview.md) must be used to successfully configure the continuous export.

In this article, you'll learn how to configure your continuous export job with a managed identity to ensure successful authentication.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Create an external table

External tables reference data stored outside Azure Data Explorer. Supported external data stores are Azure Blob Storage, Azure Data Lake, and SQL Server.

To create an external table for your continuous export, see one of the following articles:

* [Create an Azure Storage external table](../external-tables-azurestorage-azuredatalake.md)
* [Create an SQL Server external table](../external-sql-tables.md)

## 2 - Add a managed identity to your cluster

There are two types of managed identities: system-assigned and user-assigned. A system-assigned identity is tied to your cluster and gets deleted when the cluster is deleted. Only one system-assigned identity is allowed per Azure Data Explorer cluster. A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

To add a managed identity to your cluster, see one of the following guides:

* [Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity)
* [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity)

## 3 - Set the managed identity policy

The [ManagedIdentity policy](../managed-identity-policy.md) controls which managed identities can be used for what purposes.

Use the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command to set the policy on the cluster or on the database containing the external table to use for the continuous export. To allow the managed identity to perform continuous export, you must list `AutomatedFlows` under the `AllowedUsages` field of the [ManagedIdentity policy object](../managed-identity-policy.md#the-managedidentity-policy-object).

For example, the following command sets the policy on the `SampleDatabase`:

```kusto
.alter database SampleDatabase policy managed_identity ```[
    {
      "ObjectId": "<managedIdentityObjectId>",
      "AllowedUsages": "AutomatedFlows"
    }
]```
```

## 4 - Grant Azure Data Explorer permissions

The managed identity must have at least [Database User](../access-control/role-based-access-control.md) permissions for the database where your external table resides.

To grant permissions, run the following command, replacing `DatabaseName` with the name of the database, `objectId` with the managed identity object ID, and `tenantId` with the Azure Active Directory tenant ID:

```kusto
.add database DatabaseName users ('aadapp={objectId};{tenantId}')
```

For more information, see [Manage database security roles](../manage-database-security-roles.md#add-and-remove-security-roles).

## 5 - Grant external resource permissions

The managed identity must have write permissions over the external data store referenced by the external table. The required permissions vary depending on the data store.

Grant the managed identity the relevant write permissions on the external resource based on the following table:

| External resource | Required permissions|
|--|--|--|
|Azure Blob Storage / Data Lake Storage Gen2|Storage Blob Data Contributor|
|Data Lake Storage Gen1|Contributor|
|SQL Server|CREATE, UPDATE, and INSERT|

For more information, see the **Authentication and authorization** section of [Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md#authentication-and-authorization) or [SQL Server external tables](../external-sql-tables.md#authentication-and-authorization).

## 6 - Create the continuous export job

Use the [.create-or-alter continuous-export](create-alter-continuous.md) command to create the continuous export job. To use your managed identity for authentication, set the `managedIdentity` property using the syntax relevant to the type of managed identity you created.

* For a system-assigned managed identity, use `managedIdentity=system`.
* For a user-assigned managed identity, use `managedidentity={objectId}` in which `objectId` is the object ID of the user-assigned managed identity.

## Next steps

* Read the [continuous export overview](continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
