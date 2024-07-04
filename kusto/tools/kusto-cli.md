---
title:  Kusto CLI
description:  This article describes Kusto CLI.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/24/2020
---
# Kusto CLI

Kusto.Cli is a command-line utility for sending queries and control commands
on a Kusto cluster. It can run in one of several modes:

* *REPL mode*: The user enters queries and commands,
  and the tool displays the results, then awaits the next user query/command.
  ("REPL" stands for "read/eval/print/loop".)

* *Execute mode*: The user enters one or more queries and commands to run
  as command-line arguments. The arguments are automatically run in sequence,
  and their results output to the console. Optionally, after all the input
  queries and commands have run, the tool goes into REPL mode.

* *Script mode*: Similar to execute mode, but with the queries and commands specified
  in a file (the "script") instead of through command-line arguments.

Kusto.Cli is primarily provided for automating tasks against a Kusto service
that normally requires writing code. For example, a C# program or a
PowerShell script.

## Get the tool

Kusto.Cli is part of the NuGet package `Microsoft.Azure.Kusto.Tools` that you can download for [.NET](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/). After you download the package, extract the package's `tools` folder to the target folder. No additional installation is required because it's xcopy-installable.

## Run the tool

Kusto.Cli requires at least one command-line argument to run. Usually, that argument
is the connection string to the Kusto service that the tool should connect to.
For more information, see [Kusto connection strings](../api/connection-strings/kusto.md). If you run the tool without command-line arguments, with an unknown set of arguments, or with the `/help` switch, a help message will display on the console.

For example, use the following command to run Kusto.Cli. The command will connect to the `help` Kusto service, and set the database context to the `Samples` database:

```
Kusto.Cli.exe "https://help.kusto.windows.net/Samples;Fed=true"
```

> [!NOTE]
> Use double-quotes around the connection string to prevent
> shell applications such as PowerShell from mis-interpreting the semicolon (`;`)
> and similar characters.

## Command-line arguments

(To get an exhaustive list of command-line arguments, run: `Kusto.Cli.exe -help`.)

`Kusto.Cli.exe` *ConnectionString* [*Switches*]

*ConnectionString*
* The [Kusto connection string](../api/connection-strings/kusto.md)
  that holds all the Kusto connection information.
  Defaults to `net.tcp://localhost/NetDefaultDB`.

`-execute:`*QueryOrCommand*
* If specified, runs Kusto.Cli in execute mode and the specified query or command
  is run. This switch can repeat, and the queries/commands are run
  sequentially in order of appearance.
  This switch can't be used together with `-script` or `-scriptml`.

`-keepRunning:`*EnableKeepRunning*
* If specified, as either `true` or `false`, it enables or disables REPL mode after all `-script` or `-execute` values have been processed.

`-script:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode. The specified script file is
  loaded and the queries or commands in it are run sequentially.
  Newlines are used to delimit queries/commands, except when lines end with a
  `&` or `&&` combination, as explained below.
  This switch can't be used together with `-execute`.

`-scriptml:`*ScriptFile*
* If specified, runs Kusto.Cli in script mode. The specified script file is
  loaded and the queries or commands in it are run sequentially.
  The entire script file is considered a single query or command
  (ignoring line input mode or block input mode considerations.)
  This switch can't be used together with `-execute`.

`-scriptQuitOnError:`*QuitOnFirstScriptError*
* If enabled, Kusto.Cli will quit if a command or query in a script
  results with an error. If disabled, script execution will continue
  despite errors. By default this switch is enabled.

`-echo:`*EnableEchoMode*
* If specified, as either `true` or `false`, it enables or disables echo mode.
  When echo mode is enabled, every query or command is repeated in the output.

`-transcript:`*TranscriptFile*  
* If specified, writes program output to *TranscriptFile*.

`-logToConsole:`*EnableLogToConsole*
* If specified, as either `true` or `false`, it enables or disables
  displaying the program output on the console.

`-lineMode:`*EnableLineMode*
* Determines how newlines are treated when inputting queries or command from the console
  or from scripts. By default (or if set explicitly to `true`),
  the tool uses "line input mode". If set to `false`, scripts are read in "block input mode."
  See below for an explanation of these two modes.

**Example**

```
Kusto.Cli.exe "https://help.kusto.windows.net/Samples;Fed=true" -script:"c:\mycommands.txt"
```

> [!NOTE]
> There should be no space between the colon and the argument value

## Directives

Kusto.Cli runs a number of directives in the tool
instead of sending them to the service for processing.

|Directive                      |Description|
|-------------------------------|-----------|
|`?`<br>`#h`<br>`#help`         |Get a short help message|
|`q`<br>`#quit`<br>`#exit`      |Exit the tool|
|`#a`<br>`#abort`               |Exit the tool abortively|
|`#clip`                        |The results of the next query or command will be copied to the clipboard|
|`#cls`                         |Clear the console screen|
|`#connect` *[ConnectionString*]|Connects to a different Kusto service (if *ConnectionString* is omitted, the current one will be displayed)|
|`#crp` [*Name* [`=` *Value*]]   |Sets the value of a client request property, or just displays it, or displays all values|
|`#crp` (`-list` \| `-doc`) [*Prefix*]|Lists client request properties, by prefix, or all|
|`#dbcontext` [*DatabaseName*]  |Changes the "context" database used by queries and commands to *DatabaseName*. If omitted, the current context displays|
|`ke` *Text*                    |Sends the specified text to a running Kusto.Explorer process|
|`#loop` *Count* *Text*         |Runs the text a number of times|
|`#qp` [*Name* [`=` *Value*]]   |Sets the value of a query parameter, or just displays it, or displays all values. Single/double quotes at beginning/end will be trimmed|
|`#save` *Filename*             |The results of the next query or command will be saved to the indicated CSV file|
|`#script` *Filename*           |Executes the indicated script|
|`#scriptml` *Filename*         |Executes the indicated multiline script|

