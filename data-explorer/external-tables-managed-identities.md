---
title: How to authenticate using managed identities with External Tables in Azure Data Explorer
description: Learn how to use managed identities with External Tables in Azure Data Explorer cluster.
author: orspod
ms.author: orspodek
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: how-to
ms.date: 11/25/2020
---

# Authenticate external tables with managed identities

An [external table](azure/data-explorer/kusto/query/schema-entities/externaltables) is a Kusto schema entity that references data stored outside the Azure Data Explorer database.
External tables can be defined to reference data in Azure Storage or SQL Server. Authentication is done using a secret (for example a SAS URI in the case of Azure Storage, or a username and password in the case of SQL Server), or using a Managed Identity. In this article, you'll learn how to create external tables that authenticate to Azure Storage with a managed identity.

> [!NOTE]
> This guide demonstrates external table flows over Azure Blob Storage. Managed Identities can be used similarly with other types of Azure Storage resources, and also with SQL Server, using the relevant connection strings as stated in [Kusto storage connection string](/storage) and [Kusto sql connection strings](/some-link).

In order to use managed identities with your external table, follow these steps:

1. [Assign managed identity to your cluster]()
1. [Create managed identity policy]()
1. [Create the external table]()

## Assign managed identity to your cluster

In order to use managed identities with your cluster, you first need to assign it to your cluster. This will provide the cluster with permissions to act on behalf of the assigned managed identity. For instructions please follow this [guide](/some-link)

In this guide we will demonstrate using a user-assigned managed identity with the object id `802bada6-4d21-44b2-9d15-e66b29e4d63e`.

## Create managed identity policy

Before we can start using managed identities with external tables, we first need to define the [managed identity policy](azure/data-explorer/kusto/management/alter-managed-identity-policy-command), permitting the specific managed identity for the `ExternalTable` usage.

The policy can either be defined in the cluster level, and therefore will be enabled for all databases in the cluster, or in a specific database level.

The following is a policy alter command for the database level:

~~~kusto
.alter database DatabaseName policy managed_identity ```
[
  {
    "ObjectId": "802bada6-4d21-44b2-9d15-e66b29e4d63e",
    "AllowedUsages": "ExternalTable"
  }
]
```
~~~

To define it in the cluster level, replace `database db` with `cluster`.

## Create the external table

External table's authentication method is listed as part of the `connection string` provided in the command.

In order to specify managed identity authentication for your external table, add the managed identity authentication suffix.

for user-assigned managed identities, attach `;managed_identity=[managed-identity-object-id]` to the end of the connection string:
`https://StorageAccountName.blob.core.windows.net/Container;managed_identity=802bada6-4d21-44b2-9d15-e66b29e4d63e`

for system-assigned managed identities, you can use the reserved word `system` instead:

`https://StorageAccountName.blob.core.windows.net/Container[/BlobName];managed_identity=system`

We end up with the following create external table command:

```kusto
.create external table tableName (col_a: string, col_b: string)
kind = storage 
dataformat = csv (
'https://StorageAccountName.blob.core.windows.net/Container;managed_identity=802bada6-4d21-44b2-9d15-e66b29e4d63e'
)
```

Now you can query the external table ([see example]()), export data into it ([see example]()), or configure a continuous export of data into it ([see example]()).