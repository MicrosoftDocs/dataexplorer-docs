---
title: What's new in Azure Data Explorer documentation archive
description: In this article, you'll find an archive of new and significant changes in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/04/2024
---
# What's new in Azure Data Explorer documentation archive

Welcome to what's new in Azure Data Explorer archive. This article is an archive of new and significantly updated content in the Azure Data Explorer documentation.

## September 2023

**General**

| Article title | Description |
|--|--|
|- [KQL graph semantics overview (Preview)](graph-overview.md) <br/> - [KQL graph semantics best practices (Preview)](graph-best-practices.md) <br/> - [Common scenarios for using KQL graph semantics (Preview)?](graph-scenarios.md) | New articles. Describes how to use Kusto Query Language (KQL) graph semantics.|
| [How to ingest historical data](ingest-data-historical.md)| New article. Describes how to use LightIngest to ingest historical or ad hoc data into Azure Data Explorer.|
|- [Ingest data from Splunk to Azure Data Explorer](ingest-data-splunk.md) <br/> - [Data connectors overview](integrate-data-overview.md)| New article that describes how to ingest data into Azure Data Explorer from Splunk, and updated data connector overview with additional capabilities.|
| [KQL learning resources](kql-learning-resources.md)| New article. Describes the different learning resources for ramping up on KQL.|
| [Dashboard-specific visuals](dashboard-visuals.md)| New article. Describes the visualizations available in Azure Data Explorer web UI or dashboards.|
| [Create a dashboard base query](base-query.md)| New article. Describes how to create a base query for an Azure Data Explorer dashboard.|

**Management**

| Article title | Description |
|--|--|
|- [.alter-merge database policy ingestionbatching command](/kusto/management/alter-merge-database-ingestion-batching-policy?view=azure-data-explorer&preserve-view=true) <br/> - [.alter-merge table policy ingestionbatching command](/kusto/management/alter-merge-table-ingestion-batching-policy?view=azure-data-explorer&preserve-view=true)| New articles. Describes how to set the ingestion batching policy.|

**Query**

