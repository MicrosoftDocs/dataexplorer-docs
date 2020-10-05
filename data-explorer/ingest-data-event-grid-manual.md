---
title: Create an Event Grid subscription in your storage account - Azure Data Explorer
description: This article describes how to create an Event Grid subscription in your storage account in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/10/2020
---
# Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications and manually create resources

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-grid.md)
> * [Portal - manually create resources](ingest-data-event-grid-manual.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

In this article, you'll create an Event Grid data connection that set an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hub. 

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md). 

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A cluster and database](create-cluster-database-portal.md).
* [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
    * Event Grid notification subscription can be set on Azure Storage Accounts for kind `BlobStorage` or `StorageV2`.
    * Enabling [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction) is also supported.
* [An event hub](/azure/event-hubs/event-hubs-create).

> [!NOTE]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

## Create Event Grid subscription
 
1. In the Azure portal, go to your storage account.
1. In the left menu, select **Events** > **Event Subscription**.

     :::image type="content" source="media/eventgrid/create-event-grid-subscription-1.png" alt-text="Create event grid subscription":::

1. In the **Create Event Subscription** window within the **Basic** tab, provide the following values:

    :::image type="content" source="media/eventgrid/create-event-grid-subscription-2.png" alt-text="Create event subscription values to enter":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Name | *test-grid-connection* | The name of the event grid subscription that you want to create.|
    | Event Schema | *Event Grid Schema* | The schema that should be used for the event grid. |
    | Topic Type | *Storage account* | The type of event grid topic. |
    | Source Resource | *gridteststorage1* | The name of your storage account. |
    | System Topic Name | *gridteststorage1...* | The system topic where Azure Storage publishes events. This system topic then forwards the event to a subscriber that receives and processes events. |
    | Filter to Event Types | *Blob Created* | Which specific events to get notified for. Currently supported type is Microsoft.Storage.BlobCreated. Make sure to select it when creating the subscription.|
    | Endpoint Type | *Event Hubs* | The type of endpoint to which you send the events. |
    | Endpoint | *test-hub* | The event hub you created. |

1. Select the **Filters** tab if you want to track specific subjects. Set the filters for the notifications as follows:
   * Select **Enable subject filtering**
   * **Subject Begins With** field is the *literal* prefix of the subject. Since the pattern applied is *startswith*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
       * To define a filter on the blob container, the field must be set as follows: *`/blobServices/default/containers/[container prefix]`*.
       * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
   * **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed.
   * **Case-sensitive subject matching** field indicates whether the prefix and suffix filters are case-sensitive.
   * For more information about filtering events, see [blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).
    
        :::image type="content" source="media/eventgrid/filters-tab.png" alt-text="Filters tab event grid":::

> [!NOTE]
> When the endpoint doesn't acknowledge receipt of an event, Azure Event Grid activates a retry mechanism. If this retry delivery fails, Event Grid can deliver the undelivered events to a storage account using a process of *dead-lettering*. For more information, see [Event Grid message delivery and retry](/azure/event-grid/delivery-and-retry#retry-schedule-and-duration).

## Create data ingestion connection to Azure Data Explorer

* Via Azure portal: [Create an Event Grid data connection in Azure Data Explorer](ingest-data-event-grid.md#create-an-event-grid-data-connection-in-azure-data-explorer).
* Using Kusto management .NET SDK: [Add an Event Grid data connection](data-connection-event-grid-csharp.md#add-an-event-grid-data-connection)
* Using Kusto management Python SDK: [Add an Event Grid data connection](data-connection-event-grid-python.md#add-an-event-grid-data-connection)
* With [Azure Resource Manager template for adding an Event Grid data connection](data-connection-event-grid-resource-manager.md#azure-resource-manager-template-for-adding-an-event-grid-data-connection)
