---
title: labels() (graph function)
description: Learn how to use the labels() function to retrieve, filter, and project label information for nodes and edges in graph queries.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 10/23/2025
---
# labels()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Retrieves the labels associated with nodes or edges in a graph query. Use this function to filter graph elements by their labels or to include label information in query results.

Labels are defined in [graph models](../management/graph/graph-model-overview.md) and can be either static (fixed labels assigned to node or edge types) or dynamic (labels derived from data properties during graph construction).

> [!NOTE]
> Use this function with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

> [!IMPORTANT]
> The `labels()` function only works with [graph models](../management/graph/graph-model-overview.md). When called on a graph created with the [make-graph operator](make-graph-operator.md), it always returns an empty array because transient graphs don't have label metadata.

## Syntax

`labels(` *element* `)`

`labels()` <!-- When used with all(), any(), map(), or inner_nodes() -->

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *element* | `string` | :heavy_check_mark: | A node or edge variable reference from a graph pattern. Omit this parameter when using `labels()` inside [all()](all-graph-function.md), [any()](any-graph-function.md), or [map()](map-graph-function.md) graph functions with [inner_nodes()](inner-nodes-graph-function.md). For more information, see [Graph pattern notation](graph-match-operator.md#graph-pattern-notation). |

## Returns

Returns a dynamic array of strings containing the labels associated with the specified node or edge. Returns an empty array for elements without labels or when used with graphs created created with the [make-graph operator](make-graph-operator.md).

When called without parameters inside [all()](all-graph-function.md), [any()](any-graph-function.md), or [map()](map-graph-function.md) with [inner_nodes()](inner-nodes-graph-function.md), returns the labels for each inner node or edge in the path.

## Label types

The `labels()` function retrieves both static and dynamic labels defined in the graph model. For detailed information about static and dynamic labels, including when to use each type, see [Labels in Graph models](../management/graph/graph-model-overview.md#labels-in-graph-models).

## Examples

These examples use the sample graphs available on the [help cluster](https://help.kusto.windows.net) in the **Samples** database. For more information about these datasets, see [Graph sample datasets](graph-sample-data.md).

### Example 1: Filter nodes by labels

This example demonstrates filtering nodes based on their labels using the Simple educational graph. The query finds all people who work at companies and filters by the "Person" label.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NTQrCMBCF9z3FkFUCtjeoG4%2BgO5EyhCGpmswwCZSChze2gr7V8L2fCYoSrTnPSZ5kXPeC8CF9wuojWCEtnF1%2FXVgfZcJ664%2FWcxLMq%2BugaYmkBF80ZEwE4wjmQj6eWMVsIVG%2Bk69A7QuvRNOeg31%2Bax1%2BJoY%2Fr1XbVWcqQ%2BNvXu8It68AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph("Simple")
| graph-match (person)-[works_at]->(company)
    where labels(person) has "Person" 
          and company.name == "TechCorp"
    project employee_name = person.name, 
            employee_age = person.properties.age,
            employee_labels = labels(person)
```

**Output**

| employee_name | employee_age | employee_labels |
|---|---|---|
| Alice | 25 | `["Person"]` |
| Bob | 30 | `["Person"]` |
| Emma | 26 | `["Person"]` |

This query uses `labels(person)` [has](has-operator.md) `"Person"` to filter only nodes with the "Person" label, ensuring we're working with person entities rather than other node types in the graph.

### Example 2: Project labels in results

This example shows how to include label information in query results when analyzing social network connections using the LDBC SNB Interactive dataset. The query finds people who like posts and projects their labels.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQwQrCMAyG73uKkJMKdj6BJ0EFD17Eg4hMY9fNtLWkHUPlw9u6Ihvq3pL8%2BZN%2FC52hVn55nbJ7CdqCj9fJQgwhQOeYrN7L6yqLgtQOSMrp6j4vxD6vpDwvuRxnyMoyLxd1FeAIHRfDACMf5MI9RGgNafiG3hq6LK72DdGE%2BA3ZePjOO31PkM%2BcdEjPqOnoNTjfoOOUKXg3oicWbWAZvmDnYMD3BKOv1%2BCCZwwp1u8U%2Blbir2iIvT8w6YcQJwEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph("LDBC_SNB_Interactive")
| graph-match (person)-[likes]->(post)-[has_creator]->(creator)
    where labels(person) has "PERSON" 
          and labels(post) has "POST"
          and labels(has_creator) has "HAS_CREATOR"
    project 
        person_name = person.firstName,
        creator_name = creator.firstName,
        person_labels = labels(person),
        post_labels = labels(post),
        edge_labels = labels(has_creator)
| take 5
```

**Output**

| person_name | creator_name | person_labels | post_labels | edge_labels |
|---|---|---|---|---|
| Abdullah | Mahinda | `["PERSON"]` | `["POST"]` | `["HAS_CREATOR"]` |
| Abdullah | Mahinda | `["PERSON"]` | `["POST"]` | `["HAS_CREATOR"]` |
| Abdullah | Mahinda | `["PERSON"]` | `["POST"]` | `["HAS_CREATOR"]` |
| Abdullah | Mahinda | `["PERSON"]` | `["POST"]` | `["HAS_CREATOR"]` |
| Karl | Mahinda | `["PERSON"]` | `["POST"]` | `["HAS_CREATOR"]` |

This query projects the labels using `labels()` for both nodes and edges, showing how labels help categorize different entity types in a complex social network.

### Example 3: Filter by multiple label conditions

This example demonstrates using multiple label conditions to identify financial transaction patterns in the LDBC Financial dataset. The query finds accounts that transfer money to other accounts and filters by specific node and edge labels.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WQwUoDMRBF934Fw6aCtfYLXChapOhCxIUgQshMu0k3M2GStkXEj3dsV7B5m3nvzcwrM4GhLF7HJJ2vKcYhv2%2BeOBLn3yiIaS4Cvt54QK0OYIlR8EWPvhNnLuSjD4P7wuKvW0cPf7qlv%2B8cwmqNQ40oNGqxoD0IsP64oNM%2B6BBuEWIH8U9%2BvXDPYyQRWufjGDvQc5JcIz%2BTrs7Sd5fnkFlT6PwTff2fOdqQBaVbpiYacav3xHzuuqUhcZEOAukDU%2Ba%2FTX0T3UwBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph("LDBC_Financial")
| graph-match (account1)-[transfer]->(account2)
    where labels(account1) has "ACCOUNT" 
          and labels(account2) has "ACCOUNT"
          and labels(transfer) has "TRANSFER"
          and transfer.amount > 1000000
    project 
        from_account = account1.node_id,
        to_account = account2.node_id,
        amount = transfer.amount,
        source_labels = labels(account1),
        target_labels = labels(account2),
        edge_labels = labels(transfer)
| take 5
```

**Output**

| from_account | to_account | amount | source_labels | target_labels | edge_labels |
|---|---|---|---|---|---|
| Account::16607023625929101 | Account::4671921663443468288 | 3851891.85 | `["ACCOUNT"]` | `["ACCOUNT"]` | `["TRANSFER"]` |
| Account::4664321839072281992 | Account::4682617712558473604 | 6608768.38 | `["ACCOUNT"]` | `["ACCOUNT"]` | `["TRANSFER"]` |
| Account::4651655465120301686 | Account::78531518502273229 | 4408436.11 | `["ACCOUNT"]` | `["ACCOUNT"]` | `["TRANSFER"]` |
| Account::30962247438172666 | Account::63894819713319622 | 6811824.76 | `["ACCOUNT"]` | `["ACCOUNT"]` | `["TRANSFER"]` |
| Account::104708691336364238 | Account::99079191802151398 | 6415410.76 | `["ACCOUNT"]` | `["ACCOUNT"]` | `["TRANSFER"]` |

This query chains multiple label conditions to ensure both nodes and edges have the correct types, which is essential for accurate pattern matching in financial networks.

### Example 4: Use labels() with collection functions

This example shows how to use `labels()` without parameters inside `any()` and `map()` functions when working with variable-length paths in the BloodHound Active Directory dataset. The query finds privilege escalation paths where at least one edge in the path represents a dangerous permission.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction">
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22QQUvDQBCF7%2F6KYU8t2OpPaKFqqIgHxYNgQWRZNpvuks1smJ3Wgv%2F%2BetdS6GFP8773vmEqkmZR3I0x9s%2BhNW%2Fh1SthUSvUK1%2FopNm7Q9YAlgi5LLovZMWFcvTe9%2F4Liz%2BvHT38cpd9%2FWJhscKhRhQcUhaL2DUAz%2BcVne1BhxC%2BIN4g%2Fsnvl85xTCRCS85PsQNdkuQa%2BJl0dZZ95%2FQgMmsKrf8g23%2BZo41JULphaqIRt2pPzFPvTRqS0PQGWfqglfkfvUAI%2FUkBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph("BloodHound_AD")
| graph-match (user)-[path*1..3]->(target)
    where labels(user) has "User" 
          and labels(target) has "Group"
          and target.properties.admincount == true
          and any(path, labels() has_any ("GenericAll", "WriteDacl", "WriteOwner", "GenericWrite", "Owns"))
    project 
        attacker = user.name,
        target_group = target.name,
        path_length = array_length(path),
        permission_chain = map(path, labels())
| take 5
```

**Output**

| attacker | target_group | path_length | permission_chain |
|---|---|---|---|
| ADMINISTRATOR@WRAITH.CORP | ENTERPRISE ADMINS@WRAITH.CORP | 2 | `[["MemberOf"], ["GenericWrite"]]` |
| BM@WRAITH.CORP | REPLICATORS@WRAITH.CORP | 2 | `[["MemberOf"], ["WriteDacl"]]` |
| ADMINISTRATOR@GHOST.CORP | REPLICATORS@GHOST.CORP | 2 | `[["MemberOf"], ["WriteOwner"]]` |
| FABIAN@PHANTOM.CORP | ACCOUNT OPERATORS@PHANTOM.CORP | 2 | `[["MemberOf"], ["WriteDacl"]]` |
| BH@GHOST.CORP | REPLICATORS@GHOST.CORP | 2 | `[["MemberOf"], ["GenericWrite"]]` |

In this query, `labels()` is called without parameters inside the `any()` function to check if at least one edge in the privilege escalation path represents a dangerous permission. The `map()` function with `labels()` shows the specific permission types along each path, revealing how attackers can escalate from regular user accounts to privileged groups.

## Related content

- [Graph operators](graph-operators.md)
- [graph-match operator](graph-match-operator.md)
- [graph-shortest-paths operator](graph-shortest-paths-operator.md)
- [make-graph operator](make-graph-operator.md)
- [Graph models overview](../management/graph/graph-model-overview.md)
- [Graph sample datasets](graph-sample-data.md)
- [all() graph function](all-graph-function.md)
- [any() graph function](any-graph-function.md)
- [map() graph function](map-graph-function.md)
- [inner_nodes() graph function](inner-nodes-graph-function.md)
