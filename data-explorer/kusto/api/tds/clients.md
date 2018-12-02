---
title: MS-TDS clients and Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes MS-TDS clients and Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# MS-TDS clients and Kusto

## .NET SQL client

Kusto supports Azure Active Directory authentication for SQL clients.

For example, AAD connection string may look like:
```csharp
    var csb = new SqlConnectionStringBuilder()
    {
        InitialCatalog = "mydatabase",
        Authentication = SqlAuthenticationMethod.ActiveDirectoryIntegrated,
        DataSource = "mykusto.kusto.windows.net"
    };
```


Kusto supports authentication with already obtained access token:
```csharp
    var csb = new SqlConnectionStringBuilder()
    {
        InitialCatalog = "mydatabase",
        DataSource = "mykusto.kusto.windows.net"
    };
    using (var connection = new SqlConnection(csb.ToString()))
    {
        connection.AccessToken = accessToken;
        await connection.OpenAsync();
    }
```
## ODBC

Applications that support ODBC can connect to Kusto.

Create ODBC data source:
1. Launch ODBC Data Source Administrator.
2. Create new data source (button `Add`).
3. Select `ODBC Driver 17 for SQL Server`.
3. Give a name to the data source and specify Kusto cluster name in  `Server` field, e.g. `mykusto.kusto.windows.net`
4. Select `Active Directory Integrated` authentication option.
5. Next tab lets to select database.
7. Can leave defaults for all other settings in the following tabs.
8. `Finish` button opens data source summary dialog where the connection can be tested.
9. ODBC source can now be used with applications.


## JDBC

Microsoft JDBC driver can be used to connect to Kusto with AAD application authentication. For details see [JDBC with AAD](./aad.md#jdbc).



## LINQPad

It is possible to use Linq applications with Kusto by connecting to Kusto like it is SQL server.
LINQPad can be used to explore Linq compatibility. It can also be used to browse Kusto and to execute SQL queries.
LINQPad is the recommended tool to explore Kusto TDS (SQL) endpoint.

Connect like you connect to Microsoft SQL Server. Notice, LINQPad supports Active Directory authentication.

1. Click "Add connection".
2. Choose "Build data context automatically".
3. Choose LINQPad driver "Default (LINQ to SQL)".
4. As a provider choose "SQL Azure".
5. For server specify the name of Kusto cluster, e.g. `mykusto.kusto.windows.net`
6. For login can choose "Windows Authentication (Active Directory)".
7. Click on "Test" button to verify connectivity.
8. Click on "OK" button. The browser window displays tree view with databases.
9. You can browse through databases, tables and columns.
10. In the query window, you can run SQL queries. Specify SQL language and pick connection to the database.
11. In the query window can also run LINQ queries. E.g., right click on a table in the browser window. Pick "Count" option. Let it run.

## Azure Data Studio (1.3.4 and above)

1. New connection.
2. Select connection type: `Microsoft SQL Server`.
3. Specify name of Kusto cluster as a server name, e.g. `mykusto.kusto.windows.net`
4. Select authentication type: `Azure Active Directory - Universal with MFA support`.
5. Specify account provisioned in AAD, e.g. `myname@contoso.com` (Add account upon the first time).
6. Database picker can be used to select database.
7. `Connect` button would bring you to database dashboard.
8. Right click on connection and select `New Query` to open query tab or click on `New Query` task on the dashboard.


## Power BI Desktop

Connect like you connect to SQL Azure Database.

1. In `Get Data` choose `More`, then `Azure` and then `Azure SQL Database`
2. Specify Kusto server name e.g. `mykusto.kusto.windows.net`
3. Use "DirectQuery" option.
4. Choose `Microsoft account` authentication (not `Windows`) and click `sign in`.
5. The picker shows available databases. Continue just like you would do with real SQL server.

## Excel

Connect like you connect to SQL Azure Database.

1. In `Data` tab, `Get Data`, `From Azure`, `From Azure SQL Database`
2. Specify Kusto server name e.g. `mykusto.kusto.windows.net`
3. Choose `Microsoft account` authentication (not `Windows`) and click `sign in`.
4. Once signed in, click `Connect`.
5. The picker shows available databases. Continue just like you would do with real SQL server.

## Tableau

1. Create ODBC data source, see [ODBC](./clients.md#odbc) section.
2. Connect via `Other Databases (ODBC)`.
3. Select ODBC data source in `DSN`.
4. Use `Connect` button to establish connection.
5. Once `Sign In` button available, login into Kusto.

## Microsoft SQL Server Management Studio (v18.x)

1. In "Object Explorer", "Connect", "Database Engine".
2. Specify name of Kusto cluster as a server name, e.g. `mykusto.kusto.windows.net`
3. Use "Active Directory - Integrated" option for authentication.
4. Click "Options".
5. In "Connect to database" combo, you can browse available databases via "Browse Server" option.
6. Click "Yes" to proceed with browsing.
7. The dialog displays tree view with all available databases. Can click on one to proceed with connection to the database.
8. Alternatively, in "Connect to database" combo, can choose "default". Click "Connect". Object Explorer would show all databases.
9. Browsing database objects via SSMS is not supported yet.
10. Click on your database. Click "New Query" option to open query window.
11. Can execute custom SQL queries from the query window.



## Sending T-SQL queries over the REST API

The [Kusto REST API](../rest/index.md) can accept and execute T-SQL queries.
To do this, send the request to the query endpoint with the `csl` property
set to the text of the T-SQL query itself, and the
[request property](../netfx/request-properties.md) `OptionQueryLanguage`
set to the value `sql`.