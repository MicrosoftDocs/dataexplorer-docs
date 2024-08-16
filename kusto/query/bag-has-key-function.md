---
title:  bag_has_key()
description: Learn how to use the bag_has_key() function to check if a dynamic property bag object contains a given key. 
ms.reviewer: afridman
ms.topic: reference
ms.date: 08/11/2024
---
# bag_has_key()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Checks whether a dynamic property bag object contains a given key.

## Syntax

`bag_has_key(`*bag*`,`*key*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *bag* | `dynamic` |  :heavy_check_mark: | The property bag to search. |
| *key* | `string` |  :heavy_check_mark: | The key for which to search.  Search for a nested key using the [JSONPath](jsonpath.md) notation. Array indexing isn't supported. |

## Returns

True or false depending on if the key exists in the bag.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcy8gtISK4WUyrzE3MxkTa5oLgUggHI1qtWzUysN1RWsFAyNjHUUQDwjdSsF9cSkZPVaTR1Cao2R1cZy1SikVpSk5qUoFKUWl+aUKNgqJCWmx2ckFscD1UJcArNDEwDPKMflogAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(input: dynamic)
[
    dynamic({'key1' : 123, 'key2': 'abc'}),
    dynamic({'key1' : 123, 'key3': 'abc'}),
]
| extend result = bag_has_key(input, 'key2')
```

**Output**

|input|result|
|---|---|
|{<br>  "key1": 123,<br>  "key2": "abc"<br>}|true<br>|
|{<br>  "key1": 123,<br>  "key3": "abc"<br>}|false<br>|

### Search using a JSONPath key

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2OwQqDMBBE7/mKPRTWQJAk3gL9EhGJGlqpTUUjGK3/3g3p7unN7DA72EDbTa4Y/bwFA0P09j32nNUMaP5YnPhyUaEBpSsBCTTBifPymRWCAbRdj+QkIVm4xwOvfFoR10pKAVrK5uKCNewLbg/OD7C4dZsC3KGzj/Zp15YC+RkK38rUVOYW/gOk4uu+rQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(input: dynamic)
[
    dynamic({'key1': 123, 'key2': {'prop1' : 'abc', 'prop2': 'xyz'}, 'key3': [100, 200]}),
]
| extend result = bag_has_key(input, '$.key2.prop1')
```

**Output**

|input|result|
|---|---|
|{<br>  "key1": 123,<br>  "key2": {<br>    "prop1": "abc",<br>    "prop2": "xyz"<br>  },<br>  "key3": [<br>    100,<br>    200<br>  ]<br>}|true<br>|
