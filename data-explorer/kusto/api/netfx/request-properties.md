---
title: Request properties, ClientRequestProperties - Azure Data Explorer | Microsoft Docs
description: This article describes Request properties, ClientRequestProperties in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 07/30/2019
---
# Request properties, ClientRequestProperties

When making a request from Kusto through the .NET SDK, one generally provides
the following values:

1. A connection string indicating the service endpoint to connect to, authentication
   parameters, and similar connection-related information. Programmatically, the
   connection string is represented through the `KustoConnectionStringBuilder`
   class.

2. The name of the database that is used to describe the "scope" of the request.

3. The text of the request (query or command) itself.

4. Additional properties that the client provides the service and are applied to
   the request. Programmatically, these properties are held by a class called
   `ClientRequestProperties`.

The client request properties have many uses. Some of them are used to make
debugging easier (for example, by providing correlation strings that can be
used to track client/service interactions), others are used to affect what limits
and policies get applied to the request, while a third category of such properties
is [query parameters](../../query/queryparametersstatement.md). A full list of supported
properties appear in this page.

The `Kusto.Data.Common.ClientRequestProperties` class holds three kinds of data:

* Named properties.

* Options (a mapping of an option name to an option value).

* Parameters (a mapping of a query parameter name to a query parameter value).

> [!NOTE]
> Some named properties are marked as "do not use". Such properties should not
> be specified by clients, and have no effect on the service.

## The ClientRequestId (x-ms-client-request-id) named property

This named property holds the client-specified identity of the request. It is highly
recommended that a unique per-request value be specified by clients with each
request they send, as it makes debugging failures easier (and is required in
some scenarios, such as query cancellation).

The programmatic name of this property is `ClientRequestId`, and it translates
into the HTTP header `x-ms-client-request-id`.

This property will be set to a (random) value by the SDK if the client doesn't
specify its own value.

The content of this property can be any printable unique string, such as a GUID.
It is recommended, however, that clients use the following template:

*ApplicationName* `.` *ActivityName* `;` *UniqueId*

Where *ApplicationName* identifies the client application making the request, *ActivityName* identifies
the kind of activity that the client application is issuing the client request for, and *UniqueId*
identifies the specific request.

## The Application (x-ms-app) named property

This named property holds the name of the client application making the request,
for tracing purposes.

The programmatic name of this property is `Application`, and it translates
into the HTTP header `x-ms-app`. It can be specified in the
Kusto connection string as `Application Name for Tracing`.

This property will be set to the name of the process hosting the SDK if the client doesn't
specify its own value.

## The User (x-ms-user) named property

This named property holds the identity of the user making the request,
for tracing purposes.

The programmatic name of this property is `User`, and it translates
into the HTTP header `x-ms-user`. It can be specified in the
Kusto connection string as `User Name for Tracing`.

## Controlling request properties using the REST API

When issuing an HTTP request to the Kusto service, use the `properties` slot in the
JSON document that is the POST request body to provide request properties. Note that some
of the properties (such as the "client request ID", which is the correlation ID
that the client provides to the service for identifying the request) can be provided
in the HTTP header, and so can also be set if HTTP GET is used.
See [the Kusto REST API request object](../rest/request.md) for additional information.

## Providing values for query parametrization as request properties

Kusto queries can refer to query parameters by using a specialized [declare query-parameters](../../query/queryparametersstatement.md)
statement in the query text. This allows client applications to parameterize Kusto queries
based on user input in a secure manner (without fear of injection attacks.)

Programmatically, one may set properties values by using the `ClearParameter`, `SetParameter`, and `HasParameter`
methods.

In the REST API, query parameters appears in the same JSON-encoded string as the other request properties.

## Sample code for using request properties

Here is an example for client code:

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

<!-- The following is auto-generated by running the following command: -->
<!-- Kusto.Cli.exe -execute:"#crp -doc"                                -->

