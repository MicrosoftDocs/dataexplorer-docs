---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 12/22/2020
ms.author: orspodek
---

> [!NOTE]
> * System properties aren't supported on compressed data.
> * For tabular data, system properties are supported only for single-record event messages.
> * For JSON data, system properties are also supported for multiple-record event messages. In such cases, the system properties are added only to the first record of the event message. 
> * For `csv` mapping, properties are added at the beginning of the record in the order listed in the table below. 
> * For `json` mapping, properties are added according to property names in the [System properties](../ingest-data-event-hub-overview.md#system-properties) table.
