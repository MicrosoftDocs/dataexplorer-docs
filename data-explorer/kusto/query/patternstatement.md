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

A `pattern` is a construct used to define data based on string tuples. Patterns are defined with a set of close-ended argument values that are mapped by Azure Data Explorer. Patterns can be used to map tuples to parameterless functions. After patterns are declared and defined, they can be invoked.

If a pattern is not defined, Azure Data Explorer will flag pattern invocations and return error details with HTTP header data. Identifying the pattern and the invocation error makes it possible for middle-tier applications to look up related data and then define these patterns. Middle-tier applications that offer functions to support user Azure Data Explorer queries can use a pattern statement as part of a process to enrich Azure Data Explorer query results with further data.

## Syntax

The syntax for declaring a pattern is as follows:

`declare` `pattern` *PatternName*

The syntax for declaring and defining a pattern is as follows:

`declare` `pattern` *PatternName* = `(`*ArgName* `:` *ArgType* [`,` ... ]`)` [`[` *PathName* `:` *PathArgType* `]`]

`{`

&nbsp;&nbsp;&nbsp;&nbsp; `(` *ArgValue1* [`,` *ArgValue2* ... ] `)` [ `.[` *PathValue `]` ] `=` `{`  *expression*  `}` `;`

&nbsp;&nbsp;&nbsp;&nbsp; [ `(` *ArgValue3* [`,` *ArgValue4* ... ] `)` [ `.[` *PathValue5* `]` ] `=` `{`  *expression6*  `}` `;` ...
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
|App #2|5| |
|App #1| |0.53674122855537532|
|App #1| |0.78304713305654439|
|App #1| |0.20168860732346555|
|App #1| |0.13249123867679469|
|App #1| |0.19388305330563443|

### Normalization

Azure Data Explorer allows variations of syntax when invoking patterns. For example, the following all invoke the same pattern. You can't create a union of these invocations, since they are all the same. 

```kusto
declare pattern app;
union
  app("ApplicationX").StartEvent,
  app('ApplicationX').StartEvent,
  app("ApplicationX").['StartEvent'],
  app("ApplicationX").["StartEvent"]
```

The following error is returned:  
`One or more pattern references were not declared. Detected pattern references: ["app('ApplicationX').['StartEvent']"]`

### No wildcards

Azure Data Explorer does not count wildcards in a pattern. For example, the following query would create an error.

```kusto
declare pattern App = (applicationId:string)[scope:string]  
{
    ('a1').['Data']    = { range x from 1 to 5 step 1 | project App = "App #1", Data    = x };
    ('a1').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #1", Metrics = rand() };
    ('a2').['Data']    = { range x from 1 to 5 step 1 | project App = "App #2", Data    = 10 - x };
    ('a3').['Metrics'] = { range x from 1 to 5 step 1 | project App = "App #3", Metrics = rand() };
};
union (App('a2').['*']), (App('a1').['*'])
```

The following error is returned:
`One or more pattern references were not declared. Detected pattern references: ["App('a2').['*']","App('a1').['*']"]`

## Working with middle-tier applications

Middle-tier applications can use a pattern statement as part of a process to enrich Azure Data Explorer query results with further data. When a user creates a query with a middle-tier application, the application does not parse Azure Data Explorer queries itself. Instead it usually passes the queries from users to Azure Data Explorer as a pattern.

The application might prefix user queries with a logical schema model. The model is a set of [let statements](letstatement.md), that might be suffixed by a [restrict statement](restrictstatement.md). Applications can add references that are defined in the schema. But there may be too much lookup information to be predefined in a logical schema, or the references might not be known in advance, as the application does not parse the user's query. For similar reasons, a middle-tier application can send the query to Azure Data Explorer with a pattern declared, but not defined. 

Azure Data Explorer checks the pattern statement, but since no pattern was defined, replies with error information. The application can then look up the missing data and rerun the query with the full pattern definition. The application can also enrich the data results with its own lookup data.

### Example of working with middle-tier application

In the following example, a middle-tier application provides the ability to enrich Azure Data Explorer queries with longitude/latitude locations. The application uses an internal service to map IP addresses to longitude/latitude locations, and provides a function called `map_ip_to_longlat` for this purpose. Let's suppose the application gets the following query from the user:

`map_ip_to_longlat` `(`"10.10.10.10"`)`

The application does not parse this query so it does not know which IP address was requested (`10.10.10.10`). But it also cannot send Azure Data Explorer its entire database of IP addresses. So it sends Azure Data Explorer the user query, pre-pended with an empty pattern declaration:

```kusto
declare pattern map_ip_to_longlat;
map_ip_to_longlat("10.10.10.10")
```

The following error is produced: 
`One or more pattern references were not declared. Detected pattern references: ["map_ip_to_longlat('10.10.10.10')"]`

The application inspects the error, determines that the error indicates a missing pattern reference, and retrieves the missing IP address from the error `('10.10.10.10')`.

The application can then look up this IP address and re-run the query, this time providing the pattern references as part of the pattern declaration, so that Azure Data Explorer is provided the exact value of the latitude and longitude:

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
