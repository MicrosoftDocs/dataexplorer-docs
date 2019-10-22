---
title: Query V2 HTTP response - Azure Data Explorer | Microsoft Docs
description: This article describes Query V2 HTTP response in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2019
---
# Query V2 HTTP response

If the status code is 200, the response body is a JSON array.
Each JSON object in the array is called a _frame_.

There are 7 types of frames:

1. DataSetHeader
2. TableHeader
3. TableFragment
4. TableProgress
5. TableCompletion
6. DataTable
7. DataSetCompletion

## DataSetHeader 

This is always the first frame in the data set and appears exactly once.

```json
{
    "Version": string,
    "IsProgressive": Boolean
}
```

Where:

1. `Version` holds the protocol version. The current version is `v2.0`.
2. `IsProgressive` is a boolean flag which indicates whether this data set contains progressive frames. A progressive frame is one of the following:
    1. `TableHeader` : Contains general information about the table
    2. `TableFragment` : Contains a rectangluar data shard of the table
    3. `TableProgress` : Contains the progress in percent (0-100)
    4. `TableCompletion` : Marks that this is the last frame of the table.
        
    The four frames above are used together to describe a table.
    If this flag is not set, then every table in the set will be serialized using a single frame:
      1. `DataTable`: Contains all the information the client needs about a single table in the data set.


## TableHeader

Queries which are issued with the `results_progressive_enabled` option set to true may include this frame. Following this table, clients should expect an interleaving  sequence of `TableFragment` and `TableProgress` frames, followed by a `TableCompletion` frame. After which, no more frames related to that table will be sent.

```json
{
    "TableId": Number,
    "TableKind": string,
    "TableName": string,
    "Columns": Array,
}
```

Where:

1. `TableId` is the table's unique id.
2. `TableKind` is the table's kind, which can be one of the following:

      * PrimaryResult
      * QueryCompletionInformation
      * QueryTraceLog
      * QueryPerfLog
      * TableOfContents
      * QueryProperties
      * QueryPlan
      * Unknown
3. `TableName` is the table's name.
4. `Columns` is an array describing the table's schema:

```json
{
    "ColumnName": string,
    "ColumnType": string,
}
```
Supported column types are described [here](../../query/scalar-data-types/index.md).

## TableFragment

This frame contains a rectangular data fragment of the table. In addition to the actual data, this frame contains a `TableFragmentType` property, which tells the client what to do with the fragment (it can either be appended to existing fragments, or replace them all together).

```json
{
    "TableId": Number,
    "FieldCount": Number,
    "TableFragmentType": string,
    "Rows": Array
}
```

Where:

1. `TableId` is the table's unique id.
2. `FieldCount` is the number of columns in the table
3. `TableFragmentType` describes what the client should do with this fragment. Can be one of the following:
      * DataAppend
      * DataReplace
4. `Rows` is a two dimensional array which contains the fragment data.

## TableProgress

This frame can interleaved with the `TableFragment` frame described above.
It's sole purpose is to notify the client about the query progress.

```json
{
    "TableId": Number,
    "TableProgress": Number,
}
```

Where:

1. `TableId` is the table's unique id.
2. `TableProgress` is the progress in percent (0--100).

## TableCompletion

The `TableCompletion` frames marks the end of the table transmission. No more frames related to that table will be sent.

```json
{
    "TableId": Number,
    "RowCount": Number,
}
```    

Where:

1. `TableId` is the table's unique id.
2. `RowCount` is the final number of rows in the table.

## DataTable

Queries which are issued with the `EnableProgressiveQuery` flag set to false will not include any of the previous 4 frames (`TableHeader`, `TableFragment`, `TableProgress` and `TableCompletion`). Instead, each table in the data set will be transmitted using a single frame, the `DataTable` frame, which contains all the information the client needs in order to read the table.

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

1. `TableId` is the table's unique id.
2. `TableKind` is the table's kind, which can be one of the following:

      * PrimaryResult
      * QueryCompletionInformation
      * QueryTraceLog
      * QueryPerfLog
      * TableOfContents
      * QueryProperties
      * QueryPlan
      * Unknown
3. `TableName` is the table's name.
4. `Columns` is an array describing the table's schema:

```json
{
    "ColumnName": string,
    "ColumnType": string,
}
```
4. `Rows` is a two dimensional array which contains the table's data.


## DataSetCompletion

This is the final frame in the data set.
```json
{
    "HasErrors": Boolean,
    "Cancelled": Boolean,
    "OneApiErrors": Array,
}
```

Where:

1. `HasErrors` is true if the there were any errors generating the data set.
2. `Cancelled` is true if the request that lead to the generation of the data set was cancelled midway. 
3. `OneApiErrors` is only transmitted if `HasErrors` is true. For a description of the `OneApiErrors` format, see section 7.10.2 [here](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md).