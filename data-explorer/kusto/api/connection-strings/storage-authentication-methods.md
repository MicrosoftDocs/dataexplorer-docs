---
title: Storage authentication methods - Azure Data Explorer
description: This article describes storage authentication methods used in connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 02/23/2023
---
# Storage authentication methods

To interact with external storage from Azure Data Explorer, you must specify the storage connection string. The connection string defines the resource to access and its authentication information.

This article describes the following authentication methods:

* [Impersonation](#impersonation)
* [Managed identity](#managed-identity)
* [Shared Access (SAS) key](#shared-access-sas-token)
* [Azure AD access token](#azure-ad-access-token)
* [Storage account access key](#storage-account-access-key)
* [AWS Programmatic Access Keys](#aws-programmatic-access-keys)

## Privacy and security

It's recommended to add an `h` to connection strings that contain secrets. This practice ensures that the private information in the connection string is [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals).

The following table explains how to hide your private information using the `h` string.

|Purpose|Method|Syntax|
|--|--|--|
|Hide the entire connection string|Preface the connection string with `h`.|`h"<connection_string>"`|
|Hide only the secret part of the string|Split the connection string into the resource location and the secret information and add the `h` between the two.| `"<resource_location>"h"<secret>"`|

## Authentication methods availability

The following table summarizes the available authentication methods for different external storage types.

| Authentication method | Blob storage | Azure Data Lake Storage Gen 2 | Azure Data Lake Storage Gen 1 | Amazon S3 | When should you use this method? |
|---|---|---|---|---|---|
| [Impersonation](#impersonation) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use for attended flows when you need complex access control over the external storage. For example, in continuous export flows. You can also restrict storage access at the user level. |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use in unattended flows, where no Azure Active Directory (Azure AD) principal can be derived to execute queries and commands. Managed identities are the only authentication solution. |
| [Shared Access (SAS) key](#shared-access-sas-token) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | SAS tokens have an expiration time. Use when accessing storage for a limited time. |
| [Azure AD access token](#azure-ad-access-token) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Azure AD tokens have an expiration time. Use when accessing storage for a limited time. |
| [Storage account access key](#storage-account-access-key) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | When you need to access resources on an ongoing basis. |
| [AWS Programmatic Access Keys](#aws-programmatic-access-keys) | :x: | :x: | :x: | :heavy_check_mark: | When you need to access Amazon S3 resources on an ongoing basis. |

## Impersonation

To use impersonation, append `;impersonate` to the connection string. Azure Data Explorer impersonates the requestor's principal identity to access the resource.

The principal must have the appropriate role-based access control (RBAC) role assignments on the storage to perform the requested action.

[!INCLUDE [external-storage-authorization-note](../../../includes/external-storage-authorization-note.md)]

### Impersonation example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`.

## Managed identity

To add a managed identity, append `;managed_identity=...` to the connection string. Azure Data Explorer uses the managed identity, either system or user-assigned, to make requests and access resources.

The managed identity must have the appropriate role-based access control (RBAC) role assignments on the storage to perform the requested action.

The following table describes the syntax for the two managed identity authorization methods.

|Managed identity type|Syntax|Example|
|--|--|--|
|System-assigned|`;managed_identity=system`|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`|
|User-assigned|`;managed_identity={object_id}`|`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"`|

[!INCLUDE [external-storage-authorization-note](../../../includes/external-storage-authorization-note.md)]

## Shared Access (SAS) token

In the Azure portal, [generate a SAS token](generate-sas-token.md) and use the SAS URL as the connection string.

[!INCLUDE [external-storage-authorization-note](../../../includes/external-storage-authorization-note.md)]

### SAS example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"`.

## Azure AD access token

To add a base-64 encoded Azure AD OAuth 2.0 access token, append `;token={AadToken}` to the connection string. The token must be for the resource `https://storage.azure.com/`.

For more information on how to generate an Azure AD access token, see [get an access token for authorization](/azure/storage/common/identity-library-acquire-token).

### Azure AD access token example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im..."`.

## Storage account access key

To add a storage account access key, append the key to the connection string.

The following table describes the syntax for the two supported storage accounts.

|Storage account|Syntax|Example|
|--|--|--|
|Azure Blob Storage|`;{key}`|[See example](#azure-blob-storage)|
|Azure Data Lake Storage Gen2|`;sharedkey={key}`|[See example](#azure-data-lake-storage-gen2)|

### Storage account access key examples

#### Azure Blob Storage

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;ljkAkl...=="`

#### Azure Data Lake Storage Gen2

`"abfss://fs@fabrikam.dfs.core.windows.net/path/to/file.csv;sharedkey=sv=...&sp=rwd"`

## AWS Programmatic Access Keys

To add Amazon Web Services access keys, append `;AwsCredentials={ACCESS_KEY_ID},{SECRET_ACCESS_KEY}` to the connection string.

### AWS Programmatic Access Keys example

`"https://yourbucketname.s3.us-east-1.amazonaws.com/path/to/file.csv;AwsCredentials=AKIAIOSFODNN7EXAMPLE,wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"`.
