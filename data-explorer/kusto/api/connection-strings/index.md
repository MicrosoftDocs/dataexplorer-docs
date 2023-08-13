---
title:  Connection strings overview
description: This article describes connection strings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/13/2023
---
# Connection strings overview

Connection strings are widely used in [management commands](../../management/index.md), in the [Kusto API](../index.md), and in [Kusto Query Language (KQL)](../../query/index.md) queries.

Connection strings describe how to locate and interact with Kusto service endpoints as well as resources external to Kusto, such as blobs in the Azure Blob Storage service and Azure SQL Database databases.

## Types of connection strings

The following table describes the types of connection string formats in Kusto.

|Format|Description|
|--|--|
[Kusto connection strings](kusto.md)|Describe how to communicate with a Kusto service endpoint. Kusto connection strings are modeled after [ADO.NET connection strings](/dotnet/framework/data/adonet/connection-string-syntax).|
|[Storage connection strings](storage-connection-strings.md)|Describe how to point Kusto at an external storage service such as Azure Blob Storage and Azure Data Lake Storage.|
|[SQL connection strings](sql-authentication-methods.md)|Describe how to point Kusto at an external SQL Server database for query or to [export data to SQL](../../management/data-export/export-data-to-sql.md). These connection strings adhere to the [SqlClient connection strings](/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings) specification.|

> [!NOTE]
> To learn how to specify security principals in connection strings, see [Referencing security principals](../../management/referencing-security-principals.md).

## Authentication with connection strings

To interact with nonpublic external storage or external SQL Server databases, you need to specify authentication details as part of the connection string. For more information, see [Storage authentication methods](storage-authentication-methods.md) and [SQL Server authentication methods](sql-authentication-methods.md).

## Privacy and security

We recommend adding an 'h' prefix to any connection string that contains secrets. This practice ensures that the private information in the connection string is [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals).

The following table explains how to hide your private information using the 'h' string.

|Goal|Method|Syntax|
|--|--|--|
|Hide the entire connection string|Preface the connection string with 'h'.|`h"<connection_string>"`|
|Hide only the secret part of the string|Split the connection string into the resource location and the secret information and add the 'h' between the two.| `"<resource_location>"h"<secret>"`|
