---
title: Database Cursor - Azure Kusto | Microsoft Docs
description: This article describes Database Cursor in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Database Cursor

A **database cursor** is a database-level object which makes it possible to
issue multiple queries to Kusto and guarantee consistency between them, despite
possible data-append/data-retention operations being applied to the database
between the queries. In particular, two important scenarios that database cursors
are designed to solve are:

1. The ability to repeat the same query multiple times and get the same results back.
2. The ability to perform an "exactly-once" query (a query that only "sees" the
   data that a previous query did not see because the data was not available then).
   This allows, for example, to iterate through all the newly-arrived data in a table without
   fear of processing the same record twice.

The database cursor is represented in the query language as a scalar value of type
`string`. The actual value should be considered opaque and there's no support
for any operation other than saving its value and/or using the cursor functions
noted below.

## Cursor Functions

Kusto provides three functions to help implement the two scenarios above:

1. [cursor_current()](../query/cursorcurrent.md):
   Use this function to retrieve the current value of the database cursor.
   One can then use this value as the argument to the two other functions.
   This function also has a synonym, `current_cursor()`.

2. [cursor_after(rhs:string)](../query/cursorafterfunction.md):
   This special function can be used on the records of a table that has the
   [IngestionTime policy](ingestiontime-policy.md) enabled. It returns
   a scalar value of type `bool` indicating whether the record's `ingestion_time()`
   database cursor value comes after the `rhs` database cursor value.

3. [cursor_before_or_at(rhs:string)](../query/cursorbeforeoratfunction.md):
   This special function can be used on the records of a table that has the
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

## Example: Exactly Once Processing of Records

Assume table `Employees` with schema `[Name, Salary]`.
In order to continuously process new records as they are ingested into the table,
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