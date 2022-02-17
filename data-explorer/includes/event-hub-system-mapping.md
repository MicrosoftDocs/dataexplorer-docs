---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 12/22/2020
ms.author: orspodek
---

> [!NOTE]
> * Embedding system properties is supported for `JSON` and tabular formats (`CSV`, `TSV` etc.).
> * When using a non-supported format (e.g. TXT or compressed formats) the data will still be ingested, but the properties will be ignored.
> * Embedding system properties is not supported when a compression is set. In such scenarios, an appropriate error will be emitted.
> * For tabular data, system properties are supported only for single-record event messages.
> * For JSON data, system properties are also supported for multiple-record event messages. In such cases, the system properties are added only to the first record of the event message. 
> * For `CSV` mapping, properties are added at the beginning of the record in the order listed in the [System properties](../ingest-data-event-hub-overview.md#system-properties) table.
> * For `JSON` mapping, properties are added according to property names in the [System properties](../ingest-data-event-hub-overview.md#system-properties) table.
