---
title: 'Create policies by using the Azure Data Explorer C# SDK'
description: This article describes how to programmatically create Azure Data Explorer policies using C#.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 09/24/2019
---

# Create database and table policies for Azure Data Explorer by using C#

> [!div class="op_single_selector"]
> * [C#](database-table-policies-csharp.md)
> * [Python](database-table-policies-python.md)
>

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you'll create database and table policies for Azure Data Explorer by using C#.

## Prerequisites

* Visual Studio. Download and use the *free* [Visual Studio Community Edition](https://www.visualstudio.com/downloads/). Enable **Azure development** during the Visual Studio setup.
* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* [A test table](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).

## Install C# NuGet

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install the [Microsoft.Azure.Kusto.Data NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/). (Optional, for changing table policies)
* Install the [MSAL NuGet package](https://www.nuget.org/packages/Microsoft.Identity.Client/) for authentication with Azure Active Directory (Azure AD).

## Authentication
To run the examples in this article, you need an Azure AD application and service principal that can access resources. If necessary, create an Azure AD application and grant it appropriate role assignments on the subscription, as documented [here](/azure/active-directory/develop/howto-create-service-principal-portal).
The examples also show you how to get the `Azure AD Directory (tenant) ID`, `Application ID`, and `Application secret`. You may need to add the new Azure AD application as a principal in the database. For more information, see [Manage Azure Data Explorer database permissions](manage-database-permissions.md).

The following code snippets use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an Azure Active Directory application token to access the Azure Management plane or your cluster. For these flows to succeed, the application must be registered with Azure AD and you must have the credentials for application authentication, such as an Azure AD-issued application key or an Azure AD-registered X.509v2 certificate.

## Alter database retention policy
Sets a retention policy with a 10-day soft-delete period.
    
```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Application ID
var clientSecret = "PlaceholderClientSecret";           // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
   
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
    .WithClientSecret(clientSecret)                     // can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();
// Define scopes for accessing Azure management plane
string[] scopes = new string[] { "https://management.core.windows.net/.default" };

// Acquire application token
AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;
var credentials = new TokenCredentials(result.AccessToken, result.TokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
await kustoManagementClient.Databases.UpdateAsync(resourceGroupName, clusterName, databaseName, new DatabaseUpdate(softDeletePeriod: TimeSpan.FromDays(10)));
```

## Alter database cache policy
Sets a cache policy for the database. The previous five days of data will be on the cluster SSD.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Application ID
var clientSecret = "PlaceholderClientSecret";           // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
   
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
    .WithClientSecret(clientSecret)                     // can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();
// Define scopes for accessing Azure management plane
string[] scopes = new string[] { "https://management.core.windows.net/.default" };

// Acquire application token
AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;
var credentials = new TokenCredentials(result.AccessToken, result.TokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
await kustoManagementClient.Databases.UpdateAsync(resourceGroupName, clusterName, databaseName, new DatabaseUpdate(hotCachePeriod: TimeSpan.FromDays(5)));
```

## Alter table cache policy
Sets a cache policy for the table. This snippet configures the hot cache of the cluster (local SSDs) to hold the most recent five days worth of data.

```csharp
var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";
var databaseName = "<DatabaseName>";
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Application ID
var clientSecret = "PlaceholderClientSecret";           // Application secret
var tableName = "<TableName>";

var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationKeyAuthentication(clientId, clientSecret, tenantId);

using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var hotSpan = TimeSpan.FromDays(5);
    var command = CslCommandGenerator.GenerateAlterTableCachingPolicyCommand(
                    tableName: tableName,
                    hotSpan: hotSpan);

    kustoClient.ExecuteControlCommand(database: databaseName, command: command);
}
```

## Add a new principal for the database
Adds a new Azure AD application as admin principal for the database.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Application ID
var clientSecret = "PlaceholderClientSecret";           // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
   
var clientIdToAdd = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");

// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
    .WithClientSecret(clientSecret)                     // can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();
// Define scopes for accessing Azure management plane
string[] scopes = new string[] { "https://management.core.windows.net/.default" };

// Acquire application token
AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;
var credentials = new TokenCredentials(result.AccessToken, result.TokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
await kustoManagementClient.Databases.AddPrincipalsAsync(resourceGroupName, clusterName, databaseName,
                new DatabasePrincipalListRequest()
                {
                    Value = new List<DatabasePrincipal>()
                    {
                        new DatabasePrincipal("Admin", "<database_principle_name>", "App", appId: clientIdToAdd, tenantName:tenantId)
                    }
                });
```
## Next steps

* [Read more about database and table policies](./kusto/management/index.md)
