---
ms.topic: include
ms.date: 12/22/2020
---

> [!NOTE]
>
> * Embedding system properties is supported for json and tabular formats (i.e. `JSON`, `MultiJSON`, `CSV`, `TSV`, `PSV`, `SCsv`, `SOHsv`, `TSVE`).
> * When using a non-supported format (i.e. TXT or compressed formats like `Parquet`, `Avro` etc.) the data will still be ingested, but the properties will be ignored.
> * Embedding system properties is not supported when a compression of Event Hub messages is set. In such scenarios, an appropriate error will be emitted and the data will not be ingested.
> * For tabular data, system properties are supported only for single-record event messages.
> * For json data, system properties are also supported for multiple-record event messages. In such cases, the system properties are added only to the first record of the event message.
> * For `CSV` mapping, properties are added at the beginning of the record in the order listed in the creation of the data connection. Don't rely on the order of these properties, as it may change in the future.
> * For `JSON` mapping, properties are added according to property names in the [System properties](../ingest-data-event-hub-overview.md#event-system-properties-mapping) table.
