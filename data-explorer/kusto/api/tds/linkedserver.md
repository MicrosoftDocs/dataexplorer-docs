---
title: Kusto as linked server from SQL server - Azure Data Explorer
description: This article describes Kusto as a linked server from the SQL server in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# Kusto as a linked server from the SQL server

SQL server on-premises lets you attach a linked server and lets you create queries joining data from the SQL server and from linked servers.

You can use Kusto as a linked server via ODBC connectivity.
The SQL Server on-premises service needs to use an active directory account (not the default Service account) that lets it connect to Azure Data Explorer using Azure Active Directory (Azure AD).

1. Install the latest ODBC Driver for SQL Server 2017 (it also comes with SSMS 18): https://aka.ms/downloadmsodbcsql
1. Prepare the DSN-less connection string for the ODBC driver, for a specific Azure Data Explorer cluster and database: `Driver={ODBC Driver 17 for SQL Server};Server=<cluster>.kusto.windows.net;Database=<database>;Authentication=ActiveDirectoryIntegrated;Language=any@MaxStringSize:4000`. The language option is added to tune Azure Data Explorer to encode strings as NVARCHAR(4000). For more information about this workaround, see [ODBC](./clients.md#odbc).
1. Create the Linked Server with the settings pointed to by the red arrows.

:::image type="content" source="../images/linkedserverconnection.png" alt-text="linked server connection":::

1. Define the Security with the setting pointed to by the red arrow. 

:::image type="content" source="../images/linkedserverlogin.png" alt-text="linked server login":::

To query data from Kusto:

```sql
SELECT * FROM OpenQuery(LINKEDSERVER, 'SELECT * FROM <KustoStoredFunction>[(<Parameters>)]')
```

> [!NOTE]
> 1. Use Kusto [stored functions](../../query/schema-entities/stored-functions.md) for extracting data from Azure Data Explorer. Stored function can include all the logic necessary for efficient queries from Kusto, authored in native [KQL](../../query/index.md) language, and controlled by specified parameter values. T-SQL syntax for calling the Kusto stored function is identical to calling the SQL tabular function.
> 1. The SQL server doesn't support calling remote tabular functions from linked servers inside its own queries. The workaround for this limitation is to use `OpenQuery` for executing remote queries on the linked server. This way, the tabular function is called not on the SQL server directory, but in a query that is executed on the linked server. The outer T-SQL query can be used to join between data on the SQL server and data returned from the Kusto stored function via `OpenQuery`.
