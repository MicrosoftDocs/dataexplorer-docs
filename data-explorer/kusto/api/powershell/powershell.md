---
title: Kusto .NET Client Libraries from PowerShell - Azure Data Explorer
description: This article describes how to use Kusto .NET Client Libraries from PowerShell in Azure Data Explorer.
ms.reviewer: salevy
ms.topic: reference
ms.date: 04/19/2023
---
# Use Kusto .NET client libraries from PowerShell

PowerShell scripts can use Kusto .NET client libraries through
PowerShell's built-in integration with arbitrary (non-PowerShell) .NET libraries.

## Getting the .NET client libraries for scripting with PowerShell

To start working with the Kusto .NET client libraries using PowerShell.

1. Download the [`Microsoft.Azure.Kusto.Tools` NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
1. Extract the contents of the 'tools' directory in the package using an archiving tool. For example, `7-zip`.
  - If you're using Powershell version 5.1, you need to select the net472 version folder.
  - If you're using Powershell version 7 or later, you can use the other versions folders contained in the package.
1. To load the required library, call `[System.Reflection.Assembly]::LoadFrom("path\Kusto.Data.dll")` from PowerShell.
    * The `path` parameter for the command should indicate the location of the extracted files.
1. Once all dependent .NET assemblies are loaded:
   1. Create a Kusto connection string.
   1. Instantiate a *query provider* or an *admin provider*.
   1. Run the queries or commands, as shown in the [examples](powershell.md#examples) below.

For more information, see the [Kusto client libraries](../netfx/about-kusto-data.md).

## Examples

### Initialization

```powershell
#  Part 1 of 3
#  ------------
#  Packages location - This is an example of the location from where you extract the Microsoft.Azure.Kusto.Tools package
#  Please make sure you load the types from a local directory and not from a remote share
#  Please make sure you load the version compatible with your PowerShell version (see explanations above)
$packagesRoot = "C:\Microsoft.Azure.Kusto.Tools\tools\net472"

#  Part 2 of 3
#  ------------
#  Loading the Kusto.Client library and its dependencies
[System.Reflection.Assembly]::LoadFrom("$packagesRoot\Kusto.Data.dll")

#  Part 3 of 3
#  ------------
#  Defining the connection to your cluster / database
$clusterUrl = "https://help.kusto.windows.net;Fed=True"
$databaseName = "Samples"

#   Option A: using Azure AD User Authentication
$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder ($clusterUrl, $databaseName)

#   Option B: using Azure AD application Authentication
#     $applicationId = "application ID goes here"
#     $applicationKey = "application key goes here"
#     $authority = "authority goes here"
#     $kcsb = $kcsb.WithAadApplicationKeyAuthentication($applicationId, $applicationKey, $authority)
#
#   NOTE: if you're running with Powershell 7 (or above) and the .NET Core library,
#         AAD user authentication with prompt will not work, and you should choose
#         a different authentication method.
```

### Example: Running an admin command

```powershell
$adminProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslAdminProvider($kcsb)
$command = [Kusto.Data.Common.CslCommandGenerator]::GenerateDiagnosticsShowCommand()
Write-Host "Executing command: '$command' with connection string: '$($kcsb.ToString())'"
$reader = $adminProvider.ExecuteControlCommand($command)
$reader.Read() # this reads a single row/record. If you have multiple ones returned, you can read in a loop
$isHealthy = $Reader.GetBoolean(0)
Write-Host "IsHealthy = $isHealthy"
```

And the output is:

```
IsHealthy = True
```

### Example: Running a query

```powershell
$queryProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslQueryProvider($kcsb)
$query = "StormEvents | take 5"
Write-Host "Executing query: '$query' with connection string: '$($kcsb.ToString())'"
#   Optional: set a client request ID and set a client request property (e.g. Server Timeout)
$crp = New-Object Kusto.Data.Common.ClientRequestProperties
$crp.ClientRequestId = "MyPowershellScript.ExecuteQuery." + [Guid]::NewGuid().ToString()
$crp.SetOption([Kusto.Data.Common.ClientRequestProperties]::OptionServerTimeout, [TimeSpan]::FromSeconds(30))

#   Execute the query
$reader = $queryProvider.ExecuteQuery($query, $crp)

# Do something with the result datatable, for example: print it formatted as a table, sorted by the
# "StartTime" column, in descending order
$dataTable = [Kusto.Cloud.Platform.Data.ExtendedDataReader]::ToDataSet($reader).Tables[0]
$dataView = New-Object System.Data.DataView($dataTable)
$dataView | Sort StartTime -Descending | Format-Table -AutoSize
```

And the output is:

|StartTime           |EndTime             |EpisodeID |EventID |State          |EventType         |InjuriesDirect |InjuriesIndirect |DeathsDirect |DeathsIndirect
|---------           |-------             |--------- |------- |-----          |---------         |-------------- |---------------- |------------ |--------------
|2007-12-30 16:00:00 |2007-12-30 16:05:00 |    11749 |  64588 |GEORGIA        |Thunderstorm Wind |             0 |               0 |           0 |             0
|2007-12-20 07:50:00 |2007-12-20 07:53:00 |    12554 |  68796 |MISSISSIPPI    |Thunderstorm Wind |             0 |               0 |           0 |             0
|2007-09-29 08:11:00 |2007-09-29 08:11:00 |    11091 |  61032 |ATLANTIC SOUTH |Water spout       |             0 |               0 |           0 |             0
|2007-09-20 21:57:00 |2007-09-20 22:05:00 |    11078 |  60913 |FLORIDA        |Tornado           |             0 |               0 |           0 |             0
|2007-09-18 20:00:00 |2007-09-19 18:00:00 |    11074 |  60904 |FLORIDA        |Heavy Rain        |             0 |               0 |           0 |             0
