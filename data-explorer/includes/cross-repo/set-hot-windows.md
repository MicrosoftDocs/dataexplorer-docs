---
ms.topic: include
ms.date: 07/02/2023
---

## Set hot windows

Hot windows are part of the [cache policy commands syntax](/kusto/management/show-table-cache-policy-command?view=azure-data-explorer&preserve-view=true) and are set with the [`.alter policy caching` command](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true).

> [!NOTE]
> It can take up to an hour to fully update the cluster disk cache based on the updated cache policy definition.

1. Take note of the initial caching policy by using the `.show policy caching` command.

    ```kusto
    .show table MyDatabase.MyTable policy caching 
    ```

1. Alter the cache policy using the following syntax.  Several hot windows may be defined for a single database or table.

    ```kusto
    .alter <entity_type> <database_or_table_or_materialized-view_name> policy caching 
          hot = <timespan> 
          [, hot_window = datetime(*from*) .. datetime(*to*)] 
          [, hot_window = datetime(*from*) .. datetime(*to*)] 
          ...
    ```
    
    Where:
    * `from`:  Start time of the hot window (datetime)
    * `to`:  End time of the hot window (datetime)
    
    For example, queries run under the following settings will examine the last 14 days of data, on data that is kept for three years.
    
    ```kusto
    .alter table MyTable policy caching 
            hot = 14d,
            hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
            hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
    ```

## Run query

Run the query or queries you want over the time period specified in the hot windows.

## Revert settings

1. Use the original cache settings retrieved above in [Set hot windows](#set-hot-windows).
1. Revert the cache policy to the original settings with the [`.alter policy caching` command](/kusto/management/show-table-cache-policy-command?view=azure-data-explorer&preserve-view=true).

Since you've configured optimized autoscale for that cluster, the cluster will shrink to its original size.
