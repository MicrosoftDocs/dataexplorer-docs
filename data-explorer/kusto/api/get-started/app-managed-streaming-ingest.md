---
title: Create an app to ingest data by streaming ingestion using Kusto’s batching manager
description: Learn how to create an app to ingest data from a file, stream, or blob streaming ingestion by queuing it to Kusto’s batching manager.
ms.reviewer: yogilad
ms.service: data-explorer
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
• Mapping can only be provided by Mapping Reference. Inline Mapping is not supported.
• The payload sent in the request can not exceed 10MBs (regardless of format or compression).

For mor information, see [Streaming Limitations](../../../ingest-data-streaming.md#limitations).

## Prerequisites

+ A Kusto cluster where you have database User or higher rights. You cam provision a free Kusto cluster in <https://dataexplorer.azure.com/freecluster>.
Prerequisites:
+ Download the file [stormevents.csv](where do we store this ???)and place it in a folder next to your script.

## Before you begin

Before creating the app, you need to do the following

1. Configure streaming ingestion on your Azure Data Explorer cluster.
1. Create a Kusto table to ingest the data into.
1. Enable the streaming ingestion policy on the table.

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

# Create a basic client application

Create a basic client application which connects to the Kusto Help cluster.
Enter the cluster query and ingest URI and database name in the relevant variables.

The code sample includes a service function `print_result_as_value_list()` for printing query results

```python
import os
import time
import io

from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, ClientRequestProperties, DataFormat
from azure.kusto.ingest import QueuedIngestClient, FileDescriptor, StreamDescriptor, BlobDescriptor, IngestionProperties


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

Let’s use the `ingest_from_file()` API to ingest stormevents.csv.
Place stormevents.csv file in the same location as your script. Since our CSV file contains a header row we use `ignore_first_record=True` to ignore it.

Add and ingestion section using the following lines to the end of main().

```python
# ingestion section
print("Ingesting data from a file")
ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV, ignore_first_record=True)
ingest_client.ingest_from_file(file_path, ingest_props)
```

Let’s also query the new number of rows and the most recent row.
Add the following lines after the ingestion command:


```python
print("New number of rows in " + table_name)
result = kusto_client.execute_query(database_name, table_name + " | count")
print_result_as_value_list(result)

print("Example line from " + table_name)
result = kusto_client.execute_query(database_name, table_name + " | top 1 by EndTime")
print_result_as_value_list(result)
```

Run the script from the directory where the script and stormevents.csv are located. Alternatively, you can specify the full path to the file. replacing `file_path = os.curdir + "/stormevents.csv"` with `file_path = "<full path to stormevents.csv>"`

The first time your run the application the results will be as follows:

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

To ingest data from memory, create a stream containing the data for ingestion and call the `ingest_from_stream()` API.

Replace the ingestion section code with the following:

```python
print("Ingesting data from memory")
single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
string_stream = io.StringIO(single_line)
ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV)
# when possible provide the size of the raw data
stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
ingest_client.ingest_from_stream(stream_descriptor, ingest_props)
```

The results will be as follows:

```plaintext
Number of rows in MyStormEvents
row 1 :
	 Count - 0

Ingesting data from memory

New number of rows in MyStormEvents
row 1 :
	 Count - 1

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

### Stream a blob for ingestion

Kusto supports ingestion from Azure Storage blobs, Azure Data Lake files and Amazon S3 files.

When you send a blob for streaming, the client only sends the blob reference to the database, and the data is actually read once by the service itself. Read Access to the blob can be granted with keys, SAS tokens or managed identities attached to the Kusto Cluster.
  
For this section you’ll need to upload the sample csv file to your storage account and generate a URI with built-in read permissions (e.g. via SAS) to provide to the code sample. For information on uploading a file to blob storage, see [Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal). For information on generation an SAS URL, see [Generate a SAS token](kusto/api/connection-strings/generate-sas-token?view=azure-data-explorer&preserve-view=true).

Replace the ingestion section code with the following section:

```python
print("Ingesting data from an existing blob")
blob_descriptor = BlobDescriptor("<blob path with SAS or key>")
ingest_props = IngestionProperties(database_name, table_name, DataFormat.CSV, ignore_first_record=True)
ingest_client.ingest_from_blob(blob_descriptor, ingest_props)
```

> [NOTE!]
> You can also use a managed identity based authorization as an alternative to SAS or account keys in Azure Storage and Azure Data Lake. For more information, see [Ingest data using managed identity authentication](/azure/data-explorer/ingest-data-managed-identity)


Resources:
+ Kusto Python Git Hub repository [https://github.com/Azure/azure-kusto-python]
+ Python Sample App Wizard [https://dataexplorer.azure.com/oneclick/generatecode?programingLang=Python]
