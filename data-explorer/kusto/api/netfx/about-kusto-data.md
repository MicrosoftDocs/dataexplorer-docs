---
title: Kusto client library - Azure Data Explorer
description: This article describes Kusto client library in Azure Data Explorer.
ms.reviewer: orspodek
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
control commands by specifying the appropriate Kusto Query Language
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

**Example: Enumerating the accessible databases**

> Note!
> 
> It is essential to properly disposed on unused data readers and clients as they hold network resources.
> 
> Accumulate of unused and undisposed data readers and clients could lead to various network errors or unexpected timeouts. 

```csharp
var kcsb = new KustoConnectionStringBuilder(cluster URI here). WithAadUserPromptAuthentication();
using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
{
    var databasesShowCommand = CslCommandGenerator.GenerateDatabasesShowCommand();
    using (var reader = client.ExecuteControlCommand(databasesShowCommand))
    {
        while (reader.Read())
        {
            Console.WriteLine("DatabaseName={0}", reader.GetString(0));
        }
    }
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
