---
title:  Request properties and ClientRequestProperties
description: This article describes Request properties and ClientRequestProperties in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/11/2023
---
# Client request properties

In the Kusto Data library, the `ClientRequestProperties` class helps manage interaction between your client application and the service. This class contains the following information:

* [Client request properties](#client-request-properties): A mapping of specific options for customizing request behavior.
* [Query parameters](#query-parameters): A mapping of user-declared parameters that allow for secure query customization.
* [Named properties](#named-properties): Client request ID, application details, and user data, primarily used for debugging and tracing.

## Client request properties

<!-- The following text can be re-produced by running: Kusto.Cli.exe -focus -execute:"#crp -doc" -->

Client request property names and configuration methods differ across client libraries. To view the properties for a given client library, select the relevant tab. For examples of how to configure these properties in each library, see [Customize query behavior with client request properties](../get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties).

### [C\#](#tab/csharp-crp)

The following table overviews the client request properties for use with the C# client library.

| Property Name | Type | Description |
|--|--|--|
| `OptionClientMaxRedirectCount` | long | Indicates the maximum number of HTTP redirects that the client processes. |
| `OptionDeferPartialQueryFailures` | bool | If `true`, disables reporting partial query failures as part of the result set. |
| `OptionMaterializedViewShuffleQuery` | dynamic | A hint to use shuffle strategy for materialized views that are referenced in the query. The property is an array of materialized views names and the shuffle keys to use.</br></br>For example, `dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])` is a shuffle view `V1` by `K1`, `K2`; and `dynamic([ { "Name": "V1" } ])` is a shuffle view `V1` by all keys. |
| `OptionMaxMemoryConsumptionPerQueryPerNode` | UInt64 | Overrides the default maximum amount of memory a query may allocate per node. |
| `OptionMaxMemoryConsumptionPerIterator` | UInt64 | Overrides the default maximum amount of memory a query operator may allocate. |
| `OptionMaxOutputColumns` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `OptionNoRequestTimeout` | bool | Sets the request timeout to its maximum value. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `OptionNoTruncation` | bool | Suppresses truncation of the query results returned to the caller. |
| `OptionPushSelectionThroughAggregation` | bool | If `true`, pushes simple selection through aggregation. |
| `OptionQueryBinAutoAt` | literal | The start value to use when evaluating the [bin_auto()](../../query/bin-autofunction.md) function. |
| `OptionQueryBinAutoSize` | literal | The bin size value to use when evaluating the [bin_auto()](../../query/bin-autofunction.md) function. |
| `OptionQueryCursorAfterDefault` | string | The default parameter value of the [cursor_after()](../../query/cursorafterfunction.md) function when called without parameters. |
| `OptionQueryCursorBeforeOrAtDefault` | string | The default parameter value of the [cursor_before_or_at()](../../query/cursorbeforeoratfunction.md) function when called without parameters. |
| `OptionQueryCursorCurrent` | string | Overrides the cursor value returned by the [cursor_current()](../../query/cursorcurrent.md) function. |
| `OptionQueryCursorDisabled` | bool | Disables usage of [cursor functions](../../management/databasecursor.md#cursor-functions) in the context of the query. |
| `OptionQueryCursorScopedTables` | dynamic | List of table names that should be scoped to cursor_after_default .. cursor_before_or_at() (upper bound is optional). |
| `OptionQueryDataScope` | string | Controls the data to which the query applies. Supported values are `default`, `all`, or `hotcache`. |
| `OptionQueryDateTimeScopeColumn` | string | Controls the column name for the query's datetime scope (`OptionQueryDateTimeScopeTo` / `OptionQueryDateTimeScopeFrom`). |
| `OptionQueryDateTimeScopeFrom` | datetime | Sets the minimum date and time limit for the query scope. If defined, it's used as an auto-applied filter on `query_datetimescope_column`. |
| `OptionQueryDateTimeScopeTo` | datetime | Sets the maximum date and time limit for the query scope. If defined, it's used as an auto-applied filter on `query_datetimescope_column`. |
| `OptionQueryDistributionNodesSpanSize` | int | Controls the way the subquery merge behaves. The executing node will introduce an extra level the query hierarchy for each subgroup of nodes, and this option sets the size of the subgroup. |
| `OptionQueryFanoutNodesPercent` | int |The percentage of nodes for executing fan out. |
| `OptionQueryFanoutThreadsPercent` | int | The percentage of threads for executing fan out. |
| `OptionQueryForceRowLevelSecurity` | bool | If `true`, forces [row level security](../../management/rowlevelsecuritypolicy.md) rules, even if the policy is disabled. |
| `OptionQueryLanguage` | string | Controls how the query text is to be interpreted. Supported values are `csl`, `kql`, or `sql`. |
| `OptionQueryLogQueryParameters` | bool | Enables logging of the query parameters so that they can be viewed later in the `.show` `queries` journal. |
| `OptionQueryMaxEntitiesInUnion` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `OptionQueryNow` | datetime | Overrides the datetime value returned by the [now()](../../query/nowfunction.md) function. |
| `OptionQueryPythonDebug` | bool | If `true`, generates python debug query for the enumerated python node (default first). |
| `OptionQueryResultsApplyGetSchema` | bool | If `true`, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `OptionQueryResultsCacheForceRefresh` | bool | If `true`, forces query results cache refresh for a specific query. Must be used in combination with `OptionQueryResultsCacheMaxAge`. This option can't be set as part of a [set statement](../../query/setstatement.md).|
| `OptionQueryResultsCacheMaxAge` | timespan | Controls the maximum age of the cached query results the service is allowed to return. |
| `OptionQueryResultsCachePerShard` | bool | If `true`, enables per [extent](../../management/extents-overview.md) query cache. |
| `OptionQueryResultsProgressiveRowCount` | long | Hint as to how many records to send in each update. Takes effect only if `OptionResultsProgressiveEnabled` is set. |
| `OptionQueryResultsProgressiveUpdatePeriod` | timespan | Hint as to how often to send progress frames. Takes effect only if `OptionResultsProgressiveEnabled` is set. |
| `OptionQueryTakeMaxRecords` | long | Limits query results to this number of records. |
| `OptionQueryWeakConsistencySessionId` | string | Sets the query weak consistency session ID. Takes effect when `queryconsistency` mode is set to `weakconsistency_by_session_id`. |
| `OptionQueryConsistency` | string | Controls query consistency. Supported values are `strongconsistency`, `weakconsistency`, `weakconsistency_by_query`, `weakconsistency_by_database`, or `weakconsistency_by_session_id`. When using `weakconsistency_by_session_id`, make sure to also set the `OptionQueryWeakConsistencySessionId` property. |
| `OptionRequestAppName` | string | Request application name to be used in the reporting. For example, `.show` `queries`. |
| `OptionRequestBlockRowLevelSecurity` | bool | If `true`, blocks access to tables for which [row level security](../../management/rowlevelsecuritypolicy.md) policy is enabled. |
| `OptionRequestCalloutDisabled` | bool | If `true`, prevents request call out to a user-provided service. |
| `OptionRequestDescription` | string | Arbitrary text that the author of the request wants to include as the request description. |
| `OptionRequestExternalDataDisabled` | bool | If `true`, prevents the request from accessing external data with the [externaldata](../../query/externaldata-operator.md) operator or external tables. |
| `OptionRequestExternalTableDisabled` | bool | If `true`, prevents the request from accessing external tables. |
| `OptionDoNotImpersonate` | bool | If `true`, indicates that the service shouldn't impersonate the caller's identity. |
| `OptionRequestReadOnly` | bool | If `true`, prevents write access for the request. |
| `OptionRequestRemoteEntitiesDisabled` | bool | If `true`, prevents the request from accessing remote databases and clusters. |
| `OptionRequestSandboxedExecutionDisabled` | bool | If `true`, prevents the request from invoking code in the sandbox. |
| `OptionRequestUser` | string | The request user to be used in the reporting. For example, `.show` `queries`. |
| `OptionResultsProgressiveEnabled` | bool | If `true`, enables the progressive query stream. |
| `OptionServerTimeout` | timespan | Overrides the default request timeout. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `OptionTruncationMaxRecords` | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `OptionTruncationMaxSize` | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `OptionValidatePermissions` | bool | Validates user's permissions to perform the query and doesn't run the query itself. The possible results for this property are: `OK` (permissions are present and valid), `Incomplete` (validation couldn't be completed as the query uses dynamic schema evaluation), or `KustoRequestDeniedException` (permissions weren't set). |

### [REST API](#tab/rest-crp)

When issuing an HTTP request, specify client request properties in the `properties` field of the POST request body. For more information, see [Query/management HTTP request](../rest/request.md).

| Property Name | Type | Description |
|---|---|---|
| `client_max_redirect_count` | long | Indicates the maximum number of HTTP redirects that the client processes. |
| `deferpartialqueryfailures` | bool | If `true`, disables reporting partial query failures as part of the result set. |
| `materialized_view_shuffle_query` | dynamic | A hint to use shuffle strategy for materialized views that are referenced in the query. The property is an array of materialized views names and the shuffle keys to use. For example, `dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])` is a shuffle view `V1` by `K1`, `K2`; and `dynamic([ { "Name": "V1" } ])` is a shuffle view `V1` by all keys. |
| `max_memory_consumption_per_query_per_node` | UInt64 | Overrides the default maximum amount of memory a whole query may allocate per node. |
| `maxmemoryconsumptionperiterator` | UInt64 | Overrides the default maximum amount of memory a query operator may allocate. |
| `maxoutputcolumns` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `norequesttimeout` | bool | Sets the request timeout to its maximum value. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `notruncation` | bool | Suppresses truncation of the query results returned to the caller. |
| `push_selection_through_aggregation` | bool | If `true`, pushes simple selection through aggregation. |
| `query_bin_auto_at` | literal | The start value to use when evaluating the [bin_auto()](../../query/bin-autofunction.md) function. |
| `query_bin_auto_size` | literal | The bin size value to use when evaluating the [bin_auto()](../../query/bin-autofunction.md) function. |
| `query_cursor_after_default` | string | The default parameter value of the [cursor_after()](../../query/cursorafterfunction.md) function when called without parameters. |
| `query_cursor_before_or_at_default` | string | The default parameter value of the [cursor_before_or_at()](../../query/cursorbeforeoratfunction.md) function when called without parameters. |
| `query_cursor_current` | string | Overrides the cursor value returned by the [cursor_current()](../../query/cursorcurrent.md) function. |
| `query_cursor_disabled` | bool | Disables usage of cursor functions in the context of the query. |
| `query_cursor_scoped_tables` | dynamic | List of table names that should be scoped to cursor_after_default .. cursor_before_or_at() (upper bound is optional). |
| `query_datascope` | string | Controls whether the data to which the query applies. Supported values are `default`, `all`, or `hotcache`. |
| `query_datetimescope_column` | string | Controls the column name for the query's datetime scope (`query_datetimescope_to` / `query_datetimescope_from`). |
| `query_datetimescope_from` | datetime | Controls the earliest query datetime scope. If defined, it's used as an auto-applied filter on `query_datetimescope_column`. |
| `query_datetimescope_to` | datetime | Controls the latest query datetime scope. If defined, it's used as an auto-applied filter on `query_datetimescope_column`. |
| `query_distribution_nodes_span` | int | If set, controls the way the subquery merge behaves: the executing node will introduce an additional level the query hierarchy for each subgroup of nodes; the size of the subgroup is set by this option. |
| `query_fanout_nodes_percent` | int | The percentage of nodes to fan out execution to. |
| `query_fanout_threads_percent` | int | The percentage of threads to fan out execution to. |
| `query_force_row_level_security` | bool | If specified, forces [row level security](../../management/rowlevelsecuritypolicy.md) rules, even if the policy is disabled. |
| `query_language` | string | Controls how the query text is to be interpreted. Supported values are `csl`, `kql`, or `sql`. |
| `query_log_query_parameters` | bool | Enables logging of the query parameters, so that they can be viewed later in the `.show queries` journal. |
| `query_max_entities_in_union` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `query_now` | datetime | Overrides the datetime value returned by the [now()](../../query/nowfunction.md) function. |
| `query_python_debug` | bool or int | If set, generate python debug query for the enumerated python node (default first). |
| `query_results_apply_getschema` | bool | If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `query_results_cache_force_refresh` | bool | If set, forces query results cache refresh for a specific query. Must be used in combination with 'query_results_cache_max_age', and sent via ClientRequestProperties object (not as 'set' statement). |
| `query_results_cache_max_age` | timespan | If positive, controls the maximum age of the cached query results the service is allowed to return. |
| `query_results_cache_per_shard` | bool | If set, enables per-shard query cache. |
| `query_results_progressive_row_count` | long | Hint for Kusto as to how many records to send in each update (takes effect only if `results_progressive_enabled` is set) |
| `query_results_progressive_update_period` | timespan | Hint for Kusto as to how often to send progress frames (takes effect only if `results_progressive_enabled` is set) |
| `query_take_max_records` | long | Enables limiting query results to this number of records. |
| `query_weakconsistency_session_id` | string | Sets the query weak consistency session ID. Takes effect when 'queryconsistency' mode is set to 'weakconsistency_by_session_id'. |
| `queryconsistency` | string | Controls query consistency. Supported values are 'strongconsistency', 'weakconsistency', 'weakconsistency_by_query', 'weakconsistency_by_database', or 'weakconsistency_by_session_id'. When using 'weakconsistency_by_session_id', make sure to also set the `query_weakconsistency_session_id` property. |
| `request_app_name` | string | Request application name to be used in the reporting (for example, show queries). |
| `request_block_row_level_security` | bool | If specified, blocks access to tables for which row_level_security policy is enabled. |
| `request_callout_disabled` | bool | If specified, indicates that the request can't call-out to a user-provided service. |
| `request_description` | string | Arbitrary text that the author of the request wants to include as the request description. |
| `request_external_data_disabled` | bool | If specified, indicates that the request can't access external data (using externaldata operator) or external tables. |
| `request_external_table_disabled` | bool | If specified, indicates that the request can't access external tables. |
| `request_sandboxed_execution_disabled` | bool | If specified, indicates that the request can't invoke code in the sandbox. |
| `request_user` | string | Request user to be used in the reporting (for example, show queries). |
| `results_progressive_enabled` | bool | If set, enables the progressive query stream. |
| `server_timeout` | timespan | Overrides the default request timeout (this option can't be set as part of a set statement). |
| `truncation_max_records` | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `truncation_max_size` | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `validatepermissions` | bool | Validates user's permissions to perform the query and doesn't run the query itself. Possible results for this property are: `OK` (permissions are present and valid), `Incomplete` (validation couldn't be completed as the query uses dynamic schema evaluation), or `KustoRequestDeniedException` (permissions weren't set). |

---

## Query parameters

The [query parameters declaration statement](../../query/queryparametersstatement.md) can be used to declare parameters for a [Kusto Query Language (KQL)](../../query/index.md) query. When using Kusto Data, the `ClientRequestProperties` class contains methods to set, clear, and check the presence of such query parameters.

The set parameter method provides a number of overloads for common data types, such as `string` and `long`. For all other types, express the value as a KQL literal in `string` format, and make sure that the `declare` `query_parameters` statement declares the correct [scalar data type](../../query/scalar-data-types/index.md).

For an example, see [Use query parameters to protect user input](../get-started/app-basic-query.md#use-query-parameters-to-protect-user-input).

## Named properties

The `ClientRequestProperties` class includes named properties that are valuable for debugging and tracing purposes. Each of these named properties corresponds to an HTTP request header. The following table provides an overview of these named properties.

### [C\#](#tab/csharp-named-props)

| Property name | HTTP header | Description |
|--|--|--|
| `ClientRequestId` | `x-ms-client-request-id` | An ID used to identify the request. This specification is helpful for debugging and may be required for specific scenarios like query cancellation. We recommend using the format *ClientApplicationName*`.`*ActivityType*`;`*UniqueId*. If the client doesn't specify a value for this property, a random value is assigned.|
| `Application` | `x-ms-app` | The name of the client application that makes the request. This value is used for tracing. To specify the property in a [Kusto connection string](../connection-strings/kusto.md), use the `Application Name for Tracing` property. If the client doesn't specify a value for this property, the property is automatically set to the name of the process hosting the Kusto Data library.|
| `User` | `x-ms-user` | The identity of the user that makes the request. This value is used for tracing. To specify the property in a [Kusto connection string](../connection-strings/kusto.md), use the `User Name for Tracing` property.|

> [!CAUTION]
> The `ClientRequestId` property is recorded for diagnostics. Avoid sending sensitive data like personally identifiable or confidential information.

---

## Related content

* [Create an app to run basic queries](../get-started/app-basic-query.md)
* [Query/management HTTP request](../rest/request.md)
