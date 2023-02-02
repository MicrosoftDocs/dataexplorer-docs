---
title: Connect to Azure Data Explorer with JDBC
description: In this article, you learn how to set up a JDBC connection to Azure Data Explorer.
ms.topic: how-to
ms.date: 02/02/2023
---

# Connect to Azure Data Explorer with JDBC

JDBC, or Java Database Connectivity, is a Java API used to connect to databases and execute queries. You can use JDBC to connect to Azure Data Explorer. This functionality is made possible by Azure Data Explorer's TDS-compliant endpoints, which emulate Microsoft SQL Server.

## Connect with JDBC

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

## JDBC user authentication

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

## JDBC application authentication

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

## Example

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
