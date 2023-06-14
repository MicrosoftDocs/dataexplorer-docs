---
title:  Generate a SAS token
description: This article describes how to generate a SAS token in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: how-to
ms.date: 06/14/2023
---
# Generate a SAS token

This article shows you how to generate a SAS token to a resource.

## Azure portal

1. In the [Azure portal](https://portal.azure.com/), open **Storage accounts**.
1. Select the storage account that contains the resource for which you'd like to create a SAS token.
1. From the left menu, select **Containers**.
1. Right-click on the container for which you'd like to create a SAS token.
1. From the context menu, select **Generate SAS**.

   :::image type="content" source="storage/generate-sas-storage-account.png" alt-text="Screenshot of Azure portal with Containers selected. Specific container is right-clicked and a menu opens. Generate SAS is selected from this menu.":::

1. In the **Generate SAS** dialog, specify the **Permissions**, **Start and expiry date/time**, and **Allowed IP addresses**. Then, select **Generate SAS token and URL**

    :::image type="content" source="storage/generate-sas-token-and-url.png" alt-text="Screen shot of the Generate SAS dialog with information filled in and Generate SAS token and URL selected.":::

   A new section displays at the bottom of the dialog, listing the blob SAS token and the blob SAS URL.

1. Select the icon to the right of the blob SAS URL to copy it. Then, paste it to save or use it as required.

   :::image type="content" source="storage/copy-sas-token-and-url.png" alt-text="Screenshot of Azure portal with blob SAS URL generated.":::

## Next Steps

* [Storage authentication methods](storage-authentication-methods.md)
* [Storage connection strings](./storage-connection-strings.md)