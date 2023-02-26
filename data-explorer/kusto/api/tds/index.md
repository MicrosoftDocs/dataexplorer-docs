---
title: MS-TDS T-SQL support - Azure Data Explorer
description: This article introduces MS-TDS T-SQL support in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/06/2019
---
# MS-TDS T-SQL support

Azure Data Explorer supports a subset of the Microsoft SQL Server communication protocol (MS-TDS),
with a subset of the T-SQL query language. Microsoft Excel and Microsoft Power BI are only some of the many tools that can work with Azure Data Explorer. These Microsoft applications also know how to query SQL Server.

> [!NOTE]
> Use Azure Active Directory (Azure AD) integrated authentication as the client tool to query Kusto through MS-TDS.

## Next steps

* [T-SQL](./t-sql.md) - Learn about the T-SQL query language as implemented by Kusto. 

* [KQL over TDS](./tdskql.md) - Learn about executing native KQL queries via TDS endpoints.

* [MS-TDS clients and Kusto](./clients.md) - Use Azure Data Explorer from well-known clients that use MS-TDS/T-SQL.

* [Azure Data Explorer as linked server to SQL server](./linkedserver.md) - Configure the cluster as a linked server to the SQL server on-premises. 

* [MS-TDS with Azure Active Directory](./aad.md) - Use Azure AD via TDS, for connecting to Azure Data Explorer.
