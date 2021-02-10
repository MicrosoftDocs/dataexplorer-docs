---
title: Kusto client library - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto client library in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/15/2020
adobe-target: true
---
# Kusto client library
    
The Kusto Client SDK (Kusto.Data) exposes a programmatic API
similar to ADO.NET, so using it should feel
natural for those experienced with .NET. You create
either a query client (`ICslQueryProvider`) or a control command
provider (`ICslAdminProvider`) from a connection string object
pointing at the Kusto engine service, database, authentication
method, etc. You can then issue data queries or
control commands by specifying the appropriate Kusto query language
string, and get back one or more data tables via the returned
`IDataReader` object.

More concretely, to create an ADO.NET-like client allowing queries against
Kusto, use static methods on the `Kusto.Data.Net.Client.KustoClientFactory`
class. These take the connection string and create a thread-safe, disposable,
client object. (It's strongly recommended that client code does not
create "too many" instances of this object. Instead, client code should create an
object per connection string and hold on to it for as long as necessary.)
This allows the client object to efficiently cache resources.

In general, all methods on the clients are thread-safe with two exceptions: `Dispose`, 
and setter properties. For consistent results, do not invoke either methods
concurrently.

Following are a few examples. Additional samples can be found [here](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client).

**Example: Counting Rows**
 
The following code demonstrates counting the rows of a table named `StormEvents` in a database named `Samples`:

```csharp
var client = Kusto.Data.Net.Client.KustoClientFactory.CreateCslQueryProvider("https://help.kusto.windows.net/Samples;Fed=true");
var reader = client.ExecuteQuery("StormEvents | count");
// Read the first row from reader -- it's 0'th column is the count of records in MyTable
// Don't forget to dispose of reader when done.
```

**Example: Getting diagnostics info from the Kusto cluster**

```csharp
var kcsb = new KustoConnectionStringBuilder(cluster URI here). WithAadUserPromptAuthentication();
using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
{
    var diagnosticsCommand = CslCommandGenerator.GenerateShowDiagnosticsCommand();
    var objectReader = new ObjectReader<DiagnosticsShowCommandResult>(client.ExecuteControlCommand(diagnosticsCommand));
    DiagnosticsShowCommandResult diagResult = objectReader.ToList().FirstOrDefault();
    // DO something with the diagResult    
}
```



## The KustoClientFactory client factory

The static class `Kusto.Data.Net.Client.KustoClientFactory` provides the main entry point for authors
of client code that utilizes Kusto. It provides the following important static methods:

|Method                                      |Returns                                |Used for                                                      |
|--------------------------------------------|---------------------------------------|--------------------------------------------------------------|
|`CreateCslQueryProvider`                    |`ICslQueryProvider`                    |Sending queries to a Kusto engine cluster.                    |
|`CreateCslAdminProvider`                    |`ICslAdminProvider`                    |Sending control commands to a Kusto cluster (of any kind).    |
|`CreateRedirectProvider`                    |`IRedirectProvider`                    |Creating a redirect HTTP response message for a Kusto request.|

