---
title: macro-expand operator
description: Learn how to use the macro-expand operator to run a subquery on a set of entitites.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/20/2025
---
# macro-expand operator

The `macro-expand` operator simplifies running a subquery on a set of [entities](schema-entities/index.md) such as clusters, databases, or tables, and then combining the results into a single output.

The operator is useful when you have data spread across multiple clusters, databases, or tables. For example, when data is held in the same global region as its source, you can use the `macro-expand` operator in a single query across data in distinct locations, instead of running separate queries for each entity and combining the results manually.

The set of entities you want to query, is called an **entity group**. The entity group can be stored for reuse in a database, or defined directly in your query text. For more information about stored entity groups, see [Entity groups](../management/entity-groups.md).

The `macro-expand` operator runs the subquery separately for each entity in the group and then combines all the results into a single output. The subquery can include nested `macro-expand` operators. This means you can use the `macro-expand` operator within another `macro-expand` operator. However, the identifier for the inner `macro-expand` must be different from the identifier for the outer `macro-expand` to clearly distinguish between the scope and references of each one.

<!--## Computational model -->
<!--is this important or described in the table below?
The `macro-expand` operator takes three arguments:

1. An entity identifier that, when it appears in the subquery, is replaced with each entity in the entity group.

1. An entity group, or collection of entity references of the same kind. Entities of different types can't be combined in the same entity group.

1. A subquery that takes no tabular input, produces a single tabular output,
   and may reference entities in the entity group through the use of the
   aforementioned identifier. The subquery must include exactly one tabular
   expression, and may optionally include additional let-statements preceding
   the tabular expression.

The computation model of the `macro-expand` operator is as follows:
The operator takes no input, and is the `union` of expanding the subquery
as many times as there are individual entities in the entity group.
-->

### Syntax

`macro-expand` [`kind` `=` *Kind*] [`isfuzzy` `=` *IsFuzzy*] *EntityGroup* `as` *EntityIdentifier*  `(` *Subquery* `)`

`macro-expand` [`kind` `=` *Kind*] [`isfuzzy` `=` *IsFuzzy*] `entity_group` `[` *EntityReference* [`,` ...]  `as` *EntityIdentifier*  `(` *Subquery* `)` `]`

`macro-expand` *EntityIdentifier* `in` *EntityGroupIdentifier* `(` *Subquery* `)`

<!---- should the syntax include a let example?-->
> [!NOTE]
> The operation of the `macro-expand` operator can be modified by setting the `best_effort` request property to `true`, either by using a `set statement` or through [client request properties](../api/rest/request-properties.md). When this property is set to `true`, the `macro-expand` operator ignores fuzzy resolution and connectivity failures to execute any of the subexpressions being unioned and issues a warning in the query status results.

## Syntax variations

There are several syntactic variants that are used with the `macro-expand` operator:

1. **Explicit:** The `macro-expand` operator, identifier, entity group, and subquery are all explicitly defined in the text of the operator invocation itself.

1. **Explicit using let statement:** The entity group is specified in the query using a `let` statement outside the `macro-expand` operator using the syntax:

    `let` *EntityGroupIdentifier* `=` `entity_group` `[` *EntityReference* [`,` ...] `]`

