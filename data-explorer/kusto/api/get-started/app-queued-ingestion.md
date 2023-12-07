---
title:  Create an app to get data using queued ingestion
description: Learn how to create an app to get data using queued ingestion of the Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 11/07/2023
---
# Create an app to get data using queued ingestion

Kusto is capable of handling mass data intake by optimizing and batching ingested data via its batching manager. The batching manager aggregates ingested data before it reaches its target table, allowing for more efficient processing and improved performance. Batching is typically done in bulks of 1 GB of raw data, 1000 individual files, or by a default time out of 5 minutes. Batching policies can be updated at the database and table levels, commonly to lower the batching time and reduce latency. For more information about ingestion batching, see [IngestionBatching policy](../../management/batchingpolicy.md) and [Change table level ingestion batching policy programmatically](app-management-commands.md#change-the-table-level-ingestion-batching-policy).

> [!NOTE]
> Batching also takes into account various factors such as the target database and table, the user running the ingestion, and various properties associated with the ingestion, such as special tags.

In this article, you learn how to:

> [!div class="checklist"]
>
> - [Queue a file for ingestion and query the results](#queue-a-file-for-ingestion-and-query-the-results)
> - [Queue in-memory data for ingestion and query the results](#queue-in-memory-data-for-ingestion-and-query-the-results)
> - [Queue a blob for ingestion and query the results](#queue-a-blob-for-ingestion-and-query-the-results)

## Prerequisites

- [Set up your development environment](app-set-up.md) to use the Kusto client library.

## Before you begin

- Use one of the following methods to create the *MyStormEvents* table and, as only a small amount of data is being ingested, set its ingestion batching policy timeout to 10 seconds:

    ### [Run an app](#tab/app)

    1. Create a target table named *MyStormEvents* in your database by running the first app in [management commands](app-management-commands.md#run-a-management-command-and-process-the-results).
    1. Set the ingestion batching policy timeout to 10 seconds by running the second app in [management commands](app-management-commands.md#change-the-table-level-ingestion-batching-policy). Before running the app, change the timeout value to `00:00:10`.

    ### [Web UI](#tab/webui)

    1. In the [Azure Data Explorer web UI](https://dataexplorer.azure.com), create a target table named *MyStormEvents* in your database by running the following query:

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

        ```kusto
        .alter-merge table MyStormEvents policy ingestionbatching '{ "MaximumBatchingTimeSpan":"00:00:10" }'
        ```

    ---

    > [!NOTE]
    > It may take a few minutes for the new batching policy settings to propagate to the batching manager.

- Download the [stormevent.csv](https://github.com/MicrosoftDocs/dataexplorer-docs-samples/blob/main/docs/resources/app-basic-ingestion/stormevents.csv) sample data file. The file contains 1,000 storm event records.

> [!NOTE]
>
> The following examples assume a trivial match between the columns of the ingested data and the schema of the target table.
> If the ingested data doesn't trivially match the table schema, you must use an ingestion mapping to align the columns of the data with the table schema.

## Queue a file for ingestion and query the results

In your preferred IDE or text editor, create a project or file named *basic ingestion* using the convention appropriate for your preferred language. Place the *stormevent.csv* file in the same location as your app.

> [!NOTE]
> In the following examples you use two clients, one to query your cluster and the other to ingest data into your cluster. For languages where the client library supports it, both clients share the same user prompt authenticator, resulting in a single user prompt instead of one for each client.

Add the following code:

1. Create a client app that connects to your cluster and prints the number of rows in the *MyStormEvents* table. You'll use this count as a baseline for comparison with the number of rows after each method of ingestion. Replace the `<your_cluster_uri>` and `<your_database>` placeholders with your cluster URI and database name respectively.

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;

    namespace BatchIngest {
      class BatchIngest {
        static void Main(string[] args) {
          string clusterUri = "<your_cluster_uri>";
          var clusterKcsb = new KustoConnectionStringBuilder(clusterUri)
            .WithAadUserPromptAuthentication();

          using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(clusterKcsb)) {
            string database = "<your_database>";
            string table = "MyStormEvents";

            string query = table + " | count";
            using (var response = kustoClient.ExecuteQuery(database, query, null)) {
              Console.WriteLine("\nNumber of rows in " + table + " BEFORE ingestion:");
              PrintResultsAsValueList(response);
            }
          }
        }

        static void PrintResultsAsValueList(IDataReader response) {
          string value;
          while (response.Read()) {
            for (int i = 0; i < response.FieldCount; i++) {
              value = "";
              if (response.GetDataTypeName(i) == "Int32")
                  value = response.GetInt32(i).ToString();
              else if (response.GetDataTypeName(i) == "Int64")
                value = response.GetInt64(i).ToString();
              else if (response.GetDataTypeName(i) == "DateTime")
                value = response.GetDateTime(i).ToString();
              else if (response.GetDataTypeName(i) == "Object")
                value = response.GetValue(i).ToString() ?? "{}";
              else
                value = response.GetString(i);

              Console.WriteLine("\t{0} - {1}", response.GetName(i), value ?? "None");
          }
        }
      }
    }
    ```

    ### [Python](#tab/python)

    ```python
    from azure.identity import InteractiveBrowserCredential
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

    def main():
      credentials = InteractiveBrowserCredential()
      cluster_uri = "<your_cluster_uri>"
      cluster_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(cluster_uri, credentials)

      with KustoClient(cluster_kcsb) as kusto_client:
        database = "<your_database>"
        table = "MyStormEvents"

        query = table + " | count"
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

    ### [Typescript](#tab/typescript)

    ```typescript
    import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";
    import { InteractiveBrowserCredential } from "@azure/identity";

    async function main() {
      const credentials = new InteractiveBrowserCredential();
      const clusterUri = "<your_cluster_uri>";
      const clusterKcsb = KustoConnectionStringBuilder.withAadUserPromptAuthentication(clusterUri, credentials);

      const kustoClient = new Client(clusterKcsb);

      const database = "<your_database>";
      const table = "MyStormEvents";

      const query = table + " | count";
      let response = await kustoClient.execute(database, query);
      console.log("\nNumber of rows in " + table + " BEFORE ingestion:");
      printResultAsValueList(response);
    }

    function printResultsAsValueList(response) {
      let cols = response.primaryResults[0].columns;

      for (row of response.primaryResults[0].rows()) {
        for (col of cols)
          console.log("\t", col.name, "-", row.getValueAt(col.ordinal) != null ? row.getValueAt(col.ordinal).toString() : "None")
      }
    }

    main();
    ```

    [!INCLUDE [node-vs-browser-auth](../../../includes/node-vs-browser-auth.md)]


    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    > [!NOTE]
    > The Java SDK doesn't currently support both clients sharing the same user prompt authenticator, resulting in a user prompt for each client.

    ```java
    import com.microsoft.azure.kusto.data.Client;
    import com.microsoft.azure.kusto.data.ClientFactory;
    import com.microsoft.azure.kusto.data.KustoOperationResult;
    import com.microsoft.azure.kusto.data.KustoResultSetTable;
    import com.microsoft.azure.kusto.data.KustoResultColumn;
    import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;

    public class BatchIngestion {
      public static void main(String[] args) throws Exception {
        String clusterUri = "<your_cluster_uri>";
        ConnectionStringBuilder clusterKcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);

        try (Client kustoClient = ClientFactory.createClient(clusterKcsb)) {
          String database = "<your_database>";
          String table = "MyStormEvents";

          String query = table + " | count";
          KustoOperationResult results = kustoClient.execute(database, query);
          KustoResultSetTable primaryResults = results.getPrimaryResults();
          System.out.println("\nNumber of rows in " + table + " BEFORE ingestion:");
          printResultAsValueList(primaryResults);
        }
      }

      public static void printResultsAsValueList(KustoResultSetTable results) {
        while (results.next()) {
          KustoResultColumn[] columns = results.getColumns();
          for (int i = 0; i < columns.length; i++) {
            System.out.println("\t" + columns[i].getColumnName() + " - " + (results.getObject(i) == null ? "None" : results.getString(i)));
          }
        }
      }
    }
    ```

    ---

1. Create a connection string builder object that defines the data ingestion URI, where possible, using the sharing the same authentication credentials as the cluster URI. Replace the `<your_ingestion_uri>` placeholder with data ingestion URI.

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data.Common;
    using Kusto.Ingest;
    using System.Data;

    string ingestUri = "<your_ingestion_uri>";
    var ingestKcsb = new KustoConnectionStringBuilder(ingestUri)
      .WithAadUserPromptAuthentication();
    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import DataFormat
    from azure.kusto.ingest import QueuedIngestClient, IngestionProperties

    ingest_uri = "<your_ingestion_uri>"
    ingest_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(ingest_uri, credentials)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    import { IngestClient, IngestionProperties, DataFormat } from "azure-kusto-ingest";

    const ingestUri = "<your_ingestion_uri>";
    const ingestKcsb = KustoConnectionStringBuilder.withTokenCredential(ingestUri, credentials);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    import com.microsoft.azure.kusto.ingest.IngestClientFactory;
    import com.microsoft.azure.kusto.ingest.IngestionProperties;
    import com.microsoft.azure.kusto.ingest.IngestionProperties.DataFormat;
    import com.microsoft.azure.kusto.ingest.QueuedIngestClient;

    String ingestUri = "<your_ingestion_uri>";
    ConnectionStringBuilder ingestKcsb = ConnectionStringBuilder.createWithUserPrompt(ingestUri);
    ```

    ---

1. Ingest the *stormevent.csv* file by adding it to the batch queue. You use the following objects and properties:

    - **QueuedIngestClient** to create the ingest client.
    - **IngestionProperties** to set the ingestion properties.
    - **DataFormat** to specify the file format as *CSV*.
    - **ignore_first_record** to specify whether the first row in CSV and similar file types is ignored, using the following logic:
        - **True**: The first row is ignored. Use this option to drop the header row from tabular textual data.
        - **False**: The first row is ingested as a regular row.

    [!INCLUDE [ingestion-size-limit](../../../includes/ingestion-size-limit.md)]

    ### [C\#](#tab/csharp)

    ```csharp
    using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestKcsb)) {
      string filePath = Path.Combine(Directory.GetCurrentDirectory(), "stormevents.csv");
  
      Console.WriteLine("\nIngesting data from file: \n\t " + filePath);
      var ingestProps = new KustoIngestionProperties(database, table) {
        Format = DataSourceFormat.csv,
        AdditionalProperties = new Dictionary<string, string>() {{ "ignoreFirstRecord", "True" }}
      };
      _= ingestClient.IngestFromStorageAsync(filePath, ingestProps).Result;
    }
    ```

    ### [Python](#tab/python)

    ```python
    import os

    with QueuedIngestClient(ingest_kcsb) as ingest_client:
        file_path = os.path.join(os.path.dirname(__file__), "stormevents.csv")
        print("\nIngesting data from file: \n\t " + file_path)

        ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
        ingest_client.ingest_from_file(file_path, ingest_props)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    import path from 'path';

    const ingestClient = new IngestClient(ingestKcsb);
    const filePath = path.join(__dirname, "stormevents.csv");
    console.log("\nIngesting data from file: \n\t " + filePath);

    const ingestProps = new IngestionProperties({
      database: database,
      table: table,
      format: DataFormat.CSV,
      ignoreFirstRecord: true
    });
    await ingestClient.ingestFromFile(filePath, ingestProps);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    import com.microsoft.azure.kusto.ingest.source.FileSourceInfo;

    try (QueuedIngestClient ingestClient = IngestClientFactory.createClient(ingestKcsb)) {
      FileSourceInfo fileSourceInfo = new FileSourceInfo(System.getProperty("user.dir") + "\\stormevents.csv", 0);

      System.out.println("\nIngesting data from file: \n\t " + fileSourceInfo.toString());
      IngestionProperties ingestProps = new IngestionProperties(database, table);
      ingestProps.setDataFormat(DataFormat.CSV);
      ingestProps.setIgnoreFirstRecord(true);
      ingestClient.ingestFromFile(fileSourceInfo, ingestProps);
    }
    ```

    ---

1. Query the number of rows in the table after ingesting the file, and show the last row ingested.

    > [!NOTE]
    > To allow time for the ingestion to complete, wait 30 seconds before querying the table. For C\# wait 60 seconds to allow time for adding the file to the ingestion queue asynchronously.

    ### [C\#](#tab/csharp)

    ```csharp
    Console.WriteLine("\nWaiting 60 seconds for ingestion to complete ...");
    Thread.Sleep(TimeSpan.FromSeconds(60));

    using (var response = kustoClient.ExecuteQuery(database, query, null)) {
      Console.WriteLine("\nNumber of rows in " + table + " AFTER ingesting the file:");
      PrintResultsAsValueList(response);
    }

    query = table + " | top 1 by ingestion_time()";
    using (var response = kustoClient.ExecuteQuery(database, query, null)) {
      Console.WriteLine("\nLast ingested row:");
      PrintResultsAsValueList(response);
    }
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

    query = table + " | top 1 by ingestion_time()"
    response = kusto_client.execute_query(database, query)
    print("\nLast ingested row:")
    print_result_as_value_list(response)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    console.log("\nWaiting 30 seconds for ingestion to complete ...");
    await sleep(30000);

    response = await kustoClient.execute(database, query);
    console.log("\nNumber of rows in " + table + " AFTER ingesting the file:");
    printResultsAsValueList(response);
  
    query = table + " | top 1 by ingestion_time()"
    response = await kustoClient.execute(database, query);
    console.log("\nLast ingested row:");
    printResultsAsValueList(response);

    // Add the sleep function after the main method
    function sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    System.out.println("\nWaiting 30 seconds for ingestion to complete ...");
    Thread.sleep(30000);

    response = kustoClient.execute(database, query);
    primaryResults = response.getPrimaryResults();
    System.out.println("\nNumber of rows in " + table + " AFTER ingesting the file:");
    printResultsAsValueList(primaryResults);

    query = table + " | top 1 by ingestion_time()";
    response = kustoClient.execute(database, query);
    primaryResults = response.getPrimaryResults();
    System.out.println("\nLast ingested row:");
    printResultsAsValueList(primaryResults);
    ```

    ---

The complete code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;
using Kusto.Data.Common;
using Kusto.Ingest;
using System.Data;

namespace BatchIngest {
  class BatchIngest {
    static void Main(string[] args) {
      string clusterUri = "<your_cluster_uri>";
      var clusterKcsb = new KustoConnectionStringBuilder(clusterUri)
        .WithAadUserPromptAuthentication();
      string ingestUri = "<your_ingestion_uri>";
      var ingestKcsb = new KustoConnectionStringBuilder(ingestUri)
        .WithAadUserPromptAuthentication();


      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(clusterKcsb))
      using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestKcsb)) {
        string database = "<your_database>";
        string table = "MyStormEvents";
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "stormevents.csv");

        string query = table + " | count";
        using (var response = kustoClient.ExecuteQuery(database, query, null)) {
          Console.WriteLine("\nNumber of rows in " + table + " BEFORE ingestion:");
          PrintResultsAsValueList(response);
        }

        Console.WriteLine("\nIngesting data from file: \n\t " + filePath);
        var ingestProps = new KustoIngestionProperties(database, table) {
          Format = DataSourceFormat.csv,
          AdditionalProperties = new Dictionary<string, string>() {{ "ignoreFirstRecord", "True" }}
        };
        _= ingestClient.IngestFromStorageAsync(filePath, ingestProps).Result;

        Console.WriteLine("\nWaiting 60 seconds for ingestion to complete ...");
        Thread.Sleep(TimeSpan.FromSeconds(60));

        using (var response = kustoClient.ExecuteQuery(database, query, null)) {
          Console.WriteLine("\nNumber of rows in " + table + " AFTER ingesting the file:");
          PrintResultsAsValueList(response);
        }

        query = table + " | top 1 by ingestion_time()";
        using (var response = kustoClient.ExecuteQuery(database, query, null))
        {
          Console.WriteLine("\nLast ingested row:");
          PrintResultsAsValueList(response);
        }
      }
    }

    static void PrintResultsAsValueList(IDataReader response) {
      while (response.Read()) {
        for (int i = 0; i < response.FieldCount; i++) {
          if (response.GetDataTypeName(i) == "Int64")
            Console.WriteLine("\t{0} - {1}", response.GetName(i), response.IsDBNull(i) ? "None" : response.GetInt64(i));
          else
            Console.WriteLine("\t{0} - {1}", response.GetName(i), response.IsDBNull(i) ? "None" : response.GetString(i));
        }
      }
    }
  }
}
```

### [Python](#tab/python)

```python
import os
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties
from azure.identity import InteractiveBrowserCredential

def main():
  credentials = InteractiveBrowserCredential()
  cluster_uri = "<your_cluster_uri>"
  cluster_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(cluster_uri, credentials)
  ingest_uri = "<your_ingestion_uri>"
  ingest_kcsb = KustoConnectionStringBuilder.with_azure_token_credential(ingest_uri, credentials)


  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"
      file_path = os.path.join(os.path.dirname(__file__), "stormevents.csv")

      query = table + " | count"
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

      query = table + " | top 1 by ingestion_time()"
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

### [Typescript](#tab/typescript)

```typescript
import path from 'path';
import { Client, KustoConnectionStringBuilder } from "azure-kusto-data";
import { IngestClient, IngestionProperties, DataFormat } from "azure-kusto-ingest";
import { InteractiveBrowserCredential } from "@azure/identity";

async function main() {
  const credentials = new InteractiveBrowserCredential();
  const clusterUri = "<your_cluster_uri>";
  const clusterKcsb = KustoConnectionStringBuilder.withTokenCredential(clusterUri, credentials);
  const ingestUri = "<your_ingestion_uri>";
  const ingestKcsb = KustoConnectionStringBuilder.withTokenCredential(ingestUri, credentials);
  
  const kustoClient = new Client(clusterKcsb);
  const ingestClient = new IngestClient(ingestKcsb);

  const database = "<your_database>";
  const table = "MyStormEventsJS";

  const filePath = path.join(__dirname, "stormevents.csv");

  const query = table + ` | count`;
  let response = await kustoClient.execute(database, query);
  printResultsAsValueList(response);

  console.log("\nIngesting data from file: \n\t " + filePath);
  const ingestProps = new IngestionProperties({
    database: database,
    table: table,
    format: DataFormat.CSV,
    ignoreFirstRecord: true
  });
  await ingestClient.ingestFromFile(filePath, ingestProps);

  console.log("\nWaiting 30 seconds for ingestion to complete ...");
  await sleep(30000);

  response = await kustoClient.execute(database, queryCount);
  console.log("\nNumber of rows in " + table + " AFTER ingesting the file:");
  printResultsAsValueList(response);

  query = table + " | top 1 by ingestion_time()"
  response = await kustoClient.execute(database, query);
  console.log("\nLast ingested row:");
  printResultsAsValueList(response);
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function printResultsAsValueList(response) {
  let cols = response.primaryResults[0].columns;

  for (row of response.primaryResults[0].rows()) {
    for (col of cols)
      console.log("\t", col.name, "-", row.getValueAt(col.ordinal) != null ? row.getValueAt(col.ordinal).toString() : "None")
  }
}

main();
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.Client;
import com.microsoft.azure.kusto.data.ClientFactory;
import com.microsoft.azure.kusto.data.KustoOperationResult;
import com.microsoft.azure.kusto.data.KustoResultSetTable;
import com.microsoft.azure.kusto.data.KustoResultColumn;
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.ingest.IngestClientFactory;
import com.microsoft.azure.kusto.ingest.IngestionProperties;
import com.microsoft.azure.kusto.ingest.IngestionProperties.DataFormat;
import com.microsoft.azure.kusto.ingest.QueuedIngestClient;
import com.microsoft.azure.kusto.ingest.source.FileSourceInfo;

public class BatchIngestion {
  public static void main(String[] args) throws Exception {
    String clusterUri = "<your_cluster_uri>";
    ConnectionStringBuilder clusterKcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
    String ingestUri = "<your_ingestion_uri>";
    ConnectionStringBuilder ingestKcsb = ConnectionStringBuilder.createWithUserPrompt(ingestUri);

    try (Client kustoClient = ClientFactory.createClient(clusterKcsb);
         QueuedIngestClient ingestClient = IngestClientFactory.createClient(ingestKcsb)) {
      String database = "<your_database>";
      String table = "MyStormEvents";
      FileSourceInfo fileSourceInfo = new FileSourceInfo(System.getProperty("user.dir") + "\\stormevents.csv", 0);

      String query = table + " | count";
      KustoOperationResult results = kustoClient.execute(database, query);
      KustoResultSetTable primaryResults = results.getPrimaryResults();
      System.out.println("\nNumber of rows in " + table + " BEFORE ingestion:");
      printResultAsValueList(primaryResults);

      System.out.println("\nIngesting data from file: \n\t " + fileSourceInfo.toString());
      IngestionProperties ingestProps = new IngestionProperties(database, table);
      ingestProps.setDataFormat(DataFormat.CSV);
      ingestProps.setIgnoreFirstRecord(true);
      ingestClient.ingestFromFile(fileSourceInfo, ingestProps);

      System.out.println("\nWaiting 30 seconds for ingestion to complete ...");
      Thread.sleep(30000);

      response = kustoClient.execute(database, query);
      primaryResults = response.getPrimaryResults();
      System.out.println("\nNumber of rows in " + table + " AFTER ingesting the file:");
      printResultsAsValueList(primaryResults);

      query = table + " | top 1 by ingestion_time()";
      response = kustoClient.execute(database, query);
      primaryResults = response.getPrimaryResults();
      System.out.println("\nLast ingested row:");
      printResultsAsValueList(primaryResults);
    }
  }

  public static void printResultsAsValueList(KustoResultSetTable results) {
    while (results.next()) {
      KustoResultColumn[] columns = results.getColumns();
      for (int i = 0; i < columns.length; i++) {
        System.out.println("\t" + columns[i].getColumnName() + " - " + (results.getObject(i) == null ? "None" : results.getString(i)));
      }
    }
  }
}
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

### [Typescript](#tab/typescript)

In a Node.js environment:

```bash
node basic-ingestion.js
```

In a browser environment, use the appropriate command to run your app. For example, for Vite-React:

```bash
npm run dev
```

> [!NOTE]
> In a browser environment, open the [developer tools console](/microsoft-edge/devtools-guide-chromium/console/) to see the output.

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
mvn install exec:java -Dexec.mainClass="<groupId>.BatchIngestion"
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

## Queue in-memory data for ingestion and query the results

You can ingest data from memory by creating a stream containing the data, and then queuing it for ingestion.

For example, you can modify the app replacing the *ingest from file* code, as follows:

1. Add the stream descriptor package to the imports at the top of the file.

    ### [C\#](#tab/csharp)

    No additional packages are required.

    ### [Python](#tab/python)

    ```python
    import io
    from azure.kusto.ingest import StreamDescriptor
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    import { Readable } from "stream";
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    import java.io.ByteArrayInputStream;
    import java.io.InputStream;
    import java.nio.charset.StandardCharsets;
    import com.microsoft.azure.kusto.ingest.source.StreamSourceInfo;
    ```

    ---

1. Add an in-memory string with the data to ingest.

    ### [C\#](#tab/csharp)

    ```csharp
    string singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
    var stringStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(singleLine));
    ```

    ### [Python](#tab/python)

    ```python
    single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
    string_stream = io.StringIO(single_line)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    const singleLine = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"';
    const stringStream = new Readable();
    stringStream.push(singleLine);
    stringStream.push(null);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
    InputStream stream = new ByteArrayInputStream(StandardCharsets.UTF_8.encode(singleLine).array());
    StreamSourceInfo streamSourceInfo = new StreamSourceInfo(stream);
    ```

    ---

1. Set the ingestion properties to not ignore the first record as the in-memory string doesn't have a header row.

    ### [C\#](#tab/csharp)

    ```csharp
    ingestProps.AdditionalProperties = new Dictionary<string, string>() {{ "ignoreFirstRecord", "False" }};
    ```

    ### [Python](#tab/python)

    ```python
    ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=False)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    ingestProps.ignoreFirstRecord = false;
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    ingestProps.setIgnoreFirstRecord(false);
    ```

    ---

1. Ingest the in-memory data by adding it to the batch queue. Where possible, provide the size of the raw data.

    ### [C\#](#tab/csharp)

    ```csharp
    _= ingestClient.IngestFromStreamAsync(stringStream, ingestProps, new StreamSourceOptions {Size = stringStream.Length}).Result;
    ```

    ### [Python](#tab/python)

    ```python
    stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
    ingest_client.ingest_from_stream(stream_descriptor, ingest_props)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    stringStream.size = singleLine.length;
    await ingestClient.ingestFromStream(stringStream, ingestProps);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    ingestClient.ingestFromStream(streamSourceInfo, ingestProps);
    ```

    ---

An outline of the updated code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;
using Kusto.Data.Common;
using Kusto.Ingest;
using System.Data;

namespace BatchIngest {
  class BatchIngest {
    static void Main(string[] args) {
      ...
      string singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
      var stringStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(singleLine));

      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(clusterKcsb))
      using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestKcsb)) {
        string database = "<your_database>";
        string table = "MyStormEvents";

        ...

        Console.WriteLine("\nIngesting data from memory:");
        ingestProps.AdditionalProperties = new Dictionary<string, string>() {{ "ignoreFirstRecord", "False" }};
        _= ingestClient.IngestFromStreamAsync(stringStream, ingestProps, new StreamSourceOptions {Size = stringStream.Length}).Result;

        ...
      }
    }

    static void PrintResultsAsValueList(IDataReader response) {
      ...
    }
  }
}
```

### [Python](#tab/python)

```python
import io
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties, StreamDescriptor
from azure.identity import InteractiveBrowserCredential

def main():
  ...
  single_line = '2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,"{}"'
  string_stream = io.StringIO(single_line)

  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"

      ...

      print("\nIngesting data from memory:")
      ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=False)
      stream_descriptor = StreamDescriptor(string_stream, is_compressed=False, size=len(single_line))
      ingest_client.ingest_from_stream(stream_descriptor, ingest_props)

      ...

  def print_result_as_value_list(response):
    ...

if __name__ == "__main__":
  main()
```

### [Typescript](#tab/typescript)

```typescript
import path from 'path';
import { Client, KustoConnectionStringBuilder } from "azure-kusto-data";
import { IngestClient, IngestionProperties, DataFormat } from "azure-kusto-ingest";
import { InteractiveBrowserCredential } from "@azure/identity";
import { Readable } from "stream";

async function main() {
  ...
  const singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
  const stringStream = Readable.from(singleLine);
  stringStream.push(singleLine);
  stringStream.push(null);

  const kustoClient = new Client(clusterKcsb);
  const ingestClient = new IngestClient(ingestKcsb);

  const database = "<your_database>"
  const table = "MyStormEvents"

  ...

  console.log("\nIngesting data from memory:");
  stringStream.size = singleLine.length;
  ingestProps.ignoreFirstRecord = false;
  await ingestClient.ingestFromStream(stringStream, ingestProps);

  ...
}

function sleep(time) {
  ...
}
function printResultsAsValueList(response) {
  ...
}

main();
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.Client;
import com.microsoft.azure.kusto.data.ClientFactory;
import com.microsoft.azure.kusto.data.KustoOperationResult;
import com.microsoft.azure.kusto.data.KustoResultSetTable;
import com.microsoft.azure.kusto.data.KustoResultColumn;
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.ingest.IngestClientFactory;
import com.microsoft.azure.kusto.ingest.IngestionProperties;
import com.microsoft.azure.kusto.ingest.IngestionProperties.DataFormat;
import com.microsoft.azure.kusto.ingest.QueuedIngestClient;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import com.microsoft.azure.kusto.ingest.source.StreamSourceInfo;

public class BatchIngestion {
  public static void main(String[] args) throws Exception {
    ...
    String singleLine = "2018-01-26 00:00:00.0000000,2018-01-27 14:00:00.0000000,MEXICO,0,0,Unknown,\"{}\"";
    InputStream stream = new ByteArrayInputStream(StandardCharsets.UTF_8.encode(singleLine).array());
    StreamSourceInfo streamSourceInfo = new StreamSourceInfo(stream);

    try (Client kustoClient = ClientFactory.createClient(clusterKcsb);
         QueuedIngestClient ingestClient = IngestClientFactory.createClient(ingestKcsb)) {
        String database = "<your_database>";
        String table = "MyStormEvents";

        ...

        System.out.println("\nIngesting data from memory:");
        ingestProps.setIgnoreFirstRecord(false);
        ingestClient.ingestFromStream(streamSourceInfo, ingestProps);

        ...
    }
  }

  public static void printResultsAsValueList(KustoResultSetTable results) {
    ...
  }
}
```

---

When you run the app, you should see a result similar to the following. Notice that after the ingestion, the number of rows in the table increased by one.

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

## Queue a blob for ingestion and query the results

You can ingest data from Azure Storage blobs, Azure Data Lake files, and Amazon S3 files.

For example, you can modify the app replacing the *ingest from memory* code with the following:

1. Start by uploading the *stormevent.csv* file to your storage account and generate a URI with read permissions, for example, using [a SAS token](../connection-strings/generate-sas-token.md) for Azure blobs.

1. Add the blob descriptor package to the imports at the top of the file.

    ### [C\#](#tab/csharp)

    No additional packages are required.

    ### [Python](#tab/python)

    ```python
    from azure.kusto.ingest import BlobDescriptor
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    No additional packages are required.
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    import com.microsoft.azure.kusto.ingest.source.BlobSourceInfo;
    ```

    ---

1. Create a blob descriptor using the blob URI, set the ingestion properties, and then ingest data from the blob. Replace the `<your_blob_uri>` placeholder with the blob URI.

    ### [C\#](#tab/csharp)

    ```csharp
    string blobUri = "<your_blob_uri>";

    ingestProps.AdditionalProperties = new Dictionary<string, string>() { { "ignoreFirstRecord", "True" } };
    _= ingestClient.IngestFromStorageAsync(blobUri, ingestProps).Result;
    ```

    ### [Python](#tab/python)

    ```python
    blob_uri = "<your_blob_uri>"

    ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
    blob_descriptor = BlobDescriptor(blob_uri)
    ingest_client.ingest_from_blob(blob_descriptor, ingest_props)
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    const blobUri = "<your_blob_uri>";

    ingestProps.ignoreFirstRecord = true;
    await ingestClient.ingestFromBlob(blobUri, ingestProps);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String blobUri = "<your_blob_uri>";

    ingestProps.setIgnoreFirstRecord(true);
    BlobSourceInfo blobSourceInfo = new BlobSourceInfo(blobUri, 100);
    ingestClient.ingestFromBlob(blobSourceInfo, ingestProps);
    ```

    ---

An outline of the updated code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;
using Kusto.Data.Common;
using Kusto.Ingest;
using System.Data;

namespace BatchIngest {
  class BatchIngest {
    static void Main(string[] args) {
      ...
      string blobUri = "<your_blob_uri>";


      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(clusterKcsb))
      using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestKcsb)) {
        string database = "<your_database>";
        string table = "MyStormEvents";

        ...

        Console.WriteLine("\nIngesting data from memory:");
        ingestProps.AdditionalProperties = new Dictionary<string, string>() { { "ignoreFirstRecord", "True" } };
        _=_ ingestClient.IngestFromStorageAsync(blobUri, ingestProps).Result;

        ...
      }
    }

    static void PrintResultsAsValueList(IDataReader response) {
      ...
    }
  }
}
```

### [Python](#tab/python)

```python
import time
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties, BlobDescriptor
from azure.identity import InteractiveBrowserCredential

def main():
  ...
  blob_uri = "<your_blob_uri>"

  with KustoClient(cluster_kcsb) as kusto_client:
    with QueuedIngestClient(ingest_kcsb) as ingest_client:
      database = "<your_database>"
      table = "MyStormEvents"

      ...

      print("\nIngesting data from a blob:")
      blob_descriptor = BlobDescriptor(blob_uri)
      ingest_props = IngestionProperties(database, table, DataFormat.CSV, ignore_first_record=True)
      ingest_client.ingest_from_blob(blob_descriptor, ingest_props)

      ...

  def print_result_as_value_list(response):
    ...

if __name__ == "__main__":
  main()
```

### [Typescript](#tab/typescript)

```typescript
import path from 'path';
import { Client, KustoConnectionStringBuilder } from "azure-kusto-data";
import { IngestClient, IngestionProperties, DataFormat } from "azure-kusto-ingest";
import { InteractiveBrowserCredential } from "@azure/identity";
import { Readable } from "stream";

async function main() {
  ...
  const blobUri = "<your_blob_uri>";

  const kustoClient = new Client(clusterKcsb);
  const ingestClient = new IngestClient(ingestKcsb);

  const database = "<your_database>"
  const table = "MyStormEvents"

  ...

  console.log("\nIngesting data from a blob:");
  ingestProps.ignoreFirstRecord = true;
  await ingestClient.ingestFromBlob(blobUri, ingestProps);

  ...
}

function sleep(time) {
  ...
}
function printResultsAsValueList(response) {
  ...
}

main();
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.Client;
import com.microsoft.azure.kusto.data.ClientFactory;
import com.microsoft.azure.kusto.data.KustoOperationResult;
import com.microsoft.azure.kusto.data.KustoResultSetTable;
import com.microsoft.azure.kusto.data.KustoResultColumn;
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.ingest.IngestClientFactory;
import com.microsoft.azure.kusto.ingest.IngestionProperties;
import com.microsoft.azure.kusto.ingest.IngestionProperties.DataFormat;
import com.microsoft.azure.kusto.ingest.QueuedIngestClient;
import com.microsoft.azure.kusto.ingest.source.BlobSourceInfo;

public class BatchIngestion {
  public static void main(String[] args) throws Exception {
    ...
    String blobUri = "<your_blob_uri>";

    try (Client kustoClient = ClientFactory.createClient(clusterKcsb);
         QueuedIngestClient ingestClient = IngestClientFactory.createClient(ingestKcsb)) {
      String database = "<your_database>";
      String table = "MyStormEvents";

      ...

      System.out.println("\nIngesting data from a blob:");
      ingestProps.setIgnoreFirstRecord(true);
      BlobSourceInfo blobSourceInfo = new BlobSourceInfo(blobUri, 100);
      ingestClient.ingestFromBlob(blobSourceInfo, ingestProps);

      ...
    }
  }

  public static void printResultsAsValueList(KustoResultSetTable results) {
    ...
  }
}
```

---

When you run the app, you should see a result similar to the following. Notice that after the ingestion, the number of rows in the table increased by 1,000.

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

## Next step

<!-- Advance to the next article to learn how to create... -->
<!-- > [!div class="nextstepaction"]
> [TBD](../../../kql-quick-reference.md) -->

> [!div class="nextstepaction"]
> [KQL quick reference](../../../kql-quick-reference.md)
