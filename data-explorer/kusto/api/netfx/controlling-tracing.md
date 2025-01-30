---
title:  Control and suppress SDK client side tracing
description: This article describes controlling and suppressing SDK client-side tracing.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 01/30/2025
---
# Controlling and suppressing Kusto SDK client-side tracing

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The Kusto client libraries are instrumented to write traces to local files. By default, the tracing mechanism is disabled, but can be enabled programmatically.

## Enable tracing

You can enable tracing in a Kusto client application using the `Kusto.Cloud.Platform.Utils` namespace. Make sure you have the `Microsoft.Azure.Kusto.Cloud.Platform` [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Cloud.Platform/) installed. Then run the following code to enable tracing:

```csharp
using Kusto.Cloud.Platform.Utils; // Requires the NuGet package, Microsoft.Azure.Kusto.Cloud.Platform.

var manifest = new RollingCsvTraceListener2Manifest
{
  TracesLocalRootPath=@"c:\temp" // The folder where trace files will be written.
};
RollingCsvTraceListener2.CreateAndInitialize(manifest);
TraceSourceManager.StartupDone();
```

## Control trace level

Each trace source in the library can have its own default verbosity level. A trace source only writes to file traces whose verbosity is equal to or above its own verbosity level. You can control the verbosity of the trace sources. The following example sets the verbosity level for all trace sources to `Verbose`, ensuring that all traces are written to files:

```csharp
using Kusto.Cloud.Platform.Utils; // Requires the NuGet package, Microsoft.Azure.Kusto.Cloud.Platform.

TraceSourceManager.SetOverrideTraceVerbosityLevel(TraceVerbosity.Verbose);
```

Use the `TraceVerbosity.Fatal` argument to trace only the most severe events.

## Flush all pending traces

Flushing pending trace is recommended when the application hosting the trace system is closed to ensure unwritten traces are saved. It can be done safely even if the tracing system isn't initialized. The following code forces all pending traces to flush to files and recycle all files:

```csharp
TraceSourceManager.SuperFlush(SuperFlushMode.Emergency);
```

## Enable MSAL (Microsoft Authentication Library) tracing

 Enabling tracing for client libraries automatically enables tracing for [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview).

## Read trace files

Once the tracing system is initialized,  trace files are written to the specified folder or its subfolders. They're formatted as CSV files with the `.csv` extension. Files that are currently being written use the extension `.csv.in-progress` and are automatically renamed once they're completed.

Each trace file record includes the following fields:

* **Trace record identifier:** Uniquely identifies each trace record.
* **Timestamp:** The timestamp of the trace record.
* **Trace source name:** The name of the trace source.
* **Trace level:** The verbosity level of the trace.
* **Textual content:** The trace record content.