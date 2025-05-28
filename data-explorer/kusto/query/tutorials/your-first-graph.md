---
title: 'Tutorial: Create your first graphs in Kusto Query Language'
description: Learn how to model and query interconnected data using graph semantics in Kusto Query Language (KQL). Build transient and persistent graphs to analyze organizational hierarchies.
author: cosh
ms.author: herauch
ms.service: azure-data-explorer
ms.topic: tutorial
ms.custom: mvc
ms.date: 05/26/2025
---

# Tutorial: Create your first graphs in Kusto Query Language

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Graph semantics in Kusto enables you to model and query data as interconnected networks, making it intuitive to analyze complex relationships like organizational hierarchies, social networks, and attack paths. Unlike traditional relational queries that rely on joins, graphs use direct relationships between entities to traverse connections efficiently.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a transient graph using the make-graph operator
> * Query graphs to find relationships using graph-match
> * Build persistent graph models for reusable analysis
> * Compare transient versus persistent graph approaches

If you don't have an Azure Data Explorer cluster, [create a free cluster](/azure/data-explorer/start-for-free-web-ui) before you begin the tutorial.

## Prerequisites

* A Microsoft account or Microsoft Entra user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

::: moniker range="microsoft-fabric"

* A [Fabric workspace](/fabric/get-started/create-workspaces) with a Microsoft Fabric-enabled [capacity](/fabric/enterprise/licenses#capacity)

::: moniker-end

## Access your query environment

::: moniker range="azure-data-explorer"
Open the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/clusters/help) to access the help cluster for this tutorial.
::: moniker-end

::: moniker range="microsoft-fabric"
Navigate to your Microsoft Fabric workspace and open a KQL database to run the queries.
::: moniker-end

::: moniker range="microsoft-sentinel"
Navigate to the advanced hunting page to start querying Microsoft Sentinel data.
::: moniker-end

::: moniker range ="azure-monitor"
Navigate to Logs or to a Logs Analytics workspace in the Azure portal to start querying Azure Monitor data.
::: moniker-end

## Create a transient graph with organizational data

In this section, you'll create your first graph using sample organizational data. Transient graphs are created dynamically during query execution using the `make-graph` operator, making them perfect for ad-hoc analysis and exploration.

You'll work with a simple company structure where employees report to managers. This organizational hierarchy provides an intuitive example for understanding graph relationships:

:::image type="content" source="../media/graphs/tutorial-first-graph.png" alt-text="A diagram showing the organization hierarchy.":::

