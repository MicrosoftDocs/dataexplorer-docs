---
title:  Connection Strings
description: This article describes Connection Strings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/15/2023
---
# Connection Strings

Connection strings are widely used in Kusto control commands, in the Kusto API, and occasionally in queries as well.
Connection strings provide a general means to describe how to locate and interact with resources external to Kusto,
such as blobs in the Azure Blob Storage service and Azure SQL Database databases.

There are a number of connection string formats:

* [Kusto connection strings](kusto.md) describe how to communicate with a Kusto service endpoint.
  Kusto connection strings are modeled after [ADO.NET connection strings model](/dotnet/framework/data/adonet/connection-string-syntax).
* [Storage connection strings](storage-connection-strings.md) describe how to point Kusto at an external storage service
  such as Azure Blob Storage and Azure Data Lake Storage.
* [SQL connection strings](sql-authentication-methods.md) describe how to point Kusto at an external SQL Server database for query or
  to [export data to SQL](../../management/data-export/export-data-to-sql.md). These connection strings adhere to the
  [SqlClient connection strings](/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings) specification.

> [!NOTE]
> Some connection strings may reference security principals. See
> [principals and identity providers](../../management/access-control/referencing-security-principals.md)
> for how to specify security principals in connection strings.
