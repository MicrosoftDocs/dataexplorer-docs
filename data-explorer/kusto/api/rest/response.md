---
title: Query/management HTTP response - Azure Data Explorer | Microsoft Docs
description: This article describes Query/management HTTP response in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/05/2018
---
# Query/management HTTP response

## Response status

The HTTP response status line follows the HTTP standard response codes
(e.g., 200 indicates success). The following status codes are currently in use
(but note that any valid HTTP code may be returned):

|Code|Sub-code       |Description                                    |
|----|---------------|-----------------------------------------------|
|100 |Continue       |Client can continue to send the request.       |
|200 |OK             |Request started processing successfully.       |
|400 |BadRequest     |Request is ill-formed and failed (permanently).|
|401 |Unauthorized   |Client needs to authenticate first.            |
|403 |Forbidden      |Client request is denied.                      |
|404 |NotFound       |Request references a non-existing entity.      |
|413 |PayloadTooLarge|Request payload exceeded limits.               |
|429 |TooManyRequests|Request has been denied due to throttling.     |
|504 |Timeout        |Request has timed-out.                         |
|520 |ServiceError   |The service encountered an error processing the request.|

> [!NOTE]
> It is important to realize that the 200 status code represents that the
> request processing has started successfully, and not that it completed
> successfully. Failures encountered during request processing but after 200
> has been returned are called "partial query failures", and when they
> are encountered special indicators are injected into the response stream
> to alert the client that they occurred.

## Response headers

The following custom headers will be returned.

|Custom header           |Description                                                                                               |
|------------------------|----------------------------------------------------------------------------------------------------------|
|`x-ms-client-request-id`|The unique request identifier sent in the request header of the same name, or some unique identifier.     |
|`x-ms-activity-id`      |A globally-unique correlation identifier for the request (created by the service).                        |

## Response body

If the status code is 200, the response body is a JSON document that encodes
the query or control command's results as a sequecne of rectangular tables.
See below for details.

> [!NOTE]
> This sequence of tables is reflected by the SDK. For example, when using the
> .NET Framework Kusto.Data library, the sequence of tables then becomes
> the results in the `System.Data.IDataReader` object returned by the
> SDK.

If the status code indicates a 4xx or a 5xx error (other than 401),
the response body is a JSON document that encodes the details of the failure,
conforming with the [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines).

> [!NOTE]
> If the `Accept` header is not included with the request, the response body
> of a failure is not necessarily a JSON document.

## JSON encoding of a sequence of tables

The JSON encoding of a sequence of tables is a single JSON property bag with
the following name/value pairs:

|Name  |Value                              |
|------|-----------------------------------|
|Tables|An array of the Table property bag.|

The Table property bag has the following name/value pairs:

|Name     |Value                               |
|---------|------------------------------------|
|TableName|A string that identifies the table. |
|Columns  |An array of the Column property bag.|
|Rows     |An array of the Row array.          |

The Column property bag has the following name/value pairs:

|Name      |Value                                                          |
|----------|---------------------------------------------------------------|
|ColumnName|A string that identifies the column.                           |
|DataType  |A string that provides the approximate .NET Type of the column.|
|ColumnType|A string that provides the [scalar data type](../../query/scalar-data-types/index.md) of the column.|

The Row array has the same order as the respective Columns array,
and has one element with the value of the row for the relevant column.
Scalar data types that cannot be represented in JSON (such as `datetime
and `timespan`) are represented as JSON strings.

The following example shows one possible such object, when it holds
a single table called `Table_0` that holds a single column `Text` of type
`string` and a single row.

```json
{
    "Tables": [{
        "TableName": "Table_0",
        "Columns": [{
            "ColumnName": "Text",
            "DataType": "String",
            "ColumnType": "string"
        }],
        "Rows": [["Hello, World!"]]
}
```

Another exmaple:

![JSON Response Representation](../images/rest-json-representation.png "rest-json-representation")

## The meaning of tables in the response

In most cases, control commands return a result with a single table, holding
the information generated by the control command. For example, the `.show databases`
command returns a single table with the details of all accesssible databases
in the cluster.

Queries, on the other hand, generally return multiple tables. For each
[tabular expression statement](../../query/tabularexpressionstatements.md),
one or more tables are emitted in-order, representing the results produced
by the statement (there can be multiple such tables due to [batches](../../query/batches.md)
and [fork operators](../../query/forkoperator.md)).

In addition, three tables are usually produced:

* An @ExtendedProperties table, providing additional values such as client visualization
  instructions (emitted, for example, to reflect the information in the
  [render operator](../../query/renderoperator.md)) and [database cursor](../../management/databasecursor.md)
  information).
* A QueryStatus table, providing additional information regarding the execution
  of the query itself, such as whether it completed successfully or not,
  and what were the resources consumed by the query.
* A TableOfContents table, which is emitted last and lists the other tables
  in the results.

