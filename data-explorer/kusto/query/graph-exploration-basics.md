---
title: Graph exploration basics
description: Reusable Kusto Query Language (KQL) query patterns for exploring and analyzing graphs with graph semantics.
ms.reviewer: herauch
ms.topic: how-to
ms.date: 08/21/2025
# Customer intent: As a data analyst, I want ready-to-run KQL graph queries to explore graph datasets quickly.
---

# Graph exploration basics

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This page provides reusable Kusto Query Language (KQL) patterns for quickly exploring graph datasets and answering common questions about structure, nodes, edges, and properties.

> [!TIP]
> Looking for design and performance guidance? See [Best practices for graph semantics](graph-best-practices.md).

## Common analysis queries

These reusable query patterns work across all graph models and help you understand the structure and characteristics of any graph dataset. The example below use sample graphs available on our [help cluster](https://help.kusto.windows.net) in the **Samples** database. For detailed information about these graphs, see [Graph sample datasets and examples](graph-sample-data.md). Use these queries to explore new graphs, perform basic analysis, or as starting points for more complex graph investigations.

### Graph overview and statistics

Understanding the basic characteristics of your graph is essential for analysis planning and performance optimization. These queries provide fundamental metrics about graph size and structure.

**Count total nodes and edges**:

Use these queries to understand the scale of your graph dataset. Node and edge counts help determine appropriate query strategies and identify potential performance considerations. These examples use the [`Simple` graph](graph-sample-data.md#simple-educational-graph-for-learning-fundamentals), which is ideal for learning basic graph operations.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXV3BPLVHIy09JVUjOL80r4UovSizI0FAPzswtyElV1%2BSqUQCL6OYmliRnKGiAVGpyKQBBQVF%2BVmoyRC9QFVg3AIVDvo5PAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Get node count
graph('Simple')
| graph-match (node)
    project node
| count
```

|Count|
|---|
|11|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXV3BPLVFITUlPVUjOL80r4UovSizI0FAPzswtyElV1%2BSqUQCL6OYmliRnKGgU55cWJadq6kaDtMTq2mmUJBalp5ZocikAQUFRflZqMsQ4oEawgQB1u6FrYgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Get edge count
graph('Simple')
| graph-match (source)-[edge]->(target)
    project edge
| count
```

|Count|
|---|
|20|

**Get graph summary statistics**:

This combined query efficiently provides both metrics in a single result, useful for initial graph assessment and reporting. This example demonstrates the technique using the [`Simple` graph](graph-sample-data.md#simple-educational-graph-for-learning-fundamentals).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WPOw7CMBBE%2B5xiOtsSPgEKLQegjFJEziox8k%2FOmhTA3YnlAlra0bw3u44YIc60ocfD0i4VnljylFYpbtYnR0Lh1RLtJzYrZO0rpBzvZBp9NEwsgfE%2Bo3OHkublL%2BUWSzak9FDBUV8kT3kh%2Fq7U%2FGelK8HGgN3y2tB%2BENcqBDnyFFiM7a1TO%2BUDuRGGVOcAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let nodes = view() { graph('Simple') | graph-match (node) project node | count }; 
let edges = view() { graph('Simple') | graph-match (source)-[edge]->(target) project edge | count };
union withsource=['Graph element'] nodes, edges
```

|Graph element|Count|
|---|---|
|nodes|11|
|edges|20|

**Alternative using graph-to-table**:

For basic counting, the `graph-to-table` operator can be more efficient as it directly exports graph elements without pattern matching overhead. This example shows the alternative approach using the same [`Simple` graph](graph-sample-data.md#simple-educational-graph-for-learning-fundamentals).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHIy09JLVawVSjLTC3X0FSoVkgvSizI0FAPzswtyElV11SogYjoluTrliQm5aRCddQoJOeX5pUo1Fpz5QCNSU1JJ9EYiA4kY0rzMvPzIKbrQGQBL%2BM0MaAAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let nodes = view() { graph('Simple') | graph-to-table nodes | count };
let edges = view() { graph('Simple') | graph-to-table edges | count };
union nodes, edges
```

|Count|
|---|
|11|
|20|

### Node analysis

Node analysis helps you understand the entities in your graph, their types, and distribution. These patterns are essential for data quality assessment and schema understanding.

**Discover all node types (labels)**:

This query reveals the different entity types in your graph and their frequencies. Use it to understand your data model, identify the most common entity types, and spot potential data quality issues. This example uses the [`Simple` graph](graph-sample-data.md#simple-educational-graph-for-learning-fundamentals), which contains Person, Company, and City entities.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2LQQ7CIBBF9z3F7AqLHsFTeABDYaQYYMgwNbbx8IIY%2F%2Brnv%2Fc9m7Kp%2BRpSiTjr6Q2%2BL0syYjdQmRxqmKClMD3QCkSzYqxw%2BZWhtF96LvgqJrsB%2FgIIgRwF6a6qcMi%2By3VPyXA4ESztWZSG9Rh%2Bg8QOuQ9fdgOH1X4Ahd7qqagAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('Simple')
| graph-match (node) 
    project labels = labels(node)
| mv-expand label = labels to typeof(string)
| summarize count() by label
| order by count_ desc
```

|label|count_|
|---|---|
|Person|5|
|Company|3|
|City|3|

**Find nodes with multiple labels**:

Identifies nodes that belong to multiple categories simultaneously. This is useful for understanding overlapping classifications and complex entity relationships in your data model. This example uses the [`BloodHound_Entra` graph](graph-sample-data.md#bloodhound-entra-dataset), which contains Microsoft Entra objects with multiple label classifications.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNwQoCMQxE7%2FsVuW0XVBDPehAE%2F6LENrSrtVliRAQ%2F3tT1oHMa3mQmSXDKrt8X5njke43%2BUFWwH7oXpJYtr6ghg6scaYAOTJPwmYJCQ36MsP241RgXUPBE5WZkNnPri32wfbUMRfDpC9Wk2f0etqePTEJ%2FhR2sjSteCDZv34fy5q8AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node) 
    project node_id = node.id, labels = labels(node), label_count = array_length(labels(node))
| where label_count > 1
| take 3
```

|node_id|labels|label_count|
|---|---|---|
|2|[<br>  "AZBase",<br>  "AZServicePrincipal"<br>]|2|
|4|[<br>  "AZBase",<br>  "AZUser"<br>]|2|
|5|[<br>  "AZBase",<br>  "AZUser"<br>]|2|

**Sample nodes by type**:

Retrieves representative examples of specific node types to understand their structure and properties. Essential for data exploration and query development. This example uses the [`BloodHound_Entra` graph](graph-sample-data.md#bloodhound-entra-dataset) to explore AZUser node properties in Microsoft Entra environments.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0svSizI0FB3ysnPT%2FHIL81LiXfNKylKVNfkqlFIB8np5iaWJGcoaOTlp6RqKnApAEF5RmpRqkJOYlJqTjFUPCOxWEHJMSq0OLVICaymoCg%2FKzW5RAEkHZ%2BZomALZullpuiApApSi0oyU4thoggRoK3FibkFOakKRgAqpl%2FNmgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node) 
    where labels(node) has "AZUser"
    project node_id = node.id, properties = node.properties
| sample 2
```

|node_id|properties|
|---|---|
|5|{<br>  "lastseen": "2025-08-11T09:21:19.002Z[UTC]",<br>  "lastcollected": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "enabled": true,<br>  "displayname": "Jack Miller",<br>  "name": "JMILLER@PHANTOMCORP.ONMICROSOFT.COM",<br>  "tenantid": "6c12b0b0-b2cc-4a73-8252-0b94bfca2145",<br>  "objectid": "9a20c327-8cc7-4425-9480-11fb734db194",<br>  "onpremid": "",<br>  "usertype": "Member",<br>  "title": "",<br>  "userprincipalname": "jmiller@phantomcorp.onmicrosoft.com",<br>  "system_tags": "admin_tier_0",<br>  "pwdlastset": "2021-06-16T17:51:03Z[UTC]",<br>  "onpremsyncenabled": false,<br>  "whencreated": "2021-06-16T17:29:16Z[UTC]",<br>  "email": ""<br>}|
|10|{<br>  "lastseen": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "onpremid": "",<br>  "usertype": "Member",<br>  "title": "",<br>  "lastcollected": "2025-08-11T09:21:07.472380514Z[UTC]",<br>  "enabled": true,<br>  "userprincipalname": "cjackson@phantomcorp.onmicrosoft.com",<br>  "system_tags": "admin_tier_0",<br>  "displayname": "Chris Jackson",<br>  "pwdlastset": "2022-07-19T15:18:49Z[UTC]",<br>  "onpremsyncenabled": false,<br>  "name": "CJACKSON@PHANTOMCORP.ONMICROSOFT.COM",<br>  "tenantid": "6c12b0b0-b2cc-4a73-8252-0b94bfca2145",<br>  "whencreated": "2022-07-19T15:01:55Z[UTC]",<br>  "email": "cjackson@phantomcorp.onmicrosoft.com",<br>  "objectid": "bfb6a9c2-f3c8-4b9c-9d09-2924d38895f7"<br>}|

### Edge analysis

Understanding relationships in your graph is crucial for identifying patterns, data quality issues, and potential analysis directions.

**Discover all edge types** (works with different graph schemas):

This query identifies all relationship types in your graph, helping you understand the connections available for analysis. Different graphs use different property names for edge types, so multiple variations are provided. This example uses the [`BloodHound_Entra` graph](graph-sample-data.md#bloodhound-entra-dataset) to show permission relationships in Microsoft Entra environments.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02OsQ7CMAxEd77CW5MhIyMMSEj8A0JVmpi0qIkjx0UU8fEkdOEm697dyYFtHlV3mon8hZbk%2B3MStp3efSA0ZqIVN4IqtLBDba7oA97MUYnlgKJ3UJWZHugEGutnO%2BBc4ADboZrZ5uLT4Cvb5DdQA%2F9xIZA1I91VEZ5SaI2yxGh5eiO4%2BpooDcO6lSsUyrBvxo%2F14LG4Lz9WTF%2FOAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (source)-[edge]->(target)
    project edge_labels = labels(edge)
| mv-expand label = edge_labels to typeof(string)
| summarize count() by label
| top 5 by count_ desc
```

|label|count_|
|---|---|
|AZMGAddOwner|403412|
|AZMGAddSecret|345324|
|AZAddSecret|24666|
|AZContains|12924|
|AZRunsAs|6269|

**Find most connected nodes (highest degree)**:

Node degree analysis reveals the most influential or central entities in your graph. High-degree nodes often represent key players, bottlenecks, or important infrastructure components. This example uses the [`LDBC_SNB_Interactive` graph](graph-sample-data.md#ldbc-snb-interactive), a social network dataset ideal for analyzing connection patterns and influence.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31QywrCMBC89yvm1harnjx6qSII4sUPCLFZmvWRlLgqgh9vjHooFOe0ywwzOzudYsXOwHlDF9xZLCy3li4C8aJPMNQGIhTsMIK%2FSpm1QXe2yDfLeqF221qtnVDQjfCN8jJ7IvHjs5bGonj7lhkiuuAP1EhKUmwwT9OETYXE%2F8BOfTM%2Fiu%2Bm2H3Mqp46XjQsj8SQPpX6HxB7DhrFaj4YCtg%2F%2Bjbxc00kRR8Jsxe0ZOByUQEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Find nodes with highest total degree (in + out)
graph('LDBC_SNB_Interactive')
| graph-match (node)
    project node_id = node.id, 
            in_degree = node_degree_in(node),
            out_degree = node_degree_out(node),
            total_degree = node_degree_in(node) + node_degree_out(node)
| order by total_degree desc
| take 5
```

|node_id|in_degree|out_degree|total_degree|
|---|---|---|---|
|0|41076|1|41077|
|1|35169|1|35170|
|50|12080|1|12081|
|49|11554|1|11555|
|58|7571|1|7572|

**Find nodes with highest in-degree (most incoming connections)**:

High in-degree nodes are often targets of influence, popular destinations, or central resources. In social networks, these might be influential people; in infrastructure graphs, these could be critical services. This example uses the [`LDBC_Financial` graph](graph-sample-data.md#ldbc-financial) to identify accounts receiving the most transactions.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNsQ6DMAxEd77CGyDRLsxd2qpT%2FyEyiRXcpgkyWZD4%2BIYQpPamO9%2FT2QpOY1M%2F79eberBHrxld3VYr2K05fTDqERofDLUVJE0SXqQjbBfFBi7ZnUvsIEOH8tXhQG5O4G72re6PY68MWSEqcyUp9uXzCkEMCQzLD2to1qmJ%2BCbov0iY1HnJAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('LDBC_Financial')
| graph-match (node)
    project node_id = node.node_id, 
            node_labels = labels(node),
            in_degree = node_degree_in(node)
| order by in_degree desc
| take 3
```

|node_id|node_labels|in_degree|
|---|---|---|
|Account::99079191802151398|[<br>  "ACCOUNT"<br>]|314|
|Account::4868391197187506662|[<br>  "ACCOUNT"<br>]|279|
|Account::4896538694858573544|[<br>  "ACCOUNT"<br>]|184|

**Find nodes with highest out-degree (most outgoing connections)**:

High out-degree nodes are often sources of influence, distributors, or connector hubs. These entities typically initiate many relationships or distribute resources to others. This example uses the [`LDBC_Financial` graph](graph-sample-data.md#ldbc-financial) to identify accounts making the most transactions.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNsQ7CMAxE936Ft7ZSYencBRAT%2FxC5sZUGQlK5YUDqx5OmQYKb7nxPZyM4T019u5zO6mo9em3R1W21gtmawxOjnqDxgbitIGmWcGcdYbsoSzBkdyyxgwx9la8OR3ZLAnezb3V%2FXHhFRWyEueyVpFJRfq8QhFhgfP%2FSxItOVcQHQ%2F8BiBTdrMwAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('LDBC_Financial')
| graph-match (node)
    project node_id = node.node_id, 
            node_labels = labels(node),
            out_degree = node_degree_out(node)
| order by out_degree desc
| take 3
```

|node_id|node_labels|out_degree|
|---|---|---|
|Account::236720455413661980|[<br>  "ACCOUNT"<br>]|384|
|Account::56576470318842045|[<br>  "ACCOUNT"<br>]|106|
|Account::4890627720347648300|[<br>  "ACCOUNT"<br>]|81|

### Relationship pattern analysis

These queries help identify structural patterns and complex relationships that might indicate important behaviors or anomalies in your data.

**Discover triangular relationships** (nodes connected in a triangle):

Triangular patterns often indicate tight collaboration, mutual dependencies, or closed-loop processes. In social networks, these represent groups of friends; in business processes, they might indicate approval chains or redundancy patterns. This example uses the [`BloodHound_AD` graph](graph-sample-data.md#bloodhound-active-directory-dataset) to identify circular privilege relationships in Active Directory environments.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0svSizI0FB3ysnPT%2FHIL81LiXd0UdfkqlFIB0no5iaWJGcoaCRq6uraaSSByWQwmajJVZ6RWpSqkKiXmaKgaKuQBKIT81IgDKBAMkwgGSoAUslVUJSflZpcopCXn5JqqAASzEvMTdUB840UQMYg%2BMYKIFNAfKB7ShKzUxWMAUHbZKmvAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_AD')
| graph-match (a)-->(b)-->(c)-->(a)
    where a.id != b.id and b.id != c.id and c.id != a.id
    project node1 = a.name, node2 = b.name, node3 = c.name
| take 3
```

|node1|node2|node3|
|---|---|---|
|GHOST.CORP|USERS@GHOST.CORP|DOMAIN CONTROLLERS@GHOST.CORP|
|WRAITH.CORP|USERS@WRAITH.CORP|DOMAIN CONTROLLERS@WRAITH.CORP|
|DU001@PHANTOM.CORP|ADMINISTRATORS@PHANTOM.CORP|DOMAIN ADMINS@PHANTOM.CORP|

### Property analysis

Understanding the properties available on your nodes helps you build more sophisticated queries and identify data quality issues.

**Explore node properties**:

This query reveals what information is stored with your nodes, helping you understand the available attributes for filtering and analysis. This example uses the [`BloodHound_Entra` graph](graph-sample-data.md#bloodhound-entra-dataset) to explore the schema of AZUser nodes and understand what properties are available for Microsoft Entra user objects.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQzWrDMAyA730K0UsdWNvtAXLYYLDzoJeNEhRbxF78h62s7ejDz2nGkh0msAXyp0%2B2u4RRi82TDUG9hMGr5tlzwk21ukI3nm0dstQgfFBUraDESVMisNiSzVMZNGZYP74dMqU1wH4PrxQtSoKTYQ0oeUA7ddwMMYUPkjzmSIkNZahhNO3mSpnvPrcYo70sueBB3BxjFIDOEb2C3nhVY0q4hH%2B568%2BdTfaByUW%2BiJl6fzhWC5LOTEXYYgd12ZqIshccMifju2Xb%2FbG6g381eXAOk%2Fmiv4902FNTtKKsCR8%2FeobbwViVpSaHi1nVN6%2BRJYymAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node)
    where labels(node) has "AZUser"  // Replace with actual label
    project properties = node.properties
| mv-apply properties on (
        mv-expand kind=array properties
        | where isnotempty(properties[1])
        | extend bag =bag_pack(tostring(properties[0]), properties[1])
        | summarize properties = make_bag(bag)
    )
| summarize buildschema(properties)
```

|schema_properties|
|---|
|{<br>  "onpremsyncenabled": "bool",<br>  "system_tags": "string",<br>  "lastcollected": "string",<br>  "pwdlastset": "string",<br>  "usertype": "string",<br>  "userprincipalname": "string",<br>  "email": "string",<br>  "tenantid": "guid",<br>  "name": "string",<br>  "lastseen": "string",<br>  "displayname": "string",<br>  "enabled": "bool",<br>  "title": "string",<br>  "onpremid": "string",<br>  "objectid": "guid",<br>  "whencreated": "string"<br>}|

**Find all properties of all nodes by label**:

This advanced schema discovery query identifies all property names that exist across nodes of each label type. Unlike the previous query that shows the schema structure, this query aggregates property names across all nodes of the same type, helping you understand which properties are consistently available and which might be optional or rare. This example uses the [`LDBC_SNB_Interactive` graph](graph-sample-data.md#ldbc-snb-interactive) to explore the complete property landscape of different entity types in the social network dataset.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PP2%2BDQAzF93wKbzmkIKXqnCXpUinKkjGqkAMOXOH%2ByOempeLDlwOUUAkvd9b7Pfu5ZPSVWh%2Ff9ofsfNpn71aIMRd9p3Wy6qCMempQ8gqUdQUlK%2BjLs%2FukXOLriUVTgB1EeQMNXqmJ7fiZTB2Ye4reN%2B3c4yyoYV6sHqAfj7aAWttih8w4hx9cB98VMYEO1gkZL616UpeXj2RGhi9jkPUv%2FU9qsKYskMyN28k4ZZ2iDEc8jgFxIK0nd1NBWNsywss7FlYkcG3HQb1Leh1e%2FwDFz22ZfwEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('LDBC_SNB_Interactive')
| graph-match (node)
    project properties = node, labels = labels(node)
| mv-apply properties on (
        mv-expand kind=array properties
        | where isnotempty(properties[1])
        | summarize properties = make_set(properties[0])
    )
| mv-expand label = labels to typeof(string)
| summarize properties =make_set(properties) by label
| take 3
```

|label|properties|
|---|---|
|TAGCLASS|[<br>  "id",<br>  "node_id",<br>  "lbl",<br>  "name",<br>  "url"<br>]|
|TAG|[<br>  "id",<br>  "node_id",<br>  "lbl",<br>  "name",<br>  "url"<br>]|
|FORUM|[<br>  "id",<br>  "creationDate",<br>  "node_id",<br>  "lbl",<br>  "title"<br>]|

**Find all properties of all edges by label**:

This query performs schema discovery for edge (relationship) properties, showing what information is stored with each type of relationship in your graph. Understanding edge properties is crucial for analyzing relationship metadata such as timestamps, weights, confidence scores, or other attributes that provide context about connections. This example uses the [`BloodHound_AD` graph](graph-sample-data.md#bloodhound-active-directory-dataset) to explore the properties available on different types of Active Directory privilege relationships.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PywrCQAxF9%2F2K7JwBC4rrLhQX%2FoOIpG1sx3YezMRHpR9vR4tWMJsEcu7NTeXR1WK2aa0td%2FZiyuN6O5NJD1VcpBq5qEHIdE%2BHVMgEhnLenqng2B15VhQgA5pDizm1cX4PgqKNvqboXNtNaWtAvJxiDQDdHZoSGmXKDL3HKfzherjV5AlUMJZJO%2B7El9ovD3JChovW6NWDfjNqbOgYiKfCxSgcs45RXh98PgG2wJ0jexKBvTJVhP%2Ff%2BHNCQt69jQYVD3tYPQGByglydQEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_AD')
| graph-match ()-[e]-()
    project properties = e, labels = labels(e)
| mv-apply properties on (
        mv-expand kind=array properties
        | where isnotempty(properties[1])
        | summarize properties = make_set(properties[0])
    )
| mv-expand label = labels to typeof(string)
| summarize properties =make_set(properties) by label
| take 3
```

|label|properties|
|---|---|
|GetChangesAll|[<br>  "id",<br>  "lbl",<br>  "src",<br>  "dst",<br>  "properties",<br>  "lastseen"<br>]|
|OwnsRaw|[<br>  "id",<br>  "lbl",<br>  "src",<br>  "dst",<br>  "properties",<br>  "lastseen"<br>]|
|AddKeyCredentialLink|[<br>  "id",<br>  "lbl",<br>  "src",<br>  "dst",<br>  "properties",<br>  "lastseen"<br>]|

**Find nodes with specific property values**:

Use this pattern to locate entities with particular characteristics or to validate data quality by checking for expected property values. This example uses the [`BloodHound_Entra` graph](graph-sample-data.md#bloodhound-entra-dataset) to find nodes with specific name properties in Microsoft Entra environments.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OQQqDMBBF955idiq02bjuplDoLcLgDCatyYQ4WoQe3ih201l9%2Fnt8ZsiYXFPfRxF6yhzJPqJmrNvqC8POrgG1d9BEIW4rKPdxnBn8FEU5JF0PZFKWxFk9TyZiONVSvrhX2A3rCW5HMp4ucPqrXXCc%2BUf%2BVsoTim%2BGbgNX9s4YpwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
graph('BloodHound_Entra')
| graph-match (node)
    where isnotempty(node.properties.name)
    project node_id = node.id, property_value = node.properties.name
| take 3
```

|node_id|property_value|
|---|---|
|1|JJACOB@PHANTOMCORP.ONMICROSOFT.COM|
|10|CJACKSON@PHANTOMCORP.ONMICROSOFT.COM|
|12|RHALL@PHANTOMCORP.ONMICROSOFT.COM|

### Topology of the graph

Understanding the overall topology of your graph reveals the types of connections that exist between different entity types. This analysis helps you understand the data model, identify the most common relationship patterns, and discover potential paths for traversal queries. The topology query shows which node labels connect to which other node labels through specific edge types, providing a comprehensive view of your graph's structure.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32QwW7CMAyG730K35pKi3gCNgnYTtxA4oAmFFLTZmrjKHHZinj4me6wQqf5Esv29%2FuPZ7MtBWqo6oFOwDVCFU2oQcOuNpwnsOQ9WsYSmOBTai%2FZMKHy9WqxPLw5b7x1psmL7PrD6tawrUGlaAu9x3f9rMrERQYSIdKHqMGGumhxbY7YJJhDMyQD8QSvZTXpoNRXmFi2sSP%2F2B70r9CeNX4F48tfDZkZ6ckXuA9IJ5U4Ol%2FdQyNTgt1Z%2FB98dCb01OxfEqlrWxPdBWFJnWfh7O1VBRz7sYHRUaZ3%2BAY9FMKWwwEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
//Topology of the graph - What's connected to what?
graph('LDBC_Financial')
| graph-match (src)-[e]->(dst)
    project SourceLabels = labels(src), EdgeLabels = labels(e), DestinationLabels = labels(dst)
| mv-expand EdgeLabel = EdgeLabels to typeof(string)
| mv-expand SourceLabel = SourceLabels to typeof(string)
| mv-expand DestinationLabel = DestinationLabels to typeof(string)
| summarize Count = count() by SourceLabel, EdgeLabel, DestinationLabel
```

|SourceLabel|EdgeLabel|DestinationLabel|Count|
|---|---|---|---|
|COMPANY|GUARANTEE|COMPANY|202|
|COMPANY|APPLY|LOAN|449|
|PERSON|APPLY|LOAN|927|
|ACCOUNT|REPAY|LOAN|2747|
|LOAN|DEPOSIT|ACCOUNT|2758|
|ACCOUNT|TRANSFER|ACCOUNT|8132|
|ACCOUNT|WITHDRAW|ACCOUNT|9182|
|PERSON|GUARANTEE|PERSON|377|
|COMPANY|OWN|ACCOUNT|671|
|COMPANY|INVEST|COMPANY|679|
|PERSON|OWN|ACCOUNT|1384|
|MEDIUM|SIGN_IN|ACCOUNT|2489|
|PERSON|INVEST|COMPANY|1304|

## Related content

- [Graph semantics overview](graph-semantics-overview.md)
- [Common scenarios for using graph semantics](graph-scenarios.md)
- [Graph sample datasets and examples](graph-sample-data.md)
- [Graph function](graph-function.md)
- [make-graph operator](make-graph-operator.md)
