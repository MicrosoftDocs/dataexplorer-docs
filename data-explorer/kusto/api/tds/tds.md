---
title: MS SQL (TDS) - Azure Kusto | Microsoft Docs
description: This article describes MS SQL (TDS) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# MS SQL (TDS)

Kusto supports the Microsoft SQL Server communication protocol (MS-TDS)
and includes a limited support for running T-SQL queries. This allows users
to run queries on Kusto using a well-known query syntax (T-SQL) and their
familiar database client tools (e.g. LINQPad, sqlcmd, Tableau, Excel, Power BI, ...)

## Known issues

Kusto SQL emulation aims to reflect Kusto as SQL server. However, there are certain limitations that are result of Kusto being different in many aspects.

Please see [this page](sqlknownissues.md) for details.

## .NET SQL client

Kusto supports basic authentication and Azure Active Directory authentication for SQL clients.

For example, AAD connection string may look like:
```csharp
    var csb = new SqlConnectionStringBuilder()
    {
        InitialCatalog = "mydatabase",
        Authentication = SqlAuthenticationMethod.ActiveDirectoryIntegrated,
        DataSource = "mykusto.kusto.windows.net"
    };
```

For basic authentication specify "UserID" and "Password":
```csharp
    var csb = new SqlConnectionStringBuilder()
    {
        InitialCatalog = "mydatabase",
        UserID = "mybasicuser",
        Password = "mypassword",
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


## sqlcmd

Connect like you connect to Microsoft SQL Server.

For example:

`sqlcmd -S mykusto.kusto.windows.net -U mybasicuser -P mypassword -d mydatabase`

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

## Power BI Desktop

Connect like you connect to SQL Azure Database.

1. In `Get Data` choose `More`, then `Azure` and then `Azure SQL Database`
2. Specify Kusto server name e.g. `mykusto.kusto.windows.net`
3. Use "DirectQuery" option.
4. Choose `Microsoft account` authentication (not `Windows`) and click `sign in`. Alternatively, can use `Database` authentication with basic-auth user.
5. The picker shows available databases. Continue just like you would do with real SQL server.

## Excel

Connect like you connect to SQL Azure Database.

1. In `Data` tab, `Get Data`, `From Azure`, `From Azure SQL Database`
2. Specify Kusto server name e.g. `mykusto.kusto.windows.net`
3. Choose `Microsoft account` authentication (not `Windows`) and click `sign in`. Alternatively, can use `Database` authentication with basic-auth user.
4. Once signed in, click `Connect`.
5. The picker shows available databases. Continue just like you would do with real SQL server.

## Tableau

Connect like you connect to Microsoft SQL Server.

1. Connect to a server via "Microsoft SQL Server" option. As a server specify Kusto server name, e.g. `mykusto.kusto.windows.net`
2. For authentication, choose "Use a specific user name and password" option and specify name and password of basic Kusto user.
3. Check "Require SSL" option.
4. Click on "Sign In" button.
5. In database picker, choose the desired database.
6. The tables can be previewed and dragged.

## Microsoft SQL Server Management Studio (v17.x)

1. In "Object Explorer", "Connect", "Database Engine".
2. Specify name of Kusto cluster as a server name, e.g. `mykusto.kusto.windows.net`
3. Use "Active Directory - Integrated" option for authentication.
4. Click "Options".
5. In "Connect to database" combo, you can browse avaialble databases via "Browse Server" option.
6. Click "Yes" to proceed with browsing.
7. The dialog displays tree view with all avialable databases. Can click on one to proceed with connection to the database.
8. Alternatively, in "Connect to database" combo, can choose "default". Click "Connect". Object Explorer would show all databases.
9. Browsing database objects via SSMS is not supported yet.
10. Click on your database. Click "New Query" option to open query window.
11. Can execute custom SQL queries from the query window.

## Tedious

Connect like you connect to Microsoft SQL Server. Notice that connection to Kusto should be encrypted.

```javascript
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'myuser',
    password: 'mypassword',
    server: 'mykusto.kusto.windows.net',
    options: {
        encrypt: true,
        database: 'mydatabase'
    }
}

var connection = new Connection(config);

function read(callback) {
    console.log('Reading rows from the Table...');
    request = new Request('select * from mytable', function(err, rowCount, rows) {
        if (err) {
            callback(err);
        } else {
            console.log(rowCount + ' row(s) returned');
            callback(null);
        }
    });
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });
    connection.execSql(request);
}

connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    } 
    else {
        console.log('Connected');
        read(function(err) {
	        if (err) {
	            console.log(err);
	        }
	        else {
	            console.log('Read completed');
	        }
        });
    }
});
```