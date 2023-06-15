---
title: Connect to Azure Data Explorer with JDBC
description: In this article, you learn how to set up a JDBC connection to Azure Data Explorer.
ms.topic: how-to
ms.date: 06/14/2023
---

# Connect to Azure Data Explorer with JDBC

Java Database Connectivity (JDBC) is a Java API used to connect to databases and execute queries. You can use JDBC to connect to Azure Data Explorer. This functionality is made possible by Azure Data Explorer's TDS-compliant endpoint, which emulates Microsoft SQL Server. The endpoint supports TDS versions 7.x and 8.0.

For more information, see the overview on [SQL Server emulation in Azure Data Explorer](/azure/data-explorer/sql-server-emulation-overview).

## Connect with JDBC

The following steps describe how to use JDBC to connect to Azure Data Explorer.

1. Create an application with `mssql-jdbc` JAR, `adal4j` JAR, and all of their dependencies. Following is a list of dependencies required when using the `7.0.0` version of `mssql-jdbc` and `1.6.3` version of `adal4j`.

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

1. Create an application to use the JDBC driver class *com.microsoft.sqlserver.jdbc.SQLServerDriver*. You can connect with a connection string of the following format. Replace `<cluster_name.region>` with your cluster name and cluster region and `<database_name>` with your database name.

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
    ds.setServerName("<cluster_DNS>");
    ds.setDatabaseName("<database_name>");
    ds.setHostNameInCertificate("*.kusto.windows.net"); // Or appropriate regional domain.
    ds.setAuthentication("ActiveDirectoryIntegrated");
    try (Connection connection = ds.getConnection();
         Statement stmt = connection.createStatement();) {
      ResultSet rs = stmt.executeQuery("<T-SQL_query>");
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
    String authorityUrl = "https://login.microsoftonline.com/<tenant_ID>";
    Set<String> scopes = new HashSet<>();
    scopes.add("https://<cluster_DNS>/.default");

    IConfidentialClientApplication clientApplication = ConfidentialClientApplication.builder("<application_client_ID>", ClientCredentialFactory.createFromSecret("<application_key>")).authority(authorityUrl).build();
    CompletableFuture<IAuthenticationResult> futureAuthenticationResult = clientApplication.acquireToken(ClientCredentialParameters.builder(scopes).build());
    IAuthenticationResult authenticationResult = futureAuthenticationResult.get();
    SQLServerDataSource ds = new SQLServerDataSource();
    ds.setServerName("<cluster_DNS>");
    ds.setDatabaseName("<database_name>");
    ds.setAccessToken(authenticationResult.accessToken());
    connection = ds.getConnection();
    statement = connection.createStatement();
    ResultSet rs = statement.executeQuery("<T-SQL_query>");
    /*
    Read query result.
    */
  }
}
```

## Next steps

* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)