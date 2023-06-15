---
ms.topic: include
ms.date: 06/15/2023
---

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression, sometimes called the outer table, whose rows are to be merged. Denoted as `$left`.|
|*RightTable*|string|&check;|The right table or tabular expression, sometimes called the inner table, whose rows are to be merged. Denoted as `$right`.|
|*Attributes*|string|&check;|One or more comma-separated rules that describe how rows from *LeftTable* are matched to rows from *RightTable*. Multiple rules are evaluated using the `and` logical operator. See [Attributes](#attributes).|
|*Hints*|string||Zero or more space-separated hint properties in the form of *Name* `=` *Value* that control the behavior of the row-match operation and execution plan. See [Join hints](#join-hints).

### Attributes

The *Attributes* parameter specifies how rows from the *LeftTable* are matched with rows from the *RightTable*. There are two options:

* Compare values of columns with the same name in both tables. Syntax: *ColumnName*.
* Compare values of columns with different names in the left and right tables. Use `$left.` and `$right.` to qualify the column names. Syntax: `$left.`*LeftColumn* `==` `$right.`*RightColumn*.

### Join hints

| Parameters name | Values | Description |
|--|--|--|
| `hint.remote` | `auto`, `left`, `local`, `right` | See [Cross-Cluster Join](../query/joincrosscluster) |
| `hint.strategy=broadcast` | Specifies the way to share the query load on cluster nodes. | See [broadcast join](../query/broadcastjoin.md) |
| `hint.shufflekey=<key>` | The `shufflekey` query shares the query load on cluster nodes, using a key to partition data. | See [shuffle query](../query/shufflequery.md) |
| `hint.strategy=shuffle` | The `shuffle` strategy query shares the query load on cluster nodes, where each node will process one partition of the data. | See [shuffle query](../query/shufflequery.md) |
