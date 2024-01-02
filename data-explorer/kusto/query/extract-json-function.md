---
title:  extract_json()
description: Learn how to use the extract_json() function to get a specified element out of a JSON text using a path expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/30/2023
---
# extract_json()

Get a specified element out of a JSON text using a path expression.

Optionally convert the extracted string to a specific type.

> The `extract_json()` and `extractjson()` functions are equivalent

## Syntax

`extract_json(`*jsonPath*`,` *dataSource*`,` *type*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *jsonPath* | string | &check; | A [JSONPath](jsonpath.md) that defines an accessor into the JSON document.|
| *dataSource* | string | &check; | A JSON document.|
| *type* | string | | An optional type literal. If provided, the extracted value is converted to this type. For example, `typeof(long)` will convert the extracted value to a `long`.|

## Performance tips

* Apply where-clauses before using `extract_json()`.
* Consider using a regular expression match with [extract](extract-function.md) instead. This can run very much faster, and is effective if the JSON is produced from a template.
* Use `parse_json()` if you need to extract more than one value from the JSON.
* Consider having the JSON parsed at ingestion by declaring the type of the column to be [dynamic](scalar-data-types/dynamic.md).

## Returns

This function performs a [JSONPath](jsonpath.md) query into dataSource, which contains a valid JSON string, optionally converting that value to another type depending on the third argument.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHIKs7PU7BVUK9WykvMTVWyUlDyys/IU9JRUEpMB3GNDYDM5MySSpCUX2q5QmR+UbZSrbo1V0FRZl6JQmpFSVFickk8yBwNJRU9sCk6YGN1FEoqC1Lz0zSKS4BK0zU1rQHS+nnUcQAAAA" target="_blank">Run the query</a>

```kusto
let json = '{"name": "John", "age": 30, "city": "New York"}';
print extract_json("$.name", json, typeof(string));
```

**Output**

| print_0 |
|---|
| John |
