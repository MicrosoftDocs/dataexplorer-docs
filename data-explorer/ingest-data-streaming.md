---
title: Configure streaming ingestion on your Azure Data Explorer cluster
description: Learn how to configure your Azure Data Explorer cluster and start loading data with streaming ingestion.
ms.reviewer: alexefro
ms.topic: how-to
ms.date: 05/17/2023
---

# Configure streaming ingestion on your Azure Data Explorer cluster

Streaming ingestion is useful for loading data when you need low latency between ingestion and query. Consider using streaming ingestion in the following scenarios:

* Latency of less than a second is required.
* To optimize operational processing of many tables where the stream of data into each table is relatively small (a few records per second), but the overall data ingestion volume is high (thousands of records per second).

If the stream of data into each table is high (over 4 GB per hour), consider using [queued ingestion](kusto/management/batching-policy.md).

To learn more about different ingestion methods, see [data ingestion overview](ingest-data-overview.md).

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/ingest-data-streaming).

## Choose the appropriate streaming ingestion type

Two streaming ingestion types are supported:

| Ingestion type | Description |
| -- | -- |
| Data connection | Event Hubs, IoT Hub, and Event Grid data connections can use streaming ingestion, provided it is enabled on the cluster level. The decision to use streaming ingestion is done according to the streaming ingestion policy configured on the target table.<br />For information on managing data connections, see [**Event Hub**](ingest-data-event-hub.md), [**IoT Hub**](ingest-data-iot-hub.md) and [**Event Grid**](create-event-grid-connection.md). |
| Custom ingestion | Custom ingestion requires you to write an application that uses one of the Azure Data Explorer [client libraries](kusto/api/client-libraries.md).<br />Use the information in this topic to configure custom ingestion. You may also find the [C# streaming ingestion sample application](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) helpful. |

Use the following table to help you choose the ingestion type that's appropriate for your environment:

|Criterion|Data connection|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay  |
|Development overhead | Fast and easy setup, no development overhead | High development overhead to create an application ingest the data, handle errors, and ensure data consistency |

> [!NOTE]
> You can manage the process to [enable](#enable-streaming-ingestion-on-your-cluster) and [disable](#disable-streaming-ingestion-on-your-cluster) streaming ingestion on your cluster using the Azure portal or programmatically in C\#. If you are using C\# for your [custom application](#create-a-streaming-ingestion-application-to-ingest-data-to-your-cluster), you may find it more convenient using the programmatic approach.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

## Performance and operational considerations

The main contributors that can impact streaming ingestion are:

* **VM and cluster size**: Streaming ingestion performance and capacity scales with increased VM and cluster sizes. The number of concurrent ingestion requests is limited to six per core. For example, for 16 core SKUs, such as D14 and L16, the maximal supported load is 96 concurrent ingestion requests. For two core SKUs, such as D11, the maximal supported load is 12 concurrent ingestion requests.
* **Data size limit**: The data size limit for a streaming ingestion request is 4 MB. This includes any data created for update policies during the ingestion.
* **Schema updates**: Schema updates, such as creation and modification of tables and ingestion mappings, may take up to five minutes for the streaming ingestion service. For more information see [Streaming ingestion and schema changes](kusto/management/data-ingestion/streaming-ingestion-schema-changes.md).
* **SSD capacity**: Enabling streaming ingestion on a cluster, even when data isn't ingested via streaming, uses part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for hot cache.

## Enable streaming ingestion on your cluster

Before you can use streaming ingestion, you must enable the capability on your cluster and define a [streaming ingestion policy](kusto/management/streaming-ingestion-policy.md). You can enable the capability when [creating the cluster](#enable-streaming-ingestion-while-creating-a-new-cluster), or [add it to an existing cluster](#enable-streaming-ingestion-on-an-existing-cluster).

> [!WARNING]
> Review the [limitations](#limitations) prior to enabling streaming ingestion.

### Enable streaming ingestion while creating a new cluster

You can enable streaming ingestion while creating a new cluster using the Azure portal or programmatically in C\#.

#### [Portal](#tab/azure-portal)

While creating a cluster using the steps in [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md), in the **Configurations** tab, select **Streaming ingestion** > **On**.

:::image type="content" source="media/ingest-data-streaming/cluster-creation-enable-streaming.png" alt-text="Enable streaming ingestion while creating a cluster in Azure Data Explorer.":::

#### [C#](#tab/azure-csharp)

To enable streaming ingestion while creating a new Azure Data Explorer cluster, run the following code:

```csharp
using System.Threading.Tasks;
using Azure;
using Azure.Core;
using Azure.Identity; // Required package Azure.Identity
using Azure.ResourceManager;
using Azure.ResourceManager.Kusto; // Required package Azure.ResourceManager.Kusto
using Azure.ResourceManager.Kusto.Models;
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        var subscriptionId = "<subscriptionId>";
        var credentials = new ClientSecretCredential(appTenant, appId, appKey);
        var resourceManagementClient = new ArmClient(credentials, subscriptionId);
        var resourceGroupName = "<resourceGroupName>";
        var clusterName = "<clusterName>";
        
        var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
        var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
        var clusters = resourceGroup.GetKustoClusters();
        
        var location = new AzureLocation("<location>");
        var skuName = new KustoSkuName("<skuName>");
        var skuTier = new KustoSkuTier("<skuTier>");
        var clusterData = new KustoClusterData(location, new KustoSku(skuName, skuTier)) { IsStreamingIngestEnabled = true };
        await clusters.CreateOrUpdateAsync(WaitUntil.Completed, clusterName, clusterData);
    }
}
```

---

### Enable streaming ingestion on an existing cluster

If you have an existing cluster, you can enable streaming ingestion using the Azure portal or programmatically in C\#.

#### [Portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.

    :::image type="content" source="media/ingest-data-streaming/streaming-ingestion-on.png" alt-text="Turn on streaming ingestion in Azure Data Explorer.":::

#### [C#](#tab/azure-csharp)

You can enable streaming ingestion while updating an existing Azure Data Explorer cluster.

```csharp
using System.Threading.Tasks;
using Azure;
using Azure.Identity; // Required package Azure.Identity
using Azure.ResourceManager;
using Azure.ResourceManager.Kusto; // Required package Azure.ResourceManager.Kusto
using Azure.ResourceManager.Kusto.Models;
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        var subscriptionId = "<subscriptionId>";
        var credentials = new ClientSecretCredential(appTenant, appId, appKey);
        var resourceManagementClient = new ArmClient(credentials, subscriptionId);
        var resourceGroupName = "<resourceGroupName>";
        var clusterName = "<clusterName>";
        var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
        var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
        var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
        var clusterPatch = new KustoClusterPatch(cluster.Data.Location) { IsStreamingIngestEnabled = true };
        await cluster.UpdateAsync(WaitUntil.Completed, clusterPatch);
    }
}
```

---

### Create a target table and define the policy

Create a table to receive the streaming ingestion data and define its related policy using the Azure portal or programmatically in C\#.

#### [Portal](#tab/azure-portal)

1. In the Azure portal, navigate to your cluster.
1. Select **Query**.

    :::image type="content" source="media/ingest-data-streaming/cluster-select-query-tab.png" alt-text="Select query in the Azure Data Explorer portal to enable streaming ingestion.":::

1. To create the table that will receive the data via streaming ingestion, copy the following command into the **Query pane** and select **Run**.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-streaming/create-table.png" alt-text="Create a table for streaming ingestion into Azure Data Explorer.":::

1. Copy one of the following commands into the **Query pane** and select **Run**. This defines the [streaming ingestion policy](kusto/management/streaming-ingestion-policy.md) on the table you created or on the database that contains the table.

    > [!TIP]
    > A policy that is defined at the database level applies to all existing and future tables in the database. When you enable the policy at the database level, there is no need to enable it per table.

    * To define the policy on the table you created, use:

        ```kusto
        .alter table TestTable policy streamingingestion enable
        ```

    * To define the policy on the database containing the table you created, use:

        ```kusto
        .alter database StreamingTestDb policy streamingingestion enable
        ```

    :::image type="content" source="media/ingest-data-streaming/define-streaming-ingestion-policy.png" alt-text="Define the streaming ingestion policy in Azure Data Explorer.":::

#### [C#](#tab/azure-csharp)

```csharp
using Kusto.Data; // Requires Package Microsoft.Azure.Kusto.Data
using Kusto.Data.Common;
using Kusto.Data.Net.Client;
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var clusterPath = "https://<clusterName>.<region>.kusto.windows.net";
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        // Create Kusto connection string with App Authentication
        var connectionStringBuilder = new KustoConnectionStringBuilder(clusterPath)
            .WithAadApplicationKeyAuthentication(
                applicationClientId: appId,
                applicationKey: appKey,
                authority: appTenant
            );
        using var client = KustoClientFactory.CreateCslAdminProvider(connectionStringBuilder);
        
        var tableName = "<tableName>";
        var tableSchema = new TableSchema(
            tableName,
            new ColumnSchema[]
            {
                new("TimeStamp", "System.DateTime"),
                new("Name", "System.String"),
                new("Metric", "System.int"),
                new("Source", "System.String"),
            });
        var tableCreateCommand = CslCommandGenerator.GenerateTableCreateCommand(tableSchema);
        var tablePolicyAlterCommand = CslCommandGenerator.GenerateTableAlterStreamingIngestionPolicyCommand(tableName, isEnabled: true);
        
        await client.ExecuteControlCommandAsync(tableCreateCommand);
        await client.ExecuteControlCommandAsync(tablePolicyAlterCommand);
    }
}
```

---

## Create a streaming ingestion application to ingest data to your cluster

Create your application for ingesting data to your cluster using your preferred language.

### [C#](#tab/csharp)

```csharp
using System.IO;
using System.Threading.Tasks;
using Kusto.Data; // Requires Package Microsoft.Azure.Kusto.Data
using Kusto.Data.Common;
using Kusto.Ingest; // Requires Package Microsoft.Azure.Kusto.Ingest
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var clusterPath = "https://<clusterName>.<region>.kusto.windows.net";
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        // Create Kusto connection string with App Authentication
        var connectionStringBuilder = new KustoConnectionStringBuilder(clusterPath)
            .WithAadApplicationKeyAuthentication(
                applicationClientId: appId,
                applicationKey: appKey,
                authority: appTenant
            );
        // Create a disposable client that will execute the ingestion
        using var client = KustoIngestFactory.CreateStreamingIngestClient(connectionStringBuilder);
        // Ingest from a compressed file
        var fileStream = File.Open("MyFile.gz", FileMode.Open);
        // Initialize client properties
        var ingestionProperties = new KustoIngestionProperties(databaseName: "<databaseName>", tableName: "<tableName>");
        // Create source options
        var sourceOptions = new StreamSourceOptions { CompressionType = DataSourceCompressionType.GZip, };
        // Ingest from stream
        await client.IngestFromStreamAsync(fileStream, ingestionProperties, sourceOptions);
    }
}
```

### [Python](#tab/python)

```python
from azure.kusto.data import KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import IngestionProperties, KustoStreamingIngestClient

clusterPath = "https://<clusterName>.<region>.kusto.windows.net"
appId = "<appId>"
appKey = "<appKey>"
appTenant = "<appTenant>"
dbName = "<dbName>"
tableName = "<tableName>"

csb = KustoConnectionStringBuilder.with_aad_application_key_authentication(
    clusterPath,
    appId,
    appKey,
    appTenant
)
client = KustoStreamingIngestClient(csb)

ingestionProperties = IngestionProperties(
    database=dbName,
    table=tableName,
    data_format=DataFormat.CSV
)

# Ingest from file
# Automatically detects gz format
client.ingest_from_file("MyFile.gz", ingestion_properties=ingestionProperties) 
```

### [Node.js](#tab/nodejs)

```nodejs
// Load modules using ES6 import statements:
import { DataFormat, IngestionProperties, StreamingIngestClient } from "azure-kusto-ingest";
import { KustoConnectionStringBuilder } from "azure-kusto-data";

// For earlier version, load modules using require statements:
// const IngestionProperties = require("azure-kusto-ingest").IngestionProperties;
// const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
// const {DataFormat} = require("azure-kusto-ingest").IngestionPropertiesEnums;
// const StreamingIngestClient = require("azure-kusto-ingest").StreamingIngestClient;

const clusterPath = "https://<clusterName>.<region>.kusto.windows.net";
const appId = "<appId>";
const appKey = "<appKey>";
const appTenant = "<appTenant>";
const dbName = "<dbName>";
const tableName = "<tableName>";
const mappingName = "<mappingName>"; // Required for JSON formatted files

const ingestionProperties = new IngestionProperties({
    database: dbName, // Your database
    table: tableName, // Your table
    format: DataFormat.JSON,
    ingestionMappingReference: mappingName
});

// Initialize client with engine endpoint
const client = new StreamingIngestClient(
    KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
        clusterPath,
        appId,
        appKey,
        appTenant
    ),
    ingestionProperties
);

// Automatically detects gz format
await client.ingestFromFile("MyFile.gz", ingestionProperties);
```

### [Go](#tab/go)

```go
import (
    "context"
    "github.com/Azure/azure-kusto-go/kusto"
    "github.com/Azure/azure-kusto-go/kusto/ingest"
    "github.com/Azure/go-autorest/autorest/azure/auth"
)

func ingest() {
    clusterPath := "https://<clusterName>.<region>.kusto.windows.net"
    appId := "<appId>"
    appKey := "<appKey>"
    appTenant := "<appTenant>"
    dbName := "<dbName>"
    tableName := "<tableName>"
    mappingName := "<mappingName>" // Optional, can be nil

    // Creates a Kusto Authorizer using your client identity, secret, and tenant identity.
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

    // Create an ingestion instance
    // Pass the client, the name of the database, and the name of table you wish to ingest into.
    in, err := ingest.New(client, dbName, tableName)
    if err != nil {
        panic("add error handling")
    }

    // Go currently only supports streaming from a byte array with a maximum size of 4 MB.
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
        String clusterPath = "https://<clusterName>.<region>.kusto.windows.net";
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

        // Initialize client and its properties
        IngestClient client = IngestClientFactory.createClient(csb);
        IngestionProperties ingestionProperties =
            new IngestionProperties(
                dbName,
                tableName
            );

        // Ingest from a compressed file
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

---

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take a few hours.

Before disabling streaming ingestion on your Azure Data Explorer cluster, drop the [streaming ingestion policy](kusto/management/streaming-ingestion-policy.md) from all relevant tables and databases. The removal of the streaming ingestion policy triggers data rearrangement inside your Azure Data Explorer cluster. The streaming ingestion data is moved from the initial storage to permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.

### Drop the streaming ingestion policy

You can drop the streaming ingestion policy using the Azure portal or programmatically in C\#.

#### [Portal](#tab/azure-portal)

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

#### [C#](#tab/azure-csharp)

To drop the streaming ingestion policy from the table, run the following code:

```csharp
using System.Threading.Tasks;
using Kusto.Data; // Requires Package Microsoft.Azure.Kusto.Data
using Kusto.Data.Common;
using Kusto.Data.Net.Client;
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var clusterPath = "https://<clusterName>.<region>.kusto.windows.net";
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        // Create Kusto connection string with App Authentication
        var connectionStringBuilder = new KustoConnectionStringBuilder(clusterPath)
            .WithAadApplicationKeyAuthentication(
                applicationClientId: appId,
                applicationKey: appKey,
                authority: appTenant
            );
        using var client = KustoClientFactory.CreateCslAdminProvider(connectionStringBuilder);
        var tablePolicyDropCommand = CslCommandGenerator.GenerateTableStreamingIngestionPolicyDropCommand("<dbName>", "<tableName>");
        await client.ExecuteControlCommandAsync(tablePolicyDropCommand);
    }
}
```

To disable streaming ingestion on your cluster, run the following code:

```csharp
using System.Threading.Tasks;
using Azure;
using Azure.Identity; // Required package Azure.Identity
using Azure.ResourceManager;
using Azure.ResourceManager.Kusto; // Required package Azure.ResourceManager.Kusto
using Azure.ResourceManager.Kusto.Models;
namespace StreamingIngestion;
class Program
{
    static async Task Main(string[] args)
    {
        var appId = "<appId>";
        var appKey = "<appKey>";
        var appTenant = "<appTenant>";
        var subscriptionId = "<subscriptionId>";
        var credentials = new ClientSecretCredential(appTenant, appId, appKey);
        var resourceManagementClient = new ArmClient(credentials, subscriptionId);
        var resourceGroupName = "<resourceGroupName>";
        var clusterName = "<clusterName>";
        var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
        var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
        var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
        var clusterPatch = new KustoClusterPatch(cluster.Data.Location) { IsStreamingIngestEnabled = false };
        await cluster.UpdateAsync(WaitUntil.Completed, clusterPatch);
    }
}
```

---

## Limitations

* [Data mappings](kusto/management/mappings.md) must be [pre-created](kusto/management/create-ingestion-mapping-command.md) for use in streaming ingestion. Individual streaming ingestion requests don't accommodate inline data mappings.
* [Extent tags](kusto/management/extent-tags.md) can't be set on the streaming ingestion data.
* [Update policy](kusto/management/update-policy.md). The update policy can reference only the newly ingested data in the source table and not any other data or tables in the database.
* When an update policy with a [transactional policy](kusto/management/update-policy.md#handling-failures) fails, the retries will fall back to batch ingestion.
* If streaming ingestion is enabled on a cluster used as a leader for [follower databases](follower.md), streaming ingestion must be enabled on the following clusters as well to follow streaming ingestion data. Same applies whether the cluster data is shared via [Data Share](data-share.md).

## Related content

* [Query data in Azure Data Explorer](web-query-data.md)
