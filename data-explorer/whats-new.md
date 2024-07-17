---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/01/2024
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## June 2024

**General**

|Article title | Description|
|--|--|
| [How the reservation discount is applied to Azure Data Explorer](pricing-reservation-discount.md) | New article. Learn how the reservation discount is applied to Azure Data Explorer markup meter. |
| [Prepay for Azure Data Explorer markup units with Azure Data Explorer reserved capacity](pricing-reserved-capacity.md) | Updated article. Reservation discount article added. |
| [Access the data profile of a table](data-profile.md) | Updated article. Updated instruction on how to open the data profile. |
| [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md) | UPdated article. Updated instruction on how to use the KQL tools in the toolbar. |
| [Explore the samples gallery](web-ui-samples-query.md) | Updated article. Updated instruction on how to navigate to other tutorials. |

**Management**

|Article title | Description|
|--|--|
| [.alter-merge table policy mirroring command](kusto/management/alter-merge-mirroring-policy-command.md)| New article. Learn how to use the `.alter-merge table policy mirroring` command to create a logical copy of tables of your database.|
| [.delete table policy mirroring command](kusto/management/delete-table-mirroring-policy-command.md)| New article. Learn how to use the `.delete table policy mirroring` command to delete a table's logical copy. |
| [Mirroring policy](kusto/management/mirroring-policy.md)| New article. Learn how to use the mirroring policy. |
| [.show table mirroring operations command](kusto/management/show-table-mirroring-operations-command.md)| New article. Learn how to use the `.show table mirroring operations` command to check the mirroring policy operations. |
| [.show table mirroring operations exported artifacts command](kusto/management/show-table-mirroring-operations-exported-artifacts.md)| New article. Learn how to use the `.show table mirroring operations exported artifacts` command to check the mirroring operations exported artifacts. |
| [.show table mirroring operations failures](kusto/management/show-table-mirroring-operations-failures.md) | New article. Learn how to use the `.show table mirroring operations failures` command to check the mirroring operations failures. |
| [.show table policy mirroring command](kusto/management/show-table-mirroring-policy-command.md) | New article. Learn how to use the `.show table policy mirroring` command to display the table's mirroring policy. |
| [Policies overview](kusto/management/policies.md) | Updated article. Mirroring added to policies.|
| [Create and alter Azure Storage external tables](kusto/management/external-tables-azure-storage.md) | Updated article. Mirroring commands added. |

**Query**

|Article title | Description|
|--|--|
|[cosmosdb_sql_request plugin](kusto/query/cosmosdb-plugin.md) | Updated article. Azure Resource Manager example added. |

## May 2024

No updates.

## April 2024

**Management**

|Article title | Description|
|--|--|
| [.execute cluster script command](kusto/management/execute-cluster-script.md) | New article. Describes how to use the `.execute cluster script` command to execute a batch of management commands in the scope of a cluster. |

## March 2024

**API**

|Article title | Description|
|--|--|
| [Use Kusto cmdlets in Azure PowerShell](kusto/api/powershell/azure-powershell.md) | New article. Describes how to use Kusto cmdlets in Azure PowerShell. |

**General**

|Article title | Description|
|--|--|
| [Create an Azure Data Explorer cluster and database](create-cluster-database.md) | Updated article. Updated with instructions to set up Azure PowerShell to run Kusto cmdlets. |
| [Migrate your cluster to support multiple availability zones (Preview)](migrate-cluster-to-multiple-availability-zone.md) | Updated article. Updated how to get the list of availability zones for your cluster's region in Azure portal. | 

**Management**

| Article title | Description|
|--|--|
| - [What are common scenarios for using table update policies](kusto/management/update-policy-common-scenarios.md)<br />- [Tutorial: Route data using table update policies](kusto/management/update-policy-tutorial.md)<br />- [Update policy overview](kusto/management/update-policy.md) | New and updated articles. Describes common use cases for how to use *update table policies* to perform complex transformations and route results to destination tables. |
| [Parquet mapping](kusto/management/parquet-mapping.md) | Updated article. Added parquet type conversions table to provide a mapping of Parquet field types, and the table column types they can be converted to. |

## February 2024

**General**

|Article title | Description|
|--|--|
|- [Azure Data Explorer web UI query overview](web-ui-query-overview.md)<br/>- [Access the data profile of a table](data-profile.md)| New article that describes how to access the data profile of a table in the Azure Data Explorer web UI, and updated web UI query overview.|
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)| Updated article. Added section on embedding images in dashboard tiles.|
| [Create an Event Grid data connection for Azure Data Explorer](create-event-grid-connection.md)| Updated article. Refreshed content.|
| [How to ingest historical data into Azure Data Explorer](ingest-data-historical.md)| Updated article. Refreshed content.|

**Management**

|Article title| Description|
|--|--|
| [Apply row-level security on SQL external tables](kusto/management/row-level-security-external-sql.md)| New article. Describes how to create a row-level security solution with Azure Data Explorer SQL external tables.|
| [.update table command (preview)](kusto/management/update-table-command.md)| New article. Describes how to use the `.update table` command to perform transactional data updates.|
|- [Stored query results](kusto/management/stored-query-results.md)<br/>- [.set stored_query_result command](kusto/management/set-stored-query-result-command.md)<br/>- [.show stored_query_result command](kusto/management/show-stored-query-result-command.md)<br/>- [.drop stored_query_result command](kusto/management/drop-stored-query-result-command.md)<br/>- [stored_query_result()](kusto/query/stored-query-result-function.md)| New articles. Describe how to manage stored query results.|
| [Continuous data export overview](kusto/management/data-export/continuous-data-export.md)| Updated article. Added section on continuous export to delta table, and refreshed limitations.|

