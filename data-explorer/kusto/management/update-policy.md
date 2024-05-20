---
title: Update policy overview
description: Learn how to trigger an update policy to add data to a source table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/20/2024
---
# Update policy overview

Update policies are automation mechanisms triggered when new data is written to a table. They eliminate the need for special orchestration by running a query to transform the ingested data and save the result to a destination table. Multiple update policies can be defined on a single table, allowing for different transformations and saving data to multiple tables simultaneously. The target tables can have a different schema, retention policy, and other policies from the source table.

For example, a high-rate trace source table can contain data formatted as a free-text column. The target table can include specific trace lines, with a well-structured schema generated from a transformation of the source table's free-text data using the [parse operator](../query/parse-operator.md). For more information, [common scenarios](update-policy-common-scenarios.md).

The following diagram depicts a high-level view of an update policy. It shows two update policies that are triggered when data is added to the second source table. Once they're triggered, transformed data is added to the two target tables.

:::image type="content" source="media/updatepolicy/update-policy-overview.png" alt-text="Diagram shows an overview of the update policy.":::

An update policy is subject to the same restrictions and best practices as regular ingestion. The policy scales-out according to the cluster size, and is more efficient when handling bulk ingestion.

> [!NOTE]
>
> * The source and target table must be in the same database.
> * The update policy function schema and the target table schema must match in their column names, types, and order.

Ingesting formatted data improves performance, and CSV is preferred because of it's a well-defined format. Sometimes, however, you have no control over the format of the data, or you want to enrich ingested data, for example, by joining records with a static dimension table in your database.

## Update policy query

If the update policy is defined on the target table, multiple queries can run on data ingested into a source table. If there are multiple update policies, the order of execution isn't necessarily known.

### Query limitations

* The policy-related query can invoke stored functions, but:
  * It can't perform cross-cluster queries.
  * It can't access external data or external tables.
  * It can't make callouts (by using a plugin).
* The query doesn't have read access to tables that have the [RestrictedViewAccess policy](restricted-view-access-policy.md) enabled.
* For update policy limitations in streaming ingestion, see [streaming ingestion limitations](../../ingest-data-streaming.md#limitations).

> [!WARNING]
> An incorrect query can prevent data ingestion into the source table. It is important to note that limitations, as well as the compatibility between the query results and the schema of the source and destination tables, can cause an incorrect query to prevent data ingestion into the source table.
>
> These limitations are validated during the creation and execution of the policy, but not when arbitrary stored functions that the query might reference are updated. Therefore, it is crucial to make any changes with caution to ensure the update policy remains intact.

When referencing the `Source` table in the `Query` part of the policy, or in functions referenced by the `Query` part:

* Don't use the qualified name of the table. Instead, use `TableName`.
* Don't use `database("DatabaseName").TableName` or `cluster("ClusterName").database("DatabaseName").TableName`.

## The update policy object

A table can have zero or more update policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined.

|Property |Type |Description  |
|---------|---------|----------------|
|IsEnabled  |`bool` |States if update policy is *true* - enabled, or *false* - disabled|
|Source |`string` |Name of the table that triggers invocation of the update policy |
|Query |`string` |A query used to produce data for the update |
|IsTransactional |`bool` |States if the update policy is transactional or not, default is *false*. If the policy is transactional and the update policy fails, the source table isn't updated. |
|PropagateIngestionProperties  |`bool`|States if properties specified during ingestion to the source table, such as [extent tags](extent-tags.md) and creation time, apply to the target table. |
|ManagedIdentity | `string` | The managed identity on behalf of which the update policy runs. The managed identity can be an object ID, or the `system` reserved word. The update policy must be configured with a managed identity when the query references tables in other databases or tables with an enabled [row level security policy](row-level-security-policy.md). For more information, see [Use a managed identity to run a update policy](update-policy-with-managed-identity.md). |

> [!NOTE]
> In production systems, set `IsTransactional`:*true* to ensure that the target table doesn't lose data in transient failures.

> [!NOTE]
>
> Cascading updates are allowed, for example from table A, to table B, to table C.
> However, if update policies are defined in a circular manner, this is detected at runtime, and the chain of updates is cut. Data is ingested only once to each table in the chain.

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

## Remove data from source table

After ingesting data to the target table, you can optionally remove it from the source table. Set a soft-delete period of `0sec` (or `00:00:00`) in the source table's [retention policy](retention-policy.md), and the update policy as transactional. The following conditions apply:

* The source data isn't queryable from the source table
* The source data doesn't persist in durable storage as part of the ingestion operation
* Operational performance improves. Post-ingestion resources are reduced for background grooming operations on [extents](../management/extents-overview.md) in the source table.

> [!NOTE]
> When the source table has a soft delete period of `0sec` (or `00:00:00`), any update policy referencing this table must be transactional.

## Performance impact

Update policies can affect cluster performance, and ingestion for data extents is multiplied by the number of target tables. It's important to optimize the policy-related query. You can test an update policy's performance impact by invoking the policy on already-existing extents, before creating or altering the policy, or on the function used with the query.

### Evaluate resource usage

Use [`.show queries`](../management/queries.md), to evaluate resource usage (CPU, memory, and so on) with the following parameters:

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

You can view policy update failures using the [`.show ingestion failures` command](../management/ingestion-failures.md) with the following command:

```kusto
.show ingestion failures
| where FailedOn > ago(1hr) and OriginatesFromUpdatePolicy == true
```

When an update policy failure occurs with the transactional setting set as: 

* `IsTransactional:false`:
    * A failure to run the policy is ignored and ingestion isn't automatically retried.
    * You can manually retry the ingestion.

* `IsTransactional:true`:
    * If the ingestion method is `pull`, ingestion is automatically retried according to the following conditions:
        * Retries are performed until one of following configurable limit settings is met: `DataImporterMaximumRetryPeriod` or `DataImporterMaximumRetryAttempts`
        * By default the `DataImporterMaximumRetryPeriod` setting is two days, and `DataImporterMaximumRetryAttempts`is 10
        * The backoff period starts at 2 minutes, and doubles. So the wait starts with 2 min, then increases to 4 min, to 8 min, to 16 min and so on.

* In any other case, you can manually retry ingestion.

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

## Related content

* [Common scenarios for using table update policies](update-policy-common-scenarios.md)
* [Tutorial: Route data using table update policies](update-policy-tutorial.md)
