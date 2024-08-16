---
title:  find operator
description: Learn how to use the find operator to find rows that match a predicate across a set of tables.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/14/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# find operator

Finds rows that match a predicate across a set of tables.

::: zone pivot="azuredataexplorer, fabric"

The scope of the `find` can also be cross-database or cross-cluster.

```kusto
find in (Table1, Table2, Table3) where Fruit=="apple"

find in (database('*').*) where Fruit == "apple"

find in (cluster('cluster_name').database('MyDB*').*) where Fruit == "apple"
```

::: zone-end

::: zone pivot="azuremonitor"

```kusto
find in (Table1, Table2, Table3) where Fruit=="apple"
```

> [!NOTE]
> `find` operator is substantially less efficient than column-specific text filtering. Whenever the columns are known, we recommend using the [where operator](where-operator.md). `find` will not function well when the workspace contains large number of tables and columns and the data volume that is being scanned is high and the time range of the query is high.

::: zone-end

## Syntax

* `find` [`withsource`= *ColumnName*] [`in` `(`*Tables*`)`] `where` *Predicate* [`project-smart` | `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]]

* `find` *Predicate* [`project-smart` | `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

::: zone pivot="azuredataexplorer, fabric"

|Name|Type|Required|Description|
|--|--|--|--|
|*ColumnName*| `string` | | By default, the output will include a column called *source_* whose values indicate which source table has contributed each row. If specified, *ColumnName* will be used instead of *source_*. After wildcard matching, if the query references tables from more than one database including the default database, the value of this column will have a table name qualified with the database. Similarly *cluster* and *database* qualifications will be present in the value if more than one cluster is referenced.|
| *Predicate* | `bool` |  :heavy_check_mark: | This boolean expression is evaluated for each row in each input table. For more information, see [predicate-syntax details](./find-operator.md#predicate-syntax).|
| *Tables* | `string` | | Zero or more comma-separated table references. By default, `find` will look in all the tables in the current database. You can use:<br/>1. The name of a table, such as `Events`<br/>2. A query expression, such as `(Events | where id==42)`<br/>3. A set of tables specified with a wildcard. For example, `E*` would form the union of all the tables in the database whose names begin with `E`.|
| `project-smart` or `project` | `string` | | If not specified, `project-smart` will be used by default. For more information, see [output-schema details](./find-operator.md#output-schema).|

::: zone-end

::: zone pivot="azuremonitor"

* `withsource=`*ColumnName*: Optional. By default, the output will include a column called *source_* whose values indicate which source table contributed each row. If specified, *ColumnName* will be used instead of *source_*.
* *Predicate*: A `boolean` [expression](./scalar-data-types/bool.md) over the columns of the input tables *Table* [`,` *Table*, ...]. It's evaluated for each row in each input table. For more information, see  [predicate-syntax details](./find-operator.md#predicate-syntax).
* *Tables*: Optional. Zero or more comma-separated table references. By default *find* will search all tables for:

  * The name of a table, such as `Events`
  * A query expression, such as `(Events | where id==42)`
  * A set of tables specified with a wildcard. For example, `E*` would form the union of all the tables whose names begin with `E`.
* `project-smart` | `project`: If not specified `project-smart` will be used by default. For more information, see [output-schema details](./find-operator.md#output-schema).

::: zone-end

## Returns

Transformation of rows in *Table* [`,` *Table*, ...] for which *Predicate* is `true`. The rows are transformed according to the [output schema](#output-schema).

## Output schema

**source_ column**

The find operator output will always include a *source_* column with the source table name. The column can be renamed using the `withsource` parameter.

**results columns**

Source tables that don't contain any column used by the predicate evaluation, will be filtered out.

When you use `project-smart`, the columns that will appear in the output will be:

* Columns that appear explicitly in the predicate.
* Columns that are common to all the filtered tables.

The rest of the columns will be packed into a property bag and will appear in an additional `pack` column.
A column that is referenced explicitly by the predicate and appears in multiple tables with multiple types, will have a different column in the result schema for each such type. Each of the column names will be constructed from the original column name and type, separated by an underscore.

When using `project` *ColumnName*[`:` *ColumnType* `,` ... ] [`,` `pack_all()`]:

* The result table will include the columns specified in the list. If a source table doesn't contain a certain column, the values in the corresponding rows will be null.
* When specifying a *ColumnType* with a *ColumnName*, this column in the "result" will have the given type, and the values will be cast to that type if needed. The casting won't have an effect on the column type when evaluating the *Predicate*.
* When `pack_all()` is used, all the columns, including the projected columns, are packed into a property bag and appear in an additional column, by default 'column1'. In the property bag, the source column name serves as the property name and the column's value serves as the property value.

## Predicate syntax

The *find* operator supports an alternative syntax for the `* has` term, and using just *term*, will search a term across all input columns.

For a summary of some filtering functions, see [where operator](./where-operator.md).

## Notes

* If the `project` clause references a column that appears in multiple tables and has multiple types, a type must follow this column reference in the project clause
* If a column appears in multiple tables and has multiple types and `project-smart` is in use, there will be a corresponding column for each type in the `find`'s result, as described in [union](./union-operator.md)
* When you use *project-smart*, changes in the predicate, in the source tables set, or in the tables schema, may result in a change to the output schema. If a constant result schema is needed, use *project* instead
* `find` scope can't include [functions](../management/functions.md). To include a function in the find scope, define a [let statement](./let-statement.md) with [view keyword](./let-statement.md).

## Performance tips

* Use [tables](../management/tables.md) as opposed to [tabular expressions](./tabular-expression-statements.md).
If tabular expression, the find operator falls back to a `union` query that can result in degraded performance.
* If a column that appears in multiple tables and has multiple types, is part of the project clause, prefer adding a *ColumnType* to the project clause over modifying the table before passing it to `find`.
* Add time-based filters to the predicate. Use a datetime column value or [ingestion_time()](./ingestion-time-function.md).
* Search in specific columns rather than a full text search.
* It's better not to reference columns that appear in multiple tables and have multiple types. If the predicate is valid when resolving such columns type for more than one type, the query will fall back to union.
For example, see [examples of cases where find will act as a union](./find-operator.md#examples-of-cases-where-find-will-act-as-union).

## Examples

::: zone pivot="azuredataexplorer, fabric"

### Term lookup across all tables in current database

The query finds all rows from all tables in the current database in which any column includes the word `Hernandez`. The resulting records are transformed according to the [output schema](#output-schema). The output includes rows from the `Customers` table and the `SalesTable` table of the `ContosoSales` database.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAA0vLzEtRUPJILcpLzEtJrVICAAv0zUwQAAAA" target="_blank">Run the query</a>

```kusto
find "Hernandez"
```

### Term lookup across all tables matching a name pattern in the current database

The query finds all rows from all tables in the current database whose name starts with `C`, and in which any column includes the word `Hernandez`. The resulting records are transformed according to the [output schema](#output-schema). Now, the output only contains records from the `Customers` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAA0vLzEtRyMxT0HDW0lQoz0gtSlXQUshILFZQ8kgtykvMS0mtUgIA+50LFCQAAAA=" target="_blank">Run the query</a>

```kusto
find in (C*) where * has "Hernandez"
```

### Term lookup across all tables in all databases in the cluster

The query finds all rows from all tables in all databases in which any column includes the word `Kusto`.
This query is a [cross-database](./cross-cluster-or-database-queries.md) query.
The resulting records are transformed according to the [output schema](#output-schema).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0vLzEtRyMxT0EhJLElMSixO1VDXUtfU09JUKM9ILUpV0FLISCxWUPIuLS7JVwIAAccP5C0AAAA=" target="_blank">Run the query</a>

```kusto
find in (database('*').*) where * has "Kusto"
```

### Term lookup across all tables and databases matching a name pattern in the cluster

The query finds all rows from all tables whose name starts with `K` in all databases whose name start with `B` and in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0vLzEtRyMxT0EhJLElMSixO1VAK1lLS1HPW0lQoz0gtSlXQUshILFZQ8i4tLslXAgCcXznPLwAAAA==" target="_blank">Run the query</a>

```kusto
find in (database("S*").C*) where * has "Kusto"
```

### Term lookup in several clusters

The query finds all rows from all tables whose name starts with `K` in all databases whose name start with `B` and in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

```kusto
find in (cluster("cluster1").database("B*").K*, cluster("cluster2").database("C*".*))
where * has "Kusto"
```

::: zone-end

::: zone pivot="azuremonitor"

### Term lookup across all tables

The query finds all rows from all tables in which any column includes the word `Kusto`.
The resulting records are transformed according to the [output schema](#output-schema).

```kusto
find "Kusto"
```

::: zone-end

## Examples of `find` output results  

The following examples show how `find` can be used over two tables: *EventsTable1* and *EventsTable2*.
Assume we have the next content of these two tables:

### EventsTable1

|Session_Id|Level|EventText|Version
|---|---|---|---|
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Text1|v1.0.0
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Text2|v1.0.0
|28b8e46e-3c31-43cf-83cb-48921c3986fc|Error|Some Text3|v1.0.1
|8f057b11-3281-45c3-a856-05ebb18a3c59|Information|Some Text4|v1.1.0

### EventsTable2

|Session_Id|Level|EventText|EventName
|---|---|---|---|
|f7d5f95f-f580-4ea6-830b-5776c8d64fdd|Information|Some Other Text1|Event1
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Other Text2|Event2
|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Other Text3|Event3
|15eaeab5-8576-4b58-8fc6-478f75d8fee4|Error|Some Other Text4|Event4

### Search in common columns, project common and uncommon columns, and pack the rest  

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

### Search in common and uncommon columns

```kusto
find Version == 'v1.0.0' or EventName == 'Event1' project Session_Id, EventText, Version, EventName
```

**Output**

|source_|Session_Id|EventText|Version|EventName|
|---|---|---|---|---|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Some Text1|v1.0.0
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Some Text2|v1.0.0
|EventsTable2|f7d5f95f-f580-4ea6-830b-5776c8d64fdd|Some Other Text1||Event1

Note: in practice, *EventsTable1* rows will be filtered with ```Version == 'v1.0.0'``` predicate and *EventsTable2* rows will be filtered with ```EventName == 'Event1'``` predicate.

### Use abbreviated notation to search across all tables in the current database

```kusto
find Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e'
```

**Output**

|source_|Session_Id|Level|EventText|pack_|
|---|---|---|---|---|
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Text1|{"Version":"v1.0.0"}
|EventsTable1|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Text2|{"Version":"v1.0.0"}
|EventsTable2|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Information|Some Other Text2|{"EventName":"Event2"}
|EventsTable2|acbd207d-51aa-4df7-bfa7-be70eb68f04e|Error|Some Other Text3|{"EventName":"Event3"}

### Return the results from each row as a property bag

```kusto
find Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e' project pack_all()
```

**Output**

|source_|pack_|
|---|---|
|EventsTable1|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Information", "EventText":"Some Text1", "Version":"v1.0.0"}
|EventsTable1|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error", "EventText":"Some Text2", "Version":"v1.0.0"}
|EventsTable2|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Information", "EventText":"Some Other Text2", "EventName":"Event2"}
|EventsTable2|{"Session_Id":"acbd207d-51aa-4df7-bfa7-be70eb68f04e", "Level":"Error", "EventText":"Some Other Text3", "EventName":"Event3"}

## Examples of cases where `find` will act as `union`

### Using a non-tabular expression as find operand

```kusto
let PartialEventsTable1 = view() { EventsTable1 | where Level == 'Error' };
find in (PartialEventsTable1, EventsTable2) 
     where Session_Id == 'acbd207d-51aa-4df7-bfa7-be70eb68f04e'
```

### Referencing a column that appears in multiple tables and has multiple types

Assume we've created two tables by running:

```kusto
.create tables 
  Table1 (Level:string, Timestamp:datetime, ProcessId:string),
  Table2 (Level:string, Timestamp:datetime, ProcessId:int64)
```

* The following query will be executed as `union`.

```kusto
find in (Table1, Table2) where ProcessId == 1001
```

The output result schema will be *(Level:string, Timestamp, ProcessId_string, ProcessId_int)*.

* The following query will also be executed as `union`, but will produce a different result schema.

```kusto
find in (Table1, Table2) where ProcessId == 1001 project Level, Timestamp, ProcessId:string 
```

The output result schema will be *(Level:string, Timestamp, ProcessId_string)*
