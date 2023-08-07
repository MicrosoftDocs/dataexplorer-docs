---
ms.service: azure
ms.topic: include
ms.date: 08/07/2023
---

### Mapping transformations

Some data format mappings (Parquet, JSON, and Avro) support simple ingest-time transformations.

Mapping transformations can be performed on a column of **Type** string or datetime, with the **Source** having data type int or long. Supported mapping transformations are:

* DateTimeFromUnixSeconds
* DateTimeFromUnixMilliseconds
* DateTimeFromUnixMicroseconds
* DateTimeFromUnixNanoseconds
