---
title:  Storage connection strings
description: This article describes storage connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 07/13/2023
---
# Storage connection strings

Azure Data Explorer can interact with external storage services. For example, you can [create an Azure Storage external tables](../../management/external-tables-azurestorage-azuredatalake.md) in order to query data stored on external storages.

The following types of external storage are supported:

* Azure Blob Storage
* Azure Data Lake Storage Gen2
* Azure Data Lake Storage Gen1
* Amazon S3

Each type of storage has corresponding connection string formats used to describe the storage resources and how to access them.
Azure Data Explorer uses a URI format to describe these storage resources and the properties necessary to access them, such as security credentials.

> [!NOTE]
> HTTP web services that don't implement the entire API set of Azure Blob Storage aren't supported, even if they appear to work in some scenarios.

## Storage connection string templates

Each storage type has a different connection string format. See the following table for connection string templates for each storage type.

|Storage Type                  |Scheme    |URI template                          |
|------------------------------|----------|--------------------------------------|
|Azure Blob Storage            |`https://`|`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`https://`|`https://`*StorageAccountName*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`abfss://`|`abfss://`*Filesystem*`@`*StorageAccountName*`.dfs.core.windows.net/`[*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen1  |`adl://`  |`adl://`*StorageAccountName*.azuredatalakestore.net/*PathToDirectoryOrFile*[*CallerCredentials*]|
|Amazon S3                     |`https://`|`https://`*BucketName*`.s3.`*RegionName*`.amazonaws.com/`*ObjectKey*[*CallerCredentials*]|

> [!NOTE]
> To prevent secrets from showing up in traces, use [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals).

## Storage authentication methods

To interact with nonpublic external storage from Azure Data Explorer, you must specify authentication means as part of the external storage connection string. The connection string defines the resource to access and its authentication information.

Azure Data Explorer supports the following authentication methods:

- [Storage connection strings](#storage-connection-strings)
  - [Storage connection string templates](#storage-connection-string-templates)
  - [Storage authentication methods](#storage-authentication-methods)
    - [Supported authentication by storage type](#supported-authentication-by-storage-type)
    - [Impersonation](#impersonation)
    - [Managed identity](#managed-identity)
    - [Shared Access (SAS) token](#shared-access-sas-token)
    - [Microsoft Entra access token](#microsoft-entra-access-token)
    - [Storage account access key](#storage-account-access-key)
    - [Amazon Web Services programmatic access keys](#amazon-web-services-programmatic-access-keys)

### Supported authentication by storage type

The following table summarizes the available authentication methods for different external storage types.

| Authentication method | Available in Blob storage? | Available in Azure Data Lake Storage Gen 2? | Available in Azure Data Lake Storage Gen 1? | Available in Amazon S3? | When should you use this method? |
|---|---|---|---|---|---|
| [Impersonation](#impersonation) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use for attended flows when you need complex access control over the external storage. For example, in continuous export flows. You can also restrict storage access at the user level. |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use in unattended flows, where no Microsoft Entra principal can be derived to execute queries and commands. Managed identities are the only authentication solution. |
| [Shared Access (SAS) key](#shared-access-sas-token) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | SAS tokens have an expiration time. Use when accessing storage for a limited time. |
| [Microsoft Entra access token](#azure-ad-access-token) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Microsoft Entra tokens have an expiration time. Use when accessing storage for a limited time. |
| [Storage account access key](#storage-account-access-key) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | When you need to access resources on an ongoing basis. |
| [Amazon Web Services Programmatic Access Keys](#amazon-web-services-programmatic-access-keys) | :x: | :x: | :x: | :heavy_check_mark: | When you need to access Amazon S3 resources on an ongoing basis. |

### Impersonation

Azure Data Explorer impersonates the requestor's principal identity to access the resource. To use impersonation, append `;impersonate` to the connection string.

|Example|
|--|
|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`|

The principal must have the necessary permissions to perform the operation. For example in Azure Blob Storage, to read from the blob the principal needs the Storage Blob Data Reader role and to export to the blob the principal needs the Storage Blob Data Contributor role. To learn more, see [Azure Blob Storage / Data Lake Storage Gen2 access control](/azure/storage/blobs/data-lake-storage-access-control-model#role-based-access-control-azure-rbac) or [Data Lake Storage Gen1 access control](/azure/data-lake-store/data-lake-store-security-overview#azure-rbac-for-account-management).

### Managed identity

Azure Data Explorer makes requests on behalf of a managed identity and uses its identity to access resources. For a system-assigned managed identity, append `;managed_identity=system` to the connection string. For a user-assigned managed identity, append `;managed_identity={object_id}` to the connection string.

|Managed identity type|Example|
|--|--|--|
|System-assigned|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`|
|User-assigned|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=12345678-1234-1234-1234-1234567890ab"`|

The managed identity must have the necessary permissions to perform the operation. For example in Azure Blob Storage, to read from the blob the managed identity needs the Storage Blob Data Reader role and to export to the blob the managed identity needs the Storage Blob Data Contributor role. To learn more, see [Azure Blob Storage / Data Lake Storage Gen2 access control](/azure/storage/blobs/data-lake-storage-access-control-model#role-based-access-control-azure-rbac) or [Data Lake Storage Gen1 access control](/azure/data-lake-store/data-lake-store-security-overview#azure-rbac-for-account-management).

> [!NOTE]
> Managed identity is only supported in specific Azure Data Explorer flows and requires setting up the managed identity policy. For more information, see [Managed identities overview](../../../managed-identities-overview.md).

### Shared Access (SAS) token

In the Azure portal, [generate a SAS token](generate-sas-token.md) with the required permissions.

For example, to read from the external storage specify the Read and List permissions and to export to the external storage specify the Write permissions. To learn more, see [delegate access by using a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature).

Use the SAS URL as the connection string.

|Example|
|--|
|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"`|

<a name='azure-ad-access-token'></a>

### Microsoft Entra access token

To add a base-64 encoded Microsoft Entra access token, append `;token={AadToken}` to the connection string. The token must be for the resource `https://storage.azure.com/`.

For more information on how to generate a Microsoft Entra access token, see [get an access token for authorization](/azure/storage/common/identity-library-acquire-token).

|Example|
|--|
|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token=1234567890abcdef1234567890abcdef1234567890abc..."`|

### Storage account access key

To add a storage account access key, append the key to the connection string. In Azure Blob Storage, append `;{key}` to the connection string. For Azure Data Lake Storage Gen 2, append `;sharedkey={key}` to the connection string.

|Storage account|Example|
|--|--|--|
|Azure Blob Storage|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;ljkAkl...=="`|
|Azure Data Lake Storage Gen2|`"abfss://fs@fabrikam.dfs.core.windows.net/path/to/file.csv;sharedkey=sv=...&sp=rwd"`|

### Amazon Web Services programmatic access keys

To add Amazon Web Services access keys, append `;AwsCredentials={ACCESS_KEY_ID},{SECRET_ACCESS_KEY}` to the connection string.

|Example|
|--|
|`"https://yourbucketname.s3.us-east-1.amazonaws.com/path/to/file.csv;AwsCredentials=AWS1234567890EXAMPLE,1234567890abc/1234567/12345678EXAMPLEKEY"`|
