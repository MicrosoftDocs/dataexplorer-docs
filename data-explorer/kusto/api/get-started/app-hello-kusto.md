---
title: Create your first app - Hello Kusto - Azure Data Explorer
description: Learn how to create your first app to print Hello Kusto using Azure Data Explorer client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 02/05/2023
---
# Create your first app: Hello Kusto

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create your first app to run a basic query that:
>   - Uses interactive authentication to connect to our help cluster `https://help.kusto.windows.net`
>   - Run a basic query that prints *Hello Kusto!*

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Azure Data Explorer client library.

## Create your app

1. In your preferred IDE or text editor, create a file named `hello-kusto` with the language appropriate extension and add code to do the following:

    - Import the *KustoClient* and *KustoConnectionStringBuilder* classes from the `azure.kusto.data` package.
    - Define an empty function named `main` and calls it.

    ### [C\#](#tab/csharp)

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

    def main():

    if __name__ == "__main__":
        main()
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const KustoClient = require("azure-kusto-data").Client;
    const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;

    async function main() {
    }

    main();
    ```

    ### [Go](#tab/go)

    ### [Java](#tab/java)

    ---

1. Add code to create a *KustoConnectionStringBuilder* object that defines the connection string to the cluster and sets the authentication mode to interactive. The connection string is in the format `https://<clusterName>.<region>.kusto.windows.net;`.

    ### [C\#](#tab/csharp)

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

    ### [Go](#tab/go)

    ### [Java](#tab/java)

    ---

1. Add code to create a client object that uses the *KustoConnectionStringBuilder* object to connect to the cluster.

    ### [C\#](#tab/csharp)

    ### [Python](#tab/python)

    ```python
    query_client = KustoClient(kcsb)
    ```

    ### [Node.js](#tab/nodejs)

    ```nodejs
    const query_client = new KustoClient(kcsb);
    ```

    ### [Go](#tab/go)

    ### [Java](#tab/java)

    ---

1. Add code to define the database and query to run. The query prints *Hello Kusto!* in a column named **Welcome**.

    ### [C\#](#tab/csharp)

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

    ### [Go](#tab/go)

    ### [Java](#tab/java)

    ---

1. Add code to run the query and print the result.

    > [!NOTE]
    > The query output is returned in the response as the primary results object. The object contains an array of tables, which in turn contains an array of rows. Each row contains data organized into a dictionary of columns.
    >
    > The *print kusto* query returns a table with a single row in the result set, which is referenced as follows:
    >
    > - The first array index `[0]` references the first table
    > - The second array index `[0]` references the first row
    > - The dictionary key `["Welcome"]` references the **Welcome** column

    ### [C\#](#tab/csharp)

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

    ### [Go](#tab/go)

    ### [Java](#tab/java)

    ---

The complete code should look like this:

### [C\#](#tab/csharp)

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

async function main() {
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

### [Go](#tab/go)

### [Java](#tab/java)

---

## Run your app

In a command shell, run your app using the following command:

### [C\#](#tab/csharp)

### [Python](#tab/python)

```bash
python hello-kusto.py
```

### [Node.js](#tab/nodejs)

```nodejs
node hello-kusto.js
```

### [Go](#tab/go)

### [Java](#tab/java)

---

You should see a result similar to the following:

```bash
Hello Kusto!
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [TBD](../../../kql-quick-reference.md)
