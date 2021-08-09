---
title: Configure streaming ingestion on your Azure Data Explorer cluster using the Azure portal
description: Learn how to configure your Azure Data Explorer cluster and start loading data with streaming ingestion  using Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: alexefro
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/09/2021
---

# Configure streaming ingestion on your Azure Data Explorer cluster using the Azure portal

> [!div class="op_single_selector"]
> * [Portal](ingest-data-streaming.md)
> * [C#](ingest-data-streaming-csharp.md)

[!INCLUDE [ingest-data-streaming-intro](includes/ingest-data-streaming-intro.md)]

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md)

## Enable streaming ingestion on your cluster

### Enable streaming ingestion while creating a new cluster in the Azure portal

You can enable streaming ingestion while creating a new Azure Data Explorer cluster.

In the **Configurations** tab, select **Streaming ingestion** > **On**.

:::image type="content" source="media/ingest-data-streaming/cluster-creation-enable-streaming.png" alt-text="Enable streaming ingestion while creating a cluster in Azure Data Explorer.":::

### Enable streaming ingestion on an existing cluster in the Azure portal

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.

    :::image type="content" source="media/ingest-data-streaming/streaming-ingestion-on.png" alt-text="Turn on streaming ingestion in Azure Data Explorer.":::

> [!WARNING]
> Review the [limitations](#limitations) prior to enabling steaming ingestion.

## Create a target table and define the policy in the Azure portal

1. In the Azure portal, navigate to your cluster.
1. Select **Query**.

    :::image type="content" source="media/ingest-data-streaming/cluster-select-query-tab.png" alt-text="Select query in the Azure Data Explorer portal to enable streaming ingestion.":::

1. To create the table that will receive the data via streaming ingestion, copy the following command into the **Query pane** and select **Run**.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-streaming/create-table.png" alt-text="Create a table for streaming ingestion into Azure Data Explorer.":::

1. Define the [streaming ingestion policy](kusto/management/streamingingestionpolicy.md) on the table you've created or on the database that contains this table.

    > [!TIP]
    > A policy that is defined at the database level applies to all existing and future tables in the database.

1. Copy one of the following commands into the **Query pane** and select **Run**.

    ```kusto
    .alter table TestTable policy streamingingestion enable
    ```

    or

    ```kusto
    .alter database StreamingTestDb policy streamingingestion enable
    ```

    :::image type="content" source="media/ingest-data-streaming/define-streaming-ingestion-policy.png" alt-text="Define the streaming ingestion policy in Azure Data Explorer.":::

## Use streaming ingestion to ingest data to your cluster

Two streaming ingestion types are supported:

* [**Event Hub**](ingest-data-event-hub.md) or [**IoT Hub**](ingest-data-iot-hub.md), which is used as a data source.
* **Custom ingestion** requires you to write an application that uses one of the Azure Data Explorer [client libraries](kusto/api/client-libraries.md). See the following streaming ingestion examples and the [C# streaming ingestion sample application](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample).

### [Go](#tab/go)

```go
import (
    "context"
    "github.com/Azure/azure-kusto-go/kusto"
    "github.com/Azure/azure-kusto-go/kusto/ingest"
    "github.com/Azure/go-autorest/autorest/azure/auth"
)

func ingest() {
    clusterPath := "https://<clusterName>.kusto.windows.net"
    appId := "<appId>"
    appKey := "<appKey>"
    appTenant := "<appTenant>"
    database := "<dbName>"
    table := "<tableName>"
    mappingName := "<mappingName>" // Optional, can be nil

    // Creates a Kusto Authorizer using your client identity, secret and tenant identity.
    // You may also uses other forms of authorization, see GoDoc > Authorization type.
    // auth package is: "github.com/Azure/go-autorest/autorest/azure/auth"
    authorizer := kusto.Authorization{
        Config: auth.NewClientCredentialsConfig(appId, appKey, appTenant),
    }

    // Create a client
    client, err := kusto.New(clusterPath, authorizer)
    if err != nil {
        panic("add error handling")
    }

    // Setup is quite simple
    // Pass a *kusto.Client, the name of the database and table you wish to ingest into.
    in, err := ingest.New(client, database, table)
    if err != nil {
        panic("add error handling")
    }

    // Go currently only supports streaming from a byte array with a maximum size of 4mb.
    jsonEncodedData := []byte("{\"a\":  1, \"b\":  10}\n{\"a\":  2, \"b\":  20}")

    // Ingestion from a stream commits blocks of fully formed data encodes (JSON, AVRO, ...) into Kusto:
    if err := in.Stream(context.Background(), jsonEncodedData, ingest.JSON, mappingName); err != nil {
        panic("add error handling")
    }
}
```

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.ingest.IngestClient;
import com.microsoft.azure.kusto.ingest.IngestClientFactory;
import com.microsoft.azure.kusto.ingest.IngestionProperties;
import com.microsoft.azure.kusto.ingest.result.OperationStatus;
import com.microsoft.azure.kusto.ingest.source.CompressionType;
import com.microsoft.azure.kusto.ingest.source.StreamSourceInfo;
import java.io.FileInputStream;
import java.io.InputStream;

public class FileIngestion {
    public static void main(String[] args) throws Exception {
        String clusterPath = "https://<clusterName>.kusto.windows.net";
        String appId = "<appId>";
        String appKey = "<appKey>";
        String appTenant = "<appTenant>";
        String dbName = "<dbName>";
        String tableName = "<tableName>";

        // Build connection string and initialize
        ConnectionStringBuilder csb =
                ConnectionStringBuilder.createWithAadApplicationCredentials(
                        clusterPath,
                        appId,
                        appKey,
                        appTenant
                );
        // Initialize client and it's properties
        IngestClient client = IngestClientFactory.createClient(csb);
        IngestionProperties ingestionProperties =
                new IngestionProperties(
                        dbName,
                        tableName
                );

        // Ingest from a compressed file:

        // Create Source info
        InputStream zipInputStream = new FileInputStream("MyFile.gz");
        StreamSourceInfo zipStreamSourceInfo = new StreamSourceInfo(zipInputStream);
        // If the data is compressed
        zipStreamSourceInfo.setCompressionType(CompressionType.gz);
        // Ingest from stream
        OperationStatus status = client.ingestFromStream(zipStreamSourceInfo, ingestionProperties).getIngestionStatusCollection().get(0).status;
    }
}
```

### [Node.js](#tab/nodejs)

```nodejs
// ES6 module style:
import { DataFormat, IngestionProperties, StreamingIngestClient } from "azure-kusto-ingest";
import { KustoConnectionStringBuilder } from "azure-kusto-data";

// Or old NodeJs style:
// const IngestionProperties = require("azure-kusto-ingest").IngestionProperties;
// const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
// const {DataFormat} = require("azure-kusto-ingest").IngestionPropertiesEnums;
// const StreamingIngestClient = require("azure-kusto-ingest").StreamingIngestClient;

const clusterPath = "https://<clusterName>.kusto.windows.net";
const appId = "<appId>";
const appKey = "<appKey>";
const appTenant = "<appTenant>";
const dbName = "<dbName>";
const tableName = "<tableName>";

// Streaming ingest client
const props = new IngestionProperties({
    database: dbName, // Your database
    table: tableName, // Your table
    format: DataFormat.JSON,
    ingestionMappingReference: "Pre-defined mapping name" // For json format mapping is required
});

// Init with engine endpoint
const streamingIngestClient = new StreamingIngestClient(
    KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
        clusterPath,appId, appKey, appTenant),
        props
    );

await streamingIngestClient.ingestFromFile("MyFile.gz", props); // Automatically detects gz format
```

### [Python](#tab/python)

```python
from azure.kusto.data import KustoConnectionStringBuilder

from azure.kusto.ingest import (
    IngestionProperties,
    DataFormat,
    KustoStreamingIngestClient
)

cluster = "https://<clusterName>.kusto.windows.net"
app_id = "<appId>"
app_key = "<appKey>"
app_tenant = "<appTenant>"
dbName = "<dbName>"
tableName = "<tableName>"

kcsb = KustoConnectionStringBuilder.with_aad_application_key_authentication(cluster, app_id, app_key, app_tenant)
client = KustoStreamingIngestClient(kcsb)

ingestion_properties = IngestionProperties(
    database=dbName, table=tableName, data_format=DataFormat.CSV
)

# ingest from file
client.ingest_from_file("MyFile.gz", ingestion_properties=ingestion_properties)  # Automatically detects gz format
```

---

### Choose the appropriate streaming ingestion type

|Criterion|Event Hub|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay  |
|Development overhead | Fast and easy setup, no development overhead | High development overhead for application to handle errors and ensure data consistency |

[!INCLUDE [ingest-data-streaming-disable](includes/ingest-data-streaming-disable.md)]

## Drop the streaming ingestion policy in the Azure portal

1. In the Azure portal, go to your Azure Data Explorer cluster and select **Query**.
1. To drop the streaming ingestion policy from the table, copy the following command into **Query pane** and select **Run**.

    ```Kusto
    .delete table TestTable policy streamingingestion
    ```

    :::image type="content" source="media/ingest-data-streaming/delete-streaming-ingestion-policy.png" alt-text="Delete streaming ingestion policy in Azure Data Explorer.":::

1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **Off** to disable **Streaming ingestion**.
1. Select **Save**.

    :::image type="content" source="media/ingest-data-streaming/streaming-ingestion-off.png" alt-text="Turn off streaming ingestion in Azure Data Explorer.":::

[!INCLUDE [ingest-data-streaming-limitations](includes/ingest-data-streaming-limitations.md)]

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
