---
title:  Query V2 HTTP response
description: This article describes Query V2 HTTP response in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# Query V2 HTTP response

## HTTP response status line

If the request succeeds, the HTTP response status code is `200 OK`.
The HTTP response body is a JSON array, as explained below.

If the request fails, the HTTP response status code is a `4xx` or `5xx` error.
The reason phrase will include additional information about the failure.
The HTTP response body is a JSON object, as explained below.

> [!Note]
> The request may return a status code of `200 OK`, but the HTTP response body
> will indicate an error. This may happen when the error gets raised after
> the HTTP status line is already returned. The reader is expected to  explicitly check
> for such a condition.

## HTTP response headers

Irrespective of the success/failure of the request, two custom HTTP headers are included with the response:

1. `x-ms-client-request-id`: The service returns an opaque string
   that identifies the request/response pair for correlation purposes.
   If the request included a client request ID, its value will appear here;
   otherwise, some random string is returned.

1. `x-ms-activity-id`: The service returns an opaque string
   that uniquely identifies the request/response pair for correlation purposes.
   Unlike `x-ms-client-request-id`, this identifier is not affected by
   any information in the request, and is unique per response.

## HTTP response body (on request failure)

On request failure, the HTTP response body will be a JSON document formatted according to
`OneApiErrors` rules. For a description of the `OneApiErrors` format, see section 7.10.2 [here](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md).
Below is an example for such a failure.

```json
{
    "error": {
        "code": "General_BadRequest",
        "message": "Request is invalid and cannot be executed.",
        "@type": "Kusto.Data.Exceptions.KustoBadRequestException",
        "@message": "Request is invalid and cannot be processed: Semantic error: SEM0100: 'table' operator: Failed to resolve table expression named 'aaa'",
        "@context": {
            "timestamp": "2023-04-18T12:59:27.4855445Z",
            "serviceAlias": "HELP",
            "machineName": "KEngine000000",
            "processName": "Kusto.WinSvc.Svc",
            "processId": 12580,
            "threadId": 10260,
            "clientRequestId": "Kusto.Cli;b90f4260-4eac-4574-a27a-3f302db21404",
            "activityId": "9dcc4522-7b51-41db-a7ae-7c1bfe0696b2",
            "subActivityId": "d0f30c8c-e6c6-45b6-9275-73dd6b379ecf",
            "activityType": "DN.FE.ExecuteQuery",
            "parentActivityId": "6e3c8dab-0aaf-4df5-85b5-fc20b0b29a84",
            "activityStack": "(Activity stack: CRID=Kusto.Cli;b90f4260-4eac-4574-a27a-3f302db21404 ARID=9dcc4522-7b51-41db-a7ae-7c1bfe0696b2 > KD.Query.Client.ExecuteQueryAsKustoDataStream/8191428e-7139-4c5d-9da7-839a0f21c5b9 > P.WCF.Service.ExecuteQueryAsKustoDataStream..IInterNodeCommunicationQueryContract/6e3c8dab-0aaf-4df5-85b5-fc20b0b29a84 > DN.FE.ExecuteQuery/d0f30c8c-e6c6-45b6-9275-73dd6b379ecf)"
        },
        "@permanent": true,
        "@text": "aaa",
        "@database": "Samples",
        "@ClientRequestLogger": "",
        "innererror": {
            "code": "SEM0100",
            "message": "'table' operator: Failed to resolve table expression named 'aaa'",
            "@type": "Kusto.Data.Exceptions.SemanticException",
            "@message": "Semantic error: SEM0100: 'table' operator: Failed to resolve table expression named 'aaa'",
            "@context": {
                "timestamp": "2023-04-18T12:59:27.4855445Z",
                "serviceAlias": "HELP",
                "machineName": "KEngine000000",
                "processName": "Kusto.WinSvc.Svc",
                "processId": 12580,
                "threadId": 10260,
                "clientRequestId": "Kusto.Cli;b90f4260-4eac-4574-a27a-3f302db21404",
                "activityId": "9dcc4522-7b51-41db-a7ae-7c1bfe0696b2",
                "subActivityId": "d0f30c8c-e6c6-45b6-9275-73dd6b379ecf",
                "activityType": "DN.FE.ExecuteQuery",
                "parentActivityId": "6e3c8dab-0aaf-4df5-85b5-fc20b0b29a84",
                "activityStack": "(Activity stack: CRID=Kusto.Cli;b90f4260-4eac-4574-a27a-3f302db21404 ARID=9dcc4522-7b51-41db-a7ae-7c1bfe0696b2 > KD.Query.Client.ExecuteQueryAsKustoDataStream/8191428e-7139-4c5d-9da7-839a0f21c5b9 > P.WCF.Service.ExecuteQueryAsKustoDataStream..IInterNodeCommunicationQueryContract/6e3c8dab-0aaf-4df5-85b5-fc20b0b29a84 > DN.FE.ExecuteQuery/d0f30c8c-e6c6-45b6-9275-73dd6b379ecf)"
            },
            "@permanent": true,
            "@errorCode": "SEM0100",
            "@errorMessage": "'table' operator: Failed to resolve table expression named 'aaa'"
        }
    }
}
```


