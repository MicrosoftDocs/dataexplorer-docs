---
title: Query V2 HTTP response - Azure Data Explorer | Microsoft Docs
description: This article describes Query V2 HTTP response in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/11/2020
---
# Query V2 HTTP response

If the status code is 200, then the response body is a JSON array.
Each JSON object in the array is called a _frame_.

There are several types of frames:

* [DataSetHeader](#datasetheader)
* [TableHeader](#tableheader)
* [TableFragment](#tablefragment)
* [TableProgress](#tableprogress)
* [TableCompletion](#tablecompletion)
* [DataTable](#datatable)
* [DataSetCompletion](#datasetcompletion)

## DataSetHeader 

The `DataSetHeader` frame is always the first in the data set and appears exactly once.

```json
{
    "Version": string,
    "IsProgressive": Boolean
}
```

Where:

* `Version` is the protocol version. The current version is `v2.0`.
* `IsProgressive` is a boolean flag that indicates whether this data set contains progressive frames. 
   A progressive frame is one of:
   
     | Frame             | Description                                    |
     |-------------------| -----------------------------------------------|
     | `TableHeader`     | Contains general information about the table   |
     | `TableFragment`   | Contains a rectangular data shard of the table |
     | `TableProgress`   | Contains the progress in percent (0-100)       |
     | `TableCompletion` | Indicates that this frame is the last one      |
        
    The frames above describe a table.
    If the `IsProgressive` flag isn't set to true, then every table in the set will be serialized using a single frame:
* `DataTable`: Contains all the information that the client needs about a single table in the data set.

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

Queries that are issued with the `EnableProgressiveQuery` flag set to false won't include any of the frames (`TableHeader`, `TableFragment`, `TableProgress`, and `TableCompletion`). Instead, each table in the data set will be transmitted using the `DataTable` frame that contains all the information that the client needs, to read the table.

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
 information in the [render operator](../../query/renderoperator.md)) and [database cursor](../../management/databasecursor.md) information).
* `QueryTraceLog` - The performance trace log information (returned when `perftrace` in [client request properties](../netfx/request-properties.md) is set to true).

## DataSetCompletion

The `DataSetCompletion` frame is the final one in the data set.

```json
{
    "HasErrors": Boolean,
    "Cancelled": Boolean,
    "OneApiErrors": Array,
}
```

Where:

* `HasErrors` is true if there were errors while generating the data set.
* `Cancelled` is true if the request that led to the generation of the data set was canceled before completion. 
* `OneApiErrors` is only returned if `HasErrors` is true. For a description of the `OneApiErrors` format, see section 7.10.2 [here](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md).
