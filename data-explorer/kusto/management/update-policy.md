---
title: Update policy overview
description: Learn how to trigger an update policy to add data to a source table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/06/2026
---

# Update policy overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Update policies are automation mechanisms triggered when new data is written to a table. They eliminate the need for special orchestration by running a query to transform the ingested data and save the result to a destination table. Multiple update policies can be defined on a single table, allowing for different transformations and saving data to multiple tables simultaneously. The target tables can have a different schema, retention policy, and other policies from the source table.

For example, a high-rate trace source table can contain data formatted as a free-text column. The target table can include specific trace lines, with a well-structured schema generated from a transformation of the source table's free-text data using the [parse operator](../query/parse-operator.md). For more information, [common scenarios](update-policy-common-scenarios.md).

The following diagram depicts a high-level view of an update policy. It shows two update policies that are triggered when data is added to the second source table. Once they're triggered, transformed data is added to the two target tables.

:::image type="content" source="media/updatepolicy/update-policy-overview.png" alt-text="Diagram shows an overview of the update policy.":::

:::moniker range="azure-data-explorer"
An update policy is subject to the same restrictions and best practices as regular ingestion. The policy scales-out according to the cluster size, and is more efficient when handling bulk ingestion.
::: moniker-end
:::moniker range="microsoft-fabric"
An update policy is subject to the same restrictions and best practices as regular ingestion. The policy scales-out according to the Eventhouse size, and is more efficient when handling bulk ingestion.
::: moniker-end

::: moniker range="azure-data-explorer"

> [!NOTE]
>
> * The source and target table must be in the same database.
> * The update policy function schema and the target table schema must match in their column types, and order.
> * The update policy function can reference tables in other databases. To do this, the update policy must be defined with a `ManagedIdentity` property, and the managed identity must have `viewer` [role](security-roles.md) on the referenced databases.
Ingesting formatted data improves performance, and CSV is preferred because of it's a well-defined format. Sometimes, however, you have no control over the format of the data, or you want to enrich ingested data, for example, by joining records with a static dimension table in your database.

::: moniker-end
::: moniker range="microsoft-fabric"
> [!NOTE]
>
> * The source and target table must be in the same database.
> * The update policy function schema and the target table schema must match in their column types, and order.

::: moniker-end

## Update policy query

If the update policy is defined on the target table, multiple queries can run on data ingested into a source table. If there are multiple update policies, the order of execution isn't necessarily known.

### Query limitations

:::moniker range="azure-data-explorer"

* The policy-related query can invoke stored functions, but:
  * It can't perform cross-cluster queries.
  * It can't access external data or external tables, with the following exception:
    * The query *can* reference an accelerated external table using the [`external_table()` function](../query/external-table-function.md), provided that:
      * The external table has a [query acceleration policy](query-acceleration-policy.md) enabled with a `Hot` period that covers all data (currently `Hot` >= 100 years).
      * The update policy is configured with a `ManagedIdentity` property if the external table uses impersonation authentication.
  * It can't make callouts (by using a plugin).

* The query doesn't have read access to tables that have the [RestrictedViewAccess policy](restricted-view-access-policy.md) enabled.

