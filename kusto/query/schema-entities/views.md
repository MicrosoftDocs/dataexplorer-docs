---
title:   Views
description:  Learn how to define and use a view.
ms.reviewer: zivc
ms.topic: reference
ms.date: 08/13/2023
---
# Views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

A view is a virtual table based on the result-set of a Kusto Query Language (KQL) query.

Like real tables, views organize data with rows and columns, and participate in tasks that involve wildcard table name resolution, such as [union *](../../query/union-operator.md) and [search *](../../query/search-operator.md) scenarios. However, unlike real tables, views don't maintain dedicated data storage. Rather, they dynamically represent the result of a query.

## How to define a view

Views are defined through [user-defined functions](../functions/user-defined-functions.md), which come in two forms: query-defined functions and stored functions. To qualify as a view, a function must accept no arguments and yield a tabular expression as its output.

To define a query-defined function as a view, specify the `view` keyword before the function definition. For an example, see [Query-defined view](#query-defined-view).

To define a stored function as a view, set the `view` property to `true` when you create the function. For an example, see [Stored view](#stored-view). For more information, see the [.create function command](../../management/create-function.md).

## Examples

### Query-defined view

The following query defines two functions: `T_view` and `T_notview`. The query results demonstrate that only `T_view` is resolved by the wildcard reference in the union operation.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEIiS/LTC1XsFUAUxqaCtUKBUWZeSUKFbaGCrXWXDlgNXn5JVBlKCqMQCpK8zLz8xRCtACsbfBqTgAAAA==" target="_blank">Run the query</a>
:::moniker-end

```kusto
let T_view = view () { print x=1 };
let T_notview = () { print x=2 };
union T*
```

### Stored view

The following query defines a stored view. This view behaves like any other stored function, yet can partake in wildcard scenarios.

```kusto
.create function 
    with (view=true, docstring='Simple demo view', folder='Demo')  
    MyView() { StormEvents | take 100 }
```

## Related content

* [User-defined functions](../functions/user-defined-functions.md)
* [union operator](../../query/union-operator.md)
* [search operator](../../query/search-operator.md)
