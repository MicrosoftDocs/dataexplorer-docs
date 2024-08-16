---
title:  pack_all()
description: Learn how to use the pack_all() function to create a dynamic object from all the columns of the tabular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# pack_all()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a [dynamic](scalar-data-types/dynamic.md) property bag object from all the columns of the tabular expression.

> [!NOTE]
> The representation of the returned object isn't guaranteed to be byte-level-compatible between runs. For example, properties that appear in the bag may appear in a different order.

## Syntax

`pack_all(`[ *ignore_null_empty* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ignore_null_empty* | `bool` | | Indicates whether to ignore null/empty columns and exclude them from the resulting property bag. The default value is `false`.|

## Example

The following query will use `pack_all()` to create columns for the below table.

|SourceNumber |TargetNumber| CharsCount
|---|---|---
|555-555-1234 |555-555-1212 | 46
|555-555-1234 |555-555-1213 | 50
|555-555-1313 | | 42
| |555-555-3456 | 74

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32PsQrCMBCG9zxFtrRwgm2SCgWn4uAigm4ikrZHFNOkpCko+PCmIFgXOY6f+/j+4VoV4tQGk4MbfYO7savRl0PwN6vhqLzG8Muqq/JD5UYbSuOsTsmJMCnlYtos54LB7MxyBqKAfwZnIJdzg0+IxV4OlLCZzIUsGKwEJWfyovgIaFu6V80d23Uf46KMSVL4oK22zsd/jNl0fXh+jeBHTN/V81O7+AAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(SourceNumber:string,TargetNumber:string,CharsCount:long)
[
'555-555-1234','555-555-1212',46,
'555-555-1234','555-555-1213',50,
'555-555-1313','',42, 
'','555-555-3456',74 
]
| extend Packed=pack_all(), PackedIgnoreNullEmpty=pack_all(true)
```

**Output**

|SourceNumber |TargetNumber | CharsCount | Packed |PackedIgnoreNullEmpty
|---|---|---|---|---
|555-555-1234 |555-555-1212 | 46 |{"SourceNumber":"555-555-1234", "TargetNumber":"555-555-1212", "CharsCount": 46} | {"SourceNumber":"555-555-1234", "TargetNumber":"555-555-1212", "CharsCount": 46}
|555-555-1234 |555-555-1213 | 50 |{"SourceNumber":"555-555-1234", "TargetNumber":"555-555-1213", "CharsCount": 50} | {"SourceNumber":"555-555-1234", "TargetNumber":"555-555-1213", "CharsCount": 50}
|555-555-1313 | | 42 | {"SourceNumber":"555-555-1313", "TargetNumber":"", "CharsCount": 42} | {"SourceNumber":"555-555-1313", "CharsCount": 42}
| |555-555-3456 | 74 | {"SourceNumber":"", "TargetNumber":"555-555-3456", "CharsCount": 74} | {"TargetNumber":"555-555-3456", "CharsCount": 74}

> [!NOTE]
> There is a difference between the *Packed* and the *PackedIgnoreNullEmpty* columns in the last two rows of the above example. These two rows included empty values that were ignored by *pack_all(true)*.