* For update policy limitations in streaming ingestion, see [streaming ingestion limitations](/azure/data-explorer/ingest-data-streaming#limitations).

* The update policy's query shouldn't reference any materialized view whose query uses the update policy's target table. Doing so might produce unexpected results.

::: moniker-end
:::moniker range="microsoft-fabric"

* The policy-related query can invoke stored functions, but:
  * It can't perform cross-eventhouse queries.
  * It can't access external data or external tables, with the following exception:
    * The query *can* reference an accelerated external table using the [`external_table()` function](../query/external-table-function.md), provided that:
      * The external table has a [query acceleration policy](query-acceleration-policy.md) enabled with a `Hot` period that covers all data (currently `Hot` >= 100 years).
      * Authorization to access the external table is handled automatically through the update policy's `OwnerPrincipalDetails` property.
  * It can't make callouts (by using a plugin).

* The query doesn't have read access to tables that have the [RestrictedViewAccess policy](restricted-view-access-policy.md) enabled.

* By default, the [Streaming ingestion policy](streaming-ingestion-policy.md) is enabled for all tables in the Eventhouse. To use functions with the [`join`](../query/join-operator.md) operator in an update policy, the streaming ingestion policy must be disabled. Use the `.alter` `table` *TableName* `policy` `streamingingestion` *PolicyObject* command to disable it.

* For cascading update policies that include a [`join`](../query/join-operator.md) operator, you must disable streaming ingestion on all upstream tables. For example, consider cascading update policies where Table1 updates Table2, Table2 updates Table3, and Table3 updates Table4. If Table4's update policy includes a join, you must disable streaming ingestion on Table1, Table2, and Table3.
 
* The update policy's query shouldn't reference any materialized view whose query uses the update policy's target table. Doing so might produce unexpected results.

::: moniker-end

> [!WARNING]
> An incorrect query can prevent data ingestion into the source table. It is important to note that limitations, as well as the compatibility between the query results and the schema of the source and destination tables, can cause an incorrect query to prevent data ingestion into the source table.
>
> These limitations are validated during the creation and execution of the policy, but not when arbitrary stored functions that the query might reference are updated. Therefore, it is crucial to make any changes with caution to ensure the update policy remains intact.

When referencing the `Source` table in the `Query` part of the policy, or in functions referenced by the `Query` part:

:::moniker range="azure-data-explorer"

* Don't use the qualified name of the table. Instead, use `TableName`.

* Don't use `database("<DatabaseName>").TableName` or `cluster("<ClusterName>").database("<DatabaseName>").TableName`.
::: moniker-end
:::moniker range="microsoft-fabric"

* Don't use the qualified name of the table. Instead, use `TableName`.

* Don't use `database("<DatabaseName>").TableName` or `cluster("<EventhouseName>").database("<DatabaseName>").TableName`.
::: moniker-end

## The update policy object

A table can have zero or more update policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined.

::: moniker range="azure-data-explorer"

|Property |Type | Description  |
|---------|---------|----------------|
|IsEnabled  |`bool` |States if update policy is *true* - enabled, or *false* - disabled|
|Source |`string` |Name of the table that triggers invocation of the update policy. This can be a native table, or, in preview, an external table of kind `delta` that has a [query acceleration policy](query-acceleration-policy.md) enabled. For more information, see [Update policy over external delta tables](#update-policy-over-external-delta-tables-preview). |
|SourceIsWildCard |`bool` |If *true*, the `Source` property can be a wildcard pattern. See [Update policy with source table wildcard pattern](#update-policy-with-source-table-wildcard-pattern) |
|Query |`string` |A query used to produce data for the update. |
|IsTransactional |`bool` |States if the update policy is transactional or not, default is *false*. If the policy is transactional and the update policy fails, the source table isn't updated. |
|PropagateIngestionProperties  |`bool`|States if properties specified during ingestion to the source table, such as [extent tags](extent-tags.md) and creation time, apply to the target table. |
|ManagedIdentity | `string` | The managed identity on behalf of which the update policy runs. The managed identity can be an object ID, or the `system` reserved word. The update policy must be configured with a managed identity when the query references tables in other databases, tables with an enabled [row level security policy](row-level-security-policy.md), or accelerated external tables that use impersonation authentication. For more information, see [Use a managed identity to run a update policy](update-policy-with-managed-identity.md). |

::: moniker-end
::: moniker range="microsoft-fabric"

|Property |Type |Description  |
|---------|---------|----------------|
|IsEnabled  |`bool` |States if update policy is *true* - enabled, or *false* - disabled|
|Source |`string` |Name of the table that triggers invocation of the update policy. This can be a native table, or, in preview, an external table of kind `delta` that has a [query acceleration policy](query-acceleration-policy.md) enabled. For more information, see [Update policy over external delta tables](#update-policy-over-external-delta-tables-preview). |
|SourceIsWildCard |`bool` |If *true*, the `Source` property can be a wildcard pattern. |
|Query |`string` |A query used to produce data for the update |
|IsTransactional |`bool` |States if the update policy is transactional or not, default is *false*. If the policy is transactional and the update policy fails, the source table isn't updated. |
|PropagateIngestionProperties  |`bool`|States if properties specified during ingestion to the source table, such as [extent tags](extent-tags.md) and creation time, apply to the target table. |
|OwnerPrincipalDetails | `object` | A system-populated, read-only property. Contains the principal details of the user who sets or alters the update policy. This principal is used for authorization when the update policy query references external tables, and, in preview, to run the update policy asynchronously when `Source` is an external delta table. This property is automatically set by the system and can't be modified manually. |

::: moniker-end

> [!NOTE]
> In production systems, set `IsTransactional`:*true* to ensure that the target table doesn't lose data in transient failures.

> [!NOTE]
>
> Cascading updates are allowed, for example from table A, to table B, to table C.
> However, if update policies are defined in a circular manner, this is detected at runtime, and the chain of updates is cut. Data is ingested only once to each table in the chain.

::: moniker range="azure-data-explorer"

## Update policy over external delta tables (preview)

> [!NOTE]
> This capability is in preview.

In addition to a native table, the `Source` of an update policy can be an external table, provided that:

* The external table is of kind `delta`.
* The external table has a [query acceleration policy](query-acceleration-policy.md) enabled.

This capability lets you automatically ingest and transform new data from an external delta table into a native target table, without manual orchestration.

### Example

The following command configures `TargetTable` to ingest new rows from `ExternalDeltaTable`:

````kusto
.alter table TargetTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "ExternalDeltaTable",
        "Query": "ExternalDeltaTable | project Timestamp, Value",
        "IsTransactional": false,
        "PropagateIngestionProperties": false
    }
]
```
````

### Requirements and limitations

* The update policy's `IsTransactional` property must be *false*. Transactional update policies aren't supported when the source is an external table.
* The update policy query can't reference other external tables.
* Standard update policy requirements and limitations still apply, such as the source and target table being in the same database, and schema compatibility between the query results and the target table.
* External tables that use impersonation authentication, or that have a [row level security policy](row-level-security-policy.md) enabled, aren't currently supported as an update policy source.

### Processing behavior

Unlike update policies over native tables, which run synchronously as part of ingestion, update policies over external delta tables run asynchronously on a periodic basis.

> [!IMPORTANT]
> The update policy processes data-changing `Add` actions in the Delta transaction log and ignores `Remove` actions. As a result, rows are never removed or modified in the target table.

This behavior differs from update policies over native tables, where a [`.set-or-replace`](../management/data-ingestion/ingest-from-query.md) command on the source table can replace or remove data in derived target tables.

| Delta operation | Effect on the target table |
|---|---|
| Add new data | Inserts the new rows. |
| Update existing data | Inserts the updated rows. The previous rows aren't removed. |
| Delete data | Takes no action. The deleted rows remain in the target table. |

> [!NOTE]
> For best results, enable deletion vectors on the source delta table. Without deletion vectors, partial delete or update operations on the source delta table might result in duplicate rows in the target table.

### Querying the target table

Querying the target table directly always returns up-to-date results by combining already-processed data with data from delta table versions that haven't been processed yet.

To query only the already-processed data, for better performance at the expense of freshness, use the `materialized_table()` function:

```kusto
materialized_table("TargetTableName")
```

### Error handling

* If the update policy encounters a permanent error, such as the external table becoming inaccessible or a schema mismatch, for seven consecutive days, the update policy is automatically disabled.

### Cascading update policies

You can define an update policy on the target table populated by an update policy over an external delta table. This second update policy behaves like a regular, synchronous update policy over a native table. The delta table-specific behavior described in this section applies only to the first hop, from the external delta table to the native target table.

::: moniker-end
::: moniker range="microsoft-fabric"

## Update policy over external delta tables (preview)

> [!NOTE]
> This capability is in preview.

In addition to a native table, the `Source` of an update policy can be an external table, provided that:

* The external table is of kind `delta`, such as a [OneLake shortcut](/fabric/real-time-intelligence/onelake-shortcuts) to a delta table.
* The external table has a [query acceleration policy](query-acceleration-policy.md) enabled.

This capability lets you automatically ingest and transform new data from an external delta table into a native target table, without manual orchestration.

### Example

The following command configures `TargetTable` to ingest new rows from `ExternalDeltaTable`:

````kusto
.alter table TargetTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "ExternalDeltaTable",
        "Query": "ExternalDeltaTable | project Timestamp, Value",
        "IsTransactional": false,
        "PropagateIngestionProperties": false
    }
]
```
````

### Requirements and limitations

* The update policy's `IsTransactional` property must be *false*. Transactional update policies aren't supported when the source is an external table.
* The update policy query can't reference other external tables.
* Standard update policy requirements and limitations still apply, such as the source and target table being in the same database, and schema compatibility between the query results and the target table.
* External tables that have a [row level security policy](row-level-security-policy.md) enabled aren't currently supported as an update policy source.

### Processing behavior

Unlike update policies over native tables, which run synchronously as part of ingestion, update policies over external delta tables run asynchronously on a periodic basis. The command runs on behalf of the principal in the update policy's `OwnerPrincipalDetails` property, which is populated automatically when the update policy is created or altered. Processing latency is comparable to other periodic processes, such as continuous export or materialized views.

> [!IMPORTANT]
> The update policy processes data-changing `Add` actions in the Delta transaction log and ignores `Remove` actions. As a result, rows are never removed or modified in the target table.

This behavior differs from update policies over native tables, where a [`.set-or-replace`](../management/data-ingestion/ingest-from-query.md) command on the source table can replace or remove data in derived target tables. Because deletions on the external delta table source are always ignored, this data-loss scenario doesn't apply when the source is an external delta table: the target table only ever accumulates new data.

| Delta operation | Effect on the target table |
|---|---|
| Add new data | Inserts the new rows. |
| Update existing data | Inserts the updated rows. The previous rows aren't removed. |
| Delete data | Takes no action. The deleted rows remain in the target table. |

> [!NOTE]
> For best results, enable deletion vectors on the source delta table. Without deletion vectors, partial delete or update operations on the source delta table might result in duplicate rows in the target table.

### Querying the target table

Similar to [materialized views](materialized-views/materialized-view-overview.md), querying the target table directly always returns up-to-date results by combining already-processed data with data from delta table versions that haven't been processed yet.

To query only the already-processed data, for better performance at the expense of freshness, use the `materialized_table()` function:

```kusto
materialized_table("TargetTableName")
```

### Error handling

* If the update policy encounters a permanent error, such as the external table becoming inaccessible or a schema mismatch, for seven consecutive days, the update policy is automatically disabled.
* If a breaking change occurs on the source delta table, such as a partition column change, the update policy is automatically paused. You must resolve the issue and manually re-enable the update policy.
* If the principal in `OwnerPrincipalDetails` no longer has access to the external table, the update policy fails until it's re-altered by a principal with sufficient permissions.

### Cascading update policies

You can define an update policy on the target table populated by an update policy over an external delta table. This second update policy behaves like a regular, synchronous update policy over a native table. The delta table-specific behavior described in this section applies only to the first hop, from the external delta table to the native target table.

::: moniker-end

## Management commands

Update policy management commands include:

* [`.show table *TableName* policy update`](show-table-update-policy-command.md) shows the current update policy of a table.
* [`.alter table *TableName* policy update`](alter-table-update-policy-command.md) defines the current update policy of a table.
* [`.alter-merge table *TableName* policy update`](alter-merge-table-update-policy-command.md) appends definitions to the current update policy of a table.
* [`.delete table *TableName* policy update`](delete-table-update-policy-command.md) deletes the current update policy of a table.

## Update policy is initiated following ingestion

Update policies take effect when data is ingested or moved to a source table, or extents are created in a source table. These actions can be done using any of the following commands:

* [.ingest (pull)](../management/data-ingestion/ingest-from-storage.md)
* [.ingest (inline)](../management/data-ingestion/ingest-inline.md)
* [.set | .append | .set-or-append | .set-or-replace](../management/data-ingestion/ingest-from-query.md)
* [.move extents](move-extents.md)
* [.replace extents](replace-extents.md)
  * The `PropagateIngestionProperties` command only takes effect in ingestion operations. When the update policy is triggered as part of a `.move extents` or `.replace extents` command, this option has no effect.

> [!WARNING]
> When the update policy is invoked as part of a  `.set-or-replace` command, by default data in derived tables is replaced in the same way as in the source table.
> Data may be lost in all tables with an update policy relationship if the `replace` command is invoked.
> Consider using `.set-or-append` instead.

## Update policy with source table wildcard pattern

Update policy supports ingesting from multiple source tables that share the same pattern, while using the
same query as the update policy query. This is useful if you have several source tables, usually sharing the same schema (or a subset of columns that share a common schema), and you would like to trigger ingestion to a
single target table, when ingesting to either of those tables. In this case, instead of defining multiple
update policies, each for a single source table, you can define a single update policy with wildcard as `Source`.The `Query` of the update policy must comply with all source tables matching the pattern.
To reference the source table in the update policy query, you can use a special symbol named `$source_table`. See example in [Example of wild card update policy](#example-of-wild-card-update-policy).

## Remove data from source table

After ingesting data to the target table, you can optionally remove it from the source table. Set a soft-delete period of `0sec` (or `00:00:00`) in the source table's [retention policy](retention-policy.md), and the update policy as transactional. The following conditions apply:

* The source data isn't queryable from the source table
* The source data doesn't persist in durable storage as part of the ingestion operation
* Operational performance improves. Post-ingestion resources are reduced for background grooming operations on [extents](../management/extents-overview.md) in the source table.

> [!NOTE]
> When the source table has a soft delete period of `0sec` (or `00:00:00`), any update policy referencing this table must be transactional.

## Performance impact

Update policies can affect performance, and ingestion for data extents is multiplied by the number of target tables. It's important to optimize the policy-related query. You can test an update policy's performance impact by invoking the policy on already-existing extents, before creating or altering the policy, or on the function used with the query.

### Evaluate resource usage

Use [`.show queries`](../query/queries.md), to evaluate resource usage (CPU, memory, and so on) with the following parameters:

* Set the `Source` property, the source table name, as `MySourceTable`
* Set the `Query` property to call a function named `MyFunction()`

```kusto
// '_extentId' is the ID of a recently created extent, that likely hasn't been merged yet.
let _extentId = toscalar(
    MySourceTable
    | project ExtentId = extent_id(), IngestionTime = ingestion_time()
    | where IngestionTime > ago(10m)
    | top 1 by IngestionTime desc
    | project ExtentId
);
// This scopes the source table to the single recent extent.
let MySourceTable =
    MySourceTable
    | where ingestion_time() > ago(10m) and extent_id() == _extentId;
// This invokes the function in the update policy (that internally references `MySourceTable`).
MyFunction
```

## Transactional settings

The update policy `IsTransactional` setting defines whether the update policy is transactional and can affect the behavior of the policy update, as follows:
* `IsTransactional:false`: If the value is set to the default value, *false*, the update policy doesn't guarantee consistency between data in the source and target table. If an update policy fails, data is ingested only to the source table and not to the target table. In this scenario, ingestion operation is successful.
* `IsTransactional:true`: If the value is set to *true*, the setting does guarantee consistency between data in the source and target tables. If an update policy fails, data isn't ingested to the source or target table. In this scenario, the ingestion operation is unsuccessful.

### Handling failures

When policy updates fail, they're handled differently based on whether the `IsTransactional` setting is `true` or `false`. Common reasons for update policy failures are:

* A mismatch between the query output schema and the target table.
* Any query error.

You can view policy update failures using the [`.show ingestion failures` command](ingestion-failures.md) with the following command:
In any other case, you can manually retry ingestion.

```kusto
.show ingestion failures
| where FailedOn > ago(1hr) and OriginatesFromUpdatePolicy == true
```

## Example of extract, transform, load

You can use update policy settings to perform extract, transform, load (ETL).

In this example, use an update policy with a simple function to perform ETL. First, we create two tables:

* The source table - Contains a single string-typed column into which data is ingested.
* The target table - Contains the desired schema. The update policy is defined on this table.

1. Let's create the source table:

    ```kusto
    .create table MySourceTable (OriginalRecord:string)
    ```

1. Next, create the target table:

    ```kusto
    .create table MyTargetTable (Timestamp:datetime, ThreadId:int, ProcessId:int, TimeSinceStartup:timespan, Message:string)
    ```

1. Then create a function to extract data:

    ```kusto
    .create function
     with (docstring = 'Parses raw records into strongly-typed columns', folder = 'UpdatePolicyFunctions')
         ExtractMyLogs()
        {
        MySourceTable
        | parse OriginalRecord with "[" Timestamp:datetime "] [ThreadId:" ThreadId:int "] [ProcessId:" ProcessId:int "] TimeSinceStartup: " TimeSinceStartup:timespan " Message: " Message:string
        | project-away OriginalRecord
    }
    ```

1. Now, set the update policy to invoke the function that we created:

    ```kusto
    .alter table MyTargetTable policy update
    @'[{ "IsEnabled": true, "Source": "MySourceTable", "Query": "ExtractMyLogs()", "IsTransactional": true, "PropagateIngestionProperties": false}]'
    ```

1. To empty the source table after data is ingested into the target table, define the retention policy on the source table to have 0s as its `SoftDeletePeriod`.

    ```kusto
     .alter-merge table MySourceTable policy retention softdelete = 0s
    ```

## Example of wild card update policy

The following example creates an update policy with a single entry on table `TargetTable`. The policy references all tables matching pattern `SourceTable*` as its source.
Any ingestion to a table which matches the pattern (in local database) will trigger the update policy, and ingest data to `TargetTable`, based on the update policy query.

1. Create two source tables:

    ```kusto
    .create table SourceTable1(Id:long, Value:string)
    ```

    ```kusto
    .create table SourceTable2(Id:long, Value:string)
    ```

1. Create the target table:

    ```kusto
    .create table TargetTable(Id:long, Value:string, Source:string)
    ```

1. Create a function which will serve as the `Query` of the update policy. The function uses the `$source_table` symbol to reference the `Source` of the update policy. Use `skipValidation=true` to skip validation during the create function, since `$source_table` is only known during update policy execution. The function is validated during the next step, when altering the update policy.

    ```kusto
    .create function with(skipValidation=true) IngestToTarget()
    {
        $source_table 
        | parse Value with "I'm from table " Source
        | project Id, Value, Source
    }
    ```

1. Create the update policy on `TargetTable`. The policy references all tables matching pattern `SourceTable*` as its source.

    ````kusto
        .alter table TargetTable policy update
        ```[{ 
                "IsEnabled": true, 
                "Source": "SourceTable*", 
                "SourceIsWildCard" : true,
                "Query": "IngestToTarget()",
                "IsTransactional": true,
                "PropagateIngestionProperties": true
        }]```

    ````

1. Ingest to source tables. Both ingestions trigger the update policy:

    ```kusto
    .set-or-append SourceTable1 <| 
        datatable (Id:long, Value:string)
        [
            1, "I'm from table SourceTable1",
            2, "I'm from table SourceTable1"
        ]
    ```

    ```kusto
    .set-or-append SourceTable2 <| 
        datatable (Id:long, Value:string)
        [
            3, "I'm from table SourceTable2",
            4, "I'm from table SourceTable2"
        ]
    ```

1. Query `TargetTable`:

    ```kusto
     TargetTable
    ```

    |Id|Value|Source|
    |---|---|---|
    |1|I'm from table SourceTable1|SourceTable1|
    |2|I'm from table SourceTable1|SourceTable1|
    |3|I'm from table SourceTable2|SourceTable2|
    |4|I'm from table SourceTable2|SourceTable2|

## Related content

* [Common scenarios for using table update policies](update-policy-common-scenarios.md)
* [Tutorial: Route data using table update policies](update-policy-tutorial.md)
