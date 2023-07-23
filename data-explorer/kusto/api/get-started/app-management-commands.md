---
title:  'Create an app to run management commands'
description: Learn how to create an app to run management commands using Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 06/27/2023
---
# Create an app to run management commands

In this article, you learn how to:

> [!div class="checklist"]
>
> - [Run a management command and process the results](#run-a-management-command-and-process-the-results)
> - [Change the table level ingestion batching policy](#change-the-table-level-ingestion-batching-policy)
> - [Show the database level retention policy](#show-the-database-level-retention-policy)

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Kusto client library.

## Run a management command and process the results

In your preferred IDE or text editor, create a project or file named *management commands* using the convention appropriate for your preferred language. Then add the following code:

1. Create a client app that connects your cluster. Replace the `<your_cluster>` placeholder with your cluster name.

    ### [C\#](#tab/csharp)

    > [!NOTE]
    > For management commands, you'll use the `CreateCslAdminProvider` client factory method.

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;

    namespace ManagementCommands {
      class ManagementCommands {
        static void Main(string[] args) {
          var clusterUri = "https://<your_cluster>.kusto.windows.net/";
          var kcsb = new KustoConnectionStringBuilder(clusterUri)
              .WithAadUserPromptAuthentication();

          using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kcsb)) {
          }
        }
      }
    }
    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

    def main():
      cluster_uri = "https://<your_cluster>.kusto.windows.net"
      kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)

      with KustoClient(kcsb) as kusto_client:

    if __name__ == "__main__":
      main()
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const kustoLibraryClient = require("azure-kusto-data").Client;
    const kustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;

    async function main() {
      const clusterUri = "https://<your_cluster>.kusto.windows.net";
      const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri);

      const kustoClient = new kustoLibraryClient(kcsb);
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

    public class managementCommands {
      public static void main(String[] args) throws Exception {
        try {
          String clusterUri = "https://<your_cluster>.kusto.windows.net/";
          ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);

          try (Client kustoClient = ClientFactory.createClient(kcsb)) {
          }
        }
      }
    }
    ```

    ---

1. Define a function that prints the command being run and its resultant tables. This function unpacks the column names in the result tables and prints each name-value pair on a new line.

    ### [C\#](#tab/csharp)

    ```csharp
    static void PrintResultsAsValueList(string command, IDataReader response) {
      while (response.Read()) {
        Console.WriteLine("\n{0}\n", new String('-', 20));
        Console.WriteLine("Command: {0}", command);
        Console.WriteLine("Result:");
        for (int i = 0; i < response.FieldCount; i++) {
          Console.WriteLine("\t{0} - {1}", response.GetName(i), response.IsDBNull(i) ? "None" : response.GetString(i));
        }
      }
    }
    ```

    ### [Python](#tab/python)

    ```python
    def print_result_as_value_list(command, response):
      # create a list of columns
      cols = (col.column_name for col in response.primary_results[0].columns)

      print("\n" + "-" * 20 + "\n")
      print("Command: " + command)
      # print the values for each row
      for row in response.primary_results[0]:
        print("Result:")
        for col in cols:
          print("\t", col, "-", row[col])
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    function printResultAsValueList(command, response) {
      // create a list of columns
      let cols = response.primaryResults[0].columns;

      console.log("\n" + "-".repeat(20) + "\n")
      console.log("Command: " + command)
      // print the values for each row
      for (row of response.primaryResults[0].rows()) {
        console.log("Result:")
        for (col of cols)
        console.log("\t", col.name, "-", row.getValueAt(col.ordinal) ? row.getValueAt(col.ordinal).toString() : "None")
      }
    }
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    public static void printResultsAsValueList(String command, KustoResultSetTable results) {
      while (results.next()) {
        System.out.println("\n" + "-".repeat(20) + "\n");
        System.out.println("Command: " + command);
        System.out.println("Result:");
        KustoResultColumn[] columns = results.getColumns();
        for (int i = 0; i < columns.length; i++) {
          System.out.println("\t" + columns[i].getColumnName() + " - " + (results.getObject(i) == null ? "None" : results.getString(i)));
        }
      }
    }
    ```

    ---

1. Define the command to run. The command [creates a table](../../management/create-table-command.md) called **MyStormEvents** and defines the table schema as a list of column names and types. Replace the `<your_database>` placeholder with your database name.
    ### [C\#](#tab/csharp)

    ```csharp
    string database = "<your_database>";
    string table = "MyStormEvents";

    // Create a table named MyStormEvents
    // The brackets contain a list of column Name:Type pairs that defines the table schema
    string command = @$".create table {table}
                      (StartTime:datetime,
                       EndTime:datetime,
                       State:string,
                       DamageProperty:int,
                       DamageCrops:int,
                       Source:string,
                       StormSummary:dynamic)";
    ```

    ### [Python](#tab/python)

    ```python
    database = "<your_database>"
    table = "MyStormEvents"

    # Create a table named MyStormEvents
    # The brackets contain a list of column Name:Type pairs that defines the table schema
    command = ".create table " + table + " " \
              "(StartTime:datetime," \
              " EndTime:datetime," \
              " State:string," \
              " DamageProperty:int," \
              " DamageCrops:int," \
              " Source:string," \
              " StormSummary:dynamic)"
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const database = "<your_database>";
    const table = "MyStormEvents";

    // Create a table named MyStormEvents
    // The brackets contain a list of column Name:Type pairs that defines the table schema
    let command = `.create table ` + table + `
                  (StartTime:datetime,
                   EndTime:datetime,
                   State:string,
                   DamageProperty:int,
                   Source:string,
                   StormSummary:dynamic)`;
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String database = "<your_database>";
    String table = "MyStormEvents";

    // Create a table named MyStormEvents
    // The brackets contain a list of column Name:Type pairs that defines the table schema
    String command = ".create table " + table + " " +
                     "(StartTime:datetime," +
                     " EndTime:datetime," +
                     " State:string," +
                     " DamageProperty:int," +
                     " DamageCrops:int," +
                     " Source:string," +
                     " StormSummary:dynamic)";
    ```

    ---

1. Run the command and print the result using the previously defined function.

    ### [C\#](#tab/csharp)

    > [!NOTE]
    > You'll use the `ExecuteControlCommand` method to run the command.

    ```csharp
    using (var response = kustoClient.ExecuteControlCommand(database, command, null))
    {
      PrintResultsAsValueList(command, response);
    }
    ```

    ### [Python](#tab/python)

    > [!NOTE]
    > You'll use the `execute_mgmt` method to run the command.

    ```python
    response = kusto_client.execute_mgmt(database, command)
    print_result_as_value_list(command, response)
    ```

    ### [Node.js](#tab/nodejs)

    > [!NOTE]
    > You'll use the `executeMgmt` method to run the command.

    ```nodejs
    let response = await kustoClient.executeMgmt(database, command);
    printResultsAsValueList(command, response)
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    KustoOperationResult response = kusto_client.execute(database, command);
    printResultsAsValueList(command, response.getPrimaryResults());
    ```

    ---

The complete code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;

namespace ManagementCommands
{
  class ManagementCommands {
    static void Main(string[] args) {
      string clusterUri = "https://<your_cluster>.westeurope.kusto.windows.net";
      var kcsb = new KustoConnectionStringBuilder(clusterUri)
          .WithAadUserPromptAuthentication();

      using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kcsb)) {
        string database = "<your_database>";
        string table = "MyStormEvents";

        // Create a table named MyStormEvents
        // The brackets contain a list of column Name:Type pairs that defines the table schema
        string command = @$".create table {table} 
                          (StartTime:datetime,
                           EndTime:datetime,
                           State:string,
                           DamageProperty:int,
                           DamageCrops:int,
                           Source:string,
                           StormSummary:dynamic)";

        using (var response = kustoClient.ExecuteControlCommand(database, command, null)) {
          PrintResultsAsValueList(command, response);
        }
      }
    }

    static void PrintResultsAsValueList(string command, IDataReader response) {
      while (response.Read()) {
        Console.WriteLine("\n{0}\n", new String('-', 20));
        Console.WriteLine("Command: {0}", command);
        Console.WriteLine("Result:");
        for (int i = 0; i < response.FieldCount; i++) {
          Console.WriteLine("\t{0} - {1}", response.GetName(i), response.IsDBNull(i) ? "None" : response.GetString(i));
        }
      }
    }
  }
}
```

