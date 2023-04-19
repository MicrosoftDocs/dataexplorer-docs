---
title: How to authenticate using managed identities with external tables in Azure Data Explorer
description: Learn how to use managed identities with external tables in Azure Data Explorer cluster.
ms.reviewer: itsagui
ms.topic: how-to
ms.date: 04/19/2023
---

# Authenticate external tables with managed identities

An [external table](kusto/query/schema-entities/externaltables.md) is a schema entity that references data stored outside the Azure Data Explorer database.

External tables can be defined to reference data in Azure Storage or SQL Server. Authentication can be done using a secret or a [managed identity](managed-identities-overview.md).

In this article, you'll learn how to create external tables that authenticate with a managed identity.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](../../../create-cluster-database-portal.md).
* [Database Admin](../access-control/role-based-access-control.md) permissions on the Azure Data Explorer database.

## 1 - Assign a managed identity to your cluster

To use managed identities with your cluster, you first need to assign the managed identity to your cluster. This assignment provides the cluster with permissions to act on behalf of the assigned managed identity. There are two types of managed identities:

* **System-assigned**: A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is allowed per cluster.

* **User-assigned**: A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

Select one of the following tabs to assign the preferred managed identity type to your cluster.

### [User-assigned](#tab/user-assigned)

1. Follow the steps to [Add a user-assigned identity](../../../configure-managed-identities-cluster.md#add-a-user-assigned-identity).

1. In the Azure portal, in the left menu of your managed identity resource, select **Properties**. Copy and save the **Tenant Id** and **Principal Id** for later use.

    :::image type="content" source="../../../media/continuous-export/managed-identity-ids.png" alt-text="Screenshot of Azure portal area with managed identity ids." lightbox="../../../media/continuous-export/managed-identity-ids.png":::

### [System-assigned](#tab/system-assigned)

1. Follow the steps to [Add a system-assigned identity](../../../configure-managed-identities-cluster.md#add-a-system-assigned-identity).

1. Copy and save the **Object (principal) ID** for later use.

---

## 2 - Create a managed identity policy

Now that you've assigned a user-assigned managed identity to your cluster, define the [managed identity policy](kusto/management/alter-managed-identity-policy-command.md), to allow the specific managed identity use the `ExternalTable`. The policy can either be defined in the cluster level or at a specific database level.

Enter the following policy alter-merge command for the database level:

~~~kusto
.alter-merge database DatabaseName policy managed_identity ```
[
  {
    "ObjectId": "802bada6-4d21-44b2-9d15-e66b29e4d63e",
    "AllowedUsages": "ExternalTable"
  }
]
```
~~~

> [!NOTE]
> To define the policy at the cluster level, replace `database db` with `cluster`.

> [!NOTE]
> To override the existing policy, use the `alter` command instead of the `alter-merge` command.

## Grant correct permissions to the external resource

To access an external resource, such as Azure Storage, you'll need to provide necessary external resource permissions to the managed identity.  

If you're creating an Azure Storage External Table with a managed identity, the managed identity needs to be granted the following Azure Storage RBAC permissions. Grant these permissions by using the following guidance: [Azure Storage - Assign an Azure role](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal#assign-an-azure-role).

The RBAC permission levels to be granted depend on the activity to be performed:

Activity | Azure Storage permissions granted to managed identity
|---|---|
| **External table query operations** | Storage Blob Data Reader
| **External table used for export operations** | Storage Blob Data Contributor

## Create an external table

There are two types of external tables, [Azure Storage external tables](kusto/management/external-tables-azurestorage-azuredatalake.md) and [SQL Server external tables](kusto/management/external-sql-tables.md), and both support authentication with managed identities. In this section, we'll demonstrate creation of Azure Storage external tables with managed identities.

To use a user-assigned managed identity with Azure Storage external tables, you need to append `;managed_identity=[managed-identity-object-id]` to the end of the connection string, for example: `https://StorageAccountName.blob.core.windows.net/Container;managed_identity=802bada6-4d21-44b2-9d15-e66b29e4d63e`

> [!NOTE]
> For system-assigned managed identities, you can use the reserved word `system` instead: <br>
>`https://StorageAccountName.blob.core.windows.net/Container[/BlobName];managed_identity=system`
    
This results in the following command, to create the external table with your managed identity:

```kusto
.create external table tableName (col_a: string, col_b: string)
kind = storage 
dataformat = csv (
'https://StorageAccountName.blob.core.windows.net/Container;managed_identity=802bada6-4d21-44b2-9d15-e66b29e4d63e'
)
```

## Next steps

* Query the external table using [external_table()](kusto/query/externaltablefunction.md)
* [Export data to an external table](kusto/management/data-export/export-data-to-an-external-table.md)
* Configure [Continuous data export](kusto/management/data-export/continuous-data-export.md)
* Learn more about [managed identities](../../../managed-identities-overview.md)
