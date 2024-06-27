---
ms.topic: include
ms.date: 06/27/2024
---
## Create a table to store your logs

Fluent Bit forwards logs in JSON format with three properties: `log` ([dynamic](../../kusto/query/scalar-data-types/dynamic.md)), `tag` ([string](../../kusto/query/scalar-data-types/string.md)), and `timestamp` ([datetime](../../kusto/query/scalar-data-types/datetime.md)).

You can create a table with columns for each of these properties. Alternatively, if you have structured logs, you can create a table with log properties mapped to custom columns. To learn more, select the relevant tab.

### [Default schema](#tab/default)

To create a table for incoming logs from Fluent Bit:

1. Browse to your query environment.
1. Select the database where you'd like to create the table.
1. Run the following [.create table command](../../kusto/management/create-table-command.md):

    ```kusto
    .create table FluentBitLogs (log:dynamic, tag:string, timestamp:datetime)
    ```

   The incoming JSON properties are automatically mapped into the correct column.
    
### [Custom schema](#tab/custom)

To create a table for incoming structured logs from Fluent Bit:

1. Browse to your query environment.
1. Select the database where you'd like to create the table.
1. Run the [.create table command](../../kusto/management/create-table-command.md). For example, if your logs contain three fields named `myString`, `myInteger`, and `myDynamic`, you can create a table with the following schema:

    ```kusto
    .create table FluentBitLogs (myString:string, myInteger:int, myDynamic: dynamic, timestamp:datetime)
    ```

1. Create a [JSON mapping](../../kusto/management/mappings.md) to map log properties to the appropriate columns. The following command creates a mapping based on the example in the previous step:

    ```kusto
    .create-or-alter table FluentBitLogs ingestion json mapping "LogMapping" 
        ```[
        {"column" : "myString", "datatype" : "string", "Properties":{"Path":"$.log.myString"}},
        {"column" : "myInteger", "datatype" : "int", "Properties":{"Path":"$.log.myInteger"}}, 
        {"column" : "myDynamic", "datatype" : "dynamic", "Properties":{"Path":"$.log.myInteger"}}, 
        {"column" : "timestamp", "datatype" : "datetime", "Properties":{"Path":"$.timestamp"}} 
        ]```
    ```

---

## Register a Microsoft Entra app with permissions to ingest data

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal will be the identity used by the connector to write data your table in Kusto. You'll later grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]


## Grant permissions to the service principal

Run the following command, replacing `<MyDatabase>` with the name of the database:

```kusto
.add database MyDatabase ingestors ('aadapp=<Application (client) ID>;<Directory (tenant) ID>')
```

This command grants the application permissions to ingest data into your table. For more information, see [role-based access control](../../kusto/access-control/role-based-access-control.md).