### [Python](#tab/python)

```python
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

def main():
  cluster_uri = "https://<your_cluster>.westeurope.kusto.windows.net"
  kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)

  with KustoClient(kcsb) as kusto_client:

    database = "<your_database>"
    table = "MyStormEvents"

    # Create a table named MyStormEvents
    # The brackets contain a list of column Name:Type pairs that defines the table schema
    command = ".create table " + table + " " \
              "(StartTime:datetime," \
              " EndTime:datetime," \
              " State:string," \
              " DamageProperty:int," \
              " DamageCrops:int," \
              " Source:string," \
              " StormSummary:dynamic)"

    response = kusto_client.execute_mgmt(database, command)
    print_result_as_value_list(command, response)

def print_result_as_value_list(command, response):
  # create a list of columns
  cols = (col.column_name for col in response.primary_results[0].columns)

  print("\n" + "-" * 20 + "\n")
  print("Command: " + command)
  # print the values for each row
  for row in response.primary_results[0]:
    print("Result:")
    for col in cols:
      print("\t", col, "-", row[col])

if __name__ == "__main__":
  main()
```

### [Node.js](#tab/nodejs)

```nodejs
const kustoLibraryClient = require("azure-kusto-data").Client;
const kustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;

async function main() {
  const clusterUri = "https://<your_cluster>.westeurope.kusto.windows.net";
  const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri);
  const kustoClient = new kustoLibraryClient(kcsb);

  const database = "<your_database>";
  const table = "MyStormEvents";

  // Create a table named MyStormEvents
  // The brackets contain a list of column Name:Type pairs that defines the table schema
  let command = `.create table ` + table + `
                 (StartTime:datetime,
                  EndTime:datetime,
                  State:string,
                  DamageProperty:int,
                  Source:string,
                  StormSummary:dynamic)`;

  let response = await kustoClient.executeMgmt(database, command);
  printResultsAsValueList(command, response)
}

function printResultsAsValueList(command, response) {
  // create a list of columns
  let cols = response.primaryResults[0].columns;

  console.log("\n" + "-".repeat(20) + "\n")
  console.log("Command: " + command)
  // print the values for each row
  for (row of response.primaryResults[0].rows()) {
    console.log("Result:")
    for (col of cols)
    console.log("\t", col.name, "-", row.getValueAt(col.ordinal) ? row.getValueAt(col.ordinal).toString() : "None")
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

public class ManagementCommands {
  public static void main(String[] args) throws Exception {
    try {
      String clusterUri = "https://<your_cluster>.westeurope.kusto.windows.net";
      ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
      try (Client kustoClient = ClientFactory.createClient(kcsb)) {
        String database = "<your_database>";
        String table = "MyStormEvents";

        // Create a table named MyStormEvents
        // The brackets contain a list of column Name:Type pairs that defines the table schema
        String command = ".create table " + table + " " +
                         "(StartTime:datetime," +
                         " EndTime:datetime," +
                         " State:string," +
                         " DamageProperty:int," +
                         " DamageCrops:int," +
                         " Source:string," +
                         " StormSummary:dynamic)";

        KustoOperationResult response = kustoClient.execute(database, command);
        printResultsAsValueList(command, response.getPrimaryResults());
      }
    }
  }
  public static void printResultsAsValueList(String command, KustoResultSetTable results) {
    while (results.next()) {
      System.out.println("\n" + "-".repeat(20) + "\n");
      System.out.println("Command: " + command);
      System.out.println("Result:");
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
python management_commands.py
```

