---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/02/2023
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## July 2023

**API**

| Article title | Description |
|--|--|
| [Connection strings overview](kusto/api/connection-strings/index.md)| Updated article. Privacy and security measures added.|
|[SQL external table authentication methods](kusto/api/connection-strings/sql-authentication-methods.md)| Updated article. Refreshed supported authentication methods for SQL external tables.|

**General** 

| Article title | Description |
|--|--|
| [Query data using MATLAB](query-matlab.md)| New article. Describes how to query data from Azure Data Explorer using MATLAB.|
| [Migration guide: Elasticsearch to Azure Data Explorer](migrate-elasticsearch-to-azure-data-explorer.md)| New article. Describes how to migrate your Elasticsearch data to Azure Data Explorer by using Logstash.|
| [Visualize data from Azure Data Explorer in Grafana](grafana.md)| Updated article. Describes how to visualize data from Azure Data Explorer in Managed Grafana.|

**Management**

| Article title | Description |
|--|--|
[Data mappings](kusto/management/mappings.md)| Updated article. Added supported data formats for mapping transformations in EngineV3.|
|- [Export data to SQL](kusto/management/data-export/export-data-to-sql.md) <br/> - [Create and alter SQL external tables](kusto/management/external-sql-tables.md)| Updated articles. Supported authentication methods and parameters added.| 

**Query**

| Article title | Description |
|--|--|
|- [punycode_domain_from_string()](kusto/query/punycode-domain-from-string.md) <br/> - [punycode_domain_to_string()](kusto/query/punycode-domain-to-string.md)| New articles. Describes how to encode and decode a punycode domain name.|
| [geo_line_to_s2cells()](kusto/query/geo-line-to-s2cells-function.md)| New article. Describes how to use the geo_line_to_2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.|
| [extract_json()](kusto/query/extractjsonfunction.md)| Updated article. New example added.|
| [Pivot chart](kusto/query/visualization-pivotchart.md)| Updated article. New example added.|

## June 2023

**API**

| Article title | Description |
|--|--|
|- [Kusto.Language Overview](kusto/api/netfx/about-kusto-language.md) <br/> - [Define schemas for semantic analysis with Kusto.Language](kusto/api/netfx/kusto-language-define-schemas.md) <br/> - [Parse queries and commands with Kusto.Language](kusto/api/netfx/kusto-language-parse-queries.md)| New articles. Describes how to use the Kusto.Language library for parsing queries.|
|[Management commands: Create an app to run management commands](kusto/api/get-started/app-management-commands.md)| New article. Describes how to create an app to run management commands using Kusto client libraries.|

**Query**

| Article title| Description|
|--|--|
|- [Join operator](kusto/query/joinoperator.md) <br/> - [fullouter join](kusto/query/join-fullouter.md) <br/> - [inner join](kusto/query/join-inner.md) <br/> - [innerunique join](kusto/query/join-innerunique.md) <br/> - [leftanti join](kusto/query/join-leftanti.md) <br/> - [leftouter join](kusto/query/join-leftouter.md) <br/> - [leftsemi join](kusto/query/join-leftsemi.md) <br/> - [rightanti join](kusto/query/join-rightanti.md) <br/> - [rightouter join](kusto/query/join-rightouter.md) <br/> - [rightsemi join](kusto/query/join-rightsemi.md) | Updated and new articles. Refreshed `join` overview and added topics describing each `join` kind.
|[replace_strings()](kusto/query/replace-strings-function.md) | New article. Describes how to use the replace_strings() function to replace multiple string matches with multiple replacement strings.|

## May 2023

**General**

| Article title | Description |
|--|--|
|- [Azure Data Explorer web UI query overview](web-ui-query-overview.md) <br/> - [Add a cluster connection in the Azure Data Explorer web UI](add-cluster-connection.md) <br/> - [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md) <br/> - [Share queries from Azure Data Explorer web UI](web-share-queries.md)| New articles. Describes how to use the Azure Data Explorer web UI to interact with your data.|
|[Ingest data with the NLog sink into Azure Data Explorer](nlog-sink.md)| New article. Describes how to use the Azure Data Explorer NLog connector to ingest data into your cluster.|
|[How to architect a multi-tenant solution with Azure Data Explorer](multi-tenant.md)| New article. Describes how to architect a multi-tenant solution in Azure Data Explorer.|
|[Create an Event Hubs data connection for Azure Data Explorer](create-event-hubs-connection.md)| Updated article. Integration from Azure Event Hubs page added.|
|[Install the Azure Data Explorer Kusto emulator](kusto-emulator-install.md)| Updated article. Describes how to install the Kusto emulator using a Linux Docker container image.|
|[Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)| Updated article. Funnel chart visualization added.|
|[Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md)| Updated article. Refreshed content.|

