---
title: Manage Event Hubs data connections in your free Azure Data Explorer cluster.
description: Learn how to manage Azure Event Hubs data connections in your free cluster.
ms.reviewer: guregini
ms.topic: how-to
ms.date: 08/26/2025
---

# Manage Event Hubs data connections in your free Azure Data Explorer cluster

Azure Data Explorer offers ingestion (data loading) from Event Hubs, a big data streaming platform and event ingestion service. [Event hubs](/azure/event-hubs/event-hubs-about) can process millions of events per second in near real-time. In this article, you connect an event hub to a table in your free Azure Data Explorer cluster.

You can perform the following management action for Event Hubs data connections:

- [Create a new data connection](#create-a-new-data-connection)
- [View data connection details](#view-data-connection-details)
- [Reconnect a data connection](#reconnect-a-data-connection)
- [Delete a data connection](#delete-a-data-connection)

## Prerequisites

- A [free Azure Data Explorer cluster](start-for-free-web-ui.md)
- An [event hub with data for ingestion](/azure/event-hubs/event-hubs-about)

> [!NOTE]
> The cluster and event hub should be associated with the same tenant.

## Create a new data connection

Use the following steps to create an Event Hubs data connection in your free cluster.

1. Go to [My Cluster](https://aka.ms/kustofree).

1. Select the **Data connections** tab, and then select **Ingest from Event Hubs**.  
    The **Ingest data** window opens with the **Destination** tab selected.

    :::image type="content" source="media/start-for-free-event-hubs/start-for-free-create-event-hubs-data-connection.png" alt-text="Screenshot of the data connections tab, showing the ingestion from Event Hubs option." lightbox="media/start-for-free-event-hubs/start-for-free-create-event-hubs-data-connection.png":::

1. Fill out the destination details using the information in [Destination tab](create-event-hubs-connection.md?tabs=portalEH#create-an-event-hub-data-connection), and then select **Next**.
1. Fill out the source details using the information in Source tab, and then select **Next**.
1. Fill out the schema details using the information in Schema tab, and then select **Next**.  
    The data connection is created and starts ingesting data.
1. Select **Close** to return to the **My cluster** page.
1. Select the **Data connections** tab, and verify that the connection appears and the status is **Connected**.

    :::image type="content" source="media/start-for-free-event-hubs/start-for-free-verify-event-hubs-data-connection.png" alt-text="Screenshot of the data connections tab, showing the ingestion from Event Hubs connection is connected." lightbox="media/start-for-free-event-hubs/start-for-free-verify-event-hubs-data-connection.png":::

## View data connection details

To view data connection details:

1. In the **Data connections** tab, select the data connection name.

    :::image type="content" source="media/start-for-free-event-hubs/start-for-free-view-event-hubs-data-connection-details.png" alt-text="Screenshot of the data connections tab, showing the ingestion from Event Hubs connection details pane." lightbox="media/start-for-free-event-hubs/start-for-free-view-event-hubs-data-connection-details.png":::

1. Optionally, select field dropdowns to view more details.
1. Select **Close** to return to the **Data connections** tab.

## Reconnect a data connection

If there's a connectivity issue with a connecting, its status in the **Data connections** tab is set to **Disconnected**. The issue can result from the regeneration of the event hub account keys, or the deletion of the event hub.

Use the following tab to determine how to resolve the issue:

| Cause | Resolution |
| --- | --- |
| Account keys regenerated | Reconnect the data connection. |
| Event hub deleted | [Delete](#delete-a-data-connection) the data connection. |

To reconnect the data connection:

1. In the **Data connections** tab, locate the data connection, and then select **Reconnect** (:::image type="icon" source="media/start-for-free-event-hubs/start-for-free-reconnect-hubs-data-connection.png" border="false":::).
1. Verify that the status is **Connected**.

## Delete a data connection

To delete a data connection:

1. In the **Data connections** tab, locate the data connection, and then select **Delete** (:::image type="icon" source="media/start-for-free-event-hubs/start-for-free-delete-hubs-data-connection.png" border="false":::).
1. Verify that the data connection no longer appears in the list of connections.

## Related content

- [Upgrade your free cluster](start-for-free-upgrade.md)
- [Learn more about Azure Data Explorer](data-explorer-overview.md)
- [Learn more about Kusto Query Language](/kusto/query/index?view=azure-data-explorer&preserve-view=true)
