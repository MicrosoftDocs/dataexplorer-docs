---
title:  Kusto .NET Client Libraries from PowerShell
description: This article describes how to use Kusto .NET Client Libraries from PowerShell in Azure Data Explorer.
ms.reviewer: salevy
ms.topic: reference
ms.date: 11/07/2023
---
# Use Kusto .NET client libraries from PowerShell

PowerShell scripts can use Kusto .NET client libraries through
PowerShell's built-in integration with arbitrary (non-PowerShell) .NET libraries.

## Prerequisites

* An archiving tool to extract zip files, such as 7-Zip or WinRAR.

## Get the libraries

To get the Kusto .NET client libraries for scripting with PowerShell:

1. Download [`Microsoft.Azure.Kusto.Tools`](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
1. Right-click on the downloaded package. From the menu, select your archiving tool and extract the package contents. If the archiving tool isn't visible from the menu, select **Show more options**. The extraction results in multiple folders, one of which is named *tools*.
1. Inside the *tools* folder, there are different subfolders catering to different PowerShell versions. For PowerShell version 5.1, use the *net472* folder. For PowerShell version 7 or later, use any of the version folders. Copy the path of the relevant folder.
1. From PowerShell, replace `<path>` with the copied folder path and load the library:

    ```powershell
    [System.Reflection.Assembly]::LoadFrom("<path>\Kusto.Data.dll")
    ```

Once the .NET assemblies are loaded, use a [Kusto connection string](../connection-strings/kusto.md) to establish a connection and run queries and commands. For guidance, see [Examples](#examples).

## Initialization

To get started with the libraries, you need to load the libraries and authenticate your access to the cluster and database. There are three main methods for authentication:

* **User authentication:** Prompt the user to verify their identity in a web browser.
* **Application authentication:** [Create an MS Entra app](../../../provision-entra-id-app.md), [grant it access to your database](../../../provision-entra-id-app.md#grant-the-application-registration-access-to-an-azure-data-explorer-database), and use the credentials for authentication.
* **Azure CLI authentication:** Sign-in on your machine to the Azure CLI using `az` `login`. Kusto retrieves the token from Azure CLI.

To see examples of each authentication type, select the relevant tab.

### [User](#tab/user)

Once you run your first query or command, this method will open an interactive browser window for user authorization.

```powershell
#  Part 1 of 3
#  ------------
#  Packages location - This is an example of the location from where you extract the Microsoft.Azure.Kusto.Tools package
#  Please make sure you load the types from a local directory and not from a remote share
#  Please make sure you load the version compatible with your PowerShell version (see explanations above)
#  Use `dir "$packagesRoot\*" | Unblock-File` to make sure all these files can be loaded and executed
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

# MS Entra User Authentication
$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)
```

### [Application](#tab/app)

[Create an MS Entra app](../../../provision-entra-id-app.md) and [grant it access to your database](../../../provision-entra-id-app.md#grant-the-application-registration-access-to-an-azure-data-explorer-database). Then, provide the app credentials in place of the `$applicationId`, `$applicationKey`, and `$authority`.

```powershell
#  Part 1 of 3
#  ------------
#  Packages location - This is an example of the location from where you extract the Microsoft.Azure.Kusto.Tools package
#  Please make sure you load the types from a local directory and not from a remote share
#  Please make sure you load the version compatible with your PowerShell version (see explanations above)
#  Use `dir "$packagesRoot\*" | Unblock-File` to make sure all these files can be loaded and executed
$packagesRoot = "C:\Microsoft.Azure.Kusto.Tools\tools\net472"

#  Part 2 of 3
#  ------------
#  Loading the Kusto.Client library and its dependencies
[System.Reflection.Assembly]::LoadFrom("$packagesRoot\Kusto.Data.dll")

#  Part 3 of 3
#  ------------
#  Defining the connection to your cluster / database
$clusterUrl = "https://help.kusto.windows.net"
$databaseName = "Samples"

$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)

# MS Entra Application Authentication
$applicationId = "MS Entra application (client) ID"
$applicationKey = "MS Entra application key"
$authority = "Tenant ID that contains the MS Entra application"
$kcsb = $kcsb.WithAadApplicationKeyAuthentication($applicationId, $applicationKey, $authority)
```

**Example output**

| GAC | Version | Location |
|--|--|--|
| False | v4.0.30319 | C:\Downloads\tools\net472\Kusto.Data.dll |

### [Azure CLI](#tab/azure-cli)

For this method of authentication to work, first sign-in to Azure CLI with the `az` `login` command.

```powershell
#  Part 1 of 3
#  ------------
#  Packages location - This is an example of the location from where you extract the Microsoft.Azure.Kusto.Tools package
#  Please make sure you load the types from a local directory and not from a remote share
#  Please make sure you load the version compatible with your PowerShell version (see explanations above)
#  Use `dir "$packagesRoot\*" | Unblock-File` to make sure all these files can be loaded and executed
$packagesRoot = "C:\Microsoft.Azure.Kusto.Tools\tools\net472"

#  Part 2 of 3
#  ------------
#  Loading the Kusto.Client library and its dependencies
[System.Reflection.Assembly]::LoadFrom("$packagesRoot\Kusto.Data.dll")

#  Part 3 of 3
#  ------------
#  Defining the connection to your cluster / database
$clusterUrl = "https://help.kusto.windows.net"
$databaseName = "Samples"

$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)

# Azure CLI Authentication
$kcsb = $kcsb.WithAadAzCliAuthentication()
```

---

**Example output**

| GAC | Version | Location |
|--|--|--|
| False | v4.0.30319 | C:\Downloads\tools\net472\Kusto.Data.dll |

## Examples

### Run an admin command

```powershell
$adminProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslAdminProvider($kcsb)
$command = [Kusto.Data.Common.CslCommandGenerator]::GenerateDiagnosticsShowCommand()
Write-Host "Executing command: '$command' with connection string: '$($kcsb.ToString())'"
$reader = $adminProvider.ExecuteControlCommand($command)
$reader.Read() # this reads a single row/record. If you have multiple ones returned, you can read in a loop
$isHealthy = $Reader.GetBoolean(0)
Write-Host "IsHealthy = $isHealthy"
```

**Output**

```
IsHealthy = True
```

### Run a query

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

**Output**

|StartTime           |EndTime             |EpisodeID |EventID |State          |EventType         |InjuriesDirect |InjuriesIndirect |DeathsDirect |DeathsIndirect
|---------           |-------             |--------- |------- |-----          |---------         |-------------- |---------------- |------------ |--------------
|2007-12-30 16:00:00 |2007-12-30 16:05:00 |    11749 |  64588 |GEORGIA        |Thunderstorm Wind |             0 |               0 |           0 |             0
|2007-12-20 07:50:00 |2007-12-20 07:53:00 |    12554 |  68796 |MISSISSIPPI    |Thunderstorm Wind |             0 |               0 |           0 |             0
|2007-09-29 08:11:00 |2007-09-29 08:11:00 |    11091 |  61032 |ATLANTIC SOUTH |Water spout       |             0 |               0 |           0 |             0
|2007-09-20 21:57:00 |2007-09-20 22:05:00 |    11078 |  60913 |FLORIDA        |Tornado           |             0 |               0 |           0 |             0
|2007-09-18 20:00:00 |2007-09-19 18:00:00 |    11074 |  60904 |FLORIDA        |Heavy Rain        |             0 |               0 |           0 |             0

## See also

* [Kusto client libraries](../client-libraries.md)
* [Kusto connection strings](../connection-strings/kusto.md)
