---
title: "Create an Event Hubs data connection for Azure Data Explorer by using Python"
description: In this article, you learn how to create an Event Hubs data connection for Azure Data Explorer by using Python.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 09/12/2022
---

# Create an Event Hubs data connection for Azure Data Explorer by using Python

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-hub.md)
> * [Ingestion wizard](./event-hub-wizard.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)
> * [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]
In this article, you create an Event Hubs data connection for Azure Data Explorer by using Python.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* [Python 3.4+](https://www.python.org/downloads/).
* A [table and column mapping](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).
* An [event hub](ingest-data-event-hub.md#create-an-event-hub) with data for ingestion.

[!INCLUDE [data-explorer-data-connection-install-package-python](includes/data-explorer-data-connection-install-package-python.md)]

[!INCLUDE [data-explorer-authentication](includes/data-explorer-authentication.md)]

## Add an Event Hubs data connection

The following example shows you how to add an Event Hubs data connection programmatically. See [connect to the event hub](ingest-data-event-hub.md#connect-to-the-event-hub) for adding an Event Hubs data connection using the Azure portal.

```Python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import EventHubDataConnection
from azure.identity import ClientSecretCredential

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

resource_group_name = "myresourcegroup"
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mycluster"
database_name = "mydatabase"
data_connection_name = "myeventhubconnect"
#The event hub that is created as part of the Prerequisites
event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhubnamespace/eventhubs/myeventhub"";
consumer_group = "$Default"
location = "Central US"
#The table and column mapping that are created as part of the Prerequisites
table_name = "mytable"
mapping_rule_name = "mytablemappingrule"
data_format = "csv"
database_routing = "Multi"
#Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kusto_management_client.data_connections.create_or_update(
            resource_group_name=resource_group_name,
            cluster_name=cluster_name,
            database_name=database_name,
            data_connection_name=data_connection_name,
            parameters=EventHubDataConnection(
                event_hub_resource_id=event_hub_resource_id,
                consumer_group=consumer_group,
                location=location,
                table_name=table_name,
                mapping_rule_name=mapping_rule_name,
                data_format=data_format,
                database_routing=database_routing
            )
        )
poller.wait()
print(poller.result())
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resource_group_name | *myresourcegroup* | The name of the resource group containing your cluster.|
| cluster_name | *mycluster* | The name of your cluster.|
| database_name | *mydatabase* | The name of the target database in your cluster.|
| data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
| table_name | *mytable* | The name of the target table in the target database.|
| mapping_rule_name | *mytablemappingrule* | The name of your column mapping related to the target table.|
| data_format | *csv* | The data format of the message.|
| event_hub_resource_id | *Resource ID* | The resource ID of your event hub that holds the data for ingestion. |
| consumer_group | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|
| databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-hub-overview.md#events-routing). |

[!INCLUDE [event-hub-connection-caution](includes/event-hub-connection-caution.md)]

[!INCLUDE [data-explorer-data-connection-clean-resources-python](includes/data-explorer-data-connection-clean-resources-python.md)]