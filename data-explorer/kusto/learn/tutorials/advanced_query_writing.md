# Advanced Query Writing
#### (10 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md) tutorial yet, we recommend that you do so.

## Let: reusing code
Use *"let"* to assign results to a variable, and refer to it later in your queries:
```AIQL
// get all requests that have result code 500 or higher
let bad_requests =
  requests
  | where toint(resultCode) >= 500;
// join the above requests on exceptions by session_Id
bad_requests
| summarize count() by resultCode
```

You can also assign constant values to variables. This is a great way to operationalize your queries: set up parameters for those fields that you need to change every time you execute the query, and then for your investigations, simply modify those parameters. For example, imagine that our customers are reporting issues around not being able to access a certain page due to a page unavailable (404) issue. We can set our query up as follows:
```AIQL
let startDate = datetime(2017-06-01T12:55:02);
let endDate = datetime(2017-06-02T15:21:35);
let issueResultCode = 404;
requests
| where timestamp between(startDate .. endDate)
| where resultCode == issueResultCodewe can 
```
Now, if our users report that they're seeing 403 issues instead of 404 over a different timeframe, you'll simply need to modify those parameters in the let statements. This prevents having to rewrite queries and troubleshooting anything that went wrong with them under the stressful times that investigations normally constitute.

### Using parameters
Let statements can also take input parameters, effectively providing you a way to write your own reusable functions. Use *"Let"* to define a function as follows:
```AIQL
let usdate = (t:datetime)
{
  strcat(getmonth(t), "/", dayofmonth(t),"/", getyear(t), " ",
  bin((t-1h)%12h+1h,1s), iff(t%24h<12h, "AM", "PM"))
};
requests  
| extend PST = usdate(timestamp-8h)
```

## Functions
Functions are queries that can also be referenced by other queries. The name by which a function can be referenced is called the "function alias".
For example, the following standard query returns all missing security updates reported in the last day:
```OQL
Update
| where TimeGenerated > ago(1d) 
| where Classification == "Security Updates" 
| where UpdateState == "Needed"
```

The above query can be saved as a function and given the alias "security_updates_last_day". Then, it can be used in another query to search for SQL-related needed security updates:
```OQL
security_updates_last_day | where Title contains "SQL"
```

> [!Note]
> The function alias is a unique name which must match this regex: ^[A-Za-z_]+[A-Za-z_0-9]*$ meaning it should:
> 1. Start with a letter or an underscore
> 2. Can continue with letters, digits, or underscores


## Prototyping
Sometimes, rather than working with real production data, we simply need to use the engine to calculate something based on constant values or provide completely custom data inline. For this, two methods are available: print and datatable.

### Print
When we simply need to display a constant value or use one in our calculations, we can use the print statement. This will behind the scenes create a table with a single column and a single row, the value you provided being the result. For example, if I wanted to find the current time in PST, I could run:
```AIQL
print nowPst = now()-8h
```
|nowPst|
|---|
|2017-06-02T15:15:46.3418323Z|

I can continue writing my query. For example, if based on the current time in PST, I also wanted to find out the current time in EST (PST+3), I could use:
```AIQL
print nowPst = now()-8h
| extend nowEst = nowPst+3h
```

### Datatable
Other times, instead of a scalar value, it's useful to start with a table. For this, we can use the datatable method. We'll provide it a schema and then the values for the table listed from left to right and for as many rows as we want. We can then proceed with piping the table into any other query elements. For example to create a table of RAM usage and show only the maximum value:
```AIQL
datatable (timestamp: datetime, usagePct: double)
[
  "2017-06-02T15:15:46.3418323Z", 15.5,
  "2017-06-02T15:17:43.1561235Z", 20.2,
  "2017-06-02T15:19:49.2354895Z", 17.3,
  "2017-06-02T15:21:44.9813459Z", 45.7,
  "2017-06-02T15:23:45.7895423Z", 10.9
]
| summarize max(usagePct)
```

Datatable constructs are also very useful when creating a lookup table. For example, if we're looking at response codes for requests in the system and would like a verbose description of what each means, we can create a lookup table using datatable and join this datatable to our requests table.
```AIQL
let httpCodes = datatable (resultCode: string, description:string)
[
  "200","OK",
  "304","Not modified",
  "404","Not found",
  "500","Internal server error"
];
requests
| join kind=leftouter (
  httpCodes
) on resultCode
```

## Next steps
Continue with our advanced tutorials:
* [Joins - cross analysis](~/learn/tutorials/joins.md)