**Management**

| Article title | Description |
|--|--|
|[Create and alter delta external tables on Azure Storage](kusto/management/external-tables-azurestorage-deltalake.md)| New article. Describes how to create and alter delta external tables on Azure Storage.|

**Query**

| Article title | Description |
|--|--|
|[postgresql_request plugin](kusto/query/postgresql-request-plugin.md)| New article. Describes how to use the postgresql_request plugin to send a SQL query to a PostgreSql server network endpoint.|
|[Treemap](kusto/query/visualization-treemap.md)| New article. Describes how to use the treemap visualization to visualize data.|
|[geo_info_from_ip_address()](kusto/query/geo-info-from-ip-address-function.md)| New article. Describes how to use the geo_info_from_ip_address() function to retrieve geolocation information about IPv4 or IPv6 addresses.|
|[bag_zip()](kusto/query/bag-zip.md)| New article. Describes how to use the bag_zip() function to merge two dynamic arrays into a single property-bag of keys and values.|

## April 2023

**API**

| Article title | Description |
|--|--|
| - [Set up your development environment to use Kusto client libraries](kusto/api/get-started/app-set-up.md)<br/>- [Hello Kusto: Create your first Kusto client app](kusto/api/get-started/app-hello-kusto.md)<br/> - [Basic query: Create an app to run basic queries](kusto/api/get-started/app-basic-query.md) | New articles. Describes how to write code with SDKs.|

**General**

| Article title | Description |
|--|--|
|[Azure Data Explorer web UI results grid](web-results-grid.md)| Updated article. New features added.|

**Functions library**

| Article title | Description |
|--|--|
|- [log_reduce_fl()](kusto/functions-library/log-reduce-fl.md) <br/> - [log_reduce_full_fl()](kusto/functions-library/log-reduce-full-fl.md) <br/> - [log_reduce_predict_fl()](kusto/functions-library/log-reduce-predict-fl.md) <br/> - [log_reduce_predict_full_fl()](kusto/functions-library/log-reduce-predict-full-fl.md) <br/> - [log_reduce_train_fl()](kusto/functions-library/log-reduce-train-fl.md)| New articles. Describes how to find common patterns in textual logs. |

**Management**

| Article title | Description |
|--|--|
|[Use a managed identity to run a continuous export job](kusto/management/data-export/continuous-export-with-managed-identity.md)| New article. Describes how to use a managed identity for continuous export.

**Query**

| Article title | Description |
|--|--|
|- [punycode_from_string()](kusto/query/punycode-from-string.md) <br/> - [punycode_to_string()](kusto/query/punycode-to-string.md)| New articles. Describes how to encode and decode Punycode.|

## March 2023

**General**

| Article title | Description |
|--|--|
|[Python plugin packages for Azure Data Explorer](python-package-reference.md)| New article. Lists the available Python packages in the Azure Data Explorer Python plugin.|
|- [Ingest data with the Serilog sink into Azure Data Explorer](serilog-sink.md) <br/> - [Ingest data with the Apache log4J 2 connector](apache-log4j2-connector.md)| New articles. Describe how to ingest data into Azure Data Explorer using the Serilog sink, and the Apache Log4j 2 connectors. |
|[Manage Event Hubs data connections in your free Azure Data Explorer cluster](start-for-free-event-hubs.md)| New article. Describes how to manage Azure Event Hubs data connections in a free Azure Data Explorer cluster. |
| [Manage language extensions in your Azure Data Explorer cluster](language-extensions.md) | Updated article. Steps added for changing the Python language extensions image in an Azure Data Explorer cluster. |

**Management**

