---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 12/22/2020
ms.author: orspodek
---

> [!NOTE]
> * System properties are supported for `json` and tabular formats (`csv`, `tsv` etc.) and aren't supported on compressed data. When using non supported format, data will still be ingested, though properties will be ignored.
> * For tabular data, system properties are supported only for single-record event messages.
> * For JSON data, system properties are also supported for multiple-record event messages. In such cases, the system properties are added only to the first record of the event message. 
> * For `csv` mapping, properties are added at the beginning of the record in the order listed in the [System properties](../ingest-data-event-hub-overview.md#system-properties) table.
> * For `json` mapping, properties are added according to property names in the [System properties](../ingest-data-event-hub-overview.md#system-properties) table.
