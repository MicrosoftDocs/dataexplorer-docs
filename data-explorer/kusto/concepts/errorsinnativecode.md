---
title: Errors in native code - Azure Data Explorer | Microsoft Docs
description: This article describes Errors in native code in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 07/12/2019
---
# Errors in native code

The Kusto engine is written in native code and reports errors by using negative `HRESULT` values. These errors aren't usually seen with a programmatic API, but may occur. For example, operation failures may depict
a status of "`Exception from HRESULT:` *HRESULT-CODE*".

Kusto native error codes are defined using Windows
`MAKE-HRESULT` macro with:

* Severity set to `1`
* Facility set to `0xDA`
  
The following error codes are defined:

|Manifest constant                  |Code |Value        |Meaning                                                                                                        |
|-----------------------------------|-----|-------------|---------------------------------------------------------------------------------------------------------------|
|`E_EXTENT_LOAD_FAILED`             | `0`  |`0x80DA0000`|Data shard couldn't be loaded                                                                                  |
|`E_RUNAWAY_QUERY`                  | `1`  |`0x80DA0001`|Query execution aborted as it exceeded its allowed resources                                                   |
|`E_STREAM_FORMAT`                  | `2`  |`0x80DA0002`|A data stream can't be parsed since it is badly formatted                                                      |
|`E_QUERY_RESULT_SET_TOO_LARGE`     | `3`  |`0x80DA0003`|The result set for this query exceed its allowed record/size limits                                            |
|`E_STREAM_ENCODING_VERSION`        | `4`  |`0x80DA0004`|A result stream can't be parsed since its version is unknown                                                   |
|`E_KVDB_ERROR`                     | `5`  |`0x80DA0005`|Failure to perform a key/value database operation                                                              |
|`E_QUERY_CANCELLED`                | `6`  |`0x80DA0006`|Query was cancelled                                                                                            |
|`E_LOW_MEMORY_CONDITION`           | `7`  |`0x80DA0007`|Operation was aborted due to available process memory running low                                              |
|`E_WRONG_NUMBER_OF_FIELDS`         | `8`  |`0x80DA0008`|A csv document submitted for ingestion has a record with the wrong number of fields (relative to other records)|
|`E_INPUT_STREAM_TOO_LARGE`         | `9`  |`0x80DA0009`|The document submitted for ingestion has exceeded the allowed length                                           |
|`E_ENTITY_NOT_FOUND`               | `10` |`0x80DA000A`|The requested entity was not found                                                                             |
|`E_CLOSING_QUOTE_MISSING`          | `11` |`0x80DA000B`|A csv document submitted for ingestion has a field with a missing quote                                        |
|`E_OVERFLOW`                       | `12` |`0x80DA000C`|Represents an arithmetic overflow error (the result of a computation is too large for the destination type)    |
|`E_RS_BLOCKED_ROWSTOREKEY_ERROR`   | `101`|`0x80DA0065`|An attempt was made to access a blocked row store key                                                          |
|`E_RS_SHUTTINGDOWN_ERROR`          | `102`|`0x80DA0066`|row store is shutting down                                                                                     |
|`E_RS_LOCAL_STORAGE_FULL_ERROR`    | `103`|`0x80DA0067`|Allocated disk space for row store storage is full                                                             |
|`E_RS_CANNOT_READ_WRITE_AHEAD_LOG` | `104`|`0x80DA0068`|Reading from row store storage has failed                                                                      |
|`E_RS_CANNOT_RETRIEVE_VALUES_ERROR`| `105`|`0x80DA0069`|Failure to retrieve values from row store storage                                                              |
|`E_RS_NOT_READY_ERROR`             | `106`|`0x80DA006A`|row store is initializing                                                                                      |
|`E_RS_INSERTION_THROTTLED_ERROR`   | `107`|`0x80DA006B`|Value insertion to a row store was throttled                                                                   |
|`E_RS_READONLY_ERROR`              | `108`|`0x80DA006C`|row store is attached in read-only state                                                                       |
|`E_RS_UNAVAILABLE_ERROR`           | `109`|`0x80DA006D`|row store is currently unavailable                                                                             |