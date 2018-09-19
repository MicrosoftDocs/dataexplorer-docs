---
title: Kusto REST API - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto REST API in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto REST API

## Overview
Customers who require programmatic access to Kusto, but are not using .NET,
can use the Kusto REST API. All of the service functionality is exposed by
the REST API (and in fact the .NET client libraries are implemented on top
of the REST API).

To use the REST API, clients should send an HTTPS request to the appropriate
Kusto service endpoint, and then parse the HTTPS response that comes back.

REST API support differs according to the cluster type. For example, the
Engine cluster supports all APIs shown below, while the Data Management cluster
does not support the query API.

|API       |HTTP Verb|URI Template    |Anonymous|
|----------|---------|----------------|---------|
|Query     |GET      |`/v1/rest/query`|No       |
|Query     |POST     |`/v1/rest/query`|No       |
|Management|POST     |`/v1/rest/mgmt` |No       |
|UI        |GET      |`/`[{dbname}]   |Yes      |
|Ping      |GET      |`/v1/rest/ping` |Yes      |

Recently, an additional query endpoint was added (`/v2/rest/query`). <br> 
The only difference between the two query endpoints is the response structure. <br>
Note that this endpoint is still being peer reviewed and is subjected to (breaking!) changes. <br>
The response structure is described [here](response2.md).

## Sample REST Query Request & Response

Request:

```
POST http://onebox.kusto.windows.net:20002/v1/rest/query HTTP/1.1
Host: help.kusto.windows.net:443
Connection: keep-alive
Content-Length: 30
Cache-Control: no-cache
Content-Type: application/json
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.8

{"csl" : "AAA", "db" : "XXXX"}
```

Response:

```
HTTP/1.1 200 OK
Content-Length: 1456
Content-Type: application/json; charset=utf-8
Server: Microsoft-HTTPAPI/2.0
Date: Thu, 23 Jul 2015 06:41:48 GMT

{
    "Tables": [
        {
            "TableName": "Table_0",
            "Columns": [
                {
                    "ColumnName": "aa",
                    "DataType": "String",
					"ColumnType": "string"
                },
                {
                    "ColumnName": "bb",
                    "DataType": "String",
					"ColumnType": "dynamic"
                }
            ],
            "Rows": [
                [
                    "abc",
                    " def"
                ],
                [
                    "abddd",
                    " dddd"
                ]
            ]
        },
        {
            "TableName": "Table_1",
            "Columns": [
                {
                    "ColumnName": "Value",
                    "DataType": "String",
					"ColumnType": "string"
                }
            ],
            "Rows": [
                [
                    "{'Visualization' : 'table', 'Title' : '', Accumulate : 'False', 'IsQuerySorted' : 'False'}"
                ]
            ]
        },
        {
            "TableName": "Table_2",
            "Columns": [
                {
                    "ColumnName": "Timestamp",
                    "DataType": "DateTime",			
					"ColumnType": "datetime"
                },
                {
                    "ColumnName": "Severity",
                    "DataType": "Int32",
					"ColumnType": "int"
                },
                {
                    "ColumnName": "SeverityName",
                    "DataType": "String",
					"ColumnType": "string"
                },
                {
                    "ColumnName": "StatusCode",
                    "DataType": "Int32",
					"ColumnType": "int"
                },
                {
                    "ColumnName": "StatusDescription",
                    "DataType": "String",
					"ColumnType": "string"
                },
                {
                    "ColumnName": "Count",
                    "DataType": "Int32",
					"ColumnType": "int"
                },
                {
                    "ColumnName": "RequestId",
                    "DataType": "Guid",
					"ColumnType": "guid"
                },
                {
                    "ColumnName": "ActivityId",
                    "DataType": "Guid",
					"ColumnType": "guid"
                },
                {
                    "ColumnName": "SubActivityId",
                    "DataType": "Guid",
					"ColumnType": "guid"
                }
            ],
            "Rows": [
                [
                    "2015-07-23T06:41:48.2960374Z",
                    4,
                    "Info",
                    0,
                    "Query completed successfully",
                    1,
                    "9c42a500-2ffc-4c0f-acbf-9e3e55350675",
                    "9c42a500-2ffc-4c0f-acbf-9e3e55350675",
                    "489787ad-33a5-4733-9bec-a1cf853c6de6"
                ]
            ]
        },
        {
            "TableName": "Table_3",
            "Columns": [
                {
                    "ColumnName": "Ordinal",
                    "DataType": "Int64",
					"ColumnType": "long"
                },
                {
                    "ColumnName": "Kind",
                    "DataType": "String",
					"ColumnType": "string"
                },
                {
                    "ColumnName": "Name",
                    "DataType": "String",
					"ColumnType": "string"
                },
                {
                    "ColumnName": "Id",
                    "DataType": "String",
					"ColumnType": "string"
                }
            ],
            "Rows": [
                [
                    0,
                    "QueryResult",
                    "PrimaryResult",
                    "5b3fa920-a06a-423d-81de-b50f75d10393"
                ],
                [
                    1,
                    "QueryResult",
                    "@ExtendedProperties",
                    "39a9d845-5486-4472-9c60-7feb8e2b2767"
                ],
                [
                    2,
                    "QueryStatus",
                    "QueryStatus",
                    "00000000-0000-0000-0000-000000000000"
                ]
            ]
        }
    ]
}
```