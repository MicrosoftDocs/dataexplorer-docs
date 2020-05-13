---
title: MS-TDS T-SQL support - Azure Data Explorer
description: This article has links to information that describes MS-TDS T-SQL support in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/06/2019
---
# MS-TDS T-SQL support

Azure Data Explorer (Kusto) supports a subset of the Microsoft SQL Server communication protocol (MS-TDS),
with a subset of the T-SQL query language. Microsoft Excel and Microsoft Power BI are only some of the many tools that can work with Azure Data Explorer. These Microsoft applications also know how to query SQL Server.

> [!NOTE]
> The client must use Azure Active Directory (Azure AD) integrated authentication as the client tool to query Azure Data Explorer through MS-TDS.

## Links to pages discussing SQL, KQL, TDS, and Azure Data Explorer (Kusto)

The following links present more information about support for SQL, KQL, TDS, and Azure Data Explorer (Kusto)

* [T-SQL](./t-sql.md) - For information on the T-SQL query language as implemented by Azure Data Explorer. 

* [KQL over TDS](./tdskql.md) - Learn about executing native KQL queries via TDS endpoints.

* [MS-TDS clients and Kusto](./clients.md) - Use Azure Data Explorer from well-known clients that use MS-TDS/T-SQL.

* [Azure Data Explorer (Kusto) as linked server to SQL server](./linkedserver.md) - Configure the cluster as a linked server to the SQL server on-premises. 

* [MS-TDS with Azure Active Directory](./aad.md) - Use Azure AD via TDS, for connecting to Azure Data Explorer.

* [SQL Known Issues](./sqlknownissues.md) - For some of the main differences between SQL Server's implementation of T-SQL and Azure Data Explorer.
