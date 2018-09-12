---
title: Request properties and ClientRequestProperties - Azure Kusto | Microsoft Docs
description: This article describes Request properties and ClientRequestProperties in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Request properties and ClientRequestProperties

Kusto supports attaching various properties to client requests (such as queries and control commands).
Such properties may be used to provide additional information to Kusto (for example, for the purpose
of correlating client/service interaction), may affect what limits and policies get applied to the
request, and much more. A full list of supported properties can be found at the end of this page.

## The ClientRequestId (x-ms-client-request-id) property

It is recommended the clients will always set at least one property for every request, the
`ClientRequestId` programmatic property (equivalently, the `x-ms-client-request-id` HTTP header).
This property attaches the provided string (which should be unique for every request) to the request,
so as to allow correlation of client activities and service activties.

The content of this property can be any printable unique string, such as a GUID. It is recommended,
however, that it follow this format:

*ApplicationName* `.` *ActivityName* `;` *UniqueId*

Where *ApplicationName* identifies the client application making the request, *ActivityName* identifies
the kind of activity that the client application is issuing the client request for, and *UniqueId*
identifies the specific request.

## Programmatically controlling request properties

Several of the methods in the Kusto client libraries (in particular, those that end-up making REST API
calls to the Kusto service) take an optional argument of type `Kusto.Data.Common.ClientRequestProperties`.
This argument allows the caller more control over how Kusto executes 
the query or control command.

## Controlling request properties using the REST API

When issuing an HTTP request to the Kusto service, use the `properties` slot in the
JSON document that is the POST request body to provide request properties. Note that some
of the properties (such as the "client request ID", which is the correlation ID
that the client provides to the service for identifying the request) can be provided
in the HTTP header, and so can also be set if HTTP GET is used.
See [the Kusto REST API request object](rest/request.md) for additional information.

## Providing values for query parametrization as request properties

Kusto queries can refer to query parameters by using a specialized [declare query-parameters](../query/queryparametersstatement.md)
statement in the query text. This allows client applications to parametrize Kusto queries
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

<!-- The following table it auto-generated by running the following command; do not mess with it -->
<!-- Kusto.Cli.exe -execute:"#markdownon" -execute:"#crp"                                        -->

