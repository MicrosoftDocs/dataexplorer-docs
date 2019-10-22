---
title: Kusto as linked server from SQL server - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto as linked server from SQL server in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/06/2019

---
# Kusto as linked server from SQL server

SQL server on-premises allows to attach linked server. This feature allows to create queries joining data from SQL server and from linked servers.

It is possible to use Kusto as linked server via ODBC connectivity.

1. The SQL Server (on-premises) service need to use a active directory account (not the default Service account) that permit to connect to Kusto using AAD.
2. Install the latest ODBC Driver for SQL Server 2017 (it also comes with SSMS 18): https://www.microsoft.com/en-us/download/details.aspx?id=56567
3. Prepare the DSN less connection string for the ODBC driver for a specific Kusto cluster and database: `Driver={ODBC Driver 17 for SQL Server};Server=<cluster>.kusto.windows.net;Database=<database>;Authentication=ActiveDirectoryIntegrated;Language=any@MaxStringSize:4000`. The language option is added to tune Kusto to encode strings as NVARCHAR(4000). See more details about this workaround at [ODBC](./clients.md#odbc).
4. Create the Linked Server with the following 3 settings defined: ![alt text](../images/linkedserverconnection.png "linked server connection")
5. The Security tab need to be defined with this setting: ![alt text](../images/linkedserverlogin.png "linked server login")

Now, it is possible to query data from Kusto, like this:
```sql
SELECT * FROM OpenQuery(LINKEDSERVER, 'SELECT * FROM <KustoStoredFunction>[(<Parameters>)]')
```

Notes:
1. It is recommended to use Kusto [stored functions](../../query/schema-entities/stored-functions.md) for extracting data from Kusto. Stored function can include all the logic necessary for efficient query from Kusto, authored in native [KQL](../../query/index.md) language, and controlled by specified parameter values. T-SQL syntax for calling Kusto stored function is identical to calling SQL tabular function.
2. SQL server doesn't support calling remote tabular functions from linked servers inside its own queries. The workaround for this limitation is to use `OpenQuery` for executing remote query on the linked server. This way the tabular function is called not on SQL server directy, but in query that is executed on the linked server. The outer T-SQL query can be used to join between data on the SQL server and data returned from Kusto stored function via `OpenQuery`.