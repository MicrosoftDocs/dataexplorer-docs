# fork operator

Runs multiple consumer operators in parallel.

**Syntax**

*T* `|` `fork` [*name*`=`]`(`*subquery*`)` [*name*`=`]`(`*subquery*`)` ...

**Arguments**

* *subquery* is a downstream pipeline of query operators
* *name* is a temporary name for the subquery result table

**Returns**

Multiple result tables, one for each of the subqueries.

**Supported Operators**

[`as`](query_language_asoperator.md), [`count`](query_language_countoperator.md), [`extend`](query_language_extendoperator.md), [`parse`](query_language_parseoperator.md), [`where`](query_language_whereoperator.md), [`take`](query_language_takeoperator.md), [`project`](query_language_projectoperator.md), [`project-away`](query_language_projectawayoperator.md), [`summarize`](query_language_summarizeoperator.md), [`top`](query_language_topoperator.md), [`top-nested`](query_language_topnestedoperator.md), [`sort`](query_language_sortoperator.md), [`mvexpand`](query_language_mvexpandoperator.md), [`reduce`](query_language_reduceoperator.md)

**Notes**

* [`materialize`](query_language_materializefunction.md) function can be used as a replacement for using [`join`](query_language_joinoperator.md) or [`union`](query_language_unionoperator.md) on fork legs.
The input stream will be cached by materialize and then the cached expression can be used in join/union legs.



* Avoid using 'fork' with a single subquery.

**Examples**

<!-- csl -->
```
AzureLogs
| where Timestamp > ago(1h)
| fork
    ( where Level == "Error" | project EventText | limit 100 )
    ( project Timestamp, EventText | top 1000 by Timestamp desc)
    ( summarize min(Timestamp), max(Timestamp) by ActivityID )
 
// In the following examples the result tables will be named: Errors, EventsTexts and TimeRangePerActivityID
AzureLogs
| where Timestamp > ago(1h)
| fork
    ( where Level == "Error" | project EventText | limit 100 | as Errors )
    ( project Timestamp, EventText | top 1000 by Timestamp desc | as EventsTexts )
    ( summarize min(Timestamp), max(Timestamp) by ActivityID | as TimeRangePerActivityID )
    
 AzureLogs
| where Timestamp > ago(1h)
| fork
    Errors = ( where Level == "Error" | project EventText | limit 100 )
    EventsTexts = ( project Timestamp, EventText | top 1000 by Timestamp desc )
    TimeRangePerActivityID = ( summarize min(Timestamp), max(Timestamp) by ActivityID )
```


