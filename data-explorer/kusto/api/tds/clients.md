---
title: Connect to Azure Data Explorer like SQL Server - Azure Data Explorer
description: This article describes how to connect to Azure Data Explorer like SQL Server from various clients in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 02/02/2023
---
# Connect to Azure Data Explorer like SQL Server

Any library and application that can connect to a Microsoft Azure SQL Database with Azure Active Directory (Azure AD) authentication can also connect to Azure Data Explorer. Access your data stored in Azure Data Explorer by specifying the server domain name in the same way you would when connecting to Microsoft Azure SQL Database. This functionality is made possible by Azure Data Explorer's TDS-compliant endpoints, which emulate Microsoft SQL Server.

This article explains how to connect and authenticate to Azure Data Explorer using [JDBC](#jdbc), [ODBC](#odbc), [Azure Data Studio](#azure-data-studio-134-and-above), and more.

> [!NOTE]
>
> Azure Data Explorer implements a subset of T-SQL. See [known issues](./sqlknownissues.md) for differences between T-SQL in Microsoft SQL Server and Azure Data Explorer.

## JDBC

To use JDBC to connect to Azure Data Explorer, follow these steps.

1. Create an application with `mssql-jdbc` JAR, `adal4j` JAR, and all of their dependencies. For example, see the following list of dependencies.

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

1. Create an application to use the JDBC driver class *com.microsoft.sqlserver.jdbc.SQLServerDriver*. You can connect with a connection string like the following.

    ```java
    jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;database=<database_name>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryIntegrated
    ```

### JDBC user authentication

Following is an example of how to programmatically authenticate using Azure AD with JDBC for a user principal.

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import com.microsoft.aad.msal4j.*;

public class Sample {
  public static void main(String[] args) throws Exception {
    IAuthenticationResult authenticationResult = futureAuthenticationResult.get();
    SQLServerDataSource ds = new SQLServerDataSource();
    ds.setServerName("<your cluster DNS name>");
    ds.setDatabaseName("<your database name>");
    ds.setHostNameInCertificate("*.kusto.windows.net"); // Or appropriate regional domain.
    ds.setAuthentication("ActiveDirectoryIntegrated");
    try (Connection connection = ds.getConnection();
         Statement stmt = connection.createStatement();) {
      ResultSet rs = stmt.executeQuery("<your T-SQL query>");
      /*
      Read query result.
      */
    } catch (Exception e) {
      System.out.println();
      e.printStackTrace();
    }
  }
}
```

### JDBC application authentication

Following is an example of how to programmatically authenticate using Azure AD with JDBC for an application principal.

```java
import java.sql.*;
import com.microsoft.sqlserver.jdbc.*;
import com.microsoft.aad.msal4j.*;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Sample {
  public static void main(String[] args) throws Throwable {
    // Can also use tenant name.
    String authorityUrl = "https://login.microsoftonline.com/<your AAD tenant ID>";
    Set<String> scopes = new HashSet<>();
    scopes.add("https://<your cluster DNS name>/.default");

    IConfidentialClientApplication clientApplication = ConfidentialClientApplication.builder("<your application client ID>", ClientCredentialFactory.createFromSecret("<your application key>")).authority(authorityUrl).build();
    CompletableFuture<IAuthenticationResult> futureAuthenticationResult = clientApplication.acquireToken(ClientCredentialParameters.builder(scopes).build());
    IAuthenticationResult authenticationResult = futureAuthenticationResult.get();
    SQLServerDataSource ds = new SQLServerDataSource();
    ds.setServerName("<your cluster DNS name>");
    ds.setDatabaseName("<your database name>");
    ds.setAccessToken(authenticationResult.accessToken());
    connection = ds.getConnection();
    statement = connection.createStatement();
    ResultSet rs = statement.executeQuery("<your T-SQL query>");
    /*
    Read query result.
    */
  }
}
```

## MATLAB

This example shows how to connect to Azure Data Explorer from MATLAB using JDBC.

1. Create a "javaclasspath.txt" file in your preferences directory. This file will be used to add the required JAR-files to the front of MATLAB's static classpath.

   ```java
   edit(fullfile(prefdir,'javaclasspath.txt'))
   ```

1. Add the paths to the required JAR-files by replacing `c:\full\path\to` with the actual full paths to these files.

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

   > [!IMPORTANT]
   > You need the `<before>` at the top, so that these files are added to the front of the classpath.

1. Restart MATLAB to make sure that these classes are loaded.

1. In the MATLAB command window, run the following command to reset `TransformerFactory` to the default. MATLAB usually overloads this with `Saxon`, which is incompatible with the `adal4j` dependency.

   ```java
   java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
   ```

1. In the MATLAB command window, run the following command to connect to Azure Data Explorer.

   ```java
   conn = database('<<KUSTO_DATABASE>>','<<AAD_USER>>','<<USER_PWD>>','com.microsoft.sqlserver.jdbc.SQLServerDriver',    ['jdbc:sqlserver://<<MYCLUSTER>>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authenti cation=ActiveDirectoryPassword;database='])
   ```

   > [!NOTE]
   >
   > * If you end with `database=` without a value, the database name will be inferred.
   > * To use Azure Active Directory integrated authentication, replace **ActiveDirectoryPassword** with **ActiveDirectoryIntegrated**.

1. In the MATLAB command window, test the connection and run a sample query. Replace `KUSTO_TABLE` with an existing table in Azure Data Explorer.

   ```java
   data = select(conn, 'SELECT * FROM <<KUSTO_TABLE>>')
   data
   ```

## ODBC

To create an ODBC data source to connect to Azure Data Explorer, follow the steps described in [Connect to Azure Data Explorer with ODBC](../../../connect-odbc.md).

Then, you can use the ODBC data source from other applications to connect to Azure Data Explorer. Use a connection string like the following to connect.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

> [!NOTE]
> ODBC applications may not work well with `NVARCHAR(MAX)` type. You can cast the data to `NVARCHAR(`*n*`)` using the `Language` parameter in the connection string. For example, `Language=any@MaxStringSize:5000` will encode strings as `NVARCHAR(5000)`.

### ODBC application authentication

To use service principal authentication with ODBC, you must provide an Azure Active Directory tenant ID in the ODBC connection string. Specify the tenant ID in the `Language` field.

For example, specify the tenant with `Language=any@AadAuthority:<aad_tenant_id>`.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=<adx_cluster_name>.<region_name>.kusto.windows.net;Database=<adx_database_name>;Authentication=ActiveDirectoryServicePrincipal;Language=any@AadAuthority:<aad_tenant_id>;UID=<aad_application_id>;PWD=<aad_application_secret>"
```

You can change the Language field in the ODBC data source (DSN) in the registry for Windows.

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

The Azure AD tenant ID can also be configured at the cluster level, so you don't have to specify it on the client. If you need to change the tenant ID at the cluster level, open a support request in the  [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) about configuring *SecuritySettings.TdsEndpointDefaultAuthority* with the required tenant ID.

## PowerShell

The following example shows how to connect to Azure Data Explorer using an ODBC driver from Powershell. For this to work, you must first follow the steps in [ODBC](#odbc) to create the ODBC driver.

```powershell
$conn = [System.Data.Common.DbProviderFactories]::GetFactory("System.Data.Odbc").CreateConnection()
$conn.ConnectionString = "Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
$conn.Open()
$conn.GetSchema("Tables")
$conn.Close()
```

## LINQPad

You can connect to Azure Data Explorer from LINQPad as if Azure Data Explorer were an SQL server.

1. Select **Add connection**.

1. Set **Build data context automatically**.

1. Set **Default (LINQ to SQL)**, the LINQPad driver.

1. Set **SQL Azure**.

1. For the server, specify the name of the Azure Data Explorer cluster. For example, *mykusto.kusto.windows.net*.

1. Set **Windows Authentication (Active Directory)**, for signing in.

1. Select **Test** to verify connectivity.

1. Select **OK**. The browser window displays the tree view with the databases.

1. Now, you can browse through the databases, tables, and columns, and run SQLand LINQ queries in the query window. Specify the SQL language, and select a connection to the database. For example, select a table in the browser window. Select **Count**, and let it run.

## Azure Data Studio (1.3.4 and above)

To connect to Azure Data Explorer from Azure Data Studio, follow these steps.

1. Set the connection type to **Microsoft SQL Server**.

1. Specify the name of the Azure Data Explorer cluster as a server name. For example, *mykusto.kusto.windows.net*.

1. Set the authentication type **Azure Active Directory - Universal with MFA support**.

1. Specify the account that is provisioned in the Azure AD. For example, *myname@contoso.com*. Add the account the first time.

1. Use **Database picker** to select the database.

1. Select **Connect** to take you to the database dashboard and set the connection.

1. Select **New Query** to open the query window, or select the **New Query** task on the dashboard.

## DBeaver (5.3.3 and above)

To configure DBeaver for handling result sets in a manner that is compatible with Azure Data Explorer, follow these steps.

1. Select **Preferences** in the **Window** menu.
1. Select **Data Editor** in the **Editors** section.
1. Make sure that **Refresh data on next page reading** is marked.

Now, you can create a connection to the Azure Data Explorer database by doing the following actions.

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

To connect to Azure Data Explorer from Microsoft SQL Server Management Studio, follow these steps.

1. Select **Connect**, and then **Database Engine** under **Object Explorer**.

1. Specify the name of Azure Data Explorer cluster as a server name. For example, *mykusto.region.kusto.windows.net*.

1. Set **Azure Active Directory - Universal with MFA** for authentication and specify the username.

1. Select **Options**.

1. Select **Browse Server** under **Connect to database** to browse available databases.

1. Select **Yes** to continue browsing.

1. The window displays a tree view with all the available databases. Select a database to connect to that database. Another possibility, is to select **default** under **Connect to database**, and then select **Connect**. Then, the object Explorer will display all the databases.

   > [!NOTE]
   > Browsing database objects via SSMS is not supported yet, since SSMS uses correlate subqueries to browse database schema.
   > Correlated subqueries are not supported by Azure Data Explorer. For more information, see [correlated subqueries](./sqlknownissues.md#correlated-sub-queries).

1. Select **New Query** to open the query window and set your database.

1. Now, you can run custom SQL queries from the query window.
