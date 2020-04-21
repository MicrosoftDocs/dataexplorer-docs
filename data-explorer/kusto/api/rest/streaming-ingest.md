---
title: Streaming ingestion HTTP request - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion HTTP request in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---
# Streaming ingestion HTTP request

## Request verb and resource

|Action    |HTTP verb|HTTP resource                                               |
|----------|---------|------------------------------------------------------------|
|Ingest    |POST     |`/v1/rest/ingest/{database}/{table}?{additional parameters}`|

## Request parameters

| Parameter    |  Description                                                                                                |
|--------------|-------------------------------------------------------------------------------------------------------------|
| `{database}` | **Required** - Name of the target database for the ingestion request                                          |
| `{table}`    | **Required** - Name of the target table for the ingestion request                                             |

## Additional parameters

Additional parameters are formatted as URL query `{name}={value}` pairs, separated by the & character.

| Parameter    |  Description                                                                                                |
|--------------|-------------------------------------------------------------------------------------------------------------|
|`streamFormat`| **Required** - Specifies the format of the data in the request body. The value should be one of: `Csv`,`Tsv`,`Scsv`,`SOHsv`,`Psv`,`Json`,`SingleJson`,`MultiJson`,`Avro`. For more information please see [Supported Data Formats](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats).|
|`mappingName` | **Required** - If `streamFormat` is one of `Json`, `SingleJson`, `MultiJson`, or `Avro`
                 **Optional** - Otherwise. 
                 The value must be the name of the pre-created ingestion mapping defined on the table. For more information on data mappings see [Data Mappings](../../management/mappings.md). The way to manage pre-created mappings on the table is described [here](../../management/create-ingestion-mapping-command.md).|
              

For example, to ingest CSV-formatted data into table `Logs` in database `Test`, use:

```kusto
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Csv HTTP/1.1
```

To ingest JSON-formatted data with pre-created mapping `mylogmapping`, use:

```kusto
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

(See below for the request headers and the body you must include)

## Request headers

The following table contains the common headers used to perform query and management operations.

|Standard header   |Description                                                                                                     |
|------------------|----------------------------------------------------------------------------------------------------------------|
|`Accept`          |**Optional**. Set this to `application/json`.                                                                   |
|`Accept-Encoding` |**Optional**. Supported encodings are `gzip` and `deflate`.                                                     |
|`Authorization`   |**Required**. See [authentication](./authentication.md).                                                        |
|`Connection`      |**Optional**. We recommended that you enable `Keep-Alive`.                                                      |
|`Content-Length`  |**Optional**. We recommended that you specify the request body length, when known.                              |
|`Content-Encoding`|**Optional**. Can be set to `gzip` but the body must be gzip-compressed                                         |
|`Expect`          |**Optional**. Can be set to `100-Continue`.                                                                     |
|`Host`            |**Required**. Set this to the fully-qualified domain name that the request was sent to (e.g., `help.kusto.windows.net`).|

The following table contains the common custom headers for query and management operations. Unless otherwise indicated, the headers are for telemetry purposes only, and have no functionality impact.

All headers are **optional**. We **strongly-recommend** that you specify the `x-ms-client-request-id` custom header. In some scenarios (such as cancelling a running query) this header is **mandatory**, since it is used to identify the request.

|Custom header           |Description                                                                                               |
|------------------------|----------------------------------------------------------------------------------------------------------|
|`x-ms-app`              |The (friendly) name of the application making the request.                                                |
|`x-ms-user`             |The (friendly) name of the user making the request.                                                       |
|`x-ms-user-id`          |Same as `x-ms-user`.                                                                                      |
|`x-ms-client-request-id`|A unique identifier for the request.                                                                      |
|`x-ms-client-version`   |The (friendly) version identifier for the client making the request.                                      |

## Body

The body is the actual data to be ingested. The textual formats must use UTF-8 encoding.

## Examples

The following example shows the HTTP POST request for ingesting JSON content:

```kusto
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

Request headers:

```kusto
Authorization: Bearer ...AzureActiveDirectoryAccessToken...
Accept-Encoding: deflate
Accept-Encoding: gzip
Connection: Keep-Alive
Content-Length: 161
Host: help.kusto.windows.net
x-ms-client-request-id: MyApp.Ingest;5c0656b9-37c9-4e3a-a671-5f83e6843fce
x-ms-user-id: alex@contoso.com
x-ms-app: MyApp
```

Request body:

```kusto
{"Timestamp":"2018-11-14 11:34","Level":"Info","EventText":"Nothing Happened"}
{"Timestamp":"2018-11-14 11:35","Level":"Error","EventText":"Something Happened"}
```

The following example shows the HTTP POST request for ingesting the same compressed data.

```kusto
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

Request headers:

```kusto
Authorization: Bearer ...AzureActiveDirectoryAccessToken...
Accept-Encoding: deflate
Accept-Encoding: gzip
Connection: Keep-Alive
Content-Length: 116
Content-Encoding: gzip
Host: help.kusto.windows.net
x-ms-client-request-id: MyApp.Ingest;5c0656b9-37c9-4e3a-a671-5f83e6843fce
x-ms-user-id: alex@contoso.com
x-ms-app: MyApp
```

Request body:

```kusto
... binary data ...
```
