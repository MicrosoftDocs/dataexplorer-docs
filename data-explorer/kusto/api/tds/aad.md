---
title: MS-TDS with Azure Active Directory - Azure Data Explorer | Microsoft Docs
description: This article describes MS-TDS with Azure Active Directory in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# MS-TDS with Azure Active Directory

## AAD User Authentication

SQL clients that support AAD user authentication can be used with Kusto. See [SQL clients](./clients.md).

## AAD Application Authentication

AAD application provisioned for Kusto can use SQL client libraries that support AAD for connecting to Kusto. See [Creating an AAD Application](../../management/access-control/how-to-provision-aad-app.md) for more information about AAD applications.

### .NET SQL Client

Assuming you have provisioned AAD application with *ApplicationClientId* and *ApplicationKey* and granted it permissions to access database *DatabaseName* on cluster *ClusterDnsName*, the following sample demonstrates how to use .NET SQL Client for queries from this AAD application.

```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Data;
using System.Data.SqlClient;

namespace Sample
{
  class Program
  {
    private static async Task<string> ObtainToken()
    {
      var authContext = new AuthenticationContext("https://login.microsoftonline.com/<your AAD tenant>");
      var applicationCredentials = new ClientCredential("<your application client ID>", "<your application key>");
      var result = await authContext.AcquireTokenAsync("https://<your cluster DNS name>", applicationCredentials);
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
        using (var command = new SqlCommand("<your T-SQL query>", connection))
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
