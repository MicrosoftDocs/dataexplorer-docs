---
title: MS-TDS clients and Kusto - Azure Data Explorer
description: This article describes MS-TDS clients and Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 10/30/2019
---
# MS-TDS clients and Azure Data Explorer

Azure Data Explorer implements TDS-compliant endpoints for MS-SQL clients. Compatibility is on the protocol level. Any library or application that can connect to the SQL Azure database with Azure Active Directory (Azure AD) authentication, will work with the Azure Data Explorer server. Therefore, you can use the server domain name like it was the SQL Azure server.

Azure Data Explorer doesn't support basic authentication with username and password. You must use Azure Active Directory with all clients listed below.

> [!NOTE]
> Azure Data Explorer implements a subset of T-SQL. To learn more, see [T-SQL in Kusto versus Microsoft SQL Server](../../../t-sql-limitations.md)

## JDBC

The Microsoft JDBC driver can be used to connect to Azure Data Explorer with Azure AD authentication.

Create an application to use one of the versions of *mssql-jdbc* JAR and *adal4j* JAR, and all their dependencies.
For example,

```java
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

```java
jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;database=<database_name>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword
```

> [!NOTE]
> If you want to use the Azure Active Directory integrated authentication mode, then replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*. For more information, see [JDBC (user authentication)](./aad.md#jdbc-user) and [JDBC (application authentication)](./aad.md#jdbc-application).

## ODBC

Applications that support ODBC can connect to Azure Data Explorer.

Create an ODBC data source:

1. Launch the ODBC Data Source Administrator.
1. Select **Add** to create a new data source, and set *ODBC Driver 17 for SQL Server*.
1. Give the data source a name, and specify the Azure Data Explorer cluster name in the **Server** field. For example, *mykusto.kusto.windows.net*.
1. Set **Active Directory Integrated**, for the authentication option.
1. Select **Next** to set the database.
1. You can just leave the defaults for all the other settings in the tabs that follow.
1. Select **Finish** to open the data source summary window, where the connection can be tested.

You can now use the ODBC data source with the applications.

If the ODBC application can accept a connection string instead of, or in addition to DSN, then use the following.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

Some ODBC applications don't work well with the `NVARCHAR(MAX)` type. For more information, see [Using Large Value Types in SQL Server Native Client](/sql/relational-databases/native-client/features/using-large-value-types).

The common workaround, is to cast the returned data to *NVARCHAR(n)*, with some value for n. For example, *NVARCHAR(4000)*. Such a workaround, however, won't work for Azure Data Explorer, since Azure Data Explorer has only one string type and for SQL clients it's encoded as *NVARCHAR(MAX)*.

Azure Data Explorer offers a different workaround. You can configure Azure Data Explorer to encode all strings as *NVARCHAR(n)* via a connection string. The language field in the connection string can be used to specify tuning options in the format, *language@OptionName1:OptionValue1,OptionName2:OptionValue2*.

For example, the following connection string will instruct Azure Data Explorer to encode strings as *NVARCHAR(5000)*. It can be used, for example, to work with the SAP Smart Data Integration, which has a default mapping for type NVARCHAR with precision > 5000.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated;Language=any@MaxStringSize:5000"
```

