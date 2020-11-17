---
title: Splunk to Kusto log query language in Azure Monitor
description: Help for users who are familiar with Splunk in learning Kusto log queries.
ms.service: data-explorer
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/21/2018

---

# Splunk to Kusto query language

This article is intended to assist users who are familiar with Splunk to learn the Kusto query language to write log queries in Kusto. Direct comparisons are made between the two to understand key differences and also similarities where you can leverage your existing knowledge.

## Structure and concepts

The following table compares concepts and data structures between Splunk and Kusto logs.

 | Concept | Splunk | Kusto |  Comment |
 |:---|:---|:---|:---|
 | Deployment unit  | cluster |  cluster |  Kusto allows arbitrary cross cluster queries. Splunk does not. |
 | Data caches |  buckets  |  Caching and retention policies |  Controls the period and caching level for the data. This setting directly impacts the performance of queries and cost of the deployment. |
 | Logical partition of data  |  index  |  database  |  Allows logical separation of the data. Both implementations allow unions and joining across these partitions. |
 | Structured event metadata | N/A | table |  Splunk does not have the concept exposed to the search language of event metadata. Kusto logs has the concept of a table, which has columns. Each event instance is mapped to a row. |
 | Data record | event | row |  Terminology change only. |
 | Data record attribute | field |  column |  In Kusto, this is predefined as part of the table structure. In Splunk, each event has its own set of fields. |
 | Types | datatype |  datatype |  Kusto datatypes are more explicit as they are set on the columns. Both have the ability to work dynamically with data types  and roughly equivalent set of datatypes including JSON support. |
 | Query and search  | search | query |  Concepts are essentially the same between both Kusto and Splunk. |
 | Event ingestion time | System Time | ingestion_time() |  In Splunk, each event gets a system timestamp of the time that the event was indexed. In Kusto, you can define a policy called ingestion_time that exposes a system column that can be referenced through the ingestion_time() function. |

## Functions

The following table specifies functions in Kusto that are equivalent to Splunk functions.

|Splunk | Kusto |Comment
|:---|:---|:---
| `strcat` | `strcat()` | (1) |
| `split`  | `split()` | (1) |
| `if`     | `iff()`   | (1) |
| `tonumber` | `todouble()`<br>`tolong()`<br>`toint()` | (1) |
| `upper`<br>`lower` |toupper()<br>`tolower()`|(1) |
| `replace` | `replace()` | (1)<br> Also note that while `replace()` takes three parameters in both products, the parameters are different. |
| `substr` | `substring()` | (1)<br>Also note that Splunk uses one-based indices. Kusto notes zero-based indices. |
| `tolower` |  `tolower()` | (1) |
| `toupper` | `toupper()` | (1) |
| `match` | `matches regex` |  (2)  |
| `regex` | `matches regex` | In Splunk, `regex` is an operator. In Kusto, it's a relational operator. |
| `searchmatch` | == | In Splunk, `searchmatch` allows searching for the exact string.
| `random` | rand()<br>rand(n) | Splunk's function returns a number from zero to 2<sup>31</sup>-1. Kusto' returns a number between 0.0 and 1.0, or if a parameter provided, between 0 and n-1.
| `now` | `now()` | (1)
| `relative_time` | `totimespan()` | (1)<br>In Kusto, Splunk's equivalent of relative_time(datetimeVal, offsetVal) is datetimeVal + totimespan(offsetVal).<br>For example, <code>search &#124; eval n=relative_time(now(), "-1d@d")</code> becomes <code>...  &#124; extend myTime = now() - totimespan("1d")</code>.

(1) In Splunk, the function is invoked with the `eval` operator. In Kusto, it is used as part of `extend` or `project`.<br>(2) In Splunk, the function is invoked with the `eval` operator. In Kusto, it can be used with the `where` operator.


## Operators

The following sections give examples of using different operators between Splunk and Kusto.

> [!NOTE]
> For the purpose of the following example, the Splunk field _rule_ maps to a table in Kusto, and Splunk's default timestamp maps to the Logs Analytics _ingestion_time()_ column.

### Search
In Splunk, you can omit the `search` keyword and specify an unquoted string. In Kusto you must start each query with `find`, an unquoted string is a column name, and the lookup value must be a quoted string. 

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `search` | <code>search Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" earliest=-24h</code> |
| Kusto | `find` | <code>find Session.Id=="c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion_time()> ago(24h)</code> |


### Filter
Kusto log queries start from a tabular result set where the filter. In Splunk, filtering is the default operation on the current index. You can also use `where` operator in Splunk, but it is not recommended.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `search` | <code>Event.Rule="330009.2" Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" _indextime>-24h</code> |
| Kusto | `where` | <code>Office_Hub_OHubBGTaskError<br>&#124; where Session_Id == "c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion_time() > ago(24h)</code> |

