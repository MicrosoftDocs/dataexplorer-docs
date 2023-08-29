---
ms.service: azure
ms.topic: include
ms.date: 08/07/2023
---

### Mapping transformations

Some data format mappings (Parquet, JSON, and Avro) support simple ingest-time transformations. To apply mapping transformations, create or update a column in the [Edit columns](#edit-columns) window.

Mapping transformations can be performed on a column of type string or datetime, with the source having data type int or long. Supported mapping transformations are:

* DateTimeFromUnixSeconds
* DateTimeFromUnixMilliseconds
* DateTimeFromUnixMicroseconds
* DateTimeFromUnixNanoseconds