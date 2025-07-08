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

To configure Fluent Bit to send logs to your table in Kusto, create a [classic mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) or [YAML mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) configuration file with the following output properties:

| Field | Description | Required | Default |
|--|--|--|--|
| Name | The pipeline name. |  |  `azure_kusto`|
| tenant_id | The tenant ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| client_id | The application ID from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| client_secret | The client secret key value (password) from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). | :heavy_check_mark: |  |
| managed_identity_client_id | The client ID of the managed identity to use for authentication. | :heavy_check_mark:  |  |
| ingestion_endpoint | Enter the value as described for [Ingestion_Endpoint](#ingestion-uri). | :heavy_check_mark: |  |
| database_name | The name of the database that contains your logs table. | :heavy_check_mark: |  |
| table_name | The name of the table from [Create a target table](#create-a-target-table). | :heavy_check_mark: |  |
| ingestion_mapping_reference | The name of the ingestion mapping from [Create a target table](#create-a-target-table). If you didn't create an ingestion mapping, remove the property from the configuration file. |  |  |
| log_key | Key name of the log content. For instance, `log`. |  | `log` |
| include_tag_key | If enabled, a tag is appended to output.|  | `On` |
| tag_key | The key name of tag. Ignored if `include_tag_key` is false. |  | `tag` |
| include_time_key | A timestamp is appended to output, if enabled. Uses the `time_key` property. |  | `On` |
| time_key | The key name for the timestamp in the log records. Ignored if `include_time_key` false. |  | `timestamp` |
| ingestion_endpoint_connect_timeout | The connection timeout of various Kusto endpoints in seconds. |   | `60` |
| compression_enabled | Sends compressed HTTP payload (gzip) to Kusto, if enabled. |  | `true` |
| ingestion_resources_refresh_interval | The ingestion resources refresh interval of Kusto endpoint in seconds. |  |  |
| workers | The number of [workers](https://docs.fluentbit.io/manual/administration/multithreading#outputs) to perform flush operations for this output. |  | `0` |
| buffering_enabled | If enabled, buffers data into disk before ingesting into Kusto. |  | `Off` |
| buffer_path | Specifies the location of the directory where the buffered data will be stored if `buffering_enabled` is `On`. |  | `/tmp/fluent-bit/azure-kusto/` |
| upload_timeout | Specifies the timeout for uploads if `buffering_enabled` is `On`. Files older than this are ingested even if below size limit. | | `30m` |
| upload_file_size | Specifies the maximum size of a file to be uploaded if `buffering_enabled` is `On`. | | `200MB` |
| azure_kusto_buffer_key | Azure Kusto buffer key to identify plugin instances when `buffering_enabled` is `On`. Required for multiple Azure Kusto outputs with buffering. |  | `key` |
| store_dir_limit_size | The maximum size of the directory where buffered data is stored if `buffering_enabled` is `On`. |  | `8GB` |
| buffer_file_delete_early| When `buffering_enabled` is `On`, whether to delete the buffered file early after successful blob creation. |  | `Off` |
| unify_tag | Creates a single buffer file when `buffering_enabled` is `On`. | | `On` |
| blob_uri_length | Set the length of generated blob URI before ingesting to Kusto. | | `64` |
| scheduler_max_retries | When `buffering_enabled` is `On`, set the maximum number of retries for ingestion using the scheduler. | | `3` |
| delete_on_max_upload_error | When `buffering_enabled` is `On`, whether to delete the buffer file on maximum upload errors. | | `Off` |
| IO_timeout | Configure the HTTP IO timeout for uploads. | | `60s` |

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
    [OUTPUT]
    Match *
    Name azure_kusto
    Tenant_Id <app_tenant_id>
    Client_Id <app_client_id>
    Client_Secret <app_secret>
    Ingestion_Endpoint https://ingest-<cluster>.<region>.kusto.windows.net
    Database_Name <database_name>
    Table_Name <table_name>
    Ingestion_Mapping_Reference <mapping_name>
    ingestion_endpoint_connect_timeout <ingestion_endpoint_connect_timeout>
    compression_enabled <compression_enabled>
    ingestion_resources_refresh_interval <ingestion_resources_refresh_interval>
    buffering_enabled On
    upload_timeout 2m
    upload_file_size 125M
    azure_kusto_buffer_key kusto1
    buffer_file_delete_early Off
    unify_tag On
    buffer_dir /var/log/
    store_dir_limit_size 16GB
    blob_uri_length 128
    scheduler_max_retries 3
    delete_on_max_upload_error Off
    io_timeout 60s
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
        [OUTPUT]
    Match *
    Name azure_kusto
    Tenant_Id <app_tenant_id>
    Client_Id <app_client_id>
    Client_Secret <app_secret>
    Ingestion_Endpoint https://ingest-<cluster>.<region>.kusto.windows.net
    Database_Name <database_name>
    Table_Name <table_name>
    Ingestion_Mapping_Reference <mapping_name>
    ingestion_endpoint_connect_timeout <ingestion_endpoint_connect_timeout>
    compression_enabled <compression_enabled>
    ingestion_resources_refresh_interval <ingestion_resources_refresh_interval>
    buffering_enabled On
    upload_timeout 2m
    upload_file_size 125M
    azure_kusto_buffer_key kusto1
    buffer_file_delete_early Off
    unify_tag On
    buffer_dir /var/log/
    store_dir_limit_size 16GB
    blob_uri_length 128
    scheduler_max_retries 3
    delete_on_max_upload_error Off
    io_timeout 60s
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
