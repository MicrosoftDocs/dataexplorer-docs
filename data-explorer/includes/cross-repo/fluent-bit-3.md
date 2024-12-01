---
ms.topic: include
ms.date: 12/01/2024
---
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
    tenant_id <app_tenant_id>
    client_id <app_client_id>
    client_secret <app_secret>
    ingestion_endpoint <ingestion_endpoint>
    database_name <database_name>
    table_name <table_name>
    ingestion_mapping_reference <mapping_name>
    ingestion_endpoint_connect_timeout <ingestion_endpoint_connect_timeout>
    compression_enabled <compression_enabled>
    ingestion_resources_refresh_interval <ingestion_resources_refresh_interval>
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
        tenant_id <app_tenant_id>
        client_id <app_client_id>
        client_secret <app_secret>
        ingestion_endpoint <ingestion_endpoint>
        database_name <database_name>
        table_name <table_name>
        ingestion_mapping_reference <mapping_name>
        ingestion_endpoint_connect_timeout <ingestion_endpoint_connect_timeout>
        compression_enabled <compression_enabled>
        ingestion_resources_refresh_interval <ingestion_resources_refresh_interval>
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