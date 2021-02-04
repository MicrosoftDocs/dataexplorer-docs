---
title: MS-TDS clients and Kusto - Azure Data Explorer
description: This article describes MS-TDS clients and Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 10/30/2019
---
# MS-TDS clients and Azure Data Explorer

Azure Data Explorer implements TDS-compliant endpoints for MS-SQL clients. Compatibility is on the protocol level. Any library or application that can connect to the SQL Azure database with Azure Active Directory (Azure AD) authentication, will work with the Azure Data Explorer server. Therefore, you can use the server domain name like it was the SQL Azure server.

Azure Data Explorer doesn't support basic authentication with username and password. You must use Azure Active Directory with all clients listed below. 

Azure Data Explorer implements a subset of the T-SQL and a subset of the SQL server emulation. For more information, see [known issues](./sqlknownissues.md) for differences between the SQL Server's implementation of T-SQL and Azure Data Explorer's.

## .NET SQL client

Azure Data Explorer supports Azure AD authentication for SQL clients. For more information, see [.NET SQL Client (user authentication)](./aad.md#net-sql-client-user) and [.NET SQL Client (application authentication)](./aad.md#net-sql-client-application)

## JDBC

The Microsoft JDBC driver can be used to connect to Azure Data Explorer with Azure AD authentication.

Create an application to use one of the versions of *mssql-jdbc* JAR and *adal4j* JAR, and all their dependencies.
For example,

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

Create an application to use the JDBC driver class *com.microsoft.sqlserver.jdbc.SQLServerDriver*.

Use a connection string like the following.

```s
jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;database=<database_name>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword
```

> [!NOTE]
> If you want to use the Azure Active Directory integrated authentication mode, then replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*. For more information, see [JDBC (user authentication)](./aad.md#jdbc-user) and [JDBC (application authentication)](./aad.md#jdbc-application).

## ODBC

Applications that support ODBC can connect to Azure Data Explorer.

Create an ODBC data source:

1. Launch the ODBC Data Source Administrator.
2. Select  **Add** to create a new data source, and set *ODBC Driver 17 for SQL Server*.
3. Give the data source a name, and specify the Azure Data Explorer cluster name in the **Server** field. For example, *mykusto.kusto.windows.net*.
4. Set **Active Directory Integrated**, for the authentication option.
5. Select **Next** to set the database.
7. You can just leave the defaults for all the other settings in the tabs that follow.
8. Select **Finish** to open the data source summary window, where the connection can be tested.

You can now use the ODBC data source with the applications.

If the ODBC application can accept a connection string instead of, or in addition to DSN, then use the following.

```s
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

Some ODBC applications don't work well with the `NVARCHAR(MAX)` type. For more information, see https://docs.microsoft.com/sql/relational-databases/native-client/features/using-large-value-types#sql-server-native-client-odbc-driver.

The common workaround, is to cast the returned data to *NVARCHAR(n)*, with some value for n. For example, *NVARCHAR(4000)*. Such a workaround, however, won't work for Azure Data Explorer, since Azure Data Explorer has only one string type and for SQL clients it's encoded as *NVARCHAR(MAX)*.

Azure Data Explorer offers a different workaround. You can configure Azure Data Explorer to encode all strings as *NVARCHAR(n)* via a connection string. The language field in the connection string can be used to specify tuning options in the format, *language@OptionName1:OptionValue1,OptionName2:OptionValue2*.

For example, the following connection string will instruct Azure Data Explorer to encode strings as *NVARCHAR(8000)*.

```s
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated,Language=any@MaxStringSize:8000"
```

### PowerShell

Here is an example of the PowerShell script that uses the ODBC driver.

```powershell
$conn = [System.Data.Common.DbProviderFactories]::GetFactory("System.Data.Odbc").CreateConnection()
$conn.ConnectionString = "Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
$conn.Open()
$conn.GetSchema("Tables")
$conn.Close()
```

## LINQPad

A Linq application can be used with Azure Data Explorer, by connecting it like it's an SQL server.
Use LINQPad to explore Linq compatibility and to browse Azure Data Explorer. It can also execute SQL queries, and is the recommended tool to explore Azure Data Explorer TDS (SQL) endpoints.

Connect like you do, to the Microsoft SQL Server. LINQPad supports Active Directory authentication.

1. Select **Add connection**.
2. Set **Build data context automatically**.
3. Set **Default (LINQ to SQL)**, the LINQPad driver.
4. Set **SQL Azure**.
5. For the server, specify the name of the Azure Data Explorer cluster. For example, *mykusto.kusto.windows.net*.
6. Set **Windows Authentication (Active Directory)**, for signing in.
7. Select **Test** to verify connectivity.
8. Select **OK**. The browser window displays the tree view with the databases.
9. You can browse through the databases, tables, and columns.
10. You can run SQL queries in the query window. Specify the SQL language, and select a connection to the database.
11. You can also run LINQ queries in the query window. For example, select a table in the browser window. Select **Count**, and let it run.

## Azure Data Studio (1.3.4 and above)

Make a new connection.

1. Set the connection type to **Microsoft SQL Server**.
2. Specify the name of the Azure Data Explorer cluster as a server name. For example, *mykusto.kusto.windows.net*.
3. Set the authentication type **Azure Active Directory - Universal with MFA support**.
4. Specify the account that is provisioned in the Azure AD. For example, *myname@contoso.com*. Add the account the first time.
5. Use Database picker to select the database.
6. Select **Connect** to take you to the database dashboard and set the connection.
7. Select **New Query** to open the query window, or select the **New Query** task on the dashboard.

## Power BI desktop

Connect like you do, to the SQL Azure Database.

1. Under **Get Data**, select **More**.
2. Set **Azure**, and then **Azure SQL Database**.
3. Specify the Azure Data Explorer server name. For example, *mykusto.kusto.windows.net*.
4. Select **DirectQuery**.
5. Set **Microsoft account** authentication (not **Windows**), and select **sign in**.
6. The database picker shows the available databases. Continue like you do, with a real SQL server.

## Excel

Connect like you do, to the SQL Azure Database.

1. Select **Get Data** under the **Data** tab, then set **From Azure** and **From Azure SQL Database**.
2. Specify the Azure Data Explorer server name. For example, *mykusto.kusto.windows.net*.
3. Set **Microsoft account** authentication (not **Windows**), and select **sign in**.
5. The database picker shows the available databases. Continue like you do, with a real SQL server.
4. Once signed in, select **Connect**.
5. The database picker shows the available databases. Continue like you do, with a real SQL server.

## Tableau

Create an ODBC data source. For more information, see the [ODBC](./clients.md#odbc) section.

1. Connect via **Other Databases (ODBC)**.
2. Set the ODBC data source in **DSN**.
3. Select **Connect** to establish a connection.
4. Select **Sign In**, once the button is available, and sign in to Azure Data Explorer.

## DBeaver (5.3.3 and above)

Configure DBeaver for handling result sets in a manner that is compatible with Azure Data Explorer.

1. Select **Preferences** in the **Window** menu.
2. Select **Data Editor** in the **Editors** section.
3. Make sure that **Refresh data on next page reading** is marked.

Create a connection to the Azure Data Explorer database.

1. Select **New Connection** in the **Database** menu.
2. Look for **Azure** and set **Azure SQL Database**. Select **Next**.
3. Specify the host. For example, *mykusto.kusto.windows.net*.
4. Specify the database. For example, *mydatabase*.

> [!WARNING]
> Don't use *master* as the database name. Azure Data Explorer requires a connection to a specific database.

5. Set **Active Directory - Password** for *Authentication*.
6. Specify the credentials of the active directory user. For example, *myname@contoso.com*, and set the corresponding password for this user.
7. Select **Test Connection …** to verify that the connection details are correct.

## Microsoft SQL Server Management Studio (v18.x)

1. Select **Connect**, and then **Database Engine** under **Object Explorer**.
2. Specify the name of Azure Data Explorer cluster as a server name. For example, *mykusto.kusto.windows.net*.
3. Set **Active Directory - Integrated** for authentication.
4. Select **Options**.
5. Select **Browse Server** under **Connect to database** to browse available databases.
6. Select **Yes** to continue browsing.
7. The window displays a tree view with all the available databases. Select one, to connect to the database.
8. Another possibility, is to select **default** under **Connect to database**, and then select **Connect**. The object Explorer will display all the databases.

> [!NOTE]
> Browsing database objects via SSMS is not supported yet, since SSMS uses correlate subqueries to browse database schema.
> Correlated subqueries are not supported by Azure Data Explorer. For more information, see [correlated subqueries](./sqlknownissues.md#correlated-sub-queries).

10. Select **New Query** to open the query window and set your database.

You can run custom SQL queries from the query window.

## MATLAB (via JDBC)

Add the required JAR-files to the front of MATLAB's static classpath by creating a *"javaclasspath.txt"* file in your preferences directory.

1. Run the following command in Matlab's command window.

``` s
edit(fullfile(prefdir,'javaclasspath.txt'))
```

2. Add the full paths to the required JAR-files.

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

> [!NOTE]
> You need the <**before**> at the top, so that these files are added to the front of the classpath. Also, replace *c:\full\path\to* with the actual full paths to these files.

3. Restart MATLAB to make sure that these classes are loaded.

4. Before trying to connect, run the following command (MATLAB command window).

``` java
java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
```

> [!NOTE]
> This resets the **TransformerFactory** to the default (MATLAB usually overloads this with **Saxon**, but this is incompatible with **ADAL4J**).

5. Connect to the Azure Data Explorer TDS endpoint with the following command (MATLAB command window).

```s
conn = database('<<KUSTO_DATABASE>>','<<AAD_USER>>','<<USER_PWD>>','com.microsoft.sqlserver.jdbc.SQLServerDriver',['jdbc:sqlserver://<<MYCLUSTER>>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword;database='])
 ```

> [!NOTE]
> It's OK to end with **"database="** and then no value. The *database* function will automatically append the first input, the database name, to this string.
> If you want to use Azure Active Directory integrated authentication mode, then replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*.

6. Test the connection and run a sample query. Submit the following commands (MATLAB command window).

```s
data = select(conn, 'SELECT * FROM <<KUSTO_TABLE>>')
data
```

> [!NOTE]
> Replace *KUSTO_TABLE* with an existing table in Azure Data Explorer.

## Sending T-SQL queries over the REST API

The [Azure Data Explorer REST API](../rest/index.md) can accept and execute T-SQL queries.

1. Send the request to the query endpoint with the **csl** property set to the text of the T-SQL query.
2. Set **[request property](../netfx/request-properties.md)** **OptionQueryLanguage** to **sql**.