| Article title | Description |
|--|--|
| [Manage view access to tables in Azure Data Explorer](kusto/management/manage-table-view-access.md) | New article. Describes how to grant access to tables in Azure Data Explorer. |
|- [Materialized views](kusto/management/materialized-views/materialized-view-overview.md) <br/> - [.show materialized-view(s)](kusto/management/materialized-views/materialized-view-show-command.md) <br/> - [.show materialized-view extents](kusto/management/materialized-views/materialized-view-show-extents-command.md) <br/> - [.show materialized-view failures](kusto/management/materialized-views/materialized-view-show-failures-command.md) <br/> - [.show materialized-view schema](kusto/management/materialized-views/materialized-view-show-schema-command.md) <br/> - [.alter materialized-view autoUpdateSchema](kusto/management/materialized-views/materialized-view-alter-autoupdateschema.md) <br/> - [.alter materialized-view docstring](kusto/management/materialized-views/materialized-view-alter-docstring.md) <br/> - [.alter materialized-view folder](kusto/management/materialized-views/materialized-view-alter-folder.md) <br/> - [.alter materialized-view lookback](kusto/management/materialized-views/materialized-view-alter-lookback.md) <br/> - [.alter materialized-view](kusto/management/materialized-views/materialized-view-alter.md) <br/> - [.clear materialized-view data](kusto/management/materialized-views/materialized-view-clear-data.md) <br/> - [.create-or-alter materialized-view](kusto/management/materialized-views/materialized-view-create-or-alter.md) <br/> - [.create materialized-view](kusto/management/materialized-views/materialized-view-create.md) <br/> - [.drop materialized-view](kusto/management/materialized-views/materialized-view-drop.md) <br/> - [.disable .enable materialized-view](kusto/management/materialized-views/materialized-view-enable-disable.md) <br/> - [.rename materialized-view](kusto/management/materialized-views/materialized-view-rename.md) <br/> - [.show materialized view details](kusto/management/materialized-views/materialized-view-show-details-command.md) | New and updated articles. Describe materialized-view commands. Parameters and examples added.|
|- [.alter extent tags](kusto/management/alter-extent.md) <br/> - [.drop extent tags](kusto/management/drop-extent-tags.md) <br/> - [.move extents](kusto/management/move-extents.md) <br/> - [.replace extents](kusto/management/replace-extents.md) <br/> | Updated articles. Command syntax updated.|

**Query**

| Article title | Description |
|--|--|
|- [Kusto.Explorer code features](kusto/tools/kusto-explorer-code-features.md) <br/> - [Kusto Explorer options](kusto/tools/kusto-explorer-options.md) <br/> - [Kusto.Explorer keyboard shortcuts (hot-keys)](kusto/tools/kusto-explorer-shortcuts.md) <br/> - [Using Kusto.Explorer](kusto/tools/kusto-explorer-using.md) <br/> - [Kusto.Explorer installation and user interface](kusto/tools/kusto-explorer.md) | Updated articles. Refreshed content.|

## February 2023

**API**

| Article title | Description |
|--|--|
| [Authentication over HTTPS](kusto/api/rest/authentication.md)| Updated article.  REST API authorization examples added. |

**General**

| Article title | Description |
|--|--|
|[Manage Azure Data Explorer cluster locks to prevent accidental deletion in your cluster](manage-cluster-locks.md)| New article. Describes how to manage cluster locks to prevent accidental deletion of data using the Azure portal.|
|[Connect from common apps](connect-common-apps.md) | New article. Describes how to connect to Azure Data Explorer with SQL Server emulation from various apps.|
|- [Connect to Azure Data Explorer with JDBC](connect-jdbc.md) <br/> - [Connect to Azure Data Explorer with SQL Server emulation](sql-server-emulation-overview.md) <br/> - [Connect to Azure Data Explorer with ODBC](connect-odbc.md) | New articles. Describes how to connect to Azure Data Explorer with different connection apps.|
|[Azure Data Explorer as a linked server from SQL Server](linked-server.md)| New article. Describes how to connect Azure Data Explorer as a linked server from SQL Server.|
|[Set timeout limits](set-timeout-limits.md)| New article. Describes how to set query timeout limits.|
|[Data connectors overview](connector-overview.md)| New article. Describes available data connectors and their capabilities.|
|- [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md) <br/> - [Azure Data Explorer web UI results grid](web-results-grid.md) <br/> - [Share queries from Azure Data Explorer web UI](web-share-queries.md) <br/> - [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md) <br/> - [Explore the samples gallery](web-ui-samples-query.md) | New articles. Describes how to use, query, visualize, and share queries in the Azure Data Explorer web UI.|
|[Query data using T-SQL](t-sql.md)| Updated article. Support limitations added.|
|[What is the ingestion wizard?](ingest-data-wizard.md) | Updated article. Management actions added.|

