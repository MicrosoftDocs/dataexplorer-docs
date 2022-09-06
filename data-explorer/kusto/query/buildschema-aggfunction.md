---
title: buildschema() (aggregation function) - Azure Data Explorer
description: This article describes buildschema() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/06/2022
---
# buildschema() (aggregation function)

Builds the minimal schema that admits all values of *DynamicExpr*.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`buildschema` `(`*DynamicExpr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
|*DynamicExpr*| dynamic | &check; | Expression used for the aggregation calculation.

## Returns

Returns the minimal schema that admits all values of *DynamicExpr*.

> [!TIP]
> If `buildschema(json_column)` gives a syntax error:
>
> > *Is your `json_column` a string rather than a dynamic object?*
>
> then use `buildschema(parsejson(json_column))`.

## Example

Assume the input column has three dynamic values.

* `{"x":1, "y":3.5}`
* `{"x":"somevalue", "z":[1, 2, 3]}`
* `{"y":{"w":"zzz"}, "t":["aa", "bb"], "z":["foo"]}`

The resulting schema would be:

```kusto
{
    "x":["long", "string"],
    "y":["double", {"w": "string"}],
    "z":{"`indexer`": ["long", "string"]},
    "t":{"`indexer`": "string"}
}
```

The schema tells us that:

* The root object is a container with four properties named x, y, z, and t.
* The property called "x" that could be of type "long" or of type "string".
* The property called "y" that could be of type "double", or another container with a property called "w" of type "string".
* The ``indexer`` keyword indicates that "z" and "t" are arrays.
* Each item in the array "z" is of type "long" or of type "string".
* "t" is an array of strings.
* Every property is implicitly optional, and any array may be empty.

### Schema model

The syntax of the returned schema is:

```output
Container ::= '{' Named-type* '}';
Named-type ::= (name | '"`indexer`"') ':' Type;
Type ::= Primitive-type | Union-type | Container;
Union-type ::= '[' Type* ']';
Primitive-type ::= "long" | "string" | ...;
```

The values are equivalent to a subset of the TypeScript type annotations, encoded as a Kusto dynamic value.
In Typescript, the example schema would be:

```typescript
var someobject:
{
    x?: (number | string),
    y?: (number | { w?: string}),
    z?: { [n:number] : (long | string)},
    t?: { [n:number]: string }
}
```