**Query**

|Article title| Description|
|--|--|
| [sort operator](kusto/query/sort-operator.md)| Updated article. Added section on the use of special floating-point values.|

## January 2024

**General**

| Article title | Description |
|--|--|
| - [Integrations overview](integrate-overview.md) <br/> - [Data integrations overview](integrate-data-overview.md) <br/> - [Query integrations overview](integrate-query-overview.md) <br/> - [Visualize integrations overview](integrate-visualize-overview.md)  | New articles. Describes the available data connectors, tools, and query integrations, and updated article on the available visualize integrations.|
| [Schema optimization best practices](schema-best-practice.md)| New article. Describes the best practices for schema design in Azure Data Explorer.|

## December 2023

**General**

| Article title | Description |
|--|--|
| [Migrate your cluster to support multiple availability zones](migrate-cluster-to-multiple-availability-zone.md)| New article. Describes how to migrate your cluster to support multiple availability zones.|

**Query**

| Article title | Description |
|--|--|
|-[Scalar function types at a glance](kusto/query/scalarfunctions.md) <br/> -[series_cosine_similarity()](kusto/query/series-cosine-similarity-function.md) <br/> - [series_magnitude()](kusto/query/series-magnitude-function.md) <br/> - [series_sum()](kusto/query/series-sum-function.md) | New articles. Describes how to calculate series elements, and added to scalar functions overview.|
|[series_dot_product()](kusto/query/series-dot-productfunction.md)| Updated article. Added section on performance optimization.|

## November 2023

**General**

| Article title | Description |
|--|--|
| [Migrate a Virtual Network injected cluster to private endpoints (Preview)](security-network-migrate-vnet-to-private-endpoint.md)| New article. Describes how to migrate a Virtual Network injected Azure Data Explorer Cluster to private endpoints.|
| - [Ingest data from Splunk Universal Forwarder](ingest-data-splunk-uf.md) <br/> - [Ingest data with Apache Flink](ingest-data-flink.md) <br/> - [Data connectors overview](connector-overview.md)| New articles that describe how to ingest data with Splunk Universal Forwarder and Apache Flink, and updated data connector overview.|
| [Use follower databases](follower.md)| Updated article. Update limitations for clusters using customer-managed keys.|
| [Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md)| Updated article. Refreshed content.|
| [Create a Microsoft Entra application registration in Azure Data Explorer](provision-entra-id-app.md)| Updated article. Added section on creating a Microsoft Entra service principal.|

**Management**

| Article title | Description |
|--|--|
| [Materialized views use cases](kusto/management/materialized-views/materialized-view-use-cases.md)| New article. Describes common and advanced use cases for materialized views.|

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
| [How to ingest historical data](ingest-data-historical.md)| New article. Describes how to use LightIngest to ingest historical or ad hoc data into Azure Data Explorer.|
|- [Ingest data from Splunk to Azure Data Explorer](ingest-data-splunk.md) <br/> - [Data connectors overview](connector-overview.md)| New article that describes how to ingest data into Azure Data Explorer from Splunk, and updated data connector overview with additional capabilities.|
| [KQL learning resources](kql-learning-resources.md)| New article. Describes the different learning resources for ramping up on KQL.|
| [Dashboard-specific visuals](dashboard-visuals.md)| New article. Describes the visualizations available in Azure Data Explorer web UI or dashboards.|
| [Create a dashboard base query](base-query.md)| New article. Describes how to create a base query for an Azure Data Explorer dashboard.|

**Management**

| Article title | Description |
|--|--|
|- [.alter-merge database policy ingestionbatching command](kusto/management/alter-merge-database-ingestion-batching-policy.md) <br/> - [.alter-merge table policy ingestionbatching command](kusto/management/alter-merge-table-ingestion-batching-policy.md)| New articles. Describes how to set the ingestion batching policy.|

**Query**

| Article title | Description |
|--|--|
|- [Graph operators (Preview)](kusto/query/graph-operators.md) <br/> - [graph-match operator (Preview)](kusto/query/graph-match-operator.md) <br/> - [graph-to-table operator (Preview)](kusto/query/graph-to-table-operator.md) <br/> - [make-graph operator (Preview)](kusto/query/make-graph-operator.md) | New articles. Describes how to use graph operators. |
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
| [.show databases entities command](kusto/management/show-databases-entities.md)| New article. Describes how to show a database's entities.|
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
|- [Export data to SQL](kusto/management/data-export/export-data-to-sql.md) <br/> - [Create and alter SQL external tables](kusto/management/external-sql-tables.md)| Updated articles. Added supported authentication methods and parameters.|

**Query**

| Article title | Description |
|--|--|
|- [punycode_domain_from_string()](kusto/query/punycode-domain-from-string-function.md) <br/> - [punycode_domain_to_string()](kusto/query/punycode-domain-to-string-function.md)| New articles. Describes how to encode and decode a punycode domain name.|
| [geo_line_to_s2cells()](kusto/query/geo-line-to-s2cells-function.md)| New article. Describes how to use the geo_line_to_2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.|
| [extract_json()](kusto/query/extract-json-function.md)| Updated article. Added new example.|
| [Pivot chart](kusto/query/visualization-pivotchart.md)| Updated article. Added new example.|
