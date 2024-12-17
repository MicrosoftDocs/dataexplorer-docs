# Kusto Query Language (KQL)

**Kusto Query Language (KQL)** is a powerful and flexible tool for analyzing data. It enables users to **explore data**, **discover patterns**, **identify anomalies**, and **create statistical models** with ease. KQL is widely used for querying telemetry, logs, metrics, and other structured or semi-structured data sources. Its syntax is expressive, easy to read, and optimized for both authoring and analysis experiences.

KQL supports advanced operations like:
- **Text search and parsing**
- **Time-series analytics**
- **Aggregation and filtering**
- **Geospatial operations**
- **Vector similarity searches**

Queries in KQL operate on **schema entities** organized hierarchically into databases, tables, and columns—much like SQL.

## **Getting Started with KQL**

This article explains Kusto Query Language concepts, providing examples and exercises to help you begin writing queries. To explore KQL interactively:
- Use the [Azure Data Explorer web UI](https://dataexplorer.azure.com/)
- For a practical guide, visit [Tutorial: Learn common operators](tutorials/learn-common-operators.md)

## Key Concepts of KQL

### Tabular Expression Statements

The most common query type in KQL is the **tabular expression statement**, where input and output data are represented as **tables** (or tabular datasets). A query consists of **operators** chained together using the **pipe symbol (`|`)**, which streams data sequentially through transformations.

Here's an example:

```kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "florida"  
| count
```
**Explanation**:
1. **StormEvents**: The table being queried.
2. **`where` operator**: Filters rows based on conditions.
3. **`|` (pipe)**: Streams filtered data to the next step.
4. **`count` operator**: Returns the count of filtered rows.

**Result**:
```
Count
28
```
> **Note**: KQL is **case-sensitive** for table names, column names, operators, and functions.

### Types of Query Statements

KQL queries consist of **one or more query statements**, which are always separated by a semicolon (`;`). There are three main types:

1. **Tabular Expression Statement**: Processes and returns tabular data.
2. **Let Statement**: Defines variables for temporary use.
3. **Set Statement**: Configures query settings.

For detailed examples, refer to [Application query statements](statements.md#application-query-statements).

## Management Commands

Management commands differ from KQL queries. While queries **read data**, management commands **modify** or **retrieve metadata**. They are executed using a **dot (`.`)** prefix for enhanced security.

**Example:** Create a new table called "Logs" with two columns:

```kusto
.create table Logs (Level:string, Text:string)
```

- **`.create`**: Creates or modifies schema objects.
- **`.show`**: Retrieves metadata or information.

Example to display all tables in a database:
```kusto
.show tables
```
For more details, see [Management Commands Overview](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/).

## **KQL in Microsoft Services**

KQL is integrated across various Microsoft services to facilitate data querying and analysis. For specific information on the use of KQL in these environments, refer to the following links:

- [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
- [Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-overview)
- [Understanding the Azure Resource Graph query language](/azure/governance/resource-graph/concepts/query-language)
- [Proactively hunt for threats with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)
- [CMPivot queries](/mem/configmgr/core/servers/manage/cmpivot-overview#queries)

## **Learning Resources**

To deepen your understanding of KQL, explore the following resources:

- [Tutorial: Learn common operators](tutorials/learn-common-operators.md)
- [Tutorial: Use aggregation functions](tutorials/use-aggregation-functions.md)
- [KQL quick reference](kql-quick-reference.md)
- [SQL to Kusto Query Language cheat sheet](sql-cheat-sheet.md)
- [Query best practices](best-practices.md)
- [Best query practices](best-practices.md)
