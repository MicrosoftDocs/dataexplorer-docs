---
title: 'Create policies by using the Azure Data Explorer'
description: This article describes how to programmatically create Azure Data Explorer policies.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/04/2023
---

# Create database and table policies for Azure Data Explorer

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you'll create database and table policies for Azure Data Explorer by using C# or Python.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/database-table-policies).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [A test table](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).

## Install packages

### [C#](#tab/csharp)

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install the [MSAL NuGet package](https://www.nuget.org/packages/Azure.Identity/) for authentication with Microsoft Entra ID.

### [Python](#tab/python)

```
pip install azure-common
pip install azure-mgmt-kusto
pip install azure-kusto-data (Optional, for changing table's policies)
```

---

## Authentication

To run the examples in this article, you need a Microsoft Entra application and service principal that can access resources. If necessary, [create a Microsoft Entra application](/azure/active-directory/develop/howto-create-service-principal-portal) and grant it appropriate role assignments on the subscription. Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

You may need to add the new Microsoft Entra application as a principal in the database. For more information, see [Manage Azure Data Explorer database permissions](manage-database-permissions.md).

## Alter database retention policy

### [C#](#tab/csharp)

The following example sets a retention policy with a 10-day soft-delete period.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
var clientSecret = "PlaceholderClientSecret"; // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
var database = (await cluster.GetKustoDatabaseAsync(databaseName)).Value;
var databasePatch = new KustoReadWriteDatabase { SoftDeletePeriod = TimeSpan.FromDays(10) };
await database.UpdateAsync(WaitUntil.Completed, databasePatch);
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
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
var clientSecret = "PlaceholderClientSecret"; // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
var database = (await cluster.GetKustoDatabaseAsync(databaseName)).Value;
var databasePatch = new KustoReadWriteDatabase { HotCachePeriod = TimeSpan.FromDays(5) };
await database.UpdateAsync(WaitUntil.Completed, databasePatch);
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

The following example sets a cache policy for the table using [Kusto Data SDK](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data). This snippet configures the hot cache of the cluster (local SSDs) to hold the most recent five days worth of data.

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net/";
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
var clientSecret = "PlaceholderClientSecret"; // Application secret
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationKeyAuthentication(clientId, clientSecret, tenantId);
using var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder);
var command = CslCommandGenerator.GenerateAlterTableCachingPolicyCommand(
    "<tableName>", hotSpan: TimeSpan.FromDays(5)
);
await kustoClient.ExecuteControlCommandAsync("<databaseName>", command);
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

The following example adds a new Microsoft Entra application as admin principal for the database.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Azure AD Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
var clientSecret = "PlaceholderClientSecret"; // Application secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var resourceGroupName = "testrg";
// The cluster and database that are created as part of the prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
var database = (await cluster.GetKustoDatabaseAsync(databaseName)).Value;
var databasePrincipalList = new DatabasePrincipalList();
databasePrincipalList.Value.Add(
    new KustoDatabasePrincipal(
        KustoDatabasePrincipalRole.Admin, "<databasePrincipleName>", KustoDatabasePrincipalType.App
    ) { AppId = clientId }
);
database.AddPrincipals(databasePrincipalList);
```

### [Python](#tab/python)

The following example adds a new Microsoft Entra application as admin principal for the database

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
