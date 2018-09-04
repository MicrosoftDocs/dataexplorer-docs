---
title: Engine debugging commands - Azure Kusto | Microsoft Docs
description: This article describes Engine debugging commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Engine debugging commands

The following engine control commands are used for debugging the service.
They are only available to the host running the engine service (such as the
Kusto team itself).

* [.debug](#debug): Run a specific debugging command (enabled in debug builds only).
* [.echo](#echo): Trace a string value.
* [.execute script](#execute-script): Executes a given C# script.
* [.show featureflags](#show-featureflags): Returns the current list of feature flags enabled.
* [.trace](#trace): Set trace verbosity for one or more trace sources.
* [.traceresults](#traceresults): Trace the results of an arbitrary query.

## .debug

The `.debug` command runs a C# fragment on the admin node and returns its results.

> This command is enabled only in debug builds.

**Syntax**

`.#` *C# fragment*

## .echo

The `.echo` command returns the provided string (*Text*) from all the nodes of
the cluster which are currently online at the given level (*Verbosity*).
Additionally, it emits this string to the tracing facility and flushes it
on all those nodes.

**Syntax**

`.echo` [*Verbosity*] *Text*

* *Verbosity*: The verbosity level of the trace. Valid values are: 
  `Critical`, `Error`, `Warning`, `Info`, or `Verbose`.
  This is an optional argument, with the default set to `Info`.
* *Text*: A `string` literal. This is the text to return and send to the
  tracing facility.

## .execute script

The `.execute script` command executes a [Kusto script](https://kusdoc2.azurewebsites.net/docs/concepts/scripts.html).

**Syntax**

`.execute` `script` *ScriptUri*

* *ScriptUri*: A `string` literal pointing at the file holding the script.
  In cloud deployments, this must be a blob Uri, potentially suffixed by either
  the blob account key or a SAS key.

## .show featureflags

The `.show featureflags` command returns the list of feature flags enabled for this cluster.

** Syntax **

`.show` `featureflags`

** Examples **

```kusto
.show featureflags
```

|Name                                        | Value         |
|--------------------------------------------|---------------|
|EnableSelfPrefetcher                        | TriState.True |
|EnableDownloadManagerV3                     | TriState.True |
|EnableSketchCacheExpiry                     | TriState.True |
|UseFabricManagerForFabricServiceResolution  | TriState.True |
|EnableQueryThrottling                       | TriState.True |
|EnableDebugCommand                          | TriState.True |
|UseAzureLeaseBlobDistributedLock            | TriState.True |

## .trace

The `.trace` command modifies the trace verbosity of one or more trace sources.

> [!WARNING]
> This command has a performance impact. Once debugging is
> done the trace verbosity level should be reverted back to the default value.

**Syntax**

`.trace`
`.trace` `all`
`.trace` `all` *TraceVerbosity*
`.trace` *TraceSource*
`.trace` *TraceSource* *TraceVerbosity* 

* *TraceSource*: A `string` literal indicating the trace source. For example:
  `"DN.QueryService"`.
* *TraceVerbosity*: The verbosity level of the trace source. Valid values are:
  `Critical`, `Error`, `Warning`, `Info`, or `Verbose`. Additionally, the special
  value `default` can be used to indicate the default verbosity of the trace
  source.
  This is an optional argument, with the default set to `Info`.


Invoking `.trace` with no arguments returns a table indicating the trace verbosity
of all traces sources in the cluster. This has the alternative syntax
`.trace all`.

Invoking `.trace` with a *TraceSource* and *Verbosity* sets the verbosity of
the indicated source to the indicated level.

```kusto
// Set all trace sources to minimum level
.trace all Fatal

// Return all trace sources to default level
.trace all default
```

## .traceresults

The `.traceresults` command writes the results of a query or a command to the
tracing facility.

**Syntax**

.traceresults *Prefix* `<|` *CommandOrQuery**

* *Prefix*: A `string` literal that will prefix the trace.
* **CommandOrQuery**: The text of the command or query whose results are to
  be traced.

**Example**

```kusto
.traceresults "$$DATA" 
    <| .show database MyDatabase extents 
     | summarize sum(OriginalSize), sum(ExtentSize) by TableName
```

**Output** 

lines in the tracelog - one for each table:

`2015-10-10 10:10:10:01Z CMD.ResultsTraceCommand $$DATA: TableName='TABLE',sum_OriginalSize='15',sum_ExtentSize='17'`