## January 2023

**General**

| Article title | Description |
|--|--|
|- [Allow cross-tenant queries and commands](kusto/access-control/cross-tenant-query-and-commands.md) <br/> - [Referencing security principals](./kusto/management/access-control/referencing-security-principals.md) | Updated articles. Renewed and restructured referencing of security principals and identity providers.|

**Functions library**

| Article title | Description |
|--|--|
|- [plotly_anomaly_fl()](./kusto/functions-library/plotly-anomaly-fl.md) <br/> - [plotly_scatter3d_fl()](./kusto/functions-library/plotly-scatter3d-fl.md) | New articles. Describes how to customize a plotly template. |

**Management**

| Article title | Description |
|--|--|
|- [.dup-next-failed-ingest](./kusto/management/dup-next-failed-ingest.md) <br/> - [.dup-next-ingest](./kusto/management/dup-next-ingest.md) | New articles. Describes how to troubleshoot data on demand. |

**Query**

| Article title | Description |
|--|--|
| - [render operator](./kusto/query/renderoperator.md)<br />- [Anomaly chart](kusto/query/visualization-anomalychart.md) <br/> - [Area chart](kusto/query/visualization-areachart.md) <br/> - [Bar chart](kusto/query/visualization-barchart.md) <br/> - [Card](kusto/query/visualization-card.md) <br/> - [Column chart](kusto/query/visualization-columnchart.md) <br/> - [Ladder chart](kusto/query/visualization-ladderchart.md) <br/> - [Line chart](kusto/query/visualization-linechart.md) <br/> - [Pie chart](kusto/query/visualization-piechart.md) <br/> - [Pivot chart](kusto/query/visualization-pivotchart.md) <br/> - [Scatter chart](kusto/query/visualization-scatterchart.md) <br/> - [Stacked area chart](kusto/query/visualization-stackedareachart.md) <br/> - [Table](kusto/query/visualization-table.md) <br/> - [Time chart](kusto/query/visualization-timechart.md) <br/> - [Time pivot](kusto/query/visualization-timepivot.md) | Updated and new articles. Refreshed render overview and added topics describing each render visualization. |
| [series_dot_product()](./kusto/query/series-dot-productfunction.md) | New article. Describes how to calculate the dot product of two numeric series.|
| [hll_if() (aggregation function)](./kusto/query/hll-if-aggregation-function.md) | New article. Describes how to calculate the intermediate results of the `dcount()` function. |
| [bag_set_key()](./kusto/query/bag-set-key-function.md) | New article. Describes how to set a given key to a given value in a dynamic property bag. |

## December 2022

**General**

| Article title | Description |
|--|--|
|[Find an Azure Data Explorer partner](find-my-partner.md) | New article. Describes the Azure Data Explorer Find My Partner Program.|
|[Manage Azure Data Explorer cluster permissions](manage-cluster-permissions.md)| New article. Describes how to manage role-based access controls for clusters.|
|[Ingestion behavior of invalid data](ingest-invalid-data.md) | New article. Describes the possible outcomes of ingesting invalid data|
|[Use data from Azure Data Explorer in Power BI](power-bi-data-connector.md)| New article. Describes how to use data from Azure Data Explorer in Power BI.|
| - [Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)](ingest-data-cosmos-db-connection.md) <br/> - [Get latest versions of Azure Cosmos DB documents (Preview)](ingest-data-cosmos-db-queries.md) | New articles. Describes how to load data and get the latest versions of Azure Cosmos DB documents.|
|[Configure a database using a Kusto Query Language script](database-script.md)| Updated article. Database scripts supports `.add` verb.|
## November 2022

**Functions library**

| Article title | Description |
|--|--|
|- [series_mv_ee_anomalies_fl()](kusto/functions-library/series-mv-ee-anomalies-fl.md)<br /> - [series_mv_if_anomalies_fl()](kusto/functions-library/series-mv-if-anomalies-fl.md)<br /> - [series_mv_oc_anomalies_fl()](kusto/functions-library/series-mv-oc-anomalies-fl.md) | New article. Describes multivariate anomalies in a series user-defined functions. |

**Management**

| Article title | Description |
|--|--|
|[.show function(s)](kusto/management/show-function.md) | Updated article. Added optional arguments and tables to `.show function`. |

**Query**

