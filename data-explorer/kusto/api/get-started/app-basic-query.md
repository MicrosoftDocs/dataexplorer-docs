---
title:  'Create an app to run basic queries'
description: Learn how to create an app to run basic queries using Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 04/24/2023
---
# Create an app to run basic queries

In this article, you learn how to:

> [!div class="checklist"]
>
> - [Run a basic query and process the results](#run-a-basic-query-and-process-the-results)
> - [Use ordinal positions to access column values](#use-ordinal-positions-to-access-column-values)
> - [Customize query behavior with client request properties](#customize-query-behavior-with-client-request-properties)
> - [Use query parameters to protect user input](#use-query-parameters-to-protect-user-input)

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Kusto client library.

## Run a basic query and process the results

In your preferred IDE or text editor, create a project or file named *basic query* using the convention appropriate for your preferred language. Then add the following code:

1. Create a client app that connects to the [help cluster](https://dataexplorer.azure.com/clusters/help).

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;

    namespace BasicQuery {
      class BasicQuery {
        static void Main(string[] args) {
          var clusterUri = "https://help.kusto.windows.net/";
          var kcsb = new KustoConnectionStringBuilder(clusterUri)
              .WithAadUserPromptAuthentication();

          using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kcsb)) {
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

    if __name__ == "__main__":
      main()
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";

    async function main() {
      const clusterUri = "https://help.kusto.windows.net";
      const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri);

      const kustoClient = new KustoClient(kcsb);
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

    public class BasicQuery {
      public static void main(String[] args) throws Exception {
        try {
          String clusterUri = "https://help.kusto.windows.net/";
          ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);

          try (Client kustoClient = ClientFactory.createClient(kcsb)) {
          }
        }
      }
    }
    ```

    ---

1. Define the database and query to run. The query returns the date, state, and total tornado related damage where the total damage exceeded 100 million dollars.

    ### [C\#](#tab/csharp)

    ```csharp
    var database = "Samples";
    var query = @"StormEvents
                  | where EventType == 'Tornado'
                  | extend TotalDamage = DamageProperty + DamageCrops
                  | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                  | where DailyDamage > 100000000
                  | order by DailyDamage desc";
    ```

    ### [Python](#tab/python)

    ```python
    database = "Samples"
    query = "StormEvents" \
            "| where EventType == 'Tornado'" \
            "| extend TotalDamage = DamageProperty + DamageCrops" \
            "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)" \
            "| where DailyDamage > 100000000" \
            "| order by DailyDamage desc"
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    const database = "Samples";
    const query = `StormEvents
                   | where EventType == 'Tornado'
                   | extend TotalDamage = DamageProperty + DamageCrops
                   | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                   | where DailyDamage > 100000000
                   | order by DailyDamage desc`;
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    String database = "Samples";
    String query = "StormEvents\n" +
                   "| where EventType == 'Tornado'\n" +
                   "| extend TotalDamage = DamageProperty + DamageCrops\n" +
                   "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)\n" +
                   "| where DailyDamage > 100000000\n" +
                   "| order by DailyDamage desc";
    ```

    ---

1. Run the query and print the result.

    ### [C\#](#tab/csharp)

    ```csharp
    using (var response = kustoClient.ExecuteQuery(database, query, null)) {
      int columnNoStartTime = response.GetOrdinal("StartTime");
      int columnNoState = response.GetOrdinal("State");
      int columnNoDailyDamage = response.GetOrdinal("DailyDamage");
      Console.WriteLine("Daily tornado damages over 100,000,000$:");

      while (response.Read()) {
        Console.WriteLine("{0} - {1}, {2}",
          response.GetDateTime(columnNoStartTime),
          response.GetString(columnNoState),
          response.GetInt64(columnNoDailyDamage));
      }
    }
    ```

    ### [Python](#tab/python)

    ```python
    response = kusto_client.execute(database, query)

    print("Daily tornado damages over 100,000,000$:")
    for row in response.primary_results[0]:
      print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")
    ```

    ### [Typescript](#tab/typescript)

    ```typescript
    let response = await kustoClient.execute(database, query);

    console.log("Daily tornado damages over 100,000,000$:");
    for (row of response.primaryResults[0].rows()) {
      console.log(row["StartTime"].toString(), "-", row["State"].toString(), ",", row["DailyDamage"].toString(), "$");
    }
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    KustoOperationResult response = kusto_client.execute(database, query);
    KustoResultSetTable primaryResults = response.getPrimaryResults();

    System.out.println("Daily tornado damages over 100,000,000$:");
    while (primaryResults.next()) {
      System.out.println(primaryResults.getString("StartTime") + " - " + primaryResults.getString("State") + " , " + primaryResults.getString("DailyDamage"));
    }
    ```

    ---

The complete code should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Net.Client;

namespace BasicQuery {
  class BasicQuery {
    static void Main(string[] args) {
      string clusterUri = "https://help.kusto.windows.net/";
      var kcsb = new KustoConnectionStringBuilder(clusterUri)
          .WithAadUserPromptAuthentication();

      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kcsb)) {
        string database = "Samples";
        string query = @"StormEvents
                         | where EventType == 'Tornado'
                         | extend TotalDamage = DamageProperty + DamageCrops
                         | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                         | where DailyDamage > 100000000
                         | order by DailyDamage desc";

        using (var response = kustoClient.ExecuteQuery(database, query, null)) {
          int columnNoStartTime = response.GetOrdinal("StartTime");
          int columnNoState = response.GetOrdinal("State");
          int columnNoDailyDamage = response.GetOrdinal("DailyDamage");

          Console.WriteLine("Daily tornado damages over 100,000,000$:");

          while (response.Read()) {
            Console.WriteLine("{0} - {1}, {2}",
              response.GetDateTime(columnNoStartTime),
              response.GetString(columnNoState),
              response.GetInt64(columnNoDailyDamage));
          }
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
    query = "StormEvents" \
            "| where EventType == 'Tornado'" \
            "| extend TotalDamage = DamageProperty + DamageCrops" \
            "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)" \
            "| where DailyDamage > 100000000" \
            "| order by DailyDamage desc"

    response = kusto_client.execute(database, query)

    print("Daily tornado damages over 100,000,000$:")
    for row in response.primary_results[0]:
      print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")

if __name__ == "__main__":
  main()
```

### [Typescript](#tab/typescript)

```typescript
import { Client as KustoClient, KustoConnectionStringBuilder } from "azure-kusto-data";

async function main() {
  const cluster_uri = "https://help.kusto.windows.net";
  const kcsb = KustoConnectionStringBuilder.withUserPrompt(cluster_uri);
  const kustoClient = new KustoClient(kcsb);

  const database = "Samples";
  const query = `StormEvents
                 | where EventType == 'Tornado'
                 | extend TotalDamage = DamageProperty + DamageCrops
                 | where DailyDamage > 100000000
                 | order by DailyDamage desc`;
  let response = await kustoClient.execute(database, query);

  console.log("Daily tornado damages over 100,000,000$:");
  for (row of response.primaryResults[0].rows()) {
    console.log(row["StartTime"].toString(), "-", row["State"].toString(), ",", row["DailyDamage"].toString(), "$");
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
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;

public class BasicQuery {
  public static void main(String[] args) throws Exception {
    try {
      String clusterUri = "https://help.kusto.windows.net/";
      ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
      try (Client kustoClient = ClientFactory.createClient(kcsb)) {
        String database = "Samples";
        String query = "StormEvents\n" +
                       "| where EventType == 'Tornado'\n" +
                       "| extend TotalDamage = DamageProperty + DamageCrops\n" +
                       "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)\n" +
                       "| where DailyDamage > 100000000\n" +
                       "| order by DailyDamage desc";
        KustoOperationResult response = kustoClient.execute(database, query);
        KustoResultSetTable primaryResults = response.getPrimaryResults();

        System.out.println("Daily tornado damages over 100,000,000$:");
        while (primaryResults.next()) {
          System.out.println(primaryResults.getString("StartTime") + " - " + primaryResults.getString("State") + " , " + primaryResults.getString("DailyDamage"));
        }
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
# Change directory to the folder that contains the basic queries project
dotnet run .
```

### [Python](#tab/python)

```bash
python basic_query.py
```

### [Typescript](#tab/typescript)

To run the code in a Node.js environment:

```bash
node basic-query.js
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
mvn install exec:java -Dexec.mainClass="<groupId>.BasicQuery"
```

---

You should see a result similar to the following:

```bash
Daily damages tornado with damages over 100,000,000$:
2007-02-02 00:00:00+00:00 - FLORIDA , 270004000 $
2007-03-01 00:00:00+00:00 - ALABAMA , 266853000 $
2007-05-04 00:00:00+00:00 - KANSAS , 251625000 $
2007-03-01 00:00:00+00:00 - GEORGIA , 143688000 $
```

## Use ordinal positions to access column values

When the order of columns in a query result is known, it's more efficient to access the values of the columns by their ordinal position in the result set than by their column name. Optionally, at runtime you can use a library method to determine a column ordinal from its column name.

> [!NOTE]
> You can control the presence and order of columns in a query result by using the [`project`](../../query/projectoperator.md) or [`project-away`](../../query/projectawayoperator.md) operators.

For example, you can modify the previous code to access the values of the `StartTime`, `State`, and `DailyDamage` columns by their ordinal positions in the result set:

### [C\#](#tab/csharp)

In C#, you can only access the values of the columns by their ordinal positions in the result set. You can't use the column names; hence, the code remains the same.

```csharp
int columnNoStartTime = response.GetOrdinal("StartTime");
int columnNoState = response.GetOrdinal("State");
int columnNoDailyDamage = response.GetOrdinal("DailyDamage");
Console.WriteLine("Daily tornado damages over 100,000,000$:");

while (response.Read()) {
  Console.WriteLine("{0} - {1}, {2}",
    response.GetDateTime(columnNoStartTime),
    response.GetString(columnNoState),
    response.GetInt64(columnNoDailyDamage));
}
```

### [Python](#tab/python)

```python
state_col = 0
start_time_col = next(col.ordinal for col in response.primary_results[0].columns if col.column_name == "StartTime")
damage_col = 2

print("Daily damages over 100,000,000$:")
for row in response.primary_results[0]:
  print(row[start_time_col], "-", row[state_col], ",", row[damage_col], "$")
```

### [Typescript](#tab/typescript)

```typescript
const columnNoState = 0;
const columnNoStartTime = response.primaryResults[0].columns.find(c => c.name == "StartTime").ordinal;
const columnNoDailyDamage = 2;
console.log("Daily tornado damages over 100,000,000$:");

for (row of response.primaryResults[0].rows()) {
  console.log(row.getValueAt(columnNoStartTime).toString(), "-", row.getValueAt(columnNoState).toString(), ",", row.getValueAt(columnNoDailyDamage).toString(), "$");
}
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
Integer columnNoState = 0;
Integer columnNoStartTime = primaryResults.findColumn("StartTime");
Integer columnNoDailyDamage = 2;

while (primaryResults.next()) {
  System.out.println(primaryResults.getString(columnNoStartTime) + " - " + primaryResults.getString(columnNoState) + " , " + primaryResults.getString(columnNoDailyDamage));
}
```

---

## Customize query behavior with client request properties

You can customize the behavior of a query by setting client request properties. For more information on available options, see [client request properties](../netfx/request-properties.md).

For example, you can replace the `kusto_client.execute_query` call in the previous code to pass a custom request ID and set the query timeout to 1 minute. To use the client request properties, you must import the `ClientRequestProperties` class.

### [C\#](#tab/csharp)

```csharp
using Kusto.Data.Common;

var crp = new ClientRequestProperties();
// Set a custom client request identifier
crp.ClientRequestId = "QueryDemo" + Guid.NewGuid().ToString();
// Set the query timeout to 1 minute
crp.SetOption(ClientRequestProperties.OptionServerTimeout, "1m");

using (var response = kustoClient.ExecuteQuery(database, query, crp)) {
}
```

### [Python](#tab/python)

```python
from azure.kusto.data import ClientRequestProperties
from datetime import datetime
import uuid;

crp = ClientRequestProperties()
# Set a custom client request identifier
crp.client_request_id = "QueryDemo" + str(uuid.uuid4())
# Set the query timeout to 1 minute
crp.set_option(crp.request_timeout_option_name, datetime.timedelta(minutes=1))

response = kusto_client.execute_query(database, query, crp)
```

### [Typescript](#tab/typescript)

```typescript
const ClientRequestProperties = require("azure-kusto-data").ClientRequestProperties;
const uuid = require('uuid');

const crp = new ClientRequestProperties();
// Set a custom client request identifier
crp.clientRequestId = "QueryDemo" + uuid.v4();
// Set the query timeout to 1 minute
crp.setServerTimeout(1000 * 60);

let response = await kustoClient.execute(database, query, crp);
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
import com.microsoft.azure.kusto.data.ClientRequestProperties;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

ClientRequestProperties crp = new ClientRequestProperties();
// Set a custom client request identifier
crp.setClientRequestId("QueryDemo" + UUID.randomUUID());
// Set the query timeout to 1 minute
crp.setTimeoutInMilliSec(TimeUnit.MINUTES.toMillis(60));

KustoOperationResult response = kusto_client.execute(database, query, crp);
```

---

## Use query parameters to protect user input

Query parameters are important for maintaining the security and protection of your data. It safeguards it from potential malicious actors that may attempt to gain unauthorized access to or corrupt your data. For more information about parameterized queries, see [Query parameters declaration statement](../../query/queryparametersstatement.md).

For example, you can modify the previous code to pass the *EventType* value and *DailyDamage* minimum value as parameters to the query. To use parameters:

1. Declare the parameters in the query text
1. Substitute the property values in the query text with the parameter names
1. Set the parameter values in the client request properties passed to the execute method

### [C\#](#tab/csharp)

```csharp
string query = @"declare query_parameters(event_type:string, daily_damage:int);
                  StormEvents
                  | where EventType == event_type
                  | extend TotalDamage = DamageProperty + DamageCrops
                  | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                  | where DailyDamage > daily_damage
                  | order by DailyDamage desc";

var crp = new ClientRequestProperties();
crp.SetParameter("event_type", "Flash Flood");
crp.SetParameter("daily_damage", 200000000.ToString());

using (var response = kustoClient.ExecuteQuery(database, query, crp)) {
  int columnNoStartTime = response.GetOrdinal("StartTime");
  int columnNoState = response.GetOrdinal("State");
  int columnNoDailyDamage = response.GetOrdinal("DailyDamage");
  Console.WriteLine("Daily flash flood damages over 200,000,000$:");

  while (response.Read()) {
    Console.WriteLine("{0} - {1}, {2}",
      response.GetDateTime(columnNoStartTime),
      response.GetString(columnNoState),
      response.GetInt64(columnNoDailyDamage));
  }
}
```

### [Python](#tab/python)

```python
query = "declare query_parameters(event_type:string, daily_damage:int);"\
        "StormEvents" \
        "| where EventType == event_type" \
        "| extend TotalDamages = DamageProperty + DamageCrops" \
        "| summarize DailyDamage=sum(TotalDamages) by State, bin(StartTime, 1d)" \
        "| where DailyDamage > daily_damage" \
        "| order by DailyDamage desc"

crp = ClientRequestProperties()
crp.set_parameter("event_type", "Flash Flood")
crp.set_parameter("daily_damage", str(200000000))

response = kusto_client.execute_query(=database, query, crp)

print("Daily flash flood damages over 200,000,000$:")
for row in response.primary_results[0]:
  print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")
```

### [Typescript](#tab/typescript)

```typescript
const query = `declare query_parameters(event_type:string, daily_damage:int);
               StormEvents
               | where EventType == event_type
               | extend TotalDamage = DamageProperty + DamageCrops
               | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
               | where DailyDamage > daily_damage
               | order by DailyDamage desc`;

const crp = new ClientRequestProperties();
crp.setParameter("event_type", "Flash Flood");
crp.setParameter("daily_damage", 200000000);

let response = await kustoClient.execute(database, query, crp);

console.log("Daily flash flood damages over 200,000,000$:");
for (row of response.primaryResults[0].rows()) {
  console.log(row.getValueAt(columnNoStartTime).toString(), "-", row.getValueAt(columnNoState).toString(), ",", row.getValueAt(columnNoDailyDamage).toString(), "$");
}
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
String query = "declare query_parameters(event_type:string, daily_damage:int);\n" +
               "StormEvents\n" +
               "| where EventType == event_type\n" +
               "| extend TotalDamage = DamageProperty + DamageCrops\n" +
               "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)\n" +
               "| where DailyDamage > daily_damage\n" +
               "| order by DailyDamage desc";

ClientRequestProperties crp = new ClientRequestProperties();
crp.setParameter("event_type", "Flash Flood");
crp.setParameter("daily_damage", 200000000);

KustoOperationResult response = kusto_client.execute(database, query, crp);
KustoResultSetTable primary_results = response.getPrimaryResults();

System.out.println("Daily flash flood damages over 200,000,000$:");
while (primary_results.next()) {
  System.out.println("DEBUG: " + primary_results.getString(columnNoStartTime) + " - " + primary_results.getString(columnNoState) + " , " + primary_results.getString(columnNoDailyDamage));
}
```

---

The complete code using ordinal positions to access column values and parameters should look like this:

### [C\#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Data.Common;
using Kusto.Data.Net.Client;

namespace BasicQuery {
  class BasicQuery {
    static void Main(string[] args) {
      string clusterUri = "https://help.kusto.windows.net/";
      var kcsb = new KustoConnectionStringBuilder(clusterUri)
          .WithAadUserPromptAuthentication();

      using (var kustoClient = KustoClientFactory.CreateCslQueryProvider(kcsb)) {
        string database = "Samples";
        string query = @"declare query_parameters(event_type:string, daily_damage:int);
                         StormEvents
                         | where EventType == event_type
                         | extend TotalDamage = DamageProperty + DamageCrops
                         | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                         | where DailyDamage > daily_damage
                         | order by DailyDamage desc";

        var crp = new ClientRequestProperties();
        crp.ClientRequestId = "QueryDemo" + Guid.NewGuid().ToString();
        crp.SetOption(ClientRequestProperties.OptionServerTimeout, "1m");
        crp.SetParameter("event_type", "Flash Flood");
        crp.SetParameter("daily_damage", 200000000.ToString());

        using (var response = kustoClient.ExecuteQuery(database, query, crp)) {
          int columnNoStartTime = response.GetOrdinal("StartTime");
          int columnNoState = response.GetOrdinal("State");
          int columnNoDailyDamage = response.GetOrdinal("DailyDamage");

          Console.WriteLine("Daily flash flood damages over 200,000,000$:");

          while (response.Read()) {
            Console.WriteLine("{0} - {1}, {2}",
              response.GetDateTime(columnNoStartTime),
              response.GetString(columnNoState),
              response.GetInt64(columnNoDailyDamage));
          }
        }
      }
    }
  }
}
```

### [Python](#tab/python)

```python
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, ClientRequestProperties
from datetime import timedelta
import uuid;

def main():
  cluster_uri = "https://help.kusto.windows.net"
  kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)

  crp = ClientRequestProperties()

  crp.client_request_id = "QueryDemo" + str(uuid.uuid4())
  crp.set_option(crp.request_timeout_option_name, timedelta(minutes=1))
  crp.set_parameter("event_type", "Flash Flood")
  crp.set_parameter("daily_damage", str(200000000))

  with KustoClient(kcsb) as kusto_client:

    database = "Samples"
    query = "declare query_parameters(event_type:string, daily_damage:int);"\
            "StormEvents" \
            "| where EventType == event_type" \
            "| extend TotalDamages = DamageProperty + DamageCrops" \
            "| summarize DailyDamage=sum(TotalDamages) by State, bin(StartTime, 1d)" \
            "| where DailyDamage > daily_damage" \
            "| order by DailyDamage desc"

    response = kusto_client.execute_query(database, query, crp)

    state_col = 0
    start_time_col = next(col.ordinal for col in response.primary_results[0].columns if col.column_name == "StartTime")
    damage_col = 2


    print("Daily flash flood damages over 200,000,000$:")
    for row in response.primary_results[0]:
      print(row[start_time_col], "-", row[state_col], ",", row[damage_col], "$")

if __name__ == "__main__":
  main()
```

### [Typescript](#tab/typescript)

```typescript
const {Client, KustoConnectionStringBuilder, ClientRequestProperties} = require("azure-kusto-data");
const uuid = require('uuid');

async function main() {
  const clusterUri = "https://help.kusto.windows.net";
  const kcsb = KustoConnectionStringBuilder.withUserPrompt(clusterUri);
  const kustoClient = new Client(kcsb);

  const database = "Samples";
  const query = `declare query_parameters(event_type:string, daily_damage:int);
                 StormEvents
                 | where EventType == event_type
                 | extend TotalDamage = DamageProperty + DamageCrops
                 | summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)
                 | where DailyDamage > daily_damage
                 | order by DailyDamage desc`;

  const crp = new ClientRequestProperties();
  // Set a custom client request identifier
  crp.clientRequestId = "QueryDemo" + uuid.v4();
  // Set the query timeout to 1 minute
  crp.setTimeout(1000 * 60);

  crp.setParameter("event_type", "Flash Flood");
  crp.setParameter("daily_damage", 200000000);

  let response = await kustoClient.execute(database, query, crp);

  const columnNoState = 0;
  const columnNoStartTime = response.primaryResults[0].columns.find(c => c.name == "StartTime").ordinal;
  const columnNoDailyDamage = 2;

  console.log("Daily flash flood damages over 200,000,000$:");
  for (row of response.primaryResults[0].rows()) {
    console.log(row.getValueAt(columnNoStartTime).toString(), "-", row.getValueAt(columnNoState).toString(), ",", row.getValueAt(columnNoDailyDamage).toString(), "$");
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
import com.microsoft.azure.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.azure.kusto.data.ClientRequestProperties;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public class BasicQuery {
  public static void main(String[] args) throws Exception {
    try {
      String clusterUri = "https://help.kusto.windows.net/";
      ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithUserPrompt(clusterUri);
      try (Client kustoClient = ClientFactory.createClient(kcsb)) {
        String database = "Samples";
        String query = "declare query_parameters(event_type:string, daily_damage:int);\n" +
                       "StormEvents\n" +
                       "| where EventType == event_type\n" +
                       "| extend TotalDamage = DamageProperty + DamageCrops\n" +
                       "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)\n" +
                       "| where DailyDamage > daily_damage\n" +
                       "| order by DailyDamage desc";

        ClientRequestProperties crp = new ClientRequestProperties();
        // Set a custom client request identifier
        crp.setClientRequestId("QueryDemo" + UUID.randomUUID());
        // Set the query timeout to 1 minute
        crp.setTimeoutInMilliSec(TimeUnit.MINUTES.toMillis(60));
        crp.setParameter("event_type", "Flash Flood");
        crp.setParameter("daily_damage", 200000000);

        KustoOperationResult response = kustoClient.execute(database, query, crp);
        KustoResultSetTable primaryResults = response.getPrimaryResults();

        Integer columnNoState = 0;
        Integer columnNoStartTime = primaryResults.findColumn("StartTime");
        Integer columnNoDailyDamage = 2;

        System.out.println("Daily flash flood damages over 200,000,000$:");
        while (primaryResults.next()) {
          System.out.println("DEBUG: " + primaryResults.getString(columnNoStartTime) + " - " + primaryResults.getString(columnNoState) + " , " + primaryResults.getString(columnNoDailyDamage));
        }
      }
    }
  }
}
```

---

You should see a result similar to the following:

```bash
Daily flash flood damages over 200,000,000$:
2007-08-21 00:00:00+00:00 - OHIO , 253320000 $
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [Create an app to run management commands](app-management-commands.md)
