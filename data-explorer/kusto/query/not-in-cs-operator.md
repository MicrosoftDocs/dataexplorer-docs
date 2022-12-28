---
title: The case-sensitive !in string operator - Azure Data Explorer
description: This article describes the case-sensitive !in string operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# !in operator

Filters a record set for data without a case-sensitive string.

[!INCLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `in` instead of `in~`.

If you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters at the start or end of a field, for faster results use `has` or `in`.

## Syntax

*T* `|` `where` *col* `!in` `(`*scalar_expr*`,` [*scalar_expr_2*`,` *scalar_expr3*`,` ... ]`)`
*T* `|` `where` *col* `!in` `(`*tabular_expr*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_expr* | scalar | | An expression or list of expressions to search for in *col*.|
| *tabular_expr* | string | | The name of a tabular expression that has a set of values. If the tabular expression has multiple columns, the first column is used.|

> [!NOTE]
> At least one *scalar_expr* or a single *tabular_expr* is required.

## Returns

Rows in *T* for which the predicate is `true`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzFPQUHLz8Q/ydHFU0lFQcnf1D3L3BDP9XMMVIv2DvJU0QbqS80vzSgDNxq+9SgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State !in ("FLORIDA", "GEORGIA", "NEW YORK") 
| count
```

**Output**

|Count|
|---|
|54291|
