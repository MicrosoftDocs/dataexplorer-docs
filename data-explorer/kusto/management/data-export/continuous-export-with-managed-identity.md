---
title: Use a managed identity to run a continuous export job - Azure Data Explorer
description: This article describes how to use a managed identity for continuous export in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 03/29/2023
---
# Use a managed identity to run a continuous export job

A [continuous export job](continuous-data-export.md) runs a query to export data to an [external table](../../query/schema-entities/externaltables.md) that references data stored outside Azure Data Explorer, such as in Azure Storage or SQL Server.

When the external table uses impersonation authentication or the query references tables in other databases, the job must be configured with a [managed identity](../../../managed-identities-overview.md). Then, the continuous export can be performed on behalf of the managed identity, which is used for authentication across the Azure resources.

In this article, you'll learn how to configure a system-assigned or user-assigned managed identity and use that identity to set up a continuous export job to an Azure Storage or SQL Server external table.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Set up the managed identity

There are two types of managed identities: system-assigned and user-assigned. A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is permitted per Azure Data Explorer cluster. A user-assigned identity is a separate Azure resource. You can assign multiple user-assigned identities to your cluster.

Select one of the following tabs to set up your preferred managed identity type.

### [User-assigned](#tab/user-assigned)

1. Follow the steps in [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity).

1. Copy and save the managed identity object ID for use in later steps.

1. Run the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command to set a [managed identity policy](../../management/managed-identity-policy.md). For the managed identity to be used with continuous export, the `AutomatedFlows` usage must be specified in the `AllowedUsages` property. Replace `<objectId>` with the managed identity object ID from the previous step.

    ```kusto
    .alter cluster policy managed_identity ```[
        {
          "ObjectId": "<objectId>",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database instead of the cluster, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database User](../access-control/role-based-access-control.md) permissions. Replace `<objectId>` with the managed identity object ID, and `<tenantId>` with the Azure Active Directory tenant ID. These permissions must be granted over any database used for the continuous export, such as the database that contains the external table or a database referenced in the query.

    ```kusto
    .add database <DatabaseName> users ('aadapp=<objectId>;<tenantId>')
    ```

### [System-assigned](#tab/system-assigned)

1. Follow the steps in [Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity).

1. Run the [.alter managed_identity policy](../alter-managed-identity-policy-command.md) command to set the [managed identity policy](../../management/managed-identity-policy.md). For the managed identity to be used with continuous export, the `AutomatedFlows` usage must be specified in the `AllowedUsages` property.

    ```kusto
    .alter cluster policy managed_identity ```[
        {
          "ObjectId": "system",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database instead of the cluster, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database User](../access-control/role-based-access-control.md) permissions. Replace `<tenantId>` with the Azure Active Directory tenant ID. These permissions must be granted over any database used for the continuous export, such as the database that contains the external table or a database referenced in the query.

    ```kusto
    .add database <DatabaseName> users ('aadapp=system;<tenantId>')
    ```

---

## 2 - Connect to the external resource

An external table references data stored outside Azure Data Explorer. Azure Storage external tables can reference data stored in Azure Blob Storage, Azure Data Lake Gen1, and Azure Data Lake Gen2. SQL Server external tables reference data stored in SQL Server tables.

Select one of the following tabs to create an external table for your use case.

### [Azure Storage](#tab/azure-storage)

1. Use the [Storage connection string templates](../../api/connection-strings/storage-connection-strings.md#storage-connection-string-templates) to create a connection string that specifies the resource to access and its authentication information. For continuous export flows, we recommend using [impersonation authentication](../../api/connection-strings/storage-authentication-methods.md#impersonation).

    In the following example, `;impersonate` indicates to use impersonation authentication and `h@` is used to [obfuscate the string](../../query/scalar-data-types/string.md#obfuscated-string-literals).

    ```kusto
    h@'https://mystorageaccount.blob.core.windows.net/mycontainer;impersonate'
    ```

1. Run the [.create or .alter external table](../external-sql-tables.md#create-and-alter-sql-server-external-tables) to create the table. Use the connection string from the previous step as the *storageConnectionString* argument.

1. When the external table uses impersonation authentication, the managed identity must have write permissions over the external data store. Write permissions are required because the continuous export job attempts to export data to the data store on behalf of the managed identity. Grant the managed identity the required write permissions:

    | External data store | Required permissions | Grant the permissions|
    |--|--|--|
    |Azure Blob Storage |Storage Blob Data Contributor|[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
    |Data Lake Storage Gen2| Storage Blob Data Contributor|[Manage ACLs](/azure/storage/blobs/data-lake-storage-acl-azure-portal)
    |Data Lake Storage Gen1|Contributor|[Assign an Azure role](/azure/data-lake-store/data-lake-store-secure-data?branch=main#assign-users-or-security-groups-to-data-lake-storage-gen1-accounts)

### [SQL Server](#tab/sql-server)

1. Create a SQL Server connection string that specifies the resource to access and its authentication information. For continuous export flows, we recommend using [Active Directory Integrated authentication](../../api/connection-strings/sql-authentication-methods.md#aad-integrated-authentication), which is impersonation authentication.

    In the following example, `;Authentication=Active Directory Integrated` indicates to use impersonation authentication.

    ```kusto
    h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;
    ```

1. Run the [.create or .alter external table](../external-sql-tables.md#create-and-alter-sql-server-external-tables) to create the table. Use the connection string from the previous step as the *sqlServerConnectionString* argument.

1. When the external table uses impersonation authentication, the managed identity must have write permissions over the external data store. Write permissions are required because the continuous export job attempts to export data to the data store on behalf of the managed identity. Grant the managed identity CREATE, UPDATE, and INSERT permissions. To learn more, see [Permissions](/sql/relational-databases/security/permissions-database-engine).

---

## 3 - Create a continuous export job

To create a continuous export job with a managed identity, use the [.create-or-alter continuous-export](create-alter-continuous.md) command with the `managedIdentity` property.

* System-assigned managed identity: `managedIdentity="system"`.
* User-assigned managed identity: `managedidentity=<objectId>`.

For example, the following command creates a continuous export job with a system-assigned managed identity:

```kusto
.create-or-alter continuous-export MyExport over (MyTable) to table MyExternalTable with (managedIdentity="system") <| MyTable
```

## Next steps

* To see your continuous export configurations, run the [.show continuous-exports](show-continuous-export.md) command.
* Read the [continuous export overview](continuous-data-export.md).
* Learn more about [managed identities](../../../managed-identities-overview.md).
