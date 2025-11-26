# Troubleshoot query acceleration over external delta tables

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The [query acceleration policy](query-acceleration-policy.md) enables accelerating queries over external delta tables by caching delta table metadata and data files. The policy defines which data ranges (number of days back and hot windows) are accelerated so that queries over those ranges can run significantly faster.

The query acceleration feature consists of the following components:

- A background job that maintains a local snapshot (**catalog**) of the delta table metadata.
- A background job that caches delta table data files.
- Query-time enhancements that utilize the catalog and the cached data.

To understand why things aren't working as expected, it's important to identify which of these components isn't functioning properly.

This article helps you troubleshoot scenarios where:

- Queries over accelerated external delta tables return **stale data**, or
- Queries over accelerated external delta tables are **slower than expected**

## Prerequisites

1. **Ensure query acceleration is enabled on the external table** by running the following command:

    ```kusto
    .show external table <ETName> policy query_acceleration
    | project todynamic(Policy).IsEnabled
    ```

    If this command returns `false`, enable the query acceleration policy using the [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md).

2. **Ensure the delta table complies with the Delta protocol.**

    The query acceleration feature assumes a delta table that complies with the Delta protocol. Manual operations executed directly on the delta table (for example, editing transaction logs or parquet files) aren't supported and may result in unexpected behavior.

    If such operations have been executed on the delta table, first recreate the external table and re-enable the query acceleration policy.

## Troubleshooting flow

Use the following logical flow to identify and mitigate query acceleration issues.

