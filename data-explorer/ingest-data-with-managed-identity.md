---
title: Ingest data with managed identity authentication
description: Learn how to queue azure blobs for ingestion using managed identity instead of blob SAS or storage account key
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 03/03/2022
---

# Ingest data with managed identity authentication

When queuing blobs for ingestion from customer owned storage accounts, you can use Managed Identities as a more secure authentication method than Azure Storage SAS tokens and account keys. With this method, a managed identity assigned to your cluster is granted read permissions to relevant storage accounts and is used to upload data into your cluster. You can revoke these permission at any time.

> [!NOTE]
>
> This authentication method only applies for Azure blobs and Azure Data Lake files residing in customer owned storage accounts. It does not apply to local files uploaded by Kusto SDK to the service staging accounts.

## Assign a managed identity to your cluster

Follow [Managed identities overview](managed-identities-overview.md) to add a System or User Assigned managed identity to your cluster.
If your cluster already has the desired managed identity assigned to it, copy its object ID using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) using an account associated with the Azure subscription that contains your cluster.

1. Navigate to your cluster and select **Identity**.
1. Select the approriate identity type, system or user assigned, and then copy the object ID of the required identity.

:::image type="content" source="media/ingest-data-with-managed-identity/system-mi-details.jpeg" alt-text="System MI Object Id":::

## Grant permissions to the managed identity

On Azure Portal, navigate to the storage account you wish to ingest from. Open the in the **Access Control** Blade Tab, click on **+Add** and choose **Add Role Assignment**, than grant the chosen managed Identity `Storage Blob Data Reader` permissions to the storage account.

> [!IMPORTANT]
>
> Granting `Owner` or `Contributor` permissions is not sufficient, and will result in failed ingestion!

:::image type="content" source="media/ingest-data-with-managed-identity/mi-permissions-on-sa.jpeg" alt-text="Image of SA Role assignment for ingestion with mi":::

## Set the managed identity policy in Azure Data Explorer

In order to use the managed identity to ingest data into your cluster, you must first allow the `NativeIngestion` usage option for the selected managed identity.
The usage Managed Identity policy can be defined at the cluster or database level of the target cluster.

In the following example, replace `<Managed identity principal Id>` with the object ID of the required managed identity.

To apply the policy at database level, run:

```kusto
.alter-merge database <database name> policy managed_identity "[ { 'ObjectId' : '<Managed identity principal Id>', 'AllowedUsages' : 'NativeIngestion' }]" 
```

To apply the policy at cluster level, run:

```kusto
.alter-merge cluster policy managed_identity "[ { 'ObjectId' : '<Managed identity object Id>', 'AllowedUsages' : 'NativeIngestion' }]" 
```

> [!NOTE]
>
> In order to secure the use of managed identities in Kusto, you are required to have `All Database Admin` permissions on the Kusto cluster.

## Ingest blobs with managed identity using Kusto SDK

When ingesting data using one of our SDKs](net-sdk-ingest-data.md), generate your [blob URI using managed identity authentication](kusto/api/connection-strings/storage-authentication-methods.md#managed-identity) by appending `;managed_identity={objectId}` to the unauthorized blob URI. If you ingest data using your cluster's system assigned managed identity, you can simply append `;managed_identity=system` to the blob URI.

Example,

System Assigned: `https://demosa.blob.core.windows.net/test/export.csv;managed_identity=system`

User Assigned: `https://demosa.blob.core.windows.net/test/export.csv;managed_identity=6a5820b9-fdf6-4cc4-81b9-b416b444fd6d`

> [!IMPORTANT]
>
> - When using Managed Identities to ingest data with the C# SDK, you must provide a blob size in `BlobSourceOptions`. If the size is not set, the SDK attempts to fill in the blob size by accessing the storage account resulting in a failure.
> - The `size` parameter should correspond to the raw (uncompressed) data size, and not necessarily to the blob size.
> - If you do not know the size at the time of ingestion, you may provide a value of zero (0). The service will attempt to discover the size for you using the managed identity for authentication.
