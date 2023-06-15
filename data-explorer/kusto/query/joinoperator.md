---
title:  join operator
description: Learn how to use the join operator to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/15/2023
ms.localizationpriority: high 
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# join operator

Merge the rows of two tables to form a new table by matching values of the specified columns from each table.

## Syntax

*LeftTable* `|` `join` [ *JoinParameters* ] `(`*RightTable*`)` `on` *Attributes*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression, sometimes called the outer table, whose rows are to be merged. Denoted as `$left`.|
|*RightTable*|string|&check;|The right table or tabular expression, sometimes called the inner table, whose rows are to be merged. Denoted as `$right`.|
|*Attributes*|string|&check;|One or more comma-separated rules that describe how rows from *LeftTable* are matched to rows from *RightTable*. Multiple rules are evaluated using the `and` logical operator. See [Attributes](#attributes).|
|*JoinParameters*|string||Zero or more space-separated parameters in the form of *Name* `=` *Value* that control the behavior of the row-match operation and execution plan. See [Supported parameters](#supported-parameters).

### Attributes

The *Attributes* parameter specifies how rows from the *LeftTable* are matched with rows from the *RightTable*. There are two options:

* Compare values of columns with the same name in both tables. Syntax: *ColumnName*.
* Compare values of columns with different names in the left and right tables. Use `$left.` and `$right.` to qualify the column names. Syntax: `$left.`*LeftColumn* `==` `$right.`*RightColumn*.

### Supported parameters

::: zone pivot="azuredataexplorer, fabric"

|Parameters name |Values |Description  |
|---|---|---|
|`kind`|`innerunique`, `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`|See [Join Flavors](#join-flavors)|
|`hint.remote`  |`auto`, `left`, `local`, `right` |See [Cross-Cluster Join](joincrosscluster.md)|
|`hint.strategy=broadcast` |Specifies the way to share the query load on cluster nodes. |See [broadcast join](broadcastjoin.md) |
|`hint.shufflekey=<key>` |The `shufflekey` query shares the query load on cluster nodes, using a key to partition data. |See [shuffle query](shufflequery.md) |
|`hint.strategy=shuffle` |The `shuffle` strategy query shares the query load on cluster nodes, where each node will process one partition of the data. |See [shuffle query](shufflequery.md)  |

::: zone-end

::: zone pivot="azuremonitor"

|Name |Values |Description |
|---|---|---|
|`kind`         |`innerunique`, `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`|See [Join Flavors](#join-flavors)|
|`hint.remote`  |`auto`, `left`, `local`, `right`   | |
|`hint.strategy=broadcast` |Specifies the way to share the query load on cluster nodes. |See [broadcast join](broadcastjoin.md) |
|`hint.shufflekey=<key>` |The `shufflekey` query shares the query load on cluster nodes, using a key to partition data. |See [shuffle query](shufflequery.md) |
|`hint.strategy=shuffle` |The `shuffle` strategy query shares the query load on cluster nodes, where each node will process one partition of the data. |See [shuffle query](shufflequery.md)  |

::: zone-end

> [!NOTE]
>
> * If `kind` isn't specified, the default join flavor is `innerunique`. This is different than some other analytics products that have `inner` as the default flavor. See [Join flavors](#join-flavors).
> * The join hints don't change the semantic of `join`, but may affect its performance.

## Returns

**The output schema depends on the join flavor:**

| Join flavor | Output schema |
|---|---|
|`kind=leftanti`, `kind=leftsemi`| The result table contains columns from the left side only.|
| `kind=rightanti`, `kind=rightsemi` | The result table contains columns from the right side only.|
|  `kind=innerunique`, `kind=inner`, `kind=leftouter`, `kind=rightouter`, `kind=fullouter` |  A column for every column in each of the two tables, including the matching keys. The columns of the right side will be automatically renamed if there are name clashes. |

**Output records depend on the join flavor:**

   > [!NOTE]
   >
   > If there are several rows with the same values for those fields, you'll get rows for all the combinations.
   > A match is a row selected from one table that has the same value for all the `on` fields as a row in the other table.

| Join flavor | Output records |
|---|---|
| `kind=leftanti`, `kind=leftantisemi`| Returns all the records from the left side that don't have matches from the right|
| `kind=rightanti`, `kind=rightantisemi`| Returns all the records from the right side that don't have matches from the left.|
| `kind` unspecified, `kind=innerunique`| Only one row from the left side is matched for each value of the `on` key. The output contains a row for each match of this row with rows from the right.|
| `kind=leftsemi`| Returns all the records from the left side that have matches from the right. |
| `kind=rightsemi`| Returns all the records from the right side that have matches from the left. |
| `kind=inner`| Returns all matching records from left and right sides. |
| `kind=fullouter`| Returns all the records for all the records from the left and right sides. Unmatched cells contain nulls. |
| `kind=leftouter`| Returns all the records from the left side and only matching records from the right side. |
| `kind=rightouter`| Returns all the records from the right side and only matching records from the left side. |

> [!TIP]
>
> For best performance, if one table is always smaller than the other, use it as the left (piped) side of the join.

## Join flavors

:::image type="content" source="images/joinoperator/join-kinds.png" alt-text="Diagram showing query join kinds.":::

There are many flavors of joins that can be performed that affect the schema and rows in the resultant table. The exact flavor of the join operator is specified with the *kind* keyword. The following flavors of the join operator are supported:

| Join kind | Description | Illustration |
| --- | --- | --- |
| [innerunique](join-innerunique.md) (default) | Inner join with left side deduplication<br />**Schema**: All columns from both tables, including the matching keys<br />**Rows**: All deduplicated rows from the left table that match rows from the right table | :::image type="icon" source="images/joinoperator/join-inner-unique.png" border="false"::: |
| [inner](join-inner.md) | Standard inner join<br />**Schema**: All columns from both tables, including the matching keys<br />**Rows**: Only matching rows from both tables | :::image type="icon" source="images/joinoperator/join-inner.png" border="false"::: |
| [leftouter](join-leftouter.md) | Left outer join<br />**Schema**: All columns from both tables, including the matching keys<br />**Rows**: All records from the left table and only matching rows from the right table | :::image type="icon" source="images/joinoperator/join-left-outer.png" border="false"::: |
| [rightouter](join-rightouter.md) | Right outer join<br />**Schema**: All columns from both tables, including the matching keys<br />**Rows**: All records from the right table and only matching rows from the left table | :::image type="icon" source="images/joinoperator/join-right-outer.png" border="false"::: |
| [fullouter](join-fullouter.md) | Full outer join<br />**Schema**: All columns from both tables, including the matching keys<br />**Rows**: All records from both tables with unmatched cells populated with null | :::image type="icon" source="images/joinoperator/join-full-outer.png" border="false"::: |
| [leftsemi](join-leftsemi.md) | Left semi join<br />**Schema**: All columns from the left table<br />**Rows**: All records from the left table that match records from the right table | :::image type="icon" source="images/joinoperator/join-left-semi.png" border="false"::: |
| [`leftanti`, `anti`, `leftantisemi`](join-leftanti.md) | Left anti join and semi variant<br />**Schema**: All columns from the left table<br />**Rows**: All records from the left table that don't match records from the right table | :::image type="icon" source="images/joinoperator/join-left-anti.png" border="false"::: |
| [rightsemi](join-rightsemi.md) | Right semi join<br />**Schema**: All columns from the left table<br />**Rows**: All records from the right table that match records from the left table | :::image type="icon" source="images/joinoperator/join-right-semi.png" border="false"::: |
| [`rightanti`, `rightantisemi`](join-rightanti.md) | Right anti join and semi variant<br />**Schema**: All columns from the right table<br />**Rows**: All records from the right table that don't match records from the left table | :::image type="icon" source="images/joinoperator/join-right-anti.png" border="false"::: |

### Cross-join

KQL doesn't natively provide a cross-join flavor. You can't mark the operator with the `kind=cross`.

To simulate, use a dummy key:

`X | extend dummy=1 | join kind=inner (Y | extend dummy=1) on dummy`

## See also

To learn more about join hints, see:

* [Cross-cluster join](joincrosscluster.md)
* [Broadcast join](broadcastjoin.md)
* [Shuffle query](shufflequery.md)

To learn more about specific join flavors, see:

* [innerunique join](join-innerunique.md)
* [inner join](join-inner.md)
* [leftouter join](join-leftouter.md)
* [rightouter join](join-rightouter.md)
* [fullouter join](join-fullouter.md)
* [leftanti join](join-leftanti.md)
* [rightanti join](join-rightanti.md)
* [leftsemi join](join-leftsemi.md)
* [rightsemi join](join-rightsemi.md)
