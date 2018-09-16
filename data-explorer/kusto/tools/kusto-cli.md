---
title: Kusto CLI - Azure Kusto | Microsoft Docs
description: This article describes Kusto CLI in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto CLI
Kusto.Cli is a command-line utility that can be used to query and control Kusto services.
It can run in several modes:
* *REPL mode*: In this mode, the user types in queries and commands to run against a Kusto
  service, and the tool displays the results. ("REPL" stands for "read/eval/print/loop".)
* *Execute mode*: In this mode, the user provides one or more queries and commands to execute
  when invoking the tool. The tool executes these commands one-by-one, and then quits.
* *Script mode*: In this mode the user provides a script to execute when invoking the tool.
  The script is a file that holds queries and commands. The tool executes the queries and
  commands in the script, and then quits.

Kusto.Cli is primarily provided for automating certain tasks against a Kusto service
that would have normally required to write some code.

## Getting the tool

Kusto.Cli is shipped as an executable (`Kusto.Cli.exe`) and associated libraries.
The tool requires no installation and can be downloaded as part of the `Microsoft.Azure.Kusto.Tools`
NuGet package [here](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
- Once you have the the package downloaded, extract the contents of the *tools* directory in it.


## Running the tool

Kusto.Cli requires at least one command-line argument to run. Usually, that argument
is the connection string to the Kusto cluster that the tool should connect to;
see [Kusto connection strings](../api/connection-strings/kusto.md). Running
the tool with no command-line arguments, or with an unknown set of arguments, or with 
the `/help` switch, results in a help message being emitted to the console.

For example, use the following command to run Kusto.Cli and connect to the Kustolab
cluster. (Since no database is provided by the connection string, the default "NetDefaultDB"
database will be assumed.)

```
Kusto.Cli.exe "https://kustolab.kusto.windows.net/;Fed=true"
```

(Please note that the quotes are not strictly required, except when you
invoke the command from a shell, like PowerShell, that interprets some
characters in the connection string such as the semicolon (`;`) in the
example above.)

## Command-line arguments

`Kusto.Cli.exe` [*ConnectionString*] [*Switches*]

*ConnectionString*
* Indicates the connection string to use when connecting to the Kusto service.
  Defaults to `net.tcp://localhost/NetDefaultDB`.

`-execute:`*QueryOrCommand*
* If specified, runs Kusto.Cli in execute mode; the specified query or command
  is run. This switch can repeat, in which case the queries/commands are run
  sequentially in order of appearance.
  Mutually-exclusive with `-script`.

`-keepRunning:`*EnableKeepRunning*
* If specified (as either `true` or `false`), enables or disables running the
  REPL after all `-script` or `-execute` switches have been processed.

`-script:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode; the specified script file is
  loaded and the queries or commands in it are run sequentially.
  Mutually-exclusive with `-execute`.

`-scriptml:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode; the specified script file can
  have newlines in it, and these are considered a part of the query or command,
  and not terminators.
  Mutually-exclusive with `-execute`.

`-echo:`*EnableEchoMode*
* If specified (as either `true` or `false`), enables or disables echo mode.
  When echo mode is enabled, every query or command is repeated in the output.

`-transcript:`*TranscriptFile*  
* If specified, writes program output to *TranscriptFile*.

`-logToConsole:`*EnableLogToConsole*
* If specified (as either `true` or `false`), enables or disables
  writing program output to the the console.

`-lineMode:`*EnableLineMode*
* If specified, switches between line input mode (the default, or when set to `true`)
  and block input mode (when set to `false`). See below for an explanation of
  these two modes, which determine how newlines are being treated.

**Example**

```
Kusto.Cli.exe "https://kustolab.kusto.windows.net/;Fed=true" -script:"c:\mycommands.txt"
```

Please, note, there should be no space between the colon and the argument value.

## Tool-only commands

Kusto.Cli supports a number of commands that it executes locally instead of
sending to the Kusto service. The commands are:

* `?`, `h`, `help`: Kusto.Cli will write a short help message.
* `q`, `quit`, `exit`: Kusto.cli will shut-down.
* `a`, `abort`: Kusto.Cli will shut-down abortively.
* `cls`: Kusto.Cli will clear the console screen.
* `dbcontext` *DatabaseName*: Will change the "context" database used
  by queries and commands to *DatabaseName*. If the database name is omitted,
  the current context database will be displayed.
* `timeon`: Kusto.Cli will enable timing mode, which displays the total time
  it took for queries and commands to run.
* `timeoff`: Kusto.Cli will disable timing mode.
* `tableon`: Kusto.Cli will enable table view mode, which displays query results
  as a rectangular table.
* `tableoff`: Kusto.Cli will disable table view mode.
* `crp`: Kusto.Cli will dump the current set of ClientRequestProperties options.
* `crp` *Name* *BoolValue*: Kusto.Cli will set the ClientRequestProperties option *Name*
  to the Boolean value *BoolValue*

## Line input mode and block input mode

By default, Kusto.Cli is running in **line input mode**: each newline character is interpreted
as a delimiter between queries/commands, and the line is immediately sent for
execution.

In this mode, it is possible to break a long
query or command into multiple lines. The appearance of the `&` character
as the last character of a line (before the newline) causes Kusto.Cli to
continue reading the next line. The appearance of the `&&` character
as the last character of a line (before the newline) causes Kusto.Cli to
ignore the newline and continue reading the next line.

Alternatively, Kusto.Cli also supports running in **block input mode**: By using
either the command-line switch `-lineMode:false` or by using the command
`#blockmode`, one can instruct Kusto.Cli to assume every line is a continuation
of the previous line, so that queries and commands are delimited by an empty
input line only.

## Comments

Kusto.Cli interprets a `//` string that begins new line as a comment line. It
ignores the rest of the line and continues reading the next line.

## Tool-only options

Commands                        | Effect                                                                            | Currently
--------------------------------|-----------------------------------------------------------------------------------|-----------
#timeon|#timeoff                | enable/disable option 'timing': display the time requests took                    | TRUE
#tableon|#tableoff              | enable/disable option 'tableView': format results sets as tables                  | TRUE
#marson|#marsoff                | enable/disable option 'marsView': display the 2nd-to-last result sets             | FALSE
#resultson|#resultsoff          | enable/disable option 'outputResultsSet': display the result sets                 | TRUE
#prettyon|#prettyoff            | enable/disable option 'prettyErrors': remove unnecessary goo from errors          | TRUE
#markdownon|#markdownoff        | enable/disable option 'markdownView': format tables as MarkDown                   | FALSE
#progressiveon|#progressiveoff  | enable/disable option 'progressiveView': ask for and display progressive results  | FALSE
#linemode|#blockmode            | enable/disable option 'lineMode': single-line input mode                          | TRUE

## Using Kusto.Cli to export results as CSV

Kusto.Cli supports a special client-side command, `#save`, to export the **next**
query results to a local file in CSV format. For example, the following
invocation of Kusto.Cli will export 10 records out of the `StormEvents` table
in the `help.kusto.windows.net` cluster (`Samples` database):

```
Kusto.Cli.exe @help/Samples -execute:"#save c:\temp\test.log" -execute:"StormEvents | take 10"
```

## Using Kusto.Cli to control a running instance of Kusto.Explorer

It is possible to instruct Kusto.Cli to communicate with the "primary" instance
of Kusto.Explorer running on the machine, and send it queries to execute. This
can be very useful for programs that want to run a number of Kusto queries, but
don't want to start the Kusto.Explorer process again and again. In the following
example, Kusto.Cli is used to run a query agains the help cluster:

```
#connect cluster('help').database('Samples')

#ke StormEvents | count
```

The syntax is very simple: `#ke`, followed by whitespace and the query to run.
The query is then sent to the primary instance of Kusto.Explorer (if one exists)
with the current cluster/database set in Kusto.Cli.