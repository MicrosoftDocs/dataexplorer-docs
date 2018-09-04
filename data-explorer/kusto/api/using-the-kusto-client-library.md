---
title: Using the Kusto Client Library     - Azure Kusto | Microsoft Docs
description: This article describes Using the Kusto Client Library     in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Using the Kusto Client Library    
    
The Kusto Client Library (Kusto.Data) exposes a programmatic API
similar to ADO.NET, so using it should feel
natural for people experienced in .NET. Briefly speaking, one creates
either a query client (`ICslQueryProvider`) or a control command
provider (`ICslAdminProvider`) from a connection string object
pointing at the Kusto engine service, database, authentication
method, etc. This allows one to then issue data queries or
control commands by specifying the appropriate Kusto query language
string, and get back one or more data tables via the returned
`IDataReader` object.

More concretely, to create an ADO.NET-like client allowing queries against
Kusto, one uses static methods on the `Kusto.Data.Net.Client.KustoClientFactory`
class. These take the connection string and create a thread-safe, disposable,
client object. (It is strongly recommended that client code refrains from
creating "too many" instances of this object, and instead create an
object per connection string and hold on to it for as long as it is needed.)
This allows the client object to efficiently cache resources.

In general, all methods on the clients are thread-safe with two exceptions: `Dispose`, 
and setter properties. For consistent results, one should not invoke either methods
concurrently.

The following are a few examples.

**Example: Counting Rows**
 
The following code demonstrates counting the rows of a table called MyTable in the database MyDatabase running locally:

```csharp
var client = Kusto.Data.Net.Client.KustoClientFactory.CreateCslQueryProvider("https://help.kusto.windows.net/Samples;Fed=true");
var reader = client.ExecuteQuery("MyTable | count");
// Read the first row from reader -- it's 0'th column is the count of records in MyTable
// Don't forget to dispose of reader when done.
```

**Example: Getting diagnostics info from the Kusto cluster**

```csharp
var kcsb = new KustoConnectionStringBuilder(cluster URI here);
using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
{
    var diagnosticsCommand = CslCommandGenerator.GenerateShowDiagnosticsCommand();
    var objectReader = new ObjectReader<DiagnosticsShowCommandResult>(client.ExecuteControlCommand(diagnosticsCommand));
    DiagnosticsShowCommandResult diagResult = objectReader.ToList().FirstOrDefault();
    // DO something with the diagResult    
}
```

