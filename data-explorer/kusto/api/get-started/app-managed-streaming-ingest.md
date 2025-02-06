---
title: Create an app to ingest data by streaming ingestion using Kusto’s managed streaming ingestion client
description: Learn how to create an app to ingest data from a file, stream, or blob streaming ingestion by queuing it to Kusto’s batching manager.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 02/03/2025
monikerRange: "azure-data-explorer"
#customer intent: To learn about creating an app injest using Kusto’s batching manager and streaming ingestion.

---

# Create an app for streaming ingestion using Kusto’s batching manager

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Streaming Ingestion allows writing data to Kusto with near-real-time latencies. It’s also useful when writing small amounts of data to a large number of tables, making batching inefficient.

In this article you’ll learn how to ingest data to Kusto by queuing it to Kusto’s batching manager.
You will ingest a data stream in the form of a file, stream or blob.

> [NOTE!]
> Streaming ingestion is a high velocity ingestion protocol. Streaming Ingestion isn't the same as `IngestFromStream`.
> `IngestFromStream` is an API that takes in a memory stream and sends it for ingestion. It is available for all ingestion client implementations including queued and Streaming ingestion.

## Streaming and Managed Streaming

Kusto SDKs provide two flavors of Streaming Ingestion Clients, `StreamingIngestionClient` and `ManagedStreamingIngestionClient` where Managed Streaming has built-in retry and failover logic.

The following applies when using data ingesting with managed streaming:

+ Streaming requests that fail due to server side size limitations are failed-over to queued ingestion.
+ Data that's larger then 4MB is automatically sent to queued ingest, regardless of format or compression.
+ Transient failure, for example throttling, are be retried 3 times, then moved to queued ingestion.
+ Permanent failures are not be retired.

## Limitations

Data Streaming has some limitations compared to queuing data for ingestion.
• Tags can not be set on data
• Mapping can only be provided by Mapping Reference. Inline Mapping isn't supported.
• The payload sent in the request can not exceed 10MBs (regardless of format or compression).

