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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22OzQrCMBCE732KJacWmr5BvfgCgt6klDUuTTV%2FJIFS8OGNiWIF57Q7fDPM5NHJmh1n7RSxpnrA9HK4xigk1I58sKbh58X6exgxDnxXC6sdmrWpIGmR5AkUXkiFDw4SA7BDfhhkrAjNFd7pzqAm6HtgJxJyb71jGXTe3khEoDTIrkRj4aBU51S7rYQvidMGTD3pijOFLvnt%2F0SZnUK%2F%2B5%2FYByHzFQEAAA%3D%3D" target="_blank">Run the query</a>
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

|employee_name|employee_age|employee_labels|
|---|---|---|
|Alice|25|["Person"]|
|Bob|30|["Person"]|
|Emma|26|["Person"]|

This query uses `labels(person)` [has](has-operator.md) `"Person"` to filter only nodes with the "Person" label, ensuring we're working with person entities rather than other node types in the graph.

### Example 2: Project labels in results

This example shows how to include label information in query results when analyzing social network connections using the LDBC SNB Interactive dataset. The query finds people who like posts and projects their labels.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22RTQ%2BCMAyG7%2F6KZidIxJtHTfwg0cSAAW%2FGLBUqIJ%2FZFr344x0yEaM9re3Tt32zRGCTWmy3Xq546C35tlIkMFLZjZg9ekDS9p0SVZSC1ZCQdWU7xyLLSZ6cudXUUuk8RckjQahq0VbN0x6BjntKgqDAMxXyrQB6ANjeDULfY%2FDCusAq7tFW2oB%2BeGD%2FqcFmA28WIV8F7uLgB91MI%2BorReqzpjuCV1gSzEw2uWRCKk%2BXxj1ndN%2BgSf%2BRRrG7SaPfbgec9vRLtUY%2FDMUJ%2FTBDm%2FpXFOYE0ydGDnvEvAEAAA%3D%3D" target="_blank">Run the query</a>
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

|person_name|creator_name|person_labels|post_labels|edge_labels|
|---|---|---|---|---|
|Abdullah|Mahinda|["PERSON"]|["POST"]|["HAS_CREATOR"]|
|Abdullah|Mahinda|["PERSON"]|["POST"]|["HAS_CREATOR"]|
|Abdullah|Mahinda|["PERSON"]|["POST"]|["HAS_CREATOR"]|
|Abdullah|Mahinda|["PERSON"]|["POST"]|["HAS_CREATOR"]|
|Karl|Mahinda|["PERSON"]|["POST"]|["HAS_CREATOR"]|

This query projects the labels using `labels()` for both nodes and edges, showing how labels help categorize different entity types in a complex social network.

### Example 3: Filter by multiple label conditions

This example demonstrates using multiple label conditions to identify financial transaction patterns in the LDBC Financial dataset. The query finds accounts that transfer money to other accounts and filters by specific node and edge labels.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XRPQ%2BCMBAG4N1fcWGCRIySOEqiKJPRxI%2FJGHKWE1BoTalx8ceLfIgpemP79Pr2Gkm8xaaxnM%2B8wE84cpZgali9J0TvHTtDxWIwkTFx52pk2QclkednkkfbbZYdqwdFPWKSBCmeKM3bExBjDsbU89b71c6AUlaFPNS0o%2BnfuElQ491mutr6i42uGzbA7N0bXBgNyyrdTYoLMdXmOUuRBXUOmECTf8BFSEES9j9QiS5zuqy%2BdaLnaEUu7pJRUL2qgPrkvq5EGZH6J50vSWHU7fgZWPGtCq8E4xcGQGM49wEAAA%3D%3D" target="_blank">Run the query</a>
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

|from_account|to_account|amount|source_labels|target_labels|edge_labels|
|---|---|---|---|---|---|
|Account::56576470318842045|Account::4652781365027145396|5602050,75|[<br>  "ACCOUNT"<br>]|[<br>  "ACCOUNT"<br>]|[<br>  "TRANSFER"<br>]|
|Account::56576470318842045|Account::4674736413210576584|7542124,31|[<br>  "ACCOUNT"<br>]|[<br>  "ACCOUNT"<br>]|[<br>  "TRANSFER"<br>]|
|Account::4695847036463875613|Account::41939771529888100|2798953,34|[<br>  "ACCOUNT"<br>]|[<br>  "ACCOUNT"<br>]|[<br>  "TRANSFER"<br>]|
|Account::40532396646334920|Account::99079191802151398|1893602,99|["ACCOUNT"]|["ACCOUNT"]|["TRANSFER"]|
|Account::98797716825440579|Account::4675580838140707611|3952004,86|["ACCOUNT"]|["ACCOUNT"]|["TRANSFER"]|

This query chains multiple label conditions to ensure both nodes and edges have the correct types, which is essential for accurate pattern matching in financial networks.

### Example 4: Use labels() with collection functions

This example shows how to use `labels()` without parameters inside `any()` and `map()` functions when working with variable-length paths in the BloodHound Active Directory dataset. The query finds privilege escalation paths where at least one edge in the path represents a dangerous permission.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12RQWvDMAyF7%2F0VwqdkJIExdsygpdDddho7jBE0R8ReEyfICqWwHz87TtetOvnpfbL1cMc4mUzt%2BnFsn8fZtc12r%2FLNN3TRKAcUbSCbPXFevk8o5u6%2Bqh4%2ByqdMkDuSfAOhToaYoMdP6n2CwaAH9RqOChYkFbr2gq3zCTzwOE%2FqBkxENfE4EYslX2E7WKfDmgJ1DcIz3YygO2dxy%2BLyynJ%2FE9qQqQM5Yqu3fa8KUG9shfaor%2BLlFPyoVnBpRh0Mr%2FIUNWzzRVquoVAE9ZEYaojJK4cDFb9uytB0MV8g1kj%2Fmbhw05PrxAQEmfG8yiVL%2FockHqz3dnSNNmhdwAecbhLH3xM8Ejz%2BAFk63VPdAQAA" target="_blank">Run the query</a>
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

|attacker|target_group|path_length|permission_chain|
|---|---|---|---|
|FABIAN@PHANTOM.CORP|ADMINISTRATORS@PHANTOM.CORP|2|[["MemberOf"], ["GenericWrite"]]|
|DU001@PHANTOM.CORP|ANOTHER ONE@PHANTOM.CORP|2|[["MemberOf"], ["WriteOwner"]]|
|ADMINISTRATOR@WRAITH.CORP|SCHEMA ADMINS@WRAITH.CORP|2|[["MemberOf"], ["GenericWrite"]]|
|CHARLIE@PHANTOM.CORP|ENTERPRISE ADMINS@PHANTOM.CORP|2|[["MemberOf"], ["WriteDacl"]]|
|CERTMAN@PHANTOM.CORP|SUBDAS@PHANTOM.CORP|2|[["MemberOf"], ["GenericWrite"]]|

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
