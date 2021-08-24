---
title: pattern statement - Azure Data Explorer
description: This article describes pattern statement in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---

# Pattern statement

::: zone pivot="azuredataexplorer"

A `pattern` is a construct used to query and define data based on a set of string parameters. Patterns can contain a set of argument values that Azure Data Explorer maps. If a pattern is declared but is empty, Azure Data Explorer identifies and flags any subsequent pattern invocation as an error. 

The pattern statement can be used with middle-tier applications that accept user queries, and then send these queries to Azure Data Explorer. Such applications often prefix such user queries with a logical schema model. The model is a set of [let statements](letstatement.md), possibly suffixed by a [restrict statement](restrictstatement.md). 

Applications may use references that are defined in a logical schema constructed by the application, for example, a table of IP addresses associated with latitude and longitude. However, the number of potential entities might be too large to be predefined in the logical schema, or the references are not known ahead of time, for example. When an application sends a query, the application might not have enough information to construct the full definition. Pattern statements solve this problem. 

The middle-tier application can send a query to Azure Data Explorer with a relevant pattern declared, but not defined with the exact information. When Azure Data Explorer then parses the query, if the pattern was invoked, Azure Data Explorer returns an error to the middle-tier application addressing any invocation. The middle-tier application can then resolve each of the references and rerun the query, prefixing it with the full pattern definition.

## Syntax

`declare` `pattern` *PatternName* = `(`*ArgName* `:` *ArgType* [`,` ... ]`)` [`[` *PathName* `:` *PathArgType* `]`]

`{`

&nbsp;&nbsp;&nbsp;&nbsp; `(` *ArgValue1* [`,` *ArgValue2* ... ] `)` [ `.[` *PathValue `]` ] `=` `{`  *expression*  `}``;`

&nbsp;&nbsp;&nbsp;&nbsp; [ `(` *ArgValue3* [`,` *ArgValue4* ... ] `)` [ `.[` *PathValue5* `]` ] `=` `{`  *expression6*  `}``;` ...
&nbsp;&nbsp;&nbsp;&nbsp; ]

`}`

The syntax for invoking a pattern is as follows:

* *PatternName* `(` *ArgValue1* [`,` *ArgValue2* ...] `).`*PathValue*
* *PatternName* `(` *ArgValue1* [`,` *ArgValue2* ...] `).["`*PathValue*`"]`

## Arguments

* *PatternName*: Name of pattern. Use the pattern syntax for all pattern references associated with the keyword.
* *ArgName*: Name of argument. Patterns can have one or more arguments.
* *ArgType*: Type of argument, `string`.
* *PathName*: Name of a path argument. Patterns can have no path or one path.
* *PathArgType*: Type of the path argument, `string`.
* *ArgValue*: Value of an argument, a `string` literal.
* *PathValue*: Value of the path, of type `string`.
* *expression*: A tabular expression (for example, `Logs | where Timestamp > ago(1h)`),
  or a lambda expression that references a function.

## Examples

### Defining simple patterns

In each of the following examples, a pattern is defined and then used:

```kusto
declare pattern country = (name:string)[state:string]
{
  ("USA").["New York"] = { print Capital = "New York City" };
  ("USA").["Washington"] = { print Capital = "Seattle" };
  ("Canada").["Alberta"] = { print Capital = "Edmonton" };
};
country("Canada").Alberta
```

|Capital|
|-------|
|Edmonton|

```kusto
declare pattern App = (applicationId:string)[scope:string]  
{
    ('a1').['Data']    = { range x from 1 to 5 step 1 | project App = "App #1", Data    = x };
    ('a1').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #1", Metrics = rand() };
    ('a2').['Data']    = { range x from 1 to 5 step 1 | project App = "App #2", Data    = 10 - x };
    ('a3').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #3", Metrics = rand() };
};
union (App('a2').Data), (App('a1').Metrics)
```

|App|Data|Metrics|
|---|----|-------|
|App #2|9| |
|App #2|8| |
|App #2|7| |
|App #2|6| |
||App #2|5| |
|App #1| |0.53674122855537532|
|App #1| |0.78304713305654439|
|App #1| |0.20168860732346555|
|App #1| |0.13249123867679469|
|App #1| |0.19388305330563443|

### Normalization

Azure Data Explorer accepts variations of syntax as the same for pattern invocation. For example, the following are all invocations of the same pattern. This means that you can't define them together, since they are considered to be the same, so this definition produces an error.

```kusto
declare pattern app;
union
  app("ApplicationX").StartEvent,
  app('ApplicationX').StartEvent,
  app("ApplicationX").['StartEvent'],
  app("ApplicationX").["StartEvent"]
```

Error 

 One or more pattern references were not declared. Detected pattern references: ["app('ApplicationX').['StartEvent']"]

### No wildcards

Azure Data Explorer does not count wildcards in a pattern. For example, in the following query, Azure Data Explorer will report an error.

```kusto
declare pattern App = (applicationId:string)[scope:string]  
{
    ('a1').['Data']    = { range x from 1 to 5 step 1 | project App = "App #1", Data    = x };
    ('a1').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #1", Metrics = rand() };
    ('a2').['Data']    = { range x from 1 to 5 step 1 | project App = "App #2", Data    = 10 - x };
    ('a3').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #3", Metrics = rand() };
};
union (App('a2').'*'), (App('a1').'*')
```

Syntax Error 

 A recognition error occurred. 
 Token: '*' 

### Working with middle-tier applications

In the following example, a middle-tier application uses an internal service to map IP addresses to longitude/latitude locations. The middle-tier app declares a pattern called `map_ip_to_longlat`. Suppose it gets the following query from the user:

`map_ip_to_longlat` `(`"10.10.10.10"`)`

The middle-tier application does not parse this query to determine the IP address that was requested (`10.10.10.10`). But it also cannot send Azure Data Explorer its entire database of IP addresses. So it sends Azure Data Explorer the user query, pre-pended with an empty pattern declaration:

```kusto
declare pattern map_ip_to_longlat;
map_ip_to_longlat("10.10.10.10")
```

Error 

 One or more pattern references were not declared. Detected pattern references: ["map_ip_to_longlat('10.10.10.10')"]

The middle-tier application can then inspect the error, determine that the error indicates a missing pattern reference, and retrieve the missing IP address from the error `map_ip_to_longlat('10.10.10.10')`. 

The middle-tier application can then look up this IP address and re-run the query, this time providing the pattern references as part of the pattern declaration, so that Azure Data Explorer is provided the exact value of the latitude and longitude:

```kusto
declare pattern map_ip_to_longlat = (address:string)
{
  ("10.10.10.10") = { print Lat=37.405992, Long=-122.078515 }
};
map_ip_to_longlat("10.10.10.10")
```

|Lat|Long|
|---|---|
|37.405992|-122.078515|

::: zone-end

::: zone pivot="azuremonitor"

Not supported in Azure Monitor.

::: zone-end
