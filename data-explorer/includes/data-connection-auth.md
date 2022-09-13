---
title: include file
description: include file
ms.topic: include
ms.date: 09/07/2022
ms.reviewer: orhasban
ms.custom: include file
---
## Azure Data Explorer data connection authentication mechanisms
1. Managed Identity (MI) based data connection (recommended) - in case the customer wants full control over the ability of Azure Data Explorer to fetch data from the data source, MI based data connection is the recommended and the most secure way. The customer should attach a MI to the Azure Data Explorer resource, then grant the MI the required permissions on the data source, and create the Azure Data Explorer Data Connection so the cluster would use the MI in order to fetch data. 
- Key-based data connection: If a managed identity is not specified in the data connection, the connection automatically defaults to key-based authentication. Key-based connections fetch data using a resource connection string, such as the [Azure Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string). Azure Data Explorer generates the resource connection string for the specified resource and securely saves it in the data connection. The connection string is then used to fetch data from the data source.

> [!NOTE]
> If the key is rotated, the data connection is disabled and can't fetch data from the data source. To fix the issue, you can update the data connection, or recreate it.

> [!NOTE]
>
> * Key-based data connection - In case the key was rotated, the data connection become disabled, the customer should update the Data Connection, or recreate it.
> * MI-based data connection - Once the MI is no longer permitted on the data source the data connection become disabled and will no longer be able to fetch data from the data source.

