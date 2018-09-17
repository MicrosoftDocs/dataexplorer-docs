---
title: Kusto Data Ingestion from Event Hub / IoT Hub (preview) - Azure Kusto | Microsoft Docs
description: This article describes Kusto Data Ingestion from Event Hub / IoT Hub (preview) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Data Ingestion from Event Hub / IoT Hub (preview)

Kusto offers ingestion from [Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/). Kusto supports the following Event Hub setups:
* Bring your own Event Hub (preferred): Kusto will read data directly from your Event Hub
* Kusto-managed Event Hub: we will provision and manage the required number of Standard SKU Event Hubs, according to your traffic volume

## How to sign up?
* If you already have a Kusto cluster, we can use it. If you do not, please [file an onboarding request](https://aka.ms/kustoonboard) and specify `Independent` as pipeline type
* Once you have a cluster, [file a support ticket with Gaia](https://aka.ms/gaia) to let us know you would like to onboard to Event Hub ingestion preview
* If you are bringing your own Event Hub, you need to provide the following details:
  * Event Hub name (Event Hub should be configured with `listener` shared access policy)
  * Event Hub resource id
  * Event Hub namespace connection string (`manage` claim is required)
  * Consumer group
  * Database - name (case sensitive) of the target Kusto database
  * [Optional] Connection string for Azure Blob storage with `Read/Write` permissions to use for partition distribution. If not specified, a new storage account will be created.
* If you want to ingest from your own [IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/about-iot-hub), using its `Events` endpoint, you need to provide the following details:
  * Event Hub compatible name
  * Event Hub compatible endpoint
  * Consumer group
  * Partitions
  * Database - name (case sensitive) of the target Kusto database

## Data Format
* Kusto will read data from the Event Hub in form of [EventData](https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.eventdata?view=azure-dotnet) objects
* Event payload must contain one or more records to be ingested, uncompressed
* Currently only CSV and JSON formats are supported

## Events Routing
Event Hub ingestion can be set up for either static or dynamic events routing

* Dynamic routing means that events read from a single Event Hub can land in different tables in your Kusto cluster.<br>
This requires the following properties to be added to the [EventData.Properties](https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties) bag:
  * Table - name (case sensitive) of the target Kusto table
  * Format - payload format (`"csv"` or `"json"`)
  * IngestionMappingReference - name of the ingestion mapping object (precreated on the database) to be used
    Kusto provides a control command to [create/edit/delete an ingestion mapping](../management/tables.md#create-ingestion-mapping).

* Static routing means that there is a 1:1 mapping from an Event Hub to the ingestion properties {Database, Table, Format, IngestionMappingReference}, that need to be specified during onboarding

## HowTo: Provision an Event Hub
* Go to [Event Hubs management](https://ms.portal.azure.com/#create/Microsoft.EventHub)
* Review service overview and pricing details if needed
* Click `Create`

    ![alt text](./images/EventHub-01.png "EventHub-01")

* Define your Event Hub Namespace:
  * Provide a name and select pricing tier, according to the expected data volume and rate. Consult [Event Hub pricing](https://azure.microsoft.com/en-us/pricing/details/event-hubs/)
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

## HowTo: Provision an IoT Hub
* Go to [IoT Hubs management](https://ms.portal.azure.com/#create/Microsoft.IoTHub)
* Review pricing details and settings if needed
* Click `Create`

    ![alt text](./images/IotHub-01.png "IotHub-01")

* On `Endpoints` menu select the `Events` built-in enpoint. These are the properties needed to onboard IoT Hub ingestion.
* Create consumer group if needed.

    ![alt text](./images/IotHub-02.png "IotHub-02")


<!--
## How to retrieve Kusto Event Hub connection details?
* Kusto Data Management service (`https://ingest-<your cluster name>.kusto.windows.net`) exposes functionality to query for the Event Hub details in an authenticated manner, via Kusto client.
* The command (shown below) returns all the Event Hubs the service is listening on in form of {Event Hub connection string, Event Hub name}.<BR>
  
  ```
  .show EventHub ingestion sources settings
  ```
* The recommendation is to periodically run this command to allow Kusto service effectively manage its Event Hubs (rotate secrets, provision additional Event Hubs, perform repartitioning, etc.)
-->