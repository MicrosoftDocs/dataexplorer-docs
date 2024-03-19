---
title: 'Create an Event Hubs data connection - Azure Data Explorer'
description: Learn how to ingest data from Event Hubs into Azure Data Explorer.
ms.topic: how-to
ms.custom:
ms.date: 11/16/2023
---

# Create an Event Hubs data connection for Azure Data Explorer

Azure Data Explorer offers ingestion from [Event Hubs](/azure/event-hubs/event-hubs-about), a big data streaming platform and event ingestion service. Event Hubs can process millions of events per second in near real time.

In this article, you connect to an event hub and ingest data into Azure Data Explorer. For an overview on ingesting from Event Hubs, see [Azure Event Hubs data connection](ingest-data-event-hub-overview.md).

To learn how to create the connection using the Kusto SDKs, see [Create an Event Hubs data connection with SDKs](create-event-hubs-connection-sdk.md).

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/create-event-hubs-connection).

## Create an event hub data connection

In this section, you establish a connection between the event hub and your Azure Data Explorer table. As long as this connection is in place, data is transmitted from the event hub into your target table. If the event hub is moved to a different resource or subscription, you need to update or recreate the connection.

### [Get data](#tab/get-data)

### Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Streaming ingestion must be [configured on your Azure Data Explorer cluster](ingest-data-streaming.md).

### Get data

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Get data**.

    :::image type="content" source="media/get-data-event-hubs/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-event-hubs/get-data.png":::

### Source

In the **Get data** window, the **Source** tab is selected.

Select the data source from the available list. In this example, you're ingesting data from **Event Hubs**.

:::image type="content" source="media/get-data-file/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-file/select-data-source.png":::

### Configure

1. Select a target database and table. If you want to ingest data into a new table, select **+ New table** and enter a table name.

    > [!NOTE]
    > Table names can be up to 1024 characters including spaces, alphanumeric, hyphens, and underscores. Special characters aren't supported.

    :::image type="content" source="media/get-data-event-hubs/configure-tab.png" alt-text="Screenshot of configure tab with fields for configuring the data source of Event Hubs in Azure Data Explorer." lightbox="media/get-data-event-hubs/configure-tab.png":::

1. Fill in the following fields:

    | **Setting**                | **Field description**  |
    |--------------------------|----------|
    | Subscription               | The subscription ID where the event hub resource is located.     |
    | Event hub namespace        | The name that identifies your namespace.    |
    | Event hub                  | The event hub you wish to   |
    | Consumer group             | The consumer group defined in your event   |
    | Data connection name       | The name that identifies your data connection.                 |
    | **Advanced filters**       |
    | Compression                | The compression type of the event hub messages payload.       |
    | Event system properties    | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties are added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    | Event retrieval start date | The data connection retrieves existing Event Hubs events created after the *Event retrieval start date*. Only events retained by Event Hubs's retention period can be retrieved. If the *Event retrieval start date* isn't specified, the default time is the time at which the data connection is created.   |

1. Select **Next**

### Inspect

The **Inspect** tab opens with a preview of the data.

To complete the ingestion process, select **Finish**.

:::image type="content" source="media/get-data-event-hubs/inspect-data.png" alt-text="Screenshot of inspecting data for ingesting from Event Hubs to Azure Data Explorer." lightbox="media/get-data-event-hubs/inspect-data.png":::

Optionally:

* If the data you see in the preview window isn't complete, you might need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:

  * **Discard and fetch new data**: Discards the data presented and searches for new events.
  * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.

