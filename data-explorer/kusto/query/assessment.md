# Kusto Query Language

## Introduction

Kusto Query Language (KQL) is a powerful tool for exploring data, discovering patterns, identifying anomalies, and creating statistical models. Designed for speed and efficiency, KQL is widely adopted for querying telemetry, logs, and other large datasets in cloud environments. Its expressive, easy-to-read syntax allows users to understand query intent and optimize their authoring experience.

KQL provides robust support for:

- Text search and parsing.
- Time-series operators and functions.
- Analytics and aggregation.
- Geospatial operations.
- Vector similarity searches.

In this article, you'll find an explanation of the query language, practical examples, and exercises to get you started with writing queries. To access the query environment, use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). For a hands-on tutorial, see [Tutorial: Learn common operators](tutorials/learn-common-operators.md).

---

## Core Features

### 1. **Ease of Use**

KQL is easy to learn and use, thanks to its intuitive syntax and structured design. It is especially user-friendly for both beginners and experienced data analysts.

### 2. **Comprehensive Data Support**

KQL supports querying across various data types, including structured, semi-structured, and unstructured data. This flexibility makes it suitable for a wide range of use cases, from basic log analysis to complex statistical modeling.

### 3. **Optimized Performance**

Built for speed and scalability, KQL excels in high-volume environments where data processing needs to be both quick and efficient.

---

## Common Use Cases

- **Log Analysis:** Investigate system logs to identify issues and trends.
- **Performance Monitoring:** Analyze telemetry to monitor application and system performance.
- **Anomaly Detection:** Detect unusual activity or patterns within datasets.
- **Geospatial Analytics:** Perform operations on geographic data, such as distance calculations and map visualizations.
## Core Concepts

### Query Structure

A Kusto query is a **read-only request** to process data and return results. It is expressed in plain text, using a data-flow model that is easy to read, author, and automate. Queries consist of one or more **statements**.

The most common type of statement in KQL is a **tabular expression statement**, where both the input and output are tabular datasets. These statements:
- Contain zero or more **operators**, which filter or manipulate data.
- Use the pipe (`|`) character to sequence operations.
- Return refined data as output.

### Types of Query Statements

There are three kinds of query statements:
1. **[Tabular expression statement](tabular-expression-statements.md)**: Operates on tabular data.
2. **[Let statement](let-statement.md)**: Assigns values to variables.
3. **[Set statement](set-statement.md)**: Configures settings for a query.

All query statements are separated by a semicolon (`;`).

For details on application query statements, see [Application query statements](statements.md#application-query-statements).

---
## How KQL Works

Imagine a funnel: you start with an entire data table. Each time the data passes through an operator, it is filtered, rearranged, or summarized. At the end of the funnel, you’re left with a refined output.

## Best Practices for Writing Queries

1. **Filter Early:** Apply filters at the beginning of your query to reduce the dataset size and improve performance.
2. **Use Summarization Wisely:** Avoid unnecessary summarizations, as they can increase processing time.
3. **Format Queries for Readability:** Use indentation and consistent formatting to make queries easier to read and debug.
## Example Query: Counting Storm Events in Florida

The following query demonstrates how to use KQL to filter data and count the number of storm events in Florida during a specific time period. This type of query is commonly used for analyzing logs, identifying trends, or generating summary reports.

### Query

```kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"
| count
```

## Run the Query

You can test the example query in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA). Click the link below to run the query and see the results:

> [!div class="nextstepaction"] [Run the Query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUUgDZkpxfmlcCAIItD6l6AAAA)

### Result

| **Metric**    | **Value** |
|---------------|-----------|
| Total Count   | 28        |

### Query Explanation

This query demonstrates how to filter and summarize data in the `StormEvents` table using a tabular expression statement. Here's a step-by-step breakdown:

1. **Table Selection**: The query begins by referencing the `StormEvents` table as its data source.
2. **Filtering by Time Range**: The first `where` operator narrows the data to rows where the `StartTime` column falls between November 1, 2007, and December 1, 2007.
3. **Filtering by State**: The second `where` operator further filters the rows to include only those where the `State`column is "florida."
4. **Counting Results**: The `count` operator calculates the total number of rows that satisfy the filters, providing the final result.

This query highlights the simplicity and power of KQL for filtering and summarizing large datasets. By chaining operators with the pipe (`|`), you can efficiently process data step-by-step to gain actionable insights. Operators are applied sequentially, with each step refining the data passed to the next.

> **Note:** KQL is case-sensitive for all elements, including table names, column names, operators, and functions.


## Management Commands

In addition to queries, KQL supports **management commands**, which are used to process or modify data or metadata. These commands have distinct syntax and behavior:

- **Dot Prefix**: Management commands always begin with a dot (`.`), which distinguishes them from queries.
- **Security**: These commands cannot be embedded in queries, ensuring a clear separation of responsibilities and reducing the risk of injection attacks.

### Example: Creating a Table

The following command creates a table named `Logs` with two columns, `Level` (a string) and `Text` (a string): 

```kusto
.create table Logs (Level:string, Text:string)
```

This command tells the system to define a new table schema, which can then be populated with data or queried like any other table.
### Example: Displaying Metadata

Management commands can also retrieve metadata or data without modifying it. For instance, the `.show tables`command returns a list of all tables in the current database:

```kusto
.show tables
````

**Sample Output:**

|Table Name|Creation Time|
|---|---|
|Logs|2025-01-01 12:00:00 PM|
|Events|2024-12-15 09:45:00 AM|

This output shows metadata about the available tables, such as their names and creation times.

For more information, see the [Management commands overview](../management/index.md).

## KQL in Other Services

KQL is a foundational query language used across multiple Microsoft services. Explore its applications in the following environments:

- [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
- [KQL in Microsoft Sentinel](/azure/sentinel/kusto-overview)
- [Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
- [Advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
- [CMPivot queries in Microsoft Endpoint Manager](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

---

## Related Resources

Deepen your understanding of KQL with these additional resources:

- [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
- [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
- [KQL quick reference](kql-quick-reference.md)
- [SQL to KQL cheat sheet](sql-cheat-sheet.md)
- [Query best practices](best-practices.md)


## Conclusion

Kusto Query Language is a powerful tool for analyzing data and gaining actionable insights. By learning its syntax and features, you can leverage KQL to perform efficient data exploration and advanced analytics. Whether you're filtering logs or performing geospatial analysis, KQL simplifies complex tasks with its intuitive, expressive syntax.

For more information, visit the [official KQL documentation](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/), and try out the examples provided to refine your skills.
