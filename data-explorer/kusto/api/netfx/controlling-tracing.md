---
title:  Azure Data Explorer control and suppress SDK client side tracing
description: This article describes controlling and suppressing Azure Data Explorer SDK client-side tracing in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 04/19/2023
---
# Controlling and suppressing Kusto SDK client-side tracing

The Kusto client libraries use a common platform for tracing. The platform uses a large number of trace sources (`System.Diagnostics.TraceSource`), and each is connected to the default set of trace listeners (`System.Diagnostics.Trace.Listeners`) during its construction.

If an application has trace listeners associated with the default `System.Diagnostics.Trace` instance
(for example, through its `app.config` file), then the Kusto client libraries will emit traces to those listeners.

The tracing can be suppressed or controlled programmatically or through a config file.

## Suppress tracing programmatically

To suppress tracing from the Kusto client libraries programmatically, invoke this piece of code when loading the relevant library:

```csharp
TraceSourceManager.SetTraceVerbosityForAll(TraceVerbosity.Fatal);
```

## Use a config file to suppress tracing

To suppress tracing from the client libraries through a config file, modify the file `Kusto.Cloud.Platform.dll.tweaks` (which is included with the `Kusto.Data` library).

```xml
    <!--Overrides the default trace verbosity level-->
    <add key="Kusto.Cloud.Platform.Utils.Tracing.OverrideTraceVerbosityLevel" value="0" />
```

> [!NOTE]
> For the tweak to take effect, there must not be a minus sign in the value of `key`

An alternative, is:

```csharp
Anchor.Tweaks.SetProgrammaticAppSwitch(
    "Kusto.Cloud.Platform.Utils.Tracing.OverrideTraceVerbosityLevel",
    "0"
);
```

## Enable client libraries tracing

To enable tracing out of the client libraries, enable .NET tracing in your application's *app.config file*. For example, assume that the application `MyApp.exe` uses the Kusto.Data client library. Changing file *MyApp.exe.config* to include the following, will enable `Kusto.Data` tracing the next time that the application starts.

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

The code will configure a trace listener that writes to CSV files in a subdirectory called *RollingLogs*. The subdirectory is located in the process' directory.

> [!NOTE]
> Any .NET-compatible trace listener class may be used as well.

## Enable MSAL (Microsoft Authentication Library) tracing

Once tracing for client libraries is enabled, tracing for [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview) is enabled automatically.