- **Query acceleration issues**
  - **[Query is returning old data](#query-is-returning-old-data)**  
    Result freshness issue: query results don't reflect the latest data from the underlying delta table.
  - **Query is not running fast enough**  
    Performance issue: query is slower than expected, and acceleration doesn't appear to improve performance.
    - **[Check if catalog is stale](#check-if-catalog-is-stale)**  
      Is the query acceleration catalog older than the configured `MaxAge` and therefore not used?
      - **[Troubleshoot stale catalogs](#troubleshoot-stale-catalogs)**  
        Diagnose why the catalog isn't refreshing (for example, unhealthy state, frequent changes, or recent enablement).
      - **[Query acceleration unhealthy state – understanding and mitigating](#query-acceleration-unhealthy-state--understanding-and-mitigating)**  
        Is query acceleration unhealthy due to configuration or schema issues?
    - **[Check if query is over non-accelerated data](#check-if-query-is-over-non-accelerated-data)**  
      Is the query reading data directly from the remote delta table?
      - **[Troubleshoot queries over non-accelerated-data](#troubleshoot-queries-over-non-accelerated-data)**  
        Align query filters with the hot period or hot windows and verify that data within those ranges is fully cached.
      - **[Understanding and mitigating data acceleration issues](#understanding-and-mitigating-data-acceleration-issues)**  
        Investigate incomplete acceleration due to ongoing caching, large parquet files, or insufficient cluster capacity.
    - **[Ensure query complies with KQL best practices](../query/best-practices.md)**<br/>
      Optimize the query as is instructed in the KQL best practices document

## Query is returning old data

Query acceleration refreshes the accelerated data so that results are no older than the configured `MaxAge` value in the policy. 
By design, queries over accelerated external tables may return data that lags behind the latest delta table version by up to `MaxAge`. Set `MaxAge` to the maximum data staleness that is acceptable at query time.

You can control the effective `MaxAge` in two ways:

1. Configure the `MaxAge` property in the query acceleration policy using the [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md).
2. Override `MaxAge` per query by using the [`external_table()` operator's](../query/external-table-function.md) `MaxAgeOverride` parameter.

## Check if catalog is stale

Query acceleration uses a local catalog for the external table containing a snapshot of the delta table metadata. If this catalog hasn't been updated within the configured `MaxAge` (see the query acceleration policy's `MaxAge` property), it's considered **stale** and won't be used at query time. In that case, queries fall back to reading the remote delta table directly, which can be significantly slower.

Fetch the current state of the catalog using the following command:

```kusto
.show external table [ETName] details
| extend MinimumUpdateTime = now() - totimespan(todynamic(QueryAccelerationPolicy).MaxAge)
| project IsCatalogStale = MinimumUpdateTime < todatetime(todynamic(QueryAccelerationState).LastUpdatedDateTime)
```

`IsCatalogStale == true` indicates the catalog is stale and query acceleration won't be used.

### Troubleshoot stale catalogs

To understand why a catalog is stale, first check whether the query acceleration state is healthy and resolve unhealthy reasons as needed.

Run:

```kusto
.show external table [ETName] details
| project state = todynamic(QueryAccelerationState)
| project IsHealthy = state.IsHealthy, UnhealthyReason = state.NotHealthyReason
```

- If the state is **unhealthy**, refer to [Query acceleration unhealthy state – understanding and mitigating](#query-acceleration-unhealthy-state--understanding-and-mitigating).
- If the state is **healthy** but the catalog is still stale, consider the following cases.

#### Query acceleration policy was enabled recently

When the query acceleration policy is enabled for the first time, building the initial catalog needs to complete before it can be used in queries. During this period, the `LastUpdatedDateTime` value will be empty:

```kusto
.show external table [ETName] details
| project todynamic(QueryAccelerationState).LastUpdatedDateTime
```

If `LastUpdatedDateTime` is empty, allow some time for the first update to complete. This usually takes several minutes. Subsequent updates are expected to be significantly faster.

#### The delta table is frequently changing

A `MaxAge` value (default is five minutes) that is too low for a frequently changing delta table can result in a constantly stale catalog. For example, if the delta table undergoes frequent `OPTIMIZE` or `MERGE` operations that rewrite a large portion of the underlying parquet files (such as aggressive compaction or large upserts), the catalog might lag behind.

If the queries can tolerate slightly older data, consider increasing the `MaxAge` value using the [`.alter query acceleration policy` command](alter-query-acceleration-policy-command.md).

## Query acceleration unhealthy state – understanding and mitigating

When an external table's query acceleration is unhealthy, you can retrieve the unhealthy reason using the following command:

```kusto
.show external table [ETName] details
| project todynamic(QueryAccelerationState).NotHealthyReason
```

Use the following table to understand and mitigate common unhealthy states.

::: moniker range="azure-data-explorer"

| Unhealthy reason                                                      | Example `NotHealthyReason`                                              | Action                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
[!INCLUDE [query-acceleration-unhealthy-reasons-table](query-acceleration-unhealthy-reasons.md)]
| Managed identity error                                                | *Managed identity must be specified for external tables with impersonation authentication.* | Ensure that the query acceleration policy contains a valid managed identity that has:<br/>• Appropriate permissions on the Delta table<br/>• The `AutomatedFlows` usage type in the cluster or database managed identity policy. |

::: moniker-end

::: moniker range="microsoft-fabric"

| Unhealthy reason                                                      | Example `NotHealthyReason`                                              | Action                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
[!INCLUDE [query-acceleration-unhealthy-reasons-table](query-acceleration-unhealthy-reasons.md)]

::: moniker-end


## Check if query is over non-accelerated data

To fully benefit from query acceleration, queries must be executed over **accelerated data**. Non-accelerated data is read directly from the remote delta table, which may result in significant latency.

Use the following command and filter on a time frame that includes the relevant query:

```kusto
.show queries
| where StartedOn > ago(1h)
| extend ExternalDataStats = OverallQueryStats.input_dataset_statistics.external_data
```

If `ExternalDataStats.iterated_artifacts` or `ExternalDataStats.downloaded_items` are greater than `0`, it means data was read from the remote delta table (non-accelerated path).

### Troubleshoot queries over non-accelerated-data

There are two main reasons why a query might read non-accelerated data:

1. **The query-time filter isn't fully within the query acceleration hot period or hot windows.**
2. **The data within the policy hot period isn't fully cached.**

#### Query filter isn't fully within the hot period or hot windows

Run the following command to view the hot caching properties and make sure the query filters match them:

```kusto
.show external table [ETName] policy query_acceleration
| project Policy = todynamic(Policy)
| project Policy.Hot, Policy.HotWindows
```

Ensure your query's time filter is fully contained within the configured `Hot` period or the defined `HotWindows`.

If it's a one-time query, policy change is not recommended. However, if you anticipate running multiple queries over the same time range that lies outside the configured `Hot` period or defined `HotWindows` and require improved performance, alter the policy by:

- Increasing the hot period, and/or
- Adding additional hot windows that match your query patterns.

#### Data within the hot period isn't fully cached

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

### Data is currently being accelerated

Data acceleration might take time, especially when:

- A query acceleration policy has recently been enabled, or
- The delta table has undergone an optimization operation such as `OPTIMIZE` that results in many deleted and recreated files.

Frequently running `OPTIMIZE` or `MERGE` operations on the source delta table that cause large-scale rewrites of data files can negatively affect acceleration performance because data files are repeatedly rewritten, and need to be accelerated.

### Data files aren't eligible for acceleration

Parquet data files larger than **1 GB** won't be cached.

If your delta table includes many large files, consider adjusting your data generation or optimization strategy to produce smaller parquet files.
If this requires recreating the Delta table, make sure you recreate the external table and reenable query acceleration policy.

### Insufficient cluster capacity or resources

Query acceleration operations are restricted by the cluster's available query acceleration capacity.

Run the following command to view the remaining capacity:

```kusto
.show capacity
| where Resource == 'QueryAcceleration'
| project Remaining
```

- If `Remaining == 0` consistently and `CompletionPercentage` isn't increasing, consider:

  - Increasing the `QueryAcceleration` capacity by [altering the capacity policy](alter-capacity-policy-command.md).
  - Scaling the cluster out or up to provide more resources.
