---
title:  buildschema() (aggregation function)
description: Learn how to use the buildschema() function to build a table schema from a dynamic expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# buildschema() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Builds the minimal schema that admits all values of *DynamicExpr*.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`buildschema` `(`*DynamicExpr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*DynamicExpr*| `dynamic` |  :heavy_check_mark: | Expression used for the aggregation calculation.

## Returns

Returns the minimal schema that admits all values of *DynamicExpr*.

> [!TIP]
> If the input is a JSON string, use the [parse_json()](parse-json-function.md) function to convert the JSON to a [dynamic](scalar-data-types/dynamic.md) value. Otherwise, an error might occur.

## Examples

The following example builds a schema based on:

* `{"x":1, "y":3.5}`
* `{"x":"somevalue", "z":[1, 2, 3]}`
* `{"y":{"w":"zzz"}, "t":["aa", "bb"], "z":["foo"]}`

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WOQQrCMBBF9z3F8FctBEGLm1ylZDFpIgYSA7ZVm9q7O2p3nVkN/73POB5lbfT1g+PkNbn5xin0DXUVyWxnveAFfVSEGbo9nNdG7WMMOflfDQQs0J0IJ0Wt2eNSs+ApTikFq+Cj4GD+mtbCbAW45AzRK1O9aZhS4nsonuwUohv6q0/8/7v5AOnXbR3IAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(value: dynamic) [
    dynamic({"x":1, "y":3.5}),
    dynamic({"x":"somevalue", "z":[1, 2, 3]}),
    dynamic({"y":{"w":"zzz"}, "t":["aa", "bb"], "z":["foo"]})
]
| summarize buildschema(value)
```

**Output**

|schema_value|
|--|
|{"x":["long","string"],"y":["double",{"w":"string"}],"z":{"`indexer`":["long","string"]},"t":{"`indexer`":"string"}}|

### Schema breakdown

In the resulting schema:

* The root object is a container with four properties named `x`, `y`, `z`, and `t`.
* Property `x` is either type *long* or type *string*.
* Property `y` is either type *double* or another container with a property `w` of type *string*.
* Property `z` is an array, indicated by the `indexer` keyword, where each item can be either type *long* or type *string*.
* Property  `t` is an array, indicated by the `indexer` keyword, where each item is a *string*.  
* Every property is implicitly optional, and any array might be empty.

## Related content

* [Best practices for schema management](../management/management-best-practices.md)
* [getschema operator](getschema-operator.md)
* [infer_storage_schema plugin](infer-storage-schema-plugin.md)
