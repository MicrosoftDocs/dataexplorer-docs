---
title: How invalid data affects ingestion in Azure Data Explorer.
description: Learn about possible outcomes of ingesting invalid data in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: conceptual
ms.date: 11/14/2022
---

# Azure Data Explorer ingestion behavior on invalid data

Malformed data, unparsable, too large or not conforming to schema, might fail to be ingested properly. The following tables describe what to expect when ingesting invalid data into Azure Data Explorer.

> For more information about why ingestion might fail, see [Ingestion failures](ingestionfailures.md) and  [Ingestion error codes in Azure Data Explorer](../../error-codes.md).

The first table lists cases where ingestion of invalid data fails with an Error code:

|Case                                                                                           |ErrorCode                          |
|-----------------------------------------------------------------------------------------------|-----------------------------------|
|Invalid or corrupted format (actual data does not match the specified format)                  |BadRequest_InvalidBlob             |
|Empty data (Engine V2)                                                                         |BadRequest_InvalidBlob             |
|Empty data (Engine V3)                                                                         |BadRequest_NoRecordsOrWrongFormat  |
|Malformed records in JSON data ingested with format="multijson" (e.g. missing braces or quotes)|BadRequest_InvalidBlob             |
|CSV/JSON record larger than 64MB (Engine V2 only)                                              |Stream_InputStreamTooLarge         |
|CSV lines with inconsistent number of fields                                                   |Stream_WrongNumberOfFields         |

The next table lists cases where ingestion succeeds without an error, silently handling the invalid data:

|Case                                                                                                           |Notes                                         |
|---------------------------------------------------------------------------------------------------------------|----------------------------------------------|
|Malformed records in JSON data ingested with format="json" (e.g. unexpected newlines, missing braces or quotes)|Malformed records are ignored and not ingested|
|Value larger than 1MB ingested into a string column                                                            |Value truncated up to 1MB                     |
|Value larger than 1MB (default, see [Encoding policy](encoding-policy.md)) ingested into a dynamic column      |NULL value filled                             |
|Value not matching the table schema data type (e.g. floating point value ingested into an int column)          |NULL value filled                             |
|Mapped fields are missing from the data                                                                        |NULL value filled                             |

## See

* [Data ingestion](../../ingest-data-overview.md)
* [Ingestion failures](ingestionfailures.md)
* [Encoding policy](encoding-policy.md)
