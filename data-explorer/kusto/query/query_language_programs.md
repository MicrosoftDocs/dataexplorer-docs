# Programs

There are two kinds of Azure Log Analytics "programs": **queries** and **control commands**.

## Queries

Queries are read-only requests to retrieve and process data stored by Azure Log Analytics.
For example, the query `Logs | where Level == "Critical" | count` counts how many
records in the table `Logs` of the database in scope has their `Level` column equal
to the string `Critical`.

Queries may start with a whitespace character (` `, a newline, or a carriage-return),
a slash (`/`), a numeric character, a letter character, or a left-bracket character
(`[`).

## Control Commands

Control commands are read/write requests to manipulate data and metadata
in Azure Log Analytics. For example, the control command
`.create table Logs (Level:string, Text:string)` creates a new
table in the database-in-scope, having the name `Logs` and two columns of type `string`:
`Level` and `Text`.

All control commands that start with the text `.show` form together a special read-only subset of control
commands (sometimes called **metadata queries**). For example, the `.show tables`
control command/metadata query returns a list of all the tables in the database-in-scope.

## Combining Control Commands and Queries

Control commands can reference queries (but no vice-versa) or other control commands.
There are several supported scenarios:

1. **AdminThenQuery**: A control command is executed, and its results are then treated as a data table
   and processed by a trailing query.
2. **AdminFromQuery**: Either a query or a `.show` admin command is executed, and its results are then treated as a data table
   and used by a control command.

Note that in all cases, the control command comes first in the program text,
and the program is considered to be an control command, not a query (because
it starts with a dot character).

**AdminThenQuery** is indicated in one of two ways:

1. By using a pipe (`|`) character, which then has the query treat the results of the
   control command as if it were any other data-producing query operator.
2. By using a semicolon (`;`) character, which then introduces the results of the
   control command into a special symbol called `$command_results` that one may then
   use in the query any number of times.

For example:

<!-- csl -->
```
// 1. Using pipe: Count how many tables are in the database-in-scope:
.show tables | count

// 2. Using semicolon: Count how many tables are in the database-in-scope:
.show tables; $command_results | count
```

**AdminFromQuery** is indicated by the `<|` character combination. For example,
in the following we first execute a query that produces a table with a single
column (named `str` of type `string`) and a single row, and write it as the table
name `MyTable` in the database in context:

<!-- csl -->
```
.set MyTable <| print str="Hello, World!"
```