For mor information, see [Streaming Limitations](/azure/data-explorer/ingest-data-streaming#limitations).

## Prerequisites

+ A Kusto cluster where you have database User or higher rights. You cam provision a free Kusto cluster in <https://dataexplorer.azure.com/freecluster>.
Prerequisites:

+ [Set up your development environment](/kusto/api/get-started/app-set-up?view=azure-data-explorer) to use the Kusto client library.

## Before you begin

Before creating the app, you need to do the following

1. Configure streaming ingestion on your Azure Data Explorer cluster.
1. Create a Kusto table to ingest the data into.
1. Enable the streaming ingestion policy on the table.
1. Download the [stormevent.csv](https://github.com/MicrosoftDocs/dataexplorer-docs-samples/blob/main/docs/resources/app-basic-ingestion/stormevents.csv) sample data file containing 1,000 storm event records.

## Configure streaming ingestion

To configure streaming ingestion on your Azure Data Explorer cluster, see [Configure streaming ingestion on your Azure Data Explorer cluster](/azure/data-explorer/ingest-data-streaming?tabs=azure-portal%2Ccsharp)

### Create a Kusto table

Run the commands below on your database via Kusto Explorer (Desktop) or Kusto Web Explorer.

1. Create a Table Called Storm Events

```kql
.create table MyStormEvents (StartTime:datetime, EndTime:datetime, State:string, DamageProperty:int, DamageCrops:int, Source:string, StormSummary:dynamic)
```

### Enable the streaming ingestion policy

Enable streaming ingestion on the table or on the entire database using one of the following commands:

```kql
.alter table <your table name> policy streamingingestion enable

.alter database <your database Name> policy streamingingestion enable
```

For more information about streaming policy, see [Streaming ingestion policy - Azure Data Explorer & Real-Time Analytics](../../../kusto//management/streaming-ingestion-policy.md)

## Create a basic client application

Create a basic client application which connects to the Kusto Help cluster.
Enter the cluster query and ingest URI and database name in the relevant variables.


### [C#](#tab/c-sharp)

The code sample includes a service function `PrintResultAsValueList()` for printing query results

```C#
using System;
using Kusto.Data;
using Kusto.Data.Net.Client;
using Kusto.Ingest;
using Kusto.Data.Common;
using Microsoft.Identity.Client;
using System.Data;

class Program
{
    static void Main(string[] args)
    {
        var tableName = "MyStormEvents";
        var cluster_url = "<your Kusto cluster query URI>";
        var ingestion_url = "<your Kusto cluster query ingest URI>";
        var database_name = "<your database name> ";
    
   
        var clusterKcsb = new KustoConnectionStringBuilder(cluster_url).WithAadUserPromptAuthentication();
        var ingestionKcsb = new KustoConnectionStringBuilder(ingestion_url).WithAadUserPromptAuthentication();;

        using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(clusterKcsb))
        using (var ingestClient = KustoIngestFactory.CreateManagedStreamingIngestClient(clusterKcsb, ingestionKcsb))
        {
            
            
            Console.WriteLine("Number of rows in " + tableName);
            var queryProvider = KustoClientFactory.CreateCslQueryProvider(clusterKcsb);
            var result = kustoClient.ExecuteQuery(databaseName, tableName + " | count", new ClientRequestProperties());
    
            PrintResultAsValueList(result);
            
        }
    }


    static void PrintResultAsValueList(IDataReader result)
    {
        var row=0;
        while (result.Read())
        {   
            row ++;
            Console.WriteLine("row:" + row.ToString() + "\t");
            for (int i = 0; i < result.FieldCount; i++)
            {

                Console.WriteLine("\t"+ result.GetName(i)+" - " + result.GetValue(i) );
            }
            Console.WriteLine();
        }
    }
}
```

## Stream a file for ingestion

Use the `IngestFromStorageAsync` method to ingest the *stormevents.csv* file.

Copy *stormevents.csv* file in the same location as your script. Since our CSV file contains a header row, use `IgnoreFirstRecord=True` to ignore the header.

Add and ingestion section using the following lines to the end of `Main()`.

```csharp
            var ingestProps = new KustoIngestionProperties(databaseName, tableName) 
                {
                    Format = DataSourceFormat.csv,
                    IgnoreFirstRecord = true
                };

            //Ingestion section
            Console.WriteLine("Ingesting data from a file");
            ingestClient.IngestFromStorageAsync(".\\stormevents.csv", ingestProps).Wait();
```

Let’s also query the new number of rows and the most recent row after the ingestion.
Add the following lines after the ingestion command:

```csharp
            Console.WriteLine("Number of rows in " + tableName);
            result = kustoClient.ExecuteQuery(databaseName, tableName + " | count", new ClientRequestProperties());
            PrintResultAsValueList(result);
            
            Console.WriteLine("Example line from " + tableName);
            result = kustoClient.ExecuteQuery(databaseName, tableName + " | top 1 by EndTime", new ClientRequestProperties());
            PrintResultAsValueList(result);
```
### [Typescript](#tab/typescript)

The code sample includes a service function `printResultAsValueList()` for printing query results

```typescript

import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";
import { InteractiveBrowserCredentialInBrowserOptions } from "@azure/identity";
import { ManagedStreamingIngestClient, BlobDescriptor, IngestionProperties, DataFormat } from 'azure-kusto-ingest';

const clusterUrl = "<your Kusto cluster query URI>";
const ingestionUrl ="<your Kusto cluster query ingest URI>";
const databaseName = "<your database name> ";

const tableName = "MyStormEvents"

    async function main() {
    const clusterKcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUrl);
    const ingestionKcsb = KustoConnectionStringBuilder.withUserPrompt(ingestionUrl);

    const kustoClient = new KustoClient(clusterKcsb);
    const ingestClient = new ManagedStreamingIngestClient(clusterKcsb, ingestionKcsb);

    console.log(`Number of rows in ${tableName}`);
    let result = await kustoClient.executeQuery(databaseName, `${tableName} | count`);
    printResultAsValueList(result);
}

function printResultAsValueList(result: any) {
    let rowCount = 1;

    // Create a list of columns
    const cols = result.primaryResults[0].columns.map((col: any) => col.name);
    // Print the values for each row
    for (const row of result.primaryResults) {
        if (rowCount > 1) {
            console.log('######################');
        }

        console.log(`row ${rowCount}:`);
        for (const col of cols) {
            const jsonObject = JSON.parse(row);
            const value = jsonObject.data[0][col];
            console.log(`\t ${col} - ${JSON.stringify(value)}`);
        }
        rowCount++;
    }
}

main().catch((err) => {
    console.error(err);
});

```

## Stream a file for ingestion


Use the `ingestFromFile()` API to ingest the *stormevents.csv* file.
Place *stormevents.csv* file in the same location as your script. Since our CSV file contains a header row, use `ignoreFirstRecord=True` to ignore the header.

Add and ingestion section using the following lines to the end of `main()`.


```typescript

    const ingestProperties = new IngestionProperties({
        database: databaseName,
        table: tableName,
        format: DataFormat.CSV,
        additionalProperties: { ignoreFirstRecord: true }
    });

    //Ingest section
    console.log("Ingesting data from a file");
    await ingestClient.ingestFromFile(".\\stormevents.csv", ingestProperties);
```
Let’s also query the new number of rows and the most recent row after the ingestion.
Add the following lines after the ingestion command:

```typescript
    console.log(`New number of rows in ${tableName}`);
    result = await kustoClient.executeQuery(databaseName, `${tableName} | count`);
    printResultAsValueList(result);

    console.log(`Example line from ${tableName}`);
    result = await kustoClient.executeQuery(databaseName, `${tableName} | top 1 by EndTime`);
    printResultAsValueList(result);
```

### [Python](#tab/python)

The code sample includes a service function `print_result_as_value_list()` for printing query results

```python
import os
import time
import io

from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, ClientRequestProperties, DataFormat
from azure.kusto.ingest import QueuedIngestClient, FileDescriptor, StreamDescriptor, BlobDescriptor, IngestionProperties, ManagedStreamingIngestClient


def print_result_as_value_list(result):
    row_count = 1

    # create a list of columns
    cols = list((col.column_name for col in result.primary_results[0].columns))

    # print the values for each row
    for row in result.primary_results[0]:
        if row_count > 1:
            print("######################")

        print("row", row_count, ":")
        for col in cols:
            print("\t", col, "-", row[col])


def main():
    # Connect to the public access Help cluster
    file_path = os.curdir + "/stormevents.csv"
    cluster_url = "<your Kusto cluster query URI>"
    ingestion_url = "<your Kusto cluster query ingest URI>"
    database_name = "<your database name> "
    table_name = "MyStormEvents"
    cluster_kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_url)
    ingestion_kcsb = KustoConnectionStringBuilder.with_interactive_login(ingestion_url)

    with KustoClient(cluster_kcsb) as kusto_client:
        with ManagedStreamingIngestClient(cluster_kcsb, ingestion_kcsb) as ingest_client:
        # with KustoStreamingIngestClient(cluster_kcsb) as ingest_client:

            print("Number of rows in " + table_name)
            result = kusto_client.execute_query(database_name, table_name + " | count")
            print_result_as_value_list(result)

main()
```

## Stream a file for ingestion


Use the `ingest_from_file()` API to ingest the *stormevents.csv* file.
Place *stormevents.csv* file in the same location as your script. Since our CSV file contains a header row, use `ignore_first_record=True` to ignore the header.

Add and ingestion section using the following lines to the end of `main()`.

```python
            # Ingestion section
            print("Ingesting data from a file")
            ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV, ignore_first_record=True)
            ingest_client.ingest_from_file(file_path, ingest_props)
```

Let’s also query the new number of rows and the most recent row after the ingestion.
Add the following lines after the ingestion command:

```python
            print("New number of rows in " + table_name)
            result = kusto_client.execute_query(database_name, table_name + " | count")
            print_result_as_value_list(result)
            
            print("Example line from " + table_name)
            result = kusto_client.execute_query(database_name, table_name + " | top 1 by EndTime")
            print_result_as_value_list(result)
```

Run the script from the directory where the script and stormevents.csv are located. Alternatively, you can specify the full path to the file replacing `file_path = os.curdir + "/stormevents.csv"` with `file_path = "<full path to stormevents.csv>"`

---

The first time your run the application the results are as follows:

```plaintext
Number of rows in MyStormEvents
row 1 :
         Count - 0
Ingesting data from a file
New number of rows in MyStormEvents
row 1 :
         Count - 1001
Example line from MyStormEvents
row 1 :
         StartTime - 2007-12-31 11:15:00+00:00
         EndTime - 2007-12-31 13:21:00+00:00
         State - HAWAII
         DamageProperty - 0
         DamageCrops - 0
         Source - COOP Observer
         StormSummary - {'TotalDamages': 0, 'StartTime': '2007-12-31T11:15:00.0000000Z', 'EndTime': '2007-12-31T13:21:00.0000000Z', 'Details': {'Description': 'Heavy showers caused flash flooding in the eastern part of Molokai.  Water was running over the bridge at Halawa Valley.', 'Location': 'HAWAII'}}
```

### Stream in-memory data for ingestion

To ingest data from memory, create a stream containing the data for ingestion.

### [C#](#tab/c-sharp)

Call the `IngestFromStreamAsync()` method to ingest the stream.

Replace the ingestion section code with the following:

```csharp
            // Ingestion section
            Console.WriteLine("Ingesting data from memory");
            var singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,'{}'";
            byte[] byteArray = Encoding.UTF8.GetBytes(singleLine);
            using (MemoryStream stream = new MemoryStream(byteArray))
               {
                var streamSourceOptions = new StreamSourceOptions
                {
                    LeaveOpen = false
                };
                ingestClient.IngestFromStreamAsync(stream, ingestProps, streamSourceOptions).Wait();
               }
```

### [Python](#tab/python)

Call the `ingest_from_stream()` API to ingest the stream.

Replace the ingestion section code with the following:

```python
        # Ingestion section
        print("Ingesting data from memory")
        single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
        string_stream = io.StringIO(single_line)
        ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV)
        # when possible provide the size of the raw data
        stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
        ingest_client.ingest_from_stream(stream_descriptor, ingest_props)
```

### [Typescript](#tab/typescript)

Call the `ingestFromStream()` API to ingest the stream.

Replace the ingestion section code with the following:

```typescript
    //Ingest section
    console.log('Ingesting data from memory');
    const single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
    await ingestClient.ingestFromStream(Buffer.from(single_line), ingestProperties)
```

---

The results are as follows:

```plaintext
Number of rows in MyStormEvents
row 1 :
	 Count - 1001

Ingesting data from memory

New number of rows in MyStormEvents
row 1 :
	 Count - 1002

Example line from MyStormEvents
row 1 :
	 StartTime - 2018-01-26 00:00:00+00:00
	 EndTime - 2018-01-27 14:00:00+00:00
	 State - MEXICO
	 DamageProperty - 0
	 DamageCrops - 0
	 Source - Unknown
	 StormSummary - {}
```

---

### Stream a blob for ingestion

Kusto supports ingestion from Azure Storage blobs, Azure Data Lake files and Amazon S3 files.

When you send a blob for streaming, the client only sends the blob reference to the database, and the data is actually read once by the service itself. Read Access to the blob can be granted with keys, SAS tokens or managed identities attached to the Kusto Cluster.
  
For this section you’ll need to upload the sample csv file to your storage account and generate a URI with built-in read permissions (e.g. via SAS) to provide to the code sample. For information on uploading a file to blob storage, see [Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal). For information on generation an SAS URL, see [Generate a SAS token](/kusto/api/connection-strings/generate-sas-token?view=azure-data-explorer&preserve-view=true).

### [C#](#tab/c-sharp)

Replace the ingestion section code with the following section:

```csharp
            // Ingestion section
            Console.WriteLine("Ingesting data from an existing blob");
            var sasURI ="<your SAS URI>";
            ingestClient.IngestFromStorageAsync(sasURI, ingestProps).Wait();
```

### [Python](#tab/python)

Replace the ingestion section code with the following section:

```python
        # Ingestion section
        print("Ingesting data from an existing blob")
        blob_descriptor = BlobDescriptor("<blob path with SAS or key>")
        ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV, ignore_first_record=True)
        ingest_client.ingest_from_blob(blob_descriptor, ingest_props)
```

### [Typescript](#tab/typescript)

Replace the ingestion section code with the following section:

```typescript
    // Ingestion section
    console.log('Ingesting data from an existing blob');
    const sasURI = "<your SAS URI>";
    await ingestClient.ingestFromBlob(sasURI, ingestProperties);
```

---

The results are as follows:

```plaintext
Number of rows in MyStormEvents
row 1 :
     Count - 1002

Ingesting data from an existing blob

New number of rows in MyStormEvents
row 1 :
	 Count - 2002

Example line from MyStormEvents
row 1 :
	 StartTime - 2018-01-26 00:00:00+00:00
	 EndTime - 2018-01-27 14:00:00+00:00
	 State - MEXICO
	 DamageProperty - 0
	 DamageCrops - 0
	 Source - Unknown
	 StormSummary - {}

```

> [!NOTE]
> You can also use a managed identity based authorization as an alternative to SAS or account keys in Azure Storage and Azure Data Lake. For more information, see [Ingest data using managed identity authentication](/azure/data-explorer/ingest-data-managed-identity)

## Resources
+ [Kusto Python Git Hub repository](https://github.com/Azure/azure-kusto-python)
+ [Kusto NodeJS Git Hub repository](https://github.com/Azure/azure-kusto-node)
+ [Kusto Java Git Hub repository](https://github.com/azure/azure-kusto-java)
+ [Kusto .Net API SDK](/kusto/api/netfx/about-the-sdk)
+ [Generate a Sample App wizard](https://dataexplorer.azure.com/oneclick/generatecode)
