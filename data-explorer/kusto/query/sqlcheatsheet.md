---
title:  SQL to Kusto query translation
description: Learn about the Kusto Query Language equivalent of SQL queries.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# SQL to Kusto Query Language cheat sheet

If you're familiar with SQL and want to learn KQL, translate SQL queries into KQL by prefacing the SQL query with a comment line, `--`, and the keyword `explain`. The output will show the KQL version of the query, which can help you understand the KQL syntax and concepts.

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
|StormEvents<br>\| summarize C=count()<br>\| project C|

## SQL to Kusto cheat sheet

The table below shows sample queries in SQL and their KQL equivalents.

| Category | SQL Query | Kusto Query | Learn more |
|--|--|--|
| Select data from table | <code>SELECT * FROM dependencies</code> | <code>dependencies</code> | [Tabular expression statements](tabularexpressionstatements.md) |
| -- | <code>SELECT name, resultCode FROM dependencies</code> | <code>dependencies &#124; project name, resultCode</code> | [project](projectoperator.md) |
| -- | <code>SELECT TOP 100 * FROM dependencies</code> | <code>dependencies &#124; take 100</code> | [take](takeoperator.md) |
| Null evaluation | <code>SELECT * FROM dependencies<br>WHERE resultCode IS NOT NULL</code> | <code>dependencies<br>&#124; where isnotnull(resultCode)</code> | [isnotnull()](isnotnullfunction.md) |
| Comparison operators (date) | <code>SELECT * FROM dependencies<br>WHERE timestamp > getdate()-1</code> | <code>dependencies<br>&#124; where timestamp > ago(1d)</code> | [ago()](agofunction.md) |
| -- | <code>SELECT * FROM dependencies<br>WHERE timestamp BETWEEN ... AND ...</code> | <code>dependencies<br>&#124; where timestamp between (datetime(2016-10-01) .. datetime(2016-11-01))</code> | [between](betweenoperator.md) |
| Comparison operators (string) | <code>SELECT * FROM dependencies<br>WHERE type = "Azure blob"</code> | <code>dependencies<br>&#124; where type == "Azure blob"</code> | [Logical operators](logicaloperators.md) |
| -- | <code>-- substring<br>SELECT * FROM dependencies<br>WHERE type like "%blob%"</code> | <code>// substring<br>dependencies<br>&#124; where type contains "blob"</code> | [contains](contains-operator.md) |
| -- | <code>-- wildcard<br>SELECT * FROM dependencies<br>WHERE type like "Azure%"</code> | <code>// wildcard<br>dependencies<br>&#124; where type startswith "Azure"<br>// or<br>dependencies<br>&#124; where type matches regex "^Azure.*"</code> | [startswith](startswith-operator.md)</br>[matches regex](matches-regex-operator.md) |
| Comparison (boolean) | <code>SELECT * FROM dependencies<br>WHERE !(success)</code> | <code>dependencies<br>&#124; where success == False</code> | [Logical operators](logicaloperators.md) |
| Grouping, Aggregation | <code>SELECT name, AVG(duration) FROM dependencies<br>GROUP BY name</code> | <code>dependencies<br>&#124; summarize avg(duration) by name</code> | [summarize](summarizeoperator.md)</br>[avg()](avg-aggfunction.md) |
| Distinct | <code>SELECT DISTINCT name, type  FROM dependencies</code> | <code>dependencies<br>&#124; summarize by name, type</code> | [summarize](summarizeoperator.md)</br>[distinct](distinctoperator.md) |
| -- | <code>SELECT name, COUNT(DISTINCT type) <br> FROM dependencies <br> GROUP BY name</code> | <code> dependencies <br>&#124; summarize by name, type &#124; summarize count() by name <br> // or approximate for large sets <br> dependencies <br> &#124; summarize dcount(type) by name  </code> | [count()](count-aggfunction.md)</br>[dcount()](dcount-aggfunction.md) |
| Column aliases, Extending | <code>SELECT operationName as Name, AVG(duration) as AvgD FROM dependencies<br>GROUP BY name</code> | <code>dependencies<br>&#124; summarize AvgD = avg(duration) by Name=operationName</code> | [Alias statement](aliasstatement.md) |
| -- | <code>SELECT conference, CONCAT(sessionid, ' ' , session_title) AS session FROM ConferenceSessions</code> | <code>ConferenceSessions<br>&#124; extend session=strcat(sessionid, " ", session_title)<br>&#124; project conference, session</code> | [strcat()](strcatfunction.md)</br>[project](projectoperator.md) |
| Ordering | <code>SELECT name, timestamp FROM dependencies<br>ORDER BY timestamp ASC</code> | <code>dependencies<br>&#124; project name, timestamp<br>&#124; sort by timestamp asc nulls last</code> | [sort](sort-operator.md) |
| Top n by measure | <code>SELECT TOP 100 name, COUNT(*) as Count FROM dependencies<br>GROUP BY name<br>ORDER BY Count DESC</code> | <code>dependencies<br>&#124; summarize Count = count() by name<br>&#124; top 100 by Count desc</code> | [top](topoperator.md) |
| Union | <code>SELECT * FROM dependencies<br>UNION<br>SELECT * FROM exceptions</code> | <code>union dependencies, exceptions</code> | [union](unionoperator.md) |
| -- | <code>SELECT * FROM dependencies<br>WHERE timestamp > ...<br>UNION<br>SELECT * FROM exceptions<br>WHERE timestamp > ...</code> | <code>dependencies<br>&#124; where timestamp > ago(1d)<br>&#124; union<br>&nbsp;&nbsp;(exceptions<br>&nbsp;&nbsp;&#124; where timestamp > ago(1d))</code> |  |
| Join | <code>SELECT * FROM dependencies <br>LEFT OUTER JOIN exceptions<br>ON dependencies.operation_Id = exceptions.operation_Id</code> | <code>dependencies<br>&#124; join kind = leftouter<br>&nbsp;&nbsp;(exceptions)<br>on $left.operation_Id == $right.operation_Id</code> | [join](joinoperator.md) |
| Nested queries | <code>SELECT * FROM dependencies<br>WHERE resultCode == <br>(SELECT TOP 1 resultCode FROM dependencies<br>WHERE resultId = 7<br>ORDER BY timestamp DESC)</code> | <code>dependencies<br>&#124; where resultCode == toscalar(<br>&nbsp;&nbsp;dependencies<br>&nbsp;&nbsp;&#124; where resultId == 7<br>&nbsp;&nbsp;&#124; top 1 by timestamp desc<br>&nbsp;&nbsp;&#124; project resultCode)</code> | [toscalar](toscalarfunction.md) |
| Having | <code>SELECT COUNT(\*) FROM dependencies<br>GROUP BY name<br>HAVING COUNT(\*) > 3</code> | <code>dependencies<br>&#124; summarize Count = count() by name<br>&#124; where Count > 3</code> | [summarize](summarizeoperator.md)</br>[where](whereoperator.md) |

## Next steps

* Use [T-SQL](/azure/data-explorer/t-sql) to query data
