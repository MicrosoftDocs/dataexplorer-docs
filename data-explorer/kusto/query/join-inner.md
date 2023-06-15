---
title:  inner join
description: Learn how to use the inner join flavor to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/15/2023
---

# inner join

The inner-join flavor is like the standard inner-join from the SQL world. An output record is produced whenever a record on the left side has the same join key as the record on the right side.

:::image type="icon" source="images/joinoperator/join-inner.png" border="false":::

## Syntax

*LeftTable* `|` `join` `kind=inner` [ *Hints* ] *RightTable* `on` *Attributes*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression, sometimes called the outer table, whose rows are to be merged. Denoted as `$left`.|
|*RightTable*|string|&check;|The right table or tabular expression, sometimes called the inner table, whose rows are to be merged. Denoted as `$right`.|
|*Attributes*|string|&check;|One or more comma-separated rules that describe how rows from *LeftTable* are matched to rows from *RightTable*. Multiple rules are evaluated using the `and` logical operator. See [Rules](#rules).|
|*Hints*|string||Zero or more space-separated hint properties in the form of *Name* `=` *Value* that control the behavior of the row-match operation and execution plan. See [Join hints](#join-hints).

### Rules

| Rule | Syntax | Equivalent predicate |
|---|---|---|
| Equality by name | *ColumnName* | `where` *LeftTable*.*ColumnName* `==` *RightTable*.*ColumnName* |
| Equality by value | `$left.`*LeftColumn* `==` `$right.`*RightColumn* | `where` `$left.`*LeftColumn* `==` `$right.`*RightColumn* |

> [!NOTE]
> For 'equality by value', the column names *must* be qualified with the applicable owner table denoted by `$left` and `$right` notations.

### Join hints

| Parameters name | Values | Description |
|--|--|--|
| `hint.remote` | `auto`, `left`, `local`, `right` | See [Cross-Cluster Join](joincrosscluster.md) |
| `hint.strategy=broadcast` | Specifies the way to share the query load on cluster nodes. | See [broadcast join](broadcastjoin.md) |
| `hint.shufflekey=<key>` | The `shufflekey` query shares the query load on cluster nodes, using a key to partition data. | See [shuffle query](shufflequery.md) |
| `hint.strategy=shuffle` | The `shuffle` strategy query shares the query load on cluster nodes, where each node will process one partition of the data. | See [shuffle query](shufflequery.md) |

## Returns

Returns all matching records from left and right sides.

The output schema contains a column for every column in each of the two tables, including the matching keys. The columns of the right side will be automatically renamed if there are name clashes.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIULBVSEksAcKknFQN79RKq+KSosy8dB2FsMSc0lRDq5z8vHRNrmguBSBQT1TXMdSBMJPUdYwQTGMoM1tdxxTKTFbXMeGKtebKAdoSid8WI1RbgOYZGiBMMUJiG8PYKUDTDZAsNQBZFaFQo5CVn5mnkJ2Zl2KbmZeXWgS0Oj9PAWgjAEho/dHtAAAA" target="_blank">Run the query</a>

```kusto
let X = datatable(Key:string, Value1:long)
[
    'a',1,
    'b',2,
    'b',3,
    'k',5,
    'c',4
];
let Y = datatable(Key:string, Value2:long)
[
    'b',10,
    'c',20,
    'c',30,
    'd',40,
    'k',50
];
X | join kind=inner Y on Key
```

**Output**

|Key|Value1|Key1|Value2|
|---|---|---|---|
|b|3|b|10|
|b|2|b|10|
|c|4|c|20|
|c|4|c|30|
|k|5|k|50|

> [!NOTE]
>
> * (b,10) from the right side, was joined twice: with both (b,2) and (b,3) on the left.
> * (c,4) on the left side, was joined twice: with both (c,20) and (c,30) on the right.
> * (k,5) from the left and (k, 50) from the right was joined once.

## See also

* Learn about other [join flavors](joinoperator.md#join-flavors)
