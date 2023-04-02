---
title: Use a managed identity to run a continuous export job - Azure Data Explorer
description: This article describes how to use a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 04/02/2023
---
# Use a managed identity to run a continuous export job

A [continuous export job](continuous-data-export.md) runs a query to export data to an [external table](../../query/schema-entities/externaltables.md) that references data stored outside Azure Data Explorer, such as in Azure Storage or SQL Server.

When the external table uses impersonation authentication or the query references tables in other databases, the job must be configured with a [managed identity](../../../managed-identities-overview.md). Then, the continuous export can be performed on behalf of the managed identity, which is used for authentication across the Azure resources.

In this article, you'll learn how to configure a system-assigned or user-assigned managed identity and use that identity to set up a continuous export job to an Azure Storage or SQL Server external table.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Set up the managed identity

There are two types of managed identities:

* **System-assigned**: A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is allowed per cluster.

* **User-assigned**: A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

Select one of the following tabs to set up your preferred managed identity type.

### [User-assigned](#tab/user-assigned)

In the following steps, you'll assign a managed identity to your cluster, set a policy to allow the identity to be used with continuous export, and authorize the identity to access the necessary Azure Data Explorer databases.

1. Follow the steps to [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity).

1. Copy and save the managed identity object ID for use in the following steps.

1. Run the following [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command, replacing `<objectId>` with the managed identity object ID from the previous step. This command sets a [managed identity policy](../../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with continuous export.

    ```kusto
    .alter cluster policy managed_identity ```[
        {
          "ObjectId": "<objectId>",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database User](../access-control/role-based-access-control.md) permissions over all databases used for the continuous export, such as the database that contains the external table.

    ```kusto
    .add database <DatabaseName> users ('aadapp=<objectId>;<tenantId>')
    ```

    Replace `<DatabaseName>` with the relevant database, `<objectId>` with the managed identity object ID, and `<tenantId>` with the Azure Active Directory tenant ID.

### [System-assigned](#tab/system-assigned)

In the following steps, you'll assign a managed identity to your cluster, set a policy to allow the identity to be used with continuous export, and authorize the identity to access the necessary Azure Data Explorer databases.

1. Follow the steps to [Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity).

1. Run the following [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command. This command sets a [managed identity policy](../../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with continuous export.

    ```kusto
    .alter cluster policy managed_identity ```[
        {
          "ObjectId": "system",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database User](../access-control/role-based-access-control.md) permissions over all databases used for the continuous export, such as the database that contains the external table.

    ```kusto
    .add database <DatabaseName> users ('aadapp=system;<tenantId>')
    ```

    Replace `<DatabaseName>` with the relevant database and `<tenantId>` with the Azure Active Directory tenant ID.

---

## 2 - Connect to the external resource

When you create an external table in Azure Data Explorer, it can refer to data located in Azure Storage, such as Azure Blob Storage, Azure Data Lake Gen1, and Azure Data Lake Gen2, or SQL Server.

Select one of the following tabs to create and connect to the external table for your use case.

### [Azure Storage](#tab/azure-storage)

In the following steps, you'll create an external table and authorize the managed identity to access the external data store.

1. Create a connection string based on the [storage connection string templates](../../api/connection-strings/storage-connection-strings.md#storage-connection-string-templates). This string indicates the resource to access and its authentication information. For continuous export flows, we recommend [impersonation authentication](../../api/connection-strings/storage-authentication-methods.md#impersonation).

1. Run the [.create or .alter external table](../external-sql-tables.md#create-and-alter-sql-server-external-tables) to create the table. Use the connection string from the previous step as the *storageConnectionString* argument.

    For example, the following command creates `MyExternalTable` that refers to CSV-formatted data in `mycontainer` of `mystorageaccount` in Azure Blob Storage. The table has two columns, one for an integer `x` and one for a string `s`. The connection string ends with `;impersonate`, which indicates to use impersonation authentication to access the data store.

    ```kusto
    .create external table MyExternalTable (x:int, s:string) kind=storage dataformat=csv 
    ( 
        h@'https://mystorageaccount.blob.core.windows.net/mycontainer;impersonate' 
    )
    ```

1. Grant the managed identity write permissions over the relevant external data store. The managed identity needs write permissions because the continuous export job exports data to the data store on behalf of the managed identity.

    | External data store | Required permissions | Grant the permissions|
    |--|--|--|
    |Azure Blob Storage |Storage Blob Data Contributor|[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
    |Data Lake Storage Gen2| Storage Blob Data Contributor|[Manage ACLs](/azure/storage/blobs/data-lake-storage-acl-azure-portal)
    |Data Lake Storage Gen1|Contributor|[Assign an Azure role](/azure/data-lake-store/data-lake-store-secure-data?branch=main#assign-users-or-security-groups-to-data-lake-storage-gen1-accounts)

### [SQL Server](#tab/sql-server)

In the following steps, you'll create an external table and authorize the managed identity to access the external data store.

1. Create a SQL Server connection string. This string indicates the resource to access and its authentication information. For continuous export flows, we recommend [Active Directory Integrated authentication](../../api/connection-strings/sql-authentication-methods.md#aad-integrated-authentication), which is impersonation authentication.

1. Run the [.create or .alter external table](../external-sql-tables.md#create-and-alter-sql-server-external-tables) to create the table. Use the connection string from the previous step as the *sqlServerConnectionString* argument.

    For example, the following command creates `MySqlExternalTable` that refers to `MySqlTable` table in `MyDatabase` of SQL Server. The table has two columns, one for an integer `x` and one for a string `s`. The connection string contains `;Authentication=Active Directory Integrated`, which indicates to use impersonation authentication to access the table.

    ```kusto
    .create external table MySqlExternalTable (x:int, s:string) kind=sql table=MySqlTable
    ( 
       h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;'
    )
    ```

1. Grant the managed identity [CREATE, UPDATE, and INSERT permissions](/sql/relational-databases/security/permissions-database-engine) over the SQL Server database. The managed identity needs write permissions because the continuous export job exports data to the database on behalf of the managed identity.

---

## 3 - Create a continuous export job

1. Format the `managedIdentity` property for use in the next step.

   * System-assigned managed identity: `managedIdentity="system"`.
   * User-assigned managed identity: `managedidentity=<objectId>`.

1. Run the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property to create a continuous export job.

    For example, the following command creates a continuous export job with a system-assigned managed identity:

    ```kusto
    .create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity="system") <| MyTable
    ```

## Next steps

* To see your continuous export configurations, run the [.show continuous-exports](show-continuous-export.md) command.
* Read the [continuous export overview](continuous-data-export.md).
* Learn more about [managed identities](../../../managed-identities-overview.md).
