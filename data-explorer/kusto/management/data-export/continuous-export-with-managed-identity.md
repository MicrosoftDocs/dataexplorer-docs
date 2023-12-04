---
title:  Use a managed identity to run a continuous export job
description: This article describes how to use a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 06/19/2023
---
# Use a managed identity to run a continuous export job

A [continuous export job](continuous-data-export.md) exports data to an [external table](../../query/schema-entities/externaltables.md) with a periodically run query.

The continuous export job should be configured with a [managed identity](../../../managed-identities-overview.md) in the following scenarios:

* When the external table uses impersonation authentication.
* When the query references tables in other databases.
* When the query references tables with an enabled [row level security policy](../rowlevelsecuritypolicy.md).

A continuous export job configured with a managed identity is performed on behalf of the managed identity.

In this article, you learn how to configure a system-assigned or user-assigned managed identity and create a continuous export job using that identity.

## Prerequisites

* A cluster and database. [Create a cluster and database](../../../create-cluster-and-database.md).
* [All Databases Admin](../access-control/role-based-access-control.md) permissions on the database.

## Configure a managed identity

There are two types of managed identities:

* **System-assigned**: A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is allowed per cluster.

* **User-assigned**: A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

Select one of the following tabs to set up your preferred managed identity type.

### [User-assigned](#tab/user-assigned)

1. Follow the steps to [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity).

1. In the Azure portal, in the left menu of your managed identity resource, select **Properties**. Copy and save the **Tenant Id** and **Principal Id** for use in the following steps.

    :::image type="content" source="../../../media/continuous-export/managed-identity-ids.png" alt-text="Screenshot of Azure portal area with managed identity IDs." lightbox="../../../media/continuous-export/managed-identity-ids.png":::

1. Run the following [.alter-merge policy managed_identity](../alter-merge-managed-identity-policy-command.md) command, replacing `<objectId>` with the managed identity object ID from the previous step. This command sets a [managed identity policy](../../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with continuous export.

    ```kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "<objectId>",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database Viewer](../access-control/role-based-access-control.md) permissions over all databases used for the continuous export, such as the database that contains the external table.

    ```kusto
    .add database <DatabaseName> viewers ('aadapp=<objectId>;<tenantId>')
    ```

    Replace `<DatabaseName>` with the relevant database, `<objectId>` with the managed identity **Principal Id** from step 2, and `<tenantId>` with the Microsoft Entra ID **Tenant Id** from step 2.

### [System-assigned](#tab/system-assigned)

1. Follow the steps to [Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity).

1. Copy and save the **Object (principal) ID** for use in a later step.

1. Run the following [.alter-merge policy managed_identity](../alter-merge-managed-identity-policy-command.md) command. This command sets a [managed identity policy](../../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with continuous export.

    ```kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "system",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database Viewer](../access-control/role-based-access-control.md) permissions over all databases used for the continuous export, such as the database that contains the external table.

    ```kusto
    .add database <DatabaseName> viewers ('aadapp=<objectId>')
    ```

    Replace `<DatabaseName>` with the relevant database and `<objectId>` with the managed identity **Object (principal) ID** from step 2.

---

## Set up an external table

External tables refer to data located in Azure Storage, such as Azure Blob Storage, Azure Data Lake Gen1, and Azure Data Lake Gen2, or SQL Server.

Select one of the following tabs to set up an Azure Storage or SQL Server external table.

### [Azure Storage](#tab/azure-storage)

1. Create a connection string based on the [storage connection string templates](../../api/connection-strings/storage-connection-strings.md#storage-connection-string-templates). This string indicates the resource to access and its authentication information. For continuous export flows, we recommend [impersonation authentication](../../api/connection-strings/storage-authentication-methods.md#impersonation).

1. Run the [.create or .alter external table](../external-sql-tables.md) to create the table. Use the connection string from the previous step as the *storageConnectionString* argument.

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
    |Data Lake Storage Gen2| Storage Blob Data Contributor|[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
    |Data Lake Storage Gen1|Contributor|[Assign an Azure role](/azure/data-lake-store/data-lake-store-secure-data?branch=main#assign-users-or-security-groups-to-data-lake-storage-gen1-accounts)

### [SQL Server](#tab/sql-server)

1. Create a SQL Server connection string. This string indicates the resource to access and its authentication information. For continuous export flows, we recommend [Microsoft Entra integrated authentication](../../api/connection-strings/sql-authentication-methods.md#azure-ad-integrated-impersonation), which is impersonation authentication.

1. Run the [.create or .alter external table](../external-sql-tables.md) to create the table. Use the connection string from the previous step as the *sqlServerConnectionString* argument.

    For example, the following command creates `MySqlExternalTable` that refers to `MySqlTable` table in `MyDatabase` of SQL Server. The table has two columns, one for an integer `x` and one for a string `s`. The connection string contains `;Authentication=Active Directory Integrated`, which indicates to use impersonation authentication to access the table.

    ```kusto
    .create external table MySqlExternalTable (x:int, s:string) kind=sql table=MySqlTable
    ( 
       h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;'
    )
    ```

1. Grant the managed identity CREATE, UPDATE, and INSERT permissions over the SQL Server database. The managed identity needs write permissions because the continuous export job exports data to the database on behalf of the managed identity. To learn more, see [Permissions](/sql/relational-databases/security/permissions-database-engine).

---

## Create a continuous export job

Select one of the following tabs to create a continuous export job that will run on behalf of a user-assigned or system-assigned managed identity.

### [User-assigned](#tab/user-assigned)

Run the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property set to the managed identity object ID.

For example, the following command creates a continuous export job named `MyExport` to export the data in `MyTable` to `MyExternalTable` on behalf of a user-assigned managed identity. `<objectId>` should be a managed identity object ID.

```kusto
.create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity=<objectId>, intervalBetweenRuns=5m) <| MyTable
```

### [System-assigned](#tab/system-assigned)

Run the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property set to `system`.

For example, the following command creates a continuous export job named `MyExport` to export the data in `MyTable` to `MyExternalTable` on behalf of your system-assigned managed identity.

```kusto
.create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity="system", intervalBetweenRuns=5m) <| MyTable
```

---

## Related content

* [.show continuous-exports](show-continuous-export.md)
* [Continuous export overview](continuous-data-export.md)
* [Managed identities](../../../managed-identities-overview.md)
