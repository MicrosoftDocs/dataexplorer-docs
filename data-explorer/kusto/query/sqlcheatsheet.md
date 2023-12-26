---
title:  SQL to Kusto query translation
description: Learn about the Kusto Query Language equivalent of SQL queries.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# SQL to Kusto Query Language cheat sheet

If you're familiar with SQL and want to learn KQL, translate SQL queries into KQL by prefacing the SQL query with a comment line, `--`, and the keyword `explain`. The output shows the KQL version of the query, which can help you understand the KQL syntax and concepts.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PV5XKNCPBx9PRT4Ap29XF1DlFw9g/1C4l38nTX0NJUSCxWcFZwC/L3VQguyS/KdS1LzSspBgDZdzUzNQAAAA==" target="_blank">Run the query</a>

```kusto
--
explain
SELECT COUNT_BIG(*) as C FROM StormEvents 
```

**Output**

|Query|
|---|
|StormEvents`<br>`\| summarize C=count()`<br>`\| project C|

## SQL to Kusto cheat sheet

The following table shows sample queries in SQL and their KQL equivalents.

| Category | SQL Query | Kusto Query | Learn more |
|--|--|--|
| Select data from table | `SELECT * FROM dependencies` | `dependencies` | [Tabular expression statements](tabularexpressionstatements.md) |
| -- | `SELECT name, resultCode FROM dependencies` | `dependencies | project name, resultCode` | [project](projectoperator.md) |
| -- | `SELECT TOP 100 * FROM dependencies` | `dependencies | take 100` | [take](takeoperator.md) |
| Null evaluation | `SELECT * FROM dependencies`<br>`WHERE resultCode IS NOT NULL` | `dependencies`<br>`| where isnotnull(resultCode)` | [isnotnull()](isnotnullfunction.md) |
| Comparison operators (date) | `SELECT * FROM dependencies`<br>`WHERE timestamp > getdate()-1` | `dependencies`<br>`| where timestamp > ago(1d)` | [ago()](agofunction.md) |
| -- | `SELECT * FROM dependencies`<br>`WHERE timestamp BETWEEN ... AND ...` | `dependencies`<br>`| where timestamp between (datetime(2016-10-01) .. datetime(2016-11-01))` | [between](betweenoperator.md) |
| Comparison operators (string) | `SELECT * FROM dependencies`<br>`WHERE type = "Azure blob"` | `dependencies`<br>`| where type == "Azure blob"` | [Logical operators](logicaloperators.md) |
| -- | `-- substring`<br>`SELECT * FROM dependencies`<br>`WHERE type like "%blob%"` | `// substring`<br>`dependencies`<br>`| where type has "blob"` | [has](has-operator.md) |
| -- | `-- wildcard`<br>`SELECT * FROM dependencies`<br>`WHERE type like "Azure%"` | `// wildcard`<br>`dependencies`<br>`| where type startswith "Azure"`<br>`// or`<br>`dependencies`<br>`| where type matches regex "^Azure.*"` | [`startswith`](startswith-operator.md)</br>[matches regex](matches-regex-operator.md) |
| Comparison (boolean) | `SELECT * FROM dependencies`<br>`WHERE !(success)` | `dependencies`<br>`| where success == False` | [Logical operators](logicaloperators.md) |
| Grouping, Aggregation | `SELECT name, AVG(duration) FROM dependencies`<br>`GROUP BY name` | `dependencies`<br>`| summarize avg(duration) by name` | [summarize](summarizeoperator.md)</br>[avg()](avg-aggfunction.md) |
| Distinct | `SELECT DISTINCT name, type  FROM dependencies` | `dependencies`<br>`| summarize by name, type` | [summarize](summarizeoperator.md)</br>[distinct](distinctoperator.md) |
| -- | `SELECT name, COUNT(DISTINCT type) `<br>` FROM dependencies `<br>` GROUP BY name` | ` dependencies `<br>`| summarize by name, type | summarize count() by name `<br>`// or approximate for large sets `<br>` dependencies `<br>` | summarize dcount(type) by name  ` | [count()](count-aggfunction.md)</br>[dcount()](dcount-aggfunction.md) |
| Column aliases, Extending | `SELECT operationName as Name, AVG(duration) as AvgD FROM dependencies`<br>`GROUP BY name` | `dependencies`<br>`| summarize AvgD = avg(duration) by Name=operationName` | [Alias statement](aliasstatement.md) |
| -- | `SELECT conference, CONCAT(sessionid, ' ' , session_title) AS session FROM ConferenceSessions` | `ConferenceSessions`<br>`| extend session=strcat(sessionid, " ", session_title)`<br>`| project conference, session` | [strcat()](strcatfunction.md)</br>[project](projectoperator.md) |
| Ordering | `SELECT name, timestamp FROM dependencies`<br>`ORDER BY timestamp ASC` | `dependencies`<br>`| project name, timestamp`<br>`| sort by timestamp asc nulls last` | [sort](sort-operator.md) |
| Top n by measure | `SELECT TOP 100 name, COUNT(*) as Count FROM dependencies`<br>`GROUP BY name`<br>`ORDER BY Count DESC` | `dependencies`<br>`| summarize Count = count() by name`<br>`| top 100 by Count desc` | [top](topoperator.md) |
| Union | `SELECT * FROM dependencies`<br>`UNION`<br>`SELECT * FROM exceptions` | `union dependencies, exceptions` | [union](unionoperator.md) |
| -- | `SELECT * FROM dependencies`<br>`WHERE timestamp > ...`<br>`UNION`<br>`SELECT * FROM exceptions`<br>`WHERE timestamp > ...` | `dependencies`<br>`| where timestamp > ago(1d)`<br>`| union`<br>`    (exceptions`<br>`    | where timestamp > ago(1d))` |  |
| Join | `SELECT * FROM dependencies `<br>`LEFT OUTER JOIN exceptions`<br>`ON dependencies.operation_Id = exceptions.operation_Id` | `dependencies`<br>`| join kind = leftouter`<br>`    (exceptions)`<br>`on $left.operation_Id == $right.operation_Id` | [join](joinoperator.md) |
| Nested queries | `SELECT * FROM dependencies`<br>`WHERE resultCode == `<br>`(SELECT TOP 1 resultCode FROM dependencies`<br>`WHERE resultId = 7`<br>`ORDER BY timestamp DESC)` | `dependencies`<br>`| where resultCode == toscalar(`<br>`    dependencies`<br>`    | where resultId == 7`<br>`    | top 1 by timestamp desc`<br>`    | project resultCode)` | [toscalar](toscalarfunction.md) |
| Having | `SELECT COUNT(\*) FROM dependencies`<br>`GROUP BY name`<br>`HAVING COUNT(\*) > 3` | `dependencies`<br>`| summarize Count = count() by name`<br>`| where Count > 3` | [summarize](summarizeoperator.md)</br>[where](whereoperator.md) |

## Related content

* Use [T-SQL](/azure/data-explorer/t-sql) to query data
