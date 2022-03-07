---
title: Ingest data with managed identity authentication
description: Learn how to queue azure blobs for ingestion using managed identity instead of blob SAS or storage account key
author: shsagir
ms.author: shsagir
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: how-to
ms.date: 03/03/2022
---

# Ingest data with managed identity authentication

When queuing blobs for ingestion from customer owned storage accounts, Managed Identities can be used as an authentication method alternative to Storage SAS Tokens and Account Keys.
This allows for a more secure way of ingesting data, as customer SAS Tokens and Account Keys are not shared with Kusto. Instead, a managed identity assigned to the Kusto Cluster is granted read permissions over the customer storage accounts and is used to upload the data to Kusto. This permission can be revoked by the customer at any time.

> [!NOTE]
>
> This method of authentication is only possible for blobs residing in customer owned accounts. It does not apply to local files uploaded by Kusto SDK to the service staging accounts.

## Assign a managed identity to your cluster

Follow [Managed identities overview](managed-identities-overview.md) to add a System or User Assigned managed identity to your cluster.
If your cluster already has the desired managed identity assigned to it, copy its object Id from the Azure Portal's MI overview page.

:::image type="content" source="media/ingest-data-with-managed-identity/system-mi-details.jpeg" alt-text="System MI Object Id":::

## Grant permissions to the managed identity

On Azure Portal, navigate to the storage account you wish to ingest from. Open the in the 'Access Control' Blade Tab, click on '+Add' and choose 'Add Role Assignment', than grant the chosen managed Identity `Storage Blob Data Reader` permissions to the storage account.

> [!IMPORTANT]
>
> Granting `Owner` or `Contributor` permissions is not sufficient, and will result in failed ingestion!

:::image type="content" source="media/ingest-data-with-managed-identity/mi-permissions-on-sa.jpeg" alt-text="Image of SA Role assignment for ingestion with mi":::

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
