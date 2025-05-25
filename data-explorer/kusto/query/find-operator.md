---
title:  find operator
description: Learn how to use the find operator to find rows that match a predicate across a set of tables.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/20/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# find operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds rows that match a predicate across a set of tables.

::: moniker range="microsoft-fabric  || azure-data-explorer"

The scope of the `find` operator can also be cross-database or cross-cluster.

```kusto
find in (Table1, Table2, Table3) where Fruit=="apple"

find in (database('*').*) where Fruit == "apple"

find in (cluster('cluster_name').database('MyDB*').*) where Fruit == "apple"
```

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

```kusto
find in (Table1, Table2, Table3) where Fruit=="apple"
```

> [!NOTE]
> `find` operator is substantially less efficient than column-specific text filtering. Whenever the columns are known, we recommend using the [where operator](where-operator.md). `find` doesn't function well when the workspace contains large number of tables and columns and the data volume that is being scanned is high and the time range of the query is high.

::: moniker-end

## Syntax

* `find` [`withsource`= *ColumnName*] [`in` `(`*Tables*`)`] `where` *Predicate* [`project-smart` | `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]]

* `find` *Predicate* [`project-smart` | `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

::: moniker range="microsoft-fabric  || azure-data-explorer"

|Name|Type|Required|Description|
|--|--|--|--|
|*ColumnName*| `string` | | By default, the output includes a column called *source_* whose values indicate which source table contributed to each row. If specified, *ColumnName* is used instead of *source_*. After wildcard matching, if the query references tables from more than one database including the default database, the value of this column has a table name qualified with the database. Similarly *cluster* and *database* qualifications are present in the value if more than one cluster is referenced.|
| *Predicate* | `bool` |  :heavy_check_mark: | This boolean expression is evaluated for each row in each input table. For more information, see [predicate-syntax details](find-operator.md#predicate-syntax).|
| *Tables* | `string` | | Zero or more comma-separated table references. By default, `find` looks in all the tables in the current database. You can use:<br/>1. The name of a table, such as `Events`<br/>2. A query expression, such as `(Events | where id==42)`<br/>3. A set of tables specified with a wildcard. For example, `E*` would form the union of all the tables in the database whose names begin with `E`.|
| `project-smart` or `project` | `string` | | If not specified, `project-smart` is used by default. For more information, see [output-schema details](find-operator.md#output-schema).|

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

* `withsource=`*ColumnName*: Optional. By default, the output includes a column called *source_* whose values indicate which source table contributed each row. If specified, *ColumnName* is used instead of *source_*.
* *Predicate*: A `boolean` [expression](scalar-data-types/bool.md) over the columns of the input tables *Table* [`,` *Table*, ...]. It's evaluated for each row in each input table. For more information, see  [predicate-syntax details](find-operator.md#predicate-syntax).
* *Tables*: Optional. Zero or more comma-separated table references. By default *find* searches all tables for:

  * The name of a table, such as `Events`
  * A query expression, such as `(Events | where id==42)`
  * A set of tables specified with a wildcard. For example, `E*` would form the union of all the tables whose names begin with `E`.
* `project-smart` | `project`: If not specified `project-smart` is used by default. For more information, see [output-schema details](find-operator.md#output-schema).

::: moniker-end

## Returns

Transformation of rows in *Table* [`,` *Table*, ...] for which *Predicate* is `true`. The rows are transformed according to the [output schema](#output-schema).

## Output schema

**source_ column**

The `find` operator output always includes a *source_* column with the source table name. The column can be renamed using the `withsource` parameter.

**results columns**

Source tables that don't contain any column used by the predicate evaluation, are filtered out.

When you use `project-smart`, the columns that appear in the output are:

* Columns that appear explicitly in the predicate.
* Columns that are common to all the filtered tables.

The rest of the columns are packed into a property bag and appear in an extra `pack` column.
A column that is referenced explicitly by the predicate and appears in multiple tables with multiple types, has a different column in the result schema for each such type. Each of the column names is constructed from the original column name and type, separated by an underscore.

When using `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]:

* The result table includes the columns specified in the list. If a source table doesn't contain a certain column, the values in the corresponding rows are null.
* When you specify a *ColumnType* with a *ColumnName*, this column in the "result" has the given type, and the values are cast to that type if needed. The casting doesn't have an effect on the column type when evaluating the *Predicate*.
* When `pack_all()` is used, all the columns, including the projected columns, are packed into a property bag and appear in an extra column, by default 'column1'. In the property bag, the source column name serves as the property name and the column's value serves as the property value.

## Predicate syntax

The `find` operator supports an alternative syntax for the `* has` term, and using just *term*, searches a term across all input columns.

For a summary of some filtering functions, see [where operator](where-operator.md).

## Considerations

* If the `project` clause references a column that appears in multiple tables and has multiple types, a type must follow this column reference in the project clause
* If a column appears in multiple tables and has multiple types and `project-smart` is in use, there's a corresponding column for each type in the `find`'s result, as described in [union](union-operator.md)
* When you use *project-smart*, changes in the predicate, in the source tables set, or in the tables schema, might result in a change to the output schema. If a constant result schema is needed, use *project* instead
* `find` scope can't include [functions](../management/functions.md). To include a function in the `find` scope, define a [let statement](let-statement.md) with [view keyword](let-statement.md).

## Performance tips

* Use [tables](../management/tables.md) as opposed to [tabular expressions](tabular-expression-statements.md).
If tabular expression, the find operator falls back to a `union` query that can result in degraded performance.
* If a column that appears in multiple tables and has multiple types, is part of the project clause, prefer adding a *ColumnType* to the project clause over modifying the table before passing it to `find`.
* Add time-based filters to the predicate. Use a datetime column value or [ingestion_time()](ingestion-time-function.md).
* Search in specific columns rather than a full text search.
* It's better not to reference columns that appear in multiple tables and have multiple types. If the predicate is valid when resolving such columns type for more than one type, the query falls back to union.
For example, see [examples of cases where `find` acts as a union](find-operator.md#examples-of-cases-where-find-acts-as-union).

## Examples

### General examples

::: moniker range="microsoft-fabric  || azure-data-explorer"

The following example finds all rows from all tables in the current database in which any column includes the word `Hernandez`. The resulting records are transformed according to the [output schema](#output-schema). The output includes rows from the `Customers` table and the `SalesTable` table of the `ContosoSales` database.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAA0vLzEtRUPJILcpLzEtJrVICAAv0zUwQAAAA" target="_blank">Run the query</a>

```kusto
find "Hernandez"
```

**Output**

This table shows the first three rows of the output.

| source_ |	pack_ |
|--|--|
| Customers |{"CityName":"Ballard","CompanyName":"NULL","ContinentName":"North America","CustomerKey":5023,"Education":"Partial High School","FirstName":"Devin","Gender":"M","LastName":"Hernandez","MaritalStatus":"S","Occupation":"Clerical","RegionCountryName":"United States","StateProvinceName":"Washington"} |
| Customers |{"CityName":"Ballard","CompanyName":"NULL","ContinentName":"North America","CustomerKey":7814,"Education":"Partial College","FirstName":"Kristy","Gender":"F","LastName":"Hernandez","MaritalStatus":"S","Occupation":"Professional","RegionCountryName":"United States","StateProvinceName":"Washington"} |
| Customers |{"CityName":"Ballard","CompanyName":"NULL","ContinentName":"North America","CustomerKey":7888,"Education":"Partial High School","FirstName":"Kari","Gender":"F","LastName":"Hernandez","MaritalStatus":"S","Occupation":"Clerical","RegionCountryName":"United States","StateProvinceName":"Washington"} |
|...|...|

The following example finds all rows from all tables in the current database whose name starts with `C`, and in which any column includes the word `Hernandez`. The resulting records are transformed according to the [output schema](#output-schema). Now, the output only contains records from the `Customers` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAA0vLzEtRyMxT0HDW0lQoz0gtSlXQUshILFZQ8kgtykvMS0mtUgIA+50LFCQAAAA=" target="_blank">Run the query</a>

```kusto
find in (C*) where * has "Hernandez"
```

**Output**

This table shows the first three rows of the output.

| source_ | pack_ |
|--|--|
| ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
| ConferenceSessions | {"conference":"Ignite 2018","sessionid":"THR3115","session_title":"Azure Log Analytics: Deep dive into the Azure Kusto query language. ","session_type":"Theater","owner":"Jean Francois Berenguer","participants":"","URL":"https://myignite.techcommunity.microsoft.com/sessions/66329","level":300,"session_location":"","starttime":null,"duration":null,"time_and_duration":"","kusto_affinity":"Focused"} |
| ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
|...|...|


The following example finds all rows from all tables in all databases in the cluster in which any column includes the word `Kusto`.
This query is a [cross-database](cross-cluster-or-database-queries.md) query.
The resulting records are transformed according to the [output schema](#output-schema).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0vLzEtRyMxT0EhJLElMSixO1VDXUtfU09JUKM9ILUpV0FLISCxWUPIuLS7JVwIAAccP5C0AAAA=" target="_blank">Run the query</a>

```kusto
find in (database('*').*) where * has "Kusto"
```

**Output**

This table shows the first three rows of the output.

| source_ | pack_ |
|--|--|
| database("Samples").ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
| database("Samples").ConferenceSessions | {"conference":"Ignite 2018","sessionid":"THR3115","session_title":"Azure Log Analytics: Deep dive into the Azure Kusto query language. ","session_type":"Theater","owner":"Jean Francois Berenguer","participants":"","URL":"https://myignite.techcommunity.microsoft.com/sessions/66329","level":300,"session_location":"","starttime":null,"duration":null,"time_and_duration":"","kusto_affinity":"Focused"} |
| database("Samples").ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} 
|...|...|

The following example finds all rows from all tables whose name starts with `K` in all databases whose name start with `B` and in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0vLzEtRyMxT0EhJLElMSixO1VAK1lLS1HPW0lQoz0gtSlXQUshILFZQ8i4tLslXAgCcXznPLwAAAA=" target="_blank">Run the query</a>

```kusto
find in (database("S*").C*) where * has "Kusto"
```

**Output**

This table shows the first three rows of the output.

| source_ | pack_ |
|--|--|
| ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
| ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
| ConferenceSessions | {"conference":"Build 2021","sessionid":"CON-PRT103","session_title":"Roundtable: Advanced Kusto query language topics","session_type":"Roundtable","owner":"Avner Aharoni","participants":"Alexander Sloutsky, Tzvia Gitlin-Troyna","URL":"https://sessions.mybuild.microsoft.com/sessions/details/4d4887e9-f08d-4f88-99ac-41e5feb869e7","level":200,"session_location":"Online","starttime":"2021-05-26T08:30:00.0000000Z","duration":60,"time_and_duration":"Wednesday, May 26\n8:30 AM - 9:30 AM GMT","kusto_affinity":"Focused"} |
|...|...|

The following example finds all rows from all tables whose name starts with `K` in all databases whose name start with `B` and in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

```kusto
find in (cluster("cluster1").database("B*").K*, cluster("cluster2").database("C*".*))
where * has "Kusto"
```

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"


The following example finds all rows from all tables in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

```kusto
find "Kusto"
```

::: moniker-end

### Examples of `find` output results  

Assume we have the next content of these two tables:

EventsTable1

|Session_Id|Level|EventText|Version
|---|---|---|---|
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Text1|v1.0.0
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Text2|v1.0.0
|28b8e46e-3c31-43cf-83cb-48921c3986fc|Error|Some Text3|v1.0.1
|8f057b11-3281-45c3-a856-05ebb18a3c59|Information|Some Text4|v1.1.0

EventsTable2

|Session_Id|Level|EventText|EventName
|---|---|---|---|
|f7d5f95f-f580-4ea6-830b-5776c8d64fdd|Information|Some Other Text1|Event1
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Other Text2|Event2
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Other Text3|Event3
|15eaeab5-8576-4b58-8fc6-478f75d8fee4|Error|Some Other Text4|Event4

The following example searches for specific records in *EventsTable1* and *EventsTable2* based on a given *Session_Id* and an *Error* Level. It then projects three specific columns: *EventText*, *Version*, and *EventName*, and packs all other remaining columns into a dynamic object.

```kusto
find in (EventsTable1, EventsTable2) 
     where Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e' and Level == 'Error' 
     project EventText, Version, EventName, pack_all()
```

**Output**

|source_|EventText|Version|EventName|pack_
|---|---|---|---|---|
|EventsTable1|Some Text2|v1.0.0||{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error"}
|EventsTable2|Some Other Text3||Event3|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error"}


The following example searches for records that either have *Version* as 'v1.0.0' or *EventName* as 'Event1', and then it projects (selects) four specific columns: *Session_Id*, *EventText*, *Version*, and *EventName* from those filtered results.

```kusto
find Version == 'v1.0.0' or EventName == 'Event1' project Session_Id, EventText, Version, EventName
```

**Output**

|source_|Session_Id|EventText|Version|EventName|
|---|---|---|---|---|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Some Text1|v1.0.0|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Some Text2|v1.0.0|
|EventsTable2|f7d5f95f-f580-4ea6-830b-5776c8d64fdd|Some Other Text1||Event1|

> [!NOTE]
> In practice, *EventsTable1* rows are filtered with ```Version == 'v1.0.0'``` predicate and *EventsTable2* rows are filtered with ```EventName == 'Event1'``` predicate.

The following example searches the database for any records with a *Session_Id* that matches 'acbd207d-51aa-4df7-bfa7-be70eb68f04e'. It retrieves records from all tables and columns that contain this specific *Session_Id*.

```kusto
find Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e'
```

**Output**

|source_|Session_Id|Level|EventText|pack_|
|---|---|---|---|---|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Text1|{"Version":"v1.0.0"}|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Text2|{"Version":"v1.0.0"}|
|EventsTable2|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Other Text2|{"EventName":"Event2"}|
|EventsTable2|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Other Text3|{"EventName":"Event3"}|

The following example searches the database for records with the specified *Session_Id* and returns all columns of those records as a single dynamic object.

```kusto
find Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e' project pack_all()
```

**Output**

|source_|pack_|
|---|---|
|EventsTable1|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Information", "EventText":"Some Text1", "Version":"v1.0.0"}|
|EventsTable1|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error", "EventText":"Some Text2", "Version":"v1.0.0"}|
|EventsTable2|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Information", "EventText":"Some Other Text2", "EventName":"Event2"}|
|EventsTable2|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error", "EventText":"Some Other Text3", "EventName":"Event3"}|

### Examples of cases where `find` acts as union

The `find` operator in Kusto can sometimes act like a `union` operator, mainly when it's used to search across multiple tables.

The following example first creates a view that filters *EventsTable1* to only include error-level records. Then, it searches within this filtered view and the EventsTable2 table for records with a specific *Session_Id*.

```kusto
let PartialEventsTable1 = view() { EventsTable1 | where Level == 'Error' };
find in (PartialEventsTable1, EventsTable2) 
     where Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e'
```

The following examples demonstrate how the `find` operator can act as a `union` when a column appears in multiple tables with different types. In this case, the `ProcessId` column is present in both *Table1* and *Table2*, but with different types.
For this example, create two tables by running:

```kusto
.create tables 
  Table1 (Level:string, Timestamp:datetime, ProcessId:string),
  Table2 (Level:string, Timestamp:datetime, ProcessId:int64)
```

* The following query is executed as `union`.

```kusto
find in (Table1, Table2) where ProcessId == 1001
```

The output result schema is *(Level:string, Timestamp, ProcessId_string, ProcessId_int)*.

* The following query is executed as `union`, but produces a different result schema.

```kusto
find in (Table1, Table2) where ProcessId == 1001 project Level, Timestamp, ProcessId:string 
```

The output result schema is *(Level:string, Timestamp, ProcessId_string)*
