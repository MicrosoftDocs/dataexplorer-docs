---
title:  Generate a SAS token
description: This article describes how to generate a SAS token.
ms.reviewer: shanisolomon
ms.topic: how-to
ms.date: 08/11/2024
---
# Generate a SAS token

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article shows you how to generate a SAS token to a storage resource. You can generate SAS tokens for containers and individual blobs.

## Azure portal

1. In the [Azure portal](https://portal.azure.com/), open **Storage accounts**.
1. Select the storage account that contains the resource for which you'd like to create a SAS token.
1. From the left menu, select **Containers**.
1. Navigate to the container, or drill down to the individual blob for which you'd like to create a SAS token.
1. Right-click on the container or blob and select **Generate SAS** from the context menu.

   :::image type="content" source="storage/generate-sas-storage-account.png" lightbox="storage/generate-sas-storage-account.png" alt-text="Screenshot of Azure portal with Containers selected. Specific container is right-clicked and a menu opens. Generate SAS is selected from this menu.":::

1. In the **Generate SAS** dialog, select **Read** and **List** permissions for containers, or **Read** for individual blobs. Optionally, specify the **Start and expiry date/time** and **Allowed IP addresses**. For more information about the optional parameters, see [best practices when authorizing using SAS](/azure/storage/common/storage-sas-overview#best-practices-when-using-sas). Then select **Generate SAS token and URL**.

   :::image type="content" source="storage/generate-sas-token-and-url.png"  lightbox="storage/generate-sas-token-and-url.png" alt-text="Screen shot of the Generate SAS dialog with information filled in and Generate SAS token and URL selected.":::

   A new section displays at the bottom of the dialog, listing the blob SAS token and the blob SAS URL.

1. Copy the **Blob SAS URL** value and save or use it as required.

   :::image type="content" source="storage/copy-sas-token-and-url.png" lightbox="storage/copy-sas-token-and-url.png" alt-text="Screenshot of Azure portal with blob SAS URL generated.":::

## Related content

* [Storage connection strings](storage-connection-strings.md)