Property                                    | Name                                       | Description                                                                                                                                                                                                        
--------------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
QueryBinAutoAt                              | query_bin_auto_at                          | When evaluating the bin_auto() function, the start value to use. [LiteralExpression]                                                                                                                               
QueryBinAutoSize                            | query_bin_auto_size                        | When evaluating the bin_auto() function, the bin size value to use. [LiteralExpression]                                                                                                                            
OptionDatabasePattern                       | database_pattern                           | Database pattern overrides database name and picks the 1st database that matches the pattern. '*' means any database that user has access to. [String]                                                             
OptionQueryDataScope                        | query_datascope                            | Controls the query's datascope -- whether the query applies to all data or just part of it. ['default', 'all', or 'hotcache']                                                                                      
OptionQueryDateTimeScopeColumn              | query_datetimescope_column                 | Controls the column name for the query's datetime scope (query_datetimescope_to / query_datetimescope_from). [String]                                                                                              
OptionQueryDateTimeScopeFrom                | query_datetimescope_from                   | Controls the query's datetime scope (earliest) -- used as auto-applied filter on query_datetimescope_column only (if defined). [DateTime]                                                                          
OptionQueryDateTimeScopeTo                  | query_datetimescope_to                     | Controls the query's datetime scope (latest) -- used as auto-applied filter on query_datetimescope_column only (if defined). [DateTime]                                                                            
OptionQueryLanguage                         | query_language                             | Controls how the query text is to be interpreted. ['csl' or 'sql']                                                                                                                                                 
OptionQueryNow                              | query_now                                  | Overrides the datetime value returned by the now(0s) function. [DateTime]                                                                                                                                          
OptionQueryCursorCurrent                    | query_cursor_current                       | Overrides the cursor value returned by the cursor_current() or current_cursor() functions. [string]                                                                                                                
OptionQueryCursorAfterDefault               | query_cursor_after_default                 | The default parameter value of the cursor_after() function when called without parameters. [string]                                                                                                                
OptionQueryCursorBeforeOrAtDefault          | query_cursor_before_or_at_default          | The default parameter value of the cursor_before_or_at() function when called without parameters. [string]                                                                                                         
OptionValidatePermissions                   | validate_permissions                       | Validates user's permissions to perform the query and doesn't run the query itself. [Boolean]                                                                                                                      
OptionMaxEntitiesToUnion                    | query_max_entities_in_union                | Overrides the default maximum number of columns a query is allowed to produce. [Long]                                                                                                                              
OptionMaxMemoryConsumptionPerIterator       | maxmemoryconsumptionperiterator            | Overrides the default maximum amount of memory a query operator may allocate. [UInt64]                                                                                                                             
OptionMaxMemoryConsumptionPerQueryPerNode   | max_memory_consumption_per_query_per_node  | Overrides the default maximum amount of memory a whole query may allocate per node. [UInt64]                                                                                                                       
OptionMaxOutputColumns                      | maxoutputcolumns                           | Overrides the default maximum number of columns a query is allowed to produce. [Long]                                                                                                                              
OptionNoRequestTimeout                      | norequesttimeout                           | Enables setting the request timeout to its maximum value. [Boolean]                                                                                                                                                
OptionServerTimeout                         | servertimeout                              | Overrides the default request timeout. [TimeSpan]                                                                                                                                                                  
OptionNoTruncation                          | notruncation                               | Enables suppressing truncation of the query results returned to the caller. [Boolean]                                                                                                                              
OptionTruncationMaxRecords                  | truncationmaxrecords                       | Overrides the default maximum number of records a query is allowed to return to the caller (truncation). [Long]                                                                                                    
OptionTruncationMaxSize                     | truncationmaxsize                          | Overrides the dfefault maximum data size a query is allowed to return to the caller (truncation). [Long]                                                                                                           
OptionTakeMaxRecords                        | query_take_max_records                     | Enables limiting query results to this number of records. [Long]                                                                                                                                                   
OptionQueryFanoutThreadsPercent             | query_fanout_threads_percent               | The percentage of threads to fanout execution to. [Int]                                                                                                                                                            
OptionQueryFanoutNodesPercent               | query_fanout_nodes_percent                 | The percentage of nodes to fanour execution to. [Int]                                                                                                                                                              
OptionQueryDistributionNodesSpanSize        | query_distribution_nodes_span              | If set, controls the way sub-query merge behaves: the executing node will introduce an additional level in the query hierarchy for each sub-group of nodes; the size of the sub-group is set by this option. [Int] 
OptionDeferPartialQueryFailures             | deferpartialqueryfailures                  | If true, disables reporting partial query failures as part of the result set. [Boolean]                                                                                                                            
OptionResponseDynamicSerialization          | response_dynamic_serialization             | Controls the serialization of 'dynamic' values in result sets. ['string', 'json']                                                                                                                                  
OptionResultsProgressiveEnabled             | results_progressive_enabled                | If set, enables the progressive query stream                                                                                                                                                                       
OptionProgressiveProgressReportPeriod       | query_results_progressive_update_period    | Hint for Kusto as to how often to send progress frames (Takes effect only if OptionProgressiveQueryIsProgressive is set)                                                                                           
OptionProgressiveQueryMinRowCountPerUpdate  | query_results_progressive_row_count        | Hint for Kusto as to how many records to send in each update (Takes effect only if OptionProgressiveQueryIsProgressive is set)                                                                                     
OptionBlockSplittingEnabled                 | block_splitting_enabled                    | Enables splitting of sequence blocks after aggregation operator. [Boolean]                                                                                                                                         
OptionPushSelectionThroughAggregation       | push_selection_through_aggregation         | If true, push simple selection through aggregation [Boolean]                                                                                                                                                       
OptionAdminSuperSlackerMode                 | query_admin_super_slacker_mode             | If true, delegate execution of the query to another node [Boolean]                                                                                                                                                 
OptionQueryConsistency                      | queryconsistency                           | Controls query consistency. ['strongconsistency' or 'normalconsistency' or 'weakconsistency']                                                                                                                      