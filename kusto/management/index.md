---
title:  Management commands overview
description:  This article describes management commands.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Management commands overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This article describes the management commands, also known as control commands, used to manage Kusto.
Management commands are requests to the service to retrieve information that is
not necessarily data in the database tables, or to modify the service state, etc.

## Differentiating management commands from queries

Kusto uses three mechanisms to differentiate queries and management commands: at the language
level, at the protocol level, and at the API level. This is done for security
purposes.

At the language level, the first character of the text of a request determines
if the request is a management command or a query. Management commands must start with
the dot (`.`) character, and no query may start by that character.

At the protocol level, different HTTP/HTTPS endpoints are used for control
commands as opposed to queries.

At the API level, different functions are used to send management commands as opposed
to queries.

## Combining queries and management commands

Management commands can reference queries (but not vice-versa) or other management commands.
There are several supported scenarios:

* **AdminThenQuery**: A management command is executed, and its result (represented
   as a temporary data table) serves as the input to a query.
* **AdminFromQuery**: Either a query or a `.show` admin command is executed,
   and its result (represented as a temporary data table) serves as the input to
   a management command.

Note that in all cases, the entire combination is technically a management command,
not a query, so the text of the request must start with a dot (`.`) character,
and the request must be sent to the management endpoint of the service.

Also note that [query statements](../query/statements.md) appear within the query
part of the text (they can't precede the command itself).

>[!NOTE]
> We recommend limiting the usage of *AdminThenQuery* operations.


**AdminThenQuery** is indicated in one of two ways:

* By using a pipe (`|`) character, the query therefore treats the results of the
   management command as if it were any other data-producing query operator.
* By using a semicolon (`;`) character, which then introduces the results of the
   management command into a special symbol called `$command_results`, that one may then
   use in the query any number of times.

For example:

```kusto
// 1. Using pipe: Count how many tables are in the database-in-scope:
.show tables
| count

// 2. Using semicolon: Count how many tables are in the database-in-scope:
.show tables;
$command_results
| count

// 3. Using semicolon, and including a let statement:
.show tables;
let useless=(n:string){strcat(n,'-','useless')};
$command_results | extend LastColumn=useless(TableName)
```

**AdminFromQuery** is indicated by the `<|` character combination. For example,
in the following we first execute a query that produces a table with a single
column (named `str` of type `string`) and a single row, and write it as the table
name `MyTable` in the database in context:

```kusto
.set MyTable <|
let text="Hello, World!";
print str=text
```


