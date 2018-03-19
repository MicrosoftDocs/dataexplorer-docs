# Joins - Cross Analysis
#### (30 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Advanced query writing](~/learn/tutorials/advanced_query_writing.md) tutorial yet, we recommend that you do so.

So far we've reviewed different analysis on data in different tables, separately. Joins allow us to get records of data from different tables - that are connected to each other.
Put shortly, Join merges the rows of two data sets by matching values of the specified columns.



```OQL
SecurityEvent 
| where EventID == 4624
| project Computer, Account, TargetLogonId, LogonTime=TimeGenerated
| join kind= inner (
    SecurityEvent 
    | where EventID == 4634
    | project TargetLogonId, LogoffTime=TimeGenerated
) on TargetLogonId
| extend Duration = LogoffTime-LogonTime
| project-away TargetLogonId1 
| top 10 by Duration desc
```

<p><img src="~/learn/tutorials/images/joins/sessions_duration.png" alt="Log Analytics session duration"></p>

The first dataset filters for all logon events while the seconds dataset filters for all logout evetns. To gain better performance, the best practice is only to keep the columns which matters, in this case we project the Computer, Account, TargetLogonId and TimeGenerated. We then correlate both datasets by the shared TargetLogonId, to get a single record which has both the logon and logout time.
When the 2 datasets have columns with the same name, the column of the right side would always followed by numbers, to distinguish between them. In our case, we removed the second TargetLogonId1 by using project-away operator.

> [!Note]
> If you want to join two datasets and the joined key is named differently, you can use the following syntax:
```
Table1
| join ( Table2 ) 
on $left.key1 == $right.key2
```

Let's consider this scenario - your site is up and running, but a customer reports getting errors last night, some time after 9 PM.
More specifically, some requests failed with a "500" result code.

We start off with reviewing requests that returned result code 500 last night, after 9 PM:
```AIQL
requests
| where resultCode == 500
| where timestamp > todatetime("2017-03-07 21:00") and timestamp < todatetime("2017-03-07 23:59")
```

That returns 12 different failures. To find out if there was a temporal issue, we organize the data by time, in groups of 30 minutes:
```AIQL
requests
| where resultCode == 500
| where timestamp > todatetime("2017-03-07 21:00") and timestamp < todatetime("2017-03-07 23:59")
| summarize count() by bin(timestamp, 30m) | order by timestamp
```

Seems like something happened between 21:30 and 22:00:
<p><img src="~/learn/tutorials/images/joins/failed_requests_by_time_bin.png" alt="Log Analytics failed requests by time bin"></p> 

We can also check the dependencies that failed during that time:
```AIQL
dependencies
| where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
| where success == "False" 
```
Unfortunately that query returns 72 records of various failures, that might not be related to the same incident.

This is where Join comes in - to get insights on what actually failed these customer's requests, we can check the related dependencies that are related specifically to them.
By reviewing the schema, we see there are several pieces of data both tables hold, such as timestamp, session id, and operation id. 
The data shows that operation id holds a unique value for each record, so let's use it to correlate records from both tables:

```AIQL
requests
| where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
| where resultCode == 500 and success == "False"
| join (
    dependencies
    | where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
    | where success == "False" 
) on operation_Id
| project type, url, user_Id  
```

we can see now there was something wrong with the SQL dependency, and that several users were affected by it:
<p><img src="~/learn/tutorials/images/joins/failed_requests_join_dependecies.png" alt="Log Analytics failed requests join dependencies"></p> 

To learn exactly what, let's join on the exceptions table as well:
```AIQL
requests
| where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
| where resultCode == 500 and success == "False"
| join (
    dependencies
    | where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
    | where success == "False" 
) on operation_Id
    | join (
        exceptions
        | where timestamp > todatetime("2017-03-07 21:30") and timestamp < todatetime("2017-03-07 22:00")
    ) on operation_Id | project type, url, innermostMessage, user_Id 
```

