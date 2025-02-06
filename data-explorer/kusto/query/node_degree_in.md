---
title:  node_degree_in
description:  This article describes the node_degree_in() command.
ms.topic: reference
ms.date: 02/05/2025
---

# node_degree_in()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_in` function is used to compute the *in-degree*, or number of incoming edges, to a node in a directed graph. This function is useful in graph analytics for understanding the connectivity and significance of nodes within a network.

This function can only be used in the context of `graph-match` or `graph-shortest-paths` operators.

## Syntax

`node_degree_in(`*node*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *node* | `string` | :heavy_check_mark: | The reference to a graph node. |

## Returns

Returns the in-degree of the input node.

## Example

The following example creates a graph to represent the hierarchical relationships between employees and their managers. It uses the `graph-match` operator to match where a manager node has an incoming edge from an employee node and then uses `node_degree_in` to find a manager with exactly three direct reports. The query returns the manager and the name of each direct report as well as the number of degrees in to the manager and the number of direct reports for each employee.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/trd-deqn7erj8u05settn9.z4/databases/0cefaa0d-cbcb-40be-bb5b-d9a93adf9dce?query=H4sIAAAAAAAAA3WQQUvEMBCF7%2FkVQ09baAS3irhawRUvHr0uy5JthyaaJiWNroI%2F3knbNO5BenmTvJf3dTR6wK7X9htxgAoa4ek7alwZ0eFm8E6ZtgDR4kZb0%2BZsx7JHrWrMCijXBcu29hjkJcnnz3C6viH5Ykd5S%2FJJOjXQcHVdhCh%2BBXvQWzTBU5J8VbUUrgk3FNnfMU1YDnvr%2FDlURF3AOmGIzc3ziDcRRcoEkE4m0MkYOaItsid3ghsTAW9GYz%2FU%2F468daKXyxqB84fIBSfl5Z8FWwNhrxQcM7wTvpawmt35Pd%2FNT%2B%2F58q85O0l0CMY2eGiwdYgHZZYMVBWUrHf2DWsfey9CS7EUz%2BM%2FL5xf2A%2Bfqn8B7w%2FREh8CAAA%3D" target="_blank">Run the query</a>
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
| graph-match (manager)<-[reports]-(employee)
where node_degree_in(manager) == 3
project manager.name, employee.name, node_degree_in(manager), node_degree_out(employee) 
```

**Output**

| manager_name | employee_name | node_degree_in | node_degree_out |
|--|--|--|--|
| Alice | Bob | 3 | 1 |
| Alice | Chris | 3 | 1 |
| Alice | Joe | 3 | 1 |

## Related content

* [Graph overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node_degree_out.md)
