# The macro-expand operator

The `macro-expand` operator provides concise syntax for applying a subquery
to a set of entities (clusters, databases, or tables) and combining their results.
It may come handy, for example, when one has data spread over multiple
clusters/databases/table (for example, when data is held in the same global region
as its source). The set of entities is called **entity group**; it can be stored for
reuse in a database, or defined ad-hoc in the query text itself.

> [!NOTE]
> The operation of the `macro-expand` operator can be altered by setting the `best_effort` request property to `true`, using either a `set statement` or through [client request properties](../api/rest/request-properties.md). When this property is set to `true`, the `macro-expand` operator will disregard fuzzy resolution and connectivity failures to execute any of the sub-expressions being “unioned” and yield a warning in the query status results.

## Computation model

The `macro-expand` operator takes three arguments:

1. An identifier whose appearance in the subquery is expanded
   into each of the entities in the entity group.

1. An entity group, which is a collection of entity references;
   these can be references to clusters, to databases, or to tables.
   (The same entity group can only reference entities of the same kind,
   however; one can't mix clusters and databases in the same entity group,
   for example.)

1. A subquery that takes no tabular input, produces a single tabular output,
   and may reference entities in the entity group through the use of the
   aforementioned identifier. The subquery must include exactly one tabular
   expression, and may optionally include additional let-statements preceding
   the tabular expression.

The computation model of the `macro-expand` operator is as follows:
The operator takes no input, and is the `union` of expanding the subquery
as many times as there are individual entities in the entity group.

## Syntax

There are several syntactic variants one may use with the `macro-expand` operator:

1. Explicit: In this syntax, the operator name (`macro-expand`), identifier,
   entity group, and subquery are all explicit in the text of the operator
   invocation itself.

2. Explicit using let statement: This syntax is similar to the explicit syntax,
   with the difference being that the entity group is specified in the query
   using a let statement (that is, outside the `macro-expand` operator).

3. Explicit using stored entity group: This syntax is similar to the syntax
   that uses the let statement, only the query itself doesn't define the entity group.
   Rather, the group is stored in the database-in-scope as a named entity.

### Explicit syntax

`macro-expand` [`kind` `=` *Kind*] [`isfuzzy` `=` *IsFuzzy*] *EntityGroup* `as` *EntityIdentifier*  `(` *Subquery* `)`

Where:

* *EntityGroup* has the syntax `entity_group` `[` *EntityReference1* [`,` ...] `]`,
  and denotes one or more entities that *EntityIdentifier* expands to.

> [!NOTE]
>  A query can only reference entity groups defined in the query text or in the database-in-context. Entity groups in other databases or clusters (directly or indirectly) cannot be referenced.

* *EntityIdentifier* is an identifier whose appearance in *Subquery*
  gets expanded into each of the entities in the group.

* *Subquery* is a tabular expression (optionally preceded by one or more let
  statements) that takes no source and may reference *EntityIdentifier*.
  All entity references other than *EntityIndentifier* behave "normally"; they
  reference other query let statements, stored functions, etc. from the
  database-in-scope.

* *Kind* can take one of two values:
    - `inner` - The result has the subset of columns that are common to all of the accessed scoped entities.
    - `outer` - The result has all the columns that occur in any of the inputs. Cells that weren't defined by an input row are set to null. This is the default.

* *IsFuzzy* (is set to `true`) enables fuzzy resolution of macro-expand scoped entities.
  Fuzzy applies to the set of union sources. It means that while analyzing the query and preparing for execution,
  the set of scope sources is reduced to the set of entities that exist and are accessible at the time.
  If at least one such entity was found, any resolution failure will yield a warning in the query status results
  (one for each missing reference), but will not prevent the query execution;
  if no resolutions were successful - the query will return an error. The default is `false`.

For example, the query below calculates the number of errors produced by each SKU.

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

Here's another way to write the same query without using `macro-expand`:

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

In this example:

1. The `entity_group` is a collection of databases from different clusters.

1. The identifier `X` is used to scope entity references. Entities that are
   are not scoped by this identifier are taken to be in the database-in-scope
   scope (if they are not overridden as query-provided identifiers.)

1. The `summarize` operator operates on the `union` of all expanded subqueries.
   As the `expand` operator get applied only to the subquery between the `(` and `)`
   characters, it's clear which scope is expanded and which is not.

1. The `join` operator above is calculated two times, one for each entity in the
   `entity_group`. Also note that `join` here is being done between two tables
   of the same entity (denoted by `X`) &emdash; there's no cross-cluster `join` here.

1. Not shown in this example, the subquery part can include additional uses of
   the `macro-expand` operator (nested expansions). Note that the identifier of the inner
   `macro-expand` cannot equal that of the outer, providing a clear way to distinguish the 
   scope.

### Special Contextual functions

The `macro-expand` subquery can reference two specialized scalar functions as-if they are part of the entity being referenced:

1. `$current_database` - Returns the database name of the entity reference.
2. `$current_cluster_endpoint` - Returns the URL of the cluster of the entity reference.

Examples:

```kusto
macro-expand MyEntityGroup as X
(
    X.Admins
    | extend current_database = X.$current_database, current_cluster = X.$current_cluster_endpoint
)
| summarize count() by current_cluster, current_database
```

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

### Explicit using let statement

`macro-expand` *EntityIdentifier* `in` *EntityGroupIdentifier* `(` *Subquery* `)`

Here, *EntityGroupIdentifier* is simply an identifier which has been defined by
the query using a let statement:

`let` *EntityGroupIdentifier* `=` `entity_group` `[` *EntityReference1* [`,` ...] `]`

For example, the previous example could be re-written as:

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

### Explicit using stored entity group

The syntax is exactly the same as for using the let statement.
See here [Stored Entity Groups Management](../management/entity-groups.md)
