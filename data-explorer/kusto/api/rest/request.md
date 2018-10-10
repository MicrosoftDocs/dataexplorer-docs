---
title: The Kusto REST API Request Object - Azure Data Explorer | Microsoft Docs
description: This article describes The Kusto REST API Request Object in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# The Kusto REST API Request Object

## Verb and URI

The REST API verb for admin commands is always `POST`, and the
URI is `/v1/rest/mgmt`. For example:

```
POST https://help.kusto.windows.net/v1/rest/mgmt HTTP/1.1 
```

The REST API verb for queries is either `POST` or `GET`. The
URI is `/v1/rest/query`. For example:

```
POST https://help.kusto.windows.net/v1/rest/query HTTP/1.1 
```

If `GET` is used, the query parameters specify the values that
appear in the `POST` body (`db`, `csl`, and `properties`) -- see
below.

## Headers

### Standard HTTP headers

The following standard HTTP headers can be used.

|Header           |Description                                                                                                                    |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
|`Accept-Encoding`|Kusto currently supports `gzip` and `deflate`.                                                                                 |
|`Authorization`  |Must be provided for requests to production clusters, according to the authentication methods supported by the cluster **(1)**.|
|`Connection`     |It is recommended that `Keep-Alive` be enabled.                                                                                |
|`Content-Length` |It is recommended that the request body length be provided when known.                                                         |
|`Content-Type`   |Should be set to `application/json` with `charset=utf-8`.                                                                      |
|`Expect`         |Can be set to `100-Continue`.                                                                                                  |
|`Host`           |Should be set to the DNS name used when sending the request (e.g., `help.kusto.windows.net`).                                  |


**(1)** Use `bearer` (for AAD authentication).

### Extension HTTP headers

The following non-standard HTTP optional headers can be used. Unless specified otherwise,
all headers are used for **telemetry purposes only**, and have no impact on
functionality.

|Header                  |Description                                                                                           |
|------------------------|------------------------------------------------------------------------------------------------------|
|`x-ms-app`              |A string identifying the application issuing the request.                                             |
|`x-ms-user`             |A string identifying the interactive user.                                                            |
|`x-ms-user-id`          |                                                                                                      |
|`x-ms-client-request-id`|A string identifying this request. Can be used for correlating client and service activities. **(1)** |
|`x-ms-client-version`   |A string identifying the version of the client library making the requests.                           |
|`x-ms-activity-id`      ||
|`x-ms-activitycontext`  ||

**(1)**: This header is mandatory if the client wishes to refer to the request
in a future request. For example, if the client may want to be able to cancel
the request later on.

## Body

The request body for `POST` requests is a single JSON document
that encodes the database that the request is directed to (`db`), the
query or command (`csl`), and the client request properties
(`properties`).


The following examples shows the body of a query that is targetted at the
`help.kusto.windows.net` cluster:

```json
{
  "db":"Samples",
  "properties":"{\"Options\":{\"queryconsistency\":\"weakconsistency\"}}",
  "csl":"StormEvents | count"
}
```
