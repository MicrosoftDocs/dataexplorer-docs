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
> * Ingestion properties are used to [batch data together in queued ingestion](../ingest-data-overview.md#continuous-data-ingestion).  Using a lot of different ingestion properties for different data ingestion (e.g. different `ConstValue`) in the same table can therefore lead to poor performance due to ingestion fragmentation.

