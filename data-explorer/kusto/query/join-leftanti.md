---
title:  leftanti join
description: Learn how to use the leftanti join flavor to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---

# leftanti join

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `leftanti` join flavor returns all records from the left side that don't match any record from the right side. The anti join models the "NOT IN" query.

> **Aliases**: `anti`, `leftantisemi`

:::image type="content" source="media/joinoperator/join-leftanti.png" alt-text="Diagram that shows how the join works." lightbox="media/joinoperator/join-kinds.png":::

## Syntax

*LeftTable* `|` `join` `kind=leftanti` [ *Hints* ] *RightTable* `on` *Conditions*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

[!INCLUDE [join-parameters-attributes-hints](../includes/join-parameters-attributes-hints.md)]

## Returns

**Schema**: All columns from the left table.  
**Rows**: All records from the left table that don't match records from the right table.

## Example

The example query combines rows from tables X and Y where there is no match in Y for the keys in X, effectively filtering out any rows in X that have corresponding rows in Y.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIULBVSEksAcKknFQN79RKq+KSosy8dB2FsMSc0lRDq5z8vHRNrmguBSBQT1TXMdSBMJPUdYwQTGMoM1ldx4Qr1porB2h0JH6jjVCNBhpiaIAwxQiJbQxjpwBNNwAZH6FQo5CVn5mnkJ2Zl2Kbk5pWkphXkgm0MT9PAWgRAESy1PfZAAAA" target="_blank">Run the query</a>
::: moniker-end

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
X | join kind=leftanti Y on Key
```

**Output**

|Key|Value1|
|---|---|
|a|1|

## Related content

* Learn about other [join flavors](join-operator.md#returns)
