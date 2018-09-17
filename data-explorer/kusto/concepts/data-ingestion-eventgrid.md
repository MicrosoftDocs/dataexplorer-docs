---
title: Kusto Data Ingestion via Event Grid Notifications (preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Data Ingestion via Event Grid Notifications (preview) in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Data Ingestion via Event Grid Notifications (preview)

Kusto offers continuous ingestion from blobs written to blob containers.
This is achieved by provisioning an [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview) subscription for blob creation events and tunneling these events to Kusto via an Event Hub.

## Data Format
* Blobs can be in any of the [formats supported by Kusto](https://kusto.azurewebsites.net/docs/concepts/data-ingestion.html#supported-data-formats).
* To provide data size information to Kusto on compressed blobs, we strongly recomend that customers will set `rawSizeBytes` property on the blob metadata to uncompressed data size in bytes.

**Example in C#**

```csharp
CloudBlobContainer container = new CloudBlobContainer(new Uri("container path"));
CloudBlockBlob blob = container.GetBlockBlobReference("testBlob.csv.gz");
blob.Metadata.Add("rawSizeBytes", "12000");
blob.UploadFromFile(@"C:\somepath\file.csv.gz");
```

## Events Routing
The transport chosen for streaming Event Grid notification events to Kusto is Event Hub.
In Kusto there is a 1:1 mapping from an Event Hub to the ingestion properties {Database, Table, Format, IngestionMappingReference}.
These settings (as reqiured) need to be specified during onboarding for each Event Hub pipeline that is set up.
 
## How to sign up?
* Set up an Event Hub to serve as the notifications broker for the Event Grid subscription
* Set up your Event Grid subscription(s) to emit `Blob Created` events for required container(s) and pattern(s) and point it to the Event Hub you created
* If you already have a Kusto cluster, we can use it. If you do not, please [file an onboarding request](https://aka.ms/kustoonboard) and specify `Independent` as pipeline type
* Once you have a cluster, [file a support ticket with Gaia](https://aka.ms/gaia) to let us know you would like to onboard to Event Grid with Event Hub ingestion preview:
  * Specify storage credentials for the account to which the blobs are written (unfortunately, Event Grid notifications only contain the blob URI)
  * Specify all Event Hub details
  * For each Event Hub you provision, specify which database and table the data should be ingested into
  * For each Event Hub you provision, specify the ingestion mapping object name to use (if required)
    Kusto provides a control command to [create/edit/delete an ingestion mapping](../management/tables.md#create-ingestion-mapping)
  * For each Event Hub you provision, specify the blobs format (if the extension is not definitive)


## Setting Up Event Grid Subscription

#### Create a Storage Account
* Log in to [Azure portal](https://portal.azure.com), open the `Create a resource` blade and select `Storage`
* Fill in the storage account details.
  **Note: Event Grid requires storage account of kind `Blob storage`**

    ![alt text](./images/CreateStorage-1.png "CreateStorage-1")

* Note the storage account name and the resource group, we will use those later

#### Provision an Event Hub
* Go to [Event Hubs management](https://ms.portal.azure.com/#create/hub)
* Review service overview and pricing details if needed
* Click `Create`

    ![alt text](./images/EventHub-01.png "EventHub-01")

* Define your Event Hub Namespace:
  * Provide a name and select pricing tier - `Basic` might be enough, but consult [Event Hub pricing](https://azure.microsoft.com/en-us/pricing/details/event-hubs/) to be sure.
  * Select a subscription, a resource group, and location
  * Configure throughput. Consult [Event Hub pricing](https://azure.microsoft.com/en-us/pricing/details/event-hubs/)
  * Click `Create`

    ![alt text](./images/EventHub-02.png "EventHub-02")

* Define your Event Hub:
  * Provide a name.
  * Select partition count.
  * Select message retention.
  * Click `Create`

    ![alt text](./images/EventHub-03.png "EventHub-03")
  * Make sure to create `Send` and `Listen` shared access policies to the created event hub.


#### Provision an Event Grid Subscription
* Open the `All services` blade and type in `event grid`
* Click `Event Grid Subscriptions`

    ![alt text](./images/EventGrid-01.png "EventGrid-01")

* Click `Create one`

    ![alt text](./images/EventGrid-02.png "EventGrid-02")

* Fill in the details of your Event Grid subscription:
  * Set Topic Types to `Storage Accounts`
  * Select your storage account subscription, resource group and name

    ![alt text](./images/EventGrid-03.png "EventGrid-03")

* Subscribe to blob creation notifications by selecting `Blob Created` event type

    ![alt text](./images/EventGrid-04.png "EventGrid-04")

* Fill in the details of your Event Grid subscription:
  * Set Endpoint Type to `Event Hubs`
  * Set Endpoint to event hub created previosly
  * Create name for this subscription, select `Event Grid Schema` as the event schema
  * Set filters for the notifications
  * `Subject Begins With` field is the *literal* prefix of the blob container (as the pattern applied is *startswith* it can span multiple containers). No wildcards allowed.
  It *must* be set as the following: *`/blobServices/default/containers/`*[container prefix]
  * `Subject Ends With` field is the *literal* suffix of the blob. No wildcards allowed.

    ![alt text](./images/EventGrid-05.png "EventGrid-05")

* Click `Create`
* The end. You now have an Event Grid subscription for `Blob Created` events under specified storage account that get streamed to an Event Hub, from where they can be consumed by Kusto