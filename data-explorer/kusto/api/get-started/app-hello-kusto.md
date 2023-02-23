---
title: 'Hello Kusto: Create your first application - Azure Data Explorer'
description: Learn how to create your first application to print Hello Kusto using Azure Data Explorer client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 02/23/2023
---
# Hello Kusto: Create your first Azure Data Explorer client application

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create your first client application
> - Use interactive authentication
> - Run a basic query that prints *Hello Kusto!*

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Azure Data Explorer client library.

## Create your app

In your preferred IDE or text editor, create a file named `hello-kusto` with the language appropriate extension, and then add code to do the following:

1. Add the Azure Data Explorer client library client and string builder classes.

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;
    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const KustoClient = require("azure-kusto-data").Client;
    const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    import com.microsoft.azure.kusto.data.Client;
    import com.microsoft.azure.kusto.data.ClientFactory;
    import com.microsoft.azure.kusto.data.KustoOperationResult;
    import com.microsoft.azure.kusto.data.KustoResultSetTable;
    import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
    ```

    ---

1. Define an empty function named `main` and call it.

    ### [C\#](#tab/csharp)

    ```csharp
    namespace HelloKusto
    {
      class HelloKusto
      {
        static void Main(string[] args)
        {
        }
      }
    }
    ```

    ### [Python](#tab/python)

    ```python
    def main():

    if __name__ == "__main__":
      main()
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    async function main()
    {
    }

    main();
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    public class HelloKusto 
    {
      public static void main(String[] args)
      {
      }
    }
    ```

    ---

1. Create a connection string builder object that defines the cluster URI and sets the authentication mode to interactive. For more information about the cluster URI, see [Kusto connection strings](../connection-strings/kusto.md).

    ### [C\#](#tab/csharp)

    ```csharp
    string cluster_uri = "https://help.kusto.windows.net/";
    var kcsb = new KustoConnectionStringBuilder(cluster_uri).WithAadUserPromptAuthentication();
    ```

    ### [Python](#tab/python)

    ```python
    cluster_uri = "https://help.kusto.windows.net"
    kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const cluster_uri = "https://help.kusto.windows.net";
    const kcsb = KustoConnectionStringBuilder.withUserPrompt(cluster_uri);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String cluster_uri = "https://help.kusto.windows.net/";
    ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(cluster_uri);
    ```
    ---

    > [!NOTE]
    > For interactive authentication, you need a Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
    >
    > In C#, the interactive authentication process may not prompt the user if:
    >
    > - The user is already authenticated on the device
    > - There is an existing Kusto.Explorer or Azure Date Explorer web UI authentication on the device

1. Create a client object that uses the connection string builder object to connect to the cluster.

    ### [C\#](#tab/csharp)

    ```csharp
    using (var query_client = KustoClientFactory.CreateCslQueryProvider(kcsb))
    {
    }
    ```

    ### [Python](#tab/python)

    ```python
    query_client = KustoClient(kcsb)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const query_client = new KustoClient(kcsb);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    try (Client query_client = ClientFactory.createClient(kcsb)) {
    } catch (Exception e) {
      System.out.println("Error: " + e.getMessage());
    }
    ```

    ---

1. Define the database and query to run. The query prints *Hello Kusto!* in a column named **Welcome**.

    ### [C\#](#tab/csharp)

    ```csharp
    string database = "Samples";
    string query = "print Welcome='Hello Kusto!'";
    ```

    ### [Python](#tab/python)

    ```python
    database = "Samples"
    query = "print Welcome='Hello Kusto!'"
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const database = "Samples";
    const query = "print Welcome='Hello Kusto!'";
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String database = "Samples";
    String query = "print Welcome='Hello Kusto!'";
    ```

    ---

1. Run the query and print the result.

    ### [C\#](#tab/csharp)

    ```csharp
    using (var response = query_client.ExecuteQuery(database, query, null))
    {
      response.Read();
      int columnNo = response.GetOrdinal("Welcome");
      Console.WriteLine(response.GetString(columnNo));
    }
    ```

    ### [Python](#tab/python)

    ```python
    response = query_client.execute(database, query)

    print(response.primary_results[0][0]["Welcome"])
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    let response = await query_client.execute(database, query);

    console.log(response.primaryResults[0][0]["Welcome"].toString());
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    KustoOperationResult response = query_client.execute(database, query);

    KustoResultSetTable primary_results = response.getPrimaryResults();
    primary_results.next();
    System.out.println(primary_results.getString("Welcome"));
    ```

    ---

    > [!NOTE]
    > The query output is returned in the response as an object that contains one or more tables, comprised of one more more rows and columns.
    > The format of the object depends on the client library language.
    >
    > The *print kusto* query returns a single table with one row and column.
    >
    > ### [C\#](#tab/csharp)
    >
    > The response is a [DataReader](/dotnet/api/system.data.idatareader) object. You can reference the result, as follows:
    >
    > - Use the [Read()](/dotnet/api/system.data.idatareader.read) method to read the first row
    > - Use the [GetString](/dotnet/api/system.data.idatarecord.getstring)() method to get the value of the first column
    >
    > ### [Python / Node.js](#tab/python+nodejs)
    >
    > The response in the primary results JSON object. The object contains an array of tables, which in turn contains an array of rows. Each row contains data organized into a dictionary of columns. You can reference the result, as follows:
    >
    > - The first array index `[0]` references the first table
    > - The second array index `[0]` references the first row
    > - The dictionary key `["Welcome"]` references the **Welcome** column
    >
    > <!-- ### [Go](#tab/go) -->
    >
    > ### [Java](#tab/java)
    >
    > The response is a KustoOperationResult object. You can reference the result, as follows:
    >
    > - Use the getPrimaryResults() method to get the primary results table
    > - the [next()](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/util/ListIterator.html#next()) method to read the first row
    > - the getString() method to get the value of the first column
    >
    > ---

The complete code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;

namespace HelloKusto
{
  class HelloKusto
  {
    static void Main(string[] args)
    {
      string cluster_uri = "https://help.kusto.windows.net/";
      var kcsb = new KustoConnectionStringBuilder(cluster_uri).WithAadUserPromptAuthentication();
    
      using (var query_client = KustoClientFactory.CreateCslQueryProvider(kcsb))
      {
        string database = "Samples";
        string query = "print Welcome='Hello Kusto!'";

        using (var response = query_client.ExecuteQuery(database, query, null))
        {
          response.Read();
          int columnNo = response.GetOrdinal("Welcome");
          Console.WriteLine(response.GetString(columnNo));
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
  cluster_uri = "https://help.kusto.windows.net"
  kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)
  query_client = KustoClient(kcsb)

  database = "Samples"
  query = "print Welcome='Hello Kusto!'"
  response = query_client.execute(database, query)

  print(response.primary_results[0][0]["Welcome"])

if __name__ == "__main__":
  main()
```