Additional examples can be found in the [Kusto Code Samples](https://kusdoc2.azurewebsites.net/docs/code/codesamples.html) project.

## The KustoClientFactory client factory

The static class `Kusto.Data.Net.Client.KustoClientFactory` provides the main entry point for authors
of client code that utilizes Kusto. It provides the following important static methods:

|Method                                      |Returns                                |Used for                                                      |
|--------------------------------------------|---------------------------------------|--------------------------------------------------------------|
|`CreateCslQueryProvider`                    |`ICslQueryProvider`                    |Sending queries to a Kusto engine cluster.                    |
|`CreateCslAdminProvider`                    |`ICslAdminProvider`                    |Sending control commands to a Kusto cluster (of any kind).    |
|`CreateRedirectProvider`                    |`IRedirectProvider`                    |Creating a redirect HTTP response message for a Kusto request.|
|`TODO`                                      |`IKustoExplorerCommunicationContract`  |Communicate with a locally-running instance of Kusto.Explorer.|
|`CreateCslQueryMultiProvider`               |`ICslQueryMultiProvider`               |Internal use.|
|`CreateCslStreamIngestClient`               |`IStreamingIngestProvider`             |Internal use.|
|`CreateCslQueryKustoDataStreamMultiProvider`|`ICslQueryKustoDataStreamMultiProvider`|Internal use.|
|`CreateCslAdminMultiProvider`               |`ICslAdminMultiProvider`               |Internal use.|
|`CreateCslDmAdminMultiProvider`             |`ICslAdminMultiProvider`               |Internal use.|
|`CreateCslBridgeAdminMultiProvider`         |`ICslAdminMultiProvider`               |Internal use.|
|`CreateCslCmAdminMultiProvider`             |`ICslAdminMultiProvider`               |Internal use.|
|`CreateCslDmAdminProvider`                  |`ICslAdminProvider`                    |Internal use.|
|`CreateCslCmAdminProvider`                  |`ICslAdminProvider`                    |Internal use.|
|`CreateCslBridgeAdminProvider`              |`ICslAdminProvider`                    |Internal use.|

## Changelog

```text
Version 4.0.2-beta (05 AUG 2018)
* Use priority ranked resources in ingest client

Version 4.0.0 (19 JUL 2018)
* Upgrade WindowsAzure.Storage to version 9.3.0

Version 3.1.4 (15 JUL 2018)
* Bug fix: fix a memory leak when performing dSTS-based authentication.

Version 3.1.3 (09 JUL 2018)
* Better error messages for AAD Application authentication
* Support for overriding dSTS namespace expansion in app.config

Version 3.1.2 (17 JUN 2018)
* Upgrade ADAL's version from 3.19.4 to 3.19.8

Version 3.1.1 (10 JUN 2018)
* Introducing Kusto managed streaming ingest client

Version 3.1.0 (04 JUN 2018)
* Upgrade ADAL's version from 3.16.1 to 3.19.4 in order to support AAD application authentication by subject and issuer names (additional information: http://aadwiki/index.php?title=Subject_Name_and_Issuer_Authentication).
* Support dMSI-based authentication.

Version 3.0.20 (22 MAR 2018)
* Align version number with Kusto.Ingest library.

Version 3.0.19 (21 MAR 2018)
* Kusto.Cloud.Platform.Data.ExtendedDataReader: add support for writing collections to CSV files.

Version 3.0.18 (22 FEB 2018)
* Bug fixes and improvements.

Version 3.0.17 (1 FEB 2018)
* Include missing assemblies in package.

Version 3.0.15 (30 JAN 2018)
* Bug fixes: improve commands generation, improve exceptions phrasing

Version 3.0.14 (31 DEC 2017)
* New: Add support for decimal data type (using SqlDecimal).
* IDataReader implementation: Return "DBNull.Value" for null values, not "null as System.Object".

Version 3.0.9 (08 NOV 2017)
* Add support for EntityNotFoundException.

Version 3.0.8 (01 OCT 2017)
* Support explicit authority ID for AAD user authentication scenario.

Version 3.0.7 (13 SEP 2017)
* Fix hang when issuing multiple async requests requiring AAD authentication

Version 3.0.6 (12 SEP 2017):
* Fix ADAL reference to version 3.16.1.

Version 3.0.5 (10 SEP 2017):
* Upgrade ADAL's version from 3.12.0 to 3.16.1

Version 3.0.4 (06 SEP 2017):
* Support Windows Hello for dSTS-based authentication (for Microsoft internal principals)

Version 3.0.3 (29 AUG 2017):
* CslCommandGenerator.GenerateExtentsDropByTagsCommand(): update to use a more efficient version of ExtentsShowCommand.

Version 3.0.2 (08 AUG 2017):
* Bug fix: Update Newtonsoft.Json dependency to version 10.0.3.

Version 3.0.1 (17 JULY 2017):
* Bug fix: Race condition in TraceSourceBase<> static construction.

Version 3.0.0 (05 JULY 2017):
* Upgrade Newtonsoft.Json to version 10.0.3 and Microsoft.WindowsAzure.Storage to version 8.1.4
* The client returns json errors instead of text errors.
* Client side is streaming.
* Dynamic values are encoded as json values and not strings.
* Boolean values may now be returned as Booleans instead of numbers.
* Strongly-typed clients based on ObjectReader return JSON.NET objects.

Version 2.6.0 (02 JUL 2017):
* Yet another bug fix - .tt file breaks package

Version 2.5.13 (28 JUNE 2017):
* Bug fix - .tt file breaks package

Version 2.5.12 (28 JUNE 2017):
* Bug fix - NullReference in RestClient2

Version 2.5.11 (28 JUNE 2017):
* Bug fix - using ClientRequestProperties.Application/UserName should override KustoConnectionStringBuilder.ApplicationNameForTracing/UserNameForTracing.

Version 2.5.10 (20 JUNE 2017):
* Bug fix - fix hang when running inside 'Orleans' framework

Version 2.5.9 (15 JUNE 2017):
* NetworkCache: Added support for setting timer start refreshing time and cache refreshing timeout.

Version 2.5.8 (08 JUNE 2017):
* Kusto.Cloud.Platform.Data.ObjectReader<T>: Added support for fields of type JToken (or derived).

Version 2.5.6 (22 MAY 2017):
* KCSB - block sending corporate credentials when using basic authentication.

Version 2.5.5 (18 MAY 2017):
* Bug fix (null ref when runnin in Mono).

Version 2.5.4 (7 MAY 2017):
* Extend kusto ingestion error codes with 'NoError'.

Version 2.5.3 (27 APR 2017):
* Add kusto ingestion error codes.

Version 2.5.2 (09 APR 2017):
* Bug fix - support AAD token acquisition based-on application client ID and certificate thumbprint.

Version 2.5.1 (30 MAR 2017):
* Add Kusto Connection String validation.

Version 2.5.0 (16 MAR 2017):
* Target client library to .net 4.5 to enable customers that cannot use higher versions to use Kusto client.

Version 2.4.9 (13 FEB 2017):
* Support AAD Multi-Tenant access to Kusto for applications.

Version 2.4.8 (12 FEB 2017):
* Support AAD Multi-Tenant access to Kusto.

Version 2.4.7 (31 JAN 2017):
* Kusto clients version alignment.

Version 2.4.6 (24 DEC 2016):
* Fixing a bug in CslCommandGenerator's GenerateTableExtentsShowCommand().

Version 2.4.5 (24 NOV 2016):
* Extend Azure Storage retry policy in order to handle IO exceptions.

Version 2.4.4 (16 NOV 2016):
* Extend Azure Storage retry policy in order to handle web and socket exceptions.

Version 2.4.3 (16 NOV 2016):
* Support Multi-Factor Authentication enforcement for AAD-based authentication.

Version 2.4.2 (22 SEP 2016):
* Fix potential deadlock in 'ExecuteQuery' when running in IIS.

Version 2.4.1 (20 SEP 2016):
* Fix potential deadlock during AAD token acquisition.

Version 2.4.0 (18 SEP 2016):
* Security bug fix (client credentials leak to traces).

Version 2.3.9 (5 SEP 2016):
* Support dSTS-based application authentication.

Version 2.3.8 (12 AUG 2016):
* Target client library to .net 4.5 to enable customers that cannot use higher versions to use ksuto client.

Version 2.3.7 (12 AUG 2016):
* Fix issue where null pointer exceptions are thrown for client on syntax errors rather than a meaningful error
* Make ExecuteQueryAsync async all the way down incl. 3rd party libraries (ADAL).

Version 2.3.5 (24 JUL 2016):
* Fix UI potential deadlock during AAD token acquisition.

Version 2.3.4 (20 JUL 2016):
* Upgrade ADAL's version from 2.14.2011511115 to 3.12.0

Version 2.3.3 (19 JUL 2016):
* Supporting dSTS-based authentication for Microsoft internal principals. More details can be found at https://kusto.azurewebsites.net/docs/concepts/security-authn-dsts.html.

Version 2.3.2 (11 July 2016):
* Added support for client-side timeouts (derived from servertimeout in ClientRequestProperties).
* Added support for TCP keepalive.

Version 2.3.1 (10 July 2016):
* Improved exceptions raised from RestClient2

Version 2.3 (10 July 2016):
* Added support for async ExecuteQueryAsync and ExecuteControlCommandAsync.

Version 2.2.3 (10 July 2016):
* Bug fix in supporting HttpClient=false in KustoConnectionStringBuilder.

Version 2.2.2 (03 July 2016):
* Added support for specifying the actual app cert (not its thumbprint) in the connection string builder object.

Version 2.2 (26 June 2016):
* Client libraries will now create a ClientRequestId if none is provided.
```