---
title: Authenticate with a managed identity for continuous export - Azure Data Explorer
description: This article describes how to authenticate with a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/21/2023
---
# Authenticate with a managed identity for continuous export

In some cases, a [managed identity](../../../managed-identities-overview.md) must be used to successfully configure a [continuous export](continuous-data-export.md) job. For example, if the target external table uses impersonation authentication or if the continuous export query references tables in other databases, a managed identity must be used.

In this article, you'll learn how to set up a continuous export job with a managed identity to ensure successful authentication.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Create an external table

External tables reference data stored outside Azure Data Explorer. To create an external table for your continuous export, see one of the following articles:

* [Create an Azure Storage external table](../external-tables-azurestorage-azuredatalake.md)
* [Create an SQL Server external table](../external-sql-tables.md)

## 2 - Assign a managed identity to your cluster

To assign a managed identity to your cluster, see one of the following guides:

* [Add a system-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity)
* [Add a user-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity)

A system-assigned identity is tied to your cluster and gets deleted when the cluster is deleted. Only one system-assigned identity is allowed per Azure Data Explorer cluster. A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

## 3 - Set the managed identity policy

To allow the managed identity to perform continuous export, you must set a [ManagedIdentity policy](../managed-identity-policy.md) with `AutomatedFlows` specified in the `AllowedUsages` field of the policy object. This policy can be set on the cluster or database level.

### [Cluster](#tab/cluster)

To set a managed identity policy on the cluster level, run the following command. Replace `<objectId>` with the managed identity object ID.

```kusto
.alter cluster policy managed_identity ```[
    {
      "ObjectId": "<objectId>",
      "AllowedUsages": "AutomatedFlows"
    }
]```
```

### [Database](#tab/database)

To set the policy on the database level, run the following command. Replace `<DatabaseName>` with the name of the database that contains the external table and `<objectId>` with the managed identity object ID.

```kusto
.alter database <DatabaseName> policy managed_identity ```[
    {
      "ObjectId": "<objectId>",
      "AllowedUsages": "AutomatedFlows"
    }
]```
```

---

For more information, see [.alter managed_identity policy](../alter-managed-identity-policy-command.md).

## 4 - Grant Azure Data Explorer permissions

The managed identity must have at least [Database User](../access-control/role-based-access-control.md) permissions over the databases that the continuous export query references.

To grant permissions, run the following command. Replace `<DatabaseName>` with the name of the database, `<objectId>` with the managed identity object ID, and `<tenantId>` with the Azure Active Directory tenant ID.

```kusto
.add database <DatabaseName> users ('aadapp=<objectId>;<tenantId>')
```

For more information, see [Manage database security roles](../manage-database-security-roles.md#add-and-remove-security-roles).

## 5 - Grant external resource permissions

The managed identity must have write permissions over the external data store referenced by the external table. The required permissions vary depending on the data store.

On the external data store, grant the managed identity the required write permissions:

| External data store | Required permissions |
|--|--|--|
|Azure Blob Storage / Data Lake Storage Gen2|Storage Blob Data Contributor|
|Data Lake Storage Gen1|Contributor|
|SQL Server|CREATE, UPDATE, and INSERT|

For more information, see [Azure Storage external tables](../external-tables-azurestorage-azuredatalake.md#authentication-and-authorization) or [SQL Server external tables](../external-sql-tables.md#authentication-and-authorization).

## 6 - Create the continuous export job

To create a continuous export job with managed identity authentication, use the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property.

To specify the `managedIdentity` property, use the relevant syntax:

* System-assigned managed identity: `managedIdentity=system`.
* User-assigned managed identity: `managedidentity=<objectId>`.

## Next steps

* Read the [continuous export overview](continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
