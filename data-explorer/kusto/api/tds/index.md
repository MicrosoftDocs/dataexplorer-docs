---
title: MS-TDS (T-SQL support) - Azure Data Explorer | Microsoft Docs
description: This article describes MS-TDS (T-SQL support) in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# MS-TDS (T-SQL support)

Kusto supports a subset of the Microsoft SQL Server communication protocol (MS-TDS),
with a subset of the T-SQL query language, so that existing tools that know how
to query SQL Server can work with Kusto. Among supported clients are Microsoft Excel,
Microsoft Power BI, and many others.

Note that for a client tool to query Kusto through MS-TDS, the client must use
Azure Active Directory integrated authentication.

See [T-SQL](./t-sql.md) for more details on the T-SQL query language as implemented
by Kusto. See [MS-TDS clients and Kusto](./clients.md) for examples of how to
use Kusto from some well-known clients using MS-TDS/T-SQL. See [KQL over TDS](./tdskql.md) for
information about executing native KQL queries via TDS endpoint. 
Finally, see [this](./sqlknownissues.md) for some of the main differences between SQL Server's
implementation of T-SQL and Kusto.