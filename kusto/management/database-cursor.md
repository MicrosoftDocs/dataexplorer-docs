---
title: Database cursors
description: Learn how to use database cursors to query a database multiple times.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/14/2023
---
# Database cursors

A **database cursor** is a database-level object that lets you query a database multiple times. You get consistent results even if there are `data-append` or `data-retention` operations happening in parallel with the queries.

Database cursors are designed to address two important scenarios:

* The ability to repeat the same query multiple times and get the same results,
  as long as the query indicates "same data set".

* The ability to make an "exactly once" query. This query only "sees" the
   data that a previous query didn't see, because the data wasn't available then.
   The query lets you iterate, for example, through all the newly arrived data in a table without fear of processing the same record twice or skipping records by mistake.

The database cursor is represented in the query language as a scalar value of type
`string`. The actual value should be considered opaque and there's no support
for any operation other than to save its value or use the cursor functions
noted below.

## Cursor functions

Kusto provides three functions to help implement the two above scenarios:

* [cursor_current()](../query/cursor-current.md):
   Use this function to retrieve the current value of the database cursor.
   You can use this value as an argument to the two other functions.

* [cursor_after(rhs:string)](../query/cursor-after-function.md):
   This special function can be used on table records that have the
   [IngestionTime policy](show-table-ingestion-time-policy-command.md) enabled. It returns
   a scalar value of type `bool` indicating whether the record's `ingestion_time()`
   database cursor value comes after the `rhs` database cursor value.

* [cursor_before_or_at(rhs:string)](../query/cursor-before-or-at-function.md):
   This special function can be used on the table records that have the
   [IngestionTime policy](show-table-ingestion-time-policy-command.md) enabled. It returns
   a scalar value of type `bool` indicating whether the record's `ingestion_time()`
   database cursor value comes before or at the `rhs` database cursor value.

The two special functions (`cursor_after` and `cursor_before_or_at`) also have
a side-effect: When they're used, Kusto will emit the **current value of the database cursor** to the `@ExtendedProperties` result set of the query. The property name for the cursor is `Cursor`, and its value is a single `string`. 

For example:

```json
{"Cursor" : "636040929866477946"}
```

## Restrictions

Database cursors can only be used with tables for which the
[IngestionTime policy](show-table-ingestion-time-policy-command.md)
has been enabled. Each record in such a table is associated with the
value of the database cursor that was in effect when the record was ingested.
As such, the [ingestion_time()](../query/ingestion-time-function.md)
function can be used.

The database cursor object holds no meaningful value unless the database has at least one table that has an [IngestionTime policy](show-table-ingestion-time-policy-command.md) defined.
This value is guaranteed to update, as-needed by the ingestion history, into such tables and the queries run, that reference such tables. It might, or might not, be updated in other cases.

The ingestion process first commits the data, so that it's available for querying, and only then assigns an actual cursor value to each record. If you attempt to query for data immediately following the ingestion completion using a database cursor, the results might not yet incorporate the last records added, because they haven't yet been assigned the cursor value. Also, retrieving the current database cursor value repeatedly might return the same value, even if ingestion was done in between, because only a cursor commit can update its value.

Querying a table based on database cursors is only guaranteed to "work" (providing exactly-once guarantees) if the records are ingested directly into that table. If you're using extents commands, such as [move extents](move-extents.md)/[.replace extents](replace-extents.md) to move data into the table, or if you're using [.rename table](rename-table-command.md), then querying this table using database cursors isn't guaranteed to not miss any data. This is because the ingestion time of the records is assigned when initially ingested, and doesn't change during the move extents operation.
Therefore, when the extents are moved into the target table, it's possible that the cursor value assigned to the records in these extents was already processed (and next query by database cursor will miss the new records).

## Example: Processing records exactly once

For a table `Employees` with schema `[Name, Salary]`, to continuously process new records as they're ingested into the table, use the following process:

```kusto
// [Once] Enable the IngestionTime policy on table Employees
.set table Employees policy ingestiontime true

// [Once] Get all the data that the Employees table currently holds 
Employees | where cursor_after('')

// The query above will return the database cursor value in
// the @ExtendedProperties result set. Lets assume that it returns
// the value '636040929866477946'

// [Many] Get all the data that was added to the Employees table
// since the previous query was run using the previously-returned
// database cursor 
Employees | where cursor_after('636040929866477946') // -> 636040929866477950

Employees | where cursor_after('636040929866477950') // -> 636040929866479999

Employees | where cursor_after('636040929866479999') // -> 636040939866479000
```