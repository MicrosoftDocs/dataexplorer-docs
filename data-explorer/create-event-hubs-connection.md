---
title: 'Create an Event Hubs data connection'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Hubs.'
ms.topic: how-to
ms.date: 03/26/2023
---

Azure Data Explorer offers ingestion from [Event Hubs](/azure/event-hubs/event-hubs-about), which is a big data streaming platform and event ingestion service. Event Hubs can process millions of events per second in near real time.

In this article, you'll connect to an event hub and ingest data into Azure Data Explorer.

For information about ingesting from Event Hubs, see [Connect to event hub](ingest-data-event-hub-overview.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* Download this [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) to send mock data to an event hub.
* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/) to run the sample app.

## 1 - Create the target table

To send data from an event hub to Azure Data Explorer, you must first create a table to receive the data.

### [Portal](#tab/portal)

1. In the Azure portal, go to your cluster and select **Query**.

    :::image type="content" source="media/ingest-data-event-hub/query-explorer-link.png" alt-text="Screenshot of the Azure portal U I left menu, showing the Query application option.":::

1. Copy the following command into the window and select **Run** to create the `TestTable` table.

    ```Kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-event-hub/run-create-query.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the query window running query.":::

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the `TestTable` table.

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp", "Properties": {"Path": "$.timeStamp"}},{"column":"Name", "Properties": {"Path":"$.name"}} ,{"column":"Metric", "Properties": {"Path":"$.metric"}}, {"column":"Source", "Properties": {"Path":"$.source"}}]'
    ```

### [Wizard](#tab/wizard)

1. From the **Data** tab of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), in the **Ingest data from Event Hub** card, select **Ingest**.

    :::image type="content" source="media/event-hub-wizard/ingestion-in-web-ui.png" alt-text="Select the ingestion wizard in the Azure Data Explorer web UI.":::

1. The **Ingest data** window opens with the **Destination** tab selected. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus.

    :::image type="content" source="media/event-hub-wizard/destination-tab.png" alt-text="Screen shot of destination tab. Cluster, Database, and Table fields must be filled out before proceeding to Next-Source.":::

1. Under **Table**, select **New table** and enter a name for the new table. Alternatively, use an existing table.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Select **Next: Source**.

### [C#](#tab/c-sharp)

1. Install the ingest library.

    ```csharp
    Install-Package Microsoft.Azure.Kusto.Ingest
    ```

1. Construct the connection string.

    ```csharp
    var tenantId = "<TenantId>";
    var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";

    var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri).WithAadUserPromptAuthentication(tenantId);
    ```

1. Create a table.

    ```csharp
    var databaseName = "<DatabaseName>";
    var table = "<TableName>";
    using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
    {
        var command =
            CslCommandGenerator.GenerateTableCreateCommand(
                table,
                new[]
                {
                    Tuple.Create("StartTime", "System.DateTime"),
                    Tuple.Create("EndTime", "System.DateTime"),
                    ...
                });
    
        kustoClient.ExecuteControlCommand(databaseName, command);
    }
    ```

1. Define an ingestion mapping.

    ```csharp
    var tableMapping = "TableName_CSV_Mapping";
    using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
    {
        var command =
            CslCommandGenerator.GenerateTableMappingCreateCommand(
                Data.Ingestion.IngestionMappingKind.Csv,
                table,
                tableMapping,
                new[] {
                    new ColumnMapping() { ColumnName = "StartTime", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "0" } } },
                    new ColumnMapping() { ColumnName = "EndTime", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "1" } } },
                    new ColumnMapping() { ColumnName = "EpisodeId", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "2" } } },
                    ...
            });
    
        kustoClient.ExecuteControlCommand(databaseName, command);
    }
    ```

### [Python](#tab/python)
### [ARM template](#tab/arm-template)

## 2 - Copy the connection string - Portal only?



## 3 - Connect to the event hub

### [Portal](#tab/portal)
### [Wizard](#tab/wizard)
### [C#](#tab/c-sharp)
### [Python](#tab/python)
### [ARM template](#tab/arm-template)

## 4 - Send sample data

### [Portal](#tab/portal)
### [Wizard](#tab/wizard)
### [C#](#tab/c-sharp)
### [Python](#tab/python)
### [ARM template](#tab/arm-template)

## 5 - Check the flow

### [Portal](#tab/portal)
### [Wizard](#tab/wizard)
### [C#](#tab/c-sharp)
### [Python](#tab/python)
### [ARM template](#tab/arm-template)

## 6 - Clean up resources

### [Portal](#tab/portal)
### [Wizard](#tab/wizard)
### [C#](#tab/c-sharp)
### [Python](#tab/python)
### [ARM template](#tab/arm-template)
