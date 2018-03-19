# Advanced Aggregations
#### (15 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Aggregation functions](~/learn/tutorials/aggregations.md) tutorial yet, we recommend that you do so.

In this tutorial, we will explore some of the more advanced agreggation options available to you.

## Generating lists and sets
Imagine that we want to explore the most common order events take place on machines we're tracking. We'll need to essentially pivot our data by the order of EventIDs on each machine.
We can use makelist to achieve this:
```OQL
Event
| where TimeGenerated > ago(12h)
| order by TimeGenerated desc
| summarize makelist(EventID) by Computer
```
|Computer|list_EventID|
|---|---|
| computer1 | [704,701,1501,1500,1085,704,704,701] |
| computer2 | [326,105,302,301,300,102] |
| ... | ... |
Note that makelist generates a list in the order that data was passed into it. If we want events from oldest to newest, we would use *asc* in the order statement instead of *desc*.<br/>
Sometimes it is also useful to create a list of just distinct values. This is called a *Set*, and can be generated with *makeset*:

```OQL
Event
| where TimeGenerated > ago(12h)
| order by TimeGenerated desc
| summarize makeset(EventID) by Computer
```
|Computer|list_EventID|
|---|---|
| computer1 | [704,701,1501,1500,1085] |
| computer2 | [326,105,302,301,300,102] |
| ... | ... |
Like *makelist*, *makeset* also works with ordered data, and will generate the arrays based on the order of the rows that are passed into it.

## Expanding lists
The inverse operation of *makelist* or *makeset* is *mvexpand* ("multivariable expand"), which expands a list of values to separate rows.
It can expand across any number of dynamic columns, both JSON and array. 
For example, the *Heartbeat* table which solutions are found on "live" computers (that sent a heartbeat in the last hour)
```OQL
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, Solutions
```
| Computer | Solutions | 
|--------------|----------------------|
| computer1 | "security", "updates", "changeTracking" |
| computer2 | "security", "updates" |
| computer3 | "antiMalware", "changeTracking" |
| ... | ... | ... |

As you see, the solutions are displayed as a comma-separated list. We could therefore use *mvexpand* to show each value in a separate row:
```OQL
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, split(Solutions, ",")
| mvexpand Solutions
```
| Computer | Solutions | 
|--------------|----------------------|
| computer1 | "security" |
| computer1 | "updates" |
| computer1 | "changeTracking" |
| computer2 | "security" |
| computer2 | "updates" |
| computer3 | "antiMalware" |
| computer3 | "changeTracking" |
| ... | ... | ... |


If interesting, we can now use *makelist* to again group items together, and this time see the list of computers per solution:
```OQL
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, split(Solutions, ",")
| mvexpand Solutions
| summarize makelist(Computer) by tostring(Solutions) 
```
|Solutions | list_Computer |
|--------------|----------------------|
| "security" | ["computer1", "computer2"] |
| "updates" | ["computer1", "computer2"] |
| "changeTracking" | ["computer1", "computer3"] |
| "antiMalware" | ["computer3"] |
| ... | ... |

## Handling missing bins
A very useful application of *mvexpand* is the need to fill default values in for missing bins.
For example, imagine we're looking for the uptime of a particular machine through exploring its heartbeat. We also want to see the source of the heartbeat (the "category" column).
Normally, we would use a simple summarize statement as follows:
```OQL
Heartbeat
| where TimeGenerated > ago(12h)
| summarize count() by Category, bin(TimeGenerated, 1h)
```
| Category | TimeGenerated | count_ |
|--------------|----------------------|--------|
| Direct Agent | 2017-06-06T17:00:00Z | 15 |
| Direct Agent | 2017-06-06T18:00:00Z | 60 |
| Direct Agent | 2017-06-06T20:00:00Z | 55 |
| Direct Agent | 2017-06-06T21:00:00Z | 57 |
| Direct Agent | 2017-06-06T22:00:00Z | 60 |
| ... | ... | ... |

However, notice that the bucket associated with "2017-06-06T19:00:00Z" is missing! This is because we don't have any heartbeat data for that hour.
To assign a default value to empty buckets, we can use the make-series function. 
Make series will generate a row for each category, with two extra array columns - one for values, and one for matching time buckets:
```OQL
Heartbeat
| make-series count() default=0 on TimeGenerated in range(ago(1d), now(), 1h) by Category 
```
| Category | count_ | TimeGenerated |
|---|---|---|
| Direct Agent | [15,60,0,55,60,57,60,...] | ["2017-06-06T17:00:00.0000000Z","2017-06-06T18:00:00.0000000Z","2017-06-06T19:00:00.0000000Z","2017-06-06T20:00:00.0000000Z","2017-06-06T21:00:00.0000000Z",...] |
| ... | ... | ... |
Great! Notice that the third element of the *'count_'* array is indeed a 0 and we have a matching timestamp of "2017-06-06T19:00:00.0000000Z" in our TimeGenerated array. However, this array format is difficult to read and will not work for Power BI visualizations or a chart generated in Excel. Therefore, we want to expand the arrays to produce the same format output as that generated by "summarize". For this, we will use mvexpand:
```OQL
Heartbeat
| make-series count() default=0 on TimeGenerated in range(ago(1d), now(), 1h) by Category 
| mvexpand TimeGenerated, count_
| project Category, TimeGenerated, count_
```
| Category | TimeGenerated | count_ |
|--------------|----------------------|--------|
| Direct Agent | 2017-06-06T17:00:00Z | 15 |
| Direct Agent | 2017-06-06T18:00:00Z | 60 |
| Direct Agent | 2017-06-06T19:00:00Z | 0 |
| Direct Agent | 2017-06-06T20:00:00Z | 55 |
| Direct Agent | 2017-06-06T21:00:00Z | 57 |
| Direct Agent | 2017-06-06T22:00:00Z | 60 |
| ... | ... | ... |
Exactly what we wanted!

*mvexpand* is also very useful for unpacking JSON or array structures that get generated as part of custom logs, custom events, or open schema.

## Narrowing results to a set of elements: let, makeset, toscalar, in
A very common challenge is to select the names of some specific entities based on a set of criteria (for example: computers that are known to have missing updates) 
and then filter a different data set down to that set of entities (for example: find IPs that these computers called out to, to ensure that no malicious calls were made).
For this type of query, we use the following pattern. For the example described here, we can use the following query:
```OQL
let ComputersNeedingUpdate = toscalar(
    Update
    | summarize makeset(Computer)
    | project set_Computer
);
WindowsFirewall
| where Computer in (ComputersNeedingUpdate)
```

## Next steps
Continue with our advanced tutorials:
* [Charts and diagrams](~/learn/tutorials/charts.md)
* [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md)
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)