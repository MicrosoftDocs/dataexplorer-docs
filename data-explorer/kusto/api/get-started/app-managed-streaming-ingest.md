---
title: Create an app to ingest data by streaming ingestion using Kusto’s managed streaming ingestion client
description: Learn how to create an app to ingest data from a file, stream, or blob streaming using the ingestion managed streaming ingestion client.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 02/03/2025
monikerRange: "azure-data-explorer"

# customer intent: To learn about creating an app ingest using Kusto’s managed streaming ingestion client.

---

# Create an app for streaming ingestion using Kusto’s managed streaming ingestion client

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Streaming Ingestion allows writing data to Kusto with near-real-time latencies. It’s also useful when writing small amounts of data to a large number of tables, making batching inefficient.

In this article, you’ll learn how to ingest data to Kusto using the managed streaming ingestion client. You'll ingest a data stream in the form of a file, in-memory stream, or blob.

> [!NOTE]
> Streaming ingestion is a high velocity ingestion protocol. Streaming Ingestion isn't the same as `IngestFromStream`.
> `IngestFromStream` is an API that takes in a memory stream and sends it for ingestion. `IngestFromStream` is available for all ingestion client implementations including queued and streaming ingestion.

## Streaming and Managed Streaming

Kusto SDKs provide two flavors of Streaming Ingestion Clients, `StreamingIngestionClient` and `ManagedStreamingIngestionClient` where Managed Streaming has built-in retry and failover logic.

When ingesting with `ManagedStreamingIngestionClient`, failures and retries are handled automatically as follows:

+ Streaming requests that fail due to server-side size limitations are failed-over to queued ingestion.
+ Data that's larger than 4 MB is automatically sent to queued ingestion, regardless of format or compression.
+ Transient failure, for example throttling, are retried three times, then moved to queued ingestion.
+ Permanent failures aren't retried.

> [!NOTE]
> If the streaming ingestion fails and the data is sent to queued ingestion, some latency is introduced until the data is visible in the table.

## Limitations

