---
title: Ingest data using managed identity authentication
description: Learn how to queue Azure Storage blobs for ingestion using managed identity authentication.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 03/03/2022
---

# Ingest data using managed identity authentication

When queuing blobs for ingestion from your own storage accounts, you can use managed identities as an alternative to [shared access signature (SAS)](/azure/storage/common/storage-sas-overview) tokens and [Shared Keys](/rest/api/storageservices/authorize-with-shared-key) authentication methods. Managed identities are a more secure way to ingest data as they don't require you to share your customer SAS tokens or shared keys with the service. Instead, a managed identity is assigned to your cluster and is granted read permissions for the storage account used to ingest data. You can revoke these permissions at any time.

> [!NOTE]
>
> This authentication method only applies to Azure blobs and Azure Data Lake files residing in customer owned storage accounts. It does not apply to local files uploaded using the Kusto SDK.

## Assign a managed identity to your cluster

Follow [Managed identities overview](managed-identities-overview.md) to add a System or User Assigned managed identity to your cluster.
If your cluster already has the desired managed identity assigned to it, copy its object ID using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) using an account associated with the Azure subscription that contains your cluster.

1. Navigate to your cluster and select **Identity**.
1. Select the appropriate identity type, system or user assigned, and then copy the object ID of the required identity.

:::image type="content" source="media/ingest-data-managed-identity/system-managed-identity-details.png" alt-text="Screenshot of the overview page, showing the system managed identity object I D":::

## Grant permissions to the managed identity

1. In the Azure portal, navigate to the storage account that contains the data you want to ingest.

1. Select **Access Control** and then select **+ Add** > **Add Role Assignment**.
1. Grant the managed Identity **Storage Blob Data Reader** permissions to the storage account.

> [!IMPORTANT]
>
> Granting **Owner** or **Contributor** permissions is not sufficient and will result in the ingestion failing.

:::image type="content" source="media/ingest-data-managed-identity/managed-identity-permissions-on-system-assigned.png" alt-text="Screenshot of the add role assignment page, showing the system assigned role for ingestion using managed identities":::

## Set the managed identity policy in Azure Data Explorer

In order to use the managed identity to ingest data into your cluster, you must first allow the `NativeIngestion` usage option for the selected managed identity.
The usage Managed Identity policy can be defined at the cluster or database level of the target cluster.

In the following example, replace `<Managed identity principal Id>` with the object ID of the required managed identity.

To apply the policy at the database level, run:

```kusto
.alter-merge database <database name> policy managed_identity "[ { 'ObjectId' : '<Managed identity principal Id>', 'AllowedUsages' : 'NativeIngestion' }]"
```

To apply the policy at the cluster level, run:

```kusto
.alter-merge cluster policy managed_identity "[ { 'ObjectId' : '<Managed identity object Id>', 'AllowedUsages' : 'NativeIngestion' }]"
```

> [!NOTE]
>
> In order to secure the use of managed identities, you must have the `All Database Admin` permission on the cluster to edit the Managed Identity Policy.

## Ingest blobs with managed identity using Kusto SDK

When ingesting data using one of Kusto [SDKs](net-sdk-ingest-data.md), generate your [blob URI using managed identity authentication](kusto/api/connection-strings/storage-authentication-methods.md#managed-identity) by appending `;managed_identity={objectId}` to the unauthorized blob URI. If you ingest data your cluster's system assigned managed identity, you can append `;managed_identity=system` to the blob URI.

The following are examples of blob URIs for system and user assigned managed identities.

* System assigned: `https://demosa.blob.core.windows.net/test/export.csv;managed_identity=6a5820b9-fdf6-4cc4-81b9-b416b444fd6d`
* User assigned: `https://demosa.blob.core.windows.net/test/export.csv;managed_identity=system`

> [!IMPORTANT]
>
> * When using Managed Identities to ingest data with the C# SDK, you must provide a blob size in `BlobSourceOptions`. If the size is not set, the SDK attempts to fill in the blob size by accessing the storage account resulting in a failure.
> * The *size* parameter should correspond to the raw (uncompressed) data size, and not necessarily to the blob size.
> * If you do not know the size at the time of ingestion, you may provide a value of zero (0). The service will attempt to discover the size using the managed identity for authentication.

## Next steps

* [Write queries](write-queries.md)
