---
title: Request properties and ClientRequestProperties - Azure Data Explorer
description: This article describes Request properties and ClientRequestProperties in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/11/2023
---
# Request properties and ClientRequestProperties

When a request is made, the caller is required to provide:

* A connection string indicating the service endpoint to connect to, authentication parameters, and similar connection-related information. Programmatically, the connection string is represented via the `KustoConnectionStringBuilder`class.
* The name of the database that is used to describe the "scope" of the request.
* The text of the request (query or command) itself.
* Optional: Additional properties that the client provides to the service, and that are applied to the request. Programmatically, these properties are held by a class called [`ClientRequestProperties`](#clientrequestproperties).

## ClientRequestProperties

Client request properties can affect what limits and policies get applied to the request.

The `Kusto.Data.Common.ClientRequestProperties` class in the .NET SDK holds three kinds of data:

* [Named properties](#named-properties) - These properties make debugging easier. For example, the properties may provide correlation strings that are used to track client/service interactions. 
* [ClientRequestProperties options](#clientrequestproperties-options) - A mapping of an option name to an option value.
* [Query parameters](../../query/queryparametersstatement.md)  - A mapping of a query parameter name to a query parameter value. These parameters let client applications parameterize Kusto queries based on user input.

## Named properties

> [!NOTE]
> Some named properties are marked "do not use". Such properties shouldn't
> be specified by clients, and have no effect on the service.

### ClientRequestId (x-ms-client-request-id)

This named property has the client-specified identity of the request. Clients should specify
a unique per-request value with each request they send.
This value makes debugging failures easier to do, and it's required in
some scenarios, such as for query cancellation.

The programmatic name of the property is `ClientRequestId`, and it translates
into the HTTP header `x-ms-client-request-id`.

This property will be set to a (random) value by the SDK if the client doesn't
specify a value.

The content of this property can be any printable unique string, such as a GUID.
However, we recommend that clients use:
*ApplicationName* `.` *ActivityName* `;` *UniqueId*

* *ApplicationName* identifies the client application that makes the request.
* *ActivityName* identifies the kind of activity for which the client application issues the client request.
* *UniqueId* identifies the specific request.

> [!WARNING]
> This property is recorded on the service side for diagnostics purposes.
> Customers should avoid sending data such as personally identifiable information,
> confidential information, etc. that should not be visible for troubleshooting
> purposes.

### Application (x-ms-app)

The Application (x-ms-app) named property has the name of the client application that makes the request, and is used
for tracing.

The programmatic name of this property is `Application`, and it translates
into the HTTP header `x-ms-app`. It can be specified in the
Kusto connection string as `Application Name for Tracing`.

This property will be set to the name of the process hosting the SDK if the client doesn't
specify its own value.

### User (x-ms-user)

The User (x-ms-user) named property has the identity of the user that makes the request, and is used
for tracing.

The programmatic name of this property is `User`, and it translates
into the HTTP header `x-ms-user`. It can be specified in the
Kusto connection string as `User Name for Tracing`.

## Use request properties

Use the following instructions to control request properties and provide values for query parameterization. 

### Control request properties using the REST API

When issuing an HTTP request to the Kusto service, use the `properties` slot in the
JSON document that is the POST request body, to provide request properties. 

> [!NOTE]
> Some of the properties (such as the "client request ID", which is the correlation ID
that the client provides to the service for identifying the request) can be provided
in the HTTP header, and can also be set if HTTP GET is used.
> For more information, see [the Kusto REST API request object](../rest/request.md).

### Provide values for query parameterization as request properties

Kusto queries can refer to query parameters by using a specialized [declare query-parameters](../../query/queryparametersstatement.md) statement in the query text. This statement lets client applications parameterize Kusto queries based on user input, in a secure manner, and without fear of injection attacks.

Programmatically, set properties values by using the `ClearParameter`, `SetParameter`, and `HasParameter` methods.
`SetParameter` provides a number of overloads for the common data types (such as `string` and `long`);
for all other types, use a string that represents the value as a KQL literal, and make sure that the
`declare query_parameters` statement declares that parameter to the correct scalar data type.

In the REST API, query parameters appear in the same JSON-encoded string as the other request properties.

## Example

The following example shows sample client code for using request properties:

#### Json body
```json
{
    "db": "Samples",
    "csl": "declare query_parameters (n:long, d:dynamic); StormEvents | where State in (d) | top n by StartTime asc",
    "properties": {
        "Options": {
            "maxmemoryconsumptionperiterator": 68719476736,
            "max_memory_consumption_per_query_per_node": 68719476736,
            "servertimeout": "50m"
        },
        "Parameters": {
            "n": 10, "d": "dynamic([\"ATLANTIC SOUTH\"])"
        }
    }
}
```

#### C\# client

```csharp
public static IDataReader QueryKusto(ICslQueryProvider queryProvider)
{
    var query = "declare query_parameters (n:long, d:dynamic); StormEvents | where State in (d) | top n by StartTime asc";
    var queryParameters = new Dictionary<string, string>
    {
        { "n", "10" }, // Will be parsed as long, according to the declare query_parameters statement in the query
        { "d", "dynamic([\"ATLANTIC SOUTH\"])" } // Will be parsed as dynamic, according to the declare query_parameters statement in the query
    };
    // Query parameters (and many other properties) are provided
    // by a ClientRequestProperties object handed alongside
    // the query:
    var clientRequestProperties = new ClientRequestProperties(options: null, parameters: queryParameters)
    {
        PrincipalIdentity = null,
        // Having client code provide its own ClientRequestId is
        // highly recommended. It not only allows the caller to
        // cancel the query, but also makes it possible for the Kusto
        // team to investigate query failures end-to-end:
        ClientRequestId = "MyApp.MyActivity;" + Guid.NewGuid()
    };
    // This is an example for setting an option
    // ("notruncation", in this case). In most cases this is not
    // needed, but it's included here for completeness:
    clientRequestProperties.SetOption(ClientRequestProperties.OptionNoTruncation, true);
    try
    {
        return queryProvider.ExecuteQuery(query, clientRequestProperties);
    }
    catch (Exception)
    {
        Console.WriteLine(
            "Failed invoking query '{0}' against Kusto. If contacting support, please provide this string: 'ClientRequestId={1}'",
            query, clientRequestProperties.ClientRequestId
        );
        return null;
    }
}
```

## ClientRequestProperties options

<!-- The following text can be re-produced by running: Kusto.Cli.exe -focus -execute:"#crp -doc" -->

| Name | Type | Description |
|--|--|--|
| `client_max_redirect_count` (*OptionClientMaxRedirectCount*) | long | If set and positive, indicates the maximum number of HTTP redirects that the client will process. |
| `deferpartialqueryfailures` (*OptionDeferPartialQueryFailures*) | bool | If true, disables reporting partial query failures as part of the result set. |
| `materialized_view_shuffle` (*OptionMaterializedViewShuffleQuery*) | dynamic | A hint to use shuffle strategy for materialized views that are referenced in the query. The property is an array of materialized views names and the shuffle keys to use. Examples: 'dynamic([{ "Name": "V1", "Keys" : [ "K1", "K2" ] }])' (shuffle view V1 by K1, K2) or 'dynamic([ { "Name": "V1" } ])' (shuffle view V1 by all keys) |
| `max_memory_consumption_per_query_per_node` (*OptionMaxMemoryConsumptionPerQueryPerNode*) | UInt64 | Overrides the default maximum amount of memory a whole query may allocate per node. |
| `maxmemoryconsumptionperiterator` (*OptionMaxMemoryConsumptionPerIterator*) | UInt64 | Overrides the default maximum amount of memory a query operator may allocate. |
| `maxoutputcolumns` (*OptionMaxOutputColumns*) | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `norequesttimeout` (*OptionNoRequestTimeout*) | bool | Enables setting the request timeout to its maximum value. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `notruncation` (*OptionNoTruncation*) | bool | Enables suppressing truncation of the query results returned to the caller. |
| `push_selection_through_aggregation` (*OptionPushSelectionThroughAggregation*) | bool | If true, push simple selection through aggregation. |
| `query_bin_auto_at` (*QueryBinAutoAt*) | literal | When evaluating the bin_auto() function, the start value to use. |
| `query_bin_auto_size` (*QueryBinAutoSize*) | literal | When evaluating the bin_auto() function, the bin size value to use. |
| `query_cursor_after_default` (*OptionQueryCursorAfterDefault*) | string | The default parameter value of the cursor_after() function when called without parameters. |
| `query_cursor_before_or_at_default` (*OptionQueryCursorBeforeOrAtDefault*) | string | The default parameter value of the cursor_before_or_at() function when called without parameters. |
| `query_cursor_current` (*OptionQueryCursorCurrent*) | string | Overrides the cursor value returned by the cursor_current() function. |
| `query_cursor_disabled` (*OptionQueryCursorDisabled*) | bool | Disables usage of cursor functions in the context of the query. |
| `query_cursor_scoped_tables` (*OptionQueryCursorScopedTables*) | dynamic | List of table names that should be scoped to cursor_after_default .. cursor_before_or_at_default (upper bound is optional). |
| `query_datascope` (*OptionQueryDataScope*) | string | Controls the query's datascope -- whether the query applies to all data or just part of it. Supported values are 'default', 'all', or 'hotcache'. |
| `query_datetimescope_column` (*OptionQueryDateTimeScopeColumn*) | string | Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). |
| `query_datetimescope_from` (*OptionQueryDateTimeScopeFrom*) | datetime | Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `query_datetimescope_to` (*OptionQueryDateTimeScopeTo*) | datetime | Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). |
| `query_distribution_nodes_span` (*OptionQueryDistributionNodesSpanSize*) | int | If set, controls the way the subquery merge behaves: the executing node will introduce an additional level the query hierarchy for each subgroup of nodes; the size of the subgroup is set by this option. |
| `query_fanout_nodes_percent` (*OptionQueryFanoutNodesPercent*) | int | The percentage of nodes to fan out execution to. |
| `query_fanout_threads_percent` (*OptionQueryFanoutThreadsPercent*) | int | The percentage of threads to fan out execution to. |
| `query_force_row_level_security` (*OptionQueryForceRowLevelSecurity*) | bool | If specified, forces Row Level Security rules, even if row_level_security policy is disabled. |
| `query_language` (*OptionQueryLanguage*) | string | Controls how the query text is to be interpreted. Supported values are 'csl','kql' or 'sql'. |
| `query_log_query_parameters` (*OptionQueryLogQueryParameters*) | bool | Enables logging of the query parameters, so that they can be viewed later in the `.show queries` journal. |
| `query_max_entities_in_union` (*OptionMaxEntitiesToUnion*) | long | Overrides the default maximum number of columns a query is allowed to produce. |
| `query_now` (*OptionQueryNow*) | datetime | Overrides the datetime value returned by the now(0s) function. |
| `query_python_debug` (*OptionDebugPython*) | bool or int | If set, generate python debug query for the enumerated python node (default first). |
| `query_results_apply_getschema` (*OptionQueryResultsApplyGetSchema*) | bool | If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. |
| `query_results_cache_force_refresh` (*OptionQueryResultsCacheForceRefresh*) | bool | If set, forces query results cache refresh for a specific query. Must be used in combination with 'query_results_cache_max_age', and sent via ClientRequestProperties object (not as 'set' statement). |
| `query_results_cache_max_age` (*OptionQueryResultsCacheMaxAge*) | timespan | If positive, controls the maximum age of the cached query results the service is allowed to return. |
| `query_results_cache_per_shard` (*OptionQueryResultsCachePerShardEnabled*) | bool | If set, enables per-shard query cache. |
| `query_results_progressive_row_count` (*OptionProgressiveQueryMinRowCountPerUpdate*) |  | Hint for Kusto as to how many records to send in each update (takes effect only if OptionResultsProgressiveEnabled is set) |
| `query_results_progressive_update_period` (*OptionProgressiveProgressReportPeriod*) |  | Hint for Kusto as to how often to send progress frames (takes effect only if OptionResultsProgressiveEnabled is set) |
| `query_take_max_records` (*OptionTakeMaxRecords*) | long | Enables limiting query results to this number of records. |
| `query_weakconsistency_session_id` (*OptionQueryWeakConsistencySessionId*) | string | Sets the query weak consistency session ID. Takes effect when 'queryconsistency' mode is set to 'weakconsistency_by_session_id'. |  |
| `queryconsistency` (*OptionQueryConsistency*) | string | Controls query consistency. Supported values are 'strongconsistency', 'weakconsistency', 'weakconsistency_by_query', 'weakconsistency_by_database', or 'weakconsistency_by_session_id'. |
| `request_app_name` (*OptionRequestAppName*) | string | Request application name to be used in the reporting (for example, show queries). |
| `request_block_row_level_security` (*OptionRequestBlockRowLevelSecurity*) | bool | If specified, blocks access to tables for which row_level_security policy is enabled. |
| `request_callout_disabled` (*OptionRequestCalloutDisabled*) | bool | If specified, indicates that the request can't call-out to a user-provided service. |
| `request_description` (*OptionRequestDescription*) | string | Arbitrary text that the author of the request wants to include as the request description. |
| `request_external_data_disabled` (*OptionRequestExternalDataDisabled*) | bool | If specified, indicates that the request can't access external data (using externaldata operator) or external tables. |
| `request_external_table_disabled` (*OptionRequestExternalTableDisabled*) | bool | If specified, indicates that the request can't access external tables. |
| `request_impersonation_disabled` (*OptionDoNotImpersonate*) | bool | If specified, indicates that the service shouldn't impersonate the caller's identity. |
| `request_readonly` (*OptionRequestReadOnly*) | bool | If specified, indicates that the request can't write anything. |
| `request_remote_entities_disabled` (*OptionRequestRemoteEntitiesDisabled*) | bool | If specified, indicates that the request can't access remote databases and clusters. |
| `request_sandboxed_execution_disabled` (*OptionRequestSandboxedExecutionDisabled*) | bool | If specified, indicates that the request can't invoke code in the sandbox. |
| `request_user` (*OptionRequestUser*) | string | Request user to be used in the reporting (for example, show queries). |
| `results_progressive_enabled` (*OptionResultsProgressiveEnabled*) | bool | If set, enables the progressive query stream. |
| `servertimeout` (*OptionServerTimeout*) | timespan | Overrides the default request timeout. This option can't be set as part of a [set statement](../../query/setstatement.md). |
| `truncationmaxrecords` (*OptionTruncationMaxRecords*) | long | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). |
| `truncationmaxsize` (*OptionTruncationMaxSize*) | long | Overrides the default maximum data size a query is allowed to return to the caller (truncation). |
| `validate_permissions` (*OptionValidatePermissions*) | bool | Validates user's permissions to perform the query and doesn't run the query itself. The possible results for this property are:</br>- "OK": permissions are present and valid.</br>- "Incomplete": validation couldn't be completed as the query uses dynamic schema evaluation.</br>- Returns KustoRequestDeniedException if permissions weren't set.|
