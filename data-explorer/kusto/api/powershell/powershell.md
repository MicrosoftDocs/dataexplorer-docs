---
title:  Kusto .NET Client Libraries from PowerShell
description: This article describes how to use Kusto .NET Client Libraries from PowerShell in Azure Data Explorer.
ms.reviewer: salevy
ms.topic: reference
ms.date: 11/07/2023
---
# Use Kusto .NET client libraries from PowerShell

PowerShell scripts can use the [Kusto client libraries](../client-libraries.md), as PowerShell inherently integrates with .NET libraries. In this article, you learn how to load and use the client libraries to run queries and management commands.

## Prerequisites

* An archiving tool to extract zip files, such as 7-Zip or WinRAR.

## Get the libraries

To use the Kusto .NET client libraries in PowerShell:

1. Download [`Microsoft.Azure.Kusto.Tools`](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
1. Right-click on the downloaded package. From the menu, select your archiving tool and extract the package contents. If the archiving tool isn't visible from the menu, select **Show more options**. The extraction results in multiple folders, one of which is named *tools*.
1. Inside the *tools* folder, there are different subfolders catering to different PowerShell versions. For PowerShell version 5.1, use the *net472* folder. For PowerShell version 7 or later, use any of the version folders. Copy the path of the relevant folder.
1. From PowerShell, load the libraries, replacing `<path>` with the copied folder path:

    ```powershell
    [System.Reflection.Assembly]::LoadFrom("<path>\Kusto.Data.dll")
    ```

    You should see an output similar to the following:

    | GAC | Version | Location |
    |--|--|--|
    | False | v4.0.30319 | C:\Downloads\tools\net472\Kusto.Data.dll |

Once loaded, you can use the libraries to [connect to a cluster and database](#connect-to-a-cluster-and-database).

## Connect to a cluster and database

Authenticate to a cluster and database with one of the following methods:

* **User authentication:** Prompt the user to verify their identity in a web browser.
* **Application authentication:** [Create an MS Entra app](../../../provision-entra-id-app.md) and use the credentials for authentication.
* **Azure CLI authentication:** Sign-in to the Azure CLI on your machine, and Kusto will retrieve the token from Azure CLI.

Select the relevant tab.

### [User](#tab/user)

Once you run your first query or command, this method will open an interactive browser window for user authorization.

```powershell
$clusterUrl = "Your cluster URI"
$databaseName = "Your database name"

$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)
```

### [Application](#tab/app)

[Create an MS Entra app](../../../provision-entra-id-app.md) and grant it access to your database. Then, provide the app credentials in place of the `$applicationId`, `$applicationKey`, and `$authority`.

```powershell
$clusterUrl = "Your cluster URI"
$databaseName = "Your database name"

$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)
$applicationId = "MS Entra application (client) ID"
$applicationKey = "MS Entra application secret key"
$authority = "MS Entra application directory (tenant) ID"
$kcsb = $kcsb.WithAadApplicationKeyAuthentication($applicationId, $applicationKey, $authority)
```

### [Azure CLI](#tab/azure-cli)

For this method of authentication to work, first sign-in to Azure CLI with the `az` `login` command.

```powershell
$clusterUrl = "Your cluster URI"
$databaseName = "Your database name"

$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)
$kcsb = $kcsb.WithAadAzCliAuthentication()
```

---

## Run a query

Create a query provider and run [Kusto Query Language](../../query/index.md) queries.

The following example defines a simple [take](../../query/takeoperator.md) query to sample the data. To run the query, replace `<TableName>` with the name of a table in your database. Before running the query, the [ClientRequestProperties class](../netfx/client-request-properties.md) is used to set a client request ID and a server timeout. Then, the query is ran and the result set is formatted and sorted.

```powershell
$queryProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslQueryProvider($kcsb)
$query = "<TableName> | take 5"
Write-Host "Executing query: '$query' with connection string: '$($kcsb.ToString())'"

# Optional: set a client request ID and set a client request property (e.g. Server Timeout)
$crp = New-Object Kusto.Data.Common.ClientRequestProperties
$crp.ClientRequestId = "MyPowershellScript.ExecuteQuery." + [Guid]::NewGuid().ToString()
$crp.SetOption([Kusto.Data.Common.ClientRequestProperties]::OptionServerTimeout, [TimeSpan]::FromSeconds(30))

# Run the query
$reader = $queryProvider.ExecuteQuery($query, $crp)

# Do something with the result datatable
# For example: print it formatted as a table, sorted by the "StartTime" column in descending order
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

For more guidance on how to run queries with the Kusto client libraries, see [Create an app to run basic queries](../get-started/app-basic-query.md).

## Run a management command

Create a CSL admin provider and run [management commands](../../management/index.md).

The following example runs a management command to check the health of the cluster.

```powershell
$adminProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslAdminProvider($kcsb)
$command = [Kusto.Data.Common.CslCommandGenerator]::GenerateDiagnosticsShowCommand()
Write-Host "Executing command: '$command' with connection string: '$($kcsb.ToString())'"

# Run the command
$reader = $adminProvider.ExecuteControlCommand($command)

# Read the results
$reader.Read() # this reads a single row/record. If you have multiple ones returned, you can read in a loop
$isHealthy = $Reader.GetBoolean(0)
Write-Host "IsHealthy = $isHealthy"
```

**Output**

```
IsHealthy = True
```

For more guidance on how to run management commands with the Kusto client libraries, see [Create an app to run management commands](../get-started/app-management-commands.md).

## Example

The following example demonstrates the process of loading the libraries, authenticating, and executing a query on the publicly accessible `help` cluster.

```powershell
#  This is an example of the location from where you extract the Microsoft.Azure.Kusto.Tools package
#  Make sure you load the types from a local directory and not from a remote share
#  Make sure you load the version compatible with your PowerShell version (see explanations above)
#  Use `dir "$packagesRoot\*" | Unblock-File` to make sure all these files can be loaded and executed
$packagesRoot = "C:\Microsoft.Azure.Kusto.Tools\tools\net472"

#  Load the Kusto client library and its dependencies
[System.Reflection.Assembly]::LoadFrom("$packagesRoot\Kusto.Data.dll")

#  Define the connection to the help cluster and database
$clusterUrl = "https://help.kusto.windows.net;Fed=True"
$databaseName = "Samples"

# MS Entra user authentication with interactive prompt
$kcsb = New-Object Kusto.Data.KustoConnectionStringBuilder($clusterUrl, $databaseName)

# Run a simple query
$queryProvider = [Kusto.Data.Net.Client.KustoClientFactory]::CreateCslQueryProvider($kcsb)
$query = "StormEvents | take 5"
$reader = $queryProvider.ExecuteQuery($query, $crp)
```

## See also

* [Kusto client libraries](../client-libraries.md)
* [Kusto connection strings](../connection-strings/kusto.md)