## Line input mode and block input mode

By default, Kusto.Cli runs in **line input mode**. Each newline character is interpreted as a delimiter between queries/commands, and the line is immediately sent for execution.

In this mode, you can break a long query or command into multiple lines. The `&` character as the last character of a line, before the newline, causes Kusto.Cli to continue reading the next line. The `&&` character as the last character of a line, before the newline, causes Kusto.Cli to ignore the newline and continue reading the next line.

Kusto.Cli also supports running in **block input mode** by specifying
`-lineMode:false` in the command line, or by executing the directive
`#blockmode`. In this mode, Kusto.Cli behaves in a similar way to Kusto.Explorer
and Kusto.WebExplorer, in that lines are read together as "blocks", with each block
consisting of a single query or command, and blocks are delimited by one or more
empty lines between them.

> [!NOTE]
> The use of **block input mode** is highly recommended when queries/commands
> are read from a script file (`-script`).

## Comments

Kusto.Cli interprets a `//` string that begins new line as a comment line. It
ignores the rest of the line and continues reading the next line.

## Tool-only options

Commands                        | Effect                                                                            | Currently
--------------------------------|-----------------------------------------------------------------------------------|-----------
#timeon\|#timeoff                | enable/disable option `timing`: Display the time requests took                    | TRUE
#tableon\|#tableoff              | enable/disable option `tableView`: Format results sets as tables                  | TRUE
#marson\|#marsoff                | enable/disable option `marsView`: Display the second-to-last result sets          | FALSE
#resultson\|#resultsoff          | enable/disable option `outputResultsSet`: Display the result sets                 | TRUE
#prettyon\|#prettyoff            | enable/disable option `prettyErrors`: Clean up errors                             | TRUE
#markdownon\|#markdownoff        | enable/disable option `markdownView`: Format tables as MarkDown                   | FALSE
#progressiveon\|#progressiveoff  | enable/disable option `progressiveView`: Ask for and display progressive results  | FALSE
#linemode\|#blockmode            | enable/disable option `lineMode`: Single-line input mode                          | TRUE

Commands                              | Effect                                                                                                         | Default
--------------------------------------|----------------------------------------------------------------------------------------------------------------|-----------
#cridon\|#cridoff                      | (enable\|disable option `crid`: Display the ClientRequestId before sending the request)                          | FALSE
#csvheaderson\|#csvheadersoff          | (enable\|disable option `csvHeaders`: Include headers in CSV output)                                            | TRUE
#focuson\|#focusoff                    | (enable\|disable option `focus`: Remove all the extra fluff and focus on the right stuff)                        | FALSE
#linemode\|#blockmode                  | (enable\|disable option `lineMode`: Single-line input mode)                                                      | TRUE
#markdownon\|#markdownoff              | (enable\|disable option `markdownView`: Format tables as MarkDown)                                              | FALSE
#marson\|#marsoff                      | (enable\|disable option `marsView`: Display the second-to-last result sets)                                      | FALSE
#prettyon\|#prettyoff                  | (enable\|disable option `prettyErrors`: Clean up errors)                                                        | TRUE
#querystreamingon\|#querystreamingoff  | (enable\|disable option `queryStreaming`: Use the queryStreaming endpoint (Kusto team only))                    | FALSE
#resultson\|#resultsoff                | (enable\|disable option `outputResultsSet`: Display the result sets)                                            | TRUE
#tableon\|#tableoff                    | (enable\|disable option `tableView`: Format results sets as tables)                                              | TRUE
#timeon\|#timeoff                      | (enable\|disable option `timing`: Display the amount of time that the requests took)                               | TRUE
#typeon\|#typeoff                      | (enable\|disable option `typeView`: Display the type of each column in table view. Forces Streaming=true)| TRUE
#v2protocolon\|#v2protocoloff          | (enable\|disable option `v2protocol`: Use the v2 query protocol, not v1)                                        | TRUE

## Use Kusto.Cli to export results as CSV

Kusto.Cli has a special client-side command, `#save` that exports the **next**
query results to a local file in CSV format. For example, the following line will 
export 10 records out of the `StormEvents` table
into the `help.kusto.windows.net` cluster, `Samples` database:

```
Kusto.Cli.exe @help/Samples -execute:"#save c:\temp\test.log" -execute:"StormEvents | take 10"
```

## Use Kusto.Cli to control a running instance of Kusto.Explorer

You can instruct Kusto.Cli to communicate with the "primary" instance
of Kusto.Explorer running on the machine, and send it queries. This mechanism can be useful for programs that want to run a number of queries, but don't want to start the Kusto.Explorer process repeatedly. In the following
example, Kusto.Cli is used to run a query against the help cluster:

```
#connect cluster('help').database('Samples')

#ke StormEvents | count
```

The syntax is simple: `#ke`, followed by whitespace, and the query to run.
The query is then sent to the primary instance of Kusto.Explorer, if one exists,
with the current cluster/database set in Kusto.Cli.
 
