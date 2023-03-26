---
title: Use a managed identity to run a continuous export job - Azure Data Explorer
description: This article describes how to use a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/26/2023
---
# Use a managed identity to run a continuous export job

Continuous export jobs allow you to export data from Azure Data Explorer to an external table with a periodically run query. The external table determines where the data is saved, such as Azure Blob Storage, and how it's organized.

In some cases, a [managed identity](../../../managed-identities-overview.md) must be used to successfully configure a [continuous export](continuous-data-export.md) job. For example, if the target external table uses impersonation authentication or if the continuous export query references tables in other databases, a managed identity must be used.

This article will show you how to create a continuous export job with a managed identity. You'll create an external table, assign a managed identity to your cluster, grant the necessary permissions, and then create the continuous export job using the external table and managed identity.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Create an external table

To create an external table for your continuous export, see one of the following articles:

* [Create an Azure Storage external table](../external-tables-azurestorage-azuredatalake.md)
* [Create an SQL Server external table](../external-sql-tables.md)

The following tabs show how to set up an Azure Storage or SQL Server external table with impersonation authentication.

### [Azure Storage](#tab/azure-storage)

The following command creates an external table named `MyExternalTable` for `mycontainer` in an Azure Blob Storage account named `mystorageaccount`. The table has two columns, an integer `x` and a string `s`, and the data is in CSV format. To specify the use of [impersonation authentication](../../api/connection-strings/storage-authentication-methods.md#impersonation), the connection string ends with `;impersonate`.

```kusto
.create external table MyExternalTable (x:int, s:string) kind=storage dataformat=csv 
( 
   h@'https://mystorageaccount.blob.core.windows.net/mycontainer;impersonate' 
)
```

> [!NOTE]
> To create an external table for Azure Data Lake Storage Gen1 or Azure Data Lake Storage Gen2, refer to the [Storage connection string templates](../../api/connection-strings/storage-connection-strings.md#storage-connection-string-templates) to learn how to modify the connection string appropriately.

### [SQL Server](#tab/sql-server)

The following command creates an external table named `MySqlExternalTable` for the `MySqlTable` table stored in a SQL Server database named `MyDatabase`. The table has two columns, an integer `x` and a string `s`.

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

* [Add a system-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity)
* [Add a user-assigned managed identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity)

A system-assigned identity is tied to your cluster and gets deleted when the cluster is deleted. Only one system-assigned identity is allowed per Azure Data Explorer cluster. A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

## 3 - Set the managed identity policy

To allow the managed identity to perform continuous export, you must set a [ManagedIdentity policy](../managed-identity-policy.md). In the policy object, you must specify `AutomatedFlows` in the `AllowedUsages` field.

This policy can be set on the cluster or database level. For examples, see the following tabs.

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

The managed identity must have at least [Database User](../access-control/role-based-access-control.md) permissions over the databases referenced in your continuous export query.

To grant permissions, run the following command. Replace `<DatabaseName>` with the name of the database, `<objectId>` with the managed identity object ID, and `<tenantId>` with the Azure Active Directory tenant ID.

```kusto
.add database <DatabaseName> users ('aadapp=<objectId>;<tenantId>')
```

For more information, see [Manage database security roles](../manage-database-security-roles.md#add-and-remove-security-roles).

## 5 - Grant external resource permissions

If the external table uses impersonation authentication, then the managed identity must have write permissions over the external data store referenced by the external table. The required permissions vary depending on the data store.

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

For example, the following command creates a continuous export job with a system-assigned managed identity.

```kusto
.create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity=system) <| MyTable
```

## Next steps

* Read the [continuous export overview](continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
