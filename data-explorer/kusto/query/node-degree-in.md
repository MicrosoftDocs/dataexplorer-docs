---
title:  node_degree_in (graph function)
description:  This article describes the node_degree_in() command.
ms.topic: reference
ms.date: 02/24/2025
---

# node_degree_in() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_in` function calculates the *in-degree*, or number of incoming edges, to a node in a directed graph.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) and [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

## Syntax

`node_degree_in(`*node*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *node* | `string` | :heavy_check_mark: | The reference to a graph node variable in a graph pattern. |

## Returns

Returns the in-degree of the input node.

## Example

The following example creates a graph to represent the hierarchical relationships between employees and their managers. It uses the `graph-match` operator to identify where a manager node has an incoming edge from an employee node. Then, it uses the `node_degree_in` function to find managers with exactly three direct reports. The query returns the manager, the name of each direct report, the in-degree to the manager, and the number of direct reports for each employee.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQQUvEMBCF7%2FkVw5620AhuFXG1gitePHpdlpJthyaaJiWNroI%2F3knbpO5BcnkzeS%2FzZTR6wK7X9htxgBIa4ekcNa6N6HA7eKdMm4NocautaTO2Z6tHrWpc5VBscrba2WOQlySfP0N3c0PyxY7yluSTdGqg4uo6D1H8Cvagd2iCpyD5qmopXBNuKHK4Y5qwHPbW%2BXOoiJrAOmGIzc31iDcRRcoFYOlMoJMxckRbZF%2FcC9yYCHgzGvuh%2Be%2FIWyd6mdYInD9ELjgpL%2F8s2BoIe6XgmOGd8LWE9ezO7vl%2BfvrA018zdpLoEIxtsGqwdYiVMikDZQkF6519w9rHuRdhSp4Gz2UKV135z2vJZD98hWcu6ixMvx71ba44AgAA" target="_blank">Run the query</a>
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
project manager.name, employee.name, degree_in_m=node_degree_in(manager), degree_out_e=node_degree_out(employee) 
```

**Output**

| manager_name | employee_name | degree_in_m | degree_out_e |
|--|--|--|--|
| Alice | Bob | 3 | 1 |
| Alice | Chris | 3 | 1 |
| Alice | Joe | 3 | 1 |

## Related content

* [Graph overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node_degree_out.md)
