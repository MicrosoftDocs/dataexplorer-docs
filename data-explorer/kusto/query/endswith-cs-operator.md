---
title:  The case-sensitive endswith_cs string operator
description: Learn how to use the endswith_cs operator to filter a record set for data with a case-sensitive ending string. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/10/2023
---
# endswith_cs operator

Filters a record set for data with a case-sensitive ending string.

[!INCLUDE [endswith-operator-comparison](../../includes/endswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `endswith_cs` `(`*expression*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark:| The tabular input whose records are to be filtered. |
| *col* | `string` |  :heavy_check_mark: | The column to filter. |
| *expression* | `string` |  :heavy_check_mark: | The expression used to filter. |

## Returns

Rows in *T* for which the predicate is `true`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVYAIKdgqJOeX5pVoaCokVSoElySWpAJVlWekFqVCeAqpeSnF5ZklGfHJxQpKfo5KAE4M2OtQAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize Events = count() by State
| where State endswith_cs "NA"
```

**Output**

|State|Events|
|--|--|
|NORTH CAROLINA |1721|
|MONTANA |1230|
|INDIANA |1164|
|SOUTH CAROLINA| 915|
|LOUISIANA| 463|
|ARIZONA| 340|
