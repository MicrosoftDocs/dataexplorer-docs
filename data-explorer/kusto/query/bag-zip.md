---
title:  bag_zip() 
description: Learn how to use bag_zip() to merge two dynamic arrays into a single property-bag of keys and values.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 08/11/2024
---
# bag_zip()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a dynamic property-bag from two input dynamic arrays. In the resulting property-bag, the values from the first input array are used as the property keys, while the values from the second input array are used as corresponding property values.

## Syntax

`bag_zip(`*KeysArray*`,` *ValuesArray*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *KeysArray* | `dynamic` |  :heavy_check_mark: | An array of strings. These strings represent the property names for the resulting property-bag.|
| *ValuesArray* | `dynamic` |  :heavy_check_mark: | An array whose values will be the property values for the resulting property-bag.|

> [!NOTE]
>
> * If there are more keys than values, missing values are filled with null.
> * If there are more values than keys, values with no matching keys are ignored.
> * Keys that aren't strings are ignored.

## Returns

Returns a [dynamic](scalar-data-types/dynamic.md) property-bag.

## Examples

The following example shows how to use `bag_zip()` to create a property-bag from two arrays. The first array contains the keys, and the second array contains the values. The resulting property-bag contains the keys and values zipped together.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVgoplXmJuZnJOgphiTmlqWiimgrRvFwKQADla0SrJ6rrKKgngYhk9VhNHYSMIVDICChurGcSq8nLFWvNywWyl5erRiG1oiQ1L0XBL7XcKTEd6JCkxPT4qswChDNQbNcEAJQm8tKzAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic(['a', 'b', 'c']), dynamic([1, '2', 3.4])
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

| KeysArray | ValuesArray | NewBag |
|--|--|--|
| ['a','b','c'] | [1,'2',3.4] | {'a': 1,'b': '2','c': 3.4} |

The following example shows how to use `bag_zip()` when the arrays have different lengths. In this case, the resulting property-bag contains null values for the missing keys.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVgoplXmJuZnJOgphiTmlqWiimgrRvFwKQADla0SrJ6rrKKgngYhk9VhNHYSMIVDICCjEyxVrzcsFspKXq0YhtaIkNS9FwS+13CkxHeiGpMT0+KrMAoQLUCzWBAB4QDzurgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic(['a', 'b', 'c']), dynamic([1, '2'])
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

| KeysArray | ValuesArray | NewBag |
|--|--|--|
| ['a','b','c'] | [1,'2'] | {'a': 1,'b': '2','c': null} |

The following example shows how to use `bag_zip()` when the arrays have different lengths. In this case, the resulting property-bag contains null values for the missing keys.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVgoplXmJuZnJOgphiTmlqWiimgrRvFwKQADla0SrJ6rrKKgnqcdq6iAEDYFCRkBxIz3TWE1erlhrXi6QlbxcNQqpFSWpeSkKfqnlTonpQDckJabHV2UWIFyAYrEmAMOF9yWuAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic(['a', 'b']), dynamic([1, '2', 2.5])
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

| KeysArray | ValuesArray | NewBag |
|--|--|--|
| ['a','b'] | [1,'2',2.5] | {'a': 1,'b': '2'} |

The following example demonstrates how `bag_zip()` handles cases where the keys array contains non-string values. Any key that isn't a string is excluded from the resulting property-bag.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVimVeYm5mck6CmGJOaWpqIIKmgrRUKZGtHqiuo6FjnqSeqymjgJc1FBHQd1IXUfBSM80VjPWmpcLZBUvV41CakVJal6Kgl9quVNiOtDupMT0+KrMAoTNKDZqAgBG9LZkpgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic(['a', 8, 'b']), dynamic([1, '2', 2.5])
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

| KeysArray | ValuesArray | NewBag |
|--|--|--|
| ['a',8,'b'] | [1,'2',2.5] | {'a': 1,'b': 2.5} |

The following example demonstrates how `bag_zip()` behaves when the parameter intended to be an array of values is not actually an array. In this case, all resulting property values are set to null.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVgoplXmJuZnJOgphiTmlqWiimgrRvFwKQADla0SrJ6rrKFjoKKgnqcdq6sDFDTV5uWKteblANvFy1SikVpSk5qUo+KWWOyWmA61OSkyPr8osQFiMYp8mAJSpx+ClAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic(['a', 8, 'b']), dynamic(1)
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

| KeysArray | ValuesArray | NewBag |
|--|--|--|
| ['a',8,'b'] | 1 | {'a': null,'b': null} |

The following example demonstrates how `bag_zip()` behaves when the parameter intended to be an array of keys is not actually an array. In this case, the resulting property-bag is null.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwSSxJVLBVSAFSJYlJOaka3qmVxY5FRYmVVgoplXmJuZnJOgphiTmlqWiimgrRvFwKQADla6gnqmvqwHnRhjoK6kbqOgpGeqaxmrxcsda8XCC7eLlqFFIrSlLzUhT8UsudEtOBliclpsdXZRYgrEaxURNJi2cxRJNrbkFJpW1mcV5pTo4GREgTACOl4ijOAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Data = datatable(KeysArray: dynamic, ValuesArray: dynamic) [
    dynamic('a'), dynamic([1, '2', 2.5])
];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
| extend IsNewBagEmpty=isnull(NewBag)
```

| KeysArray | ValuesArray | NewBag | IsNewBagEmpty |
|--|--|--|
| a | [1,'2',2.5] | | TRUE |

## Related content

* [zip function](zip-function.md)