### [Node.js](#tab/nodejs)

```nodejs
const KustoClient = require("azure-kusto-data").Client;
const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;

async function main()
{
  const cluster_uri = "https://help.kusto.windows.net";
  const kcsb = KustoConnectionStringBuilder.withUserPrompt(cluster_uri);
  const query_client = new KustoClient(kcsb);

  const database = "Samples";
  const query = "print Welcome='Hello Kusto!'";
  let response = await query_client.execute(database, query);

  console.log(response.primaryResults[0][0]["Welcome"].toString());
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
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;

public class HelloKusto 
{
  public static void main(String[] args)
  {
    String cluster_uri = "https://help.kusto.windows.net/";
    ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(cluster_uri);

    try (Client query_client = ClientFactory.createClient(kcsb) {
      String database = "Samples";
      String query = "print Welcome='Hello Kusto!'";
      KustoOperationResult response = query_client.execute(database, query);

      KustoResultSetTable primary_results = response.getPrimaryResults();
      primary_results.next();
      System.out.println(primary_results.getString("Welcome"));
    } catch (Exception e) {
      System.out.println("Error: " + e.getMessage());
    }
  }
}
```

---

## Run your app

In a command shell, run your app using the following command:

### [C\#](#tab/csharp)

```bash
hello-kusto.exe
```

### [Python](#tab/python)

```bash
python hello-kusto.py
```

### [Node.js](#tab/nodejs)

```bash
node hello-kusto.js
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
java HelloKusto
```

---

You should see a result similar to the following:

```bash
Hello Kusto!
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [TBD](../../../kql-quick-reference.md)