| Article title | Description |
|--|--|
|- [Graph operators (Preview)](/kusto/query/graph-operators?view=azure-data-explorer&preserve-view=true) <br/> - [graph-match operator (Preview)](/kusto/query/graph-match-operator?view=azure-data-explorer&preserve-view=true) <br/> - [graph-to-table operator (Preview)](/kusto/query/graph-to-table-operator?view=azure-data-explorer&preserve-view=true) <br/> - [make-graph operator (Preview)](/kusto/query/make-graph-operator?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to use graph operators. |
| [Plotly (preview)](/kusto/query/visualization-plotly?view=azure-data-explorer&preserve-view=true) | New article. Describes how to visualize data using the Plotly graphics library.|

## August 2023

**API**

| Article title | Description |
|--|--|
| [Create an app to get data using queued ingestion](/kusto/api/get-started/app-queued-ingestion?view=azure-data-explorer&preserve-view=true)| New article. Describes how to create an app to get data using queued ingestion of the Kusto client libraries.|

**General**

| Article title | Description |
|--|--|
|- [Get data from file](get-data-file.md) <br/> - [Get data from Azure storage](get-data-storage.md) <br/> - [Get data from Amazon S3](get-data-amazon-s3.md) <br/> - [Create an Event Hubs data connection](create-event-hubs-connection.md) | New articles. Describes the new Get data experience in Azure Data Explorer.|
|- [Delete a cluster](delete-cluster.md) <br/> - [Delete a database](delete-database.md) | New articles. Describes how to delete an Azure Data Explorer cluster and database.|
| [Monitor ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs.md)| Updated article. Refreshed content and added journal log data tab.|

**Functions library**

| Article title | Description |
|--|--|
| [series_clean_anomalies_fl()](/kusto/functions-library/series-clean-anomalies-fl?view=azure-data-explorer&preserve-view=true)| New article. Describes how to clean anomalous points in a series.|

**Management**

| Article title | Description |
|--|--|
| [Use a managed identity to run an update policy](/kusto/management/update-policy-with-managed-identity?view=azure-data-explorer&preserve-view=true)| New article. Describes how to configure a managed identity to run an update policy.|
| [.show databases entities command](/kusto/management/show-databases-entities?view=azure-data-explorer&preserve-view=true)| New article. Describes how to show a database's entities.|
| [.show database extents partitioning statistics](/kusto/management/show-database-extents-partitioning-statistics?view=azure-data-explorer&preserve-view=true)| New article. Describes how to display a database's partitioning statistics.|

**Query**

| Article title | Description |
|--|--|
| [Entity names](/kusto/query/schema-entities/entity-names?view=azure-data-explorer&preserve-view=true)| Updated article. Refreshed identifier naming rules and references in queries.|
| [partition operator](/kusto/query/partition-operator?view=azure-data-explorer&preserve-view=true)| Updated article. Refreshed content and added parameters.|
| [scan operator](/kusto/query/scan-operator?view=azure-data-explorer&preserve-view=true)| Updated article. Added scan logic walkthrough.|
| [top-nested operator](/kusto/query/top-nested-operator?view=azure-data-explorer&preserve-view=true)| Updated article. Refreshed content.|

## July 2023

**API**

| Article title | Description |
|--|--|
| [Connection strings overview](/kusto/api/connection-strings/index?view=azure-data-explorer&preserve-view=true)| Updated article. Added privacy and security measures.|
| [SQL external table authentication methods](/kusto/api/connection-strings/sql-connection-strings?view=azure-data-explorer&preserve-view=true)| Updated article. Refreshed supported authentication methods.|

**General** 

| Article title | Description |
|--|--|
| [Query data using MATLAB](query-matlab.md)| New article. Describes how to query data from Azure Data Explorer using MATLAB.|
| [Migration guide: Elasticsearch to Azure Data Explorer](migrate-elasticsearch-to-azure-data-explorer.md)| New article. Describes how to migrate your Elasticsearch data to Azure Data Explorer.|
| [Visualize data from Azure Data Explorer in Grafana](grafana.md)| Updated article. Added Azure Managed Grafana.|

**Management**

| Article title | Description |
|--|--|
[Data mappings](/kusto/management/mappings?view=azure-data-explorer&preserve-view=true)| Updated article. Added supported data formats for mapping transformations.|
|- [Export data to SQL](/kusto/management/data-export/export-data-to-sql?view=azure-data-explorer&preserve-view=true) <br/> - [Create and alter SQL external tables](/kusto/management/external-sql-tables?view=azure-data-explorer&preserve-view=true)| Updated articles. Added supported authentication methods and parameters.|

**Query**

| Article title | Description |
|--|--|
|- [punycode_domain_from_string()](/kusto/query/punycode-domain-from-string-function?view=azure-data-explorer&preserve-view=true) <br/> - [punycode_domain_to_string()](/kusto/query/punycode-domain-to-string-function?view=azure-data-explorer&preserve-view=true)| New articles. Describes how to encode and decode a punycode domain name.|
| [geo_line_to_s2cells()](/kusto/query/geo-line-to-s2cells-function?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the geo_line_to_2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.|
| [extract_json()](/kusto/query/extract-json-function?view=azure-data-explorer&preserve-view=true)| Updated article. Added new example.|
| [Pivot chart](/kusto/query/visualization-pivotchart?view=azure-data-explorer&preserve-view=true)| Updated article. Added new example.|

## June 2023

**API**

| Article title | Description |
|--|--|
| - [Kusto.Language Overview](/kusto/api/netfx/about-kusto-language?view=azure-data-explorer&preserve-view=true) <br/> - [Define schemas for semantic analysis with Kusto.Language](/kusto/api/netfx/kusto-language-define-schemas?view=azure-data-explorer&preserve-view=true) <br/> - [Parse queries and commands with Kusto.Language](/kusto/api/netfx/kusto-language-parse-queries?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to use the Kusto.Language library for parsing queries. |
| [Management commands: Create an app to run management commands](/kusto/api/get-started/app-management-commands?view=azure-data-explorer&preserve-view=true) | New article. Describes how to create an app to run management commands using Kusto client libraries. |

**Query**

| Article title | Description |
|--|--|
| - [Join operator](/kusto/query/join-operator?view=azure-data-explorer&preserve-view=true) <br/> - [fullouter join](/kusto/query/join-fullouter?view=azure-data-explorer&preserve-view=true) <br/> - [inner join](/kusto/query/join-inner?view=azure-data-explorer&preserve-view=true) <br/> - [innerunique join](/kusto/query/join-innerunique?view=azure-data-explorer&preserve-view=true) <br/> - [leftanti join](/kusto/query/join-leftanti?view=azure-data-explorer&preserve-view=true) <br/> - [leftouter join](/kusto/query/join-leftouter?view=azure-data-explorer&preserve-view=true) <br/> - [leftsemi join](/kusto/query/join-leftsemi?view=azure-data-explorer&preserve-view=true) <br/> - [rightanti join](/kusto/query/join-rightanti?view=azure-data-explorer&preserve-view=true) <br/> - [rightouter join](/kusto/query/join-rightouter?view=azure-data-explorer&preserve-view=true) <br/> - [rightsemi join](/kusto/query/join-rightsemi?view=azure-data-explorer&preserve-view=true) | Updated and new articles. Refreshed `join` overview and added topics describing each `join` kind. |
| [replace_strings()](/kusto/query/replace-strings-function?view=azure-data-explorer&preserve-view=true) | New article. Describes how to use the replace_strings() function to replace multiple string matches with multiple replacement strings. |

## May 2023

**General**

| Article title | Description |
|--|--|
|- [Azure Data Explorer web UI query overview](web-ui-query-overview.md) <br/> - [Add a cluster connection in the Azure Data Explorer web UI](add-cluster-connection.md) <br/> - [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md) <br/> - [Share queries from Azure Data Explorer web UI](web-share-queries.md)| New articles. Describes how to use the Azure Data Explorer web UI to interact with your data.|
|[Ingest data with the NLog sink into Azure Data Explorer](nlog-sink.md)| New article. Describes how to use the Azure Data Explorer NLog connector to ingest data into your cluster.|
|[How to architect a multitenant solution with Azure Data Explorer](multi-tenant.md)| New article. Describes how to architect a multitenant solution in Azure Data Explorer.|
|[Create an Event Hubs data connection for Azure Data Explorer](create-event-hubs-connection.md)| Updated article. Integration from Azure Event Hubs page added.|
|[Install the Azure Data Explorer Kusto emulator](kusto-emulator-install.md)| Updated article. Describes how to install the Kusto emulator using a Linux Docker container image.|
|[Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)| Updated article. Funnel chart visualization added.|
|[Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md)| Updated article. Refreshed content.|

**Management**

| Article title | Description |
|--|--|
|[Create and alter delta external tables on Azure Storage](/kusto/management/external-tables-delta-lake?view=azure-data-explorer&preserve-view=true)| New article. Describes how to create and alter delta external tables on Azure Storage.|

**Query**

| Article title | Description |
|--|--|
|[postgresql_request plugin](/kusto/query/postgresql-request-plugin?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the postgresql_request plugin to send a SQL query to a PostgreSql server network endpoint.|
|[Treemap](/kusto/query/visualization-treemap?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the treemap visualization to visualize data.|
|[geo_info_from_ip_address()](/kusto/query/geo-info-from-ip-address-function?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the geo_info_from_ip_address() function to retrieve geolocation information about IPv4 or IPv6 addresses.|
|[bag_zip()](/kusto/query/bag-zip?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the bag_zip() function to merge two dynamic arrays into a single property-bag of keys and values.|

## April 2023

**API**

| Article title | Description |
|--|--|
| - [Set up your development environment to use Kusto client libraries](/kusto/api/get-started/app-set-up?view=azure-data-explorer&preserve-view=true)<br/>- [Hello Kusto: Create your first Kusto client app](/kusto/api/get-started/app-hello-kusto?view=azure-data-explorer&preserve-view=true)<br/> - [Basic query: Create an app to run basic queries](/kusto/api/get-started/app-basic-query?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to write code with SDKs.|

**General**

| Article title | Description |
|--|--|
|[Azure Data Explorer web UI results grid](web-results-grid.md)| Updated article. New features added.|

**Functions library**

| Article title | Description |
|--|--|
|- [log_reduce_fl()](/kusto/functions-library/log-reduce-fl?view=azure-data-explorer&preserve-view=true) <br/> - [log_reduce_full_fl()](/kusto/functions-library/log-reduce-full-fl?view=azure-data-explorer&preserve-view=true) <br/> - [log_reduce_predict_fl()](/kusto/functions-library/log-reduce-predict-fl?view=azure-data-explorer&preserve-view=true) <br/> - [log_reduce_predict_full_fl()](/kusto/functions-library/log-reduce-predict-full-fl?view=azure-data-explorer&preserve-view=true) <br/> - [log_reduce_train_fl()](/kusto/functions-library/log-reduce-train-fl?view=azure-data-explorer&preserve-view=true)| New articles. Describes how to find common patterns in textual logs. |

**Management**

| Article title | Description |
|--|--|
|[Use a managed identity to run a continuous export job](/kusto/management/data-export/continuous-export-with-managed-identity?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use a managed identity for continuous export.

**Query**

| Article title | Description |
|--|--|
|[Syntax conventions for reference documentation](/kusto/query/syntax-conventions?view=azure-data-explorer&preserve-view=true)| New article. Describes the syntax conventions for the Kusto Query Language and management command documentation.|
|- [punycode_from_string()](/kusto/query/punycode-from-string-function?view=azure-data-explorer&preserve-view=true) <br/> - [punycode_to_string()](/kusto/query/punycode-to-string-function?view=azure-data-explorer&preserve-view=true)| New articles. Describes how to encode and decode Punycode.|

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
| [Manage view access to tables in Azure Data Explorer](/kusto/management/manage-table-view-access?view=azure-data-explorer&preserve-view=true) | New article. Describes how to grant access to tables in Azure Data Explorer. |
|- [Materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true)<br/>- [.show materialized-view(s)](/kusto/management/materialized-views/materialized-view-show-command?view=azure-data-explorer&preserve-view=true)<br/>- [.show materialized-view extents](/kusto/management/materialized-views/materialized-view-show-extents-command?view=azure-data-explorer&preserve-view=true)<br/>- [.show materialized-view failures](/kusto/management/materialized-views/materialized-view-show-failures-command?view=azure-data-explorer&preserve-view=true)<br/>- [.show materialized-view schema](/kusto/management/materialized-views/materialized-view-show-schema-command?view=azure-data-explorer&preserve-view=true)<br/>- [.alter materialized-view autoUpdateSchema](/kusto/management/materialized-views/materialized-view-alter-autoupdateschema?view=azure-data-explorer&preserve-view=true) <br/> - [.alter materialized-view docstring](/kusto/management/materialized-views/materialized-view-alter-docstring?view=azure-data-explorer&preserve-view=true)<br/>- [.alter materialized-view folder](/kusto/management/materialized-views/materialized-view-alter-folder?view=azure-data-explorer&preserve-view=true)<br/>- [.alter materialized-view lookback](/kusto/management/materialized-views/materialized-view-alter-lookback?view=azure-data-explorer&preserve-view=true)<br/>- [.alter materialized-view](/kusto/management/materialized-views/materialized-view-alter?view=azure-data-explorer&preserve-view=true)<br/>- [.clear materialized-view data](/kusto/management/materialized-views/materialized-view-clear-data?view=azure-data-explorer&preserve-view=true)<br/>- [.create-or-alter materialized-view](/kusto/management/materialized-views/materialized-view-create-or-alter?view=azure-data-explorer&preserve-view=true)<br/>- [.create materialized-view](/kusto/management/materialized-views/materialized-view-create?view=azure-data-explorer&preserve-view=true)<br/>- [.drop materialized-view](/kusto/management/materialized-views/materialized-view-drop?view=azure-data-explorer&preserve-view=true)<br/>- [.disable .enable materialized-view](/kusto/management/materialized-views/materialized-view-enable-disable?view=azure-data-explorer&preserve-view=true)<br/>- [.rename materialized-view](/kusto/management/materialized-views/materialized-view-rename?view=azure-data-explorer&preserve-view=true)<br/>- [.show materialized view details](/kusto/management/materialized-views/materialized-view-show-details-command?view=azure-data-explorer&preserve-view=true) | New and updated articles. Describe materialized-view commands. Parameters and examples added.|
|- [.alter extent tags](/kusto/management/alter-extent?view=azure-data-explorer&preserve-view=true)<br/>- [.drop extent tags](/kusto/management/drop-extent-tags?view=azure-data-explorer&preserve-view=true)<br/>- [.move extents](/kusto/management/move-extents?view=azure-data-explorer&preserve-view=true)<br/>- [.replace extents](/kusto/management/replace-extents?view=azure-data-explorer&preserve-view=true) | Updated articles. Command syntax updated.|

**Query**

| Article title | Description |
|--|--|
|- [Kusto.Explorer code features](/kusto/tools/kusto-explorer-code-features?view=azure-data-explorer&preserve-view=true)<br/>- [Kusto Explorer options](/kusto/tools/kusto-explorer-options?view=azure-data-explorer&preserve-view=true)<br/>- [Kusto.Explorer keyboard shortcuts (hot keys)](/kusto/tools/kusto-explorer-shortcuts?view=azure-data-explorer&preserve-view=true)<br/>- [Using Kusto.Explorer](/kusto/tools/kusto-explorer-using?view=azure-data-explorer&preserve-view=true)<br/>- [Kusto.Explorer installation and user interface](/kusto/tools/kusto-explorer?view=azure-data-explorer&preserve-view=true) | Updated articles. Refreshed content.|

## February 2023

**API**

| Article title | Description |
|--|--|
| [Authentication over HTTPS](/kusto/api/rest/authentication?view=azure-data-explorer&preserve-view=true)| Updated article.  REST API authorization examples added. |

**General**

| Article title | Description |
|--|--|
|[Manage Azure Data Explorer cluster locks to prevent accidental deletion in your cluster](manage-cluster-locks.md)| New article. Describes how to manage cluster locks to prevent accidental deletion of data using the Azure portal.|
|[Connect from common apps](connect-common-apps.md) | New article. Describes how to connect to Azure Data Explorer with SQL Server emulation from various apps.|
|- [Connect to Azure Data Explorer with JDBC](connect-jdbc.md) <br/> - [Connect to Azure Data Explorer with SQL Server emulation](sql-server-emulation-overview.md) <br/> - [Connect to Azure Data Explorer with ODBC](connect-odbc.md) | New articles. Describes how to connect to Azure Data Explorer with different connection apps.|
|[Azure Data Explorer as a linked server from SQL Server](linked-server.md)| New article. Describes how to connect Azure Data Explorer as a linked server from SQL Server.|
|[Set timeout limits](/kusto/set-timeout-limits?view=azure-data-explorer&preserve-view=true)| New article. Describes how to set query timeout limits.|
|[Data connectors overview](integrate-data-overview.md)| New article. Describes available data connectors and their capabilities.|
|- [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md) <br/> - [Azure Data Explorer web UI results grid](web-results-grid.md) <br/> - [Share queries from Azure Data Explorer web UI](web-share-queries.md) <br/> - [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md) <br/> - [Explore the samples gallery](web-ui-samples-query.md) | New articles. Describes how to use, query, visualize, and share queries in the Azure Data Explorer web UI.|
|[Query data using T-SQL](t-sql.md)| Updated article. Support limitations added.|
|[What is the ingestion wizard?](ingest-data-overview.md) | Updated article. Management actions added.|

## January 2023

**General**

| Article title | Description |
|--|--|
|- [Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md) <br/> - [Referencing security principals](/kusto/management/reference-security-principals?view=azure-data-explorer&preserve-view=true) | Updated articles. Renewed and restructured referencing of security principals and identity providers.|

**Functions library**

| Article title | Description |
|--|--|
|- [plotly_anomaly_fl()](/kusto/functions-library/plotly-anomaly-fl?view=azure-data-explorer&preserve-view=true) <br/> - [plotly_scatter3d_fl()](/kusto/functions-library/plotly-scatter3d-fl?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to customize a plotly template. |

**Management**

| Article title | Description |
|--|--|
|- [.dup-next-failed-ingest](/kusto/management/dup-next-failed-ingest?view=azure-data-explorer&preserve-view=true) <br/> - [.dup-next-ingest](/kusto/management/dup-next-ingest?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to troubleshoot data on demand. |

**Query**

| Article title | Description |
|--|--|
| - [render operator](/kusto/query/render-operator?view=azure-data-explorer&preserve-view=true)<br />- [Anomaly chart](/kusto/query/visualization-anomalychart?view=azure-data-explorer&preserve-view=true) <br/> - [Area chart](/kusto/query/visualization-areachart?view=azure-data-explorer&preserve-view=true) <br/> - [Bar chart](/kusto/query/visualization-barchart?view=azure-data-explorer&preserve-view=true) <br/> - [Card](/kusto/query/visualization-card?view=azure-data-explorer&preserve-view=true) <br/> - [Column chart](/kusto/query/visualization-columnchart?view=azure-data-explorer&preserve-view=true) <br/> - [Ladder chart](/kusto/query/visualization-ladderchart?view=azure-data-explorer&preserve-view=true) <br/> - [Line chart](/kusto/query/visualization-linechart?view=azure-data-explorer&preserve-view=true) <br/> - [Pie chart](/kusto/query/visualization-piechart?view=azure-data-explorer&preserve-view=true) <br/> - [Pivot chart](/kusto/query/visualization-pivotchart?view=azure-data-explorer&preserve-view=true) <br/> - [Scatter chart](/kusto/query/visualization-scatterchart?view=azure-data-explorer&preserve-view=true) <br/> - [Stacked area chart](/kusto/query/visualization-stackedareachart?view=azure-data-explorer&preserve-view=true) <br/> - [Table](/kusto/query/visualization-table?view=azure-data-explorer&preserve-view=true) <br/> - [Time chart](/kusto/query/visualization-timechart?view=azure-data-explorer&preserve-view=true) <br/> - [Time pivot](/kusto/query/visualization-timepivot?view=azure-data-explorer&preserve-view=true) | Updated and new articles. Refreshed render overview and added topics describing each render visualization. |
| [series_dot_product()](/kusto/query/series-dot-product-function?view=azure-data-explorer&preserve-view=true) | New article. Describes how to calculate the dot product of two numeric series.|
| [hll_if() (aggregation function)](/kusto/query/hll-if-aggregation-function?view=azure-data-explorer&preserve-view=true) | New article. Describes how to calculate the intermediate results of the `dcount()` function. |
| [bag_set_key()](/kusto/query/bag-set-key-function?view=azure-data-explorer&preserve-view=true) | New article. Describes how to set a given key to a given value in a dynamic property bag. |

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
|- [series_mv_ee_anomalies_fl()](/kusto/functions-library/series-mv-ee-anomalies-fl?view=azure-data-explorer&preserve-view=true)<br /> - [series_mv_if_anomalies_fl()](/kusto/functions-library/series-mv-if-anomalies-fl?view=azure-data-explorer&preserve-view=true)<br /> - [series_mv_oc_anomalies_fl()](/kusto/functions-library/series-mv-oc-anomalies-fl?view=azure-data-explorer&preserve-view=true) | New article. Describes multivariate anomalies in a series user-defined functions. |

**Management**

| Article title | Description |
|--|--|
|[.show function(s)](/kusto/management/show-function?view=azure-data-explorer&preserve-view=true) | Updated article. Added optional arguments and tables to `.show function`. |

**Query**

| Article title | Description |
|--|--|
|- [unicode_codepoints_from_string()](/kusto/query/unicode-codepoints-from-string-function?view=azure-data-explorer&preserve-view=true) <br/> - [unicode_codepoints_to_string()](/kusto/query/unicode-codepoints-to-string-function?view=azure-data-explorer&preserve-view=true) | Updated articles. Unicode codepoints conversion functions for strings. |
|- [ipv6_is_in_any_range()](/kusto/query/ipv6-is-in-any-range-function?view=azure-data-explorer&preserve-view=true) <br/> - [ipv6_is_in_range()](/kusto/query/ipv6-is-in-range-function?view=azure-data-explorer&preserve-view=true) | New articles. Functions that check whether an IPv6 address is in a range.|
|- [count_distinct() (aggregation function) - (preview)](/kusto/query/count-distinct-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [count_distinctif() (aggregation function) - (preview)](/kusto/query/count-distinctif-aggregation-function?view=azure-data-explorer&preserve-view=true) | New articles. Count unique values specified by the scalar expression per summary group. |
|- [series_ceiling()](/kusto/query/series-ceiling-function?view=azure-data-explorer&preserve-view=true) <br/> - [series_floor()](/kusto/query/series-floor-function?view=azure-data-explorer&preserve-view=true) <br/> - [series_log()](/kusto/query/series-log-function?view=azure-data-explorer&preserve-view=true)| New articles. Calculate the element-wise functions of the numeric series input. |
|- [bin_auto()](/kusto/query/bin-auto-function?view=azure-data-explorer&preserve-view=true) <br/> - [binary_shift_left()](/kusto/query/binary-shift-left-function?view=azure-data-explorer&preserve-view=true) <br/> - [binary_shift_right()](/kusto/query/binary-shift-right-function?view=azure-data-explorer&preserve-view=true) <br/> - [binary_xor()](/kusto/query/binary-xor-function?view=azure-data-explorer&preserve-view=true) <br/> - [bin_at()](/kusto/query/bin-at-function?view=azure-data-explorer&preserve-view=true) <br/> - [bin()](/kusto/query/bin-function?view=azure-data-explorer&preserve-view=true) <br/> - [bitset_count_ones()](/kusto/query/bitset-count-ones-function?view=azure-data-explorer&preserve-view=true) <br/> - [buildschema() (aggregation function)](/kusto/query/buildschema-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [case()](/kusto/query/case-function?view=azure-data-explorer&preserve-view=true) <br/> - [ceiling()](/kusto/query/ceiling-function?view=azure-data-explorer&preserve-view=true) <br/> - [cosmosdb_sql_request plugin](/kusto/query/cosmosdb-plugin?view=azure-data-explorer&preserve-view=true)| Updated articles. Added new tables and examples. |

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
|[Kusto.Data exceptions](/kusto/api/netfx/kusto-data-client-errors?view=azure-data-explorer&preserve-view=true)|New article. Describes Kusto.Data exceptions.|
|[Evaluate query performance in your cluster](/kusto/query/best-practices?view=azure-data-explorer&preserve-view=true)|New article. Describes how to load test a cluster's query performance.|

**General**

| Article title | Description |
|--|--|
|[POC playbook: Big data analytics](proof-of-concept-playbook.md)|New article. Describes a high-level methodology for running an effective proof of concept (POC) project.|
|[Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md)|New article. Describes query keyboard shortcuts in the web UI.|
|[Optimize queries that use named expressions](/kusto/query/named-expressions?view=azure-data-explorer&preserve-view=true)|New article. Describes how to optimize repeat use of named expressions in a query.|
|- [Kusto emulator overview](kusto-emulator-overview.md)<br/>- [Install the Kusto emulator](kusto-emulator-install.md)|New articles. Describes the Kusto emulator, how to install it, and run your first query.|

## August 2022

**General**

| Article title | Description |
|--|--|
|- [Use the ingestion wizard to ingest JSON data](/azure/data-explorer/ingest-from-local-file) <br/>- [Web UI overview](web-query-data.md)|Updated articles. Added references to ingestion wizard and updated UI.|

**Management**

| Article title | Description |
|--|--|
|[.cancel operation command](/kusto/management/cancel-operation-command?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the `.cancel operation` command.|
|[How to authenticate with Microsoft Entra ID](/kusto/api/rest/authenticate-with-msal?view=azure-data-explorer&preserve-view=true)| Updated article. Updated with Microsoft Authentication Library authentication.|
|[.drop extents](/kusto/management/drop-extents?view=azure-data-explorer&preserve-view=true)| Updated article. Added examples to drop specific extents.|
|[Queries management](/kusto/management/show-queries-command?view=azure-data-explorer&preserve-view=true)| Updated article. Added show by user command.
|- [Ingest from storage](/kusto/management/data-ingestion/ingest-from-storage?view=azure-data-explorer&preserve-view=true)|Updated article. Added ingest from Amazon S3.
|- [.create-or-alter function](/kusto/management/create-alter-function?view=azure-data-explorer&preserve-view=true)<br/>- [.create function](/kusto/management/create-function?view=azure-data-explorer&preserve-view=true)| New and updated article. Added new parameter for stored view.|

## July 2022

**General**

| Article title | Description |
|--|--|
| [Upgrade a free cluster](start-for-free-upgrade.md) | New Article. Describes how to upgrade a free cluster to a full cluster without losing your data. |

**Management**

| Article title | Description |
|--|--|
| [.alter extent tags](/kusto/management/alter-extent?view=azure-data-explorer&preserve-view=true) | Updated article. Added documentation for `alter-merge` extent tags. |

**Query**

| Article title | Description |
|--|--|
| - [convert_angle](/kusto/query/convert-angle-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_energy](/kusto/query/convert-energy-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_force](/kusto/query/convert-force-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_length](/kusto/query/convert-length-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_mass](/kusto/query/convert-mass-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_speed](/kusto/query/convert-speed-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_temperature](/kusto/query/convert-temperature-function?view=azure-data-explorer&preserve-view=true) <br />- [convert_volume](/kusto/query/convert-volume-function?view=azure-data-explorer&preserve-view=true) | New articles. New functions for converting values. |
| [parse-kv operator](/kusto/query/parse-kv-operator?view=azure-data-explorer&preserve-view=true) | New Article. Describes how to extract structured information from a string in key/value form. |
|- [Scalar function types at a glance](/kusto/query/scalar-functions?view=azure-data-explorer&preserve-view=true) <br />- [arg_max() (aggregation function)](/kusto/query/arg-max-aggregation-function?view=azure-data-explorer&preserve-view=true) <br />- [arg_min() (aggregation function)](/kusto/query/arg-min-aggregation-function?view=azure-data-explorer&preserve-view=true) <br />- [avg() (aggregation function)](/kusto/query/avg-aggregation-function?view=azure-data-explorer&preserve-view=true) <br />- [max() (aggregation function)](/kusto/query/max-aggregation-function?view=azure-data-explorer&preserve-view=true) <br />- [min() (aggregation function)](/kusto/query/min-aggregation-function?view=azure-data-explorer&preserve-view=true) <br />- [sum() (aggregation function)](/kusto/query/sum-aggregation-function?view=azure-data-explorer&preserve-view=true) | Updated articles. Added new examples. |

## June 2022

| Article title | Description |
|--|--|
| [Ingest data from Azure Stream Analytics (Preview)](stream-analytics-connector.md) | New Article. Describes how to ingest (load) data from Azure Stream Analytics. |
| [Azure Data Explorer web UI overview](web-query-data.md) | New Article. Describes the elements of web UI home page and the data analytics journey. |
| [Explore the Azure Data Explorer web UI samples gallery](web-ui-samples-dashboards.md) | New Article. Describes how to use the samples gallery in the web UI. |
| [Select a SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md) | Updated Article. New SKU list and refreshed content. |

## May 2022

| Article title | Description |
|--|--|
| [Ingest data from Telegraf](ingest-data-telegraf.md) | New Article. Describes how to ingest data into your cluster from Telegraf. |
| [Ingest data using managed identity authentication](ingest-data-managed-identity.md) | New Article. Queue Azure Storage blobs for ingestion using managed identity authentication. |
|- [Azure Data Explorer connector for Microsoft Power Automate](flow.md) <br />- [Usage examples for Power Automate connector](flow-usage.md) <br />- [Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md) <br />- [Microsoft Logic App and Azure Data Explorer](/kusto/tools/logicapps?view=azure-data-explorer&preserve-view=true)| Updated articles. General availability (GA). Content refreshed. |
| [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md) | Updated Article. Added section on drillthrough. |

## April 2022

| Article title | Description |
|--|--|
| - [Enable disk encryption for your cluster](cluster-encryption-disk.md)<br />- [Secure your cluster with encryption](cluster-encryption-overview.md)<br />- [Enable double encryption for your cluster](cluster-encryption-double.md) | New articles. Describing securing your cluster using disk encryption. |
| - [Create a managed private endpoint for your cluster](security-network-managed-private-endpoint-create.md)<br />- [Network security](security-network-overview.md)<br />- [Create a private endpoint for your cluster](security-network-private-endpoint-create.md)<br />- [Troubleshoot private endpoints](security-network-private-endpoint-troubleshoot.md)<br />- [Private endpoints for your cluster](security-network-private-endpoint.md)<br />- [Restrict outbound access from your cluster](security-network-restrict-outbound-access.md)<br />- [Restrict public access to your cluster](security-network-restrict-public-access.md)| New articles. Describes private endpoint security. |

**Management**

| Article title | Description |
|--|--|
| [Streaming ingestion failures](/kusto/management/streaming-ingestion-failures?view=azure-data-explorer&preserve-view=true) | New article. Describes the command to show streaming ingestion failures. |
| [Streaming ingestion statistics](/kusto/management/streaming-ingestion-statistics?view=azure-data-explorer&preserve-view=true) | New article. Describes the command to show streaming ingestion statistics. |

## March 2022

| Article title | Description |
|--|--|
| [Create a free cluster](start-for-free-web-ui.md) | New article. Describes how to create a free cluster, ingest data, and run queries. |
| - [Create an Event Grid data connection using C\#](create-event-grid-connection-sdk.md?tabs=c-sharp)<br />- [Create an Event Grid data connection using Python](create-event-grid-connection-sdk.md?tabs=python)<br />- [Create an Event Grid data connection using Azure Resource Manager template](create-event-grid-connection.md?tabs=arm-template)<br />- [Create an Event Hubs data connection using C\#](create-event-hubs-connection-sdk.md?tabs=c-sharp)<br />- [Create an Event Hubs data connection using Python](create-event-hubs-connection-sdk.md?tabs=python)<br />- [Create an Event Hubs data connection using Azure Resource Manager template](create-event-hubs-connection.md?tabs=arm-template)<br />- [Create an IoT Hub data connection using C\# (Preview)](create-iot-hub-connection-sdk.md?tabs=c-sharp)<br />- [Create an IoT Hub data connection using Python (Preview)](create-iot-hub-connection-sdk.md?tabs=c-python)<br />- [Create an IoT Hub data connection using Azure Resource Manager template](create-iot-hub-connection.md?tabs=arm-template) | Updated articles. Added `databaseRouting` parameter and setting. |
| - [Event Grid data connection](ingest-data-event-grid-overview.md)<br />- [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid-overview.md) | Updated articles. Added events routing setting. |
| - [Azure Event Hubs data connection](ingest-data-event-hub-overview.md)<br />- [Ingest data from event hub into Azure Data Explorer](create-event-hubs-connection.md?tabs=portalADX) | Updated articles. Added new Events Routing features including alternative databases and tables. |
| - [IoT Hub data connection](ingest-data-iot-hub-overview.md)<br />- [Ingest data from IoT Hub into Azure Data Explorer](create-iot-hub-connection.md?tabs=portal) | Updated articles. Added new sections on target databases (multi-database data connection). |

**Functions library**

| Article title | Description |
|--|--|
| [pairwise_dist_fl()](/kusto/functions-library/pairwise-dist-fl?view=azure-data-explorer&preserve-view=true) | New article. Describes the `pairwise_dist_fl()` user-defined function. |
| [series_uv_anomalies_fl()](/kusto/functions-library/series-uv-anomalies-fl?view=azure-data-explorer&preserve-view=true) | New article. Describes the `series_uv_anomalies_fl()` user-defined function. |
| [series_uv_change_points_fl()](/kusto/functions-library/series-uv-change-points-fl?view=azure-data-explorer&preserve-view=true) | New article. Describes the `series_uv_change_points_fl()` user-defined function. |

**Management**

| Article title | Description |
|--|--|
| [Clear schema cache for cross-cluster queries](/kusto/management/clear-cross-cluster-schema-cache?view=azure-data-explorer&preserve-view=true) | New article. Describes how to manually clear the cross-cluster query cache. |

**Query**

| Article title | Description |
|--|--|
| [http_request plugin / http_request_post plugin](/kusto/query/http-request-plugin?view=azure-data-explorer&preserve-view=true) | New article. Describes the http_request plugin. |
| [Cross-database and cross-cluster queries](/kusto/query/cross-cluster-or-database-queries?view=azure-data-explorer&preserve-view=true) | Updated article. Updated links to cross-cluster queries and schema changes page. |
| [Cross-cluster queries and schema changes](/kusto/query/cross-cluster-or-database-queries?view=azure-data-explorer&preserve-view=true) | New article. Describes cross-cluster queries and schema changes. |

## February 2022

| Article title | Description |
|--|--|
| [What is a free cluster?](start-for-free.md) | New article. Describes how to get started with a free Azure Data Explorer cluster. |
| [Cross-tenant data connection](ingest-data-cross-tenant.md) | New article. Describes how to create cross-tenant data connections for Azure Event Hubs or Azure Event Grid services in a different tenant. |
| [Automated provisioning](automated-deploy-overview.md) | New article. Maps different articles for automating the provisioning of clusters. |

**Functions library**

| Article title | Description |
|--|--|
| [series_lag_fl()](/kusto/functions-library/series-lag-fl?view=azure-data-explorer&preserve-view=true) | New article. Describes the `series_lag_fl()` user-defined function. |

## January 2022

| Article title | Description |
|--|--|
| [Use the sample app generator to create code to ingest and query your data](sample-app-generator-wizard.md) | New Article. Describes how to use the sample app generator for your preferred programming language. |

**API**

| Article title | Description |
|--|--|
| [Azure Data Explorer API overview](/kusto/api/index?view=azure-data-explorer&preserve-view=true) | Updated article. Added new tip and link to the doc on using the one-click sample app generator.|

## December 2021

| Article title | Description |
|--|--|
| [Use parameters in dashboards](dashboard-parameters.md) | Updated article. Added new section for cross-filters as dashboard parameters. |

**Functions library**

| Article title | Description |
|--|--|
| [time_window_rolling_avg_fl()](/kusto/functions-library/time-window-rolling-avg-fl?view=azure-data-explorer&preserve-view=true) | New Article. Describes the function that calculates the rolling average of a metric over a constant duration time window. |

## November 2021

| Article title | Description |
|--|--|
| [Automatic stop of inactive clusters](auto-stop-clusters.md) | New article. Inactive clusters are automatically stopped. |
| [Solution architectures](solution-architectures.md) | New article. Lists references to the architectures that include Azure Data Explorer. |
| [Delete data](kusto/concepts/delete-data.md)| Updated article. Added new sections for purge and soft delete. |

**Query**

| Article title | Description |
|--|--|
| [[Soft delete]](/kusto/concepts/data-soft-delete?view=azure-data-explorer&preserve-view=true) | New article. Describes the data soft delete function. |

## October 2021

| Article title | Description |
|--|--|
| [Create an Event Grid data connection using C#](create-event-grid-connection-sdk.md?tabs=c-sharp) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Create an Event Grid data connection using Python](create-event-grid-connection-sdk.md?tabs=python) | Updated article.
| [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Event Grid data connection](ingest-data-event-grid-overview.md) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Ingest blobs by subscribing to Event Grid notifications](ingest-data-event-grid-overview.md) | Updated article. Added Event Grid data connection from Azure portal.
| [Add cluster principals using C#](add-cluster-principal.md?tabs=csharp) | Updated article. AddedAllDatabasesMonitor role.
| [Add cluster principals using Python](add-cluster-principal.md?tabs=python) | Updated article. Added AllDatabasesMonitor role.
| [Add cluster principals using an Azure Resource Manager template](add-cluster-principal.md?tabs=arm) | Updated article. Added AllDatabasesMonitor role.
| [Add database principals using Python](add-database-principal.md?tabs=python) | Updated article. AddedAllDatabasesMonitor role.
| [Manage Azure Data Explorer database permissions](manage-database-permissions.md) | Updated article. Added AllDatabasesMonitor role.|

**Management**

| Article title | Description |
|--|--|
| [Role-based access control in Kusto](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true) | Updated article. Materialized views rename source table.
| [Cache policy (hot and cold cache)](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true) | Updated article. Caching with long storage.
| [Role-based access control in Kusto](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true)| Updated article. Using the AllDatabasesMonitor role.|

## September 2021

| Article title | Description |
|--|--|
| [Ingest data from event hub into Azure Data Explorer](create-event-hubs-connection.md?tabs=portalADX) | Updated article. Learn how to connect event hub with managed identity.|

**Query**

| Article title | Description |
|--|--|
| [Views](/kusto/query/schema-entities/views?view=azure-data-explorer&preserve-view=true)| New article. Learn how to use views, which are virtual tables based on the result-set of a query.|
| [Entity types](/kusto/query/schema-entities/index?view=azure-data-explorer&preserve-view=true)| Updated article. Added information on how to use views.

## August 2021

| Article title | Description |
|--|--|
| [Use wizard for ingestion with LightIngest (preview)](ingest-data-historical.md) | New article. Learn how to use a wizard for one-time ingestion of historical data with LightIngest.
| [Use one-click ingestion to create an event hub data connection](ingest-data-event-hub-overview.md)| Updated article. One click event hub experience.
| [Use LightIngest to ingest data into Azure Data Explorer](lightingest.md)| Updated article. Generate LightIngest commands - one click experience.

**Query**

| Article title | Description |
|--|--|
| [series_pow()](/kusto/query/series-pow-function?view=azure-data-explorer&preserve-view=true)| New article. Calculates the element-wise power of two numeric series inputs.
| [Aggregation function types at a glance](/kusto/query/aggregation-functions?view=azure-data-explorer&preserve-view=true) | New article. Lists aggregation functions, which perform a calculation on a set of values and return a single value.
| [Scalar function types at a glance](/kusto/query/scalar-functions?view=azure-data-explorer&preserve-view=true) | Updated article. Updated aggregation function and added series_pow.
| [materialized_view() function](/kusto/query/materialized-view-function?view=azure-data-explorer&preserve-view=true) | Updated article. Updated aggregation function.

**Management**

| Article title | Description |
|--|--|
| [.alter query weak consistency policy](/kusto/management/alter-query-weak-consistency-policy?view=azure-data-explorer&preserve-view=true) | New article.
| [Query weak consistency policy](/kusto/management/query-weak-consistency-policy?view=azure-data-explorer&preserve-view=true) | New article.
| [.show query weak consistency policy](/kusto/management/show-query-weak-consistency-policy?view=azure-data-explorer&preserve-view=true) | New article.

**Functions library**

| Article title | Description |
|--|--|
| [pair_probabilities_fl()](/kusto/functions-library/functions-library?view=azure-data-explorer&preserve-view=true) | New article. The function `pair_probabilities_fl()`calculates probabilities and metrics.
| [bartlett_test_fl()](/kusto/functions-library/bartlett-test-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `bartlett_test_fl()` performs the [Bartlett Test](https://en.wikipedia.org/wiki/Bartlett%27s_test).
| [levene_test_fl()](/kusto/functions-library/levene-test-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `levene_test_fl()` performs the [Levene Test](https://en.wikipedia.org/wiki/Levene%27s_test).
| [mann_whitney_u_test_fl()](/kusto/functions-library/mann-whitney-u-test-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `mann_whitney_u_test_fl()` performs the [Mann-Whitney U Test](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test).
| [wilcoxon_test_fl()](/kusto/functions-library/wilcoxon-test-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `wilcoxon_test_fl()` performs the [Wilcoxon Test](https://en.wikipedia.org/wiki/Wilcoxon_signed-rank_test).

## July 2021

| Article title | Description |
|--|--|
| [Monitor batching ingestion with metrics](using-diagnostic-logs.md) | New article. Learn how to use Azure Data Explorer metrics to monitor batching ingestion to Azure Data Explorer in Azure portal.
| [Create an external table using the Azure Data Explorer web UI wizard](external-table.md) | Updated article. New UI.
| [Use one-click ingestion to create an event hub data connection](ingest-data-event-hub-overview.md)| Updated article. New UI.
| [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](/azure/data-explorer/ingest-from-local-file) | Updated article. New UI.
| [Ingest data from a container/ADLS into Azure Data Explorer](/azure/data-explorer/ingest-from-container) | Updated article. New UI.
| [Create a table in Azure Data Explorer](create-table-wizard.md) | Updated article. New UI.

**Query**

| Article title | Description |
|--|--|
| [replace_string()](/kusto/query/replace-string-function?view=azure-data-explorer&preserve-view=true)| New article. Replaces all string matches with another string.
| [take_any() (aggregation function)](/kusto/query/take-any-aggregation-function?view=azure-data-explorer&preserve-view=true) | New article. Replaces any().
| [take_anyif() (aggregation function)](/kusto/query/take-anyif-aggregation-function?view=azure-data-explorer&preserve-view=true) | New article. Replaces anyif().
| [replace_regex()](/kusto/query/replace-regex-function?view=azure-data-explorer&preserve-view=true) | Updated article. Replace() function changed to replace_regex().

**Management**

| Article title | Description |
|--|--|
| [.alter extent tags retention policy](/kusto/management/alter-extent-tags-retention-policy?view=azure-data-explorer&preserve-view=true) | New article.
| [.delete extent tags retention policy](/kusto/management/delete-extent-tags-retention-policy?view=azure-data-explorer&preserve-view=true) | New article.
| [Extent tags retention policy](/kusto/management/extent-tags-retention-policy?view=azure-data-explorer&preserve-view=true) | New article. The extent tags retention policy controls the mechanism that automatically removes [extent tags](/kusto/management/extent-tags?view=azure-data-explorer&preserve-view=true) from tables, based on the age of the extents.
| [.show extent tags retention policy](/kusto/management/show-extent-tags-retention-policy?view=azure-data-explorer&preserve-view=true) | New article.
| [Stored query results](/kusto/management/stored-query-results?view=azure-data-explorer&preserve-view=true) | Updated article. General Availability.

**Functions library**

| Article title | Description |
|--|--|
 [two_sample_t_test_fl()](/kusto/functions-library/two-sample-t-test-fl) | New article. The function `two_sample_t_test_fl()` performs the [Two-Sample T-Test](https://en.wikipedia.org/wiki/Student%27s_t-test?view=azure-data-explorer&preserve-view=true#Independent_two-sample_t-test). |

## June 2021

| Article title | Description |
|--|--|
| -[Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs.md)<br />- [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md) | Updated articles. Document batching types. |

**Query**

| Article title | Description |
|--|--|
| [rows_near() plugin](/kusto/query/rows-near-plugin?view=azure-data-explorer&preserve-view=true) | New article. Finds rows near a specified condition.
| [has_any_ipv4()](/kusto/query/has-any-ipv4-function?view=azure-data-explorer&preserve-view=true) | New article. Returns a value indicating whether one of specified IPv4 addresses appears in a text.
| [has_any_ipv4_prefix()](/kusto/query/has-any-ipv4-prefix-function?view=azure-data-explorer&preserve-view=true) | New article. Returns a value indicating whether one of specified IPv4 address prefixes appears in a text.

**Management**

| Article title | Description |
|--|--|
| [IngestionBatching policy](/kusto/management/batching-policy?view=azure-data-explorer&preserve-view=true) | Updated article. Document batching types

## May 2021

| Article title | Description |
|--|--|
| [Use follower databases](follower.md) | Updated article. Added table level sharing. |

## April 2021

**Query**

| Article title | Description |
|--|--|
[has_ipv4()](/kusto/query/has-ipv4-function?view=azure-data-explorer&preserve-view=true) | New article. Returns a value indicating whether a specified IPv4 address appears in a text.
[has_ipv4_prefix()](/kusto/query/has-ipv4-prefix-function?view=azure-data-explorer&preserve-view=true) | New article. Returns a value indicating whether a specified IPv4 address prefix appears in a text.
[scan operator (preview)](/kusto/query/scan-operator?view=azure-data-explorer&preserve-view=true) | New article. Scans data, matches, and builds sequences based on the predicates.
[Query results cache](/kusto/query/query-results-cache?view=azure-data-explorer&preserve-view=true) | Updated article. Per shard query results cache added.
[The string data type](/kusto/query/scalar-data-types/string?view=azure-data-explorer&preserve-view=true) | Updated article.
[Null Values](/kusto/query/scalar-data-types/null-values?view=azure-data-explorer&preserve-view=true) | Updated article.

**Management**

| Article title | Description |
|--|--|
[Workload groups - Management commands](/kusto/management/show-workload-group-command?view=azure-data-explorer&preserve-view=true) | Updated article. General Availability (GA).
[Workload groups](/kusto/management/workload-groups?view=azure-data-explorer&preserve-view=true) | Updated article. General Availability (GA).
[Materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true) | Updated article. General Availability (GA).
[Materialized views policies](/kusto/management/materialized-views/materialized-view-policies?view=azure-data-explorer&preserve-view=true) | Updated article. General Availability (GA).

**Functions library**

| Article title | Description |
|--|--|
[time_weighted_avg_fl()](/kusto/functions-library/time-weighted-avg-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `time_weighted_avg_fl()` calculates the time weighted average of a metric in a given time window, over input time bins.

**API**

| Article title | Description |
|--|--|
[Request properties and ClientRequestProperties](/kusto/api/rest/request-properties?view=azure-data-explorer&preserve-view=true) | Updated article. Per shard query results cache added.|

## March 2021

| Article title | Description |
|--|--|
| [Create an external table (preview)](external-table.md) | New article. An external table is a schema entity that references data stored outside the Azure Data Explorer database. |

**Management**

| Article title | Description |
|--|--|
| - [Auto delete policy command](/kusto/management/show-auto-delete-policy-command?view=azure-data-explorer&preserve-view=true)<br />- [Auto delete policy](/kusto/management/auto-delete-policy?view=azure-data-explorer&preserve-view=true) | New articles. An auto delete policy on a table sets an expiry date for the table. |
| [Stored query results (Preview)](/kusto/management/stored-query-results?view=azure-data-explorer&preserve-view=true) | Updated article. Added async mode. |

**Functions library**

| Article title | Description |
|--|--|
| [binomial_test_fl()](/kusto/functions-library/binomial-test-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `binomial_test_fl()` performs the [binomial test](https://en.wikipedia.org/wiki/Binomial_test). |
| [comb_fl()](/kusto/functions-library/comb-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `comb_fl()`calculates *C(n, k)*, the number of [combinations](https://en.wikipedia.org/wiki/Combination) for selection of k items out of n, without order. |
| [factorial_fl()](/kusto/functions-library/factorial-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `factorial_fl()`calculates [factorial](https://en.wikipedia.org/wiki/Factorial) of positive integers (*n!*). |
| [perm_fl()](/kusto/functions-library/perm-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `perm_fl()`calculates *P(n, k)*, the number of [permutations](https://en.wikipedia.org/wiki/Permutation) for selection of k items out of n, with order. |

## February 2021

|Article title | Description|
|--|--|
[Optimize for high concurrency with Azure Data Explorer](high-concurrency.md) | New article. In this article, you learn to optimize your Azure Data Explorer setup for high concurrency.
| [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md) | Updated article. Explanation of table grid options.

**Query**

|Article title | Description|
|--|--|
[ipv4_is_in_range()](/kusto/query/ipv4-is-in-range-function?view=azure-data-explorer&preserve-view=true) | New article. Checks if IPv4 string address is in IPv4-prefix notation range.
[ipv4_netmask_suffix()](/kusto/query/ipv4-netmask-suffix-function?view=azure-data-explorer&preserve-view=true) | New article. Returns the value of the IPv4 netmask suffix from IPv4 string address.
[has_all operator](/kusto/query/has-all-operator?view=azure-data-explorer&preserve-view=true) | New article. `has_all` operator filters based on the provided set of values (all values must be present).
[row_rank()](/kusto/query/row-rank-dense-function) | New article. Returns the current row's rank in a [serialized row set](/kusto/query/window-functions?view=azure-data-explorer&preserve-view=true#serialized-row-set).
| [Null Values](/kusto/query/scalar-data-types/null-values?view=azure-data-explorer&preserve-view=true) | Updated article. New behavior in Engine V3.
| [String operators](/kusto/query/datatypes-string-operators?view=azure-data-explorer&preserve-view=true) | Updated article. String term indexing for Engine V3.

**Management**

|Article title | Description|
|---|---|
| [Materialized views data purge](/kusto/management/materialized-views/materialized-view-purge?view=azure-data-explorer&preserve-view=true) | New article. [Data purge](/kusto/concepts/data-purge?view=azure-data-explorer&preserve-view=true) commands can be used to purge records from materialized views.|
|[.alter materialized-view lookback](/kusto/management/materialized-views/materialized-view-alter-lookback?view=azure-data-explorer&preserve-view=true) | New article. Alters the `lookback` value of an existing materialized view.|
|[.alter materialized-view autoUpdateSchema](/kusto/management/materialized-views/materialized-view-alter-autoupdateschema?view=azure-data-explorer&preserve-view=true) | New article. Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`.|
|[.alter materialized-view docstring](/kusto/management/materialized-views/materialized-view-alter-docstring?view=azure-data-explorer&preserve-view=true) | New article. Alters the DocString value of an existing materialized view.|
|[.alter materialized-view folder](/kusto/management/materialized-views/materialized-view-alter-folder?view=azure-data-explorer&preserve-view=true) | New article. Alters the folder value of an existing materialized view.|
|[.create-or-alter materialized-view](/kusto/management/materialized-views/materialized-view-create-or-alter?view=azure-data-explorer&preserve-view=true) | New article. Creates a materialized view or alters an existing materialized view.|
|[Materialized views policies](/kusto/management/materialized-views/materialized-view-policies?view=azure-data-explorer&preserve-view=true) | New article. Includes information about policies that can be set on a materialized view.|
|[Request queuing policy (Preview)](/kusto/management/request-queuing-policy?view=azure-data-explorer&preserve-view=true) | New article. A workload group's request queuing policy controls queueing of requests for delayed execution, once a certain threshold of concurrent requests is exceeded.|

**Functions library**

|Article title | Description|
|--|--|
| [series_dbl_exp_smoothing_fl()](/kusto/functions-library/series-dbl-exp-smoothing-fl?view=azure-data-explorer&preserve-view=true) | New article. Applies a double exponential smoothing filter on a series.

## January 2021

|Article title | Description|
|--|--|
[Azure Policy Regulatory Compliance controls](security-controls-policy.md) | New article. This page lists the **compliance domains** and **security controls**.
[Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md) | New article. In this article, you'll learn how to give cluster access to principals from another tenant.

**Management**

|Article title | Description|
|--|--|
[Clean extent containers commands](/azure/data-explorer/kusto/management/extents-overview) | New article. Describes the `.clean databases extentcontainers` and `.show database extentcontainers clean operations` commands.
[Request classification policy (Preview)](/kusto/management/request-classification-policy?view=azure-data-explorer&preserve-view=true)<br>[Request classification policy (Preview) - Management commands](/kusto/management/show-cluster-policy-request-classification-command?view=azure-data-explorer&preserve-view=true) | New articles. The classification process assigns incoming requests to a workload group, based on the characteristics of the requests.
[Request limits policy (Preview)](/kusto/management/request-limits-policy?view=azure-data-explorer&preserve-view=true) | New article. A workload group's request limits policy allows limiting the resources used by the request during its execution.
[Request rate limit policy (Preview)](/kusto/management/request-rate-limit-policy?view=azure-data-explorer&preserve-view=true) | New article. The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group.
[Workload groups (Preview)](/kusto/management/workload-groups?view=azure-data-explorer&preserve-view=true)<br>[Workload groups (Preview) - Management commands](/kusto/management/show-workload-group-command?view=azure-data-explorer&preserve-view=true) | New articles. A workload group serves as a container for requests (queries, commands) that have similar classification criteria. A workload allows for aggregate monitoring of the requests, and defines policies for the requests.
[Queries management](/kusto/management/show-queries-command?view=azure-data-explorer&preserve-view=true) | Updated article. Syntax updated

## December 2020

|Article title | Description|
|--|--|
[Ingestion error codes in Azure Data Explorer](error-codes.md) | New article. This list contains error codes you may come across during [ingestion](ingest-data-overview.md).

**Management**

|Article title | Description|
|--|--|
[.create table based-on](/kusto/management/create-table-based-on-command?view=azure-data-explorer&preserve-view=true)  | New article. Creates a new empty table based on existing table.
[Stored query results (Preview)](/kusto/management/stored-query-results?view=azure-data-explorer&preserve-view=true) | New article. Stored query results is a mechanism that temporarily stores the result of a query on the service.
[Create and alter Azure Storage external tables](/kusto/management/external-tables-azure-storage?view=azure-data-explorer&preserve-view=true) | Updated article. Document `filesPreview` and `dryRun` external table definition options
[Export data to an external table](/kusto/management/data-export/export-data-to-an-external-table?view=azure-data-explorer&preserve-view=true) | Updated article. New external table syntax in export docs

**Functions library**

|Article title | Description|
|--|--|
[series_metric_fl()](/kusto/functions-library/series-metric-fl?view=azure-data-explorer&preserve-view=true) | New article. The `series_metric_fl()` function selects and retrieves time series of metrics ingested to Azure Data Explorer using the Prometheus monitoring system.
[series_rate_fl()](/kusto/functions-library/series-rate-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `series_rate_fl()` calculates the average rate of metric increase per second.
[series_fit_lowess_fl()](/kusto/functions-library/series-fit-lowess-fl?view=azure-data-explorer&preserve-view=true) | New article. The function `series_fit_lowess_fl()` applies a LOWESS regression on a series.

## November 2020

|Article title | Description|
|--|--|
[Azure Policy built-in definitions](policy-reference.md) | New article. Index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions.
[Use one-click ingestion to create an event hub data connection](ingest-data-event-hub-overview.md) | New article. Connect an event hub to a table using the [one-click ingestion](ingest-data-overview.md) experience.
| [Configure managed identities for your cluster](configure-managed-identities-cluster.md) | Updated article. Supports both user-assigned managed identities and system-assigned managed identities
| [Create a table](create-table-wizard.md) | Updated article. General availability (GA). |
 | [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md) | Updated article. New capabilities.
|  [What is one-click ingestion?](ingest-data-overview.md) | Updated article. Added ingestion from JSON nested levels. General availability (GA).
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Updated article. New dashboard visuals and parameter changes.

**Query**

|Article title | Description|
|--|--|
[mysql_request plugin (Preview)](/kusto/query/mysql-request-plugin?view=azure-data-explorer&preserve-view=true) | New article. The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results.
[ipv4_lookup plugin](/kusto/query/ipv4-lookup-plugin?view=azure-data-explorer&preserve-view=true) | New article. The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](/kusto/query/ipv4-is-private-function?view=azure-data-explorer&preserve-view=true) | New article. Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](/kusto/query/splunk-cheat-sheet?view=azure-data-explorer&preserve-view=true) | New article. This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto.
[gzip_compress_to_base64_string()](/kusto/query/gzip-base64-compress?view=azure-data-explorer&preserve-view=true) | New article. Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](/kusto/query/gzip-base64-decompress?view=azure-data-explorer&preserve-view=true) | New article. Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](/kusto/query/array-reverse-function?view=azure-data-explorer&preserve-view=true) | New article. Reverses the order of the elements in a dynamic array.

**Management**

|Article title | Description|
|--|--|
[.disable plugin](/kusto/management/disable-plugin?view=azure-data-explorer&preserve-view=true) | New article. Disables a plugin.
[.enable plugin](/kusto/management/enable-plugin?view=azure-data-explorer&preserve-view=true) | New article. Enables a plugin.
[.show plugins](/kusto/management/show-plugins?view=azure-data-explorer&preserve-view=true) | New article. Lists all plugins of the cluster.
| [Follower commands](/kusto/management/cluster-follower?view=azure-data-explorer&preserve-view=true) | Updated article. Syntax changed, added `.alter follower database prefetch-extents`. |

**Functions library**

|Article title | Description|
|--|--|
[series_downsample_fl()](/kusto/functions-library/series-downsample-fl) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)?view=azure-data-explorer&preserve-view=true#Downsampling_by_an_integer_factor).
[series_exp_smoothing_fl()](/kusto/functions-library/series-exp-smoothing-fl?view=azure-data-explorer&preserve-view=true) | Applies a basic exponential smoothing filter on a series.