Data Streaming has some limitations compared to queuing data for ingestion.
+ Tags can’t be set on data.
+ Mapping can only be provided using [`ingestionMappingReference`](/kusto/management/mappings?view=azure-data-explorer#mapping-with-ingestionmappingreference). Inline mapping isn't supported.
+ The payload sent in the request can’t exceed 10 MB, regardless of format or compression.
+ The `ignoreFirstRecord` property isn't supported for managed streaming ingestion, so ingested data must not contain a header row.

For more information, see [Streaming Limitations](/azure/data-explorer/ingest-data-streaming#limitations).

## Prerequisites

+ A Kusto cluster where you have database User or higher rights. Provision a free Kusto cluster at <https://dataexplorer.azure.com/freecluster>.

+ [Set up your development environment](/kusto/api/get-started/app-set-up?view=azure-data-explorer) to use the Kusto client library.

## Before you begin

Before creating the app, the following steps are required. Each step is detailed in the following sections.

1. Configure streaming ingestion on your Azure Data Explorer cluster.
1. Create a Kusto table to ingest the data into.
1. Enable the streaming ingestion policy on the table.
1. Download the [stormevent.csv](https://github.com/MicrosoftDocs/dataexplorer-docs-samples/blob/main/docs/resources/app-managed-streaming-ingestion/stormevents.csv) sample data file containing 1,000 storm event records.

## Configure streaming ingestion

To configure streaming ingestion, see [Configure streaming ingestion on your Azure Data Explorer cluster](/azure/data-explorer/ingest-data-streaming?tabs=azure-portal%2Ccsharp). If you're using a free cluster, streaming ingestion is automatically enabled.

### Create a Kusto table

Run the following commands on your database via Kusto Explorer (Desktop) or Kusto Web Explorer.

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

The code sample includes a service function `PrintResultAsValueList()` for printing query results.

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

Copy *stormevents.csv* file to the same location as your script. Since our input is a CSV file, use `Format = DataSourceFormat.csv` in the ingestion properties.

Add and ingestion section using the following lines to the end of `Main()`.

```csharp
            var ingestProps = new KustoIngestionProperties(databaseName, tableName) 
                {
                    Format = DataSourceFormat.csv
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
Place the *stormevents.csv* file in the same location as your script. Since our input is a CSV file, use `DataFormat.CSV` in the ingestion properties.

Add and ingestion section using the following lines to the end of `main()`.

```python
            # Ingestion section
            print("Ingesting data from a file")
            ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV)
            ingest_client.ingest_from_file(file_path, ingest_props)
            ingest_client.close()
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

### [TypeScript](#tab/typescript)

The code sample includes a service function `printResultAsValueList()` for printing query results.

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
Place the *stormevents.csv* file in the same location as your script. Since our input is a CSV file, use `format: DataFormat.CSV` in the ingestion properties.

Add and ingestion section using the following lines to the end of `main()`.

```typescript

    const ingestProperties = new IngestionProperties({
        database: databaseName,
        table: tableName,
        format: DataFormat.CSV
    });

    //Ingest section
    console.log("Ingesting data from a file");
    await ingestClient.ingestFromFile(".\\stormevents.csv", ingestProperties);
    ingestClient.close();
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

### [Java](#tab/java)

The code sample includes a service method `printResultsAsValueList()` for printing query results.

```java

package com.example;

import java.io.FileWriter;

import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.microsoft.azure.kusto.data.Client;
import com.microsoft.azure.kusto.data.ClientFactory;
import com.microsoft.azure.kusto.data.KustoOperationResult;
import com.microsoft.azure.kusto.data.KustoResultSetTable;
import com.microsoft.azure.kusto.data.KustoResultColumn;
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.ingest.IngestClientFactory;
import com.microsoft.azure.kusto.ingest.IngestionProperties;
import com.microsoft.azure.kusto.ingest.ManagedStreamingIngestClient;
import com.microsoft.azure.kusto.ingest.IngestionProperties.DataFormat;
import com.microsoft.azure.kusto.ingest.source.FileSourceInfo;

public class BatchIngestion {
    public static void main(String[] args) throws Exception {

        String clusterUri = "<your Kusto cluster query URI>";
        String ingestionUri = "<your Kusto cluster query ingest URI>";

        String database = "<your database name>";
        String table = "MyStormEvents";

        ConnectionStringBuilder clusterKcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
        ConnectionStringBuilder ingestionKcsb = ConnectionStringBuilder.createWithUserPrompt(ingestionUri);

        try (
                Client kustoClient = ClientFactory.createClient(clusterKcsb)) {

            String query = table + " | count";
            KustoOperationResult results = kustoClient.execute(database, query);
            KustoResultSetTable primaryResults = results.getPrimaryResults();
            System.out.println("\nNumber of rows in " + table + " BEFORE ingestion:");
            printResultsAsValueList(primaryResults);
        }
    }

    public static void printResultsAsValueList(KustoResultSetTable results) {
        while (results.next()) {
            KustoResultColumn[] columns = results.getColumns();
            for (int i = 0; i < columns.length; i++) {
                System.out.println("\t" + columns[i].getColumnName() + " - "
                        + (results.getObject(i) == null ? "None" : results.getString(i)));
            }
        }
    }
}
```

## Stream a file for ingestion

Use the `ingestFromFile()` method to ingest the *stormevents.csv* file.
Place the *stormevents.csv* file in the same location as your script. Since our input is a CSV file, use `ingestionProperties.setDataFormat(DataFormat.CSV)` in the ingestion properties.

Add and ingestion section using the following lines to the end of `main()`.

```java
            // Ingestion section
            try (
                    ManagedStreamingIngestClient ingestClient = (ManagedStreamingIngestClient) IngestClientFactory
                            .createManagedStreamingIngestClient(clusterKcsb, ingestionKcsb)) {
                System.out.println("Ingesting data from a file");
                String filePath = "stormevents.csv";
                IngestionProperties ingestionProperties = new IngestionProperties(database, table);
                ingestionProperties.setDataFormat(DataFormat.CSV);
                FileSourceInfo fileSourceInfo = new FileSourceInfo(filePath, 0);
                ingestClient.ingestFromFile(fileSourceInfo, ingestionProperties);

            } catch (Exception e) {
                // TODO: handle exception
                System.out.println("Error: " + e);
            }

```

Let’s also query the new number of rows and the most recent row after the ingestion.
Add the following lines after the ingestion command:

```java
            query = table + " | count";
            results = kustoClient.execute(database, query);
            primaryResults = results.getPrimaryResults();
            System.out.println("\nNumber of rows in " + table + " AFTER ingestion:");
            printResultsAsValueList(primaryResults);

            query = table + " | top 1 by EndTime";
            results = kustoClient.execute(database, query);
            primaryResults = results.getPrimaryResults();
            System.out.println("\nExample line from " + table);
            printResultsAsValueList(primaryResults);
```

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

To ingest the stream from memory, call the `IngestFromStreamAsync()` method.

Replace the ingestion section with the following code:

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

To ingest the stream from memory, call the `ingest_from_stream()` API.

Replace the ingestion section with the following code:

```python
        # Ingestion section
        print("Ingesting data from memory")
        single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
        string_stream = io.StringIO(single_line)
        ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV)
        # when possible provide the size of the raw data
        stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
        ingest_client.ingest_from_stream(stream_descriptor, ingest_props)
        ingest_client.close()
```

### [TypeScript](#tab/typescript)

To ingest the stream from memory, call the `ingestFromStream()` API.

Replace the ingestion section with the following code:

```typescript
    //Ingest section
    console.log('Ingesting data from memory');
    const single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
    await ingestClient.ingestFromStream(Buffer.from(single_line), ingestProperties)
    ingestClient.close();
```

### [Java](#tab/java)

To ingest the stream from memory, call the `ingestFromStream()` API.

Replace the ingestion section with the following code:

```java
            String singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
            ByteArrayInputStream inputStream = new ByteArrayInputStream(singleLine.getBytes(StandardCharsets.UTF_8));
            try (
                    ManagedStreamingIngestClient ingestClient = (ManagedStreamingIngestClient) IngestClientFactory
                            .createManagedStreamingIngestClient(clusterKcsb, ingestionKcsb)) {
                System.out.println("Ingesting data from a byte array");
                IngestionProperties ingestionProperties = new IngestionProperties(database, table);
                ingestionProperties.setDataFormat(DataFormat.CSV);
                StreamSourceInfo streamSourceInfo = new StreamSourceInfo(inputStream);
                ingestClient.ingestFromStream(streamSourceInfo, ingestionProperties);

            } catch (Exception e) {
                // TODO: handle exception
                System.out.println("Error: " + e);
            }
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

Kusto supports ingestion from Azure Storage blobs, Azure Data Lake files, and Amazon S3 files.

When you send a blob for streaming, the client only sends the blob reference to the database. The data is read by the database service itself. Read Access to the blob can be granted with keys, SAS tokens, or managed identities attached to the Kusto Cluster.
  
To ingest from a blob, upload the sample csv file to your storage account and generate a SAS URI with built-in read permissions. Use the URI in the code sample. For information on uploading a file to blob storage, see [Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal). For information on generation an SAS URL, see [Generate a SAS token](/kusto/api/connection-strings/generate-sas-token?view=azure-data-explorer&preserve-view=true).

### [C#](#tab/c-sharp)

To ingest the blob, call the `IngestFromStorageAsync()` method.
  
Replace the ingestion section with the following code:

```csharp
        // Ingestion section
        Console.WriteLine("Ingesting data from an existing blob");
        var sasURI ="<your SAS URI>";
        ingestClient.IngestFromStorageAsync(sasURI, ingestProps).Wait();
```

### [Python](#tab/python)

To ingest the blob, call the `ingest_from_blob()` API.
  
Replace the ingestion section with the following code:

```python
        # Ingestion section
        print("Ingesting data from an existing blob")
        blob_descriptor = BlobDescriptor("<blob path with SAS or key>")
        ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV)
        ingest_client.ingest_from_blob(blob_descriptor, ingest_props)
        ingest_client.close()
```

### [TypeScript](#tab/typescript)

To ingest the blob, call the `ingestFromBlob()` API.
  
Replace the ingestion section with the following code:

```typescript
    // Ingestion section
    console.log('Ingesting data from an existing blob');
    const sasURI = "<your SAS URI>";
    await ingestClient.ingestFromBlob(sasURI, ingestProperties);
    ingestClient.close();
```

### [Java](#tab/java)    

To ingest the blob, call the `ingestFromBlob()` API.
  
Replace the ingestion section with the following code:

```java
            // Ingestion section
            try (ManagedStreamingIngestClient ingestClient = (ManagedStreamingIngestClient) IngestClientFactory
                    .createManagedStreamingIngestClient(clusterKcsb, ingestionKcsb)) {
                System.out.println("Ingesting data from a blob");
                String sasURI = "<your SAS URI>";
                BlobSourceInfo blobSourceInfo = new BlobSourceInfo(sasURI);
                IngestionProperties ingestionProperties = new IngestionProperties(database, table);
                ingestionProperties.setDataFormat(DataFormat.CSV);
                ingestClient.ingestFromBlob(blobSourceInfo, ingestionProperties);

            } catch (Exception e) {
                // TODO: handle exception
                System.out.println("Error: " + e);
            }
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
+ [Kusto Python GitHub repository](https://github.com/Azure/azure-kusto-python)
+ [Kusto NodeJS GitHub repository](https://github.com/Azure/azure-kusto-node)
+ [Kusto Java GitHub repository](https://github.com/azure/azure-kusto-java)
+ [Kusto .NET API SDK](/kusto/api/netfx/about-the-sdk)
+ [Generate a Sample App wizard](https://dataexplorer.azure.com/oneclick/generatecode)
