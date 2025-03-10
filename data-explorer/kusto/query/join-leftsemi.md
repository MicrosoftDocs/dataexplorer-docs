---
title:  leftsemi join
description: Learn how to use the leftsemi join flavor to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---

# leftsemi join

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `leftsemi` join flavor returns all records from the left side that match a record from the right side. Only columns from the left side are returned.

:::image type="content" source="media/joinoperator/join-leftsemi.png" alt-text="Diagram that shows how the join works." lightbox="media/joinoperator/join-kinds.png":::

## Syntax

*LeftTable* `|` `join` `kind=leftsemi` [ *Hints* ] *RightTable* `on` *Conditions*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

[!INCLUDE [join-parameters-attributes-hints](../includes/join-parameters-attributes-hints.md)]

## Returns

**Schema**: All columns from the left table.  
**Rows**: All records from the left table that match records from the right table.

## Example

This query filters and returns only those rows from table X that have a matching key in table Y.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIULBVSEksAcKknFQN79RKq+KSosy8dB2FsMSc0lRDq5z8vHRNrmguBSBQT1TXMdSBMJPUdYwQTGMoM1ldx4Qr1porB2h0JH6jjVCNBhpiaIAwxQiJbQxjpwBNNwAZH6FQo5CVn5mnkJ2Zl2Kbk5pWUpyamwm0MT9PAWgRAJX/pofZAAAA" target="_blank">Run the query</a>
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
X | join kind=leftsemi Y on Key
```

**Output**

|Key|Value1|
|---|---|
|b|2|
|b|3|
|c|4|

## Related content

* Learn about other [join flavors](join-operator.md#returns)
