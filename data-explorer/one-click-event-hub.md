---
title: Use one-click ingestion to ingest data from Event Hub into Azure Data Explorer.
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Event Hub using the one-click experience.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 11/10/2020
---
# Use one-click ingestion to create an Event Hub data connection for Azure Data Explorer

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-hub.md)
> * [One-click](one-click-event-hub.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)
> * [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)

Azure Data Explorer offers ingestion (data loading) from Event Hubs, a big data streaming platform and event ingestion service. [Event Hubs](/azure/event-hubs/event-hubs-about) can process millions of events per second in near real-time. In this article, you connect an Event Hub to a table in Azure Data Explorer using the [one-click ingestion](ingest-data-one-click.md) experience.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* [A cluster and database](create-cluster-database-portal.md).
* [Event Hub with data for ingestion](ingest-data-event-hub.md#create-an-event-hub).

## Ingest new data

1. In the left menu of the [Web UI](https://dataexplorer.azure.com/), right-click a *database* or *table* and select **Ingest new data**. 

:::image type="content" source="media/one-click-event-hub/one-click-ingestion-in-webui.png" alt-text="Select one-click ingestion in the web UI":::

The **Ingest new data** window opens with the **Source** tab selected.

:::image type="content" source="media/one-click-event-hub/reference-to-event-hub.png" alt-text="Screenshot of source tab in ingest new data to Azure Data Explorer with source = reference to Event Hub":::

1. The **Database** field is auto-populated with your database. You may select a different database from the drop-down menu.

1. Under **Table**, select **Create new** and enter a name for the new table, or use an existing table. 

    > [!NOTE]
    > Table names must be between 1 and 1024 characters. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Under **Source type**, select **Reference to Event Hub**. The data connect selection will appear.

## Data connection

1. Under **Data Connection**, fill in the following fields:

    :::image type="content" source="media/one-click-event-hub/project-details.png" alt-text="Screenshot of source tab with project details fields to be filled in - ingest new data to Azure Data Explorer with Event Hub in the one click experience":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription |      | The subscription ID where the Event Hub resource is located.  |
    | Event Hub namespace | A unique namespace name | The name that identifies your namespace. |
    | Event Hub | *test-hub* | The Event Hub you wish to use. |
    | Consumer group | *test-group* | The consumer group defined in your Event Hub. |
    | Data format | | Data is read from the Event Hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata?view=azure-dotnet) objects. Supported formats are CSV, JSON, PSV, SCsv, SOHsv TSV, and TSVE. |
    | Event system properties | Select relevant properties | The [Event Hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties will be added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |

1. Select **Edit schema**.

## Schema tab

For information on schema mapping with JSON-formatted data, see [Edit the schema](one-click-ingestion-existing-table.md#edit-the-schema).
For information on schema mapping with CSV-formatted data, see [Edit the schema](one-click-ingestion-new-table.md#edit-the-schema).

:::image type="content" source="media/one-click-event-hub/schema-tab.png" alt-text="Screenshot of schema tab in ingest new data to Azure Data Explorer with Event Hub in the one click experience":::

If the data you see in the preview window is not complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your Event Hub:

* **Discard and fetch new data**: discards the data presented and searches for new events.

* **Fetch more**: Searches for more events in addition to the events already found. 

> [!NOTE]
> To see a preview of your data, your Event Hub must be sending events.
        
Select **Start ingestion**.

## Complete data ingestion

In the **Data ingestion completed** window, all steps will be marked with green check marks when data ingestion finishes successfully. The cards below these steps give you options to explore your data with **Quick queries**, undo changes made using **Tools**, or **Monitor** the Event Hub connections and data.

:::image type="content" source="media/one-click-event-hub/data-ingestion-completed.png" alt-text="Screenshot of final screen in ingestion to Azure Data Explorer from Event Hub with the one click experience":::

## Next steps

* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
