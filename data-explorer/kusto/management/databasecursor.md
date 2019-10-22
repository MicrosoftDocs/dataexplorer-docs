---
title: Database cursors - Azure Data Explorer | Microsoft Docs
description: This article describes Database cursors in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/06/2019

---
# Database cursors

A **database cursor** is a database-level object which makes it possible to
query a database multiple times and get consistent results
even if there are ongoing data-append/data-retention operations happening in
parallel with the queries.

Database cursors are designed to address two important scenarios:

* The ability to repeat the same query multiple times and get the same results,
  as long as the query indicates the "same data set".

* The ability to perform an "exactly-once" query (a query that only "sees" the
   data that a previous query did not see because the data was not available then).
   This allows, for example, to iterate through all the newly-arrived data in a table without
   fear of processing the same record twice or skipping records by mistake.

The database cursor is represented in the query language as a scalar value of type
`string`. The actual value should be considered opaque and there's no support
for any operation other than saving its value and/or using the cursor functions
noted below.

## Cursor functions

Kusto provides three functions to help implement the two scenarios above:

* [cursor_current()](../query/cursorcurrent.md):
   Use this function to retrieve the current value of the database cursor.
   You can use this value as an argument to the two other functions.
   This function also has a synonym, `current_cursor()`.

* [cursor_after(rhs:string)](../query/cursorafterfunction.md):
   This special function can be used on table records that have the
   [IngestionTime policy](ingestiontime-policy.md) enabled. It returns
   a scalar value of type `bool` indicating whether the record's `ingestion_time()`
   database cursor value comes after the `rhs` database cursor value.

* [cursor_before_or_at(rhs:string)](../query/cursorbeforeoratfunction.md):
   This special function can be used on the table records that have the
   [IngestionTime policy](ingestiontime-policy.md) enabled. It returns
   a scalar value of type `bool` indicating whether the record's `ingestion_time()`
   database cursor value comes after the `rhs` database cursor value.

The two special functions (`cursor_after` and `cursor_before_or_at`) also have
a side-effect: When they are used, Kusto will emit the **current value of the database cursor**
to the `@ExtendedProperties` result set of the query. The property name for the
cursor is `Cursor`, and its value is a single `string`. For example:

```json
{"Cursor" : "636040929866477946"}
```

## Restrictions

Database cursors can only be used with tables for which the
[IngestionTime policy](ingestiontime-policy.md)
has been enabled. Each record in such a table is associated with the
value of the database cursor that was in effect when the record was ingested,
and therefore the [ingestion_time()](../query/ingestiontimefunction.md)
function can be used.

The database cursor object holds no meaningful value unless the database has at least one
table that has an [IngestionTime policy](ingestiontime-policy.md) defined.
Additionally, it is only guaranteed that this value gets updated as-needed by the ingestion
history into such tables and the queries run that reference such tables. It might, or might
not, be updated in other cases.

The ingestion process first
commits the data (so that it is available for querying), and only then assigns
an actual cursor value to each record. This means that if one attempts to query
for data immediately following the ingestion completion using a database cursor,
the results might not yet incorporate the last records added, because they have
not been assigned the cursor value yet. Similarly, retrieving the current
database cursor value repeatedly might return the same value (even if ingestion
was done in between) because only cursor commit will update its value.

## Example: Processing of records exactly Once

Assume table `Employees` with schema `[Name, Salary]`.
To continuously process new records as they are ingested into the table,
use the following procedure:

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