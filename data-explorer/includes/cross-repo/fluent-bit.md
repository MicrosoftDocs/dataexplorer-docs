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

## Configure Fluent Bit to send logs to your table

To configure Fluent Bit to send logs to your Azure Data Explorer table, create a [classic mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) or [YAML mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/yaml/configuration-file) configuration file with the following output properties:

| Field                       | Description                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                        | `azure_kusto`                                                                                                                                                                                                                      |
| Match                       | A pattern to match against the tags of incoming records. It's case-sensitive and supports the star (`*`) character as a wildcard.                                                                                                  |
| Tenant_Id                   | **Directory (tenant) ID** from [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                  |
| Client_Id                   | **Application (client) ID** from [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                |
| Client_Secret               | The client secret key value [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                     |
| Ingestion_Endpoint          | Use the **Data Ingestion URI** found in the [Azure portal](https://ms.portal.azure.com/) under your cluster overview.                                                                                                              |
| Database_Name               | The name of the database that contains your logs table.                                                                                                                                                                            |
| Table_Name                  | The name of the table from [Create an Azure Data Explorer table](#create-an-azure-data-explorer-table-to-store-your-logs).                                                                                                         |
| Ingestion_Mapping_Reference | The name of the ingestion mapping from [Create an Azure Data Explorer table](#create-an-azure-data-explorer-table-to-store-your-logs). If you didn't create an ingestion mapping, remove the property from the configuration file. |

To see an example configuration file, select the relevant tab:

### [Classic mode](#tab/classic)

```txt
[SERVICE]
    Daemon Off
    Flush 1
    Log_Level trace
    HTTP_Server On
    HTTP_Listen 0.0.0.0
    HTTP_Port 2020
    Health_Check On

[INPUT]
    Name tail
    Path /var/log/containers/*.log
    Tag kube.*
    Mem_Buf_Limit 1MB
    Skip_Long_Lines On
    Refresh_Interval 10

[OUTPUT]
    Name azure_kusto
    Match *
    Tenant_Id azure-tenant-id
    Client_Id azure-client-id
    Client_Secret azure-client-secret
    Ingestion_Endpoint azure-data-explorer-ingestion-endpoint
    Database_Name azure-data-explorer-database-name
    Table_Name azure-data-explorer-table-name
```

### [YAML mode](#tab/yaml)

```yaml
config:
  service: |
    [SERVICE]
        Daemon Off
        Flush 1
        Log_Level trace
        HTTP_Server On
        HTTP_Listen 0.0.0.0
        HTTP_Port 2020
        Health_Check On
        
  inputs: |
    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        multiline.parser docker, cri
        Tag kube.*
        Mem_Buf_Limit 1MB
        Skip_Long_Lines On
        Refresh_Interval 10

  filters: |
    [FILTER]
        Name kubernetes
        Match kube.*
        Merge_Log On
        Merge_Log_key log_processed
        K8S-Logging.Parser On
        K8S-Logging.Exclude Off


  outputs: |
    [OUTPUT]
        Name azure_kusto
    	Match *
    	Tenant_Id azure-tenant-id
    	Client_Id azure-client-id
    	Client_Secret azure-client-secret
    	Ingestion_Endpoint azure-data-explorer-ingestion-endpoint
    	Database_Name azure-data-explorer-database-name
    	Table_Name azure-data-explorer-table-name
```

---

## Verify that data has landed in your table

Once the configuration is complete, logs should arrive in your table.

1. To verify that logs are ingested, run the following query:

    ```Kusto
    FluentBitLogs
    | count
    ```

1. To view a sample of log data, run the following query:

    ```Kusto
    FluentBitLogs
    | take 100
    ```