---
title: Request classification policy - Azure Data Explorer
description: This article describes the request classification policy in Azure Data Explorer.
services: data-explorer
author: yonileibowitz
ms.author: yonil
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: reference
ms.date: 12/31/2020
---
# Request classification policy (Preview)

The classification process assigns incoming requests to a workload group, based on the characteristics of the requests.

You can tailor the classification logic by writing a user-defined function, as part of a cluster-level request classification policy.

In the absence of an enable request classification policy, all requests are classified into the `default` workload group.

## The policy object

The policy has the following properties:

* `IsEnabled`: `bool` - Indicates if the policy is enabled or not.
* `ClassificationFunction`: `string` - The body of the function to use for classifying requests.

## The classification function

The classification of incoming requests is based on a user-defined function. The results of the function are used to classify requests into existing workload groups.

The user-defined function has the following characteristics and behaviors:

* The user-defined function is evaluated for every new request, if `IsEnabled` is set to `true` in the policy.
* The user-defined function gives workload group context for the request for the full lifetime of the request.
* If the user-defined function returns an empty string, `default`, or the name of non-existent workload group - the request is given the `default` workload group context.
  The request is also given the `default` context if the function fails for any reason.
* Only one user-defined function can be designated at any given time.

### Requirements and limitations

A classification function:

* Must return a single scalar value of type `string`, that is the name of the workload group to assign the request to.
* Must not reference any other entity (database, table, or function).
  * Specifically - it may not use the following functions and operators:
    * `cluster()`
    * `database()`
    * `table()`
    * `external_table()`
    * `externaldata`
* Has access to a special `dynamic` symbol, a property-bag named `request_properties`, with the following properties:

| Name                | Type     | Description                                                                                                                                                                                                                                                               | Example                                                                               |
|---------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| current_database    | `string` | The name of the request database.                                                                                                                                                                                                                                         | `"MyDatabase"`                                                                        |
| current_application | `string` | The name of the application that sent the request.                                                                                                                                                                                                                        | `"Kusto.Explorer"`                                                                    |
| current_principal   | `string` | The fully qualified name of the principal identity that sent the request.                                                                                                                                                                                                 | `"aaduser=1793eb1f-4a18-418c-be4c-728e310c86d3;83af1c0e-8c6d-4f09-b249-c67a2e8fda65"` |
| query_consistency   | `string` | (For queries) The consistency of the query - `strongconsistency` or `weakconsistency`. It can be set by the caller as part of the request's [Client request properties](../api/netfx/request-properties.md): The client request property to set is: `queryconsistency`.   | `"strongconsistency"`                                                                 |
| request_description | `string` | Custom text that the author of the request may include. It can be set by the caller as part of the request's [Client request properties](../api/netfx/request-properties.md): The client request property to set is: `request_description`.                               | `"Some custom description"`                                                           |
| request_text        | `string` | The obfuscated text of the request. Obfuscated string literals included in the query text are replaced by multiple of star (`*`) characters.                                                                                                                              | `".show version"`                                                                     |
| request_type        | `string` | The type of the request - `Command` or `Query`.                                                                                                                                                                                                                           | `"Command"`                                                                           |

### Examples

```kusto
iff(request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query",
    "Ad-hoc queries",
    "default")
```

```kusto
case(current_principal_is_member_of('aadgroup=somesecuritygroup@contoso.com'), "First workload group",
     request_properties.current_database == "MyDatabase" and request_properties.current_principal has 'aadapp=', "Second workload group",
     request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query", "Third workload group",
     request_properties.current_application == "Kusto.Explorer", "Third workload group",
     request_properties.current_application == "KustoQueryRunner", "Fourth workload group",
     request_properties.request_description == "this is a test", "Fifth workload group",
     hourofday(now()) between (17 .. 23), "Sixth workload group",
     "default")
```

## Control commands

A cluster's request classification policy using these [control commands](request-classification-policy-commands.md).
