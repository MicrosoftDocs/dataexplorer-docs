---
title:  Request properties
description: This article describes request properties in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/19/2023
---
# Request properties

Request properties control how a query or command executes and returns results. 

## Supported request properties

<!-- The following text can be re-produced by running: Kusto.Cli.exe -focus -execute:"#crp -doc" -->

The following table overviews the supported request properties.

| Property name | Type | Description |
|--|--|--|
| `client_max_redirect_count` | long | Controls the maximum number of HTTP redirects the client follows during processing. |
| `deferpartialqueryfailures` | bool | If set to `true`, suppresses reporting of partial query failures within the result set. |
| `materialized_view_shuffle_query` | dynamic | Provides a hint to use the shuffle strategy for referenced materialized views in the query. This property exclusively impacts materialized views and not any subsequent operations, such as joins, within the query. It takes an array of materialized view names and their corresponding shuffle keys. </br></br>For example, `dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])` indicates shuffling view `V1` by keys `K1` and `K2`, while `dynamic([ { "Name": "V1" } ])` shuffles view `V1` by all keys.|
| `max_memory_consumption_per_query_per_node` | long | Overrides the default maximum amount of memory a query may allocate per node.|
| `maxmemoryconsumptionperiterator` | long | Overrides the default maximum amount of memory a query operator may allocate. |
| `maxoutputcolumns` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `norequesttimeout` | bool | Sets the request timeout to its maximum value. This option can't be modified as part of a [set statement](../../query/set-statement.md). |
| `notruncation` | bool | Disables truncation of query results returned to the caller. |
| `push_selection_through_aggregation` | bool | If set to `true`, allows pushing simple selection through aggregation. |
| `query_bin_auto_at` | literal | Specifies the start value to use when evaluating the [bin_auto()](../../query/bin-auto-function.md) function. |
| `query_bin_auto_size` | literal | Specifies the bin size value to use when evaluating the [bin_auto()](../../query/bin-auto-function.md) function. |
| `query_cursor_after_default` | string | Sets the default parameter value for the [cursor_after()](../../query/cursor-after-function.md) function when called without parameters. |
| `query_cursor_before_or_at_default` | string | Sets the default parameter value for the [cursor_before_or_at()](../../query/cursor-before-or-at-function.md) function when called without parameters. |
| `query_cursor_current` | string | Overrides the cursor value returned by the [cursor_current()](../../query/cursor-current.md) function. |
| `query_cursor_disabled` | bool | Disables the usage of [cursor functions](../../management/database-cursor.md#cursor-functions) within the query context. |
| `query_cursor_scoped_tables` | dynamic | Lists table names to be scoped to `cursor_after_default` .. `cursor_before_or_at()` (upper bound is optional). |
| `query_datascope` | string | Controls the data to which the query applies. Supported values are `default`, `all`, or `hotcache`. |
| `query_datetimescope_column` | string | Specifies the column name for the query's datetime scope (`query_datetimescope_to` / `query_datetimescope_from`). |
| `query_datetimescope_from` | datetime | Sets the minimum date and time limit for the query scope. If defined, it serves as an autoapplied filter on `query_datetimescope_column`. |
| `query_datetimescope_to` | datetime | Sets the maximum date and time limit for the query scope. If defined, it serves as an autoapplied filter on `query_datetimescope_column`. |
| `query_distribution_nodes_span` | int | Controls the behavior of subquery merge. The executing node introduces an extra level in the query hierarchy for each subgroup of nodes, and this option sets the subgroup size.|
| `query_fanout_nodes_percent` | int | Specifies the percentage of nodes for executing fan-out. |
| `query_fanout_threads_percent` | int | Specifies the percentage of threads for executing fan-out. |
| `query_force_row_level_security` | bool | If set to `true`, enforces [row level security](../../management/row-level-security-policy.md) rules, even if the policy is disabled. |
| `query_language` | string | Determines how the query text should be interpreted. Supported values are `csl`, `kql`, or `sql`. |
| `query_log_query_parameters` | bool | Enables logging of the query parameters for later viewing in the [.show queries](../../management/queries.md) journal. |
| `query_max_entities_in_union` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `query_now` | datetime | Overrides the datetime value returned by the [now()](../../query/now-function.md) function. |
| `query_python_debug` | bool or int |  If set to `true`, generates a Python debug query for the enumerated Python node.|
| `query_results_apply_getschema` | bool | If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `query_results_cache_force_refresh` | bool |If set to `true`, forces a cache refresh of query results for a specific query. This option can't be modified as part of a [set statement](../../query/set-statement.md). |
| `query_results_cache_max_age` | timespan | Controls the maximum age of the cached query results that the service is allowed to return. |
| `query_results_cache_per_shard` | bool | If set to `true`, enables per [extent](../../management/extents-overview.md) query caching. |
| `query_results_progressive_row_count` | long | Provides a hint for how many records to send in each update. Takes effect only if `results_progressive_enabled` is set. |
| `query_results_progressive_update_period` | timespan | Provides a hint for how often to send progress frames. Takes effect only if `results_progressive_enabled` is set. |
| `query_take_max_records` | long | Limits query results to a specified number of records. |
| `query_weakconsistency_session_id` | string | Sets the query weak consistency session ID. Takes effect when `queryconsistency` mode is set to `weakconsistency_by_session_id`. |
| `queryconsistency` | string | Controls query consistency. Supported values are `strongconsistency`, `weakconsistency`, `weakconsistency_by_query`, `weakconsistency_by_database`, or `weakconsistency_by_session_id`. When using `weakconsistency_by_session_id`, ensure to also set the `query_weakconsistency_session_id` property. |
| `request_app_name` | string | Specifies the request application name to be used in reporting. For example, [.show queries](../../management/queries.md). |
| `request_block_row_level_security` | bool | If set to `true`, blocks access to tables with [row level security](../../management/row-level-security-policy.md) policy enabled. |
| `request_callout_disabled` | bool | If set to `true`, prevents request callout to a user-provided service. |
| `request_description` | string | Allows inclusion of arbitrary text as the request description. |
| `request_external_data_disabled` | bool | If set to `true`, prevents the request from accessing external data using the [externaldata](../../query/externaldata-operator.md) operator or external tables. |
| `request_external_table_disabled` | bool | If set to `true`, prevents the request from accessing external tables. |
| `request_impersonation_disabled` | bool | If set to `true`, indicates that the service shouldn't impersonate the caller's identity. |
| `request_readonly` | bool | If set to `true`, prevents write access for the request. |
| `request_remote_entities_disabled` | bool | If set to `true`, prevents the request from accessing remote databases and clusters. |
| `request_sandboxed_execution_disabled` | bool | If set to `true`, prevents the request from invoking code in the sandbox. |
| `request_user` | string | Specifies the request user to be used in reporting. For example, [.show queries](../../management/queries.md). |
| `results_progressive_enabled` | bool | If set to `true`, enables the progressive query stream. |
| `servertimeout` | timespan | Overrides the default request timeout. This option can't be modified as part of a [set statement](../../query/set-statement.md). |
| `truncation_max_records` | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `truncationmaxsize` | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `validatepermissions` | bool | Validates the user's permissions to perform the query without actually running the query. Possible results for this property are: `OK` (permissions are present and valid), `Incomplete` (validation couldn't be completed due to dynamic schema evaluation), or `KustoRequestDeniedException` (permissions weren't set). |

## How to set request properties

You can set request properties in the following ways:

* The POST body of an [HTTP request](./request.md)
* A Kusto Query Language [set statement](../../query/set-statement.md)
* The set option method of the [`ClientRequestProperties` class](../netfx/client-request-properties.md)

> [!NOTE]
> Some request properties can't be set with a set statement, such as `servertimeout` and `norequesttimeout`. For more information, see [Set timeout limits](../../../set-timeout-limits.md).

## Related content

* [Customize query behavior with client request properties](../get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties)
