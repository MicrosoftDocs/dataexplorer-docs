---
title: Storage authentication methods - Azure Data Explorer
description: This article describes storage authentication methods used in connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 02/23/2023
---
# Storage authentication methods

Azure Data Explorer can interact with external storage in various ways, such as reading and exporting data. To authenticate to external storage, you must specify the storage connection string. The connection string defines the resource to access and its authentication information.

This article covers the following authentication methods:

* [Impersonation](#impersonation)
* [Managed identity](#managed-identity)
* [Shared Access (SAS) key](#shared-access-sas-token)
* [Azure AD access token](#azure-ad-access-token)
* [Storage account access key](#storage-account-access-key)
* [AWS Programmatic Access Keys](#aws-programmatic-access-keys)

> [!NOTE]
> When using impersonation, SAS keys, and managed identities the principal or managed identity performing the operation must have the appropriate role-based access control (RBAC) role assignments. To learn more, see:
>
> * [Azure Blob Storage access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac)
> * [Azure Data Lake Storage access control](/azure/storage/blobs/data-lake-storage-access-control)

## Privacy and security

It's recommended to add an `h` to connection strings that contain secrets. This practice ensures that the private information in the connection string is [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals).

The following table explains how to hide your private information using the `h` string.

|Purpose|Method|Syntax|
|--|--|--|
|Hide the entire connection string|Preface the connection string with `h`.|`h"<connection_string>"`|
|Hide only the secret part of the string|Split the connection string into location and secret and add the `h` before the secret part.| `"<connection_string>"h"<secret>"`|

## Authentication methods by storage type

There are different authentication methods available for different external storage types. The following table summarizes the available methods.

| Authentication method | Available in Blob storage? | Available in Azure Data Lake Storage Gen 2? | Available in Azure Data Lake Storage Gen 1? | Available in Amazon S3? | When should you use this method? |
|---|---|---|---|---|---|
| [Impersonation](#impersonation) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use for attended flows when you need complex access control over the external storage. For example, in continuous export flows. You can also restrict storage access at the user level. |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Use in unattended flows, where no Azure Active Directory (Azure AD) principal can be derived to execute queries and commands. Managed identities are the only authentication solution. |
| [Shared Access (SAS) key](#shared-access-sas-token) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | SAS tokens have an expiration time. Use when accessing storage for a limited time. |
| [Azure AD access token](#azure-ad-access-token) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | Azure AD tokens have an expiration time. Use when accessing storage for a limited time. |
| [Storage account access key](#storage-account-access-key) | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | When you need to access resources on an ongoing basis. |
| [AWS Programmatic Access Keys](#aws-programmatic-access-keys) | :x: | :x: | :x: | :heavy_check_mark: | When you need to access Amazon S3 resources on an ongoing basis. |

## Impersonation

To use impersonation, append `;impersonate` to the connection string. Azure Data Explorer uses the requestor's principal identity and impersonate this identity to access the resource.

The principal must have the appropriate role-based access control (RBAC) role assignments on the storage to perform the requested action.

### Impersonation example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`.

## Managed identity

To add a managed identity, append `;managed_identity=...` to the connection string. Azure Data Explorer uses the managed identity, either system or user-assigned, to make requests and access resources.

The managed identity must have the appropriate role-based access control (RBAC) role assignments on the storage to perform the requested action.

The following table describes the syntax for the two managed identity authorization methods.

|Managed identity type|Syntax|Example|
|--|--|--|
|System-assigned|`;managed_identity=system`|[See example](#system-assigned-managed-identity)|
|User-assigned|`;managed_identity={object_id}`|[See example](#user-assigned-managed-identity)|

### Managed identity examples

#### System-assigned managed identity

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`

#### User-assigned managed identity

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"`

## Shared Access (SAS) token

In the Azure portal, [generate a SAS token](generate-sas-token.md) and use the SAS URL as the connection string.

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