Create the organizational graph structure using employee and reporting relationship data:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://help.kusto.windows.net/Samples?query=H4sIAAAAAAAEAG1STWuEMBC9C%2f6HwVMLiqVflC0tdF17W3rosfQwuw4ajEmI6baF%2fvjGuIm67MFI3nszk%2feYPIdCExqCHjvFCcie8pcIKjQYR5xMgHp4cqjBHacLgR2teqOZqFPQkk8XrGnFpagvIY4%2b7AeQvHC2pySFpCjf7O%2f2LoWRWMvdAJeiZoJoqIctCttBW%2fgmyAq0EwbhFnVL5kT24GUbPLgpGzoQl8qx14Etz5D3qaNeNYp22f9d0Z4hZ70ZRlzF0eejbZOHvDQpqZ1SE0fDpOgbpvoxspFcBuZjDDl1o4PjfZbWMRQf2kkES9hbdjVzmxMQzI0tJifrL8YrMA1BrVE1gKIC%2brGv1ATMxJF3EUd%2f9rEtZaMsrEiWPXsT8M1MM9sUKWBYEFfqqjIjM5cDCFlZwT%2bAlxSzeQIAAA%3d%3d&web=0" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Create sample employee data
let employees = datatable(name:string, role:string, age:long) 
[ 
  "Alice", "CEO", 45,  
  "Bob", "Engineering Manager", 35,  
  "Carol", "Marketing Manager", 38,  
  "Dave", "Developer", 28,  
  "Eve", "Developer", 26,
  "Frank", "Marketing Specialist", 30
]; 
// Create reporting relationships
let reports = datatable(employee:string, manager:string) 
[ 
  "Bob", "Alice",  
  "Carol", "Alice",  
  "Dave", "Bob",
  "Eve", "Bob",
  "Frank", "Carol"
]; 
// Build the graph and explore it
reports 
| make-graph employee --> manager with employees on name 
| graph-to-table nodes 
```

### Output

|name|role|age|
|---|---|---|
|Alice|CEO|45|
|Bob|Engineering Manager|35|
|Carol|Marketing Manager|38|
|Dave|Developer|28|
|Eve|Developer|26|
|Frank|Marketing Specialist|30|

## Query relationships with graph-match patterns

Now you'll learn to use the `graph-match` operator to find specific patterns in your organizational graph. The `graph-match` operator searches for relationships and connections within the graph structure.

First, find all employees who directly report to Alice by matching the immediate reporting relationship pattern:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://help.kusto.windows.net/Samples?query=H4sIAAAAAAAEAG1STWuEMBC9C%2f6HwdMKWkq%2fKNtaaHftbemhx2UPWTtoakxCDLsU%2buObRBN1KSI68%2bbjzZthqAE7ycQPYg8FfBFtniPDFScdrnutKK8zUIJNBqlxzQSvU4ijvXkBkldGK0wySDblh%2fnc3WcwAG%2fiaN0lrylHtPmwI9xUUMZ9G8I2xHSwgTuiWtQXYY8%2bbEtOrssWT8iEdOhNQMt%2fwIfMQe%2bK8HZZ%2f1NiRQmjvbYtruPo8GTKMKOHQimUXqrhNQoidAO90Z5JMU7sFbmYb%2bn287ic%2bQyTIzAfSow0PcU4%2bjVMWsxrRWQTNgl5%2fuIZwpnqZrZjwcGu1qW6rLwjumpgRSy19Dnfj8UPeZg6tVTODSoEF3XlKhSFn8fCUolvrKZrMvL5Xxc%2bHNHca213TXOnMf8AJFalqZQCAAA%3d&web=0" target="_blank">Run the query</a>
::: moniker-end

```kusto
let employees = datatable(name:string, role:string, age:long) 
[ 
  "Alice", "CEO", 45,  
  "Bob", "Engineering Manager", 35,  
  "Carol", "Marketing Manager", 38,  
  "Dave", "Developer", 28,  
  "Eve", "Developer", 26,
  "Frank", "Marketing Specialist", 30
]; 
let reports = datatable(employee:string, manager:string) 
[ 
  "Bob", "Alice",  
  "Carol", "Alice",  
  "Dave", "Bob",
  "Eve", "Bob",
  "Frank", "Carol"
]; 
reports 
| make-graph employee --> manager with employees on name 
| graph-match (alice)<-[reports]-(employee)
  where alice.name == "Alice"  
  project employee = employee.name, role = employee.role, age = employee.age
```

### Direct reports output

|employee|role|age|
|---|---|---|
|Bob|Engineering Manager|35|
|Carol|Marketing Manager|38|

Next, find all employees in Alice's entire organization, including indirect reports, using variable length edges with `*1..3` to traverse multiple levels of the hierarchy:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://help.kusto.windows.net/Samples?query=H4sIAAAAAAAEAG1SwWqDQBC9B%2fyHwZMWlbZpS0lroU3SU0MOPYZQJnZQ67ormyUh0I%2fv7uoaDUVEd%2bbNzHtvlpECqhsmTkR7SOEblX52jAKONc32SpY8j0AKdj5gTjMmeB6CN9noF8B%2fZWVGfgT%2bfLnWn7v7CNrEm9iZ8JLnJScy9bBCrjtIHZ72sDnqCQa4QlmRuoA9OtgCD3bKgg7ERGOzt312%2bU%2fyIbKpd4m8Gvf%2fbCgrkZV7ZUZce5Ptk27DtB%2bSGiHV2A3nUW9C3dLrzgMrOsXOkQt947DTY2uGGs6BnnnboqPpKHqTX82kojiX2BT9JiGOXxxDOJaqGOxYcDCrtaW2Kq5RZQUEaKiFz%2fGma351kyTTbdxLDw2fY0GSwEIT2yZNnSgrqZHih7LzndImul%2bLb6%2fSMGrOUee5dvLDbM94j1Li6YsRz1URdJTCP18Ls96vAgAA&web=0" target="_blank">Run the query</a>
::: moniker-end

```kusto
let employees = datatable(name:string, role:string, age:long) 
[ 
  "Alice", "CEO", 45,  
  "Bob", "Engineering Manager", 35,  
  "Carol", "Marketing Manager", 38,  
  "Dave", "Developer", 28,  
  "Eve", "Developer", 26,
  "Frank", "Marketing Specialist", 30
]; 
let reports = datatable(employee:string, manager:string) 
[ 
  "Bob", "Alice",  
  "Carol", "Alice",  
  "Dave", "Bob",
  "Eve", "Bob",
  "Frank", "Carol"
]; 
reports 
| make-graph employee --> manager with employees on name 
| graph-match (alice)<-[reports*1..3]-(employee)
  where alice.name == "Alice"
  project employee = employee.name, role = employee.role, reportingLevels = array_length(reports)
