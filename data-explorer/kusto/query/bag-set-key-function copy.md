---
title: bag_set_key() - Azure Data Explorer
description: Learn how to use the bag_set_key() function to . 
ms.reviewer: afridman
ms.topic: reference
ms.date: 12/06/2022
---
# bag_set_key()

bag_set_key() receives a `dynamic` property-bag, a key and a value. Then, the function sets the given key in the bag to the given value. The function will override any existing value in case the key already exists. 

## Syntax

`bag_set_key(`*bag*`,`*key*`,`*value*`)`

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *bag* | dynamic | &check; | The property bag to modify. |
| *key* | string | &check; | The key to insert to. Either a JSON path (you can use a nested key using the [JSONPath](jsonpath.md) notation) or if you want to set a key that's in the first level, then you can just provide its name, e.g. "name". Array indexing or root JSON path isn't supported. |
| *value* | any scalar data type | &check; | . |

## Returns



## Example

<!-- csl: https://help.kusto.windows.net/Samples -->