1. **Explicit using stored entity group:** The query uses an entity group stored in the database in scope rather than defined in the query.

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Kind* | `string` | | Either `inner` or `outer` (default). When `kind` is set to `inner`, the results only include columns common to all the accessed scoped entities. If set to `outer`, the result includes all the columns that occur in any of the inputs. Cells that aren't defined by an input row are set to `null`. |
| *IsFuzzy* |  |  | When set to `true`, it only considers entity sources that currently exist and are accessible. If at least one entity is found, the query runs, and any missing entities generate warnings in the query status results. If no entities are found, the query can't resolve any specified entities and returns an error. The default is `false`. |
| *EntityGroup* |  |  :heavy_check_mark: | A set of one or more entities that *EntityIdentifier* expands to when a query is run. The entity group can be a stored entity group or a directly defined group. It denotes one or more entities of the same type that *EntityIdentifier* expands to. |
| *EntityIdentifier* | `string` |  :heavy_check_mark: |  An identifier that serves as a placeholder for an entity in the subquery, and which is expanded into the actual entity when the query is run. Entities that aren't explicitly scoped in *EntityIdentifier* are assumed to be part of the current in scope database. Any specific identifiers included in the query override the default assumption. |
|*EntityReference*| `string` | |An entity included in the entity group. One or more *EntityReference* is required if an *EntityGroup* isn't specified. |
| *Subquery* | `string` |  :heavy_check_mark: | A single tabular expression that doesn’t take input data directly. It might include references to entities through an *EntityIdentifier*, and use expressions such as let statements, stored functions, or other elements from the database in scope. *Subquery* can also be preceded by one or more `let` statements. It can also reference [specialized scalar functions](#subquery-contextual-functions).|

> [!NOTE]
> A query can only reference entity groups defined in the query text or in the current database. Entity groups in other databases or clusters can't be referenced directly or indirectly.

### Subquery contextual functions

The `macro-expand` subquery can reference two specialized scalar functions as if they're part of the entity being referenced:

* `$current_database` - Returns the database name of the entity reference.
* `$current_cluster_endpoint` - Returns the URL of the cluster of the entity reference.

## Examples

### Calculate errors

The following example uses an entity group to calculate the number of errors produced by each Stock Keeping Unit (SKU). It defines an `entity_group`, `X` that includes databases named `Kuskus` in two clusters. The query then performs a subquery where it filters for error logs, counts the errors by `Source`, and performs an `inner` join on `Source` with the `DimCluster` table to get the `SKU` for each source. Finally, it sums the error counts by `SKU`.

```kusto
macro-expand entity_group [cluster('C1').database('Kuskus'), cluster('C2').database('Kuskus')] as X
(
    X.KustoLogs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (X.DimCluster | project SKU, Source) on Source
)
| summarize Sum=sum(Count) by SKU
```

* The `summarize` operator works on the combined results of all expanded subqueries while the  `macro-expand` operator is only applied to the subquery between the parentheses so it's clear which scope is expanded.

* The `join` operator is executed separately for each entity in the `entity_group`. In the example, the `join` is performed between two tables in the same entity, denoted by `X`. This means there was no cross-cluster `join`.

To write the same query without using `macro-expand`, it might look as follows:

```kusto
union
  (
    cluster('C1').database('Kuskus').KustoLogs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (cluster('C1').database('Kuskus').DimCluster | project SKU, Source) on Source
  ),
  (
    cluster('C2').database('Kuskus').KustoLogs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (cluster('C2').database('Kuskus').DimCluster | project SKU, Source) on Source
  )
| summarize Sum=sum(Count) by SKU
```

### Calculate SKU errors using `let` statement

The following example uses a `let` statement to define an entity group named `UberKuskus` that includes the `Kuskus` database from both `C1` and `C2` clusters. It then uses that to perform the same query in the previous example to calculate the number of errors produced by each SKU.  It uses the `macro-expand` operator to reference the `UberKuskus` entity group (alias `X`).

```kusto
let UberKuskus = entity_group [cluster('C1').database('Kuskus'), cluster('C2').database('Kuskus')];
macro-expand UberKuskus as X
(
    X.KustoLogs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (X.DimCluster | project SKU, Source) on Source
)
| summarize Sum=sum(Count) by SKU
```

### Extend table with contextual scalar functions

The following query runs a subquery on the `Admins` table from each entity in the `MyEntityGroup`. It uses `$current_database` and `$current_cluster_endpoint` to extend the table to include the current database and current cluster for each row. It then summarizes the results by counting the number of rows for each combination of `current_cluster` and `current_database`.

```kusto
macro-expand MyEntityGroup as X
(
    X.Admins
    | extend current_database = X.$current_database, current_cluster = X.$current_cluster_endpoint
)
| summarize count() by current_cluster, current_database
```

### Nested macro-expand query

The following query runs a nested subquery with an outer entity group `MyEntityGroup_Outer` (alias `X`) and an inner entity group `MyEntityGroup_Inner` (alias `Y`). It joins the `Admins` table from each entity in both the outer and inner entity groups. The query filters for logs from the last hour, extends the tables to include the current database and cluster for each row using `$current_database` and `$current_cluster_endpoint`, and performs a `join` on the `Source` column. The prefixes `lhs` and `rhs` denote `X` and `Y` entity groups respectively. Finally, it summarizes the results by counting the number of rows for each combination of `lhs_cluster`, `lhs_database`, `rhs_cluster`, and `rhs_database`.

```kusto
macro-expand MyEntityGroup_Outer as X
(
    macro-expand  MyEntityGroup_Inner as Y
    (
        X.Admins
        | where Timestamp > ago(1h)
        | extend lhs_database = X.$current_database, lhs_cluster = X.$current_cluster_endpoint
        | join (
            Y.Admins
            | where Timestamp > ago(1h)
            | extend rhs_database = Y.$current_database, rhs_cluster = Y.$current_cluster_endpoint
        ) on Source
    )
)
| summarize count() by lhs_cluster, lhs_database, rhs_cluster, rhs_database
```

## Related content

* [Entity groups](../management/entity-groups.md)
* [join operator](join-operator.md)
* [union operator](union-operator.md)
* [.show entity_group(s)](../management/show-entity-group.md)
* [current_database()](current-database-function.md)
* [current_cluster_endpoint()](current-cluster-endpoint-function.md)
