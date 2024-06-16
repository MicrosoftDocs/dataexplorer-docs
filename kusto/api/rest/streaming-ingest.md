---
title:  Streaming ingestion HTTP request
description: This article describes Streaming ingestion HTTP request in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/24/2020
---
# Streaming ingestion HTTP request

## Request verb and resource

|Action    |HTTP verb|HTTP resource                                               |
|----------|---------|------------------------------------------------------------|
|Ingest    |POST     |`/v1/rest/ingest/{database}/{table}?{additional parameters}`|

## Request parameters

| Parameter    | Description                                                                 | Required/Optional |
|--------------|-----------------------------------------------------------------------------|-------------------|
| `{database}` |   Name of the target database for the ingestion request                     |  Required         |
| `{table}`    |   Name of the target table for the ingestion request                        |  Required         |

## Additional parameters

Additional parameters are formatted as URL query `{name}={value}` pairs, separated by the & character.

| Parameter    | Description                                                                          | Required/Optional   |
|--------------|--------------------------------------------------------------------------------------|---------------------|
|`streamFormat`| Specifies the format of the data in the request body. The value should be one of: `CSV`, `TSV`, `SCsv`, `SOHsv`, `PSV`, `JSON`, `MultiJSON`, `Avro`. For more information, see [Supported Data Formats](../../../ingestion-supported-formats.md).| Required |
|`mappingName` | The name of the pre-created ingestion mapping defined on the table. For more information, see [Data Mappings](../../management/mappings.md). The way to manage pre-created mappings on the table is described [here](../../management/create-ingestion-mapping-command.md).| Optional, but Required if `streamFormat` is one of `JSON`, `MultiJSON`, or `Avro`|
              
For example, to ingest CSV-formatted data into table `Logs` in database `Test`, use:

```
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Csv HTTP/1.1
```

To ingest JSON-formatted data with pre-created mapping `mylogmapping`, use:

```
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

## Request headers

The following table contains the common headers for query and management operations.

|Standard header   | Description                                                                               | Required/Optional | 
|------------------|-------------------------------------------------------------------------------------------|-------------------|
|`Accept`          | Set this value to `application/json`.                                                     | Optional          |
|`Accept-Encoding` | Supported encodings are `gzip` and `deflate`.                                             | Optional          | 
|`Authorization`   | See [authentication](./authentication.md).                                                | Required          |
|`Connection`      | Enable `Keep-Alive`.                                                                      | Optional          |
|`Content-Length`  | Specify the request body length, when known.                                              | Optional          |
|`Content-Encoding`| Set to `gzip` but the body must be gzip-compressed                                        | Optional          |
|`Expect`          | Set to `100-Continue`.                                                                    | Optional          |
|`Host`            | Set to the domain name to which you sent the request (such as, `help.kusto.windows.net`). | Required          |

The following table contains the common custom headers for query and management operations. Unless otherwise indicated, the headers are for telemetry purposes only, and have no functionality impact.

|Custom header           |Description                                                                           | Required/Optional |
|------------------------|----------------------------------------------------------------------------------------------------------|
|`x-ms-app`              |The (friendly) name of the application making the request.                            | Optional          |
|`x-ms-user`             |The (friendly) name of the user making the request.                                   | Optional          |
|`x-ms-user-id`          |Same as `x-ms-user`.                                                                  | Optional          |
|`x-ms-client-request-id`|A unique identifier for the request.                                                  | Optional          |
|`x-ms-client-version`   |The (friendly) version identifier for the client making the request. Required in scenarios, where it's used to identify the request, such as canceling a running query.                                                        | Optional/Required  |

## Body

The body is the actual data to be ingested. The textual formats should use UTF-8 encoding.

## Examples

The following example shows the HTTP POST request for ingesting JSON content:

```txt
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

Request headers:

```txt
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

```txt
{"Timestamp":"2018-11-14 11:34","Level":"Info","EventText":"Nothing Happened"}
{"Timestamp":"2018-11-14 11:35","Level":"Error","EventText":"Something Happened"}
```

The following example shows the HTTP POST request for ingesting the same compressed data.

```txt
POST https://help.kusto.windows.net/v1/rest/ingest/Test/Logs?streamFormat=Json&mappingName=mylogmapping HTTP/1.1
```

Request headers:

```txt
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

```
... binary data ...
```