* `block_splitting_enabled` (*OptionBlockSplittingEnabled*): Enables splitting of sequence blocks after aggregation operator. [Boolean]
* `database_pattern` (*OptionDatabasePattern*): Database pattern overrides database name and picks the 1st database that matches the pattern. '*' means any database that user has access to. [String]
* `debug_query_externaldata_projection_fusion_disabled` (*OptionDebugQueryDisableExternalDataProjectionFusion*): If set, don't fuse projection into ExternalData operator. [Boolean]
* `debug_query_fanout_threads_percent_external_data` (*OptionDebugQueryFanoutThreadsPercentExternalData*): The percentage of threads to fanout execution to for external data nodes. [Int]
* `deferpartialqueryfailures` (*OptionDeferPartialQueryFailures*): If true, disables reporting partial query failures as part of the result set. [Boolean]
* `max_memory_consumption_per_query_per_node` (*OptionMaxMemoryConsumptionPerQueryPerNode*): Overrides the default maximum amount of memory a whole query may allocate per node. [UInt64]
* `maxmemoryconsumptionperiterator` (*OptionMaxMemoryConsumptionPerIterator*): Overrides the default maximum amount of memory a query operator may allocate. [UInt64]
* `maxoutputcolumns` (*OptionMaxOutputColumns*): Overrides the default maximum number of columns a query is allowed to produce. [Long]
* `norequesttimeout` (*OptionNoRequestTimeout*): Enables setting the request timeout to its maximum value. [Boolean]
* `notruncation` (*OptionNoTruncation*): Enables suppressing truncation of the query results returned to the caller. [Boolean]
* `push_selection_through_aggregation` (*OptionPushSelectionThroughAggregation*): If true, push simple selection through aggregation [Boolean]
* `query_admin_super_slacker_mode` (*OptionAdminSuperSlackerMode*): If true, delegate execution of the query to another node [Boolean]
* `query_bin_auto_at` (*QueryBinAutoAt*): When evaluating the bin_auto() function, the start value to use. [LiteralExpression]
* `query_bin_auto_size` (*QueryBinAutoSize*): When evaluating the bin_auto() function, the bin size value to use. [LiteralExpression]
* `query_cursor_after_default` (*OptionQueryCursorAfterDefault*): The default parameter value of the cursor_after() function when called without parameters. [string]
* `query_cursor_allow_referencing_streaming_ingestion_tables` (*OptionQueryCursorAllowReferencingStreamingIngestionTables*): Enable usage of cursor functions over databases which have streaming ingestion enabled. [boolean]
* `query_cursor_before_or_at_default` (*OptionQueryCursorBeforeOrAtDefault*): The default parameter value of the cursor_before_or_at() function when called without parameters. [string]
* `query_cursor_current` (*OptionQueryCursorCurrent*): Overrides the cursor value returned by the cursor_current() or current_cursor() functions. [string]
* `query_cursor_scoped_tables` (*OptionQueryCursorScopedTables*): List of table names that should be scoped to cursor_after_default .. cursor_before_or_at_default (upper bound is optional). [dynamic]
* `query_datascope` (*OptionQueryDataScope*): Controls the query's datascope -- whether the query applies to all data or just part of it. ['default', 'all', or 'hotcache']
* `query_datetimescope_column` (*OptionQueryDateTimeScopeColumn*): Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). [String]
* `query_datetimescope_from` (*OptionQueryDateTimeScopeFrom*): Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). [DateTime]
* `query_datetimescope_to` (*OptionQueryDateTimeScopeTo*): Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). [DateTime]
* `query_distribution_nodes_span` (*OptionQueryDistributionNodesSpanSize*): If set, controls the way sub-query merge behaves: the executing node will introduce an additional level in the query hierarchy for each sub-group of nodes; the size of the sub-group is set by this option. [Int]
* `query_enable_jit_stream` (*OptionEnableJitStream*): If true, enabled JIT streams when sending data from managed code to native code. [Boolean]
* `query_fanout_nodes_percent` (*OptionQueryFanoutNodesPercent*): The percentage of nodes to fanout execution to. [Int]
* `query_fanout_threads_percent` (*OptionQueryFanoutThreadsPercent*): The percentage of threads to fanout execution to. [Int]
* `query_language` (*OptionQueryLanguage*): Controls how the query text is to be interpreted. ['csl','kql' or 'sql']
* `query_max_entities_in_union` (*OptionMaxEntitiesToUnion*): Overrides the default maximum number of columns a query is allowed to produce. [Long]
* `query_now` (*OptionQueryNow*): Overrides the datetime value returned by the now(0s) function. [DateTime]
* `query_results_cache_max_age` (*OptionQueryResultsCacheMaxAge*): If positive, controls the maximum age of the cached query results which Kusto is allowed to return [TimeSpan]
* `query_results_progressive_row_count` (*OptionProgressiveQueryMinRowCountPerUpdate*): Hint for Kusto as to how many records to send in each update (Takes effect only if OptionProgressiveQueryIsProgressive is set)
* `query_results_progressive_update_period` (*OptionProgressiveProgressReportPeriod*): Hint for Kusto as to how often to send progress frames (Takes effect only if OptionProgressiveQueryIsProgressive is set)
* `query_shuffle_broadcast_join` (*ShuffleBroadcastJoin*): Enables shuffling over broadcast join.
* `query_take_max_records` (*OptionTakeMaxRecords*): Enables limiting query results to this number of records. [Long]
* `queryconsistency` (*OptionQueryConsistency*): Controls query consistency. ['strongconsistency' or 'normalconsistency' or 'weakconsistency']
* `request_callout_disabled` (*OptionRequestCalloutDisabled*): If specified, indicates that the request cannot call-out to a user-provided service. [Boolean]
* `request_external_table_disabled` (*OptionRequestExternalTableDisabled*):  If specified, indicates that the request cannot invoke code in the ExternalTable. [Boolean]
* `request_readonly` (*OptionRequestReadOnly*): If specified, indicates that the request must not be able to write anything. [Boolean]
* `request_remote_entities_disabled` (*OptionRequestRemoteEntitiesDisabled*): If specified, indicates that the request cannot access remote databases and clusters. [Boolean]
* `request_sandboxed_execution_disabled` (*OptionRequestSandboxedExecutionDisabled*): If specified, indicates that the request cannot invoke code in the sandbox. [Boolean]
* `response_dynamic_serialization` (*OptionResponseDynamicSerialization*): Controls the serialization of 'dynamic' values in result sets. ['string', 'json']
* `response_dynamic_serialization_2` (*OptionResponseDynamicSerialization_2*): Controls the serialization of 'dynamic' string and null values in result sets. ['legacy', 'current']
* `results_progressive_enabled` (*OptionResultsProgressiveEnabled*): If set, enables the progressive query stream
* `servertimeout` (*OptionServerTimeout*): Overrides the default request timeout. [TimeSpan]
* `truncationmaxrecords` (*OptionTruncationMaxRecords*): Overrides the default maximum number of records a query is allowed to return to the caller (truncation). [Long]
* `truncationmaxsize` (*OptionTruncationMaxSize*): Overrides the dfefault maximum data size a query is allowed to return to the caller (truncation). [Long]
* `validate_permissions` (*OptionValidatePermissions*): Validates user's permissions to perform the query and doesn't run the query itself. [Boolean]

