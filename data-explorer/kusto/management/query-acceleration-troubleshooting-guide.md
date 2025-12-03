---
title: Query Acceleration Troubleshooting Guide
description: Learn how to troubleshoot for common errors encountered in query acceleration.
ms.reviewer: urishapira
ms.topic: reference
ms.date: 12/03/2025
---

# Troubleshoot query acceleration over external delta tables

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The [query acceleration policy](query-acceleration-policy.md) enables accelerating queries over external delta tables by caching delta table metadata and data files. The policy defines which date ranges (number of days back and hot windows) are accelerated so that queries over those ranges can run faster.

The query acceleration feature consists of the following components:

- A background job that maintains a local snapshot (**catalog**) of the delta table metadata.
- A background job that caches delta table data files.
- Query-time enhancements that utilize the catalog and the cached data.

To understand why things aren't working as expected, you need to identify which of these components isn't functioning properly.

This article helps you troubleshoot scenarios where:

- Query over an accelerated external delta table returns **stale data**, or
- Query over an accelerated external delta table is **slower than expected**

## Prerequisites

1. **Ensure query acceleration is enabled on the external table** by running the following command:

    ```kusto
    .show external table <ETName> policy query_acceleration
    | project isnotnull(Policy) and todynamic(Policy).IsEnabled
    ```

    If this command returns `false`, enable the query acceleration policy by using the [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md).

1. **Ensure the delta table complies with the Delta protocol.**

    The query acceleration feature assumes a delta table that complies with the Delta protocol. Manual operations executed directly on the delta table (for example, editing transaction logs or parquet files) aren't supported and might result in unexpected behavior.

    If you executed such operations on the delta table, recreate the external table and re-enable the query acceleration policy.

## Common errors

### Query returns stale data

This issue occurs when query results don't reflect the latest data from the underlying delta table.

Query acceleration refreshes the accelerated data periodically, so that results are no older than the configured `MaxAge` value in the policy. 
By design, queries over accelerated external tables might return data that lags behind the latest delta table version by up to `MaxAge`. Set `MaxAge` to the maximum data staleness that is acceptable at query time.

You can control the effective `MaxAge` in two ways:

