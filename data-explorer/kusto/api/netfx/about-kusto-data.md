---
title:  Kusto client library
description: This article describes Kusto client library in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/20/2023
adobe-target: true
---
# Kusto client library
    
The Kusto Client SDK (Kusto.Data) exposes a programmatic API
similar to ADO.NET, so using it should feel
natural for users experienced with .NET. You create
either a query client (`ICslQueryProvider`) or a management command
provider (`ICslAdminProvider`) from a connection string object
pointing at the Kusto engine service, database, authentication
method, etc. You can then issue data queries or
management commands by specifying the appropriate Kusto Query Language
string, and get back one or more data tables via the returned
`IDataReader` object.
More concretely, to create an ADO.NET-like client allowing queries against
Kusto, use static methods on the `Kusto.Data.Net.Client.KustoClientFactory`
class. These take the connection string and create a thread-safe, disposable,
client object. (It's recommended that client code doesn't
create "too many" instances of this object. Instead, client code should create an
object per connection string and hold on to it for as long as necessary.)
This allows the client object to efficiently cache resources.
In general, all methods on the clients are thread-safe with two exceptions: `Dispose`, 
and setter properties. For consistent results, don't invoke either methods
concurrently.
Following are a few examples. More samples can be found [here](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client).

## Example: Counting Rows

The following code demonstrates counting the rows of a table named `StormEvents` in a database named `Samples`:

```csharp
using var client = KustoClientFactory.CreateCslQueryProvider("https://help.kusto.windows.net/Samples;Fed=true");
using var reader = client.ExecuteQuery("StormEvents | count");
// Read the first row from reader -- it's 0'th column is the count of records in MyTable
if (reader.Read())
{
Console.WriteLine($"RowCount={reader.GetInt64(0)}");
}
```

## Example: Enumerating the accessible databases

> [!NOTE]
> We recommend that data readers and clients are disposed of after use to release network resources. Accumulation of these resources can result in unexpected network errors and timeouts.

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var connectionStringBuilder = new KustoConnectionStringBuilder(kustoUri).WithAadUserPromptAuthentication();
using var client = KustoClientFactory.CreateCslAdminProvider(connectionStringBuilder);
var databasesShowCommand = CslCommandGenerator.GenerateDatabasesShowCommand();
using var reader = client.ExecuteControlCommand(databasesShowCommand);
while (reader.Read())
{
    Console.WriteLine($"DatabaseName={reader.GetString(0)}");
}
```

## The KustoClientFactory client factory

The static class `Kusto.Data.Net.Client.KustoClientFactory` provides the main entry point for authors
of client code that utilizes Kusto. It provides the following important static methods:

|Method                                      |Returns                                |Used for                                                      |
|--------------------------------------------|---------------------------------------|--------------------------------------------------------------|
|`CreateCslQueryProvider`                    |`ICslQueryProvider`                    |Sending queries to a Kusto engine cluster.                    |
|`CreateCslAdminProvider`                    |`ICslAdminProvider`                    |Sending management commands to a Kusto cluster (of any kind).    |
|`CreateRedirectProvider`                    |`IRedirectProvider`                    |Creating a redirect HTTP response message for a Kusto request.|

## Best practices when using the Kusto client library

There are several best practices that are essential for using the Kusto client library
effectively in a demanding environment, for example, when sending a large number of requests to the service
in rapid succession.

### Prefer using a single client instance across many requests

The client providers, meaning all objects returned by `KustoClientFactory`, are built to be
reused again and again by multiple threads concurrently without the need of locks. Furthermore,
these providers all cache essential information returned by the service on first contact. For this reason, we recommend reusing a single
such object instead of creating a new one per request.

### Prefer specifying the database parameter to modifying the DefaultDatabase property

There's a single settable property in client providers (`DefaultDatabase`) that is **not** thread-safe.
The recommendation is to set this property once on creation and never modify it again.
If a single client is used to send requests to multiple databases, prefer indicating the database
by using the methods that take a `database` parameter.

### Dispose of the client and all request results

All disposable objects (the Kusto client itself, and all request results objects,
which implement `IDataReader`) should be disposed once they're no longer needed. This is
essential for scalability, as any "undisposed" request holds on to essential network
resources and doesn't release them until it's either disposed explicitly or garbage-collected.