### [Node.js](#tab/nodejs)

```bash
node management-commands.js
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
mvn install exec:java -Dexec.mainClass="<groupId>.managementCommands"
```

---

You should see a result similar to the following:

```bash
--------------------

Command: .create table MyStormEvents 
                 (StartTime:datetime,
                  EndTime:datetime,
                  State:string,
                  DamageProperty:int,
                  Source:string,
                  StormSummary:dynamic)
Result:
   TableName - MyStormEvents
   Schema - {"Name":"MyStormEvents","OrderedColumns":[{"Name":"StartTime","Type":"System.DateTime","CslType":"datetime"},{"Name":"EndTime","Type":"System.DateTime","CslType":"datetime"},{"Name":"State","Type":"System.String","CslType":"string"},{"Name":"DamageProperty","Type":"System.Int32","CslType":"int"},{"Name":"Source","Type":"System.String","CslType":"string"},{"Name":"StormSummary","Type":"System.Object","CslType":"dynamic"}]}
   DatabaseName - MyDatabaseName
   Folder - None
   DocString - None
```

## Change the table level ingestion batching policy

You can customize the ingestion batching behavior for tables by changing the corresponding table policy. For more information, see [IngestionBatching policy](../../management/batchingpolicy.md).

> [!NOTE]
> If you don't specify all parameters of a *PolicyObject*, the unspecified parameters will be set to [default values](../../management/batchingpolicy.md#sealing-a-batch). For example, specifying only "MaximumBatchingTimeSpan" will result in "MaximumNumberOfItems" and "MaximumRawDataSizeMB" being set to default.

