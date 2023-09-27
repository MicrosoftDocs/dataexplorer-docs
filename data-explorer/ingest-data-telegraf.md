---
title: 'Ingest data from Telegraf into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Telegraf.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 04/07/2022

#Customer intent: As an integration developer, I want to build integration pipelines from Telegraf into Azure Data Explorer, so I can make data available for near real-time analytics.
---
# Ingest data from Telegraf into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/). Telegraf is an open source, lightweight, minimal memory foot print agent for collecting, processing and writing telemetry data including logs, metrics, and IoT data. Telegraf supports hundreds of input and output plugins. It's widely used and well supported by the open source community. The Azure Data Explorer [output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) serves as the connector from Telegraf and supports ingestion of data from many types of [input plugins](https://github.com/influxdata/telegraf/tree/master/plugins/inputs) into Azure Data Explorer.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Telegraf](https://portal.influxdata.com/downloads/). Host Telegraf in a virtual machine (VM) or container. Telegraf can be hosted locally where the app or service being monitored is deployed, or remotely on a dedicated monitoring compute/container.

## Supported authentication methods

The plugin supports the following authentication methods:

* Azure Active Directory (Azure AD) applications with app keys or certificates.

    * For information on how to create and register an app in Azure AD, see [Register an application](/azure/active-directory/develop/quickstart-register-app#register-an-application).
    * For information on service principals, see [Application and service principal objects in Azure AD](/azure/active-directory/develop/app-objects-and-service-principals).

* Azure AD user tokens

    * Allows the plugin to authenticate like a user. We only recommend using this method for development purposes.

* Azure Managed Service Identity (MSI) token

    * This is the preferred authentication method if you're running Telegraf in a supporting Azure environment, such as Azure Virtual Machines.

Whichever method you use, the designated principal must be assigned the *Database User* role in Azure Data Explorer. This role allows the plugin to create the tables required for ingesting data. If the plugin is configured with `create_tables=false`, the designated principal must at least have the *Database Ingestor* role.

### Configure authentication method

The plugin checks for specific configurations of environment variables to determine which authentication method to use. The configurations are assessed in the specified order, and the first configuration that detected is used. If a valid configuration isn't detected, the plugin will fail to authenticate.

To configure authentication for the plugin, set the appropriate environment variables for your chosen authentication method:

* **Client credentials (Azure AD application tokens)**: Azure AD application ID and secret.

    * `AZURE_TENANT_ID`: The Azure AD tenant ID used for authentication.
    * `AZURE_CLIENT_ID`: The client ID of an App Registration in the tenant.
    * `AZURE_CLIENT_SECRET`: The client secret that was generated for the App Registration.

* **Client certificate (Azure AD application tokens)**: Azure AD application ID and an X.509 certificate.

    * `AZURE_TENANT_ID`: The Azure AD tenant ID used for authentication.
    * `AZURE_CERTIFICATE_PATH`: A path to certificate and private key pair in PEM or PFX format, which can authenticate the App Registration.
    * `AZURE_CERTIFICATE_PASSWORD`: The password that was set for the certificate.

* **Resource owner password (Azure AD user tokens)**: Azure AD user and password. We don't recommend using this grant type. If you need an interactive sign in, use device login.

    * `AZURE_TENANT_ID`: The Azure AD tenant ID used for authentication.
    * `AZURE_CLIENT_ID`: The client ID of an App Registration in the tenant.
    * `AZURE_USERNAME`: The username, also known as upn, of an Azure Active Directory user account.
    * `AZURE_PASSWORD`: The password of the Azure Active Directory user account. Note this doesn't support accounts with MFA enabled.

* **Azure Managed Service Identity**: Delegate credential management to the platform. This method requires that code is run in Azure, for example, VM. All configuration is handled by Azure. For more information, see [Azure Managed Service Identity](/azure/active-directory/msi-overview). This method is only available when using [Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview).

## Configure Telegraf

Telergraf is a configuration driven agent. To get started, you must install Telegraf and configure the required input and output plugins. The default location of configuration file, is as follows:

* For Windows: *C:\Program Files\Telegraf\telegraf.conf*
* For Linux: *etc/telegraf/telegraf.conf*

To enable the Azure Data Explorer output plugin, you must uncomment the following section in the automatically generated config file:

```ini
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
## Supported ingestion types

The plugin supports managed (streaming) and queued (batching) [ingestion](ingest-data-overview.md#batching-vs-streaming-ingestion). The default ingestion type is *queued*.

> [!IMPORTANT]
> To use managed ingestion, you must enable [streaming ingestion](ingest-data-streaming.md) on your cluster.
    
To configure the ingestion type for the plugin, modify the automatically generated configuration file, as follows:

```ini
  ##  Ingestion method to use.
  ##  Available options are
  ##    - managed  --  streaming ingestion with fallback to batched ingestion or the "queued" method below
  ##    - queued   --  queue up metrics data and process sequentially
  # ingestion_type = "queued"
```

## Query ingested data

The following are examples of data collected using the SQL and syslog input plugins along with the Azure Data Explorer output plugin. For each input method, there's an example of how to use data transformations and queries in Azure Data Explorer.

### SQL input plugin

The following table shows sample metrics data collected by SQL input plugin:

| name | tags | timestamp | fields |
|--|--|--|--|
| sqlserver_database_io | {"database_name":"azure-sql-db2","file_type":"DATA","host":"adx-vm","logical_filename":"tempdev","measurement_db_type":"AzureSQLDB","physical_filename":"tempdb.mdf","replica_updateability":"READ_WRITE","sql_instance":"adx-sql-server"} | 2021-09-09T13:51:20Z | {"current_size_mb":16,"database_id":2,"file_id":1,"read_bytes":2965504,"read_latency_ms":68,"reads":47,"rg_read_stall_ms":42,"rg_write_stall_ms":0,"space_used_mb":0,"write_bytes":1220608,"write_latency_ms":103,"writes":149} |
| sqlserver_waitstats | {"database_name":"azure-sql-db2","host":"adx-vm","measurement_db_type":"AzureSQLDB","replica_updateability":"READ_WRITE","sql_instance":"adx-sql-server","wait_category":"Worker Thread","wait_type":"THREADPOOL"} | 2021-09-09T13:51:20Z | {"max_wait_time_ms":15,"resource_wait_ms":4469,"signal_wait_time_ms":0,"wait_time_ms":4469,"waiting_tasks_count":1464} |

Since the collected metrics object is a complex type, the *fields* and *tags* columns are stored as dynamic data types. There are many ways to query this data, for example:

* **Query JSON attributes directly**: You can query JSON data in raw format without parsing it.

    **Example 1**

    ```kusto
    Tablename
    | where name == "sqlserver_azure_db_resource_stats" and todouble(fields.avg_cpu_percent) > 7
    ```

    **Example 2**

    ```kusto
    Tablename
    | distinct tostring(tags.database_name)
    ```

    > [!NOTE]
    > This approach could impact performance when using large volumes of data. In such cases, use the update policy approach.

* **Use an [update policy](kusto/management/updatepolicy.md)**: Transform dynamic data type columns using an update policy. We recommend this approach for querying large volumes of data.

    ```kusto
    // Function to transform data
    .create-or-alter function Transform_TargetTableName() {
      SourceTableName
      | mv-apply fields on (extend key = tostring(bag_keys(fields)[0]))
      | project fieldname=key, value=todouble(fields[key]), name, tags, timestamp
    }

    // Create destination table with above query's results schema (if it doesn't exist already)
    .set-or-append TargetTableName <| Transform_TargetTableName() | take 0

    // Apply update policy on destination table
    .alter table TargetTableName policy update
    @'[{"IsEnabled": true, "Source": "SourceTableName", "Query": "Transform_TargetTableName()", "IsTransactional": true, "PropagateIngestionProperties": false}]'
    ```

### Syslog input plugin

The following table shows sample metrics data collected by Syslog input plugin:

| name | tags | timestamp | fields |
|--|--|--|--|
| syslog | {"appname":"azsecmond","facility":"user","host":"adx-linux-vm","hostname":"adx-linux-vm","severity":"info"} | 2021-09-20T14:36:44Z | {"facility_code":1,"message":" 2021/09/20 14:36:44.890110 Failed to connect to mdsd: dial unix /var/run/mdsd/default_djson.socket: connect: no such file or directory","procid":"2184","severity_code":6,"timestamp":"1632148604890477000","version":1} |
| syslog | {"appname":"CRON","facility":"authpriv","host":"adx-linux-vm","hostname":"adx-linux-vm","severity":"info"} | 2021-09-20T14:37:01Z | {"facility_code":10,"message":" pam_unix(cron:session): session opened for user root by (uid=0)","procid":"26446","severity_code":6,"timestamp":"1632148621120781000","version":1} |

There are multiple ways to flatten dynamic columns by using the [extend](kusto/query/extendoperator.md) operator or [bag_unpack()](kusto/query/bag-unpackplugin.md) plugin. You can use either of them in the update policy *Transform_TargetTableName()* function.

* **Use the extend operator**: We recommend using this approach as it's faster and robust. Even if the schema changes, it will not break queries or dashboards.

    ```kusto
    Tablename
    | extend facility_code=toint(fields.facility_code), message=tostring(fields.message), procid= tolong(fields.procid), severity_code=toint(fields.severity_code),
    SysLogTimestamp=unixtime_nanoseconds_todatetime(tolong(fields.timestamp)), version= todouble(fields.version),
    appname= tostring(tags.appname), facility= tostring(tags.facility),host= tostring(tags.host), hostname=tostring(tags.hostname), severity=tostring(tags.severity)
    | project-away fields, tags
    ```

* **Use bag_unpack() plugin**: This approach automatically unpacks dynamic type columns. Changing the source schema can cause issues when dynamically expanding columns.

    ```kusto
    Tablename
    | evaluate bag_unpack(tags, columnsConflict='replace_source')
    | evaluate bag_unpack(fields, columnsConflict='replace_source')
    ```
