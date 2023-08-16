---
title: Get data from Event Hubs
description: Learn how to get data from a local file in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 08/07/2023
---
# Get data from Event Hubs

Data ingestion is the process used to load data records from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn you how to stream data from Event Hubs into either a new or existing table.

For more information about ingestion from Event Hubs, see [Create an Event Hubs data connection for Azure Data Explorer](create-event-hubs-connection.md). For general information on data ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md)

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Streaming ingestion must be [configured on your Azure Data Explorer cluster](ingest-data-streaming.md).

## Get data

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Get data**.

    :::image type="content" source="media/get-data-event-hubs/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-event-hubs/get-data.png":::

## Select a data source

1. In the **Get data** window, the **Source** tab is selected.

1. Select the data source from the available list. In this example, you are ingesting data from **Event Hubs**.

    :::image type="content" source="media/get-data-file/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-file/select-data-source.png":::

### Configure tab

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

## Inspect the data

The **Inspect** tab opens with a preview of the data.

:::image type="content" source="media/get-data-event-hubs/inspect-data.png" alt-text="Screenshot of inspecting data for ingesting from Event Hubs to Azure Data Explorer." lightbox="media/get-data-event-hubs/inspect-data.png":::

1. If the data you see in the preview window isn't complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:

    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.
1. Select **Command viewer** to view and copy the automatic commands generated from your inputs.
1. The data format is automatically inferred. You can change the data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
1. Optionally, [Edit columns](#edit-columns).
1. Optionally, explore [Advanced options based on data type](#advanced-options-based-on-data-type).
1. Select **Finish** to complete the ingestion process.


[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-file/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-file/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]


## Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-event-hubs/summary.png" alt-text="Summary screen of getting data from Event Hubs in Azure Data Explorer.":::

## Next steps

* Explore the results in the [Azure Data Explorer web UI query](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Use the sample app generator wizard to create code to ingest and query your data](sample-app-generator-wizard.md)