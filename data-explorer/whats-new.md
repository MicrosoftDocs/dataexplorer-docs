---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/01/2024
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## January 2024

**General**

| Article title | Description |
|--|--|
| - [Integrations overview](integrate-overview.md) <br/> - [Data integrations overview](integrate-data-overview.md) <br/> - [Query integrations overview](integrate-query-overview.md) <br/> - [Visualize integrations overview](integrate-visualize-overview.md)  | New articles. Describes the available data connectors, tools, and query integrations, and updated article on the available visualize integrations.|
| [Schema optimization best practices](schema-best-practice.md)| New article. Describes the best practices for schema design in Azure Data Explorer.|

## December 2023

**Query**

| Article title | Description |
|--|--|
|-[Scalar function types at a glance](kusto/query/scalarfunctions.md) <br/> -[series_cosine_similarity()](kusto/query/series-cosine-similarity-function.md) <br/> - [series_magnitude()](kusto/query/series-magnitude-function.md) <br/> - [series_sum()](kusto/query/series-sum-function.md) | New articles. Describes how to calculate series elements, and added to scalar functions overview.|
|[series_dot_product()](kusto/query/series-dot-productfunction.md)| Updated article. Added section on performance optimization.|

## November 2023

**General**

| Article title | Description |
|--|--|
| [Migrate a Virtual Network injected cluster to private endpoints (Preview)](security-network-migrate-vnet-to-private-endpoint.md) | New article. Describes how to migrate a Virtual Network injected Azure Data Explorer Cluster to private endpoints.|
| - [Ingest data from Splunk Universal Forwarder](ingest-data-splunk-uf.md) <br/> - [Ingest data with Apache Flink](ingest-data-flink.md) <br/> - [Data connectors overview](connector-overview.md)| New articles that describe how to ingest data with Splunk Universal Forwarder and Apache Flink, and updated data connector overview. |
| [Use follower databases](follower.md) | Updated article. Update limitations for clusters using customer-managed keys.|
| [Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md)| Updated article. Refreshed content.|
| [Create a Microsoft Entra application registration in Azure Data Explorer](provision-entra-id-app.md) | Updated article. Added section on creating a Microsoft Entra service principal.|

**Management**

| Article title | Description |
|--|--|
| [Materialized views use cases](kusto/management/materialized-views/materialized-view-use-cases.md) | New article. Describes common and advanced use cases for materialized views.|

## October 2023

**General**

| Article title | Description |
|--|--|
|- [Ingest data with Fluent Bit](fluent-bit.md) <br/> - [Data connectors overview](connector-overview.md)| New article that describes how to ingest data from Fluent Bit, and updated data connector overview with additional capabilities.|
| [Connect a cluster behind a private endpoint to a Power BI service](power-bi-private-endpoint.md)| New article. Describes how to connect an Azure Data Explorer cluster behind a private endpoint to a Power BI service.|

## September 2023

**General**

| Article title | Description |
|--|--|
|- [KQL graph semantics overview (Preview)](graph-overview.md) <br/> - [KQL graph semantics best practices (Preview)](graph-best-practices.md) <br/> - [Common scenarios for using KQL graph semantics (Preview)?](graph-scenarios.md) | New articles. Describes how to use Kusto Query Language (KQL) graph semantics.|
| [How to ingest historical data](ingest-data-historical.md) | New article. Describes how to use LightIngest to ingest historical or ad hoc data into Azure Data Explorer.|
|- [Ingest data from Splunk to Azure Data Explorer](ingest-data-splunk.md) <br/> - [Data connectors overview](connector-overview.md)| New article that describes how to ingest data into Azure Data Explorer from Splunk, and updated data connector overview with additional capabilities.|
| [KQL learning resources](kql-learning-resources.md) | New article. Describes the different learning resources for ramping up on KQL.|
| [Dashboard-specific visuals](dashboard-visuals.md)| New article. Describes the visualizations available in Azure Data Explorer web UI or dashboards.|
| [Create a dashboard base query](base-query.md) | New article. Describes how to create a base query for an Azure Data Explorer dashboard.|

**Management**

| Article title | Description |
|--|--|
|- [.alter-merge database policy ingestionbatching command](kusto/management/alter-merge-database-ingestion-batching-policy.md) <br/> - [.alter-merge table policy ingestionbatching command](kusto/management/alter-merge-table-ingestion-batching-policy.md)| New articles. Describes how to set the ingestion batching policy.|

**Query**

| Article title | Description |
|--|--|
|- [Graph operators (Preview)](kusto/query/graph-operators.md) <br/> - [graph-match operator (Preview)](kusto/query/graph-match-operator.md) <br/> - [graph-merge operator (Preview)](kusto/query/graph-merge-operator.md) <br/> - [graph-to-table operator (Preview)](kusto/query/graph-to-table-operator.md) <br/> - [make-graph operator (Preview)](kusto/query/make-graph-operator.md) | New articles. Describes how to use graph operators. |
| [Plotly (preview)](kusto/query/visualization-plotly.md) | New article. Describes how to visualize data using the Plotly graphics library.|

## August 2023

**API**

| Article title | Description |
|--|--|
| [Create an app to get data using queued ingestion](kusto/api/get-started/app-queued-ingestion.md)| New article. Describes how to create an app to get data using queued ingestion of the Kusto client libraries.|

**General**

| Article title | Description |
|--|--|
|- [Get data from file](get-data-file.md) <br/> - [Get data from Azure storage](get-data-storage.md) <br/> - [Get data from Amazon S3](get-data-amazon-s3.md) <br/> - [Create an Event Hubs data connection](create-event-hubs-connection.md) | New articles. Describes the new Get data experience in Azure Data Explorer.|
|- [Delete a cluster](delete-cluster.md) <br/> - [Delete a database](delete-database.md) | New articles. Describes how to delete an Azure Data Explorer cluster and database.|
| [Monitor ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs.md)| Updated article. Refreshed content and added journal log data tab.|

