---
ms.topic: include
ms.date: 12/27/2023
---

> [!IMPORTANT]
>
> For queued ingestion:
> 
> * If the table referenced in the mapping doesn't exist in the database, it gets created automatically, given that valid data types are specified for all columns.
> * If a column referenced in the mapping doesn't exist in the table, it gets added automatically to the table as the last column upon the first time data is ingested for that column, given a valid data type is specified for the column. To add new columns to a mapping, use the [.alter ingestion mapping command](../kusto/management/alter-ingestion-mapping-command.md).
> * [Data is batched using Ingestion properties](../ingest-data-overview.md#continuous-data-ingestion). The more distinct ingestion mapping properties used, such as different ConstValue values, the more fragmented the ingestion becomes, which can lead to performance degradation.

