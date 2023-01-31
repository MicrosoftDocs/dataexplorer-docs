---
title: The case-insensitive in~ string operator - Azure Data Explorer
description: Learn how to use the in~ operator to filter data with a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# in~ operator

Filters a record set for data with a case-insensitive string.

[!INCLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use the case-sensitive [in](in-cs-operator.md).

## Syntax

*T* `|` `where` *col* `has_any` `(`*scalar_values*`)`

*T* `|` `where` *col* `in~` `((`*tabular_expression*`))`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_values* | scalar | &check; | A single value or comma-separated set of values to search for in *col*.|
| *tabular_expression* | string | &check; | A tabular expression that produces a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used. The *tabular_expr* can produce up to 1,000,000 distinct results.|

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVcjMq1PQUHLz8Q/ydHFU0lFQSk/NL0rPTAQx/VzDFSL9g7yVNEG6kvNL80oAl8ORJUoAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State in~ ("FLORIDA", "georgia", "NEW YORK") 
| count
```

**Output**

|Count|
|---|
|4775|  