For example, you can modify the app to change the [ingestion batching policy](../../management/alter-table-ingestion-batching-policy.md) timeout value to 30 seconds by altering the `ingestionBatching` policy for the `MyStormEvents` table using the following command:

### [C\#](#tab/csharp)

```csharp
// Reduce the default batching timeout to 30 seconds
command = @$".alter table {table} policy ingestionbatching '{{ ""MaximumBatchingTimeSpan"":""00:00:30"" }}'";

using (var response = kusto_client.ExecuteControlCommand(database, command, null))
{
  PrintResultsAsValueList(command, response);
}
```

### [Python](#tab/python)

```python
# Reduce the default batching timeout to 30 seconds
command = ".alter table " + table + " policy ingestionbatching '{ \"MaximumBatchingTimeSpan\":\"00:00:30\" }'"

response = kusto_client.execute_mgmt(database, command)
print_result_as_value_list(command, response)
```

### [Node.js](#tab/nodejs)

```nodejs
// Reduce the default batching timeout to 30 seconds
command = ".alter table " + table + " policy ingestionbatching '{ \"MaximumBatchingTimeSpan\":\"00:00:30\" }'"

response = await kustoClient.executeMgmt(database, command)
printResultsAsValueList(command, response)
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
// Reduce the default batching timeout to 30 seconds
command = ".alter table " + table + " policy ingestionbatching '{ \"MaximumBatchingTimeSpan\":\"00:00:30\" }'";

response = kusto_client.execute(database, command);
printResultsAsValueList(command, response.getPrimaryResults());
```

---

When you add the code to your app and run it, you should see a result similar to the following:

```bash
--------------------

Command: .alter table MyStormEvents policy ingestionbatching '{ "MaximumBatchingTimeSpan":"00:00:30" }'
Result:
   PolicyName - IngestionBatchingPolicy
   EntityName - [YourDatabase].[MyStormEvents]
   Policy - {
  "MaximumBatchingTimeSpan": "00:00:30",
  "MaximumNumberOfItems": 500,
  "MaximumRawDataSizeMB": 1024
}
   ChildEntities - None
   EntityType - Table
```

## Show the database level retention policy

You can use management commands to display a database's [retention policy](../../management/retentionpolicy.md).

For example, you can modify the app to [display your database's retention policy](../../management/show-database-retention-policy-command.md) using the following code. The result is curated to project away two columns from the result:

### [C\#](#tab/csharp)

```csharp
// Show the database retention policy (drop some columns from the result)
command = @$".show database {database} policy retention | project-away ChildEntities, EntityType";

using (var response = kusto_client.ExecuteControlCommand(database, command, null))
{
  PrintResultsAsValueList(command, response);
}
```

### [Python](#tab/python)

```python
# Show the database retention policy (drop some columns from the result)
command = ".show database " + database + " policy retention | project-away ChildEntities, EntityType"

response = kusto_client.execute_mgmt(database, command)
print_result_as_value_list(command, response)
```

### [Node.js](#tab/nodejs)

```nodejs
// Show the database retention policy (drop some columns from the result)
command = ".show database " + database + " policy retention | project-away ChildEntities, EntityType"

response = await kustoClient.executeMgmt(database, command)
printResultsAsValueList(command, response)
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
// Show the database retention policy (drop some columns from the result)
command = ".show database " + database + " policy retention | project-away ChildEntities, EntityType";

response = kusto_client.execute(database, command);
printResultsAsValueList(command, response.getPrimaryResults());
```

---

When you add the code to your app and run it, you should see a result similar to the following:

```bash
--------------------

Command: .show database YourDatabase policy retention | project-away ChildEntities, EntityType
Result:
   PolicyName - RetentionPolicy
   EntityName - [YourDatabase]
   Policy - {
  "SoftDeletePeriod": "365.00:00:00",
  "Recoverability": "Enabled"
}
```

## Next steps

<!-- > [!div class="nextstepaction"]
> [Create an app to ingest data using the batching manager](app-batch-ingestion.md) -->

> [!div class="nextstepaction"]
> [Create an app to ingest data using the batching manager](app-batch-ingestion.md)