### Getting n events/rows for inspection 
Kusto log queries also support `take` as an alias to `limit`. In Splunk, if the results are ordered, `head` will return the first n results. In Kusto, limit is not ordered but returns the first n rows that are found.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `head` | <code>Event.Rule=330009.2<br>&#124; head 100</code> |
| Kusto | `limit` | <code>Office_Hub_OHubBGTaskError<br>&#124; limit 100</code> |

### Getting the first n events/rows ordered by a field/column
For bottom results, in Splunk you use `tail`. In Kusto you can specify the ordering direction with `asc`.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `head` |  <code>Event.Rule="330009.2"<br>&#124; sort Event.Sequence<br>&#124; head 20</code> |
| Kusto | `top` | <code>Office_Hub_OHubBGTaskError<br>&#124; top 20 by Event_Sequence</code> |

### Extending the result set with new fields/columns
Splunk also has an `eval` function, which is not to be comparable with the `eval` operator. Both the `eval` operator in Splunk and the `extend` operator in Kusto only support scalar functions and arithmetic operators.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `eval` |  <code>Event.Rule=330009.2<br>&#124; eval state= if(Data.Exception = "0", "success", "error")</code> |
| Kusto | `extend` | <code>Office_Hub_OHubBGTaskError<br>&#124; extend state = iif(Data_Exception == 0,"success" ,"error")</code> |

### Rename 
Kusto uses the `project-rename` operator to rename a field. `project-rename` allows the query to take advantage of any indexes pre-built for a field. Splunk has a `rename` operator to do the same.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `rename` |  <code>Event.Rule=330009.2<br>&#124; rename Date.Exception as execption</code> |
| Kusto | `project-rename` | <code>Office_Hub_OHubBGTaskError<br>&#124; project-rename exception = Date_Exception</code> |

### Format results/Projection
Splunk does not seem to have an operator similar to `project-away`. You can use the UI to filter away fields.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `table` |  <code>Event.Rule=330009.2<br>&#124; table rule, state</code> |
| Kusto | `project`<br>`project-away` | <code>Office_Hub_OHubBGTaskError<br>&#124; project exception, state</code> |

### Aggregation
See the [List of aggregations functions](summarizeoperator.md#list-of-aggregation-functions) for the different aggregation functions.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `stats` |  <code>search (Rule=120502.*)<br>&#124; stats count by OSEnv, Audience</code> |
| Kusto | `summarize` | <code>Office_Hub_OHubBGTaskError<br>&#124; summarize count() by App_Platform, Release_Audience</code> |


### Join
Join in Splunk has significant limitations. The subquery has a limit of 10000 results (set in the deployment configuration file), and there a limited number of join flavors.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `join` |  <code>Event.Rule=120103* &#124; stats by Client.Id, Data.Alias \| join Client.Id max=0 [search earliest=-24h Event.Rule="150310.0" Data.Hresult=-2147221040]</code> |
| Kusto | `join` | <code>cluster("OAriaPPT").database("Office PowerPoint").Office_PowerPoint_PPT_Exceptions<br>&#124; where  Data_Hresult== -2147221040<br>&#124; join kind = inner (Office_System_SystemHealthMetadata<br>&#124; summarize by Client_Id, Data_Alias)on Client_Id</code>   |

### Sort
In Splunk, to sort in ascending order you must use the `reverse` operator. Kusto also supports defining where to put nulls, at the beginning or at the end.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `sort` |  <code>Event.Rule=120103<br>&#124; sort Data.Hresult<br>&#124; reverse</code> |
| Kusto | `order by` | <code>Office_Hub_OHubBGTaskError<br>&#124; order by Data_Hresult,  desc</code> |

### Multivalue expand
This is a similar operator in both Splunk and Kusto.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `mvexpand` |  `mvexpand foo` |
| Kusto | `mvexpand` | `mvexpand foo` |

### Results facets, interesting fields
In Log Analytics in the Azure portal, only the first column is exposed. All columns are available through the API.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `fields` |  <code>Event.Rule=330009.2<br>&#124; fields App.Version, App.Platform</code> |
| Kusto | `facets` | <code>Office_Excel_BI_PivotTableCreate<br>&#124; facet by App_Branch, App_Version</code> |

### De-duplicate
You can use `summarize arg_min()` instead to reverse the order of which record gets chosen.

| Product | Operator | Example |
|:---|:---|:---|
| Splunk | `dedup` |  <code>Event.Rule=330009.2<br>&#124; dedup device_id sortby -batterylife</code> |
| Kusto | `summarize arg_max()` | <code>Office_Excel_BI_PivotTableCreate<br>&#124; summarize arg_max(batterylife, *) by device_id</code> |

## Next steps

- Walk through a tutorial on [Kusto query language](tutorial.md?pivots=azuremonitor).
