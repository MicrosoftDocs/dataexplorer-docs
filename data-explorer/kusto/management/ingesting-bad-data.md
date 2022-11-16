---
title: How invalid data affects ingestion to Azure Data Explorer.
description: Learn about the various behaviors related to invalid data being ingested by Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: conceptual
ms.date: 11/14/2022
---

# Azure Data Explorer ingestion behavior on invalid data

Malformed data, unparsable, too large or not conforming to schema, might fail to be ingested properly. The following table describes what to expect when ingesting invalid data into Azure Data Explorer.

> For more information about why ingestion might fail, see [Ingestion failures](ingestionfailures.md) and  [Ingestion error codes in Azure Data Explorer](../../error-codes.md).

|Case                                                                                                               |Outcome                                            |ErrorCode                  |
|-------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|---------------------------|
|Invalid or corrupted format (actual data does not match the specified format)                                      |Ingestion failure                                  |BadRequest_InvalidBlob     |
|Malformed records in JSON data ingested with format="json" (e.g. unexpected newlines, missing braces or quotes)    |Malformed records are ignored and not ingested     |                           |
|Malformed records in JSON data ingested with format="multijson" (e.g. missing braces or quotes)                    |Ingestion failure                                  |BadRequest_InvalidBlob     |
|CSV/JSON record larger than 64MB (Engine V2 only)                                                                  |Ingestion failure                                  |Stream_InputStreamTooLarge |
|Value larger than 1MB ingested into a string column                                                                |Value truncated up to 1MB                          |                           |
|Value larger than 1MB ingested into a dynamic column (default, see [Encoding policy](encoding-policy.md))          |NULL value filled                                  |                           |
|CSV lines with inconsistent number of fields                                                                       |Ingestion failure                                  |Stream_WrongNumberOfFields |
|Value not matching the table schema data type (e.g. floating point value ingested into an int column)              |NULL values filled                                 |                           |
|Mapped fields are missing from the data                                                                            |NULL values filled                                 |                           |


## See

* [Data ingestion](../../ingest-data-overview.md)
* [Ingestion failures](ingestionfailures.md)
* [Encoding policy](encoding-policy.md)
