---
title:  innerunique join
description: Learn how to use the innerunique join flavor to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/15/2023
---

# innerunique join

The innerunique join flavor removes duplicate keys from the left side. This behavior ensures that the output contains a row for every combination of unique left and right keys.

By default, the innerunique join flavor is used if the `kind` parameter isn't specified. This default implementation is particularly useful in log/trace analysis scenarios, where you aim to correlate two events based on a shared correlation ID. It allows you to retrieve all instances of the phenomenon while disregarding duplicate trace records that contribute to the correlation.

## Syntax

*LeftTable* `|` `join` `kind=innerunique` [ *Hints* ] *RightTable* `on` *Attributes*

[!INCLUDE [join-parameters-attributes-hints](../../includes/join-parameters-attributes-hints.md)]

## Returns

Only one row from the left side is matched for each value of the on key. The output contains a row for each match of this row with rows from the right.

The output schema contains column for every column in each of the two tables, including the matching keys. The columns of the right side will be automatically renamed if there are name clashes.

## Examples

### Use the default innerunique join

```kusto
X | join Y on Key
```

The following two sample tables are used to explain the operation of the join.

**Table X**

|Key |Value1
|---|---
|a |1
|b |2
|b |3
|c |4

**Table Y**

|Key |Value2
|---|---
|b |10
|c |20
|c |30
|d |40

The query executes the default join, which is an inner join after deduplicating the left side based on the join key. The deduplication keeps only the first record.

Considering the statement `X | join Y on Key`, the resulting left side of the join, after deduplication, would be:

|Key |Value1
|---|---
|a |1
|b |2
|c |4

and the result of the join would be:

```kusto
let X = datatable(Key:string, Value1:long)
[
    'a',1,
    'b',2,
    'b',3,
    'c',4
];
let Y = datatable(Key:string, Value2:long)
[
    'b',10,
    'c',20,
    'c',30,
    'd',40
];
X | join Y on Key
```

**Output**

|Key|Value1|Key1|Value2|
|---|---|---|---|
|b|2|b|10|
|c|4|c|20|
|c|4|c|30|

> [!NOTE]
> The keys 'a' and 'd' don't appear in the output, since there were no matching keys on both left and right sides.

### Two possible outputs from innerunique join

> [!NOTE]
> **innerunique flavor** may yield two possible outputs and both are correct.
    In the first output, the join operator randomly selected the first key that appears in t1, with the value "val1.1" and matched it with t2 keys.
    In the second output, the join operator randomly selected the second key that appears in t1, with the value "val1.2" and matched it with t2 keys.

```kusto
let t1 = datatable(key:long, value:string)  
[
1, "val1.1",  
1, "val1.2"  
];
let t2 = datatable(key:long, value:string)  
[  
1, "val1.3",
1, "val1.4"  
];
t1
| join kind = innerunique
    t2
on key
```

**Output**

|key|value|key1|value1|
|---|---|---|---|
|1|val1.1|1|val1.3|
|1|val1.1|1|val1.4|

```kusto
let t1 = datatable(key:long, value:string)  
[
1, "val1.1",  
1, "val1.2"  
];
let t2 = datatable(key:long, value:string)  
[  
1, "val1.3", 
1, "val1.4"  
];
t1
| join kind = innerunique
    t2
on key
```

**Output**

|key|value|key1|value1|
|---|---|---|---|
|1|val1.2|1|val1.3|
|1|val1.2|1|val1.4|

* Kusto is optimized to push filters that come after the `join`, towards the appropriate join side, left or right, when possible.
* Sometimes, the flavor used is **innerunique** and the filter is propagated to the left side of the join. The flavor will be automatically propagated and the keys that apply to that filter will always appear in the output.
* Use the example above and add a filter `where value == "val1.2" `. It will always give the second result and will never give the first result for the datasets:

```kusto
let t1 = datatable(key:long, value:string)  
[
1, "val1.1",  
1, "val1.2"  
];
let t2 = datatable(key:long, value:string)  
[  
1, "val1.3", 
1, "val1.4"  
];
t1
| join kind = innerunique
    t2
on key
| where value == "val1.2"
```

**Output**

|key|value|key1|value1|
|---|---|---|---|
|1|val1.2|1|val1.3|
|1|val1.2|1|val1.4|
