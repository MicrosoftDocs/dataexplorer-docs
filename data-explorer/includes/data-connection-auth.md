---
title: include file
description: include file
ms.topic: include
ms.date: 06/04/2024
ms.reviewer: orhasban
ms.custom: include file
---
* Key-based data connection: If a managed identity is not specified in the data connection, the connection automatically defaults to key-based authentication. Key-based connections fetch data using a resource connection string, such as the [Azure Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string). Azure Data Explorer generates the resource connection string for the specified resource and securely saves it in the data connection. The connection string is then used to fetch data from the data source.

    > [!CAUTION]
    > If the key is rotated, the data connection is disabled and can't fetch data from the data source. To fix the issue, update or recreate the data connection.