Now we can see the exact message:
"The INSERT statement conflicted with the CHECK constraint "chk_read_only". The conflict occurred in database "FabrikamlSQL", table "dbo.Customers". The statement has been terminated."
We can get back to our customer with an answer - someone tried to insert records into the Customers table, but did not have permissions to do so.
We can also take into account that the same thing happened to several users, so it could suggest a problem occurred with the database, or someone tried to hack it.

## Lookup Tables
A common use-case is using static mapping of values that can help in transforming the results into more presentable way.
For example, if we want to enrich the security event data with the event name for each event id.
```OQL
let DimTable = datatable(EventID:int, eventName:string)
  [
    4658, "The handle to an object was closed",
    4656, "A handle to an object was requested",
    4690, "An attempt was made to duplicate a handle to an object",
    4663, "An attempt was made to access an object",
    5061, "Cryptographic operation",
    5058, "Key file operation"
  ];
SecurityEvent
| join kind = inner
 DimTable on EventID
| summarize count() by eventName
```
<p><img src="~/learn/tutorials/images/joins/dim_table.png" alt="Log Analytics lookup tables"></p>

## Join kinds
Join has different modes of work, selected through the "kind" argument. Each mode of work performs a different match between the records of the given tables.
To understand the differences, let's see them in action.
For the following examples, we define two queries that return related result sets - *selected_exceptions* and *selected_requests*:

```AIQL
let selected_exceptions = 
exceptions 
| where startofday(timestamp) == datetime("2017-03-04") 
| summarize by client_IP, type;

let selected_requests =
requests 
| where startofday(timestamp) == datetime("2017-03-04") 
| summarize avg_dur=avg(duration) by client_IP;
```

### innerunique
This is the default join mechanism.
First the values of the matched column in the first (left) table are found, and duplicate values are removed. Only then the set of unique values is matched against the second (right) table.
In the given example, the list of exceptions' initially contains 2 records with client IP "167.220.1.0", but only one of the records is used for matching.

Example:
```AIQL
// innerunique - returns 14 results
selected_exceptions 
| join (selected_requests) on client_IP 
| project client_IP, type, avg_dur
```

### inner
Inner join matches records from both tables without removing duplicate records.
In the given example, the list of exceptions' contains 2 records with client IP "167.220.1.0", and both are used for the matching, generating matches.

Example:
```AIQL
// inner - returns 16 results
selected_exceptions 
| join kind=inner (selected_requests) on client_IP 
| project client_IP, type, avg_dur
```

### leftouter
In addition to the inner matches, the results include a record for every record on the left table, even if it has no match. In that case, the unmatched output cells contain nulls.
In the given example, 3 records on the left ("exceptions") table don't have a match on the right ("requests") table, and therefore have an empty "avg_dur" column. 

Example:
```AIQL
// leftouter - returns 19 results
selected_exceptions 
| join kind=leftouter (selected_requests) on client_IP 
| project client_IP, type, avg_dur
```

### leftanti
Returns all the records from the left side that do not have matches from the right. The results table has only columns from the left table.
In the given example, 3 records on the left ("exceptions") table don't have a match on the right ("requests") table.

Example:
```AIQL
// leftanti - returns 3 results
selected_exceptions 
| join kind=leftanti (selected_requests) on client_IP 
| project client_IP, type
```

### leftsemi
Returns rows from the left table that have a match in the right table. The results table has only the columns from the left table (basically an inner join, without columns from the right table).

Example:
```AIQL
// leftsemi - returns 16 results
selected_exceptions 
| join kind=leftsemi (selected_requests) on client_IP 
| project client_IP, type
```

Tip: 
For best performance:
* Use a time filter on each table.
* Use *"where"* and *"project"* to reduce the numbers of rows and columns in the input tables, before the join.
* If one table is always smaller than the other, use it as the left side of the join.
* The columns for the join match must have the same name. Use the *"project"* operator if necessary to rename a column in one of the tables.

## Next steps
Continue with our [smart analytics tutorials]
* [Identifying data patterns](~/learn/tutorials/smart analytics/autocluster.md)