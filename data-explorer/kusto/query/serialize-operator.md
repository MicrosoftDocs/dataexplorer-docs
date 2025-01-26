---
title:  serialize operator
description: Learn how to use the serialize operator to mark the input row set as serialized and ready for window functions.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---
# serialize operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Marks that the order of the input row set is safe to use for window functions.

The operator has a declarative meaning. It marks the input row set as serialized (ordered), so that [window functions](window-functions.md) can be applied to it.

## Syntax

`serialize` [*Name1* `=` *Expr1* [`,` *Name2* `=` *Expr2*]...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Name* | `string` | | The name of the column to add or update. If omitted, the output column name is automatically generated. |
| *Expr* | `string` |  :heavy_check_mark: | The calculation to perform over the input.|

## Examples

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

### Serialize subset of rows by condition

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAAwspSkxO9clPL+blqlEoz0gtSlVwzslMzSsJSi0sTS0u8UxRsLVVUDJNtDCxSDM30LW0tDTTTU0yNNc1NE1N0TUyTLJITbI0SUozSFUCGVGcWpSZmJNZlQoAv59YuFkAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
TraceLogs
| where ClientRequestId == "5a848f70-9996-eb17-15ed-21b8eb94bf0e"
| serialize
```

**Output**

This table only shows the top 5 query results.

| Timestamp | Node | Component | ClientRequestId | Message |
|--|--|--|--|--|
| 2014-03-08T12:24:55.5464757Z | Engine000000000757 | INGESTOR_GATEWAY | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | $$IngestionCommand table=fogEvents format=json |
| 2014-03-08T12:24:56.0929514Z | Engine000000000757 | DOWNLOADER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | Downloading file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_0.json.gz"" |
| 2014-03-08T12:25:40.3574831Z | Engine000000000341 | INGESTOR_EXECUTER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | IngestionCompletionEvent: finished ingestion file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_0.json.gz"" |
| 2014-03-08T12:25:40.9039588Z | Engine000000000341 | DOWNLOADER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | Downloading file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_1.json.gz"" |
| 2014-03-08T12:26:25.1684905Z | Engine000000000057 | INGESTOR_EXECUTER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | IngestionCompletionEvent: finished ingestion file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_1.json.gz"" |
|...|...|...|...|...|

### Add row number to the serialized table

To add a row number to the serialized table, use the [row_number()](row-number-function.md) function.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAAwspSkxO9clPL+blqlEoScxOVTA0AADDD5pUFAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
TraceLogs
| where ClientRequestId == "5a848f70-9996-eb17-15ed-21b8eb94bf0e"
| serialize rn = row_number()
```

**Output**

This table only shows the top 5 query results.

| Timestamp | rn | Node | Component | ClientRequestId | Message |
|--|--|--|--|--|--|
| 2014-03-08T13:00:01.6638235Z | 1 | Engine000000000899 | INGESTOR_EXECUTER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | IngestionCompletionEvent: finished ingestion file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_46.json.gz"" |
| 2014-03-08T13:00:02.2102992Z | 2 | Engine000000000899 | DOWNLOADER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | Downloading file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_47.json.gz"" |
| 2014-03-08T13:00:46.4748309Z | 3 | Engine000000000584 | INGESTOR_EXECUTER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | IngestionCompletionEvent: finished ingestion file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_47.json.gz"" |
| 2014-03-08T13:00:47.0213066Z | 4 | Engine000000000584 | DOWNLOADER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | Downloading file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_48.json.gz"" |
| 2014-03-08T13:01:31.2858383Z | 5 | Engine000000000380 | INGESTOR_EXECUTER | 5a848f70-9996-eb17-15ed-21b8eb94bf0e | IngestionCompletionEvent: finished ingestion file path: ""https://benchmarklogs3.blob.core.windows.net/benchmark/2014/IMAGINEFIRST0_1399_48.json.gz"" |
|...|...|...|...|...|

## Serialization behavior of operators

The output row set of the following operators is marked as serialized.

* [getschema](getschema-operator.md)
* [range](range-operator.md)
* [sort](sort-operator.md)
* [top](top-operator.md)
* [top-hitters](top-hitters-operator.md)

The output row set of the following operators is marked as nonserialized.

* [count](count-operator.md)
* [distinct](distinct-operator.md)
* [evaluate](evaluate-operator.md)
* [facet](facet-operator.md)
* [join](join-operator.md)
* [make-series](make-series-operator.md)
* [mv-expand](mv-expand-operator.md)
* [reduce by](reduce-operator.md)
* [sample](sample-operator.md)
* [sample-distinct](sample-distinct-operator.md)
* [summarize](summarize-operator.md)
* [top-nested](top-nested-operator.md)

All other operators preserve the serialization property. If the input row set is serialized, then the output row set is also serialized.
