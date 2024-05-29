---
title: Azure Data Explorer as linked server from SQL server - Azure Data Explorer
description: This article describes Azure Data Explorer as a linked server from the SQL server.
ms.topic: reference
ms.date: 02/13/2023
---
# Azure Data Explorer as a linked server from SQL Server

SQL Server allows you to create linked servers to connect to other data sources. With a linked server, you can run queries that combine data from your SQL Server with data from the linked server. This way, you can access and work with data from multiple sources in a single location. This article shows how to create a linked server from SQL Server to Azure Data Explorer.

> [!NOTE]
> In order to authenticate to Azure Data Explorer, the SQL Server must use a Microsoft Entra account.

## Establish the connection

The following steps describe how to set up the linked server connection.

1. [Install the latest ODBC driver]( https://aka.ms/downloadmsodbcsql).
1. [Create an ODBC driver](connect-odbc.md) to connect to Azure Data Explorer.
1. Prepare the connection string for the ODBC driver. See the following example. Replace `<cluster_uri>` and `<database>` with the relevant values.

    ```txt
    `Driver={ODBC Driver 17 for SQL Server};Server=<cluster_uri>;Database=<database>;Authentication=ActiveDirectoryIntegrated;Language=any@MaxStringSize:4000`. 
    ```

    > [!NOTE]
    > The language parameter tells Azure Data Explorer to encode strings as `NVARCHAR(4000)`. For more information about this workaround, see [ODBC](connect-odbc.md).

1. Open the New Linked Server dialog.
1. In the **General** settings, select **Microsoft OLE DB Provider for ODBC Drivers** for the **Provider** and input the connection string from the previous step in the **Provider string** box.
1. In the **Security** settings, select **Be made using the login's current security context**.
1. Select **OK** to save the linked server.

## Query data

Query data from Azure Data Explorer using the following syntax.

```sql
SELECT * FROM OpenQuery(LINKEDSERVER, 'SELECT * from MyFunction(10)')
```

Use Kusto [stored functions](kusto/query/schema-entities/stored-functions.md) for extracting data from Azure Data Explorer. Learn more at [KQL over TDS](/azure/data-explorer/sql-kql-queries-and-stored-functions).

SQL Server has a limitation where it can't use remote tabular functions from linked servers directly in its own queries. To overcome this limitation, use the `OpenQuery` function to run a query on the linked server. You can then use the outer T-SQL query to combine the data from the SQL server with the data returned from the Azure Data Explorer stored function.

## Related content

* [Create linked servers](/sql/relational-databases/linked-servers/create-linked-servers-sql-server-database-engine)
* [Connect with ODBC](connect-odbc.md)
