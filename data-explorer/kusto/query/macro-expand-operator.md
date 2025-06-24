---
title: macro-expand operator
description: Learn how to use the macro-expand operator to run a subquery on a set of entities.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/30/2025
---
# macro-expand operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `macro-expand` operator simplifies running a subquery on a set of [entities](schema-entities/index.md), such as clusters, databases, or tables, and then combining the results into a single output.

The operator is useful when you have data spread across multiple clusters, databases, or tables. For example, when data is held in the same global region as its source, you can use the `macro-expand` operator in a single query across data in distinct locations, instead of running separate queries for each entity and combining the results manually.

The set of entities you want to query is called an *entity group*. The entity group can be stored for reuse in a database or defined directly in your query text. For more information about stored entity groups, see [Entity groups](../management/entity-groups.md).

The `macro-expand` operator runs the subquery separately for each entity in the group and then combines all the results into a single output. The subquery can include nested `macro-expand` operators. However, the identifier for the inner `macro-expand` must be different from the identifier for the outer `macro-expand` to clearly distinguish between the scope and references of each one.

## Syntax

`macro-expand` [`kind` `=` *Kind*] [`isfuzzy` `=` *IsFuzzy*] *EntityGroup* `as` *EntityIdentifier*  `(`*Subquery*`)`

`macro-expand` [`kind` `=` *Kind*] [`isfuzzy` `=` *IsFuzzy*] `entity_group` `[`*EntityReference* [`,` ...]  `as` *EntityIdentifier*  `(`*Subquery*`)``]`

`macro-expand` *EntityIdentifier* `in` *EntityGroupIdentifier* `(`*Subquery*`)`

> [!NOTE]
> The operation of the `macro-expand` operator can be modified by setting the `best_effort` request property to `true`, either by using a `set statement` or through [client request properties](../api/rest/request-properties.md). When this property is set to `true`, the `macro-expand` operator ignores fuzzy resolution and connectivity failures, to execute any of the subexpressions being unioned and issues a warning in the query status results.

### Variations

There are several ways to specify the entity group used by the `macro-expand` operator:

