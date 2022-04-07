---
title: 'Ingest data from Telegraf into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Telegraf.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 11/08/2021
 
#Customer intent: As an integration developer, I want to build integration pipelines from Telegraf into Azure Data Explorer, so I can make data available for near real time analytics.
---
# Ingest data from Telegraf into Azure Data Explorer
 
Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/). Telegraf is an opensource, lightweight, minimal memory foot print agent for collecting, processing and writing telemetry data (including logs, metrics, and IoT data). Telegraf supports hundreds of input and output plugins. It is widely used and very well supported by the open source community. The Azure Data Explorer [output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) serves as the connector from Telegraf and supports ingestion of data from any of these [input plugins](https://github.com/influxdata/telegraf/tree/master/plugins/inputs) into Azure Data Explorer. Download the telegraf binary from [here](https://portal.influxdata.com/downloads/).

## Pre-requisites

- [Create Azure Data Explorer cluster and database](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-portal)
- VM or container to host Telegraf - it could be hosted locally where an app/service to be monitored is deployed or remotely on a dedicated monitoring compute/container.

## Authentiation
### Supported Authentication Methods

This plugin provides several types of authentication. The plugin will check the existence of several specific environment variables, and consequently will choose the right method.

These methods are:

1. AAD Application Tokens (Service Principals with secrets or certificates).

    For guidance on how to create and register an App in Azure Active Directory check [this article](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application), and for more information on the Service Principals check [this article](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals).

2. AAD User Tokens

    - Allows Telegraf to authenticate like a user. This method is mainly used for development purposes only.

3. Managed Service Identity (MSI) token

    - If you are running Telegraf from Azure VM, then this is the prefered authentication method.

[principal]: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects

Whichever method, the designated principal needs to be assigned the `Database User` role in the Azure Data Explorer. This role will
allow the plugin to create the required tables and ingest data into it.
If `create_tables=false` then the designated principal needs `Database Ingestor` role at least.

### Configurations of the chosen Authentication Method

The plugin will authenticate using the first available of the
following configurations, **it's important to understand that the assessment, and consequently choosing the authentication method, will happen in order as below**:

1. **Client Credentials**: Azure AD Application ID and Secret.

    Set the following environment variables:

    - `AZURE_TENANT_ID`: Specifies the Tenant to which to authenticate.
    - `AZURE_CLIENT_ID`: Specifies the app client ID to use.
    - `AZURE_CLIENT_SECRET`: Specifies the app secret to use.

2. **Client Certificate**: Azure AD Application ID and X.509 Certificate.

    - `AZURE_TENANT_ID`: Specifies the Tenant to which to authenticate.
    - `AZURE_CLIENT_ID`: Specifies the app client ID to use.
    - `AZURE_CERTIFICATE_PATH`: Specifies the certificate Path to use.
    - `AZURE_CERTIFICATE_PASSWORD`: Specifies the certificate password to use.

3. **Resource Owner Password**: Azure AD User and Password. This grant type is
   *not recommended*, use device login instead if you need interactive login.

    - `AZURE_TENANT_ID`: Specifies the Tenant to which to authenticate.
    - `AZURE_CLIENT_ID`: Specifies the app client ID to use.
    - `AZURE_USERNAME`: Specifies the username to use.
    - `AZURE_PASSWORD`: Specifies the password to use.

4. **Azure Managed Service Identity**: Delegate credential management to the
   platform. Requires that code is running in Azure, e.g. on a VM. All
   configuration is handled by Azure. See [Azure Managed Service Identity][msi]
   for more details. Only available when using the [Azure Resource Manager][arm].

[msi]: https://docs.microsoft.com/en-us/azure/active-directory/msi-overview
[arm]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview


## Telegraf Configurations

Telergraf is a completely configuration driven agent. To get started, you just need to install telegraf binary and configure needed input and output plugins in the telegraf.config file. The default location of telegraf.conf file is "C:\Program Files\Telegraf\telegraf.conf" on windows and "etc/telegraf/telegraf.conf" on linux system.
To enable Azure Data Explorer output plugin, you need to uncomment following section in the automatically generated config file -

```toml
[[outputs.azure_data_explorer]]
  ## The URI property of the Azure Data Explorer resource on Azure
  ## ex: https://myadxresource.australiasoutheast.kusto.windows.net
  # endpoint_url = ""

  ## The Azure Data Explorer database that the metrics will be ingested into.
  ## The plugin will NOT generate this database automatically, it's expected that this database already exists before ingestion.
  ## ex: "exampledatabase"
  # database = ""

  ## Timeout for Azure Data Explorer operations, default value is 20 seconds
  # timeout = "20s"

  ## Type of metrics grouping used when ingesting to Azure Data Explorer
  ## Default value is "TablePerMetric" which means there will be one table for each metric
  # metrics_grouping_type = "TablePerMetric"

  ## Name of the single table to store all the metrics (Only needed if metrics_grouping_type is "SingleTable").
  # table_name = ""

  ## Creates tables and relevant mapping if set to true(default).
  ## Skips table and mapping creation if set to false, this is useful for running telegraf with the least possible access permissions i.e. table ingestor role.
  # create_tables = true
```

## Querying data ingested in Azure Data Explorer

This section has examples of data collected using SQL and syslog telegraf input plugins along with Azure Data Explorer output plugin, and details on data transformations and queries in Azure Data Explorer -

### SQL input plugin

Sample metrics data collected by SQL input plugin -

name | tags | timestamp | fields
-----|------|-----------|-------
sqlserver_database_io|{"database_name":"azure-sql-db2","file_type":"DATA","host":"adx-vm","logical_filename":"tempdev","measurement_db_type":"AzureSQLDB","physical_filename":"tempdb.mdf","replica_updateability":"READ_WRITE","sql_instance":"adx-sql-server"}|2021-09-09T13:51:20Z|{"current_size_mb":16,"database_id":2,"file_id":1,"read_bytes":2965504,"read_latency_ms":68,"reads":47,"rg_read_stall_ms":42,"rg_write_stall_ms":0,"space_used_mb":0,"write_bytes":1220608,"write_latency_ms":103,"writes":149}
sqlserver_waitstats|{"database_name":"azure-sql-db2","host":"adx-vm","measurement_db_type":"AzureSQLDB","replica_updateability":"READ_WRITE","sql_instance":"adx-sql-server","wait_category":"Worker Thread","wait_type":"THREADPOOL"}|2021-09-09T13:51:20Z|{"max_wait_time_ms":15,"resource_wait_ms":4469,"signal_wait_time_ms":0,"wait_time_ms":4469,"waiting_tasks_count":1464}

Since collected metrics object is of complex type so "fields" and "tags" are stored as dynamic data type, multiple ways to query this data-

1. Query JSON attributes directly: Azure Data Explorer provides an ability to query JSON data in raw format without parsing it, so JSON attributes can be queried directly in following way:

  ```text
  Tablename
  | where name == "sqlserver_azure_db_resource_stats" and todouble(fields.avg_cpu_percent) > 7
  ```

  ```text
  Tablename
  | distinct tostring(tags.database_name)
  ```

  **Note** - This approach could have performance impact in case of large volumes of data, use belwo mentioned approach for such cases.

1. Use [Update policy](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/updatepolicy)**: Transform dynamic data type columns using update policy. This is the recommended performant way for querying over large volumes of data compared to querying directly over JSON attributes:

  ```
  // Function to transform data
  .create-or-alter function Transform_TargetTableName() {
        SourceTableName
        | mv-apply fields on (extend key = tostring(bag_keys(fields)[0]))
        | project fieldname=key, value=todouble(fields[key]), name, tags, timestamp
  }

  // Create destination table with above query's results schema (if it doesn't exist already)
  .set-or-append TargetTableName <| Transform_TargetTableName() | limit 0

  // Apply update policy on destination table
  .alter table TargetTableName policy update
  @'[{"IsEnabled": true, "Source": "SourceTableName", "Query": "Transform_TargetTableName()", "IsTransactional": true, "PropagateIngestionProperties": false}]'
  ```

### Syslog input plugin

Sample logs collected using Syslog input plugin -

name | tags | timestamp | fields
-----|------|-----------|-------
syslog|{"appname":"azsecmond","facility":"user","host":"adx-linux-vm","hostname":"adx-linux-vm","severity":"info"}|2021-09-20T14:36:44Z|{"facility_code":1,"message":" 2021/09/20 14:36:44.890110 Failed to connect to mdsd: dial unix /var/run/mdsd/default_djson.socket: connect: no such file or directory","procid":"2184","severity_code":6,"timestamp":"1632148604890477000","version":1}
syslog|{"appname":"CRON","facility":"authpriv","host":"adx-linux-vm","hostname":"adx-linux-vm","severity":"info"}|2021-09-20T14:37:01Z|{"facility_code":10,"message":" pam_unix(cron:session): session opened for user root by (uid=0)","procid":"26446","severity_code":6,"timestamp":"1632148621120781000","version":1}

There are multiple ways to flatten dynamic columns using 'extend' or 'bag_unpack' operator. You can use either of these ways in above mentioned update policy function - 'Transform_TargetTableName()'

- Use [extend](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/extendoperator) operator - This is the recommended approach compared to 'bag_unpack' as it is faster and robust. Even if schema changes, it will not break queries or dashboards.

  ```text
  Tablenmae
  | extend facility_code=toint(fields.facility_code), message=tostring(fields.message), procid= tolong(fields.procid), severity_code=toint(fields.severity_code),
  SysLogTimestamp=unixtime_nanoseconds_todatetime(tolong(fields.timestamp)), version= todouble(fields.version),
  appname= tostring(tags.appname), facility= tostring(tags.facility),host= tostring(tags.host), hostname=tostring(tags.hostname), severity=tostring(tags.severity)
  | project-away fields, tags
  ```

- Use [bag_unpack plugin](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/bag-unpackplugin) to unpack the dynamic type columns automatically. This method could lead to issues if source schema changes as its dynamically expanding columns.

  ```text
  Tablename
  | evaluate bag_unpack(tags, columnsConflict='replace_source')
  | evaluate bag_unpack(fields, columnsConflict='replace_source')
  ```
