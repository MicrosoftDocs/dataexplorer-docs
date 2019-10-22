---
title: Kusto CLI - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto CLI in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/10/2019

---
# Kusto CLI

Kusto.Cli is a command-line utility that can be used to send requests to
Kusto, and display their results. Kusto.Cli can run in one of several modes:

* *REPL mode*: The user types in queries and commands to run against Kusto,
  and the tool displays the results, then awaits the next user query/command.
  ("REPL" stands for "read/eval/print/loop".)

* *Execute mode*: The user provides one or more queries and commands to execute
  as command-line arguments to the tool. These are run in sequence automatically,
  and their results output to the console. Optionally, having run all the input
  queries and commands, the tool goes into REPL mode.

* *Script mode*: Similar to execute mode, but with the queries and commands specified
  through a file (called "script").

Kusto.Cli is primarily provided for automating tasks against a Kusto service
that would have normally required to write code (e.g. a C# program or a
PowerShell script.)

## Getting the tool

Kusto.Cli is part of the NuGet package `Microsoft.Azure.Kusto.Tools`,
which can be downloaded [here](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
Once downloaded, the package's `tools` folder can be extracted to the target
folder; no additional installation is required (i.e. it is xcopy-installable).

## Running the tool

Kusto.Cli requires at least one command-line argument to run. Usually, that argument
is the connection string to the Kusto service that the tool should connect to;
see [Kusto connection strings](../api/connection-strings/kusto.md). Running
the tool with no command-line arguments, or with an unknown set of arguments, or with 
the `/help` switch, results in a help message being emitted to the console.

For example, use the following command to run Kusto.Cli and connect to the `help`
Kusto service, and set the database context to the `Samples` database:

```
Kusto.Cli.exe "https://help.kusto.windows.net/Samples;Fed=true"
```

> [!NOTE]
> We have used quotes around the connection string to prevent
> shell applications, such as PowerShell, from interpreting the semicolon (`;`)
> and similar characters in the connection string.

## Command-line arguments

`Kusto.Cli.exe` *ConnectionString* [*Switches*]

*ConnectionString*
* The [Kusto connection string](../api/connection-strings/kusto.md)
  that holds all the Kusto connection information.
  Defaults to `net.tcp://localhost/NetDefaultDB`.

`-execute:`*QueryOrCommand*
* If specified, runs Kusto.Cli in execute mode; the specified query or command
  is run. This switch can repeat, in which case the queries/commands are run
  sequentially in order of appearance.
  This switch cannot be used together with `-script` or `-scriptml`.

`-keepRunning:`*EnableKeepRunning*
* If specified (as either `true` or `false`), enables or disables switching to
  REPL mode after all `-script` or `-execute` values have been processed.

`-script:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode; the specified script file is
  loaded and the queries or commands in it are run sequentially.
  Newlines are used to delimit queries/commands, except when lines end with
  `&` or `&&` combinations, as explained below.
  This switch cannot be used together with `-execute`.

`-scriptml:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode; the specified script file is
  loaded and the queries or commands in it are run sequentially.
  The entire script file is considered a single query or command.
  This switch cannot be used together with `-execute`.

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

## Directives

Kusto.Cli supports a number of directives that executes in the tool
rather than being sent to the service for processing:

|Directive                      |Description|
|-------------------------------|-----------|
|`?`<br>`#h`<br>`#help`         |Get a short help message.|
|`q`<br>`#quit`<br>`#exit`      |Exit the tool.|
|`#a`<br>`#abort`               |Exit the tool abortively.|
|`#clip`                        |The results of the next query or command will be copied to the clipboard.|
|`#cls`                         |Clear the console screen.|
|`#connect` *[ConnectionString*]|Connects to a different Kusto service (if *ConnectionString* is omitted, the current one will be displayed.)|
|`#crp` [*Name* [`=` *Value*]]   |Sets the value of a client request property (or just displays it, or displays all values).|
|`#crp` (`-list` | `-doc`) [*Prefix*]|Lists client request properties (by prefix, or all).|
|`#dbcontext` [*DatabaseName*]  |Changes the "context" database used by queries and commands to *DatabaseName* (if omitted, the current context will be displayed.)|
|`ke` *Text*                    |Sends the specified text to a running Kusto.Explorer process.|
|`#loop` *Count* *Text*         |Executes the text a number of times.|
|`#qp` [*Name* [`=` *Value*]]   |Sets the value of a query paramter (or just displayes it, or displays all values). Single/double quotes from beginning/end will be trimmed.|
|`#save` *Filename*             |The results of the next query or command will be saved to the indicated CSV file.|
|`#script` *Filename*           |Executes the indicated script.|
|`#scriptml` *Filename*         |Executes the indicated multiline script.|

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

Commands                              | Effect                                                                                                         | Default
--------------------------------------|----------------------------------------------------------------------------------------------------------------|-----------
#cridon|#cridoff                      | (enable|disable option 'crid': display the ClientRequestId before sending the request)                         | FALSE
#csvheaderson|#csvheadersoff          | (enable|disable option 'csvHeaders': include headers in CSV output)                                            | TRUE
#focuson|#focusoff                    | (enable|disable option 'focus': remove all the extra fluff and focus on the right stuff)                       | FALSE
#linemode|#blockmode                  | (enable|disable option 'lineMode': single-line input mode)                                                     | TRUE
#markdownon|#markdownoff              | (enable|disable option 'markdownView': format tables as MarkDown)                                              | FALSE
#marson|#marsoff                      | (enable|disable option 'marsView': display the 2nd-to-last result sets)                                        | FALSE
#prettyon|#prettyoff                  | (enable|disable option 'prettyErrors': remove unnecessary goo from errors)                                     | TRUE
#querystreamingon|#querystreamingoff  | (enable|disable option 'queryStreaming': use the queryStreaming endpoint (Kusto team only))                    | FALSE
#resultson|#resultsoff                | (enable|disable option 'outputResultsSet': display the result sets)                                            | TRUE
#tableon|#tableoff                    | (enable|disable option 'tableView': format results sets as tables)                                             | TRUE
#timeon|#timeoff                      | (enable|disable option 'timing': display the time requests took)                                               | TRUE
#typeon|#typeoff                      | (enable|disable option 'typeView': display the type of each column in table view (will force Streaming=true))  | TRUE
#v2protocolon|#v2protocoloff          | (enable|disable option 'v2protocol': use the v2 query protocol, not v1)                                        | TRUE

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