You can also use service principal authentication with ODBC. To do so, you must provide an Azure Active Directory tenant ID in the ODBC connection string. The tenant ID can be specified in the *Language* field using the following syntax:

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=<adx_cluster_name>.<region_name>.kusto.windows.net;Database=<adx_database_name>;Authentication=ActiveDirectoryServicePrincipal;Language=any@MaxStringSize:4000,AadAuthority:<aad_tenant_id>;UID=<aad_application_id>;PWD=<aad_application_secret>"
```

You can also change the *Language* field in the ODBC data source (DSN). To do so, add the *Language* value in the DSN registry, as shown in the following example:

```odbc
[HKEY_CURRENT_USER\SOFTWARE\ODBC\ODBC.INI\MyUserDSN]
"Language"="any@AadAuthority:<aad_tenant_id>"
```

For Linux and macOS, edit the odbc.ini file, as follows:

```odbc
# [DSN name]
[MSSQLTest]  
Driver = ODBC Driver 17 for SQL Server  
# Server = [protocol:]server[,port]  
Server = tcp:<adx_cluster_name>.<region_name>.kusto.windows.net,1433
Language = any@AadAuthority:<aad_tenant_id>
```

The Azure AD tenant ID for SQL clients can also be configured at the cluster level. If configured, you don't need to specify the ID on client. To change the tenant ID at the cluster level, please open a support request in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) about configuring *SecuritySettings.TdsEndpointDefaultAuthority* with the required tenant ID.

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
1. Set **Build data context automatically**.
1. Set **Default (LINQ to SQL)**, the LINQPad driver.
1. Set **SQL Azure**.
1. For the server, specify the name of the Azure Data Explorer cluster. For example, *mykusto.kusto.windows.net*.
1. Set **Windows Authentication (Active Directory)**, for signing in.
1. Select **Test** to verify connectivity.
1. Select **OK**. The browser window displays the tree view with the databases.
1. You can browse through the databases, tables, and columns.
1. You can run SQL queries in the query window. Specify the SQL language, and select a connection to the database.
1. You can also run LINQ queries in the query window. For example, select a table in the browser window. Select **Count**, and let it run.

## Azure Data Studio (1.3.4 and above)

Make a new connection.

1. Set the connection type to **Microsoft SQL Server**.
1. Specify the name of the Azure Data Explorer cluster as a server name. For example, *mykusto.kusto.windows.net*.
1. Set the authentication type **Azure Active Directory - Universal with MFA support**.
1. Specify the account that is provisioned in the Azure AD. For example, *myname@contoso.com*. Add the account the first time.
1. Use Database picker to select the database.
1. Select **Connect** to take you to the database dashboard and set the connection.
1. Select **New Query** to open the query window, or select the **New Query** task on the dashboard.

## Power BI desktop

Connect like you do, to the SQL Azure Database.

1. Under **Get Data**, select **More**.
1. Set **Azure**, and then **Azure SQL Database**.
1. Specify the Azure Data Explorer server name. For example, *mykusto.kusto.windows.net*.
1. Select **DirectQuery**.
1. Set **Microsoft account** authentication (not **Windows**), and select **sign in**.
1. The database picker shows the available databases. Continue like you do, with a real SQL server.

## Excel

Connect like you do, to the SQL Azure Database.

1. Select **Get Data** under the **Data** tab, then set **From Azure** and **From Azure SQL Database**.
1. Specify the Azure Data Explorer server name. For example, *mykusto.kusto.windows.net*.
1. Set **Microsoft account** authentication (not **Windows**), and select **sign in**.
1. The database picker shows the available databases. Continue like you do, with a real SQL server.
1. Once signed in, select **Connect**.
1. The database picker shows the available databases. Continue like you do, with a real SQL server.

## Tableau

Create an ODBC data source. For more information, see the [ODBC](./clients.md#odbc) section.

1. Connect via **Other Databases (ODBC)**.
1. Set the ODBC data source in **DSN**.
1. Select **Connect** to establish a connection.
1. Select **Sign In**, once the button is available, and sign in to Azure Data Explorer.

## DBeaver (5.3.3 and above)

Configure DBeaver for handling result sets in a manner that is compatible with Azure Data Explorer.

1. Select **Preferences** in the **Window** menu.
1. Select **Data Editor** in the **Editors** section.
1. Make sure that **Refresh data on next page reading** is marked.

Create a connection to the Azure Data Explorer database.

1. Select **New Connection** in the **Database** menu.
1. Look for **Azure** and set **Azure SQL Database**. Select **Next**.
1. Specify the host. For example, *mykusto.kusto.windows.net*.
1. Specify the database. For example, *mydatabase*.

   > [!WARNING]
   > Don't use *master* as the database name. Azure Data Explorer requires a connection to a specific database.

1. Set **Active Directory - Password** for *Authentication*.
1. Specify the credentials of the active directory user. For example, *myname@contoso.com*, and set the corresponding password for this user.
1. Select **Test Connection …** to verify that the connection details are correct.

## Microsoft SQL Server Management Studio (v18.x)

1. Select **Connect**, and then **Database Engine** under **Object Explorer**.
1. Specify the name of Azure Data Explorer cluster as a server name. For example, *mykusto.region.kusto.windows.net*.
1. Set **Azure Active Directory - Universal with MFA** for authentication and specify the username.
1. Select **Options**.
1. Select **Browse Server** under **Connect to database** to browse available databases.
1. Select **Yes** to continue browsing.
1. The window displays a tree view with all the available databases. Select one, to connect to the database.
1. Another possibility, is to select **default** under **Connect to database**, and then select **Connect**. The object Explorer will display all the databases.

   > [!NOTE]
   > Browsing database objects via SSMS is not supported yet, since SSMS uses correlate subqueries to browse database schema.
   > Correlated subqueries are not supported by Azure Data Explorer. For more information, see [correlated subqueries](./sqlknownissues.md#correlated-sub-queries).

1. Select **New Query** to open the query window and set your database.

You can run custom SQL queries from the query window.

## MATLAB (via JDBC)

Add the required JAR-files to the front of MATLAB's static classpath by creating a *"javaclasspath.txt"* file in your preferences directory.

1. Run the following command in Matlab's command window.

   ```java
   edit(fullfile(prefdir,'javaclasspath.txt'))
   ```

1. Add the full paths to the required JAR-files.

   ```java
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

1. Restart MATLAB to make sure that these classes are loaded.

1. Before trying to connect, run the following command (MATLAB command window).

   ```java
   java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
   ```

   > [!NOTE]
   > This resets the **TransformerFactory** to the default (MATLAB usually overloads this with **Saxon**, but this is incompatible with **ADAL4J**).

1. Connect to the Azure Data Explorer TDS endpoint with the following command (MATLAB command window).

   ```java
   conn = database('<<KUSTO_DATABASE>>','<<AAD_USER>>','<<USER_PWD>>','com.microsoft.sqlserver.jdbc.SQLServerDriver',    ['jdbc:sqlserver://<<MYCLUSTER>>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authenti cation=ActiveDirectoryPassword;database='])
   ```

   > [!NOTE]
   > It's OK to end with **"database="** and then no value. The *database* function will automatically append the first input, the database name, to this string.
   > If you want to use Azure Active Directory integrated authentication mode, then replace *ActiveDirectoryPassword* with *ActiveDirectoryIntegrated*.

1. Test the connection and run a sample query. Submit the following commands (MATLAB command window).

   ```java
   data = select(conn, 'SELECT * FROM <<KUSTO_TABLE>>')
   data
   ```

   > [!NOTE]
   > Replace *KUSTO_TABLE* with an existing table in Azure Data Explorer.

## Sending T-SQL queries over the REST API

The [Azure Data Explorer REST API](../rest/index.md) can accept and execute T-SQL queries.

1. Send the request to the query endpoint with the **csl** property set to the text of the T-SQL query.
1. Set **[request property](../netfx/request-properties.md)** **OptionQueryLanguage** to **sql**.
