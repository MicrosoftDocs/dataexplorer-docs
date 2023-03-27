---
title: 'Basic query: Create an app to run basic queries - Azure Data Explorer'
description: Learn how to create an app to run basic queries using Azure Data Explorer client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 03/27/2023
---
# Basic query: Create an app to run basic queries

In this article, you learn how to:

> [!div class="checklist"]
>
> - [Run a basic query and process the results](#run-a-basic-query-and-process-the-results)
> - [Use ordinal positions to access column values](#use-ordinal-positions-to-access-column-values)
> - [Customize query behavior with client request properties](#customize-query-behavior-with-client-request-properties)
> - [Use query parameters to protect user input](#use-query-parameters-to-protect-user-input)

## Prerequisites

[Set up your development environment](app-set-up.md) to use the Azure Data Explorer client library.

## Run a basic query and process the results

In your preferred IDE or text editor, create a file named `basic-query` with the language appropriate extension, and then add code to do the following:

1. Create a client app that connects to the [help cluster](https://dataexplorer.azure.com/clusters/help).

    ### [C\#](#tab/csharp)

    ```csharp
    using Kusto.Data;
    using Kusto.Data.Net.Client;
    ```

    ### [Python](#tab/python)

    ```python
    from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

    def main():
      cluster_uri = "https://help.kusto.windows.net"
      kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)

      with KustoClient(kcsb) as query_client:
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

1. Define the database and query to run. The query returns the date, state, and total tornado related damage where the total damage exceeded 100 million dollars.

    ### [C\#](#tab/csharp)

    ```csharp
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

    ### [Node.js](#tab/nodejs)

    ```nodejs
    ```

    <!-- ### [Go](#tab/go) -->

    ### [Java](#tab/java)

    ```java
    ```

    ---

1. Run the query and print the result.

    ### [C\#](#tab/csharp)

    ```csharp
    ```

    ### [Python](#tab/python)

    ```python
    response = query_client.execute(database, query)

    print("Daily tornado damages over 100,000,000$:")
    for row in response.primary_results[0]:
      print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")
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
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder

def main():
  cluster_uri = "https://help.kusto.windows.net"
  kcsb = KustoConnectionStringBuilder.with_interactive_login(cluster_uri)

  with KustoClient(kcsb) as query_client:

    database = "Samples"
    query = "StormEvents" \
            "| where EventType == 'Tornado'" \
            "| extend TotalDamage = DamageProperty + DamageCrops" \
            "| summarize DailyDamage=sum(TotalDamage) by State, bin(StartTime, 1d)" \
            "| where DailyDamage > 100000000" \
            "| order by DailyDamage desc"

    response = query_client.execute(database, query)

    print("Daily tornado damages over 100,000,000$:")
    for row in response.primary_results[0]:
      print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")

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

In a command shell, run your app using the following command:

### [C\#](#tab/csharp)

```bash
basic-query.exe
```

### [Python](#tab/python)

```bash
python basic-query.py
```

### [Node.js](#tab/nodejs)

```bash
node basic-query.js
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
java HelloKusto
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
> You can control the order of columns in a query result by using the [`project`](../../query/projectoperator.md) or [`project-away`](../../query/projectawayoperator.md) operators.

For example, you can modify the previous code to access the values of the `StartTime`, `State`, and `DailyDamage` columns by their ordinal positions in the result set:

### [C\#](#tab/csharp)

```csharp
```

### [Python](#tab/python)

```python
state_col = 0
damage_col = 2

start_time_col = next(col.ordinal for col in response.primary_results[0].columns if col.column_name == "StartTime")

print("Daily damages over 100,000,000$:")
for row in response.primary_results[0]:
  print(row[start_time_col], "-", row[state_col], ",", row[damage_col], "$")
```

### [Node.js](#tab/nodejs)

```nodejs
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
```

---

## Customize query behavior with client request properties

You can customize the behavior of a query by setting client request properties. For more information, see [client request properties](../netfx/request-properties.md).

For example, you can replace the query_client.execute_query call in the previous code to set the query timeout to 1 minute and pass a customer request ID. To use the client request properties, you must import the `ClientRequestProperties` class.

### [C\#](#tab/csharp)

```csharp
```

### [Python](#tab/python)

```python
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder, ClientRequestProperties
from datetime import datetime
import uuid;

crp = ClientRequestProperties()

crp.client_request_id = "QueryDemo;" + str(uuid.uuid4())
crp.set_option(crp.request_timeout_option_name, datetime.timedelta(minutes=1))

response = query_client.execute_query(database=database, query=query, properties=crp)
```

### [Node.js](#tab/nodejs)

```nodejs
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
```

---

## Use query parameters to protect user input

You can use query parameters to prevent KQL injection and ensure the safe handling of user input passed to a KQL query. By not including user input as part of the query text, query parameters provide a secure method for managing input that is entered into a KQL query. This feature is crucial for maintaining the security and protection of your data, safeguarding it from potential malicious actors who may attempt to gain unauthorized access or corrupt your data. For more information about parameterized queries, see [Query parameters declaration statement](../../query/queryparametersstatement.md).

For example, you can modify the previous code to pass the *EventType* value and *DailyDamage* minimum value as parameters to the query. To use parameters:

1. Declare the parameters in the query text
1. Substitute the property values in the query text with the parameter names
1. Set the parameter values in the client request properties passed to the execute method

### [C\#](#tab/csharp)

```csharp
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

response = query_client.execute_query(database=database, query=query, properties=crp)

print("Daily flash flood damages over 200,000,000$:")
for row in response.primary_results[0]:
  print(row["StartTime"], "-", row["State"], ",", row["DailyDamage"], "$")
```

### [Node.js](#tab/nodejs)

```nodejs
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```java
```

---

The complete code using ordinal positions to access column values and parameters should look like this:

### [C\#](#tab/csharp)

```csharp
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

  crp.client_request_id = "QueryDemo;" + str(uuid.uuid4())
  crp.set_option(crp.request_timeout_option_name, timedelta(minutes=1))
  crp.set_parameter("event_type", "Flash Flood")
  crp.set_parameter("daily_damage", str(200000000))

  with KustoClient(kcsb) as query_client:

    database = "Samples"
    query = "declare query_parameters(event_type:string, daily_damage:int);"\
            "StormEvents" \
            "| where EventType == event_type" \
            "| extend TotalDamages = DamageProperty + DamageCrops" \
            "| summarize DailyDamage=sum(TotalDamages) by State, bin(StartTime, 1d)" \
            "| where DailyDamage > daily_damage" \
            "| order by DailyDamage desc"

    response = query_client.execute_query(database=database, query=query, properties=crp)

    state_col = 0
    damage_col = 2

    start_time_col = next(col.ordinal for col in response.primary_results[0].columns if col.column_name == "StartTime")

    print("Daily flash flood damages over 200,000,000$:")
    for row in response.primary_results[0]:
      print(row[start_time_col], "-", row[state_col], ",", row[damage_col], "$")

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

You should see a result similar to the following:

```bash
Daily flash flood damages over 200,000,000$:
2007-08-21 00:00:00+00:00 - OHIO , 253320000 $
```

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [TBD](../../../kql-quick-reference.md)