```

### All organization members output

|employee|role|reportingLevels|
|---|---|---|
|Bob|Engineering Manager|1|
|Carol|Marketing Manager|1|
|Dave|Developer|2|
|Eve|Developer|2|
|Frank|Marketing Specialist|2|

::: moniker range="azure-data-explorer || microsoft-fabric"

## Create a persistent graph model

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Persistent graphs are stored in the database and can be queried repeatedly without rebuilding the graph structure. You'll now create the same organizational structure as a persistent graph for better performance and reusability.

Create functions that return your sample data, then define a graph model structure:

```kusto
// Create a function that returns employee data
.create function Employees() {
    datatable(name: string, role: string, age: long)
    [
        "Alice", "CEO", 45,
        "Bob", "Engineering Manager", 35,
        "Carol", "Marketing Manager", 38,
        "Dave", "Developer", 28,
        "Eve", "Developer", 26,
        "Frank", "Marketing Specialist", 30
    ]
}

// Create a function that returns reporting relationships
.create function Reports() {
    datatable(employee: string, manager: string)
    [
        "Bob", "Alice",
        "Carol", "Alice",
        "Dave", "Bob",
        "Eve", "Bob",
        "Frank", "Carol"
    ]
}
```

Define the graph model with node and edge schemas:

````kusto
.create-or-alter graph_model OrganizationGraph ```
{
    "Schema": {
        "Nodes": {
            "Employee": {
                "name": "string",
                "role": "string",
                "age": "long"
            }
        },
        "Edges": {
            "ReportsTo": {
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Employees()",
                "NodeIdColumn": "name",
                "Labels": ["Employee"]
            },
            {
                "Kind": "AddEdges",
                "Query": "Reports()",
                "SourceColumn": "employee",
                "TargetColumn": "manager",
                "Labels": ["ReportsTo"]
            }
        ]
    }
}
```
````

Create a graph snapshot to materialize the model into a queryable structure:

```kusto
.make graph_snapshot OrganizationGraph_v1 from OrganizationGraph
```

## Query your persistent graph

Query the persistent graph using the same patterns as transient graphs. Find all employees who report to Alice:

```kusto
graph("OrganizationGraph")
| graph-match (alice)<-[reports]-(employee)
  where alice.name == "Alice"
  project employee = employee.name, role = employee.role, age = employee.age
```

Find all employees in Alice's organization including indirect reports:

```kusto
graph("OrganizationGraph")
| graph-match (alice)<-[reports*1..3]-(employee)
  where alice.name == "Alice"
  project employee = employee.name, role = employee.role, reportingLevels = array_length(reports)
```

Query a specific snapshot version if needed:

```kusto
graph("OrganizationGraph", "OrganizationGraph_v1")
| graph-match (alice)<-[reports*1..3]-(employee)
  where alice.name == "Alice"
  project employee = employee.name, role = employee.role
```

::: moniker-end

## Compare transient and persistent graphs

Understanding when to use each approach helps you choose the right method for your analysis needs:

| Aspect | Transient Graphs | Persistent Graphs |
|--------|------------------|-------------------|
| **Creation** | `make-graph` operator during query | `.create-or-alter graph_model` + `.make graph_snapshot` |
| **Storage** | In-memory during query execution | Stored in database |
| **Reusability** | Must rebuild for each query | Query repeatedly without rebuilding |
| **Performance** | Good for smaller datasets | Optimized for large, complex graphs |
| **Use cases** | Ad-hoc analysis, exploration | Production analytics, repeated queries |
| **Memory limits** | Limited by node memory | Can handle larger datasets |

## Clean up resources

::: moniker range="azure-data-explorer || microsoft-fabric"
If you're not going to continue using the persistent graph models, delete them with the following commands:

1. Drop the graph model:

   ```kusto
   .drop graph_model OrganizationGraph
   ```

2. Drop the helper functions:

   ```kusto
   .drop function Employees
   .drop function Reports
   ```

::: moniker-end

The transient graphs are automatically cleaned up when the query completes, so no additional cleanup is needed for those examples.

## Next steps

Now that you understand the basics of graph semantics in Kusto, advance to more complex scenarios and optimizations:

> [!div class="nextstepaction"]
> [Graph best practices](../graph-best-practices.md)

You can also explore these related topics:

* [Graph operators reference](../graph-operators.md) - Complete guide to all available graph operators
::: moniker range="azure-data-explorer || microsoft-fabric"
* [Graph model management](../../management/graph/graph-model-overview.md) - Deep dive into persistent graph models
::: moniker-end
* [Graph shortest paths](../graph-shortest-paths-operator.md) - Find optimal paths between entities
* [Advanced graph queries](../graph-scenarios.md) - Complex analysis patterns and use cases
