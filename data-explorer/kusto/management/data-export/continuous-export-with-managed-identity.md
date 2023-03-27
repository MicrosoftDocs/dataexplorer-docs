---
title: Use a managed identity to run a continuous export job - Azure Data Explorer
description: This article describes how to use a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/26/2023
---
# Use a managed identity to run a continuous export job

Continuous export jobs export data from Azure Data Explorer to an [external table](../../query/schema-entities/externaltables.md) with a periodically run query.

To successfully configure a continuous export job, you may need to use a [managed identity](../../../managed-identities-overview.md). A managed identity is required if the external table uses impersonation authentication or if the export query references tables in other databases. A managed identity allows the continuous export job to generate an Azure Active Directory (Azure AD) bearer token to access resources its behalf.

In this article, you'll learn the steps necessary to configure a continuous export job with a managed identity.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Create an external table

To create an external table for your continuous export, see one of the following articles:

* [Create an Azure Storage external table](../external-tables-azurestorage-azuredatalake.md)
* [Create an SQL Server external table](../external-sql-tables.md)

### [Azure Storage](#tab/azure-storage)

The following example shows how to set up an Azure Storage external table with impersonation authentication.

The command creates an external table named `MyExternalTable` for `mycontainer` in an Azure Blob Storage account named `mystorageaccount`. The table has two columns, an integer `x` and a string `s`.

To specify the use of [impersonation authentication](../../api/connection-strings/storage-authentication-methods.md#impersonation), the connection string ends with `;impersonate`.

```kusto
.create external table MyExternalTable (x:int, s:string) kind=storage dataformat=csv 
( 
   h@'https://mystorageaccount.blob.core.windows.net/mycontainer;impersonate' 
)
```

> [!NOTE]
> To create an external table for Azure Data Lake Storage Gen1 or Azure Data Lake Storage Gen2, use the [Storage connection string templates](../../api/connection-strings/storage-connection-strings.md#storage-connection-string-templates) to modify the connection string as needed.

### [SQL Server](#tab/sql-server)

The following example shows how to set up a SQL Server external table with impersonation authentication.

The command creates an external table named `MySqlExternalTable` for the `MySqlTable` table stored in a SQL Server database named `MyDatabase`. The table has two columns, an integer `x` and a string `s`.

To specify the use of [Active Directory Integrated authentication](../../api/connection-strings/sql-authentication-methods.md#aad-integrated-authentication), which is impersonation authentication, the connection string contains `;Authentication=Active Directory Integrated`.

```kusto
.create external table MySqlExternalTable (x:int, s:string) kind=sql table=MySqlTable
( 
   h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;'
)
```

---

## 2 - Assign a managed identity to your cluster

To assign a managed identity to your cluster, see one of the following guides:

* [Assign a system-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity): A system-assigned identity is tied to your cluster and gets deleted when the cluster is deleted. Only one system-assigned identity is allowed per Azure Data Explorer cluster.

* [Assign a user-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity): A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

## 3 - Set the managed identity policy

For the managed identity to be used with continuous export, you must set a [ManagedIdentity policy](../managed-identity-policy.md) with the `AutomatedFlows` property. Set the policy on the cluster or database level with the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command. See the examples in the following tabs.

### [Cluster](#tab/cluster)

To set the policy on the cluster, run the following command:

```kusto
.alter cluster policy managed_identity ```[
    {
      "ObjectId": "<objectId>",
      "AllowedUsages": "AutomatedFlows"
    }
]```
```

For a system-assigned managed identity, replace `<objectId>` with `system`. For a user-assigned managed-identity, replace `<objectId>` with the managed identity object ID.

### [Database](#tab/database)

To set the policy on a database, run the following command:

```kusto
.alter database <DatabaseName> policy managed_identity ```[
    {
      "ObjectId": "<objectId>",
      "AllowedUsages": "AutomatedFlows"
    }
]```
```

Replace `<DatabaseName>` with the name of the database that contains the external table. For a system-assigned managed identity, replace `<objectId>` with `system`. For a user-assigned managed-identity, replace `<objectId>` with the managed identity object ID.

---

## 4 - Grant Azure Data Explorer permissions

The managed identity must have at least Database User permissions over the databases referenced in your continuous export query. For more information, see [role-based access control](../access-control/role-based-access-control.md).

To grant permissions, run the following command:

```kusto
.add database <DatabaseName> users ('aadapp=<objectId>;<tenantId>')
```

Replace `<DatabaseName>` with the name of the database. For a system-assigned managed identity, replace `<objectId>` with `system`. For a user-assigned managed-identity, replace `<objectId>` with the managed identity object ID. Replace `<tenantId>` with the Azure Active Directory tenant ID.

## 5 - Grant external resource permissions

When the external table uses impersonation authentication, the managed identity must have write permissions over the external data store referenced by the external table. The required permissions vary depending on the data store type.

On the external data store, grant the managed identity the required write permissions:

| External data store | Required permissions | Grant the permissions|
|--|--|--|
|Azure Blob Storage |Storage Blob Data Contributor|[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
|Data Lake Storage Gen2| Storage Blob Data Contributor|[Manage ACLs](/azure/storage/blobs/data-lake-storage-acl-azure-portal)
|Data Lake Storage Gen1|Contributor|[Assign an Azure role](/azure/data-lake-store/data-lake-store-secure-data?branch=main#assign-users-or-security-groups-to-data-lake-storage-gen1-accounts)
|SQL Server|CREATE, UPDATE, and INSERT|[Grant permissions](/sql/relational-databases/security/permissions-database-engine)|

## 6 - Create a continuous export job

To create a continuous export job with a managed identity, use the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property.

* System-assigned managed identity: `managedIdentity=system`.
* User-assigned managed identity: `managedidentity=<objectId>`.

For example, the following command creates a continuous export job with a system-assigned managed identity:

```kusto
.create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity=system) <| MyTable
```

## Next steps

* To see your continuous export configurations, run the [.show continuous-exports](show-continuous-export.md) command.
* Read the [continuous export overview](continuous-data-export.md).
* Learn more about [managed identities](../../../managed-identities-overview.md).
