---
title: 'Create an Event Hub data connection for Azure Data Explorer by using C#'
description: In this article, you learn how to create an Event Hub data connection for Azure Data Explorer by using C#.
author: orspod
ms.author: orspodek
ms.reviewer: lugoldbe
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/07/2019
---

# Create an Event Hub data connection for Azure Data Explorer by using C#

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-hub.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)
> * [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]
In this article, you create an Event Hub data connection for Azure Data Explorer by using C#.

## Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.
* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [a cluster and database](create-cluster-database-csharp.md)
* Create [table and column mapping](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster)
* Set [database and table policies](database-table-policies-csharp.md) (optional)
* Create an [Event Hub with data for ingestion](ingest-data-event-hub.md#create-an-event-hub). 

[!INCLUDE [data-explorer-data-connection-install-nuget-csharp](includes/data-explorer-data-connection-install-nuget-csharp.md)]

[!INCLUDE [data-explorer-authentication](includes/data-explorer-authentication.md)]

## Add an Event Hub data connection

The following example shows you how to add an Event Hub data connection programmatically. See [connect to the event hub](ingest-data-event-hub.md#connect-to-the-event-hub) for adding an Event Hub data connection using the Azure portal.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
var credential = new ClientCredential(clientId, clientSecret);
var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
var dataConnectionName = "myeventhubconnect";
//The event hub that is created as part of the Prerequisites
var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
var consumerGroup = "$Default";
var location = "Central US";
//The table and column mapping are created as part of the Prerequisites
var tableName = "StormEvents";
var mappingRuleName = "StormEvents_CSV_Mapping";
var dataFormat = DataFormat.CSV;
await kustoManagementClient.DataConnections.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, dataConnectionName, 
    new EventHubDataConnection(eventHubResourceId, consumerGroup, location: location, tableName: tableName, mappingRuleName: mappingRuleName, dataFormat: dataFormat, compression:compression));
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant.|
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| databaseName | *mykustodatabase* | The name of the target database in your cluster.|
| dataConnectionName | *myeventhubconnect* | The desired name of your data connection.|
| tableName | *StormEvents* | The name of the target table in the target database.|
| mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
| dataFormat | *csv* | The data format of the message.|
| eventHubResourceId | *Resource ID* | The resource ID of your Event Hub that holds the data for ingestion. |
| consumerGroup | *$Default* | The consumer group of your Event Hub.|
| location | *Central US* | The location of the data connection resource.|
| compression | *Gzip* or *None* | The type of data compression. |

## Generate data

See the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an event hub.

An event can contain one or more records, up to its size limit. In the following sample we send two events, each has five records appended:

```csharp
var events = new List<EventData>();
var data = string.Empty;
var recordsPerEvent = 5;
var rand = new Random();
var counter = 0;

for (var i = 0; i < 10; i++)
{
    // Create the data
    var metric = new Metric { Timestamp = DateTime.UtcNow, MetricName = "Temperature", Value = rand.Next(-30, 50) }; 
    var data += JsonConvert.SerializeObject(metric) + Environment.NewLine;
    counter++;

    // Create the event
    if (counter == recordsPerEvent)
    {
        var eventData = new EventData(Encoding.UTF8.GetBytes(data));
        events.Add(eventData);

        counter = 0;
        data = string.Empty;
    }
}

// Send events
eventHubClient.SendAsync(events).Wait();
```

[!INCLUDE [data-explorer-data-connection-clean-resources-csharp](includes/data-explorer-data-connection-clean-resources-csharp.md)]