**Functions library**

| Article title | Description |
|--|--|
| [series_clean_anomalies_fl()](kusto/functions-library/series-clean-anomalies-fl.md)| New article. Describes how to clean anomalous points in a series.|

**Management**

| Article title | Description |
|--|--|
| [Use a managed identity to run an update policy](kusto/management/update-policy-with-managed-identity.md)| New article. Describes how to configure a managed identity to run an update policy.|
| [.show databases entities command](kusto/management/show-databases-entities.md)| New article. describes how to show a database's entities.|
| [.show database extents partitioning statistics](kusto/management/show-database-extents-partitioning-statistics.md)| New article. Describes how to display a database's partitioning statistics.|

**Query**

| Article title | Description |
|--|--|
| [Entity names](kusto/query/schema-entities/entity-names.md)| Updated article. Refreshed identifier naming rules and references in queries.|
| [partition operator](kusto/query/partition-operator.md)| Updated article. Refreshed content and added parameters.|
| [scan operator](kusto/query/scan-operator.md)| Updated article. Added scan logic walkthrough.|
| [top-nested operator](kusto/query/top-nested-operator.md)| Updated article. Refreshed content.|

## July 2023

**API**

| Article title | Description |
|--|--|
| [Connection strings overview](kusto/api/connection-strings/index.md)| Updated article. Added privacy and security measures.|
| [SQL external table authentication methods](kusto/api/connection-strings/sql-authentication-methods.md)| Updated article. Refreshed supported authentication methods.|

**General** 

| Article title | Description |
|--|--|
| [Query data using MATLAB](query-matlab.md)| New article. Describes how to query data from Azure Data Explorer using MATLAB.|
| [Migration guide: Elasticsearch to Azure Data Explorer](migrate-elasticsearch-to-azure-data-explorer.md)| New article. Describes how to migrate your Elasticsearch data to Azure Data Explorer.|
| [Visualize data from Azure Data Explorer in Grafana](grafana.md)| Updated article. Added Azure Managed Grafana.|

**Management**

| Article title | Description |
|--|--|
[Data mappings](kusto/management/mappings.md)| Updated article. Added supported data formats for mapping transformations.|
|- [Export data to SQL](kusto/management/data-export/export-data-to-sql.md) <br/> - [Create and alter SQL external tables](kusto/management/external-sql-tables.md)| Updated articles. Added supported authentication methods and parameters .|

**Query**

| Article title | Description |
|--|--|
|- [punycode_domain_from_string()](kusto/query/punycode-domain-from-string-function.md) <br/> - [punycode_domain_to_string()](kusto/query/punycode-domain-to-string-function.md)| New articles. Describes how to encode and decode a punycode domain name.|
| [geo_line_to_s2cells()](kusto/query/geo-line-to-s2cells-function.md)| New article. Describes how to use the geo_line_to_2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.|
| [extract_json()](kusto/query/extract-json-function.md)| Updated article. Added new example.|
| [Pivot chart](kusto/query/visualization-pivotchart.md)| Updated article. Added new example.|

## June 2023

**API**

| Article title | Description |
|--|--|
|- [Kusto.Language Overview](kusto/api/netfx/about-kusto-language.md) <br/> - [Define schemas for semantic analysis with Kusto.Language](kusto/api/netfx/kusto-language-define-schemas.md) <br/> - [Parse queries and commands with Kusto.Language](kusto/api/netfx/kusto-language-parse-queries.md)| New articles. Describes how to use the Kusto.Language library for parsing queries.|
|[Management commands: Create an app to run management commands](kusto/api/get-started/app-management-commands.md)| New article. Describes how to create an app to run management commands using Kusto client libraries.|

**Query**

| Article title| Description|
|--|--|
|- [Join operator](kusto/query/join-operator.md) <br/> - [fullouter join](kusto/query/join-fullouter.md) <br/> - [inner join](kusto/query/join-inner.md) <br/> - [innerunique join](kusto/query/join-innerunique.md) <br/> - [leftanti join](kusto/query/join-leftanti.md) <br/> - [leftouter join](kusto/query/join-leftouter.md) <br/> - [leftsemi join](kusto/query/join-leftsemi.md) <br/> - [rightanti join](kusto/query/join-rightanti.md) <br/> - [rightouter join](kusto/query/join-rightouter.md) <br/> - [rightsemi join](kusto/query/join-rightsemi.md) | Updated and new articles. Refreshed `join` overview and added topics describing each `join` kind.
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
|[Syntax conventions for reference documentation](kusto/query/syntax-conventions.md)| New article. Describes the syntax conventions for the Kusto Query Language and management command documentation.|
|- [punycode_from_string()](kusto/query/punycode-from-string-function.md) <br/> - [punycode_to_string()](kusto/query/punycode-to-string-function.md)| New articles. Describes how to encode and decode Punycode.|

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
|- [Kusto.Explorer code features](kusto/tools/kusto-explorer-code-features.md) <br/> - [Kusto Explorer options](kusto/tools/kusto-explorer-options.md) <br/> - [Kusto.Explorer keyboard shortcuts (hot keys)](kusto/tools/kusto-explorer-shortcuts.md) <br/> - [Using Kusto.Explorer](kusto/tools/kusto-explorer-using.md) <br/> - [Kusto.Explorer installation and user interface](kusto/tools/kusto-explorer.md) | Updated articles. Refreshed content.|

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
