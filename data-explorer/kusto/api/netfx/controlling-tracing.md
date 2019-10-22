---
title: Controlling or suppressing Kusto SDK client side tracing - Azure Data Explorer | Microsoft Docs
description: This article describes Controlling or suppressing Kusto SDK client side tracing in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018

---
# Controlling or suppressing Kusto SDK client side tracing

The Kusto Client Libraries use a common platform for tracing. The platform uses a large number
of trace sources (`System.Diagnostics.TraceSource`), each connected to the default set of
trace listeners (`System.Diagnostics.Trace.Listeners`) during its construction.

One implication of this is that if an application has trace listeners associated
with the default `System.Diagnostics.Trace` instance
(for example, through its `app.config` file), then the Kusto Client Libraries will emit traces to
those listeners.

This behavior can be suppressed or controlled programmatically or through
a config file.

## Suppress tracing programmatically

To suppress tracing from the Kusto client libraries programmatically,
invoke the following piece of code early on when loading
the relevant library:

```csharp
Kusto.Cloud.Platform.Utils.TraceSourceManager.SetTraceVerbosityForAll(
    Kusto.Cloud.Platform.Utils.TraceVerbosity.Fatal
    );
```

## Suppressing tracing by using a config file

To suppress tracing from the Kusto client libraries through
a config file, modify the file `Kusto.Cloud.Platform.dll.tweaks`
(which is included with the `Kusto.Data` library) so that the
appropriate "tweak" now reads:

```xml
    <!-- Overrides the default trace verbosity level -->
    <add key="Kusto.Cloud.Platform.Utils.Tracing.OverrideTraceVerbosityLevel" value="0" />
```

(Note that for the tweak to take effect there needs to be no
minus sign in the value of `key`.)

An alternative means is to do the following:

```csharp
Kusto.Cloud.Platform.Utils.Anchor.Tweaks.SetProgrammaticAppSwitch(
    "Kusto.Cloud.Platform.Utils.Tracing.OverrideTraceVerbosityLevel",
    "0"
    );
```

## How to enable the Kusto client libraries tracing

To enable tracing out of the Kusto client libraries, enable .NET tracing
in your application's app.config file. For example, assuming that the application
`MyApp.exe` is using the Kusto.Data client library. Then changing the file
`MyApp.exe.config` to include the following will enable Kusto.Data tracing
the next time that the application starts:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.diagnostics>
    <trace indentsize="4">
      <listeners>
        <add type="Kusto.Cloud.Platform.Utils.RollingCsvTraceListener2, Kusto.Cloud.Platform" name="RollingCsvTraceListener" initializeData="RollingLogs" />
        <remove name="Default" />
      </listeners>
    </trace>
  </system.diagnostics>
</configuration>
``` 

This will configure a trace listener that writes to CSV files in a sub-directory
called `RollingLogs` located in the process' directory. (Of course, any .NET-compatible
trace listener class may be used as well.) 

## How to enable the AAD client libraries (ADAL) tracing

Once the tracing for the Kusto client libraries are enabled, so are the tracing
emitted by the AAD client libraries (the Kusto client libraries automatically
configure ADAL tracing)