* Select **Command viewer** to view and copy the automatic commands generated from your inputs.
* Use the **Schema definition file** dropdown to change the file that the schema is inferred from.
* Change the automatically inferred data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
* [Edit columns](#edit-columns).
* Explore [Advanced options based on data type](#advanced-options-based-on-data-type).

[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-event-hubs/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-event-hubs/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]

### Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-event-hubs/summary.png" alt-text="Summary screenshot of getting data from Event Hubs in Azure Data Explorer." lightbox="media/get-data-event-hubs/summary.png":::

### [Portal - Azure Data Explorer page](#tab/portalADX)

### Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [event hub](/azure/event-hubs/event-hubs-create) with data for ingestion.

### Get data

1. In the Azure portal, go to your cluster and select **Databases**. Then, select the database that contains your target table.

    :::image type="content" source="media/ingest-data-event-hub/select-test-database.png" alt-text="Screenshot of Azure Data Explorer web U I left menu, showing the Test Database item, selected.":::

1. From the left menu, select **Data ingestion**. Then, in the top bar, select **Add data connection**.

1. Fill out the form with the following information, and then select **Create**.

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Data connection name | *test-hub-connection* | The name of the connection you want to create in Azure Data Explorer.|
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace | A unique namespace name | The name you chose earlier that identifies your namespace. |
    | Event hub | *test-hub* | The event hub you created. |
    | Consumer group | *test-group* | The consumer group defined in the event hub you created. |
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties are added to the first record. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    | Compression | *None* | The compression type of the event hub messages payload. Supported compression types: *None, Gzip*.|
    | Managed Identity (recommended) | System-assigned | The managed identity used by the Data Explorer cluster for access to read from the event hub. We recommend using managed identities to control access to your event hub.<br /><br />**Note**:<br />When the data connection is created:<br/>\* *System-assigned* identities are automatically created if they don't exist<br />\* The managed identity is automatically assigned the *Azure Event Hubs Data Receiver* role and is added to your Data Explorer cluster. We recommend verifying that the role was assigned and that the identity was added to the cluster. |

    > [!NOTE]
    > If you have an existing data connection that is not using managed identities, we recommend updating it to use managed identities.

### [Portal - Azure Event Hubs page](#tab/portalEH)

### Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [event hub](/azure/event-hubs/event-hubs-create) with data for ingestion.

### Get data

1. In the Azure portal, browse to your Event Hubs Instance.
1. Under the **Features** side menu, select **Analyze data with Kusto**.
1. Select **Start** to open the ingestion wizard to Azure Data Explorer.

    :::image type="content" source="media/create-event-hubs-connection/access-from-portal-event-hubs.png" alt-text="Screenshot of the Azure portal with the analyze data with Kusto feature selected." lightbox="media/create-event-hubs-connection/access-from-portal-event-hubs.png":::

    > [!NOTE]
    >
    > * You must have at least [Database User](kusto/access-control/role-based-access-control.md) permissions.
    > * To enable access between a cluster and a storage account without public access, see [Create a Managed Private Endpoint](security-network-private-endpoint-create.md).
    > * The cluster and event hub should be associated with the same tenants. If not, use one of the SDK options, such as C# or Python.

1. The **Ingest data** side pane opens with the **Destination** tab selected. Select the **Cluster** and **Database** fields from the drop-downs. Make sure you select a cluster that is running. Otherwise, you won't be able to select Database and proceed with the ingestion process. 

1. Under **Table**, select **New table** and enter a name for the new table. Alternatively, use an **Existing table**.

1. Select **Next: Source**.

1. Under **Source type**, the **Event Hub** type and details are autopopulated based on the Event Hubs Instance that you started from.

1. Under **Data Connection**, fill in the following fields and select **Next: Schema**.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace |  | The name that identifies your namespace. |
    | Event hub |  | The event hub you wish to use. |
    | Data connection name | *TestDataConnection*  | The name that identifies your data connection.|
    | Consumer group |  | The consumer group defined in your event hub. |
    | Compression | | The compression type of the event hub messages payload.|
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties are added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    |Event retrieval start date| Coordinated Universal Time (UTC) | The data connection retrieves existing Event Hubs events created after the *Event retrieval start date*. Only events retained by Event Hubs's retention period can be retrieved. If the *Event retrieval start date* isn't specified, the default time is the time at which the data connection is created. |

1. If [streaming](kusto/management/streaming-ingestion-policy.md) is enabled for the cluster, you can select **Streaming ingestion**. If streaming isn't enabled for the cluster, set the **Data batching latency**. For Event Hubs, the recommended [batching time](kusto/management/batching-policy.md) is 30 seconds.

    :::image type="content" source="media/create-event-hubs-connection/schema-page-event-hubs.png" alt-text="Screenshot of schema page for ingesting from event hubs to Azure Data Explorer in the Azure portal." lightbox="media/create-event-hubs-connection/schema-page-event-hubs.png":::

1. Select the **Data format**. For CSV-formatted data, **Ignore the first record** to ignore the heading row of the file. For JSON-formatted data, select **Ignore data format errors** to ingest the data in JSON format or leave unselected to ingest the data in multijson format. Select the **Nested levels** to determine the table column data division.

1. If the data you see in the preview window isn't complete, you might need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:

    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.

1. Select **Next: Summary**.

1. In the **Continuous ingestion from Event Hub established** window, all steps are marked with green check marks when establishment finishes successfully.

### [ARM template](#tab/arm-template)

### Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [event hub](/azure/event-hubs/event-hubs-create) with data for ingestion.

### ARM template

The following example shows an Azure Resource Manager template for adding an Event Hubs data connection. You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal) by using the form.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_eventhubns_name": {
            "type": "string",
            "defaultValue": "eventhubns",
            "metadata": {
                "description": "Specifies the Event Hubs Namespace name."
            }
        },
        "EventHubs_eventhubdemo_name": {
            "type": "string",
            "defaultValue": "eventhubdemo",
            "metadata": {
                "description": "Specifies the event hub name."
            }
        },
        "consumergroup_default_name": {
            "type": "string",
            "defaultValue": "$Default",
            "metadata": {
                "description": "Specifies the consumer group of the event hub."
            }
        },
        "Clusters_kustocluster_name": {
            "type": "string",
            "defaultValue": "kustocluster",
            "metadata": {
                "description": "Specifies the name of the cluster"
            }
        },
        "databases_kustodb_name": {
            "type": "string",
            "defaultValue": "kustodb",
            "metadata": {
                "description": "Specifies the name of the database"
            }
        },
        "tables_kustotable_name": {
            "type": "string",
            "defaultValue": "kustotable",
            "metadata": {
                "description": "Specifies the name of the table"
            }
        },
        "mapping_kustomapping_name": {
            "type": "string",
            "defaultValue": "kustomapping",
            "metadata": {
                "description": "Specifies the name of the mapping rule"
            }
        },
        "dataformat_type": {
            "type": "string",
            "defaultValue": "csv",
            "metadata": {
                "description": "Specifies the data format"
            }
        },
        "databaseRouting_type": {
            "type": "string",
            "defaultValue": "Single",
            "metadata": {
                "description": "The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* EventData property."
            }
        },
        "dataconnections_kustodc_name": {
            "type": "string",
            "defaultValue": "kustodc",
            "metadata": {
                "description": "Name of the data connection to create"
            }
        },
        "subscriptionId": {
            "type": "string",
            "defaultValue": "[subscription().subscriptionId]",
            "metadata": {
                "description": "Specifies the subscriptionId of the event hub"
            }
        },
        "resourceGroup": {
            "type": "string",
            "defaultValue": "[resourceGroup().name]",
            "metadata": {
                "description": "Specifies the resourceGroup of the event hub"
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
            "type": "Microsoft.Kusto/Clusters/Databases/DataConnections",
            "apiVersion": "2022-02-01",
            "name": "[concat(parameters('Clusters_kustocluster_name'), '/', parameters('databases_kustodb_name'), '/', parameters('dataconnections_kustodc_name'))]",
            "location": "[parameters('location')]",
            "kind": "EventHub",
            "properties": {
                "managedIdentityResourceId": "[resourceId('Microsoft.Kusto/clusters', parameters('clusters_kustocluster_name'))]",
                "eventHubResourceId": "[resourceId(parameters('subscriptionId'), parameters('resourceGroup'), 'Microsoft.EventHub/namespaces/eventhubs', parameters('namespaces_eventhubns_name'), parameters('EventHubs_eventhubdemo_name'))]",
                "consumerGroup": "[parameters('consumergroup_default_name')]",
                "tableName": "[parameters('tables_kustotable_name')]",
                "mappingRuleName": "[parameters('mapping_kustomapping_name')]",
                "dataFormat": "[parameters('dataformat_type')]",
                "databaseRouting": "[parameters('databaseRouting_type')]"
            }
        }
    ]
}
```

---

## Remove an event hub data connection

### [Get data](#tab/get-data-2)

Remove the data connection through the Azure portal as explained in the portal tab.

### [Portal](#tab/portal-2)

To remove the event hub connection from the Azure portal, do the following:

1. Go to your cluster. From the left menu, select **Databases**. Then, select the database that contains the target table.
1. From the left menu, select **Data connections**. Then, select the checkbox next to the relevant event hub data connection.
1. From the top menu bar, select **Delete**.

---

## Related content

* Check the connection with the [Event hub sample message app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest)
* [Query data in the Web UI](web-ui-query-overview.md)