| Article title | Description |
|--|--|
|- [unicode_codepoints_from_string()](kusto/query/unicode-codepoints-from-string-function.md) <br/> - [unicode_codepoints_to_string()](kusto/query/unicode-codepoints-to-string-function.md) | Updated articles. Unicode codepoints conversion functions for strings. |
|- [ipv6_is_in_any_range()](kusto/query/ipv6-is-in-any-range-function.md) <br/> - [ipv6_is_in_range()](kusto/query/ipv6-is-in-range-function.md) | New articles. Functions that check whether an IPv6 address is in a range.|
|- [count_distinct() (aggregation function) - (preview)](kusto/query/count-distinct-aggfunction.md) <br/> - [count_distinctif() (aggregation function) - (preview)](kusto/query/count-distinctif-aggfunction.md) | New articles. Count unique values specified by the scalar expression per summary group. |
|- [series_ceiling()](kusto/query/series-ceiling-function.md) <br/> - [series_floor()](kusto/query/series-floor-function.md) <br/> - [series_log()](kusto/query/series-log-function.md)| New articles. Calculate the element-wise functions of the numeric series input. |
|- [bin_auto()](kusto/query/bin-autofunction.md) <br/> - [binary_shift_left()](kusto/query/binary-shift-leftfunction.md) <br/> - [binary_shift_right()](kusto/query/binary-shift-rightfunction.md) <br/> - [binary_xor()](kusto/query/binary-xorfunction.md) <br/> - [bin_at()](kusto/query/binatfunction.md) <br/> - [bin()](kusto/query/binfunction.md) <br/> - [bitset_count_ones()](kusto/query/bitset-count-onesfunction.md) <br/> - [buildschema() (aggregation function)](kusto/query/buildschema-aggfunction.md) <br/> - [case()](kusto/query/casefunction.md) <br/> - [ceiling()](kusto/query/ceilingfunction.md) <br/> - [cosmosdb_sql_request plugin](kusto/query/cosmosdb-plugin.md)| Updated articles. Added new tables and examples. |

## October 2022

**General**

| Article title | Description |
|--|--|
|[Ingest data from OpenTelemetry](open-telemetry-connector.md)|New article. Describes how to create a connector to ingest data from OpenTelemetry.|
|[Managed identities overview](managed-identities-overview.md)|Updated article. Added continuous export with Managed Identity.|

## September 2022

**API**

| Article title | Description |
|--|--|
|[Kusto.Data exceptions](kusto/api/netfx/kusto-data-client-errors.md)|New article. Describes Kusto.Data exceptions.|
|[Evaluate query performance in your cluster](kusto/api/load-test-cluster.md)|New article. Describes how to load test a cluster's query performance.|

**General**

| Article title | Description |
|--|--|
|[POC playbook: Big data analytics](proof-of-concept-playbook.md)|New article. Describes a high-level methodology for running an effective proof of concept (POC) project.|
|[Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md)|New article. Describes query keyboard shortcuts in the web UI.|
|[Optimize queries that use named expressions](named-expressions.md)|New article. Describes how to optimize repeat use of named expressions in a query.|
|- [Kusto emulator overview](kusto-emulator-overview.md)<br />- [Install the Kusto emulator](kusto-emulator-install.md)|New articles. Describes the Kusto emulator, how to install it, and run your first query.|

## August 2022

**General**

| Article title | Description |
|--|--|
|- [Use the ingestion wizard to ingest JSON data](/azure/data-explorer/ingest-from-local-file) <br />- [Web UI overview](./web-query-data.md)|Updated articles. Added references to ingestion wizard and updated UI.|

**Management**

| Article title | Description |
|--|--|
|[.cancel operation command](kusto/management/cancel-operation-command.md)| New article. Describes how to use the `.cancel operation` command.|
|[How to authenticate with Azure Active Directory](kusto/access-control/how-to-authenticate-with-aad.md)| Updated article. Updated with Microsoft Authentication Library authentication.|
|[.drop extents](kusto/management/drop-extents.md)| Updated article. Added examples to drop specific extents.|
|[Queries management](kusto/management/queries.md)| Updated article. Added show by user command.
|- [Ingest from storage](kusto/management/data-ingestion/ingest-from-storage.md)|Updated article. Added ingest from Amazon S3.
|- [.create-or-alter function](kusto/management/create-alter-function.md)<br />- [.create function](kusto/management/create-function.md)| New and updated article. Added new parameter for stored view.|
