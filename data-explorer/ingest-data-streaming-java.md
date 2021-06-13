---
title:  Configure streaming ingestion on your Azure Data Explorer cluster using Java
description: Learn how to configure your Azure Data Explorer cluster and start loading data with streaming ingestion using Java
author: orspod
ms.author: orspodek
ms.reviewer: alexefro
ms.service: data-explorer
ms.topic: how-to
ms.date: 06/07/2021
---

//TODO:: Remove the individual topics. Keep just Portal + C\#. In Portal, under use, embed samples to other languages samples

------------------
NODE:

// Streaming ingest client 
const props = new IngestionProps({
database: "<YOUR DB HERE>",
table: "<YOUR TABLE HERE>",
format: DataFormat.JSON,
ingestionMappingReference: "Pre-defiend mapping name" // For json format mapping is required
});
// Init with engine endpoint
const streamingIngestClient = new StreamingIngestClient(
KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
`https://<YOUR CLUSTER HERE>.kusto.windows.net`, <YOUR APP ID>, <YOUR APP KEY>, <YOUR AUTHORITY ID>
),
props
);
await streamingIngestClient.ingestFromFile("file.json", props);
------------------

----------------------------
Python:

import io
from azure.kusto.data import KustoConnectionStringBuilder
from azure.kusto.ingest import (
    IngestionProperties,
    DataFormat,
    KustoStreamingIngestClient,
)

# In case you want to authenticate with AAD device code.
# Please note that if you choose this option, you'll need to autenticate for every new instance that is initialized.
# It is highly recommended to create one instance and use it for all of your queries.

cluster = "https://{cluster_name}.kusto.windows.net"
kcsb = KustoConnectionStringBuilder.with_aad_device_authentication(cluster)
client = KustoStreamingIngestClient(kcsb)

ingestion_properties = IngestionProperties(database="{database_name}", table="{table_name}", data_format=DataFormat.CSV)

# ingest from stream
byte_sequence = b"56,56,56"
bytes_stream = io.BytesIO(byte_sequence)
client.ingest_from_stream(bytes_stream, ingestion_properties=ingestion_properties)
---------------------



# Configure streaming ingestion on your Azure Data Explorer cluster using Java

> [!div class="op_single_selector"]
> * [Portal](ingest-data-streaming.md)
> * [C#](ingest-data-streaming-csharp.md)
> * [Python](ingest-data-streaming-python.md)
> * [Node](ingest-data-streaming-node.md)
> * [Go](ingest-data-streaming-go.md)
> * [Java](ingest-data-streaming-java.md)

[!INCLUDE [ingest-data-streaming-intro](includes/ingest-data-streaming-intro.md)]

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Create [an Azure AD application registration](provision-azure-ad-app.md) and grant it permissions to the database.
    > [!NOTE]
    > Make sure you copy the application ID and key. You'll need these later.
* //TODO: Configure streaming ingestion on your Azure Data Explorer cluster using the Azure portal (https://docs.microsoft.com/en-us/azure/data-explorer/ingest-data-streaming)
    > [!WARNING]
    > Review the [limitations](#limitations) prior to enabling steaming ingestion.
* In the ADX portal, create [a table in the database](kusto/management/create-table-command.md).

    ```kusto
    .create table StreamingIngest (rownumber:int, rowguid:string, xdouble:real, xfloat:real, xbool:bool, xint16:int, xint32:int, xint64:long, xuint8:long, xuint16:long, xuint32:long, xuint64:long, xdate:datetime, xsmalltext:string, xtext:string, xnumberAsText:string, xtime:timespan, xtextWithNulls:string, xdynamicWithNulls:dynamic)
    ```

* Create [a mapping between the file and the table](kusto/management/create-ingestion-mapping-command.md).

    ```kusto
    .create table StreamingIngest ingestion json mapping "JsonMapping" '[{"column":"rownumber","path": "$.rownumber", "datatype":"int" },{"column":"rowguid", "path":"$.rowguid","datatype":"string" },{"column":"xdouble", "path":"$.xdouble", "datatype":"real" },{"column":"xfloat", "path":"$.xfloat", "datatype":"real" },{"column":"xbool", "path":"$.xbool", "datatype":"bool" },{"column":"xint16", "path":"$.xint16", "datatype":"int" },{"column":"xint32", "path":"$.xint32", "datatype":"int" },{"column":"xint64", "path":"$.xint64", "datatype":"long" },{"column":"xuint8", "path":"$.xuint8", "datatype":"long"},{"column":"xuint16", "path":"$.xuint16", "datatype":"long"},{"column":"xuint32", "path":"$.xuint32", "datatype":"long"},{"column":"xuint64", "path":"$.xuint64", "datatype":"long"},{"column":"xdate", "path":"$.xdate", "datatype":"datetime"},{"column":"xsmalltext", "path":"$.xsmalltext","datatype":"string"},{"column":"xtext", "path":"$.xtext","datatype":"string"},{"column":"xnumberAsText", "path":"$.xnumberAsText","datatype":"string"},{"column":"xtime", "path":"$.xtime","datatype":"timespan"}, {"column":"xtextWithNulls", "path":"$.xtextWithNulls","datatype":"string"}, {"column":"xdynamicWithNulls", "path":"$.xdynamicWithNulls","datatype":"dynamic"}]'

    ```

[!INCLUDE [ingest-data-streaming-use](includes/ingest-data-streaming-types.md)]

[!INCLUDE [ingest-data-streaming-disable](includes/ingest-data-streaming-disable.md)]

### Drop the streaming ingestion policy using Java

To drop the streaming ingestion policy from the table, run the following code:

```csharp
        var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
        var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
        var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
        var databaseName = "StreamingTestDb";
        var tableName = "TestTable";
        var kcsb = new KustoConnectionStringBuilder("https://mystreamingcluster.westcentralus.kusto.windows.net", databaseName);
        kcsb = kcsb.WithAadApplicationKeyAuthentication(clientId, clientSecret, tenantId);

        var tablePolicyDropCommand = CslCommandGenerator.GenerateTableStreamingIngestionPolicyDropCommand(databaseName, tableName);
        using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
        {
            client.ExecuteControlCommand(tablePolicyDropCommand);
        }
```

### Disable streaming ingestion using Java

To disable streaming ingestion on your cluster, run the following code:

```csharp
        var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
        var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
        var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
        var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
        var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
        var credential = new ClientCredential(clientId, clientSecret);
        var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

        var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

        var kustoManagementClient = new KustoManagementClient(credentials)
        {
            SubscriptionId = subscriptionId
        };

        var resourceGroupName = "testrg";
        var clusterName = "mystreamingcluster";
        var clusterUpdateParameters = new ClusterUpdate(enableStreamingIngest: false);

        await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdateParameters);
```

[!INCLUDE [ingest-data-streaming-limitations](includes/ingest-data-streaming-limitations.md)]

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
