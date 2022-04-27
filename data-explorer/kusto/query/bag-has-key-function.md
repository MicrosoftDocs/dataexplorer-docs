---
title: bag_has_key() - Azure Data Explorer
description: This article describes bag_has_key() in Azure Data Explorer.
ms.reviewer: afridman
ms.topic: reference
ms.date: 04/27/2022
---
# bag_has_key()

Determines whether a column contains a key.

## Syntax

`bag_has_key(`*bag*`, `*key*`)`

## Arguments

* *bag*: `dynamic` property-bag input.
* *key*: `string` property-key input.
You can specify a key on the nested levels using [JSONPath](jsonpath.md) notation.

## Returns

True or false depending on if the key exists in the column.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(input:dynamic)
[
    dynamic({'key1' : 123, 'key2': 'abc'}),
    dynamic({'key1' : 123, 'key3': 'abc'}),
]
| extend result=bag_has_key(input, 'key2')
```

|input|result|
|---|---|
|{<br>  "key1": 123,<br>  "key2": "abc"<br>}|true<br>|
|{<br>  "key1": 123,<br>  "key3": "abc"<br>}|false<br>|

### Search a key in a JSONPath notation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(input:dynamic)
[
    dynamic({'key1': 123, 'key2': {'prop1' : 'abc', 'prop2': 'xyz'}, 'key3': [100, 200]}),
]
| extend result=bag_has_key(input, '$.key2.prop1')
```

|input|result|
|---|---|
|{<br>  "key1": 123,<br>  "key2": {<br>    "prop1": "abc",<br>    "prop2": "xyz"<br>  },<br>  "key3": [<br>    100,<br>    200<br>  ]<br>}|true<br>|
