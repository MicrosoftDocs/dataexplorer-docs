---
title: Ingest data from Azure Event Hubs into Azure Data Explorer using the ingestion wizard
description: Learn how to ingest (load) data into Azure Data Explorer from Azure Event Hubs using the ingestion wizard.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 01/09/2023
---
# Use the ingestion wizard to create an Azure Event Hubs data connection for Azure Data Explorer

> [!div class="op_single_selector"]
>
> * [Portal](ingest-data-event-hub.md)
> * [Ingestion wizard](event-hub-wizard.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)
> * [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)

Azure Data Explorer offers ingestion (data loading) from Event Hubs, a big data streaming platform and event ingestion service. [Event hubs](/azure/event-hubs/event-hubs-about) can process millions of events per second in near real-time. In this article, you connect an event hub to a table in Azure Data Explorer using the [ingestion wizard](./ingest-data-wizard.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* An [event hub](ingest-data-event-hub.md#create-an-event-hub) with data for ingestion.

> [!NOTE]
>
>* To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).
>* The cluster and event hub should be associated with the same tenants, for different tenants please use [SDKs](./data-connection-event-hub-csharp.md)
>* To use the ingestion wizard, you must have at least [database user level permissions](kusto/management/access-control/role-based-access-control.md).

## Ingest data

1. In the left menu of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), select the **Data** tab.

    :::image type="content" source="media/event-hub-wizard/ingestion-in-web-ui.png" alt-text="Select the ingestion wizard in the Azure Data Explorer web UI.":::

1. In the **Ingest data from Event Hub** card, select **Ingest**.

The **Ingest data** window opens with the **Destination** tab selected.

### Destination tab

:::image type="content" source="media/event-hub-wizard/destination-tab.png" alt-text="Screen shot of destination tab. Cluster, Database, and Table fields must be filled out before proceeding to Next-Source.":::

1. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus.

1. Under **Table**, select **New table** and enter a name for the new table. Alternatively, use an existing table.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Select **Next: Source**.

### Source tab

1. Under **Source type**, select **Event Hub**.

1. Under **Data Connection**, fill in the following fields:

    :::image type="content" source="media/event-hub-wizard/project-details.png" alt-text="Screenshot of source tab with project details fields to be filled in - ingest new data to Azure Data Explorer with Event Hubs in the ingestion wizard.":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data connection name | *TestDataConnection*  | The name that identifies your data connection.
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace |  | The name that identifies your namespace. |
    | Event hub |  | The event hub you wish to use. |
    | Consumer group |  | The consumer group defined in your event hub. |
    | Compression | | The compression type of the event hub messages payload.|
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties will be added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    |Event retrieval start date| Coordinated Universal Time (UTC) | The data connection retrieves existing Event Hubs events created after the *Event retrieval start date*. Only events retained by Event Hubs's retention period can be retrieved. If the *Event retrieval start date* isn't specified, the default time is the time at which the data connection is created. |

1. Select **Next: Schema**.

[!INCLUDE [event-hub-connection-caution](includes/event-hub-connection-caution.md)]

## Schema tab

Data is read from the event hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects. Supported formats are CSV, JSON, PSV, SCsv, SOHsv TSV, TXT, and TSVE.

For information on schema mapping with JSON-formatted data, see [Edit the schema](/azure/data-explorer/ingest-from-local-file#edit-the-schema).
For information on schema mapping with CSV-formatted data, see [Edit the schema](/azure/data-explorer/ingest-from-container#edit-the-schema).

:::image type="content" source="media/event-hub-wizard/event-hub-schema.png" alt-text="Screenshot of schema tab in ingest new data to Azure Data Explorer with Event Hubs in the ingestion wizard.":::

> [!NOTE]
>
> * If [streaming](kusto/management/streamingingestionpolicy.md) is enabled for the cluster, the option to select **Streaming ingestion** is available.
> * If streaming is not enabled for the cluster, the option to select **Batching time** is available. For Event Hubs, the recommended default [batching time](kusto/management/batchingpolicy.md) is 30 seconds.

1. If the data you see in the preview window isn't complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:
    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.

1. Select **Next: Summary**.

## Continuous ingestion from Event Hubs

In the **Continuous ingestion from Event Hub established** window, all steps will be marked with green check marks when establishment finishes successfully. The cards below these steps give you options to explore your data with **Quick queries**, undo changes made using **Tools**, or **Monitor** the Event Hubs connections and data.

:::image type="content" source="media/event-hub-wizard/data-ingestion-completed.png" alt-text="Screenshot of final screen in ingestion to Azure Data Explorer from Event Hubs with the ingestion wizard.":::

## Next steps

* [Query data in Azure Data Explorer web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)