- Configure the `MaxAge` property in the query acceleration policy by using the [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md).
- Override `MaxAge` per query by using the [`external_table()` operator's](../query/external-table-function.md) `MaxAgeOverride` parameter.

### Query latency

If a query is performing slower than anticipated and query acceleration doesn't seem to enhance performance, consider the following potential causes:

- **Unusable query acceleration catalog**: The catalog may be outdated or not yet built. Refer to the [Troubleshoot unusable catalogs](#troubleshoot-unusable-catalogs) section for resolution steps.
- **Query accessing non-accelerated data**: The query might be scanning data that hasn't been cached. See the [Troubleshoot queries over nonaccelerated data](#troubleshoot-queries-over-nonaccelerated-data) section for guidance.
- **Non-compliance with KQL best practices**: Ensure the query adheres to KQL best practices. Refer to the [KQL best practices](../query/best-practices.md) guide for optimization techniques.

### Unusable catalogs

Query acceleration uses a local catalog for the external table that contains a snapshot of the delta table metadata. If this catalog isn't updated within the configured `MaxAge` (see the query acceleration policy's `MaxAge` property), it's considered **unusable** and isn't used at query time. In this case, queries fall back to reading the remote delta table directly, which can be significantly slower.

Retrieve the current state of the catalog with the following command:

```kusto
.show external table [ETName] details
| extend MinimumUpdateTime = now() - totimespan(todynamic(QueryAccelerationPolicy).MaxAge)
| project IsCatalogUnusable = MinimumUpdateTime > todatetime(todynamic(QueryAccelerationState).LastUpdatedDateTime)
```

`IsCatalogUnusable == true` indicates the catalog is stale and query acceleration isn't used.


To maximize the benefits of query acceleration, ensure your queries target **accelerated data**. Queries that access non-accelerated data retrieve information directly from the remote delta table, which might result in higher latency.

Use the following command and filter on a time frame that includes the relevant query:

```kusto
.show queries
| where StartedOn > ago(1h)
| extend ExternalDataStats = OverallQueryStats.input_dataset_statistics.external_data
```

If `ExternalDataStats.iterated_artifacts` or `ExternalDataStats.downloaded_items` are greater than `0`, the query reads data from the remote delta table (non-accelerated path).

## Troubleshooting

### Troubleshoot unusable catalogs

To understand why a catalog is unusable, first check if the query acceleration state is healthy and resolve unhealthy reasons as needed.

Run:

```kusto
.show external table [ETName] details
| project state = todynamic(QueryAccelerationState)
| project IsHealthy = state.IsHealthy, UnhealthyReason = state.NotHealthyReason
```

- If the state is **healthy** but the catalog is still stale, it could be that the query acceleration policy was enabled recently.
    When you enable the query acceleration policy for the first time, the initial catalog needs to be built before you can use it in queries. During this period, the `LastUpdatedDateTime` value is empty:
    
    ```kusto
    .show external table [ETName] details
    | project todynamic(QueryAccelerationState).LastUpdatedDateTime
    ```
    
    If `LastUpdatedDateTime` is empty, allow some time for the first update to complete. This process usually takes up to several minutes. Subsequent updates are significantly faster.

- If the state is **unhealthy**, you can retrieve the unhealthy reason by using the following command:

    ```kusto
    .show external table [ETName] details
    | project todynamic(QueryAccelerationState).NotHealthyReason
    ```

Use the following table to understand and mitigate common unhealthy states.

> [!NOTE]
>
> To re-enable an external table's query acceleration policy, run the following commands:
>```kusto
> .execute database script <|
> .alter-merge external table [ETName] policy query_acceleration @'{"IsEnabled":false}'
> .alter-merge external table [ETName] policy query_acceleration @'{"IsEnabled":true}'
>```

::: moniker range="azure-data-explorer"

| Unhealthy reason                                                      | Example `NotHealthyReason`                                              | Action                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| External table access is forbidden                                    | `InaccessibleDeltaTable: Access to Delta table is forbidden`            | Verify the connection string of the external table, including the authentication method, and that the permissions on the underlying storage are correct.                                                                                                                                                 |
| External table connection string doesn't point to a valid delta table | `DeltaTableNotFound: Delta table does not exist`                        | Alter the external table’s connection string so it targets a valid Delta table location. Make sure the path points to the table’s root folder - not the _delta_log directory.                                                                                                                                             |
| Delta table column mapping mode has changed                           | `ColumnMappingModeChange: Column mapping mode has changed. Previous: 'None', New: 'Name'` | Recreate the external table and re-enable the query acceleration policy.                                                                                                                     |
| Delta table column mappings have changed                              | `NewColumnMapping: New column mapping was introduced. Column 'Col1' is now mapped to 'Col2'` | Recreate the external table and re-enable the query acceleration policy so that column mappings are aligned with the delta table.                                                                                              |
| Delta table column type has changed                                   | `ColumnTypeMismatch: Column 'Col1' type has changed. Previous delta type: 'long', New type: 'string'. Respective external table type: long` | Recreate (or alter) the external table so that its schema is aligned with the delta table column types, and then re-enable query acceleration.                                         |
| Hot datetime column not found                                         | `HotDateTimeColumn 'Col1' does not exist as a datetime column in the Delta table schema` | Alter the query acceleration policy to include a valid `HotDateTimeColumn` (a column of type `datetime` in the delta table), or leave the property empty if not required.                                                                 |
| Delta table has one of the following unsupported features for query acceleration <br/>• Column mapping mode 'Name' <br/>• AddFile transactions referencing files with absolute path <br/>• deletion vectors with absolute path      | `Unsupported feature: Column mapping of type 'Id'`                       | Recreate the delta table with a supported configuration (for example, using `Name` column mapping type), and then re-enable query acceleration.                                        |
| Managed identity error                                                | `Managed identity must be specified for external tables with impersonation authentication.` | Ensure that the query acceleration policy contains a valid managed identity that has:<br/>• Appropriate permissions on the Delta table<br/>• The `AutomatedFlows` usage type in the cluster or database managed identity policy. |

::: moniker-end

::: moniker range="microsoft-fabric"

| Unhealthy reason                                                      | Example `NotHealthyReason`                                              | Action                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| External table access is forbidden                                    | `InaccessibleDeltaTable: Access to Delta table is forbidden`            | Verify the connection string of the external table, including the authentication method, and that the permissions on the underlying storage are correct.                                                                                                                                                 |
| External table connection string doesn't point to a valid delta table | `DeltaTableNotFound: Delta table does not exist`                        | Alter the external table’s connection string so it targets a valid Delta table location. Make sure the path points to the table’s root folder - not the _delta_log directory.                                                                                                                                           |
| Delta table column mapping mode has changed                           | `ColumnMappingModeChange: Column mapping mode has changed. Previous: 'None', New: 'Name'` | Recreate the external table and re-enable the query acceleration policy.                                                                                                                     |
| Delta table column mappings have changed                              | `NewColumnMapping: New column mapping was introduced. Column 'Col1' is now mapped to 'Col2'` | Recreate the external table and re-enable the query acceleration policy so that column mappings are aligned with the delta table.                                                                                              |
| Delta table column type has changed                                   | `ColumnTypeMismatch: Column 'Col1' type has changed. Previous delta type: 'long', New type: 'string'. Respective external table type: long` | Recreate the external table so that its schema is aligned with the delta table column types, and then re-enable query acceleration.                                         |
| Hot datetime column not found                                         | `HotDateTimeColumn 'Col1' does not exist as a datetime column in the Delta table schema` | Alter the query acceleration policy to include a valid `HotDateTimeColumn` (a column of type `datetime` in the delta table), or leave the property empty if not required.                                                                 |
| Delta table has one of the following unsupported features for query acceleration <br/>• Column mapping mode 'Name' <br/>• AddFile transactions referencing files with absolute path <br/>• deletion vectors with absolute path      | `Unsupported feature: Column mapping of type 'Id'`                       | Recreate the delta table with a supported configuration (for example, using `Name` column mapping type), and then re-enable query acceleration.                                        |

::: moniker-end

### Troubleshoot queries over nonaccelerated data

A query might read non-accelerated data for two main reasons:

- The query-time filter isn't fully within the query acceleration hot period or hot windows.
    Run the following command to view the hot caching properties and make sure the query filters match them:

    ```kusto
    .show external table [ETName] policy query_acceleration
    | project Policy = todynamic(Policy)
    | project Policy.Hot, Policy.HotWindows
    ```
    
    Ensure your query's time filter is fully contained within the configured `Hot` period or the defined `HotWindows`.
    
    If it's a one-time query, don't change the policy. However, if you anticipate running multiple queries over the same time range that lies outside the configured `Hot` period or defined `HotWindows` and require improved performance, alter the policy by:
    
    - Increasing the hot period, and/or
    - Adding additional hot windows that match your query patterns.
- The data within the policy hot period isn't fully cached.
    Use the following command to check the acceleration progress:
    
    ```kusto
    .show external table [ETName] details
    | project state = todynamic(QueryAccelerationState)
    | project state.CompletionPercentage, state.PendingDataFilesCount
    ```
    
    - If `CompletionPercentage < 100`, allow more time for data to be accelerated.
    - If `CompletionPercentage` doesn't increase over time, follow the guidance in [Understanding and mitigating data acceleration issues](#understanding-and-mitigating-data-acceleration-issues).

## Understanding and mitigating data acceleration issues

Unaccelerated data (`CompletionPercentage < 100`) can stem from several issues.

#### Data is currently being accelerated

Data acceleration might take time, especially when:

- You recently enabled a query acceleration policy.
- You recently added a significant amount of data to the delta table.
- You ran an optimization operation such as `OPTIMIZE` on the delta table that results in many deleted and recreated files.

Frequently running `OPTIMIZE` or `MERGE` operations on the source delta table that cause large-scale rewrites of data files can negatively affect acceleration performance because data files are repeatedly rewritten and need to be accelerated.

#### Data files aren't eligible for acceleration

Parquet data files larger than **1 GB** aren't cached.

If your delta table includes many large files, consider adjusting your data generation or optimization strategy to produce smaller parquet files.
If this adjustment requires recreating the Delta table, make sure you recreate the external table and re-enable the query acceleration policy.

#### Insufficient cluster capacity or resources

Query acceleration operations are restricted by the cluster's available query acceleration capacity.

Run the following command to view the remaining capacity:

```kusto
.show capacity
| where Resource == 'QueryAcceleration'
| project Remaining
```

- If `Remaining == 0` consistently and `CompletionPercentage` isn't increasing, consider:

  - Scaling the cluster out or up to provide more resources.
  - Increasing the `QueryAcceleration` capacity by [altering the capacity policy](alter-capacity-policy-command.md).
  > [!NOTE]
  > Altering the capacity policy might have adverse effects on other operations. Alter the policy as a last resort at your own discretion.

