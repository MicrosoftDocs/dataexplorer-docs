---
title: inner_nodes() (graph function)
description: Learn how to use the inner_nodes() function to access all inner nodes in a variable length path.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 02/16/2025
---
# inner_nodes() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `inner_nodes()` graph function allows access to the inner nodes of a [variable length edge](graph-match-operator.md#variable-length-edge). It can only be used as the first parameter of the [all() graph](all-graph-function.md) and [map()](map-graph-function.md) functions.

> [!NOTE]
> This function is used with the [graph-match](graph-match-operator.md) operator, [graph-shortest-paths](graph-shortest-paths-operator.md) operator, [all()](all-graph-function.md) function, and [map()](map-graph-function.md) function.

## Syntax

`inner_nodes(`*edge*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edge* | `string` |  :heavy_check_mark: | A variable length edge from the [graph-match operator](graph-match-operator.md) or [graph-shortest-paths operator](graph-shortest-paths-operator.md) pattern. For more information, see [Graph pattern notation](./graph-match-operator.md#graph-pattern-notation). |

## Returns

Sets the execution scope of the `all` or `map` expression to the inner node of a variable length edge.

## Examples

The example in this section shows how to use the syntax to help you get started.

### Find all employees in a manager's organization

The following example represents an organizational hierarchy. It shows how a variable length edge in a single graph query can be used to find employees at various levels within an organizational hierarchy. The nodes in the graph represent employees and the edges connect an employee to their manager. After the graph is built using the `make-graph` operator, the `all()` and `inner_nodes` functions are used to search for employees in Alice's organization besides Alice, who have managers younger than 40. Then, `map()` and `inner_nodes` are used together to get those managers' names.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WSTU%2BEMBCG7%2FyKyZ7AFOJ%2BELPrYqLGiyfjdbPZdGFC0dKSQlxN%2FPG2pS3LwXDp25l5%2B8wMHAfAtuPyB7GHAio66O%2FMMRa0xV0%2FqEbUBGiNOy5FnUB0gAhg8cibEhcE1isC9uJJno1cOvnyZaKrOydfpZVbJ5%2BZanp9scmJc8NvU50Ta4XCJK%2BteG9KRlVlolsSHe8h4hpZYSfVMAf2bQTolgrNrZwO6CNp6GAGNL8dmxgLJjCfPPUVqubAttAie9zoV0N9Ylor2rEwd0jTBw8Ll2ZgVxuRAswiTKUtSls6lAxil57s04Mzv1lmWX5MwxgSDXNhqNBbZ9aoKDwuUFEB5TxuhEB1ErLCPnZmiV057GFza3w6JT%2BwnP4UPXd%2FtK5h1jpw%2FRpxi9Ljf6O6LxPt%2FnnP5Cd%2FrAhqf48CAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let employees = datatable(name:string, age:long) 
[ 
  "Alice", 32,  
  "Bob", 31,  
  "Eve", 27,  
  "Joe", 29,  
  "Chris", 45, 
  "Alex", 35,
  "Ben", 23,
  "Richard", 39,
]; 
let reports = datatable(employee:string, manager:string) 
[ 
  "Bob", "Alice",  
  "Chris", "Alice",  
  "Eve", "Bob",
  "Ben", "Chris",
  "Joe", "Alice", 
  "Richard", "Bob"
]; 
reports 
| make-graph employee --> manager with employees on name 
| graph-match (manager)<-[reports*1..5]-(employee)
  where manager.name == "Alice" and all(inner_nodes(reports), age < 40)
  project employee = employee.name, manager = manager.name, reportingPath = map(inner_nodes(reports), name)
```

**Output**

employee|manager|reportingPath|
|---|---|---|
Bob|Alice|[]|
Chris|Alice|[]|
Joe|Alice|[]|
Eve|Alice|["Bob"]|
Richard|Alice|["Bob"]|

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-shortest-paths operator](graph-shortest-paths-operator.md)
* [all()](all-graph-function.md)
* [map()](map-graph-function.md)
