---
title: MS-TDS (T-SQL support) - Azure Data Explorer
description: This article describes MS-TDS (T-SQL support) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/06/2019
---
# MS-TDS (T-SQL support)

Azure Data Explorer supports a subset of the Microsoft SQL Server communication protocol (MS-TDS),
with a subset of the T-SQL query language. Existing tools that know how to query SQL Server and 
can work with Azure Data Explorer include Microsoft Excel, Microsoft Power BI, and many others.

> [!NOTE]
> For a client tool to query Azure Data Explorer through MS-TDS, the client must use 
Azure Active Directory (Azure AD) integrated authentication.

For information on the T-SQL query language as implemented by Azure Data Explorer, see [T-SQL](./t-sql.md). 

For examples of how to use Azure Data Explorer from well-known clients using MS-TDS/T-SQL, see [MS-TDS clients and Kusto](./clients.md).

For information on configuring Kusto cluster as a linked server to the SQL server on-premises, see [Kusto as linked server to SQL server](./linkedserver.md) .

For information on using Azure AD via TDS for connecting to Azure Data Explorer, see [MS-TDS with Azure Active Directory](./aad.md).

For information on executing native KQL queries via TDS endpoints, see [KQL over TDS](./tdskql.md).

Finally, for some of the main differences between SQL Server's implementation of T-SQL and Azure Data Explorer, see [SQL Known Issues](./sqlknownissues.md) .
