---
title: MS-TDS clients and Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes MS-TDS clients and Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/28/2019
---
# MS-TDS clients and Kusto

Kusto implements TDS complient endpoint for MS-SQL clients. Since compatibility is on the protocol level, any library or application that can be connected to SQL Azure database with Azure Active Directory authentication, would work with Kusto server, orthogonally to operating system or run-time used. Just use Kusto server domain name like it was SQL Azure server.

On SQL language level, Kusto implements subset of T-SQL and subset of SQL server emulation. See [known issues](./sqlknownissues.md) for some of the main differences between SQL Server's
implementation of T-SQL and Kusto.

## .NET SQL client

Kusto supports Azure Active Directory authentication for SQL clients.

For details see [.NET SQL Client (user authentication)](./aad.md#net-sql-client-user) and [.NET SQL Client (application authentication)](./aad.md#net-sql-client-application)



## JDBC

Microsoft JDBC driver can be used to connect to Kusto with AAD authentication.

Make application to use one of versions of *mssql-jdbc* JAR and *adal4j* JAR and all their dependecies. For example:

```s
mssql-jdbc-7.0.0.jre8.jar
adal4j-1.6.3.jar
accessors-smart-1.2.jar
activation-1.1.jar
asm-5.0.4.jar
commons-codec-1.11.jar
commons-lang3-3.5.jar
gson-2.8.0.jar
javax.mail-1.6.1.jar
jcip-annotations-1.0-1.jar
json-smart-2.3.jar
lang-tag-1.4.4.jar
nimbus-jose-jwt-6.5.jar
oauth2-oidc-sdk-5.64.4.jar
slf4j-api-1.7.21.jar
```

Make appliation to use JDBC driver class `com.microsoft.sqlserver.jdbc.SQLServerDriver`

Use connection string like:

```s
jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;database=<database_name>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword
```

If you want to use AAD integrated auth mode replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*

For more details see [JDBC (user authentication)](./aad.md#jdbc-user) and [JDBC (application authentication)](./aad.md#jdbc-application)

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

If ODBC application can accept connection string instead or in addition to DSN, use the following connection string:
```s
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

Some ODBC applications do not work well with NVARCHAR(MAX) type (see https://docs.microsoft.com/en-us/sql/relational-databases/native-client/features/using-large-value-types?view=sql-server-2017#sql-server-native-client-odbc-driver for more details). The common workaround used for such application is to cast returned data to NVARCHAR(n), with some value for n, e.g. NVARCHAR(4000). Such workaround would not work for Kusto, since Kusto has only one string type and for SQL clients it is encoded as NVARCHAR(MAX). Kusto offers different workaround for such applications. It is possible to configure Kusto to encode all strings as NVARCHAR(n) via connection string. The language feild in connection string can be used to specify tuning options in a format: `language@OptionName1:OptionValue1,OptionName2:OptionValue2`. 

For example, the following connection string will instruct Kusto to encode strings as NVARCHAR(8000):
```s
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated,Language=any@MaxStringSize:8000"
```

### PowerShell

Example of PowerShell script that uses ODBC driver:

```powershell
$conn = [System.Data.Common.DbProviderFactories]::GetFactory("System.Data.Odbc").CreateConnection()
$conn.ConnectionString = "Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
$conn.Open()
$conn.GetSchema("Tables")
$conn.Close()  

```



## LINQPad

It is possible to use Linq applications with Kusto by connecting to Kusto like it is SQL server.
LINQPad can be used to explore Linq compatibility. It can also be used to browse Kusto and to execute SQL queries.
LINQPad is the recommended tool to explore Kusto TDS (SQL) endpoint.

Connect like you connect to Microsoft SQL Server. Notice, LINQPad supports Active Directory authentication.

1. Click `Add connection`.
2. Choose `Build data context automatically`.
3. Choose LINQPad driver `Default (LINQ to SQL)`.
4. As a provider choose `SQL Azure`.
5. For server specify the name of Kusto cluster, e.g. `mykusto.kusto.windows.net`
6. For login can choose `Windows Authentication (Active Directory)`.
7. Click on `Test` button to verify connectivity.
8. Click on `OK` button. The browser window displays tree view with databases.
9. You can browse through databases, tables and columns.
10. In the query window, you can run SQL queries. Specify SQL language and pick connection to the database.
11. In the query window can also run LINQ queries. E.g., right click on a table in the browser window. Pick `Count` option. Let it run.

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

## DBeaver (5.3.3 and above)

Configure DBeaver for handling result sets in a way compatible with Kusto:

1. In `Window` menu select `Preferences`.
2. In `Editors` section select `Data Editor`.
3. Ensure `Refresh data on next page reading` option is checked.

Create connection to Kusto database:

1. Create a new database connection (`Database` menu and `New Connection` option).
2. Look for `Azure` and select `Azure SQL Database`. Press `Next`.
3. Specify host, e.g. `mykusto.kusto.windows.net` and database, e.g. `mydatabase`. Don't leave master as a database name. Kusto requires connection to a specific database.
4. For authentication option select `Active Directory - Password`.
5. Specify credentials of active directory user, e.g. `myname@contoso.com` and corresponding password for this
user.
6. Press `Test Connection …` to verify the connection details are correct.

## Microsoft SQL Server Management Studio (v18.x)

1. In `Object Explorer`, `Connect`, `Database Engine`.
2. Specify name of Kusto cluster as a server name, e.g. `mykusto.kusto.windows.net`
3. Use `Active Directory - Integrated` option for authentication.
4. Click `Options`.
5. In `Connect to database` combo, you can browse available databases via `Browse Server` option.
6. Click `Yes` to proceed with browsing.
7. The dialog displays tree view with all available databases. Can click on one to proceed with connection to the database.
8. Alternatively, in `Connect to database` combo, can choose `default`. Click `Connect`. Object Explorer would show all databases.
9. Browsing database objects via SSMS is not supported yet, since SSMS uses correlate sub-queries to browse database schema. Correlated sub-queries are not supported by Kusto, see [correlated sub-queries](./sqlknownissues.md#correlated-sub-queries).
10. Click on your database. Click `New Query` option to open query window.
11. Can execute custom SQL queries from the query window.

## MATLAB (via JDBC)

Add the required JAR-files to the front of MATLAB's static classpath. To do this, create a *"javaclasspath.txt"* file in your preferences directory. Run the following command in Matlab's command window: 

``` s
edit(fullfile(prefdir,'javaclasspath.txt'))
```

And add the full paths to the required JAR-files: 

``` s
<before>
c:\full\path\to\accessors-smart-1.2.jar
c:\full\path\to\activation-1.1.jar
c:\full\path\to\adal4j-1.6.3.jar
c:\full\path\to\asm-5.0.4.jar
c:\full\path\to\commons-codec-1.11.jar
c:\full\path\to\commons-lang3-3.5.jar
c:\full\path\to\gson-2.8.0.jar
c:\full\path\to\javax.mail-1.6.1.jar
c:\full\path\to\jcip-annotations-1.0-1.jar
c:\full\path\to\json-smart-2.3.jar
c:\full\path\to\lang-tag-1.4.4.jar
c:\full\path\to\mssql-jdbc-7.0.0.jre8.jar
c:\full\path\to\nimbus-jose-jwt-6.5.jar
c:\full\path\to\oauth2-oidc-sdk-5.64.4.jar
c:\full\path\to\slf4j-api-1.7.21.jar
```

> You really need the <*before*> at the top to add this files to the front of the classpath. Further replace "c:\full\path\to" with the actual full paths to these files. 

Restart MATLAB to make sure these classes are in fact loaded.

Before trying to connect run the following command (MATLAB command window):

``` java
java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
```

> This resets the *TransformerFactory* to the default (MATLAB usually overloads this with Saxon, but this is incompatible with ADAL4J).

To connect to the Kusto TDS endpoint submit the following command (MATLAB command window):

```s
conn = database('<<KUSTO_DATABASE>>','<<AAD_USER>>','<<USER_PWD>>','com.microsoft.sqlserver.jdbc.SQLServerDriver',['jdbc:sqlserver://<<MYCLUSTER>>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword;database='])
 ```

> It is correct here that this simply ends with *"database="* and then no name, the "database" function will automatically append the first input (the database name) to this string.
> If you want to use AAD integrated auth mode replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*

Test the connection and run a sample query. Submit die following commands (MATLAB command window):

```s
data = select(conn, 'SELECT * FROM <<KUSTO_TABLE>>')
data
```

> Replace *KUSTO_TABLE* with an existing table in Kusto



## Sending T-SQL queries over the REST API

The [Kusto REST API](../rest/index.md) can accept and execute T-SQL queries.
To do this, send the request to the query endpoint with the `csl` property
set to the text of the T-SQL query itself, and the
[request property](../netfx/request-properties.md) `OptionQueryLanguage`
set to the value `sql`.