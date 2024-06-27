---
ms.topic: include
ms.date: 06/23/2024
---
## Add the target configuration to your app

Use the following steps to:

* Add the target configuration
* Build and run the app

1. Add the target in your NLog configuration file.

    ```xml
    <targets>
        <target name="targettable" xsi:type="TargetTable"
        IngestionEndpointUri="<Connection string>"
        Database="<Database name>"
        TableName="<Table name>"
        ApplicationClientId="<Entra App clientId>"
        ApplicationKey="<Entra App key>"
        Authority="<Entra tenant id>"
        />
    </targets>

    ##Rules
    <rules>
        <logger name="*" minlevel="Info" writeTo="adxtarget" />
    </rules>
    ```

    For more options, see [Nlog connector](https://github.com/Azure/azure-kusto-nlog-sink).

1. Send data using the NLog sink. For example:

    ```csharp
    logger.Info("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    logger.Error(exceptionObj, "This was exception");
    logger.Debug("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    logger.Warn("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    ```

1. Build and run the app. For example, if you're using Visual Studio, press F5.

1. Verify that the data is in your cluster. In your query environment, run the following query replacing the placeholder with the name of the table that you used earlier:

    ```kusto
    <TableName>
    | take 10
    ```

## Run the sample app

Use the sample log generator app as an example showing how to configure and use the NLog sink.

1. Clone the NLog sink's [git repo](https://github.com/Azure/azure-kusto-nlog-sink) using the following git command:

    ```powershell
    git clone https://github.com/Azure/azure-kusto-nlog-sink.git
    ```

1. Set the following environmental variables, so that NLog config file can read them right away from environment:

    | Variable | Description |
    |---|---|
    | *INGEST_ENDPOINT* | The ingest URI for your data target. You have copied this URI in the [prerequisites](#prerequisites). |
    | *DATABASE* | The case-sensitive name of the target database. |
    | *APP_ID* | Application client ID required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *APP_KEY* | Application key required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *AZURE_TENANT_ID* | The ID of the tenant in which the application is registered. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |

    You can set the environment variables manually or using the following commands:

    #### [Windows](#tab/windows)

    ```powershell
    $env:INGEST_ENDPOINT="<ingestionURI>"
    $env:APP_ID="<appId>"
    $env:APP_KEY="<appKey>"
    $env:AZURE_TENANT_ID="<tenant>"
    $env:DATABASE="<databaseName>"
    ```

    #### [Mac/Linux](#tab/linux)

    ```bash
    export INGEST_ENDPOINT="<ingestionURI>"
    export APP_ID="<appId>"
    export APP_KEY="<appKey>"
    export AZURE_TENANT_ID="<tenant>"
    export DATABASE="<databaseName>"
    ```

    ---

1. Within your terminal, navigate to the root folder of the cloned repo and run the following `dotnet` command to build the app:

    ```powershell
    cd .\NLog.Azure.Kusto.Samples\
    dotnet build
    ```

1. Within your terminal, navigate to the samples folder and run the following `dotnet` command to run the app:

    ```powershell
    dotnet run
    ```

1. In your query environment, select the target database, and run the following query to explore the ingested data.

    ```kusto
    ADXNLogSample
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/nlog-connector/take-10-results.png" source="media/nlog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::
