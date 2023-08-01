---
ms.topic: include
ms.date: 11/17/2022
---

> [!IMPORTANT]
> * If the table doesn't exist in the database, it's automatically created by the system. A valid data type must be specified for all the columns in the mapping. The ingestion command must specify the ingestion mapping and the [ingestion format](../ingestion-supported-formats.md). This behavior is only supported for batch ingestion. 
> * If columns in the mapping don't exist in the table, new columns are automatically added by the system the **first time data is ingested for these columns**. A valid data type must be specified for all columns that don't exist. This behavior is only supported for batch ingestion.   
