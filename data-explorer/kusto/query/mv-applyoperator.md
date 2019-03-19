---
title: mv-apply operator - Azure Data Explorer | Microsoft Docs
description: This article describes mv-apply operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/26/2019
---
# mv-apply operator

Applies a sub-expression on multi-value array.

`mv-apply` applies a sub-query on a [dynamic](./scalar-data-types/dynamic.md)-typed column. In a sense, `mv-apply` extends [mv-expand](./mvexpandoperator.md) operator by allowing applying an arbitrary sub-query on a contextual tabular expression produced by each array exapnsion.
The output of the operator will include all rows and columns produced by a sub-query, while all other columns in the expanded row are duplicated.

> [!IMPORTANT]
> This operator is in preview mode, meaning it may have performance and stability bugs.

**Syntax**

*T* `| mv-apply` [`with_itemindex=`*IndexColumnName*] *ColumnName* [`,` *ColumnName* ...] [`limit` *Rowlimit*] `on` `(` *SubQuery* `)`

*T* `| mv-apply ` [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] [, [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] ...] [`limit` *Rowlimit*] `on` `(` *SubQuery* `)` 

**Arguments**

* *ColumnName:* In the result, arrays in the named column are expanded to multiple rows. 
* *ArrayExpression:* An expression yielding an array. If this form is used, a new column is added and the existing one is preserved.
* *Name:* A name for the new column.
* *Typename:* Indicates the underlying type of the array's elements,
    which becomes the type of the column produced by the operator.
    Note that values in the array that do not conform to this type will
    not be converted; rather, they will take on a `null` value.
* *RowLimit:* The maximum number of rows generated from each original row. The default is 2147483647. 
* *SubQuery:* Query that is applied on an expanded input.  

**Notes**

* Unlike [mv-expand](./mvexpandoperator.md) operator - `mv-apply` supports expansion of arrays only and not property bags.

**Returns**

Multiple rows for each of the input values as a result of applying sub-query on the input values.
If the sub-query just projects the expanded values, the output is the same as using [mv-expand](./mvexpandoperator.md) operator.

**Examples**

## Getting the largest element from the array

```kusto
let _data =
range x from 1 to 8 step 1
| summarize l=make_list(x) by xMod2 = x % 2;
_data
| mv-apply element=l to typeof(long) on 
(
   top 1 by element
)
```

|xMod2|l|element|
|---|---|---|
|1|[<br>  1,<br>  3,<br>  5,<br>  7<br>]|7|
|0|[<br>  2,<br>  4,<br>  6,<br>  8<br>]|8|


## Calculating sum of largest two elments in an array

```kusto
let _data =
range x from 1 to 8 step 1
| summarize l=make_list(x) by xMod2 = x % 2;
_data
| mv-apply l to typeof(long) on 
(
   top 2 by l
   | summarize SumOfTop2=sum(l)   
)
```

|xMod2|l|SumOfTop2|
|---|---|---|
|1|[<br>  1,<br>  3,<br>  5,<br>  7<br>]|12|
|0|[<br>  2,<br>  4,<br>  6,<br>  8<br>]|14|


**See also**

- [mv-expand](./mvexpandoperator.md) operator.