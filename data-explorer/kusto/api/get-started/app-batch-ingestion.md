---
title:  'Create an app to ingest data using the batching manager'
description: Learn how to create an app to ingest data using the batching manager of the Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 07/05/2023
---
# Create an app to ingest data using the batching manager

Kusto is capable of handling mass data intake by optimizing and batching ingested data via its batching manager. The batching manager aggregates ingested data before it reaches its target table, allowing for more efficient processing and improved performance. Batching is typically done in bulks of 1 GB of raw data, 1000 individual files, or by a default time out of 5 minutes. Batching policies can be updated at the database and table levels, commonly to lower the batching time and reduce latency. For more information about ingestion batching, see [IngestionBatching policy](../../management/batchingpolicy.md) and [Change table level ingestion batching policy programmatically](app-management-commands.md#change-the-table-level-ingestion-batching-policy).

> [!NOTE]
> Batching also takes into account various factors such as the target database and table, the user running the ingestion, and various properties associated with the ingestion, such as special tags.

<!-- > [!NOTE]
> The example below assumes there's a trivial match between the content of the data ingested and the scheme of the target table.
> If the content does not trivially map into the table scheme, an ingestion mapping is required to align the content with the table columns. -->

In this article, you learn how to:

> [!div class="checklist"]
>
> - [Queue a file for ingestion and process the results](#queue-a-file-for-ingestion-and-process-the-results)
> - [Queue in-memory data for ingestion and process the results](#queue-in-memory-data-for-ingestion-and-process-the-results)
> - [Queue a blob for ingestion and process the results](#queue-a-blob-for-ingestion-and-process-the-results)

## Prerequisites

- [Set up your development environment](app-set-up.md) to use the Kusto client library.

## Before you begin

- Use one of the following methods to create the *stormevents* table and, as only a small amount of data is being ingested, set its ingestion batching policy timeout to 10 seconds:

    ### [Run an app](#tab/app)

    1. Create a target table named *MyStormEvents* in your database by running the first app in [management commands](app-management-commands.md#run-a-management-command-and-process-the-results).
    1. Set the ingestion batching policy timeout to 10 seconds by running the second app in [management commands](app-management-commands.md#change-the-table-level-ingestion-batching-policy). Before running the app, change the timeout value to `00:00:10`.

    ### [Web UI](#tab/webui)

    1. In the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home), create a target table named *MyStormEvents* in your database by running the following query:

        > [!div class="nextstepaction"]
        > <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/Develop-quickstarts?query=H4sIAAAAAAAAA22OQQoCMQxF954iSwXxALN1ZikI9QKxDUPBtJL+EXr7CYMLFbMK7yWff4omDCHw/SF06QHVdHpJQduRzz6ADbesMlDyQ/h23AxNJf3l/gGnDZbL/GYjK89ytfoUQx8oF3yZs5v2iUNdLP6mbOXCosrmGakX1hwPK06O/pXDAAAA" target="_blank">Run the query</a>

        ```kusto
        .create table MyStormEvents
          (StartTime: datetime,
          EndTime: datetime,
          State: string,
          DamageProperty: int,
          DamageCrops: int,
          Source: string,
          StormSummary: dynamic)
        ```

    1. Set the ingestion batching policy timeout to 10 seconds by running the following query:

        > [!div class="nextstepaction"]
        > <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/Develop-quickstarts?query=H4sIAAAAAAAAA9NLzClJLVIoSUzKSVXwrQwuyS/KdS1LzSspVijIz8lMrlTIzEtPLS7JzM9LSixJzgDyFNSrFZR8Eysyc0tznaBiIZm5qcEFiXlKVkoGBlZAZGigpFCrDgBZ3lqMXgAAAA==" target="_blank">Run the query</a>

        ```kusto
        .alter table MyStormEvents policy ingestionbatching '{ "MaximumBatchingTimeSpan":"00:00:10" }'
        ```

    ---

    > [!NOTE]
    > It may take a few minutes for the new batching policy settings to propagate to the batching manager.

- Download the [stormevent.csv](https://github.com/MicrosoftDocs/dataexplorer-docs-samples/blob/main/docs/resources/app-basic-ingestion/stormevents.csv) sample data file. The file contains 1,000 storm event records.

## Queue a file for ingestion and process the results

In your preferred IDE or text editor, create a project or file named *basic ingestion* using the convention appropriate for your preferred language. Place the *stormevent.csv* file in the same location as your app. Then add the following code:

1. Create a client app that connects to your cluster and prints the number of rows in the *MyStormEvents* table. You'll use this count as a baseline for comparison with the number of rows after each method of ingestion. Replace the `<your_cluster_uri>` and `<your_database>` placeholders with your cluster URI and database name respectively.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    > [!NOTE]
    > In the following examples you use two clients, one to query your cluster and the other to ingest data into your cluster. Both clients share the same user prompt authenticator, resulting in a single user prompt instead of one for each client.

    ```python
    from azure.identity import InteractiveBrowserCredential
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

    def main():
      token_credentials = InteractiveBrowserCredential()
      cluster_uri = "<your_cluster_uri>"
      cluster_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(cluster_uri, token_credentials)

      with KustoClient(cluster_kcsb) as kusto_client:
        database = "<your_database>"
        table = "MyStormEvents"
        query = table + "| count"

        response = kusto_client.execute_query(database, query)
        print("\nNumber of rows in " + table + " BEFORE ingestion:")
        print_result_as_value_list(response)

    def print_result_as_value_list(response):
      cols = (col.column_name for col in response.primary_results[0].columns)

      for row in response.primary_results[0]:
        for col in cols:
          print("\t", col, "-", row[col])

    if __name__ == "__main__":
      main()
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Create a connection string builder object that defines the data ingestion URI using the same authentication credentials as the cluster URI. Replace the `<your_ingestion_uri>` placeholder with data ingestion URI.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    import os
    from azure.kusto.data import DataFormat
    from azure.kusto.ingest import QueuedIngestClient, IngestionProperties

    ingest_uri = "<your_ingestion_uri>"
    ingest_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(ingest_uri, token_credentials)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Ingest the *stormevent.csv* file by adding it to the batch queue. You use the following:

    - **QueuedIngestClient** to create the ingest client.
    - **IngestionProperties** to set the ingestion properties.
    - **DataFormat** to specify the file format as *CSV*.
    - **ignore_first_record** to specify whether the first row in CSV and similar file types is ignored, using the following logic:
        - **True**: The first row is ignored. Use this option to drop the header row from tabular textual data.
        - **False**: The first row is ingested as a regular row.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
        file_path = os.path.join(os.path.dirname(__file__), "stormevents.csv")
        print("\nIngesting data from file: \n\t " + file_path)

        ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
        ingest_client.ingest_from_file(file_path, ingest_props)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Query the number of rows in the table after ingesting the file, and show the last row ingested.

    > [!NOTE]
    > To allow time for the ingestion to complete, wait 30 seconds before querying the table.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    # Add this to the imports at the top of the file
    import time

    # Add this to the main method
    print("\nWaiting 30 seconds for ingestion to complete ...")
    time.sleep(30)

    response = kusto_client.execute_query(database, query)
    print("\nNumber of rows in " + table + " AFTER ingesting the file:")
    print_result_as_value_list(response)

    query = table + "| top 1 by EndTime"
    response = kusto_client.execute_query(database, query)
    print("\nLast ingested row:")
    print_result_as_value_list(response)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

The complete code should look like this:

### [C\#](#tab/csharp)

```csharp

```

### [Python](#tab/python)

```python
import os
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties
from azure.identity import InteractiveBrowserCredential

def main():
  token_credentials = InteractiveBrowserCredential()
  cluster_uri = "<your_cluster_uri>"
  cluster_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(cluster_uri, token_credentials)
  ingest_uri = "<your_ingestion_uri>"
  ingest_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(ingest_uri, token_credentials)
  file_path = os.path.join(os.path.dirname(__file__), "stormevents.csv")

  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"

      query = table + "| count"
      response = kusto_client.execute_query(database, query)
      print("\nNumber of rows in " + table + " BEFORE ingestion:")
      print_result_as_value_list(response)

      print("\nIngesting data from file: \n\t " + file_path)
      ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
      ingest_client.ingest_from_file(file_path, ingest_props)

      print("\nWaiting 30 seconds for ingestion to complete ...")
      time.sleep(30)

      response = kusto_client.execute_query(database, query)
      print("\nNumber of rows in " + table + " AFTER ingesting the file:")
      print_result_as_value_list(response)

      query = table + "| top 1 by EndTime"
      response = kusto_client.execute_query(database, query)
      print("\nLast ingested row:")
      print_result_as_value_list(response)

def print_result_as_value_list(response):
  cols = (col.column_name for col in response.primary_results[0].columns)

  for row in response.primary_results[0]:
    for col in cols:
      print("\t", col, "-", row[col])

if __name__ == "__main__":
  main()
```

### [Node.js](#tab/nodejs)

```nodejs

```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java

```

---

## Run your app

In a command shell, use the following command to run your app:

### [C\#](#tab/csharp)

```bash
# Change directory to the folder that contains the management commands project
dotnet run .
```

### [Python](#tab/python)

```bash
python basic_ingestion.py
```

### [Node.js](#tab/nodejs)

```bash
node basic-ingestion.js
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
mvn install exec:java -Dexec.mainClass="<groupId>.batchIngestion"
```

---

You should see a result similar to the following:

```bash
Number of rows in MyStormEvents BEFORE ingestion:
         Count - 0

Ingesting data from file: 
        C:\MyApp\stormevents.csv

Waiting 30 seconds for ingestion to complete

Number of rows in MyStormEvents AFTER ingesting the file:
         Count - 1000

Last ingested row:
         StartTime - 2018-01-26 00:00:00+00:00
         EndTime - 2018-01-27 14:00:00+00:00
         State - MEXICO
         DamageProperty - 0
         DamageCrops - 0
         Source - Unknown
         StormSummary - {}
```

## Queue in-memory data for ingestion and process the results

You can ingest data from memory by creating a stream containing the data, and then queuing it for ingestion.

For example, you can modify the app replacing the *ingest from file* code, as follows:

1. Add the stream descriptor package to the imports at the top of the file.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    import io
    from azure.kusto.ingest import StreamDescriptor
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Add a in-memory string with the data to ingest.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
    string_stream = io.StringIO(single_line)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Set the ingestion properties to ignore the first records as the im-memory string doesn't have a header row.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Ingest the in-memory data by adding it to the batch queue. Where possible, provide the size of the raw data.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
    ingest_client.ingest_from_stream(stream_descriptor, ingest_props)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

An outline of the updated code should look like this:

### [C\#](#tab/csharp)

```csharp
```

### [Python](#tab/python)

```python
import io
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties, StreamDescriptor
from azure.identity import InteractiveBrowserCredential

def main():
  # ...
  single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
  string_stream = io.StringIO(single_line)

  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"

      # ...

      print("\nIngesting data from memory:")
      ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=False)
      stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
      ingest_client.ingest_from_stream(stream_descriptor, ingest_props)

      # ...
```

### [Node.js](#tab/nodejs)

```nodejs

```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
```

---

When run the app, you should see a result similar to the following. Notice that after the ingestion, the number of rows in the table increased by one.

```bash
Number of rows in MyStormEvents BEFORE ingestion:
         Count - 1000

Ingesting data from memory:

Waiting 30 seconds for ingestion to complete ...

Number of rows in MyStormEvents AFTER ingesting from memory:
         Count - 1001

Last ingested row:
         StartTime - 2018-01-26 00:00:00+00:00
         EndTime - 2018-01-27 14:00:00+00:00
         State - MEXICO
         DamageProperty - 0
         DamageCrops - 0
         Source - Unknown
         StormSummary - {}
```

## Queue a blob for ingestion and process the results

You can ingest data from Azure Storage blobs, Azure Data Lake files, and Amazon S3 files. Upload the *stormevent.csv* file to your storage account and generate a URI with read permissions, for example, using [a SAS token](../connection-strings/generate-sas-token.md) for the file. Then use a blob descriptor to queue the blob for ingestion.

For example, you can modify the app replacing the *ingest from memory* code with the following:

1. Add the blob descriptor package to the imports at the top of the file.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.ingest import BlobDescriptor
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

1. Create a blob descriptor using the blob URI, set the ingestion properties, and then ingest data from the blob. Replace the `<your_blob_uri>` placeholder with the blob URI.

    ### [C\#](#tab/csharp)

    ```csharp

    ```

    ### [Python](#tab/python)

    ```python
    blob_uri = "<your_blob_uri>"

    print("\nIngesting data from a blob:")
    blob_descriptor = BlobDescriptor(blob_uri)
    ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
    ingest_client.ingest_from_blob(blob_descriptor, ingest_props)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs

    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java

    ```

    ---

An outline of the updated code should look like this:

### [C\#](#tab/csharp)

```csharp
```

### [Python](#tab/python)

```python
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties, BlobDescriptor
from azure.identity import InteractiveBrowserCredential

def main():
  # ...
  blob_uri = "<your_blob_uri>"

  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"

      # ...

      print("\nIngesting data from a blob:")
      blob_descriptor = BlobDescriptor(blob_uri)
      ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
      ingest_client.ingest_from_blob(blob_descriptor, ingest_props)

      # ...
```

### [Node.js](#tab/nodejs)

```nodejs

```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
```

---

When run the app, you should see a result similar to the following. Notice that after the ingestion, the number of rows in the table increased by 1,000.

```bash
Number of rows in MyStormEvents BEFORE ingestion:
         Count - 1001

Ingesting data from a blob:

Waiting 30 seconds for ingestion to complete ...

Number of rows in MyStormEvents AFTER ingesting from a blob:
         Count - 2001

Last ingested row:
         StartTime - 2018-01-26 00:00:00+00:00
         EndTime - 2018-01-27 14:00:00+00:00
         State - MEXICO
         DamageProperty - 0
         DamageCrops - 0
         Source - Unknown
         StormSummary - {}
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
<!-- > [!div class="nextstepaction"]
> [TBD](../../../kql-quick-reference.md) -->

> [!div class="nextstepaction"]
> [KQL quick reference](../../../kql-quick-reference.md)
