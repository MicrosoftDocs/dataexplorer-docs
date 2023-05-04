---
title: 'Create policies by using the Azure Data Explorer'
description: This article describes how to programmatically create Azure Data Explorer policies.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/04/2023
---

# Create database and table policies for Azure Data Explorer

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you'll create database and table policies for Azure Data Explorer by using C# or Python.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* [A test table](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).

## Install packages

### [C#](#tab/csharp)

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install the [Microsoft.Azure.Kusto.Data NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/). (Optional, for changing table policies)
* Install the [MSAL NuGet package](https://www.nuget.org/packages/Microsoft.Identity.Client/) for authentication with Azure Active Directory (Azure AD).

### [Python](#tab/python)

```
pip install azure-common
pip install azure-mgmt-kusto
pip install azure-kusto-data (Optional, for changing table's policies)
```

## Authentication

To run the examples in this article, you need an Azure AD application and service principal that can access resources. If necessary, [create an Azure AD application](/azure/active-directory/develop/howto-create-service-principal-portal) and grant it appropriate role assignments on the subscription. Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

You may need to add the new Azure AD application as a principal in the database. For more information, see [Manage Azure Data Explorer database permissions](manage-database-permissions.md).

## Alter database retention policy

### [C#](#tab/csharp)

The following example sets a retention policy with a 10-day soft-delete period.
    
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

### [Python](#tab/python)

The following example a retention policy with a 10 day soft-delete period.

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabaseUpdate
from azure.common.credentials import ServicePrincipalCredentials
import datetime

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mykustocluster";
database_name = "mykustodatabase";

#Returns an instance of LROPoller, see https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kustoManagementClient.databases.update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                                           parameters=DatabaseUpdate(soft_delete_period=datetime.timedelta(days=10)))
```

---

## Alter database cache policy

### [C#](#tab/csharp)

The following example sets a cache policy for the database. The previous five days of data will be on the cluster SSD.

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

### [Python](#tab/python)

The following example sets a cache policy for the database that the last five days of data will be on the cluster SSD.

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabaseUpdate
from azure.common.credentials import ServicePrincipalCredentials
import datetime

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mykustocluster";
database_name = "mykustodatabase";

#Returns an instance of LROPoller, see https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kustoManagementClient.databases.update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                                           parameters=DatabaseUpdate(hot_cache_period=datetime.timedelta(days=5)))
```

---

## Alter table cache policy

### [C#](#tab/csharp)

The following example sets a cache policy for the table. This snippet configures the hot cache of the cluster (local SSDs) to hold the most recent five days worth of data.

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

### [Python](#tab/python)

The following example sets a cache policy for the table that the last five days of data will be on the cluster SSD.

```python
from azure.kusto.data.request import KustoClient, KustoConnectionStringBuilder
kusto_uri = "https://<ClusterName>.<Region>.kusto.windows.net"
database_name = "<DatabaseName>"
#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
#Application ID
client_id_to_add = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

kusto_connection_string_builder = KustoConnectionStringBuilder.with_aad_application_key_authentication(connection_string=kusto_uri, aad_app_id=client_id, app_key=client_secret, authority_id=tenant_id)

#The table that is created as part of the Prerequisites
table_name = "<TableName>"
caching_policy = r'hot = 5d'
command = '.alter table {} policy caching '.format(table_name) +  caching_policy
kusto_client.execute_mgmt(database_name, command)
```

---

## Add a new principal for the database

### [C#](#tab/csharp)

The following example adds a new Azure AD application as admin principal for the database.

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

### [Python](#tab/python)

The following example adds a new Azure AD application as admin principal for the database

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabasePrincipal
from azure.common.credentials import ServicePrincipalCredentials

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
#Application ID
client_id_to_add = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mykustocluster";
database_name = "mykustodatabase";
role = "Admin"
principle_name = "<database_principle_name>";
type_name = "App"
kustoManagementClient.databases.add_principals(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                         value=[DatabasePrincipal(role=role, name=principle_name, type=type_name, app_id=client_id_to_add, tenant_name=tenant_id)])
```

---

## Next steps

* [Read more about database and table policies](./kusto/management/index.md)
