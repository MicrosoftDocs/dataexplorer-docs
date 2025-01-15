---
title:  Writing assessment
description:  This article is for writing assessment purposes only.
ms.reviewer: orspod
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Query Language (KQL)

_Kusto Query Language (or KQL)_ is a powerful tool that you can use to explore your data and to discover patterns, identify anomalies and outliers, create statistical modeling, and more. 

This article provides an introduction to the query language and includes an example of a query.

* To access the query environment, use the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/).  
* To learn how to use KQL, see [Tutorial: Learn Common Operators](tutorials/learn-common-operators.md).  

The KQL query process can be thought of as a funnel: you insert a data table at the wide end, and each time the data passes through another operator, it is filtered, rearranged, or summarized, and thus "narrowed" and presented as output at the end of the funnel, according to your request. 

The language is expressive, so that users can read queries easily and understand the query's intent. It is optimized for the authoring experience, and very useful for querying telemetry, metrics, and logs. KQL offers deep support for many language constructs used in data analysis, including:

* text search and parsing
* time-series operators and functions
* analytics and aggregation
* geospatial functions
* vector similarity searches

## Kusto Queries

A *Kusto query* is a read-only request to process data and return results. The request is stated in plain text, using a data-flow model that is easy to read, author, and automate. The query uses schema entities that are organized in a hierarchy similar to SQLs: databases, tables, and columns. You can input various types of tabular data to the query.

Kusto queries are made of one or more *query statements*, separated by semicolons (`;`). There are two types of statements:

* [User query statements](statements.md#user-query-statements), which are primarily used by users
* [Application query statements](statements.md#application-query-statements), for use by mid-tier applications, to send modified versions of user queries to Kusto.

A *user query statement* can be one of the following:

* A [tabular expression statement](tabular-expression-statements.md) 
* A [let statement](let-statement.md)
* A [set statement](set-statement.md)

Every KQL query must include at least one *tabular expression statement*. In these statements both input and output consist of tables or tabular datasets. Tabular expression statements contain zero or more operators, each of which starts with a tabular input and returns a tabular output. Operators are sequenced by a `|` (pipe). As the data flows, or is piped, from one operator to the next, it is filtered or manipulated, and then fed into the following step.

Because the piping of information from one operator to another is sequential, the order in which you run the query operators is important, and it can affect both results and performance. 

## Query Example

The following is a KQL query which determines the number of storm events at a given place with a start date within a given interval:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count 
```

|Count|
|-----|
|   28|

This query has a single tabular expression statement. The statement begins with a reference to a table called *StormEvents* and contains several operators—[`where`](where-operator.md) and [`count`](count-operator.md)—separated by pipes. 
The data rows for the source table are filtered by the value of the `StartTime` column and then filtered by the value of the `State` column. 
In the last line, the query returns a table with a single column and a single data row containing the count of the resulting rows.

For information about application query statements, see [Application Query Statements](statements.md#application-query-statements).

## Management Commands and Queries

In contrast to Kusto queries, *management commands* are requests to Kusto to process or modify data or metadata. 

For example, the following management command creates a new Kusto table with two columns: `Level` and `Number`:

```kusto
.create table Logs (Level:string, Text:string)
```

Management commands have their own syntax, distinct from the Kusto Query Language syntax, although many of the underlying concepts are similar. In particular, management commands are distinguished from queries as the commands always begin with a period (`.`) character, while queries cannot begin with a `.`. This distinction prevents many kinds of security attacks, because it prevents attackers from embedding management commands within queries.

Not all management commands modify data or metadata. Each command in the large class of commands that start with `.show` is used to display data or metadata. For example, the `.show tables` command returns a list of all tables in the current database.

For more information on management commands, see [Management Commands Overview](../management/index.md).

## KQL in Other Microsoft Services

KQL is used by many Microsoft services. Learn more about the use of KQL in these environments on the following pages:

* [Log Queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
* [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
* [Understanding the Azure Resource Graph Query Language](/azure/governance/resource-graph/concepts/query-language)
* [Proactive Threat Hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
* [CMPivot Queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## Related Topics

* [Tutorial: Learn Common Operators](tutorials/learn-common-operators.md)
* [Tutorial: Use Aggregation Functions](tutorials/use-aggregation-functions.md)
* [KQL Quick Reference](kql-quick-reference.md)
* [SQL to KQL "Cheat Sheet"](sql-cheat-sheet.md)
* [Best Practices for Query Design](best-practices.md)
