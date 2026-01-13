---
title: Data ingestion properties
description: Optimize data ingestion by configuring properties that align with your data formats.
ms.reviewer: tzgitlin
ms.topic: article
ms.date: 09/25/2025
monikerRange: "azure-data-explorer || microsoft-fabric"
---
# Data ingestion properties

> [!INCLUDE [applies](includes/applies-to-version/applies.md)] [!INCLUDE [fabric](includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](includes/applies-to-version/azure-data-explorer.md)]

Data ingestion adds data to a table and makes it available for query. Add properties to the ingestion command after the `with` keyword.

[!INCLUDE [ingestion-properties](includes/ingestion-properties.md)]

## Related content

::: moniker range="microsoft-fabric"
* [Supported data formats](ingestion-supported-formats.md)
::: moniker-end
::: moniker range="azure-data-explorer"
* [Supported data formats](ingestion-supported-formats.md)
* [Data ingestion](/azure/data-explorer/ingest-data-overview)
::: moniker-end
