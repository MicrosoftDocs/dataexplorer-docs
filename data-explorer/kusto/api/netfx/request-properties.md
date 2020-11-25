---
title: Request properties and ClientRequestProperties - Azure Data Explorer
description: This article describes Request properties and ClientRequestProperties in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/23/2019
---
# Request properties and ClientRequestProperties

When a request is made from Kusto through the .NET SDK, provide:

* A connection string indicating the service endpoint to connect to, authentication parameters, and similar connection-related information. Programmatically, the connection string is represented via the `KustoConnectionStringBuilder`class.

* The name of the database that is used to describe the "scope" of the request.

* The text of the request (query or command) itself.

* Additional properties that the client provides to the service, and that are applied to the request. Programmatically, these properties are held by a class called `ClientRequestProperties`.

##  ClientRequestProperties

The client request properties have many uses. 
* Makes debugging easier. For example, the properties may provide correlation strings that are used to track client/service interactions. 
* Affects what limits and policies get applied to the request. 
* [query parameters](../../query/queryparametersstatement.md) let client applications parameterize Kusto queries based on user input. FOr more information, see [list of supported properties](#list-of-clientrequestproperties).

The `Kusto.Data.Common.ClientRequestProperties` class holds three kinds of data.

* Named properties.
* Options - A mapping of an option name to an option value.
* Parameters  - A mapping of a query parameter name to a query parameter value.

> [!NOTE]
> Some named properties are marked "do not use". Such properties shouldn't
> be specified by clients, and have no effect on the service.

## The ClientRequestId (x-ms-client-request-id) named property

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

## The application (x-ms-app) named property

The Application (x-ms-app) named property has the name of the client application that makes the request, and is used
for tracing.

The programmatic name of this property is `Application`, and it translates
into the HTTP header `x-ms-app`. It can be specified in the
Kusto connection string as `Application Name for Tracing`.

This property will be set to the name of the process hosting the SDK if the client doesn't
specify its own value.

## The User (x-ms-user) named property

The User (x-ms-user) named property has the identity of the user that makes the request, and is used
for tracing.

The programmatic name of this property is `User`, and it translates
into the HTTP header `x-ms-user`. It can be specified in the
Kusto connection string as `User Name for Tracing`.

## Controlling request properties using the REST API

When issuing an HTTP request to the Kusto service, use the `properties` slot in the
JSON document that is the POST request body, to provide request properties. 

> [!NOTE]
> Some of the properties (such as the "client request ID", which is the correlation ID
that the client provides to the service for identifying the request) can be provided
in the HTTP header, and can also be set if HTTP GET is used.
> For more information, see [the Kusto REST API request object](../rest/request.md).

## Providing values for query parameterization as request properties

Kusto queries can refer to query parameters by using a specialized [declare query-parameters](../../query/queryparametersstatement.md)
statement in the query text. This statement lets client applications parameterize Kusto queries based on user input, 
in a secure manner, and without fear of injection attacks.

Programmatically, set properties values by using the `ClearParameter`, `SetParameter`, and `HasParameter`
methods.

In the REST API, query parameters appear in the same JSON-encoded string as the other request properties.

## Sample client code for using request properties

```csharp
public static System.Data.IDataReader QueryKusto(
    Kusto.Data.Common.ICslQueryProvider queryProvider,
    string databaseName,
    string query)
{
    var queryParameters = new Dictionary<String, String>()
    {
        { "xIntValue", "111" },
        { "xStrValue", "abc" },
        { "xDoubleValue", "11.1" }
    };

    // Query parameters (and many other properties) are provided
    // by a ClientRequestProperties object handed alongside
    // the query:
    var clientRequestProperties = new Kusto.Data.Common.ClientRequestProperties(
        principalIdentity: null,
        options: null,
        parameters: queryParameters);

    // Having client code provide its own ClientRequestId is
    // highly recommended. It not only allows the caller to
    // cancel the query, but also makes it possible for the Kusto
    // team to investigate query failures end-to-end:
    clientRequestProperties.ClientRequestId
        = "MyApp.MyActivity;"
        + Guid.NewGuid().ToString();

    // This is an example for setting an option
    // ("notruncation", in this case). In most cases this is not
    // needed, but it's included here for completeness:
    clientRequestProperties.SetOption(
        Kusto.Data.Common.ClientRequestProperties.OptionNoTruncation,
        true);
 
    try
    {
        return queryProvider.ExecuteQuery(query, clientRequestProperties);
    }
    catch (Exception ex)
    {
        Console.WriteLine(
            "Failed invoking query '{0}' against Kusto."
            + " To have the Kusto team investigate this failure,"
            + " please open a ticket @ https://aka.ms/kustosupport,"
            + " and provide: ClientRequestId={1}",
            query, clientRequestProperties.ClientRequestId);
        return null;
    }
}
```

## List of ClientRequestProperties

<!-- The following is auto-generated by running  Kusto.Cli.exe -execute:"#crp -doc"           -->
<!-- The following text can be re-produced by running the Kusto.Cli.exe directive '#crp -doc' -->

| Property <br>(*Option*) | Description | Type |
|---|---|---|
`deferpartialqueryfailures` <br>(*OptionDeferPartialQueryFailures*)| If true, disables reporting partial query failures as part of the result set. |Boolean
| `materialized_view_shuffle` <br>(*OptionMaterializedViewShuffleQuery*)| An hint to use shuffle strategy for materialized views that are referenced in the query. <br> The property is an array of materialized views names and the shuffle keys to use. <br> **Example shuffle view V1 by K1, K2** <br>`dynamic([ { "Name": "V1", "Keys" : [ "K1", "K2" ] } ])` <br> **Example: shuffle view V1 by all keys**<br> `dynamic([ { "Name": "V1" } ])`  | dynamic
|`max_memory_consumption_per_query_per_node` <br>(*OptionMaxMemoryConsumptionPerQueryPerNode*) | Overrides the default maximum amount of memory a whole query may allocate per node. | UInt64
| `maxmemoryconsumptionperiterator` <br>(*OptionMaxMemoryConsumptionPerIterator*)| Overrides the default maximum amount of memory a query operator may allocate. | UInt64
| `maxoutputcolumns` <br>(*OptionMaxOutputColumns*)|Overrides the default maximum number of columns a query is allowed to produce. | Long
| `norequesttimeout` <br>(*OptionNoRequestTimeout*)|Enables setting the request timeout to its maximum value. | Boolean
| `notruncation` <br>(*OptionNoTruncation*)|Enables suppressing truncation of the query results returned to the caller. | Boolean
| `push_selection_through_aggregation` <br>(*OptionPushSelectionThroughAggregation*)|If true, push simple selection through aggregation | Boolean
| `query_bin_auto_at` <br>(*QueryBinAutoAt*)|When evaluating the bin_auto() function, the start value to use. | LiteralExpression
| `query_bin_auto_size` <br>(*QueryBinAutoSize*)|hen evaluating the bin_auto() function, the bin size value to use. | LiteralExpression
| `query_cursor_after_default` <br>(*OptionQueryCursorAfterDefault*)|he default parameter value of the cursor_after() function when called without parameters. | string
| `query_cursor_before_or_at_default` <br>(*OptionQueryCursorBeforeOrAtDefault*)|The default parameter value of the cursor_before_or_at() function when called without parameters. | string
| `query_cursor_current` <br>(*OptionQueryCursorCurrent*)|Overrides the cursor value returned by the cursor_current() or current_cursor() functions. | string
| `query_cursor_disabled`<br> (*OptionQueryCursorDisabled*)|Disables usage of cursor functions in the context of the query. | Boolean
| `query_cursor_scoped_tables` <br>(*OptionQueryCursorScopedTables*)|List of table names that should be scoped to cursor_after_default .. cursor_before_or_at_default (upper bound is optional). | dynamic
| `query_datascope` <br>(*OptionQueryDataScope*)|Controls the query's datascope -- whether the query applies to all data or just part of it. |`default`, `all`, or `hotcache`
| `query_datetimescope_column`<br>(*OptionQueryDateTimeScopeColumn*)|Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). | string
| `query_datetimescope_from` <br>(*OptionQueryDateTimeScopeFrom*)|Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). | DateTime
| `query_datetimescope_to`<br> (*OptionQueryDateTimeScopeTo*)|Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). | DateTime
| `query_distribution_nodes_span`<br>(*OptionQueryDistributionNodesSpanSize*)|f set, controls the way sub-query merge behaves|the executing node will introduce an additional level in the query hierarchy for each sub-group of nodes; the size of the sub-group is set by this option. | Int
| `query_fanout_nodes_percent` <br>(*OptionQueryFanoutNodesPercent*)|The percentage of nodes to fanout execution to. | Int
| `query_fanout_threads_percent` <br>(*OptionQueryFanoutThreadsPercent*)|The percentage of threads to fanout execution to. | Int
| `query_force_row_level_security` <br>(*OptionQueryForceRowLevelSecurity*)|If specified, forces Row Level Security rules, even if row_level_security policy is disabled | Boolean
| `query_language` <br>(*OptionQueryLanguage*)|Controls how the query text is to be interpreted. |`csl`,`kql`, or `sql`
| `query_max_entities_in_union` <br>(*OptionMaxEntitiesToUnion*)|Overrides the default maximum number of columns a query is allowed to produce. | Long
| `query_now`<br> (*OptionQueryNow*)|Overrides the datetime value returned by the now(0s) function. | DateTime
| `query_parquet_in_shard_engine` <br>(*QueryParquetInShardEngine*)|Force a Parquet external_table/externaldata query to run in EngineV3 (true) or EngineV2 (false) | Boolean
| `query_python_debug` <br>(*OptionDebugPython*)|If set, generate python debug query for the enumerated python node (default first). |Boolean or Int
| `query_results_apply_getschema` <br>(*OptionQueryResultsApplyGetSchema*)|If set, retrieves the schema of each tabular data in the results of the query instead of the data itself. | Boolean
| `query_results_cache_max_age` <br>(*OptionQueryResultsCacheMaxAge*)|If positive, controls the maximum age of the cached query results which Kusto is allowed to return | TimeSpan
| `query_results_progressive_row_count` <br>(*OptionProgressiveQueryMinRowCountPerUpdate*)|Hint for Kusto as to how many records to send in each update. Only takes effect if *OptionResultsProgressiveEnabled* is set.
| `query_results_progressive_update_period` <br>(*OptionProgressiveProgressReportPeriod*)|Hint for Kusto as to how often to send progress frames. Only takes effect if *OptionResultsProgressiveEnabled* is set.
| `query_take_max_records` <br>(*OptionTakeMaxRecords*)|Enables limiting query results to this number of records. | Long
| `queryconsistency` <br>(*OptionQueryConsistency*)|Controls query consistency. | `strongconsistency`, `normalconsistency`, or `weakconsistency`
| `request_block_row_level_security`<br> (*OptionRequestBlockRowLevelSecurity*)|If specified, blocks access to tables for which row_level_security policy is enabled | Boolean
| `request_callout_disabled` (*OptionRequestCalloutDisabled*)|If specified, indicates that the request cannot call-out to a user-provided service. | Boolean
| `request_description` <br>(*OptionRequestDescription*)|Arbitrary text that the author of the request wants to include as the request description. | string
| `request_external_table_disabled` <br>(*OptionRequestExternalTableDisabled*)| If specified, indicates that the request cannot invoke code in the ExternalTable. | Boolean
| `request_impersonation_disabled` <br>(*OptionDoNotImpersonate*)|If specified, indicates that the service should not impersonate the caller's identity. | Boolean
| `request_readonly` <br>(*OptionRequestReadOnly*)|If specified, indicates that the request must not be able to write anything. | Boolean
| `request_remote_entities_disabled` <br>(*OptionRequestRemoteEntitiesDisabled*)|If specified, indicates that the request cannot access remote databases and clusters. | Boolean
| `request_sandboxed_execution_disabled`<br> (*OptionRequestSandboxedExecutionDisabled*)|If specified, indicates that the request cannot invoke code in the sandbox. | Boolean
| `results_progressive_enabled` <br>(*OptionResultsProgressiveEnabled*)|If set, enables the progressive query stream
| `servertimeout` <br>(*OptionServerTimeout*)|Overrides the default request timeout. | TimeSpan
| `truncationmaxrecords` <br>(*OptionTruncationMaxRecords*)|Overrides the default maximum number of records a query is allowed to return to the caller (truncation). | Long
| `truncationmaxsize`<br> (*OptionTruncationMaxSize*)|Overrides the default maximum data size a query is allowed to return to the caller (truncation). | Long
| `validate_permissions` <br>(*OptionValidatePermissions*)|Validates user's permissions to perform the query and doesn't run the query itself. | Boolean
