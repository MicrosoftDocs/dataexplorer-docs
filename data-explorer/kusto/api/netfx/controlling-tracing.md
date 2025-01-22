---
title:  Control and suppress SDK client side tracing
description: This article describes controlling and suppressing SDK client-side tracing.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 08/11/2024
---
# Controlling and suppressing Kusto SDK client-side tracing

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The Kusto client libraries are instrumented to writer traces to local files.
The tracing mechanism is disabled by default, and can be enabled programmatically.

## Enabling tracing

To enable tracing, execute the following code:

```csharp
using Kusto.Cloud.Platform.Utils; // Requires Nuget package Microsoft.Azure.Kusto.Cloud.Platform.

var manifest = new RollingCsvTraceListener2Manifest
{
  TracesLocalRootPath=@"c:\temp" // The folder to which trace files will be  written
};
RollingCsvTraceListener2.CreateAndInitialize(manifest);
TraceSourceManager.StartupDone();
```

## Controlling trace level

Each trace source in the library can have its own default verbosity level.
A trace source will only write to file traces whose verbosity is equal to or above its verbosity level.
To control the verbosity of all trace sources, the following code can be called
(for example, here we're forcing all trace sources to write all traces to files):

```csharp
using Kusto.Cloud.Platform.Utils; // Requires Nuget package Microsoft.Azure.Kusto.Cloud.Platform.

TraceSourceManager.SetOverrideTraceVerbosityLevel(TraceVerbosity.Verbose);
```

Using this with `TraceVerbosity.Fatal` as an argument stops writing
all traces except the most severe.

## Flushing any pending traces

To force all pending traces to be flushed to files, and "recycle" all files,
use the following code. It's recommended that this be done when the application
hosting the trace system is closed (it can be done safely even if the tracing system
is never initialized.)

```csharp
TraceSourceManager.SuperFlush(SuperFlushMode.Emergency);
```

## Enable MSAL (Microsoft Authentication Library) tracing

Once tracing for client libraries is enabled, tracing for [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview) is enabled automatically.

## Reading trace files

Trace files are written to the folder indicated when the tracing system is initialized
(or subfolders in that folder), and are formatted as CSV files with the `.csv` extension.
Files that are being actively written-to have the extension `.csv.in-progress`
(and automatically renamed once they're sealed.)

Each record in every trace file consists of several fields. The second is the
timestamp of the trace record; the third is the trace source name; the fourth is the trace level,
and the last is the textual content of the trace record.
