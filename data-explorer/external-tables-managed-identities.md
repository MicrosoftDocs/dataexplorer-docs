---
title: How to authenticate using managed identities with external tables in Azure Data Explorer
description: Learn how to use managed identities with external tables in Azure Data Explorer cluster.
ms.reviewer: itsagui
ms.topic: how-to
ms.date: 04/20/2023
---

# Authenticate external tables with managed identities

An [external table](kusto/query/schema-entities/external-tables.md) is a schema entity that references data stored outside the Azure Data Explorer database. External tables can be defined to reference data in Azure Storage or SQL Server and support various authentication methods.

In this article, you learn how to create an external table that authenticates with a [managed identity](managed-identities-overview.md).

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Database Admin](kusto/access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Configure a managed identity for use with external tables

There are two types of managed identities:

* **System-assigned**: A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is allowed per cluster.

* **User-assigned**: A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

Select one of the following tabs to set up the preferred managed identity type.

### [User-assigned](#tab/user-assigned)

1. Follow the steps to [Add a user-assigned identity](configure-managed-identities-cluster.md#add-a-user-assigned-identity) to your cluster, and save the **Object (principal) ID** for later use.

1. Run the [.alter-merge policy managed_identity](kusto/management/alter-merge-managed-identity-policy-command.md) command. This command sets a [managed identity policy](kusto/management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with external tables. Replace `<objectId>` with the **Object (principal) ID**.

    ```kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "<objectId>",
          "AllowedUsages": "ExternalTable"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

### [System-assigned](#tab/system-assigned)

1. Follow the steps to [Add a system-assigned identity](configure-managed-identities-cluster.md#add-a-system-assigned-identity) to your cluster.

1. Run the following [.alter-merge policy managed_identity](kusto/management/alter-merge-managed-identity-policy-command.md) command. This command sets a [managed identity policy](kusto/management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with external tables.

    ```kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "system",
          "AllowedUsages": "ExternalTable"
        }
    ]```
    ```

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

---

## 2 - Grant the managed identity external resource permissions

The managed identity must have permissions to the external resource in order to successfully authenticate.

Select the tab for the relevant type of external resource, and assign the required permissions.

### [Azure Storage](#tab/azure-storage)

The following table shows the required permissions by external resource. To import or query data from the external resource, grant the managed identity read permissions. To export data to the external resource, grant the managed identity write permissions.

| External data store | Read permissions | Write permissions | Grant the permissions|
|--|--|--|--|
|Azure Blob Storage | Storage Blob Data Reader | Storage Blob Data Contributor |[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
|Data Lake Storage Gen2| Storage Blob Data Reader | Storage Blob Data Contributor |[Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal)|
|Data Lake Storage Gen1| Reader | Contributor |[Assign an Azure role](/azure/data-lake-store/data-lake-store-secure-data?branch=main#assign-users-or-security-groups-to-data-lake-storage-gen1-accounts)

### [SQL Server](#tab/sql-server)

To import or query data from the SQL database, grant the managed identity table SELECT permissions. To export data to the SQL database, grant the managed identity CREATE, UPDATE, and INSERT permissions. To learn more, see [Permissions](/sql/relational-databases/security/permissions-database-engine).

### [Cosmos DB](#tab/cosmosdb)

To import or query data from the Cosmos DB database, grant the managed identity read permissions. 
To learn more, see [Permissions](/azure/cosmos-db/how-to-setup-rbac).

---

## 3 - Create an external table

There are two types of external tables that support authentication with managed identities: [Azure Storage external tables](kusto/management/external-tables-azurestorage-azuredatalake.md) and [SQL Server external tables](kusto/management/external-sql-tables.md).

Select one of the following tabs to set up an Azure Storage or SQL Server external table.

### [Azure Storage](#tab/azure-storage)

To create an Azure Storage external table, do the following steps:

1. Create a connection string based on the [storage connection string templates](kusto/api/connection-strings/storage-connection-strings.md#storage-connection-string-templates). This string indicates the resource to access and its authentication information. Specify the [managed identity authentication method](kusto/api/connection-strings/storage-authentication-methods.md#managed-identity).

1. Run the [.create or .alter external table](kusto/management/external-sql-tables.md) to create the table. Use the connection string from the previous step as the *storageConnectionString* argument.

#### Example

The following command creates `MyExternalTable` that refers to CSV-formatted data in `mycontainer` of `mystorageaccount` in Azure Blob Storage. The table has two columns, one for an integer `x` and one for a string `s`. The connection string ends with `;managed_identity=system`, which indicates to use a system-assigned managed identity for authentication to access the data store.

```kusto
.create external table MyExternalTable (x:int, s:string) kind=storage dataformat=csv 
( 
    h@'https://mystorageaccount.blob.core.windows.net/mycontainer;managed_identity=system' 
)
```

> [!NOTE]
> To authenticate with a user-assigned managed identity, replace `system` with the managed identity object ID.

### [SQL Server](#tab/sql-server)

To create a SQL Server external table, do the following steps:

1. Create a SQL Server connection string. This string indicates the resource to access and its authentication information. Specify the [managed identity authentication method](kusto/api/connection-strings/sql-authentication-methods.md#managed-identity).

2. Run the [.create or .alter external table](kusto/management/external-sql-tables.md) command to create the table. Use the connection string as the *SqlConnectionString* argument.

#### Example

The following command creates `MySqlExternalTable` that refers to `MySqlTable` table in `MyDatabase` of SQL Server. The table has two columns, one for an integer `x` and one for a string `s`. The connection string contains `;Authentication="Active Directory Managed Identity";User Id=123456789`, which indicates to use a user-assigned managed identity with object ID `123456789` to access the table.

```kusto
.create external table MySqlExternalTable (x:int, s:string) kind=sql table=MySqlTable
( 
    h@'Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";User Id=123456789;Initial Catalog=MyDatabase;'
)
```

> [!NOTE]
> To authenticate with a system-assigned managed identity, remove `;User Id={object_id}` and only specify `;Authentication="Active Directory Managed Identity"`.

### [Cosmos DB](#tab/cosmosdb)

To create a Cosmos DB external table, do the following steps:

1. Create a Cosmos DB connection string. This string indicates the resource to access and its authentication information. Specify the [managed identity authentication method](kusto/api/connection-strings/sql-authentication-methods.md#managed-identity).

2. Run the [.create or .alter external table](kusto/management/external-sql-tables.md) command to create the table. Use the connection string as the *SqlConnectionString* argument.

#### Example


##### User-assigned managed identity

The following command creates `MyCosmosDbExternalTable` that refers to data in `MyCollection` in database `MyDatabase` of Cosmos DB account `mycosmos`. 

* The connection string contains `;Authentication="Active Directory Managed Identity";User Id=123456789`, which indicates to use a user-assigned managed identity with an object ID of `123456789` to access the table.

```kusto
.create external table MyCosmosDbExternalTable (x:int, s:string) kind=sql
( 
    h@'AccountEndpoint=https://mycosmos.documents.azure.com:443/;Database=MyDatabase;Collection=MyCollection;Authentication="Active Directory Managed Identity";User Id=123456789;'
)
with 
(
   sqlDialect = "CosmosDbSQL"
)  
```

##### System-assigned managed identity

The connection string contains only `;Authentication="Active Directory Managed Identity";`, which indicates to use a system-assigned managed identity

```kusto
.create external table MyCosmosDbExternalTable (x:int, s:string) kind=sql
( 
    h@'AccountEndpoint=https://mycosmos.documents.azure.com:443/;Database=MyDatabase;Collection=MyCollection;Authentication="Active Directory Managed Identity";'
)
with 
(
   sqlDialect = "CosmosDbSQL"
)  
```

---

## Related content

* [Managed identities overview](managed-identities-overview.md)
* [Export data to an external table](kusto/management/data-export/export-data-to-an-external-table.md)
* [Continuous data export](kusto/management/data-export/continuous-data-export.md)