## HTTP response body (on request success)

On request success, the HTTP response body will be a JSON array that encodes the request results.

Logically, the V2 response describes a **DataSet** object which contains
any number of **Tables**. These tables can represent the actual data asked-for
by the request, or additional information about the execution of the request
(such as an accounting of the resources consumed by the request). Additionally,
the actual request might actually fail (due to various conditions) even though
a `200 OK` status gets returned, and in that case the response will include
partial response data plus an indication of the errors.

Physically, the response body's JSON array is a list of JSON objects, each of
which is called a **frame**. The DataSet object is encoded into two frames:
[DataSetHeader](#datasetheader) and [DataSetCompletion](#datasetcompletion).
The first is always the first frame, and the second is always the last frame.
In "between" them one can find the frames describing the Table objects.

The Table objects can be encoded in two ways:

1. As a single frame: [DataTable](#datatable). This is the default.

1. Alternatively, as a "mix" of four kinds of frames: [TableHeader](#tableheader)
   (which comes first and describes the table), [TableFragment](#tablefragment)
   (which describes a table's data), [TableProgress](#tableprogress) (which is
   optional and provides an estimation into how far in the table's data we are),
   and [TableCompletion](#tablecompletion) (which is the last frame of the table).

The second case is called "progressive mode", and will only appear if
the client request property `results_progressive_enabled` is set to `true`.
In this case, each TableFragment frame describes an update to the data
accumulated by all previous such frames for the table, either as an append
operation, or as a replace operation. (The latter is used, for example, when
some long-running aggregation calculation is performed at the "top level" of
the query, so an initial aggregation result is replaced by more accurate
results later-on.)

## DataSetHeader

The `DataSetHeader` frame is always the first in the dataset and appears exactly once.

```json
{
    "Version": string,
    "IsProgressive": Boolean
}
```

Where:

* `Version` is the protocol version. The current version is `v2.0`.

* `IsProgressive` is a boolean flag that indicates whether this dataset contains progressive frames.
   A progressive frame is one of:

     | Frame             | Description                                    |
     |-------------------| -----------------------------------------------|
     | `TableHeader`     | Contains general information about the table   |
     | `TableFragment`   | Contains a rectangular data shard of the table |
     | `TableProgress`   | Contains the progress in percent (0-100)       |
     | `TableCompletion` | Indicates that this frame is the last one      |

    The frames above describe a table.
    If the `IsProgressive` flag isn't set to true, then every table in the set will be serialized using a single frame:

* `DataTable`: Contains all the information that the client needs about a single table in the dataset.

## TableHeader

Queries that are made with the `results_progressive_enabled` option set to true may include this frame. Following this table, clients can expect an interleaving sequence of `TableFragment` and `TableProgress` frames. The final frame of the table is `TableCompletion`.

```json
{
    "TableId": Number,
    "TableKind": string,
    "TableName": string,
    "Columns": Array,
}
```

Where:

* `TableId` is the table's unique ID.
* `TableKind` is one of:

    * PrimaryResult
    * QueryCompletionInformation
    * QueryTraceLog
    * QueryPerfLog
    * TableOfContents
    * QueryProperties
    * QueryPlan
    * Unknown
      
* `TableName` is the table's name.
* `Columns` is an array describing the table's schema.

```json
{
    "ColumnName": string,
    "ColumnType": string,
}
```

Supported column types are described [here](../../query/scalar-data-types/index.md).

## TableFragment

The `TableFragment` frame contains a rectangular data fragment of the table. In addition to the actual data, this frame  also contains a `TableFragmentType` property that tells the client what to do with the fragment. The fragment appended to existing fragments, or replace them.

```json
{
    "TableId": Number,
    "FieldCount": Number,
    "TableFragmentType": string,
    "Rows": Array
}
```

Where:

* `TableId` is the table's unique ID.
* `FieldCount` is the number of columns in the table.
* `TableFragmentType` describes what the client should do with this fragment. 
    `TableFragmentType` is one of:
    
    * DataAppend
    * DataReplace
      
* `Rows` is a two-dimensional array that contains the fragment data.

## TableProgress

The `TableProgress` frame can interleave with the `TableFragment` frame described above.
Its sole purpose is to notify the client of the query's progress.

```json
{
    "TableId": Number,
    "TableProgress": Number,
}
```

Where:

* `TableId` is the table's unique ID.
* `TableProgress` is the progress in percent (0--100).

## TableCompletion

The `TableCompletion` frame marks the end of the table transmission. No more frames related to that table will be sent.

```json
{
    "TableId": Number,
    "RowCount": Number,
}
```

Where:

* `TableId` is the table's unique ID.
* `RowCount` is the total number of rows in the table.

## DataTable

Queries that are issued with the `EnableProgressiveQuery` flag set to false won't include any of the frames (`TableHeader`, `TableFragment`, `TableProgress`, and `TableCompletion`). Instead, each table in the dataset will be transmitted using the `DataTable` frame that contains all the information that the client needs, to read the table.

```json
{
    "TableId": Number,
    "TableKind": string,
    "TableName": string,
    "Columns": Array,
    "Rows": Array,
}
```

Where:

* `TableId` is the table's unique ID.
* `TableKind` is one of:

  * PrimaryResult
  * QueryCompletionInformation
  * QueryTraceLog
  * QueryPerfLog
  * QueryProperties
  * QueryPlan
  * Unknown
* `TableName` is the table's name.
* `Columns` is an array describing the table's schema, and includes:

```json
{
    "ColumnName": string,
    "ColumnType": string,
}
```

* `Rows` is a two-dimensional array that contains the table's data.

### The meaning of tables in the response

* `PrimaryResult` - The main tabular result of the query. For each [tabular expression statement](../../query/tabularexpressionstatements.md), one or more tables are generated in-order, representing the results produced by the statement. There can be multiple such tables because of [batches](../../query/batches.md) and [fork operators](../../query/forkoperator.md).
* `QueryCompletionInformation` - Provides additional information about the execution of the query itself, such as
 whether it completed successfully or not, and what were the resources consumed by the query (similar to the QueryStatus table
 in the v1 response).
* `QueryProperties` - Provides additional values such as client visualization instructions (emitted, for example, to reflect the
 information in the [render operator](../../query/renderoperator.md)) and [database cursor](../../management/database-cursor.md) information.
* `QueryTraceLog` - The performance trace log information (returned when `perftrace` in [client request properties](../netfx/request-properties.md) is set to true).

## DataSetCompletion

The `DataSetCompletion` frame is the final one in the dataset.

```json
{
    "HasErrors": Boolean,
    "Cancelled": Boolean,
    "OneApiErrors": Array,
}
```

Where:

* `HasErrors` is true if there were errors while generating the dataset.
* `Cancelled` is true if the request that led to the generation of the dataset was canceled before completion.
* `OneApiErrors` is only returned if `HasErrors` is true. For a description of the `OneApiErrors` format, see section 7.10.2 [here](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md).
