---
title: Generate a SAS token - Azure Data Explorer | Microsoft Docs
description: This article describes how to genereate a SAS token.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 06/28/2021
---
# Generate a SAS token 

This guide demonstrates how to generate a SAS token to a resource.

1. In the Azure portal, open Storage Explorer.
1. From the left menu, select **Containers**.
1. Right-click on the desired container.
1. From the context menu, select **Generate SAS**.

   :::image type="content" source="storage/generate-sas-storage-account.png" alt-text="Screenshot of Azure portal with Containers selected. Specific container is right-clicked and a menu opens. Generate SAS is selected from this menu.":::

1. In the Shared Access Signature dialog, specify the policy, start and expiration dates, time zone, and access levels you want for the resource.

    :::image type="content" source="storage/generate-sas-token-and-url.png" alt-text="Screen shot of the Generate SAS dialog with information filled in and Generate SAS token and URL selected.":::

1. Select **Generate SAS token and URL**.
1. A new section will then display at the bottom of the dialog, listing the blob SAS token and the blob SAS URL. Select the copy icon to the right of the blob SAS URL.

   :::image type="content" source="storage/copy-sas-token-and-url.png" alt-text="Screenshot of Azure portal with blob SAS URL generated.":::