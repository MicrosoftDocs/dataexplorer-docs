---
ms.topic: include
ms.date: 12/26/2023
---

> [!IMPORTANT]
> * If the table doesn't exist in the database, it's automatically created by the system. A valid data type must be specified for all the columns in the mapping. The ingestion command must specify the ingestion mapping and the [ingestion format](../ingestion-supported-formats.md). This behavior is only supported for queued ingestion. 
> * When columns in the mapping are nonexistent in the table, the system dynamically adds them during the initial data ingestion for these columns. You must specify valid data types for any new columns. This behavior is restricted to queued ingestion. To add new columns to a mapping, use the [.alter ingestion mapping command](alter-ingestion-mapping-command.md).
