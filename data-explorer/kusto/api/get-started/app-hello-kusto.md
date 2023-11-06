---
title:  'Hello Kusto: Create your first app'
description: Learn how to create your first app to print Hello Kusto using Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 04/24/2023
---
# Hello Kusto: Create your first app

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create your first client app
> - Use interactive authentication
> - Run a basic query that prints *Hello Kusto!*

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Kusto client library.

## Create your app

In your preferred IDE or text editor, create a project or file named *hello kusto* using the convention appropriate for your preferred language. Then add the following code:

1. Add the Kusto client and string builder classes.

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;
    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";
    import { InteractiveBrowserCredentialInBrowserOptions } from "@azure/identity";
    ```

    [!INCLUDE [node-vs-browser-auth](../../../includes/node-vs-browser-auth.md)]

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
    namespace HelloKusto {
      class HelloKusto {
        static void Main(string[] args) {
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

    ### [Typescript](#tab/typescript)

    ```typescript
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
      public static void main(String[] args) throws Exception {
        try {
        }
      }
    }
    ```

    ---

1. Create a connection string builder object that defines the cluster URI and sets the authentication mode to interactive. For more information about the cluster URI, see [Kusto connection strings](../connection-strings/kusto.md).

    ### [C\#](#tab/csharp)

    ```csharp
    var clusterUri = "https://help.kusto.windows.net/";
    var kcsb = new KustoConnectionStringBuilder(clusterUri).WithAadUserPromptAuthentication();
    ```

    ### [Python](#tab/python)

    ```python
    cluster_uri = "https://help.kusto.windows.net"
    kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)
    ```

    ### [Typescript](#tab/typescript)

    The `clientId` and `redirectUri` are from the Microsoft Entra app registration you created in the **Prerequisites** section of [Set up your development environment](app-set-up.md#prerequisites).

    ```typescript
    const clusterUri = "https://help.kusto.windows.net";
    const authOptions = {
      clientId: "5e39af3b-ba50-4255-b547-81abfb507c58",
      redirectUri: "http://localhost:5173",
    } as InteractiveBrowserCredentialInBrowserOptions;
    const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri, authOptions);
    ```

    [!INCLUDE [node-vs-browser-auth](../../../includes/node-vs-browser-auth.md)]

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String clusterUri = "https://help.kusto.windows.net/";
    ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
    ```
    ---

    > [!NOTE]
    > For interactive authentication, you need a Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
    >
    > In C#, the interactive authentication process may not prompt the user if:
    >
    > - The user is already authenticated on the device
    > - There is an existing Kusto.Explorer or Azure Date Explorer web UI authentication on the device

1. Create a client object that uses the connection string builder object to connect to the cluster.

    > [!NOTE]
    > We highly recommended that you cache and reuse the Kusto client instance. Frequently recreating Kusto clients may lead to performance degradation in your application and increased load on your cluster.

    ### [C\#](#tab/csharp)

    ```csharp
    using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kcsb)) {
    }
    ```

    ### [Python](#tab/python)

    ```python
    with KustoClient(kcsb) as kusto_client:
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    const kustoClient = new KustoClient(kcsb);
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    try (Client kustoClient = ClientFactory.createClient(kcsb)) {
    }
    ```

    ---

1. Define the database and query to run. The query prints *Hello Kusto!* in a column named **Welcome**.

    ### [C\#](#tab/csharp)

    ```csharp
    var database = "Samples";
    var query = "print Welcome='Hello Kusto!'";
    ```

    ### [Python](#tab/python)

    ```python
    database = "Samples"
    query = "print Welcome='Hello Kusto!'"
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
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
    using (var response = kustoClient.ExecuteQuery(database, query, null)) {
      response.Read();
      int columnNo = response.GetOrdinal("Welcome");
      Console.WriteLine(response.GetString(columnNo));
    }
    ```

    ### [Python](#tab/python)

    ```python
    response = kusto_client.execute(database, query)

    print(response.primary_results[0][0]["Welcome"])
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    const response = await kustoClient.execute(database, query);

    console.log(response.primaryResults[0][0]["Welcome"].toString());
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    KustoOperationResult response = kustoClient.execute(database, query);

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
    > ### [Python / TypeScript](#tab/python+typescript)
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

namespace HelloKusto {
  class HelloKusto {
    static void Main(string[] args) {
      string clusterUri = "https://help.kusto.windows.net/";
      var kcsb = new KustoConnectionStringBuilder(clusterUri).WithAadUserPromptAuthentication();
    
      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kcsb)) {
        string database = "Samples";
        string query = "print Welcome='Hello Kusto!'";

        using (var response = kustoClient.ExecuteQuery(database, query, null)) {
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

  with KustoClient(kcsb) as kusto_client:

    database = "Samples"
    query = "print Welcome='Hello Kusto!'"
    response = kusto_client.execute(database, query)

    print(response.primary_results[0][0]["Welcome"])

if __name__ == "__main__":
  main()
```

### [Typescript](#tab/typescript)

```typescript
import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data/";
import { InteractiveBrowserCredentialInBrowserOptions } from "@azure/identity";

async function main()
{
  const clusterUri = "https://help.kusto.windows.net";
  const authOptions = {
    clientId: "5e39af3b-ba50-4255-b547-81abfb507c58",
    redirectUri: "http://localhost:5173",
  } as InteractiveBrowserCredentialInBrowserOptions;
  const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri, authOptions);
  const kustoClient = new KustoClient(kcsb);

  const database = "Samples";
  const query = "print Welcome='Hello Kusto!'";
  const response = await kustoClient.execute(database, query);

  console.log(response.primaryResults[0][0]["Welcome"].toString());
}

main();
```

[!INCLUDE [node-vs-browser-auth](../../../includes/node-vs-browser-auth.md)]
<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.Client;
import com.microsoft.azure.kusto.data.ClientFactory;
import com.microsoft.azure.kusto.data.KustoOperationResult;
import com.microsoft.azure.kusto.data.KustoResultSetTable;
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;

public class HelloKusto {
  public static void main(String[] args) throws Exception {
    try {
      String clusterUri = "https://help.kusto.windows.net/";
      ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);

      try (Client kustoClient = ClientFactory.createClient(kcsb)) {
        String database = "Samples";
        String query = "print Welcome='Hello Kusto!'";
        KustoOperationResult response = kustoClient.execute(database, query);

        KustoResultSetTable primaryResults = response.getPrimaryResults();
        primaryResults.next();
        System.out.println(primaryResults.getString("Welcome"));
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
# Change directory to the folder that contains the hello world project
dotnet run .
```

### [Python](#tab/python)

```bash
python hello_kusto.py
```

### [Typescript](#tab/typescript)

To run the code in a Node.js environment:

```bash
node hello-kusto.js
```

To run the code in a browser environment:

```bash
npm run dev
```

> [!NOTE]
> In a browser environment, open the [developer tools console](/microsoft-edge/devtools-guide-chromium/console/) to see the output.

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
mvn install exec:java -Dexec.mainClass="<groupId>.HelloKusto"
```

---

You should see a result similar to the following:

```bash
Hello Kusto!
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [Create an app to run basic queries](app-basic-query.md)
