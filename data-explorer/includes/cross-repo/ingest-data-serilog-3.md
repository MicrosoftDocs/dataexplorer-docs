---
ms.topic: include
ms.date: 07/02/2024
---

## Use Serilog in your ASP.NET Core application

This section explains how to integrate Serilog into your ASP.NET Core application to log data and send it to your KQL table.

### Install the package

Add the [Serilog.Sinks.AzureDataExplorer](https://www.nuget.org/packages/serilog.sinks.azuredataexplorer) NuGet library package. Use the Install-Package command specifying the name of the NuGet package.

```powershell
Install-Package Serilog.Sinks.AzureDataExplorer
```

### Add the Serilog sink to your app

Use the following steps to:

* Add the Serilog sink to your app.
* Configure the variables used by the sink.
* Build and run the app.

1. Add the following code to your app:

    ```csharp
    using Serilog.Sinks.AzureDataExplorer;
    ```

1. Configure the Serilog sink, replacing placeholders using the information in the table that follows:

    ```csharp
    var log = new LoggerConfiguration()
    .WriteTo.AzureDataExplorerSink(new AzureDataExplorerSinkOptions
    {
        IngestionEndpointUri = "<TargetURI>",
        DatabaseName = "<MyDatabase>",
        TableName = "<MyTable>",
        BufferBaseFileName = "<BufferBaseFileName>"
    })
    .CreateLogger();
    ```

    | Variable | Description |
    |---|---|
    | *IngestionEndPointUri* | The [ingest URI](#ingestion-uri). |
    | *DatabaseName* | The case-sensitive name of the target database. |
    | *TableName* | The case-sensitive name of an existing target table. For example, **SerilogTest** is the name of the table created in [Create a target table and ingestion mapping](#create-a-target-table-and-ingestion-mapping). |
    | *AppId* | The application client ID required for authentication. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *AppKey* | The application key required for authentication. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *Tenant* | The ID of the tenant in which the application is registered. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *BufferBaseFileName* | Optional base file name for the buffer file. Set this value if you require your logs to be durable against loss resulting connection failures to your cluster. For example, `C:/Temp/Serilog`. |

    For more options, see [Sink Options](https://github.com/Azure/serilog-sinks-azuredataexplorer#options).

1. Send data to your database using the Serilog sink. For example:

    ```csharp
    log.Verbose("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Information("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Warning("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Error(new Exception(), "Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Debug("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    ```

1. Build and run the app. For example, if you're using Visual Studio, press F5.

1. Verify that the data is in your table. Run the following query replacing the placeholder with the name of the table that was created in a previous step:

    ```kusto
    <TableName>
    | take 10
    ```

## Run the sample app

If you don't have your own data to test, you can use the sample log generator app with sample data to test configuration and use of the Serilog sink.

1. Clone the Serilog sink's [git repo](https://github.com/Azure/serilog-sinks-azuredataexplorer) using the following git command:

    ```powershell
    git clone https://github.com/Azure/serilog-sinks-azuredataexplorer
    ```

1. Set the following environmental variables to configure the Serilog sink:

    | Variable | Description |
    |---|---|
    | *IngestionEndPointUri* | The [ingest URI](#ingestion-uri). |
    | *DatabaseName* | The case-sensitive name of the target database. |
    | *TableName* | The case-sensitive name of an existing target table. For example, **SerilogTest** is the name of the table created in [Create a target table and ingestion mapping](#create-a-target-table-and-ingestion-mapping). |
    | *AppId* | Application client ID required for authentication. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *AppKey* | Application key required for authentication. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *Tenant* | The ID of the tenant in which the application is registered. You saved this value in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
    | *BufferBaseFileName* | The base file name for the buffer file. Set this value if you require your logs to be durable against loss resulting connection failures to your cluster. For example, `C:/Temp/Serilog` |

    You can set the environment variables manually or using the following commands:

### [Windows](#tab/windows)

```powershell
$env:ingestionURI="<ingestionURI>"
$env:appId="<appId>"
$env:appKey="<appKey>"
$env:tenant="<tenant>"
$env:databaseName="<databaseName>"
$env:tableName="<tableName>"
```

### [Mac/Linux](#tab/linux)

```bash
export ingestionURI="<ingestionURI>"
export appId="<appId>"
export appKey="<appKey>"
export tenant="<tenant>"
export databaseName="<databaseName>"
export tableName="<tableName>"
```

---

1. In your terminal, browse to the root folder of the cloned repo and run the following .NET command to build the app:

    ```powershell
    dotnet build src
    ```

1. In your terminal, browse to the samples folder and run the following .NET command to run the app:

    ```powershell
    dotnet build run
    ```
