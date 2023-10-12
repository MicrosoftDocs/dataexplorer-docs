---
title: 'End-to-end blob ingestion into Azure Data Explorer'
description: In this article, you learn how to ingest blobs into Azure Data Explorer with an end-to-end example.
ms.reviewer: lugoldbe
ms.topic: tutorial
ms.custom: devx-track-arm-template
ms.date: 05/10/2023
---

# End-to-end blob ingestion into Azure Data Explorer

Azure Data Explorer is a fast and scalable data exploration service for log and telemetry data. This article gives you an end-to-end example of how to ingest data from Azure Blob storage into Azure Data Explorer.

You'll learn how to programmatically create a resource group, a storage account and container, an event hub, and an Azure Data Explorer cluster and database. You'll also learn how to programmatically configure Azure Data Explorer to ingest data from the new storage account.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/end-to-end-blob-ingestion).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

## Install packages

This article contains examples in C# and Python. Choose the tab for your preferred language, and install the required packages.

### [C#](#tab/csharp)

* Install [Azure.ResourceManager.Kusto](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install [Azure.ResourceManager.EventGrid](https://www.nuget.org/packages/Azure.ResourceManager.EventGrid/).
* Install [Azure.Storage.Blobs](https://www.nuget.org/packages/Azure.Storage.Blobs/).
* Install [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) for authentication.

### [Python](#tab/python)

To install the required Python packages, open a command prompt that has Python in its path. Run these commands:

```
pip install azure-common
pip install azure-mgmt-resource
pip install azure-mgmt-kusto
pip install azure-mgmt-eventgrid
pip install azure-kusto-data
pip install azure-storage-blob
```

---

## Azure Resource Manager template

In this article, you use an Azure Resource Manager (ARM) template to create a resource group, a storage account and container, an event hub, and an Azure Data Explorer cluster and database. Save the following content in a file with the name `template.json`. You'll use this file to run the code example.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "eventHubNamespaceName": {
            "type": "string",
            "metadata": {
                "description": "Specifies a the event hub Namespace name."
            }
        },
        "eventHubName": {
            "type": "string",
            "metadata": {
                "description": "Specifies a event hub name."
            }
        },
        "storageAccountType": {
            "type": "string",
            "defaultValue": "Standard_LRS",
            "allowedValues": ["Standard_LRS", "Standard_GRS", "Standard_ZRS", "Premium_LRS"],
            "metadata": {
                "description": "Storage Account type"
            }
        },
        "storageAccountName": {
            "type": "string",
            "defaultValue": "[concat('storage', uniqueString(resourceGroup().id))]",
            "metadata": {
                "description": "Name of the storage account to create"
            }
        },
        "containerName": {
            "type": "string",
            "defaultValue": "[concat('storagecontainer', uniqueString(resourceGroup().id))]",
            "metadata": {
                "description": "Name of the container in storage account to create"
            }
        },
        "eventHubSku": {
            "type": "string",
            "allowedValues": ["Basic", "Standard"],
            "defaultValue": "Standard",
            "metadata": {
                "description": "Specifies the messaging tier for service Bus namespace."
            }
        },
        "kustoClusterName": {
            "type": "string",
            "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
            "metadata": {
                "description": "Name of the cluster to create"
            }
        },
        "kustoDatabaseName": {
            "type": "string",
            "defaultValue": "kustodb",
            "metadata": {
                "description": "Name of the database to create"
            }
        },
        "clusterPrincipalAssignmentName": {
            "type": "string",
            "defaultValue": "clusterPrincipalAssignment1",
            "metadata": {
                "description": "Specifies the name of the principal assignment"
            }
        },
        "principalIdForCluster": {
            "type": "string",
            "metadata": {
                "description": "Specifies the principal id. It can be user email, application (client) ID, security group name"
            }
        },
        "roleForClusterPrincipal": {
            "type": "string",
            "defaultValue": "AllDatabasesViewer",
            "metadata": {
                "description": "Specifies the cluster principal role. It can be 'AllDatabasesAdmin',
                'AllDatabasesMonitor' or 'AllDatabasesViewer'"
            }
        },
        "tenantIdForClusterPrincipal": {
            "type": "string",
            "metadata": {
                "description": "Specifies the tenantId of the cluster principal"
            }
        },
        "principalTypeForCluster": {
            "type": "string",
            "defaultValue": "App",
            "metadata": {
                "description": "Specifies the principal type. It can be 'User', 'App', 'Group'"
            }
        },
        "databasePrincipalAssignmentName": {
            "type": "string",
            "defaultValue": "databasePrincipalAssignment1",
            "metadata": {
                "description": "Specifies the name of the principal assignment"
            }
        },
        "principalIdForDatabase": {
            "type": "string",
            "metadata": {
                "description": "Specifies the principal id. It can be user email, application (client) ID, security group name"
            }
        },
        "roleForDatabasePrincipal": {
            "type": "string",
            "defaultValue": "Admin",
            "metadata": {
                "description": "Specifies the database principal role. It can be 'Admin', 'Ingestor', 'Monitor', 'User', 'UnrestrictedViewers', 'Viewer'"
            }
        },
        "tenantIdForDatabasePrincipal": {
            "type": "string",
            "metadata": {
                "description": "Specifies the tenantId of the database principal"
            }
        },
        "principalTypeForDatabase": {
            "type": "string",
            "defaultValue": "App",
            "metadata": {
                "description": "Specifies the principal type. It can be 'User', 'App', 'Group'"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "variables": {
    },
    "resources": [{
            "apiVersion": "2017-04-01",
            "type": "Microsoft.EventHub/namespaces",
            "name": "[parameters('eventHubNamespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "[parameters('eventHubSku')]",
                "tier": "[parameters('eventHubSku')]",
                "capacity": 1
            },
            "properties": {
                "isAutoInflateEnabled": false,
                "maximumThroughputUnits": 0
            }
        }, {
            "apiVersion": "2017-04-01",
            "type": "Microsoft.EventHub/namespaces/eventhubs",
            "name": "[concat(parameters('eventHubNamespaceName'), '/', parameters('eventHubName'))]",
            "location": "[parameters('location')]",
            "dependsOn": ["[resourceId('Microsoft.EventHub/namespaces', parameters('eventHubNamespaceName'))]"],
            "properties": {
                "messageRetentionInDays": 7,
                "partitionCount": 1
            }
        }, {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageAccountName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2018-07-01",
            "sku": {
                "name": "[parameters('storageAccountType')]"
            },
            "kind": "StorageV2",
            "resources": [
                {
                    "name": "[concat('default/', parameters('containerName'))]",
                    "type": "blobServices/containers",
                    "apiVersion": "2018-07-01",
                    "dependsOn": [
                        "[parameters('storageAccountName')]"
                    ],
                    "properties": {
                        "publicAccess": "None"
                    }
                }
            ],
            "properties": {}
        }, {
            "name": "[parameters('kustoClusterName')]",
            "type": "Microsoft.Kusto/clusters",
            "sku": {
                "name": "Standard_E8ads_v5",
                "tier": "Standard",
                "capacity": 2
            },
            "apiVersion": "2019-09-07",
            "location": "[parameters('location')]",
            "tags": {
                "Created By": "GitHub quickstart template"
            }
        }, {
            "name": "[concat(parameters('kustoClusterName'), '/', parameters('kustoDatabaseName'))]",
            "type": "Microsoft.Kusto/clusters/databases",
            "apiVersion": "2019-09-07",
            "location": "[parameters('location')]",
            "dependsOn": ["[resourceId('Microsoft.Kusto/clusters', parameters('kustoClusterName'))]"],
            "properties": {
                "softDeletePeriodInDays": 365,
                "hotCachePeriodInDays": 31
            }
        }, {
            "type": "Microsoft.Kusto/Clusters/principalAssignments",
            "apiVersion": "2019-11-09",
            "name": "[concat(parameters('kustoClusterName'), '/', parameters('clusterPrincipalAssignmentName'))]",
            "dependsOn": ["[resourceId('Microsoft.Kusto/clusters', parameters('kustoClusterName'))]"],
            "properties": {
                "principalId": "[parameters('principalIdForCluster')]",
                "role": "[parameters('roleForClusterPrincipal')]",
                "tenantId": "[parameters('tenantIdForClusterPrincipal')]",
                "principalType": "[parameters('principalTypeForCluster')]"
            }
        }, {
            "type": "Microsoft.Kusto/Clusters/Databases/principalAssignments",
            "apiVersion": "2019-11-09",
            "name": "[concat(parameters('kustoClusterName'), '/', parameters('kustoDatabaseName'), '/', parameters('databasePrincipalAssignmentName'))]",
            "dependsOn": ["[resourceId('Microsoft.Kusto/clusters/databases', parameters('kustoClusterName'), parameters('kustoDatabaseName'))]"],
            "properties": {
                "principalId": "[parameters('principalIdForDatabase')]",
                "role": "[parameters('roleForDatabasePrincipal')]",
                "tenantId": "[parameters('tenantIdForDatabasePrincipal')]",
                "principalType": "[parameters('principalTypeForDatabase')]"
            }
        }
    ]
}

```

## Code example

### [C#](#tab/csharp)

The following code example gives you a step-by-step process that results in data ingestion into Azure Data Explorer.

You first create a resource group. You also create Azure resources such as a storage account and container, an event hub, and an Azure Data Explorer cluster and database, and add principals. You then create an Azure Event Grid subscription, along with a table and column mapping, in the Azure Data Explorer database. Finally, you create the data connection to configure Azure Data Explorer to ingest data from the new storage account.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Application ID
var clientSecret = "PlaceholderClientSecret"; //Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var deploymentName = "e2eexample";
Console.WriteLine("Step 1: Create a new resource group in your Azure subscription to manage all the resources for using Azure Data Explorer.");
var subscriptions = resourceManagementClient.GetSubscriptions();
var subscription = (await subscriptions.GetAsync(subscriptionId)).Value;
var resourceGroups = subscription.GetResourceGroups();
var resourceGroupName = deploymentName + "resourcegroup";
var location = AzureLocation.WestEurope;
var resourceGroupData = new ResourceGroupData(location);
var resourceGroup = (await resourceGroups.CreateOrUpdateAsync(WaitUntil.Completed, resourceGroupName, resourceGroupData)).Value;
Console.WriteLine("Step 2: Create a Blob Storage, a container in the Storage account, an event hub, an Azure Data Explorer cluster, database, and add principals by using an Azure Resource Manager template.");
var deployments = resourceGroup.GetArmDeployments();
var azureResourceTemplatePath = @"xxxxxxxxx\template.json"; //Path to the Azure Resource Manager template JSON from the previous section
var eventHubName = deploymentName + "eventhub";
var eventHubNamespaceName = eventHubName + "ns";
var storageAccountName = deploymentName + "storage";
var storageContainerName = deploymentName + "storagecontainer";
var eventGridSubscriptionName = deploymentName + "eventgrid";
var kustoClusterName = deploymentName + "kustocluster";
var kustoDatabaseName = deploymentName + "kustodatabase";
var kustoTableName = "Events";
var kustoColumnMappingName = "Events_CSV_Mapping";
var kustoDataConnectionName = deploymentName + "kustoeventgridconnection";
var armDeploymentContent = new ArmDeploymentContent(
    new ArmDeploymentProperties(ArmDeploymentMode.Incremental)
    {
        Template = BinaryData.FromString(File.ReadAllText(azureResourceTemplatePath, Encoding.UTF8)),
        Parameters = BinaryData.FromObjectAsJson(
            JsonConvert.SerializeObject(
                new Dictionary<string, Dictionary<string, string>>
                {
                    ["eventHubNamespaceName"] = new(capacity: 1) { { "value", eventHubNamespaceName } },
                    ["eventHubName"] = new(capacity: 1) { { "value", eventHubName } },
                    ["storageAccountName"] = new(capacity: 1) { { "value", storageAccountName } },
                    ["containerName"] = new(capacity: 1) { { "value", storageContainerName } },
                    ["kustoClusterName"] = new(capacity: 1) { { "value", kustoClusterName } },
                    ["kustoDatabaseName"] = new(capacity: 1) { { "value", kustoDatabaseName } },
                    ["principalIdForCluster"] = new(capacity: 1) { { "value", "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx" } }, //Application ID
                    ["roleForClusterPrincipal"] = new(capacity: 1) { { "value", "AllDatabasesAdmin" } },
                    ["tenantIdForClusterPrincipal"] = new(capacity: 1) { { "value", tenantId } },
                    ["principalTypeForCluster"] = new(capacity: 1) { { "value", "App" } },
                    ["principalIdForDatabase"] = new(capacity: 1) { { "value", "xxxxxxxx@xxxxxxxx.com" } }, //User Email
                    ["roleForDatabasePrincipal"] = new(capacity: 1) { { "value", "Admin" } },
                    ["tenantIdForDatabasePrincipal"] = new(capacity: 1) { { "value", tenantId } },
                    ["principalTypeForDatabase"] = new(capacity: 1) { { "value", "User" } }
                }
            )
        )
    }
);
await deployments.CreateOrUpdateAsync(WaitUntil.Completed, deploymentName, armDeploymentContent);
Console.WriteLine("Step 3: Create an Event Grid subscription to publish blob events created in a specific container to an event hub.");
var storageResourceId = new ResourceIdentifier($"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}");
var eventHubResourceId = new ResourceIdentifier($"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventHub/namespaces/{eventHubNamespaceName}/eventhubs/{eventHubName}");
var eventSubscriptions = resourceManagementClient.GetEventSubscriptions(storageResourceId);
var eventSubscriptionData = new EventGridSubscriptionData
{
    Destination = new EventHubEventSubscriptionDestination { ResourceId = eventHubResourceId },
    Filter = new EventSubscriptionFilter
    {
        SubjectBeginsWith = $"/blobServices/default/containers/{storageContainerName}",
    }
};
eventSubscriptionData.Filter.IncludedEventTypes.Add(BlobStorageEventType.MicrosoftStorageBlobCreated.ToString());
await eventSubscriptions.CreateOrUpdateAsync(WaitUntil.Completed, eventGridSubscriptionName, eventSubscriptionData);
Console.WriteLine("Step 4: Create a table (with three columns: EventTime, EventId, and EventSummary) and column mapping in your Azure Data Explorer database.");
var kustoUri = $"https://{kustoClusterName}.{location}.kusto.windows.net";
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
{
    InitialCatalog = kustoDatabaseName,
    FederatedSecurity = true,
    ApplicationClientId = clientId,
    ApplicationKey = clientSecret,
    Authority = tenantId
};
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    kustoClient.ExecuteControlCommand(
        CslCommandGenerator.GenerateTableCreateCommand(
            kustoTableName,
            new[]
            {
                Tuple.Create("EventTime", "System.DateTime"),
                Tuple.Create("EventId", "System.Int32"),
                Tuple.Create("EventSummary", "System.String"),
            }
        )
    );
    kustoClient.ExecuteControlCommand(
        CslCommandGenerator.GenerateTableMappingCreateCommand(
            IngestionMappingKind.Csv,
            kustoTableName,
            kustoColumnMappingName,
            new ColumnMapping[]
            {
                new() { ColumnName = "EventTime", ColumnType = "dateTime", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "0" } } },
                new() { ColumnName = "EventId", ColumnType = "int", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "1" } } },
                new() { ColumnName = "EventSummary", ColumnType = "string", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "2" } } },
            }
        )
    );
}
Console.WriteLine("Step 5: Add an Event Grid data connection. Azure Data Explorer will automatically ingest the data when new blobs are created.");
var cluster = (await resourceGroup.GetKustoClusterAsync(kustoClusterName)).Value;
var database = (await cluster.GetKustoDatabaseAsync(kustoDatabaseName)).Value;
var dataConnections = database.GetKustoDataConnections();
var eventGridDataConnectionData = new KustoEventGridDataConnection
{
    StorageAccountResourceId = storageResourceId,
    EventGridResourceId = eventHubResourceId,
    ConsumerGroup = "$Default",
    Location = location,
    TableName = kustoTableName,
    MappingRuleName = kustoColumnMappingName,
    DataFormat = KustoEventGridDataFormat.Csv
};
await dataConnections.CreateOrUpdateAsync(WaitUntil.Completed, kustoDataConnectionName, eventGridDataConnectionData);
```

| **Setting** | **Field description** |
|---|---|---|
| tenantId | Your tenant ID. It's also known as a directory ID.|
| subscriptionId | The subscription ID that you use for resource creation.|
| clientId | The client ID of the application that can access resources in your tenant.|
| clientSecret | The client secret of the application that can access resources in your tenant. |

### [Python](#tab/python)

The following code example gives you a step-by-step process that results in data ingestion into Azure Data Explorer.

You first create a resource group. You also create Azure resources such as a storage account and container, an event hub, and an Azure Data Explorer cluster and database, and add principals. You then create an Azure Event Grid subscription, along with a table and column mapping, in the Azure Data Explorer database. Finally, you create the data connection to configure Azure Data Explorer to ingest data from the new storage account.

```python
from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode
import os.path
import json
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
from azure.mgmt.eventgrid import EventGridManagementClient
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import EventGridDataConnection

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
location = "West Europe"
location_small_case = "westeurope"
#Path to the Azure Resource Manager template JSON from the previous section
azure_resource_template_path = "xxxxxxxxx/template.json";

deployment_name = 'e2eexample'
resource_group_name = deployment_name + "resourcegroup"
event_hub_name = deployment_name + "eventhub"
event_hub_namespace_name = event_hub_name + "ns"
storage_account_name = deployment_name + "storage"
storage_container_name = deployment_name + "storagecontainer"
event_grid_subscription_name = deployment_name + "eventgrid"
kusto_cluster_name = deployment_name + "kustocluster"
kusto_database_name = deployment_name + "kustodatabase"
kusto_table_name = "Events"
kusto_column_mapping_name = "Events_CSV_Mapping"
kusto_data_connection_name = deployment_name + "kustoeventgridconnection"

#principals
principal_id_for_cluster = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
role_for_cluster_principal = "AllDatabasesAdmin";
tenant_id_for_cluster_principal = tenant_id;
principal_type_for_cluster = "App";
principal_id_for_database = "xxxxxxxx@xxxxxxxx.com";//User Email
role_for_database_principal = "Admin";
tenant_id_for_database_principal = tenant_id;
principal_type_for_database = "User";


credentials = ServicePrincipalCredentials(
    client_id=client_id,
    secret=client_secret,
    tenant=tenant_id
)
resource_client = ResourceManagementClient(credentials, subscription_id)

print('Step 1: Create a new resource group in your Azure subscription to manage all the resources for using Azure Data Explorer.')
resource_client.resource_groups.create_or_update(
    resource_group_name,
    {
        'location': location_small_case
    }
)

print('Step 2: Create a Blob Storage, a container in the Storage account, an event hub, an Azure Data Explorer cluster, database, and add principals by using an Azure Resource Manager template.')
#Read the Azure Resource Manager template
with open(azure_resource_template_path, 'r') as template_file_fd:
    template = json.load(template_file_fd)

parameters = {
    'eventHubNamespaceName': event_hub_namespace_name,
    'eventHubName': event_hub_name,
    'storageAccountName': storage_account_name,
    'containerName': storage_container_name,
    'kustoClusterName': kusto_cluster_name,
    'kustoDatabaseName': kusto_database_name,
    'principalIdForCluster': principal_id_for_cluster,
    'roleForClusterPrincipal': role_for_cluster_principal,
    'tenantIdForClusterPrincipal': tenant_id_for_cluster_principal,
    'principalTypeForCluster': principal_type_for_cluster,
    'principalIdForDatabase': principal_id_for_database,
    'roleForDatabasePrincipal': role_for_database_principal,
    'tenantIdForDatabasePrincipal': tenant_id_for_database_principal,
    'principalTypeForDatabase': principal_type_for_database
}
parameters = {k: {'value': v} for k, v in parameters.items()}
deployment_properties = {
    'mode': DeploymentMode.incremental,
    'template': template,
    'parameters': parameters
}

#Returns an instance of LROPoller; see https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = resource_client.deployments.create_or_update(
    resource_group_name,
    deployment_name,
    deployment_properties
)
poller.wait()

print('Step 3: Create an Event Grid subscription to publish blob events created in a specific container to an event hub.')
event_client = EventGridManagementClient(credentials, subscription_id)
storage_resource_id = '/subscriptions/{}/resourceGroups/{}/providers/Microsoft.Storage/storageAccounts/{}'.format(subscription_id, resource_group_name, storage_account_name)
event_hub_resource_id = '/subscriptions/{}/resourceGroups/{}/providers/Microsoft.EventHub/namespaces/{}/eventhubs/{}'.format(subscription_id, resource_group_name, event_hub_namespace_name, event_hub_name)
event_client.event_subscriptions.create_or_update(storage_resource_id, event_grid_subscription_name, {
    'destination': {
        'endpointType': 'EventHub',
        'properties': {
            'resourceId': event_hub_resource_id
        }
    },
    "filter": {
        "subjectBeginsWith": "/blobServices/default/containers/{}".format(storage_container_name),
        "includedEventTypes": ["Microsoft.Storage.BlobCreated"],
        "advancedFilters": []
    }
})


print('Step 4: Create a table (with three columns: EventTime, EventId, and EventSummary) and column mapping in your Azure Data Explorer database.')
kusto_uri = "https://{}.{}.kusto.windows.net".format(kusto_cluster_name, location_small_case)
database_name = kusto_database_name
kusto_connection_string_builder = KustoConnectionStringBuilder.with_aad_application_key_authentication(connection_string=kusto_uri, aad_app_id=client_id, app_key=client_secret, authority_id=tenant_id)
kusto_client = KustoClient(kusto_connection_string_builder)
create_table_command = ".create table " + kusto_table_name + " (EventTime: datetime, EventId: int, EventSummary: string)"
kusto_client.execute_mgmt(database_name, create_table_command)

create_column_mapping_command = ".create table " + kusto_table_name + " ingestion csv mapping '" + kusto_column_mapping_name \
                                + """' '[{"Name":"EventTime","datatype":"datetime","Ordinal":0},{"Name":"EventId","datatype":"int","Ordinal":1},{"Name":"EventSummary","datatype":"string","Ordinal":2}]'"""
kusto_client.execute_mgmt(database_name, create_column_mapping_command)


print('Step 5: Add an Event Grid data connection. Azure Data Explorer will automatically ingest the data when new blobs are created.')
kusto_management_client = KustoManagementClient(credentials, subscription_id)
data_connections = kusto_management_client.data_connections
#Returns an instance of LROPoller; see https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name,
                                           parameters=EventGridDataConnection(storage_account_resource_id=storage_resource_id,
                                                                              event_hub_resource_id=event_hub_resource_id, consumer_group="$Default", location=location, table_name=kusto_table_name, mapping_rule_name=kusto_column_mapping_name, data_format="csv"))
poller.wait()
```

|**Setting** | **Field description**|
|---|---|---|
| tenant_id | Your tenant ID. It's also known as a directory ID.|
| subscription_id | The subscription ID that you use for resource creation.|
| client_id | The client ID of the application that can access resources in your tenant.|
| client_secret | The client secret of the application that can access resources in your tenant. |

---

## Test the code example

### [C#](#tab/csharp)

1. Upload a file into the storage account.

    ```csharp
    var container = new BlobContainerClient(
        "DefaultEndpointsProtocol=https;AccountName=xxxxxxxxxxxxxx;AccountKey=xxxxxxxxxxxxxx;EndpointSuffix=core.windows.net",
        storageContainerName
    );
    var blobContent = "2007-01-01 00:00:00.0000000,2592,Several trees down\n2007-01-01 00:00:00.0000000,4171,Winter Storm";
    await container.UploadBlobAsync("test.csv", BinaryData.FromString(blobContent));
    ```

    |**Setting** | **Field description**|
    |---|---|---|
    | storageConnectionString | The connection string of the programmatically created storage account.|

2. Run a test query in Azure Data Explorer.

    ```csharp
    var kustoUri = $"https://{kustoClusterName}.{locationSmallCase}.kusto.windows.net";
    var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    {
        InitialCatalog = kustoDatabaseName,
        FederatedSecurity = true,
        ApplicationClientId = clientId,
        ApplicationKey = clientSecret,
        Authority = tenantId
    };
    using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kustoConnectionStringBuilder))
    {
        var query = $"{kustoTableName} | take 10";
        
        using var reader = kustoClient.ExecuteQuery(query) as DataTableReader2;
        // Print the contents of each of the result sets. 
        while (reader != null && reader.Read())
        {
            Console.WriteLine($"{reader[0]}, {reader[1]}, {reader[2]}");
        }
    }
    ```

### [Python](#tab/python)

1. Upload a file into the storage account.

    ```python
    account_key = "xxxxxxxxxxxxxx"
    block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=account_key)
    blob_name = "test.csv"
    blob_content = """2007-01-01 00:00:00.0000000,2592,Several trees down
    2007-01-01 00:00:00.0000000,4171,Winter Storm"""
    block_blob_service.create_blob_from_text(container_name=storage_container_name, blob_name=blob_name, text=blob_content)
    ```

    |**Setting** | **Field description**|
    |---|---|---|
    | account_key | The access key of the programmatically created storage account.|

2. Run a test query in Azure Data Explorer.

    ```python
    kusto_uri = "https://{}.{}.kusto.windows.net".format(kusto_cluster_name, location_small_case)
    kusto_connection_string_builder = KustoConnectionStringBuilder.with_aad_application_key_authentication(connection_string=kusto_uri, aad_app_id=client_id, app_key=client_secret, authority_id=tenant_id)
    kusto_client = KustoClient(kusto_connection_string_builder)
    query = "{} | take 10".format(kusto_table_name)
    response = kusto_client.execute_query(kusto_database_name, query)
    print(response.primary_results[0].rows_count)
    ```

---

## Next steps

* To learn other methods to create a cluster, see [Create an Azure Data Explorer cluster and database](create-cluster-database-csharp.md).
* To learn more about ingestion methods, see [Azure Data Explorer data ingestion](ingest-data-overview.md).
* [Learn common operators](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) of Kusto Query Language (KQL).
