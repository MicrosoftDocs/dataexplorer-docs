---
title: bag_zip() - Azure Data Explorer 
description: Learn how to use bag_zip() to merge two dynamic arrays into a single property-bag of keys and values.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 04/05/2023
---
# bag_zip()

The bag_zip function accepts 2 `dynamic` arrays, and returns a `dynamic` property-bag that zips the properties and values from the input arrays.

## Syntax

`bag_zip(KeysArray, ValuesArray)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *KeysArray* | dynamic | &check; | An array of strings. These strings represent the property names for the resulting property-bag.|
| *ValuesArray* | dynamic | &check; | An array whose values will be the property values for the resulting property-bag.|

## Returns

Returns a `dynamic` property-bag.

## Examples

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic(['a','b','c']), dynamic([1, '2', 3.4])];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

|result|
|---|
KeysArray ValuesArray NewBag
['a','b','c'] [1,'2',3.4] {'a': 1,'b': '2','c': 3.4}

If there are more keys than values, missing values are filled with nulls:
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic(['a','b','c']), dynamic([1, '2'])];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

|result|
|---|
KeysArray ValuesArray NewBag
['a','b','c'] [1,'2'] {'a': 1,'b': '2','c': null}

If there are more values than keys, values with no matching keys are ignored:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic(['a','b']), dynamic([1, '2', 2.5])];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

|result|
|---|
KeysArray ValuesArray NewBag
['a','b'] [1,'2',2.5] {'a': 1,'b': '2'}

Keys that aren't strings are ignored:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic(['a',8,'b']), dynamic([1, '2', 2.5])];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

|result|
|---|
KeysArray ValuesArray NewBag
['a',8,'b'] [1,'2',2.5] {'a': 1,'b': 2.5}

If values parameter isn't an array, all values are filled with nulls:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic(['a',8,'b']), dynamic(1)];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
```

|result|
|---|
KeysArray ValuesArray NewBag
['a',8,'b'] 1 {'a': null,'b': null}

If keys parameter isn't an array, resulting property-bag are null:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Data = datatable(KeysArray:dynamic, ValuesArray:dynamic ) [dynamic('a'), dynamic([1, '2', 2.5])];
Data
| extend NewBag = bag_zip(KeysArray, ValuesArray)
| extend IsNewBagEmpty=isnull(NewBag)
```

|result|
|---|
KeysArray ValuesArray NewBag IsNewBagEmpty
a [1,'2',2.5]  TRUE

## See also

* [zip function](zipfunction.md)
