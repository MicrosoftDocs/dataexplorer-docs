---
ms.topic: include
ms.date: 12/03/2024
---
## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programmatically, as in the following example.

This service principal is the identity used by the connector to write data to your table in Kusto. You grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create a target table

Fluent Bit forwards logs in JSON format with three properties: `log` ([dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic)), `tag` ([string](/azure/data-explorer/kusto/query/scalar-data-types/string)), and `timestamp` ([datetime](/azure/data-explorer/kusto/query/scalar-data-types/datetime)).

You can create a table with columns for each of these properties. Alternatively, if you have structured logs, you can create a table with log properties mapped to custom columns. To learn more, select the relevant tab.

### [Default schema](#tab/default)

To create a table for incoming logs from Fluent Bit:

1. Browse to your query environment.
1. Select the database where you'd like to create the table.
1. Run the following [`.create table` command](/azure/data-explorer/kusto/management/create-table-command):

    ```kusto
    .create table FluentBitLogs (log:dynamic, tag:string, timestamp:datetime)
    ```

   The incoming JSON properties are automatically mapped into the correct column.

### [Custom schema](#tab/custom)

To create a table for incoming structured logs from Fluent Bit:

1. Browse to your query environment.
1. Select the database where you'd like to create the table.
1. Run the [`.create table` command](/azure/data-explorer/kusto/management/create-table-command). For example, if your logs contain three fields named `myString`, `myInteger`, and `myDynamic`, you can create a table with the following schema:

    ```kusto
    .create table FluentBitLogs (myString:string, myInteger:int, myDynamic: dynamic, timestamp:datetime)
    ```

1. Create a [JSON mapping](/azure/data-explorer/kusto/management/mappings) to map log properties to the appropriate columns. The following command creates a mapping based on the example in the previous step:

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

## Grant permissions to the service principal

Grant the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) [database ingestor](/azure/data-explorer/kusto/access-control/role-based-access-control) role permissions to work with the database. For more information, see [Examples](/azure/data-explorer/kusto/management/manage-database-security-roles). Replace the placeholder *DatabaseName* with the name of the target database and *ApplicationID* with the `AppId` value you saved when creating a Microsoft Entra service principal.

```kusto
.add database <DatabaseName> ingestors ('aadapp=<ApplicationID>;<TenantID>')
```

## Configure Fluent Bit to send logs to your table

To configure Fluent Bit to send logs to your table in Kusto, create a [classic mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) or [YAML mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/yaml/configuration-file) configuration file with the following output properties:

| Field | Description | Required | Default |
|--|--|--|--|
| Name | `azure_kusto` |
| Match | A pattern to match against the tags of incoming records. It's case-sensitive and supports the star (`*`) character as a wildcard. |
| tenant_id | The tenant ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
| client_id | The application ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
| client_secret | The client secret key value (password) from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
| ingestion_endpoint | Enter the value as described for [Ingestion_Endpoint](#ingestion-uri). |
| database_name | The name of the database that contains your logs table. |
| table_name | The name of the table from [Create a target table](#create-a-target-table). |
| ingestion_mapping_reference | The name of the ingestion mapping from [Create a target table](#create-a-target-table). If you didn't create an ingestion mapping, remove the property from the configuration file. |
| log_key | Key name of the log content. For instance, `log`. |
| tag_key | The key name of tag. Ignored if `include_tag_key` is false. |
| include_time_key | A timestamp is appended to output, if enabled. Uses the `time_key` property. |
| time_key | The key name for the timestamp in the log records. Ignored if `include_time_key` false. |
| ingestion_endpoint_connect_timeout| The connection timeout of various Kusto endpoints in seconds. |
|compression_enabled | Sends compressed HTTP payload (gzip) to Kusto, if enabled. |
|ingestion_resources_refresh_interval | The ingestion resources refresh interval of Kusto endpoint in seconds. |
| workers | The number of [workers](https://docs.fluentbit.io/manual/administration/multithreading#outputs) to perform flush operations for this output. |

| Field | Description | Required | Default |
|--|--|--|--|
| Name | The pipeline name. |  |  `azure_kusto`|
|--|--|--|--|
| tenant_id | The tenant ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| client_id | The application ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| client_secret | The client secret key value (password) from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| ingestion_endpoint | Enter the value as described for [Ingestion_Endpoint](#ingestion-uri). | :heavy_check_mark: |  |
| database_name | The name of the database that contains your logs table. | :heavy_check_mark: |  |
| table_name | The name of the table from [Create a target table](#create-a-target-table). | :heavy_check_mark: |  |
| ingestion_mapping_reference | The name of the ingestion mapping from [Create a target table](#create-a-target-table). If you didn't create an ingestion mapping, remove the property from the configuration file. |  |  |
| log_key | Key name of the log content. For instance, `log`. |  | `log` |
| tag_key | The key name of tag. Ignored if `include_tag_key` is false. |  | `tag` |
| include_time_key | A timestamp is appended to output, if enabled. Uses the `time_key` property. |  | `true` |
| time_key | The key name for the timestamp in the log records. Ignored if `include_time_key` false. |  | `timestamp` |
| ingestion_endpoint_connect_timeout The connection timeout of various Kusto endpoints in seconds. |  |  | `60s` |
| compression_enabled | Sends compressed HTTP payload (gzip) to Kusto, if enabled. |  | `true` |
| ingestion_resources_refresh_interval | The ingestion resources refresh interval of Kusto endpoint in seconds. |  | `3600` |
| workers | The number of [workers](https://docs.fluentbit.io/manual/administration/multithreading#outputs) to perform flush operations for this output. |  | `0` |

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
    match *
    name azure_kusto
    tenant_id <TenantId>
    client_id <ClientId>
    client_secret <AppSecret>
    ingestion_endpoint <IngestionEndpoint>
    database_name <DatabaseName>
    table_name <TableName>
    ingestion_mapping_reference <MappingName>
    ingestion_endpoint_connect_timeout <IngestionEndpointConnectTimeout>
    compression_enabled <CompressionEnabled>
    ingestion_resources_refresh_interval <IngestionResourcesRefreshInterval>
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
        match *
        name azure_kusto
        tenant_id <TenantId>
        client_id <ClientId>
        client_secret <AppSecret>
        ingestion_endpoint <IngestionEndpoint>
        database_name <DatabaseName>
        table_name <TableName>
        ingestion_mapping_reference <MappingName>
        ingestion_endpoint_connect_timeout <IngestionEndpointConnectTimeout>
        compression_enabled <CompressionEnabled>
        ingestion_resources_refresh_interval <IngestionResourcesRefreshInterval>
```

---

## Confirm data ingestion

1. Once data arrives in the table, confirm the transfer of data, by checking the row count:

    ```Kusto
    FluentBitLogs
    | count
    ```

1. To view a sample of log data, run the following query:

    ```Kusto
    FluentBitLogs
    | take 100
    ```
