---
title:  fullouter join
description: Learn how to use the fullouter join flavor to merge the rows of two tables. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---

# fullouter join

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


A `fullouter` join combines the effect of applying both left and right outer-joins. For columns of the table that lack a matching row, the result set contains `null` values. For those records that do match, a single row is produced in the result set containing fields populated from both tables.

:::image type="content" source="media/joinoperator/join-fullouter.png" alt-text="Diagram that shows how the join works." lightbox="media/joinoperator/join-kinds.png":::

## Syntax

*LeftTable* `|` `join` `kind=fullouter` [ *Hints* ] *RightTable* `on` *Conditions*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

[!INCLUDE [join-parameters-attributes-hints](../includes/join-parameters-attributes-hints.md)]

## Returns

**Schema**: All columns from both tables, including the matching keys.  
**Rows**: All records from both tables with unmatched cells populated with null.

## Example

This example query combines rows from both tables X and Y, filling in missing values with NULL where there's no match in the other table. This allows you to see all possible combinations of keys from both tables.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIULBVSEksAcKknFQN79RKq%2BKSosy8dB2FsMSc0lRDq5z8vHRNrmguBSBQT1TXMdSBMJPUdYwQTGMoM1ldx4Qr1porB2h0JH6jjVCNBhpiaIAwxQiJbQxjpwBNNwAZH6FQo5CVn5mnkJ2Zl2KbVpqTk19akloEtDI%2FTwFoEwDuw%2F%2BW2gAAAA%3D%3D" target="_blank">Run the query</a>
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
X | join kind=fullouter Y on Key
```

**Output**

|Key|Value1|Key1|Value2|
|---|---|---|---|
|b|3|b|10|
|b|2|b|10|
|c|4|c|20|
|c|4|c|30|
|||d|40|
|a|1|||

## Related content

* Learn about other [join flavors](join-operator.md#returns)
