---
title: Ingest data using managed identity authentication
description: Learn how to queue Azure Storage blobs for ingestion using managed identity authentication.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 03/03/2022
---

# Ingest data using managed identity authentication

When queuing blobs for ingestion from your own storage accounts, Managed identities can be used as an alternative authentication method to [shared access signature (SAS)](/azure/storage/common/storage-sas-overview) tokens and [Shared Keys](/rest/api/storageservices/authorize-with-shared-key). Managed identities is a more secure way to ingest data as it doesn't require you to share your customer SAS Tokens or Shared Keys with our service. Instead, a managed identity is assigned to your cluster and is granted read permissions for the storage account that can be used to ingest data. This permission can be revoked by you at any time.

> [!NOTE]
>
> This method of authentication is only possible for blobs residing in storage accounts. It can't be used to ingest local files to the service staging accounts using our SDK.

## Assign a managed identity to your cluster

Use the steps in [configure managed identities for your cluster](configure-managed-identities-cluster.md) to add a system assigned or user assigned managed identity to your cluster. If your cluster already has the required managed identity assigned to it, copy its object ID from the your Managed Identities overview page in the Azure portal.

:::image type="content" source="media/ingest-data-managed-identity/system-mi-details.jpeg" alt-text="Screenshot of the overview page, showing the system managed identity object ID":::

## Grant permissions to the managed identity

In the Azure portal, navigate to the storage account you wish to ingest from.
Open the in the 'Access Control' Blade Tab, click on '+ Add' and choose 'Add Role Assignment', than grant the chosen managed Identity `Storage Blob Data Reader` permissions to the storage account.

> [!IMPORTANT]
>
> Granting `Owner` or `Contributor` permissions is not sufficient, and will result in failed ingestion!

:::image type="content" source="media/ingest-data-managed-identity/mi-permissions-on-sa.jpeg" alt-text="Image of SA Role assignment for ingestion with mi":::

## Set the managed identity policy in Azure Data Explorer

In order to use the managed identity to ingest data into Kusto, the `NativeIngestion` usage must be allowed for the selected managed identity.
The usage can be defined in the Cluster level or Database level Managed Identity policy of the target Kusto cluster.
Replace `<Managed identity principal Id>` with the object id of the managed Id you with to use.

For database level run:

```kusto
.alter-merge database <database name> policy managed_identity "[ { 'ObjectId' : '<Managed identity principal Id>', 'AllowedUsages' : 'NativeIngestion' }]" 
```

For cluster level run:

```kusto
.alter-merge cluster policy managed_identity "[ { 'ObjectId' : '<Managed identity object Id>', 'AllowedUsages' : 'NativeIngestion' }]" 
```

> [!NOTE]
>
> In order to secure the use of managed identities in Kusto, changing the above policies require `All Database Admin` permissions on the Kusto Database.

## Ingest blobs with managed identity using Kusto SDK

When ingesting the data using one of Kusto SDKs](net-sdk-ingest-data.md), instead of creating a blob URI with SAS or Account Key, append `;managed_identity={objectId}` to the unauthorized blob URI.
If you ingest data with the System Assigned Managed Id of your Kusto cluster, you can simply append `;managed_identity=system` to the blob URI.

A blob authorized by a user assigned managed identity:

```http
"https://demosa.blob.core.windows.net/test/export.csv;managed_identity=6a5820b9-fdf6-4cc4-81b9-b416b444fd6d"
```

A blob authorized by the system assigned managed identity:

```http
"https://demosa.blob.core.windows.net/test/export.csv;managed_identity=system"
```

> [!IMPORTANT]
>
> - When using Managed Identities to ingest data with the C# SDK, you must provide a blob size in `BlobSourceOptions`. If the size is not set, the SDK attempts to fill in the blob size by accessing the SA resulting in a failure.
> - The size parameter should correspond to the raw (uncompressed) data size, and not necessarily to the blob size.
> - If you do not know the size at the time of ingestion, you may provide a value of zero (0). Kusto service will attempt to discover the size for you using the managed identity for authentication.
