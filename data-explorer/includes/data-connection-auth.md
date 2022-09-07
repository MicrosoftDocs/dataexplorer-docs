---
title: include file
description: include file
ms.topic: include
ms.date: 09/07/2022
ms.reviewer: orhasban
ms.custom: include file
---
## Azure Data Explorer Data Connection authentication mechanisms:
1. Managed Identity (MI) based data connection (recommended) - in case the customer wants full control over the ability of Azure Data Explorer to fetch data from the data source, MI based data connection is the recommended and the most secure way. The customer should attach a MI to the Azure Data Explorer resource, then grant the MI the required permissions on the data source, and create the Azure Data Explorer Data Connection so the cluster would use the MI in order to fetch data. 
1. Key-based data connection - Azure Data Explorer Data connection setting that does not contain MI information will fetch its data by resource connection string (e.g. [Azure Event Hub connection string info](/azure/event-hubs/event-hubs-get-connection-string)). Azure Data Explorer generates the resource connection string by its special permissions, and save it in its configuration in a secure way. That connection string allows the backend to fetch data from the data source. 

> [!NOTE]
>
> * Key-based data connection - In case the key was rotated, the data connection become disabled, the customer should update the Data Connection, or recreate it.
> * MI-based data connection - Once the MI is no longer permitted on the data source the data connection become disabled and will no longer be able to fetch data from the data source.

