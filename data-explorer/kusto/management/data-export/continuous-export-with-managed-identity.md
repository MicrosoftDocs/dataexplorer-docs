---
title: Authenticate with managed identity for continuous export - Azure Data Explorer
description: This article describes how to authenticate with managed identity in a continuous export flow in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/21/2023
---
# Authenticate with managed identity for continuous export

Continuous export jobs periodically transfer data to an [external table](../../query/schema-entities/externaltables.md) by running a query. In certain situations, such as when the query for continuous export refers to tables in other databases or when the target external table uses impersonation authentication, a [managed identity](../../../managed-identities-overview.md) must be used to successfully configure the continuous export.

In this article, you'll learn how to configure your continuous export job with a managed identity to ensure successful authentication.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Create an external table

External tables reference data stored outside Azure Data Explorer. Supported external data stores are Azure Blob Storage, Azure Data Lake, and SQL Server.

To create an external table for your continuous export, see one of the following articles:

* [Create an Azure Storage external table](../external-tables-azurestorage-azuredatalake.md)
* [Create an SQL Server external table](../external-sql-tables.md)
<!-- Should I add this one? -->
* [Create an external table using Azure Data Explorer web UI Wizard](../../../external-table.md)

## 2 - Create the managed identity

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
