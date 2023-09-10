---
title:  Request properties and ClientRequestProperties
description: This article describes Request properties and ClientRequestProperties in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/10/2023
---
# Client request properties

In the Kusto Data library, the `ClientRequestProperties` class helps manage interaction between the client application and the service. This class contains the following information:

* **[Mapping of client request property options](#client-request-properties)**: Specific options for customizing request behavior.
* **[Mapping of query parameters](#query-parameters)**: User-declared parameters that allow for secure query customization.
* **[Named properties](#named-properties)**: Client request ID, application details, and user data, primarily used for debugging and tracing.

## Client request properties

<!-- The following text can be re-produced by running: Kusto.Cli.exe -focus -execute:"#crp -doc" -->

Client request property names differ among client libraries. Select the tab for the relevant client library.

For an example of how to set these properties, see [Customize query behavior with client request properties](../get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties).

### [C\#](#tab/csharp)

| Property Name | Type | Description |
|--|--|--|
| `OptionClientMaxRedirectCount` | long | If set and positive, indicates the maximum number of HTTP redirects that the client will process. |
| `OptionDeferPartialQueryFailures` | bool | If true, disables reporting partial query failures as part of the result set. |
| `OptionMaterializedViewShuffleQuery` | dynamic | A hint to use shuffle strategy for materialized views that are referenced in the query. The property is an array of materialized views names and the shuffle keys to use. Examples: 'dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])' (shuffle view V1 by K1, K2) or 'dynamic([ { "Name": "V1" } ])' (shuffle view V1 by all keys) |
| `OptionMaxMemoryConsumptionPerQueryPerNode` | UInt64 | Overrides the default maximum amount of memory a whole query may allocate per node. |
| `OptionMaxMemoryConsumptionPerIterator` | UInt64 | Overrides the default maximum amount of memory a query operator may allocate. |
| `OptionMaxOutputColumns` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `OptionNoRequestTimeout` | bool | Sets the request timeout to its maximum value. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `OptionNoTruncation` | bool | Enables suppressing truncation of the query results returned to the caller. |
| `OptionPushSelectionThroughAggregation` | bool | If true, push simple selection through aggregation. |
| `OptionQueryBinAutoAt` | literal | When evaluating the bin_auto() function, the start value to use. |
| `OptionQueryBinAutoSize` | literal | When evaluating the bin_auto() function, the bin size value to use. |
| `OptionQueryCursorAfterDefault` | string | The default parameter value of the cursor_after() function when called without parameters. |
| `OptionQueryCursorBeforeOrAtDefault` | string | The default parameter value of the cursor_before_or_at() function when called without parameters. |
| `OptionQueryCursorCurrent` | string | Overrides the cursor value returned by the cursor_current() function. |
| `OptionQueryCursorDisabled` | bool | Disables usage of cursor functions in the context of the query. |
| `OptionQueryCursorScopedTables` | dynamic | List of table names that should be scoped to cursor_after_default .. cursor_before_or_at() (upper bound is optional). |
| `OptionQueryDataScope` | string | Controls the query's datascope -- whether the query applies to all data or just part of it. Supported values are 'default', 'all', or 'hotcache'. |
| `OptionQueryDateTimeScopeColumn` | string | Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). |
| `OptionQueryDateTimeScopeFrom` | datetime | Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `OptionQueryDateTimeScopeTo` | datetime | Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `OptionQueryDistributionNodesSpanSize` | int | If set, controls the way the subquery merge behaves: the executing node will introduce an additional level the query hierarchy for each subgroup of nodes; the size of the subgroup is set by this option. |
| `OptionQueryFanoutNodesPercent` | int | The percentage of nodes to fan out execution to. |
| `OptionQueryFanoutThreadsPercent` | int | The percentage of threads to fan out execution to. |
| `OptionQueryForceRowLevelSecurity` | bool | If specified, forces Row Level Security rules, even if row_level_security policy is disabled. |
| `OptionQueryLanguage` | string | Controls how the query text is to be interpreted. Supported values are 'csl','kql' or 'sql'. |
| `OptionQueryLogQueryParameters` | bool | Enables logging of the query parameters, so that they can be viewed later in the `.show queries` journal. |
| `OptionQueryMaxEntitiesInUnion` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `OptionQueryNow` | datetime | Overrides the datetime value returned by the now(0s) function. |
| `OptionQueryPythonDebug` | bool or int | If set, generate python debug query for the enumerated python node (default first). |
| `OptionQueryResultsApplyGetSchema` | bool | If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `OptionQueryResultsCacheForceRefresh` | bool | If set, forces query results cache refresh for a specific query. Must be used in combination with 'query_results_cache_max_age', and sent via ClientRequestProperties object (not as 'set' statement). |
| `OptionQueryResultsCacheMaxAge` | timespan | If positive, controls the maximum age of the cached query results the service is allowed to return. |
| `OptionQueryResultsCachePerShard` | bool | If set, enables per-shard query cache. |
| `OptionQueryResultsProgressiveRowCount` | long | Hint for Kusto as to how many records to send in each update (takes effect only if *OptionResultsProgressiveEnabled* is set) |
| `OptionQueryResultsProgressiveUpdatePeriod` | timespan | Hint for Kusto as to how often to send progress frames (takes effect only if *OptionResultsProgressiveEnabled* is set) |
| `OptionQueryTakeMaxRecords` | long | Enables limiting query results to this number of records. |
| `OptionQueryWeakConsistencySessionId` | string | Sets the query weak consistency session ID. Takes effect when 'queryconsistency' mode is set to 'weakconsistency_by_session_id'. |
| `OptionQueryConsistency` | string | Controls query consistency. Supported values are 'strongconsistency', 'weakconsistency', 'weakconsistency_by_query', 'weakconsistency_by_database', or 'weakconsistency_by_session_id'. When using 'weakconsistency_by_session_id', make sure to also set the `OptionQueryWeakConsistencySessionId` property. |
| `OptionRequestAppName` | string | Request application name to be used in the reporting (for example, show queries). |
| `OptionRequestBlockRowLevelSecurity` | bool | If specified, blocks access to tables for which row_level_security policy is enabled. |
| `OptionRequestCalloutDisabled` | bool | If specified, indicates that the request can't call-out to a user-provided service. |
| `OptionRequestDescription` | string | Arbitrary text that the author of the request wants to include as the request description. |
| `OptionRequestExternalDataDisabled` | bool | If specified, indicates that the request can't access external data (using externaldata operator) or external tables. |
| `OptionRequestExternalTableDisabled` | bool | If specified, indicates that the request can't access external tables. |
| `OptionDoNotImpersonate` | bool | If specified, indicates that the service shouldn't impersonate the caller's identity. |
| `OptionRequestReadOnly` | bool | If specified, indicates that the request can't write anything. |
| `OptionRequestRemoteEntitiesDisabled` | bool | If specified, indicates that the request can't access remote databases and clusters. |
| `OptionRequestSandboxedExecutionDisabled` | bool | If specified, indicates that the request can't invoke code in the sandbox. |
| `OptionRequestUser` | string | Request user to be used in the reporting (for example, show queries). |
| `OptionResultsProgressiveEnabled` | bool | If set, enables the progressive query stream. |
| `OptionServerTimeout` | timespan | Overrides the default request timeout. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `OptionTruncationMaxRecords` | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `OptionTruncationMaxSize` | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `OptionValidatePermissions` | bool | Validates user's permissions to perform the query and doesn't run the query itself. The possible results for this property are: `OK` (permissions are present and valid), `Incomplete` (validation couldn't be completed as the query uses dynamic schema evaluation), or `KustoRequestDeniedException` (if permissions weren't set). |

### [REST API](#tab/rest)

When issuing an HTTP request, use the `properties` slot in the JSON document that is the POST request body to provide request properties.

| Property name | Type | Description |
|--|--|--|
| `client_max_redirect_count` | long | If set and positive, indicates the maximum number of HTTP redirects that the client will process. |
| `deferpartialqueryfailures` | bool | If true, disables reporting partial query failures as part of the result set. |
| `materialized_view_shuffle` | dynamic | A hint to use shuffle strategy for materialized views that are referenced in the query. The property is an array of materialized views names and the shuffle keys to use. Examples: 'dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])' (shuffle view V1 by K1, K2) or 'dynamic([ { "Name": "V1" } ])' (shuffle view V1 by all keys) |
| `max_memory_consumption_per_query_per_node` | UInt64 | Overrides the default maximum amount of memory a whole query may allocate per node. |
| `maxmemoryconsumptionperiterator` | UInt64 | Overrides the default maximum amount of memory a query operator may allocate. |
| `maxoutputcolumns` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `norequesttimeout` | bool | Sets the request timeout to its maximum value. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `notruncation` | bool | Enables suppressing truncation of the query results returned to the caller. |
| `push_selection_through_aggregation` | bool | If true, push simple selection through aggregation. |
| `query_bin_auto_at` | literal | When evaluating the bin_auto() function, the start value to use. |
| `query_bin_auto_size` | literal | When evaluating the bin_auto() function, the bin size value to use. |
| `query_cursor_after_default` | string | The default parameter value of the cursor_after() function when called without parameters. |
| `query_cursor_before_or_at_default` | string | The default parameter value of the cursor_before_or_at() function when called without parameters. |
| `query_cursor_current` | string | Overrides the cursor value returned by the cursor_current() function. |
| `query_cursor_disabled` | bool | Disables usage of cursor functions in the context of the query. |
| `query_cursor_scoped_tables` | dynamic | List of table names that should be scoped to cursor_after_default .. cursor_before_or_at_default (upper bound is optional). |
| `query_datascope` | string | Controls the query's datascope -- whether the query applies to all data or just part of it. Supported values are 'default', 'all', or 'hotcache'. |
| `query_datetimescope_column` | string | Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). |
| `query_datetimescope_from` | datetime | Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `query_datetimescope_to` | datetime | Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `query_distribution_nodes_span` | int | If set, controls the way the subquery merge behaves: the executing node will introduce an additional level the query hierarchy for each subgroup of nodes; the size of the subgroup is set by this option. |
| `query_fanout_nodes_percent` | int | The percentage of nodes to fan out execution to. |
| `query_fanout_threads_percent` | int | The percentage of threads to fan out execution to. |
| `query_force_row_level_security` | bool | If specified, forces Row Level Security rules, even if row_level_security policy is disabled. |
| `query_language` | string | Controls how the query text is to be interpreted. Supported values are 'csl','kql' or 'sql'. |
| `query_log_query_parameters` | bool | Enables logging of the query parameters, so that they can be viewed later in the `.show queries` journal. |
| `query_max_entities_in_union` | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `query_now` | datetime | Overrides the datetime value returned by the now(0s) function. |
| `query_python_debug` | bool or int | If set, generate python debug query for the enumerated python node (default first). |
| `query_results_apply_getschema` | bool | If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `query_results_cache_force_refresh` | bool | If set, forces query results cache refresh for a specific query. Must be used in combination with 'query_results_cache_max_age', and sent via ClientRequestProperties object (not as 'set' statement). |
| `query_results_cache_max_age` | timespan | If positive, controls the maximum age of the cached query results the service is allowed to return. |
| `query_results_cache_per_shard` | bool | If set, enables per-shard query cache. |
| `query_results_progressive_row_count` | long | Hint for Kusto as to how many records to send in each update (takes effect only if *OptionResultsProgressiveEnabled* is set) |
| `query_results_progressive_update_period` | timespan | Hint for Kusto as to how often to send progress frames (takes effect only if *OptionResultsProgressiveEnabled* is set) |
| `query_take_max_records` | long | Enables limiting query results to this number of records. |
| `query_weakconsistency_session_id` | string | Sets the query weak consistency session ID. Takes effect when 'queryconsistency' mode is set to 'weakconsistency_by_session_id'. |
| `queryconsistency` | string | Controls query consistency. Supported values are 'strongconsistency', 'weakconsistency', 'weakconsistency_by_query', 'weakconsistency_by_database', or 'weakconsistency_by_session_id'. When using 'weakconsistency_by_session_id', make sure to also set the `query_weakconsistency_session_id` property. |
| `request_app_name` | string | Request application name to be used in the reporting (for example, show queries). |
| `request_block_row_level_security` | bool | If specified, blocks access to tables for which row_level_security policy is enabled. |
| `request_callout_disabled` | bool | If specified, indicates that the request can't call-out to a user-provided service. |
| `request_description` | string | Arbitrary text that the author of the request wants to include as the request description. |
| `request_external_data_disabled` | bool | If specified, indicates that the request can't access external data (using externaldata operator) or external tables. |
| `request_external_table_disabled` | bool | If specified, indicates that the request can't access external tables. |
| `request_impersonation_disabled` | bool | If specified, indicates that the service shouldn't impersonate the caller's identity. |
| `request_readonly` | bool | If specified, indicates that the request can't write anything. |
| `request_remote_entities_disabled` | bool | If specified, indicates that the request can't access remote databases and clusters. |
| `request_sandboxed_execution_disabled` | bool | If specified, indicates that the request can't invoke code in the sandbox. |
| `request_user` | string | Request user to be used in the reporting (for example, show queries). |
| `results_progressive_enabled` | bool | If set, enables the progressive query stream. |
| `servertimeout` | timespan | Overrides the default request timeout. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `truncationmaxrecords` | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `truncationmaxsize` | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `validate_permissions` | bool | Validates user's permissions to perform the query and doesn't run the query itself. The possible results for this property are: `OK` (permissions are present and valid), `Incomplete` (validation couldn't be completed as the query uses dynamic schema evaluation), or `KustoRequestDeniedException` (if permissions weren't set). |

---

## Query parameters

The Kusto Query Language (KQL) [query parameters declaration statement](../../query/queryparametersstatement.md) allows client applications to securely parameterize queries based on user input.

The `ClientRequestProperties` class contains methods to set, clear, and check the presence of these query parameters. The set parameter method provides a number of overloads for common data types, such as `string` and `long`. For all other types, express the value as a KQL literal in `string` format, and make sure that the `declare` `query_parameters` statement declares the correct [scalar data type](../../query/scalar-data-types/index.md).

For an example, see [Use query parameters to protect user input](../get-started/app-basic-query.md#use-query-parameters-to-protect-user-input).

## Named properties

The `ClientRequestProperties` class includes named properties that are valuable for debugging and tracing purposes. Each of these named properties corresponds to an HTTP request header. The following table provides an overview of these named properties.

### [C\#](#tab/csharp)

| Property name | HTTP header | Description |
|--|--|--|
| `ClientRequestId` | `x-ms-client-request-id` | An ID used to identify the request. This specification is helpful for debugging and may be required for specific scenarios like query cancellation. We recommend using the format *ClientApplicationName*`.`*ActivityType*`;`*UniqueId*. If the client doesn't specify a value for this property, a random value is assigned.|
| `Application` | `x-ms-app` | The name of the client application that makes the request. This value is used for tracing. To specify the property in a [Kusto connection string](../connection-strings/kusto.md), use the `Application Name for Tracing` property. If the client doesn't specify a value for this property, the property is automatically set to the name of the process hosting the Kusto Data library.|
| `User` | `x-ms-user` | The identity of the user that makes the request. This value is used for tracing. To specify the property in a [Kusto connection string](../connection-strings/kusto.md), use the `User Name for Tracing` property.|

> [!NOTE]
> The `ClientRequestId` property is recorded for diagnostics. Avoid sending sensitive data like personally identifiable or confidential information.

---

## Related content

* [Create an app to run basic queries](../get-started/app-basic-query.md)
* [Query/management HTTP request](../rest/request.md)
