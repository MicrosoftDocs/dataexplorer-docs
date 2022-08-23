---
title: MS-TDS with Azure Active Directory - Azure Data Explorer
description: This article describes MS-TDS with Azure Active Directory in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 01/02/2019
---
# MS-TDS with Azure Active Directory

## Azure AD User Authentication

SQL clients that support Azure AD user authentication can be used with Azure Data Explorer.

### .NET SQL Client (user)

For example, for integrated Azure AD:
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

### JDBC (user)

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

## Azure AD Application Authentication

Azure AD application provisioned for Kusto can use SQL client libraries that support Azure AD for connecting to Kusto. For more information about Azure AD applications, see [Creating an Azure AD Application](../../../provision-azure-ad-app.md).

### .NET SQL Client (application)

Assuming you have provisioned Azure AD application with *ApplicationClientId* and *ApplicationKey* and granted it permissions to access database *DatabaseName* on cluster *ClusterDnsName*, the following sample demonstrates how to use .NET SQL Client for queries from this Azure AD application.

```csharp
using Microsoft.Identity.Client;
using System;
using System.Data;
using System.Data.SqlClient;

namespace Sample
{
  class Program
  {
    private static async Task<string> ObtainToken()
    {
      var confidentialClientApp = ConfidentialClientApplicationBuilder
	    .Create("<your application client ID>")
	    .WithClientSecret("<your application key>")
	    .WithAuthority("https://login.microsoftonline.com/<your AAD tenant name>")
	    .Build();

      var result = await confidentialClientApp.AcquireTokenForClient("https://login.microsoftonline.com/<your AAD tenant name>/.default")
	    .ExecuteAsync();
      return result.AccessToken;
    }

    private static async Task QuerySample()
    {
      var csb = new SqlConnectionStringBuilder()
      {
        InitialCatalog = "<your database name>",
        DataSource = "<your cluster DNS name>"
      };
      using (var connection = new SqlConnection(csb.ToString()))
      {
        connection.AccessToken = await ObtainToken();
        await connection.OpenAsync();
        using (var command = new SqlCommand(
          "<your T-SQL query>",
          connection))
        {
          var reader = await command.ExecuteReaderAsync();
          /*
          Read query result.
          */
        }
      }
    }
  }
}
```

### JDBC (application)

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
