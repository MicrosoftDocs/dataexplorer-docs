---
title:  Connection strings overview
description: This article describes connection strings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/26/2023
---
# Connection Strings overview

Connection strings are widely used in [management commands](../../management/index.md), in the [Kusto API](../index.md), and occasionally in [Kusto Query Language (KQL) queries](../../query/index.md).

## What are connection strings?

Connection strings provide a means to describe how to locate and interact with Kusto service endpoints as well as resources external to Kusto, such as blobs in the Azure Blob Storage service and Azure SQL Database databases.

## Connection string formats

The following table describes the types of connection string formats in Kusto.

|Format|Description|
|--|--|
[Kusto connection strings](kusto.md)|Describe how to communicate with a Kusto service endpoint. Kusto connection strings are modeled after [ADO.NET connection strings model](/dotnet/framework/data/adonet/connection-string-syntax).|
|[Storage connection strings](storage-connection-strings.md)|Describe how to point Kusto at an external storage service such as Azure Blob Storage and Azure Data Lake Storage.|
|[SQL connection strings](sql-authentication-methods.md)|Describe how to point Kusto at an external SQL Server database for query or to [export data to SQL](../../management/data-export/export-data-to-sql.md). These connection strings adhere to the [SqlClient connection strings](/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings) specification.|

> [!NOTE]
> Some connection strings may reference security principals. See
> [principals and identity providers](../../management/access-control/referencing-security-principals.md)
> for how to specify security principals in connection strings.

## Authentication with connection strings

To interact with nonpublic external storage or external SQL Server databases, you need to specify authentication means as part of the connection string. For more information, see [Storage authentication methods](storage-authentication-methods.md) and [SQL Server authentication methods](sql-authentication-methods.md).
