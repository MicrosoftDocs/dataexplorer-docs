---
title:  Restrict statement
description: Learn how to use the restrict statement to limit tabular views that are visible to subsequent query statements.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Restrict statement

::: zone pivot="azuredataexplorer, fabric"

The restrict statement limits the set of table/view entities which are visible to query statements that follow it. For example, in a database that includes two tables (`A`, `B`), the application can prevent the rest of the query from accessing `B` and only "see" a limited form of table `A` by using a view.

The restrict statement's main scenario is for middle-tier applications that accept queries from users and want to
apply a row-level security mechanism over those queries.
The middle-tier application can prefix the user's query with a **logical model**, a set of let statements defining views that restrict the user's access to data, for example ( `T | where UserId == "..."`). As the last statement being added, it restricts the user's access to the logical model only.

> [!NOTE]
> The restrict statement can be used to restrict access to entities in another database or cluster (wildcards are not supported in cluster names).

## Syntax

`restrict` `access` `to` `(`*EntitySpecifiers*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntitySpecifiers*| `string` | :heavy_check_mark:|One or more comma-separated entity specifiers. The possible values are:<br/>- An identifier defined by a let statement as a tabular view<br/>- A table or function reference, similar to one used by a union statement<br/>- A pattern defined by a pattern declaration<br/>|

> [!NOTE]
>
> * All tables, tabular views, or patterns that aren't specified by the restrict statement become "invisible" to the rest of the query.
> * Let, set, and tabular statements are strung together/separated by a semicolon, otherwise they won't be considered part of the same query.

## Examples

### Let statement

The following example uses a [let statement](./let-statement.md) appearing before `restrict` statement.

```kusto
// Limit access to 'Test' let statement only
let Test = () { print x=1 };
restrict access to (Test);
```

### Tables or functions

The following example uses references to [tables](../management/tables.md) or [functions](../management/functions.md) that are defined in the database metadata.

```kusto
// Assuming the database that the query uses has table Table1 and Func1 defined in the metadata, 
// and other database 'DB2' has Table2 defined in the metadata

restrict access to (database().Table1, database().Func1, database('DB2').Table2);
```

### Patterns

The following example uses wildcard patterns that can match multiples of [let statements](./let-statement.md) or tables/functions.

```kusto
let Test1 = () { print x=1 };
let Test2 = () { print y=1 };
restrict access to (*);
// Now access is restricted to Test1, Test2 and no tables/functions are accessible.

// Assuming the database that the query uses has table Table1 and Func1 defined in the metadata.
// Assuming that database 'DB2' has table Table2 and Func2 defined in the metadata
restrict access to (database().*);
// Now access is restricted to all tables/functions of the current database ('DB2' is not accessible).

// Assuming the database that the query uses has table Table1 and Func1 defined in the metadata.
// Assuming that database 'DB2' has table Table2 and Func2 defined in the metadata
restrict access to (database('DB2').*);
// Now access is restricted to all tables/functions of the database 'DB2'
```

### Prevent user from querying other user data

The following example shows how a middle-tier application can prepend a user's query
with a logical model that prevents the user from querying any other user's data.

```kusto
// Assume the database has a single table, UserData,
// with a column called UserID and other columns that hold
// per-user private information.
//
// The middle-tier application generates the following statements.
// Note that "username@domain.com" is something the middle-tier application
// derives per-user as it authenticates the user.
let RestrictedData = view () { Data | where UserID == "username@domain.com" };
restrict access to (RestrictedData);
// The rest of the query is something that the user types.
// This part can only reference RestrictedData; attempting to reference Data
// will fail.
RestrictedData | summarize MonthlySalary=sum(Salary) by Year, Month
```

```kusto
// Restricting access to Table1 in the current database (database() called without parameters)
restrict access to (database().Table1);
Table1 | count

// Restricting access to Table1 in the current database and Table2 in database 'DB2'
restrict access to (database().Table1, database('DB2').Table2);
union 
    (Table1),
    (database('DB2').Table2))
| count

// Restricting access to Test statement only
let Test = () { range x from 1 to 10 step 1 };
restrict access to (Test);
Test
 
// Assume that there is a table called Table1, Table2 in the database
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
 
// When those statements appear before the command - the next works
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
View1 |  count
 
// When those statements appear before the command - the next access is not allowed
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
Table1 |  count
```

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
