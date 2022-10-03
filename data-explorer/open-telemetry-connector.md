---
title: Ingest data from OpenTelemetry
description: Learn how to use Azure Data Explorer as an OpenTelemetry sink.
ms.date: 10/03/2022
ms.topic: how-to
ms.reviewer: ramacg
---

# Ingest data from OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/docs/concepts/what-is-opentelemetry/) (OTel) is an open framework for application observability. The instrumentation is hosted by the Cloud Native Computing Foundation (CNCF), which provides standard interfaces for observability data, including [metrics](https://opentelemetry.io/docs/concepts/observability-primer/#reliability--metrics), [logs](https://opentelemetry.io/docs/concepts/observability-primer/#logs), and [traces](https://opentelemetry.io/docs/concepts/observability-primer/#distributed-traces).

The OpenTelemetry exporter supports ingestion of data from many receivers into Azure Data Explorer.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create a cluster and database, Instructions for creating the database and tables are provided in the [readme documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/azuredataexplorerexporter/README.md).

## Supported authentication methods

Azure Active Directory (Azure AD) applications with app keys are supported. To create and register an app in Azure AD, see [Register an application](/azure/active-directory/develop/quickstart-register-app#register-an-application). For information on service principals, see [Application and service principal objects in Azure AD](/azure/active-directory/develop/app-objects-and-service-principals).

> [!NOTE]
> The designated principal must have *Data Ingestor* role-based authorization. For more information, see [role-based authorization](kusto/management/access-control/role-based-authorization.md).

## Set up managed ingestion

???DOES THE USER NEED TO USE STREAMING INGESTION FOR THIS CONNECTOR? WHAT INFORMATION CAN WE GIVE THE USER TO MAKE A DECISION ON WHAT IS BEST IN THIS SCENARIO???

Managed ingestion attempts to use Azure Data Explorer streaming ingestion capabilities, with a fallback to the batched ingestion mode. For more information, see [batching vs streaming ingestion](./ingest-data-overview#batching-vs-streaming-ingestion).

> Note: [Streaming ingestion](./ingest-data-streaming?tabs=azure-portal%2Ccsharp) has to be enabled on Azure Data Explorer [configure the Azure Data Explorer cluster] in case of `managed` option. Refer the query below to check if streaming is enabled:

```kql
.show database <DB-Name> policy streamingingestion
```

## Configure the Azure Data Explorer collector

In order to ingest your OpenTelemetry data into Azure Data Explorer, you need [deploy and run](https://opentelemetry.io/docs/collector/deployment/) the OpenTelemetry distribution with the following Azure Data Explorer exporter configuration.

1. Configure the OTel collector using the following fields:

    |Field | Description | Suggested setting|
    |---|---|---|
    | Exporters| Type of exporter | Azure Data Explorer | 
    |  cluster_uri |   Kusto cluster uri |  https:// &lt;cluster>.kusto.windows.net |
    | application_id |  Client ID|  &lt;application id> |
    | application_key| Client secret |  &lt;application key> |
    | tenant_id | Tenant |  &lt;application tenant>|
    | db_name | Database for the logs | oteldb
    | metrics_table_name | Raw metric table name | OTELMetrics
    | logs_table_name | Raw log table name | OTELLogs
    | traces_table_name | Raw traces table name | OTELTraces
    | ingestion_type | Type of ingestion: managed or queued | managed
    | otelmetrics_mapping | Optional mappings that can be provided and defined in Azure Data Explorer | &lt;json metrics_table_name mapping>
    | otellogs_mapping | Optional mappings that can be provided and defined in Azure Data Explorer | &lt;json logs_table_name mapping>
    | oteltraces_mapping | Optional mappings that can be provided and defined in Azure Data Explorer |&lt;json traces_table_name mapping>
    | logLevel |  | info
    | extensions | Services: extension components to enable | [pprof, zpages, health_check]
    | traces | Services: traces components to enable   |  receivers: [otlp] <br> processors: [batch] <br> exporters: [azuredataexplorer]
    | metrics | Services: metrics components to enable | receivers: [otlp] <br> processors: [batch] <br> exporters: [logging, azuredataexplorer]
    | logs | Services: logs components to enable | receivers: [otlp] <br> processors: [batch] <br> exporters: [ azuredataexplorer]
    

1. Use the "--config" flag to run the OpenTelemetry collector.

### Example configuration

The following is an example configuration for the OTel collector:

```yaml
exporters:
  azuredataexplorer:
    cluster_uri: "https://CLUSTER.kusto.windows.net"
    application_id: "<application id>"
    application_key: "<application key>"
    tenant_id: "<application tenant>"
    db_name: "oteldb"
    metrics_table_name: "OTELMetrics"
    logs_table_name: "OTELLogs"
    traces_table_name: "OTELTraces"
    ingestion_type : "managed"
    otelmetrics_mapping : "<json metrics_table_name mapping>"
		otellogs_mapping  : "<json logs_table_name mapping>"
		oteltraces_mapping  : "<json traces_table_name mapping>"
  logging:
    logLevel: info
service:
  extensions: [pprof, zpages, health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [azuredataexplorer]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging, azuredataexplorer]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [ azuredataexplorer]
```

## Collect data with a sample application

Set up the sample [spring pet clinic](https://github.com/spring-projects/spring-petclinic) application with the java OTeL collector agent. The agent can be downloaded from the releases of [Open telemetry collector agent](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases).

```sh
OTEL_SERVICE_NAME=pet-clinic-service 
OTEL_TRACES_EXPORTER=otlp 
OTEL_LOGS_EXPORTER=otlp  
OTEL_EXPORTER_OTLP_ENDPOINT=http://<open-telemetry-collector-host>:4317 
java -javaagent:./opentelemetry-javaagent.jar -jar spring-petclinic-<version>-SNAPSHOT.jar
```

## Query incoming data

Once the application is run and the default tables are set up, the following queries can be executed: 

* __Metrics__

  The following are some sample metrics exported from the sample spring application. Metrics could be any type supported by the OTEL metrics specification.

  ```kql
  OTELMetrics|take 2
  ```

* __Logs__

    |Timestamp           |MetricName                 |MetricType|MetricUnit|MetricDescription                                                  |MetricValue|Host           |MetricAttributes                                                                                                                                                                                                                   |ResourceAttributes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    |--------------------|---------------------------|----------|----------|-------------------------------------------------------------------|-----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    |2022-07-01T12:55:33Z|http.server.active_requests|Sum       |requests  |The number of concurrent HTTP requests that are currently in-flight|0          |DESKTOP-SFS7RUQ|{"http.flavor":"1.1", "http.host":"localhost:8080", "scope.name":"io.opentelemetry.tomcat-7.0", "scope.version":"1.14.0-alpha", "http.method":"GET", "http.scheme":"http"}                                                              |{"host.name":"DESKTOP-SFS7RUQ", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "process.runtime.version":"18.0.1.1+2-6", "telemetry.sdk.language":"java", "host.arch":"amd64", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.auto.version":"1.14.0", "telemetry.sdk.name":"opentelemetry", "os.type":"windows", "os.description":"Windows 11 10.0", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.pid":5980, "service.name":"my-service", "telemetry.sdk.version":"1.14.0"}|
    |2022-07-01T12:55:33Z|http.server.duration_sum   |Histogram |ms        |The duration of the inbound HTTP request(Sum total of samples)     |114.9881   |DESKTOP-SFS7RUQ|{"http.flavor":"1.1", "http.host":"localhost:8080", "scope.name":"io.opentelemetry.tomcat-7.0", "scope.version":"1.14.0-alpha", "http.method":"GET", "http.scheme":"http", "http.route":"/owners/find", "http.status_code":200}           |{"host.name":"DESKTOP-SFS7RUQ", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "process.runtime.version":"18.0.1.1+2-6", "telemetry.sdk.language":"java", "host.arch":"amd64", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.auto.version":"1.14.0", "telemetry.sdk.name":"opentelemetry", "os.type":"windows", "os.description":"Windows 11 10.0", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.pid":5980, "service.name":"my-service", "telemetry.sdk.version":"1.14.0"}|

  Sample log statements exported from the sample spring application. Depending on the application configuration, all logs with severity INFO and up are exported into the Azure Data Explorer table.
  ```kql
  OTELLogs|take 2
  ```

* __Traces__

  |Timestamp           |TraceId|SpanId|SeverityText|SeverityNumber|Body                                                                                                                                                                                                                                                                      |ResourceAttributes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |LogsAttributes                                                             |
  |--------------------|-------|------|------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
  |2022-07-01T13:00:39Z|       |      |INFO        |9             |Starting PetClinicApplication v2.7.0-SNAPSHOT using Java 18.0.1.1 on DESKTOP-SFS7RUQ with PID 37280 (C:\Users\adxuser\Documents\Repos\spring-petclinic\target\spring-petclinic-2.7.0-SNAPSHOT.jar started by adxuser in C:\Users\adxuser\Documents\Repos\spring-petclinic)|{"host.name":"DESKTOP-SFS7RUQ", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.pid":37280, "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.sdk.name":"opentelemetry", "os.type":"windows", "process.runtime.version":"18.0.1.1+2-6", "telemetry.sdk.language":"java", "telemetry.sdk.version":"1.14.0", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "os.description":"Windows 11 10.0", "service.name":"my-service", "telemetry.auto.version":"1.14.0", "host.arch":"amd64"}|{"scope.name":"org.springframework.samples.petclinic.PetClinicApplication"}|
  |2022-07-01T13:00:39Z|       |      |INFO        |9             |No active profile set, falling back to 1 default profile: "default"                                                                                                                                                                                                       |{"host.name":"DESKTOP-SFS7RUQ", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.pid":37280, "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.sdk.name":"opentelemetry", "os.type":"windows", "process.runtime.version":"18.0.1.1+2-6", "telemetry.sdk.language":"java", "telemetry.sdk.version":"1.14.0", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "os.description":"Windows 11 10.0", "service.name":"my-service", "telemetry.auto.version":"1.14.0", "host.arch":"amd64"}|{"scope.name":"org.springframework.samples.petclinic.PetClinicApplication"}|


  Sample traces statements exported from the sample spring application. Application(s) can export traces / spans that can be correlated using TraceId as per OTEL traces specification.
  ```kql
  OTELTraces|take 2
  ```

  |TraceId             |SpanId          |ParentId|SpanName|SpanStatus|SpanKind                                                                                                                                                                                                                                                                  |StartTime                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |EndTime                                                                    |ResourceAttributes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |TraceAttributes                                                                                                                                                                                                                                                                 |Events|Links|
  |--------------------|----------------|--------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|-----|
  |573c0e4e002a9f7281f6d63eafe4ef87|dab70d0ba8902c5e|        |87d003d6-02c1-4f3d-8972-683243c35642|STATUS_CODE_UNSET|SPAN_KIND_CLIENT                                                                                                                                                                                                                                                          |2022-07-01T13:17:59Z                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |2022-07-01T13:17:59Z                                                       |{"telemetry.auto.version":"1.14.0", "os.description":"Windows 11 10.0", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "service.name":"my-service", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.sdk.language":"java", "telemetry.sdk.name":"opentelemetry", "host.arch":"amd64", "host.name":"DESKTOP-SFS7RUQ", "process.pid":34316, "process.runtime.version":"18.0.1.1+2-6", "os.type":"windows", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "telemetry.sdk.version":"1.14.0"}|{"db.user":"sa", "thread.id":1, "db.name":"87d003d6-02c1-4f3d-8972-683243c35642", "thread.name":"main", "db.system":"h2", "scope.name":"io.opentelemetry.jdbc", "scope.version":"1.14.0-alpha", "db.connection_string":"h2:mem:", "db.statement":"DROP TABLE vet_specialties IF EXISTS"}|[]    |[]   |
  |84a9a8c4009d91476da02dfa40746c13|3cd4c0e91717969a|        |87d003d6-02c1-4f3d-8972-683243c35642|STATUS_CODE_UNSET|SPAN_KIND_CLIENT                                                                                                                                                                                                                                                          |2022-07-01T13:17:59Z                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |2022-07-01T13:17:59Z                                                       |{"telemetry.auto.version":"1.14.0", "os.description":"Windows 11 10.0", "process.executable.path":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe", "process.runtime.description":"Oracle Corporation Java HotSpot(TM) 64-Bit Server VM 18.0.1.1+2-6", "service.name":"my-service", "process.runtime.name":"Java(TM) SE Runtime Environment", "telemetry.sdk.language":"java", "telemetry.sdk.name":"opentelemetry", "host.arch":"amd64", "host.name":"DESKTOP-SFS7RUQ", "process.pid":34316, "process.runtime.version":"18.0.1.1+2-6", "os.type":"windows", "process.command_line":"C:\\Program Files\\Java\\jdk-18.0.1.1;bin;java.exe -javaagent:./opentelemetry-javaagent.jar", "telemetry.sdk.version":"1.14.0"}|{"db.user":"sa", "thread.id":1, "db.name":"87d003d6-02c1-4f3d-8972-683243c35642", "thread.name":"main", "db.system":"h2", "scope.name":"io.opentelemetry.jdbc", "scope.version":"1.14.0-alpha", "db.connection_string":"h2:mem:", "db.statement":"DROP TABLE vets IF EXISTS"}           |[]    |[]   |

## Next steps

* [KQL quick reference](kql-quick-reference.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)