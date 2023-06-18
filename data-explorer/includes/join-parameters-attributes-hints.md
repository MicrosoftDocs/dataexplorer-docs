---
ms.topic: include
ms.date: 06/18/2023
---

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression, sometimes called the outer table, whose rows are to be merged. Denoted as `$left`.|
|*Hints*|string||Zero or more space-separated join hints in the form of *Name* `=` *Value* that control the behavior of the row-match operation and execution plan. For more information, see [Hints](#hints).
|*RightTable*|string|&check;|The right table or tabular expression, sometimes called the inner table, whose rows are to be merged. Denoted as `$right`.|
|*Conditions*|string|&check;|Determines how rows from *LeftTable* are matched with rows from *RightTable*. If the columns to match have the same name in both tables, use the *ColumnName*. If the column names differ, use the syntax `$left.`*LeftColumn* `==` `$right.`*RightColumn*.</br></br>To define multiple conditions, separate them with commas or use the `and` keyword. The conditions are evaluated using the "and" logical operator.|

> [!TIP]
> For best performance, if one table is always smaller than the other, use it as the left side of the join.

### Hints

| Parameters name | Values | Description |
|--|--|--|
| `hint.remote` | `auto`, `left`, `local`, `right` | See [Cross-Cluster Join](../kusto/query/joincrosscluster.md) |
| `hint.strategy=broadcast` | Specifies the way to share the query load on cluster nodes. | See [broadcast join](../kusto/query/broadcastjoin.md) |
| `hint.shufflekey=<key>` | The `shufflekey` query shares the query load on cluster nodes, using a key to partition data. | See [shuffle query](../kusto/query/shufflequery.md) |
| `hint.strategy=shuffle` | The `shuffle` strategy query shares the query load on cluster nodes, where each node will process one partition of the data. | See [shuffle query](../kusto/query/shufflequery.md) |
