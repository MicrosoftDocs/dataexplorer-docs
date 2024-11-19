---
title:  Query/management HTTP request
description: This article describes Query/management HTTP request.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/19/2024
---
# Query/management HTTP request

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

## Request verb and resource

|Action    |HTTP verb|HTTP resource   |
|----------|---------|----------------|
|Query     |GET      |`/v1/rest/query`|
|Query     |POST     |`/v1/rest/query`|
|Query v2  |GET      |`/v2/rest/query`|
|Query v2  |POST     |`/v2/rest/query`|
|Management|POST     |`/v1/rest/mgmt` |

For example, to send a management command ("management") to a service endpoint,
use the following request line:

```txt
POST https://help.kusto.windows.net/v1/rest/mgmt HTTP/1.1
```

See [Request headers](#request-headers) and [Body](#body) to learn what to include.

## Request headers

The following table contains the common headers used for query and management operations.

|Standard header  |Description |Required/Optional |
|-----------------|----------------------------------------------------------------------------|------------------|
|`Accept`         |The media types the client receives. Set to `application/json`.|Required          |
|`Accept-Encoding`|The supported content encodings. Supported encodings are `gzip` and `deflate`.   |Optional |
|`Authorization`  | The authentication credentials. For more information, see [authentication](authentication.md). |Required |
|`Connection`     |Whether the connection stays open after the operation. The recommendation is to set `Connection` to `Keep-Alive`. |Optional |
|`Content-Length` |The size of the request body. Specify the request body length when known. |Optional |
|`Content-Type`   |The media type of the request body. Set to `application/json` with `charset=utf-8`. |Required |
|`Expect`|The expected response from the server. It can be set to `100-Continue`. |Optional |
|`Host`  |The qualified domain name that the request was sent to. For example, `help.kusto.windows.net`. |Required|

The following table contains the common custom headers used for query and management operations. Unless otherwise indicated, these headers are used for telemetry purposes only, and don't affect functionality.

All headers are optional. However, We recommend specifying the `x-ms-client-request-id` custom header.
In some scenarios, such as canceling a running query, this header is required because it's used to identify the request.

|Custom header  |Description     |
|------------------------|----------------------------------------------------------------------------------------------------------|
|`x-ms-app`     |The friendly name of the application making the request.    |
|`x-ms-user`    |The friendly name of the user making the request.  |
|`x-ms-user-id` |The same friendly name as `x-ms-user`.      |
|`x-ms-client-request-id`|A unique identifier for the request.        |
|`x-ms-client-version`   |The friendly version identifier for the client making the request.|
|`x-ms-readonly`|If specified, forces the request to run in read-only mode, preventing the request from changing data. |

## Request parameters

The following parameters can be passed in the request. They're encoded in the request as query parameters or as part of the body, depending on whether GET or POST is used.

|Parameter   |Description|Required/Optional |
|------------|---------------------------------------------------------------|------------------|
|`csl`       |The text of the query or management command to execute. |Required |
|`db`        |The name of the database that is the target of the query or management command. |Optional for some management commands. <\br>Required for all queries and all other commands. </br>    |
|`properties`| Request properties that modify how the request is processed and its results. For more information, see [Request properties](request-properties.md).  | Optional|

## GET query parameters

When a GET request is used, the query parameters specify the request parameters.

## Body

When a POST request is used, the body of the request contains a single UTF-8 encoded JSON document, which includes the values of the request parameters.

## Examples

The following example shows the HTTP POST request for a query.

```txt
POST https://help.kusto.windows.net/v2/rest/query HTTP/1.1
```

Request headers

```txt
Accept: application/json
Authorization: Bearer ...AzureActiveDirectoryAccessToken...
Accept-Encoding: deflate
Content-Type: application/json; charset=utf-8
Host: help.kusto.windows.net
x-ms-client-request-id: MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1
x-ms-user-id: EARTH\davidbg
x-ms-app: MyApp
```

Request body

```json
{
  "db":"Samples",
  "csl":"print Test=\"Hello, World!\"",
  "properties":"{\"Options\":{\"queryconsistency\":\"strongconsistency\"},\"Parameters\":{},\"ClientRequestId\":\"MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\"}"
}
```

The following example shows how to create a request that sends the previous query, using [curl](https://curl.haxx.se/).

1. Obtain a token for authentication.

    Replace `AAD_TENANT_NAME_OR_ID`, `AAD_APPLICATION_ID`, and `AAD_APPLICATION_KEY` with the relevant values, after setting up [Microsoft Entra application authentication](../../access-control/provision-entra-id-app.md)

    ```bash
    curl "https://login.microsoftonline.com/AAD_TENANT_NAME_OR_ID/oauth2/token" \
      -F "grant_type=client_credentials" \
      -F "resource=https://help.kusto.windows.net" \
      -F "client_id=AAD_APPLICATION_ID" \
      -F "client_secret=AAD_APPLICATION_KEY"
    ```

    This code snippet provides you with the bearer token.

    ```json
    {
      "token_type": "Bearer",
      "expires_in": "3599",
      "ext_expires_in":"3599", 
      "expires_on":"1578439805",
      "not_before":"1578435905",
      "resource":"https://help.kusto.windows.net",
      "access_token":"eyJ0...uXOQ"
    }
    ```

1. Use the bearer token in your request to the query endpoint.

    ```bash
    curl -d '{"db":"Samples","csl":"print Test=\"Hello, World!\"","properties":"{\"Options\":{\"queryconsistency\":\"strongconsistency\"}}"}"' \
    -H "Accept: application/json" \
    -H "Authorization: Bearer eyJ0...uXOQ" \
    -H "Content-Type: application/json; charset=utf-8" \
    -H "Host: help.kusto.windows.net" \
    -H "x-ms-client-request-id: MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1" \
    -H "x-ms-user-id: EARTH\davidbg" \
    -H "x-ms-app: MyApp" \
    -X POST https://help.kusto.windows.net/v2/rest/query
    ```

1. Read the response according to [the response status codes](response.md).

### Set client request properties and query parameters

In the following request body example, the query in the `csl` field declares two parameters named `n` and `d`. The values for those query parameters are specified within the `Parameters` field under the `properties` field in the request body. The `Options` field defines [client request properties](request-properties.md).

> [!NOTE]
> Non-string and non-long parameters must be expressed as KQL literals in string format.

```json
{
    "db": "Samples",
    "csl": "declare query_parameters (n:long, d:dynamic); StormEvents | where State in (d) | top n by StartTime asc",
    "properties": {
        "Options": {
            "maxmemoryconsumptionperiterator": 68719476736,
            "max_memory_consumption_per_query_per_node": 68719476736,
            "servertimeout": "50m"
        },
        "Parameters": {
            "n": 10, "d": "dynamic([\"ATLANTIC SOUTH\"])"
        }
    }
}
```

For more information, see [Supported request properties](request-properties.md#supported-request-properties).

### Send show database caching policy command

The following example sends a request to show the `Samples` database caching policy. 
```json

{
    "db": "Samples",
    "csl": ".show database Samples policy caching",
    "properties": {
        "Options": {
            "maxmemoryconsumptionperiterator": 68719476736,
            "max_memory_consumption_per_query_per_node": 68719476736,
            "servertimeout": "50m"
        }
    }
}

```
