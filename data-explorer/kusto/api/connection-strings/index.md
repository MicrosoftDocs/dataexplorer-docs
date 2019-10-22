---
title: Connection Strings - Azure Data Explorer | Microsoft Docs
description: This article describes Connection Strings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/25/2018
---
# Connection Strings

Connection strings are widely used in Kusto control commands, in the Kusto API, and occasionally in queries as well.
Connection strings provide a general means to describe how to locate and interact with resources external to Kusto,
such as blobs in the Azure Blob Storage service and Azure SQL Database databases.

There are a number of connection string formats:

* [Kusto connection strings](./kusto.md) describe how to communicate with a Kusto service endpoint.
  Kusto connection strings are modeled after [ADO.NET connection strings model](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/connection-string-syntax).
* [Storage connection strings](./storage.md) describe how to point Kusto at an external storage service
  such as Azure Blob Storage and Azure Data Lake Storage.
* SQL connection strings - used by Kusto [sql_request plugin](../../query/sqlrequestplugin.md) to issue requests to
  Azure DB service and by [export to SQL command](../../management/data-export/export-data-to-sql.md).  
  These connection strings adhere to [SqlClient connection strings](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings) specification.