- **Inline:** All elements are explicitly defined in the text of the operator invocation itself. For an example, see [Calculate errors](#calculate-errors).

- **Via `let` statement:** The entity group is specified in the query using a `let` statement outside the `macro-expand` operator using the syntax:

    `let` *EntityGroupIdentifier* `=` `entity_group` `[`*EntityReference* [`,` ...]`]`

   For an example, see [Calculate SKU errors using `let` statement](#calculate-sku-errors-using-let-statement).

- **Using a stored entity group:** The query uses an entity group stored in the database in scope rather than defined in the query.

   For an example, see [Extend table with contextual scalar functions](#extend-table-with-contextual-scalar-functions).

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Kind* | `string` | | Either `inner` or `outer` (default). When `kind` is set to `inner`, the results only include columns common to all the accessed scoped entities. If set to `outer`, the result includes all the columns that occur in any of the inputs. Cells not defined by an input row are set to `null`. |
| *IsFuzzy* |  |  | When set to `true`, it only considers entity sources that currently exist and are accessible. If at least one entity is found, the query runs, and any missing entities generate warnings in the query status results. If no entities are found, the query can't resolve any specified entities and returns an error. The default is `false`. |
| *EntityGroup* |  |  :heavy_check_mark: | A set of one or more entities that *EntityIdentifier* expands into when a query is run. The entity group can be a stored entity group or a defined group. It denotes one or more entities of the same type that *EntityIdentifier* expands to. |
| *EntityIdentifier* | `string` |  :heavy_check_mark: |  An identifier that serves as a placeholder for an entity in the subquery, and which is expanded into the actual entity when the query is run. Entities that aren't explicitly scoped in *EntityIdentifier* are assumed to be part of the current in scope database. Any specific identifiers included in the query override the default assumption. |
|*EntityReference*| `string` | |An entity included in the entity group. One or more *EntityReference* is required if an *EntityGroup* isn't specified. |
| *Subquery* | `string` |  :heavy_check_mark: | A single tabular expression that doesn’t take input data directly. It might include references to entities through an *EntityIdentifier*, and use expressions such as let statements, stored functions, or other elements from the database in scope. *Subquery* can be preceded by one or more `let` statements. It can also reference [Subquery contextual functions](#subquery-contextual-functions).|

> [!NOTE]
> A query can only reference entity groups defined in the query text or in the current database. Entity groups in other databases or clusters can't be referenced directly or indirectly.

### Subquery contextual scalars

The `macro-expand` subquery can reference two specialized scalar values as if they're part of the entity being referenced:

* `$current_database` - Returns the database name of the entity reference (a `string`).
* `$current_cluster_endpoint` - Returns the URL of the cluster of the entity reference (a `string`).

> [!NOTE]
> These values can only be used when they are scoped by the *EntityReference*.
> For example, if *EntityReference* is a database and the `macro-expand` is using `DB` to reference the database,
> use `DB.$current_cluster_endpoint` to retrieve the URL of the cluster which hosts the database.

## Examples

The following examples show how to use the `macro-expand`operator.

### Calculate errors

The following example uses an [inline variation](#variations) entity group to calculate the number of errors produced by each Stock Keeping Unit (SKU). It defines an `entity_group`, `X`, that includes databases named `MyDatabase` in two clusters. The query then performs a subquery to filter for error logs and counts the errors by `Source`. Next it performs an `inner` join on `Source` with the `DimCluster` table to get the `SKU` for each source. Finally, it sums the error counts by `SKU`.

```kusto
macro-expand entity_group [cluster('C1').database('MyDatabase'), cluster('C2').database('MyDatabase')] as X
(
    X.Logs
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
    cluster('C1').database('MyDatabase').Logs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (cluster('C1').database('MyDatabase').DimCluster | project SKU, Source) on Source
  ),
  (
    cluster('C2').database('MyDatabase').Logs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (cluster('C2').database('MyDatabase').DimCluster | project SKU, Source) on Source
  )
| summarize Sum=sum(Count) by SKU
```

### Calculate SKU errors using `let` statement

The following example uses a [`let` statement](#variations) to define an entity group in a variable named `Greater` which includes the `MyDatabase` database from both `C1` and `C2` clusters. This entity group is then used to perform the same query in the [previous example](#calculate-errors) to calculate the number of errors produced by each SKU. The `macro-expand` operator is used to reference the `Greater` entity group (alias `X`).

```kusto
let GreaterDatabase = entity_group [cluster('C1').database('MyDatabase'), cluster('C2').database('MyDatabase')];
macro-expand GreaterDatabase as X
(
    X.Logs
    | where Level == 'Error'
    | summarize Count=count() by Source
    | join kind=inner (X.DimCluster | project SKU, Source) on Source
)
| summarize Sum=sum(Count) by SKU
```

### Extend table with contextual scalar functions

The following query uses the [stored entity group](#variations) variation. It runs a subquery on the `Admins` table from each entity using the stored entity group `MyEntityGroup`. For more information on how to create a stored entity, see [.create entity_group command](../management/create-entity-group.md). It uses `$current_database` and `$current_cluster_endpoint` to extend the table, adding the current database and current cluster for each row. Then, it summarizes the results by counting the number of rows for each combination of `current_cluster` and `current_database`.

```kusto
macro-expand MyEntityGroup as X
(
    X.Admins
    | extend current_database = X.$current_database, current_cluster = X.$current_cluster_endpoint
)
| summarize count() by current_cluster, current_database
```

### Nested macro-expand query

The following query runs a nested subquery with an outer entity group `MyEntityGroup_Outer` (alias `X`) and an inner entity group `MyEntityGroup_Inner` (alias `Y`). It joins the `Admins` table from each entity in both the outer (`X`) and inner (`Y`) entity groups. The query filters for logs from the last hour. Then it extends the tables to include the current database and cluster for each row using `$current_database` and `$current_cluster_endpoint`. The query performs a `join` on the `Source` column to combine inner and outer entity groups. The prefixes `lhs` (left-hand side) and `rhs` (right-hand side) denote `X` and `Y` entity groups respectively. Finally, it summarizes the results by counting the number of rows for each combination of `lhs_cluster`, `lhs_database`, `rhs_cluster`, and `rhs_database`.

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
* [.show entity_group(s) command](../management/show-entity-group.md)
* [current_database()](current-database-function.md)
* [current_cluster_endpoint()](current-cluster-endpoint-function.md)
