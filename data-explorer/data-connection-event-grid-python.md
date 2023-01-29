---
title: 'Create an Event Grid data connection for Azure Data Explorer by using Python'
description: In this article, you learn how to create an Event Grid data connection for Azure Data Explorer by using Python.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 07/31/2022
---

# Create an Event Grid data connection for Azure Data Explorer by using Python

> [!div class="op_single_selector"]
> * [Ingestion wizard](./ingestion-wizard-new-table.md)
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]
In this article, you create an Event Grid data connection for Azure Data Explorer by using Python.

For the Microsoft Azure Kusto Management Client Library, see [Microsoft Azure SDK for python](https://github.com/Azure/azure-sdk-for-python/tree/c8291ac6cb0dbd865da03a88dd2bcb9279e2c4a6/sdk/kusto/azure-mgmt-kusto).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* [Python 3.4+](https://www.python.org/downloads/).
* A A [table and column mapping](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).
* A [storage account with an Event Grid subscription](ingest-data-event-grid.md).

> [!NOTE]
> You must have at least [Reader and Data Access](/azure/role-based-access-control/built-in-roles#reader-and-data-access) role-based authorization on the storage account to set up the Event Grid connection.

[!INCLUDE [data-explorer-data-connection-install-package-python](includes/data-explorer-data-connection-install-package-python.md)]

[!INCLUDE [data-explorer-authentication](includes/data-explorer-authentication.md)]

## Add an Event Grid data connection

The following example shows you how to add an Event Grid data connection programmatically. See [create an Event Grid data connection in Azure Data Explorer](ingest-data-event-grid.md) for adding an Event Grid data connection using the Azure portal.

```Python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import EventGridDataConnection
from azure.common.credentials import ServicePrincipalCredentials

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

resource_group_name = "testrg"
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mykustocluster"
database_name = "mykustodatabase"
data_connection_name = "myeventhubconnect"
#The event hub and storage account that are created as part of the Prerequisites
event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx"
storage_account_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx"
consumer_group = "$Default"
location = "Central US"
#The table and column mapping that are created as part of the Prerequisites
table_name = "StormEvents"
mapping_rule_name = "StormEvents_CSV_Mapping"
data_format = "csv"
database_routing = "Multi"
blob_storage_event_type = "Microsoft.Storage.BlobCreated"

#Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kusto_management_client.data_connections.begin_create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                            parameters=EventGridDataConnection(storage_account_resource_id=storage_account_resource_id, event_hub_resource_id=event_hub_resource_id, 
                                                                                consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format, database_routing=database_routing,
                                                                                blob_storage_event_type=blob_storage_event_type))
# The creation of the connection is async. Validation errors are only visible if you wait for the results.
poller.wait()
print(poller.result())
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscription_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resource_group_name | *testrg* | The name of the resource group containing your cluster.|
| cluster_name | *mykustocluster* | The name of your cluster.|
| database_name | *mykustodatabase* | The name of the target database in your cluster.|
| data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
| table_name | *StormEvents* | The name of the target table in the target database.|
| mapping_rule_name | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
| database_routing | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-grid-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
| data_format | *csv* | The data format of the message.|
| event_hub_resource_id | *Resource ID* | The resource ID of your event hub where the Event Grid is configured to send events. |
| storage_account_resource_id | *Resource ID* | The resource ID of your storage account that holds the data for ingestion. |
| consumer_group | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|
| blob_storage_event_type | *Microsoft.Storage.BlobCreated* | The type of event that triggers ingestion. Supported events are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. Blob renaming is supported only for ADLSv2 storage.|

[!INCLUDE [data-explorer-data-connection-clean-resources-python](includes/data-explorer-data-connection-clean-resources-python.md)]