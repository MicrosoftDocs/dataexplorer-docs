---
ms.topic: include
ms.date: 06/27/2024
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