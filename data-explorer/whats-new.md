---
title: What's new in Azure Data Explorer
description: What's new in the Azure Data Explorer docs
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: 
ms.date: 12/15/2020
---
# What's new in Azure Data Explorer

Find new and updated content in Azure Data Explorer.

## November 2020

Welcome to what's new in the Azure Data Explorer docs from November 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

Name | Notes
---|---
[mysql_request plugin (Preview)](./kusto/query/mysqlrequest-plugin.md) | The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results. The query may return more then one rowset, but only the first rowset is made available for the rest of the Kusto query. 
[ipv4_lookup plugin](./kusto/query/ipv4-lookup-plugin.md) | The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](./kusto/query/ipv4-is-privatefunction.md) | Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](./kusto/query/splunk-cheat-sheet.md) | This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto. Direct comparisons are made between the two to highlight key differences and similarities, so you can build on your existing knowledge.
[gzip_compress_to_base64_string()](./kusto/query/gzip-base64-compress.md) | Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](./kusto/query/gzip-base64-decompress.md) | Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](./kusto/query/array-reverse-function.md) | Reverses the order of the elements in a dynamic array.

#### Functions library

Name | Notes
---|---
[series_downsample_fl()](./kusto/functions-library/series-downsample-fl.md) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). 
[series_exp_smoothing_fl()](./kusto/functions-library/series-exp-smoothing-fl.md) | Applies a basic exponential smoothing filter on a series.

#### Management

Name | Notes
---|---
[.disable plugin](./kusto/management/disable-plugin.md) | Disables a plugin.
[.enable plugin](./kusto/management/enable-plugin.md) | Enables a plugin.
[.show plugins](./kusto/management/show-plugins.md) | Lists all plugins of the cluster.

#### General

Name | Notes
---|---
[Azure Policy built-in definitions for Azure Data Explorer](policy-reference.md) | This page is an index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions for Azure Data Explorer. 
[Use one-click ingestion to create an Event Hub data connection for Azure Data Explorer](one-click-event-hub.md) | In this article, you connect an Event Hub to a table in Azure Data Explorer using the [one-click ingestion](ingest-data-one-click.md) experience.


### Updated articles

Ignoring PR 1273: Update partitioningpolicy.md
Ignoring PR 1266: Update ingest-data-logstash.md
Ignoring PR 1263: Update make-bag-aggfunction.md
Ignoring PR 1250: Update create-cluster-database-portal.md
Ignoring PR 1243: Update data-purge.md
Ignoring PR 1239: Update ClientRequestProperties
Ignoring PR 1224: Update numoperators.md
Ignoring PR 1220: Update gettypefunction.md
Ignoring PR 1219: Update countoperator.md
Ignoring PR 1216: Update tools-integrations-overview.md
Ignoring PR 1212: Update indexofregexfunction.md
Ignoring PR 1211: Update query-throttling-policy.md
Ignoring PR 1204: Update cluster-follower.md
Ignoring PR 1200: Update lightingest.md
Ignoring PR 1195: Update cluster-follower.md
Ignoring PR 1183: Update gzip-base64-compress.md
Ignoring PR 1180: Update hll-merge-aggfunction.md
Ignoring PR 1177: Update sandboxes.md
Ignoring PR 1171: Update materialized-view-create.md
Ignoring PR 1166: Update isnotnullfunction.md
Ignoring PR 1158: Update row-level-security-policy.md
Ignoring PR 448: Update datatypes-string-operators.md

#### Query

- [externaldata operator](./kusto/query/externaldata-operator.md)
  - Management commands in-line-code
- [mysql_request plugin (Preview)](./kusto/query/mysqlrequest-plugin.md)
  - Management commands in-line-code
  - Add mysql_request() preview plugin - Original PR Alex S #1164
  - Add mysql_request() preview plugin into the docs
- [render operator](./kusto/query/renderoperator.md)
  - Localization metadata
  - edit pass: Kusto samples, tutorial, Splunk cheat sheet
- [Samples](./kusto/query/samples.md)
  - Localization metadata
  - edit pass: Kusto samples, tutorial, Splunk cheat sheet
  - Azure Monitor log query restructure
- [Tutorial](./kusto/query/tutorial.md)
  - Localization metadata
  - Broken link fixes
  - edit pass: Kusto samples, tutorial, Splunk cheat sheet
  - Azure Monitor log query restructure
- [partition operator](./kusto/query/partitionoperator.md)
  - partition operator fix docs
- [Null Values](./kusto/query/scalar-data-types/null-values.md)
  - Pivot warning null values
- [Scalar function types](./kusto/query/scalarfunctions.md)
  - Document ipv4_is_private() function
  - Added array_reverse()
- [Splunk to Kusto Query Language map](./kusto/query/splunk-cheat-sheet.md)
  - edit pass: Kusto samples, tutorial, Splunk cheat sheet
  - Azure Monitor log query restructure
- [parse_command_line()](./kusto/query/parse-command-line.md)
  - parsertype parameter is case sensitive
- [gzip_compress_to_base64_string()](./kusto/query/gzip-base64-compress.md)
  - gzip compress and decompress functions documentation fixes
  - documentation for gzip compress/ decompress commands
- [gzip_decompress_from_base64_string()](./kusto/query/gzip-base64-decompress.md)
  - gzip compress and decompress functions documentation fixes
  - documentation for gzip compress/ decompress commands
- [infer_storage_schema plugin](./kusto/query/inferstorageschemaplugin.md)
  - infer_storage_schema: add example of using inferred schema
- [Cross-database and cross-cluster queries](./kusto/query/cross-cluster-or-database-queries.md)
  - Azure Monitor log query restructure

#### Functions library

- [series_downsample_fl()](./kusto/functions-library/series-downsample-fl.md)
  - Adding series_downsample_fl()
- [series_exp_smoothing_fl()](./kusto/functions-library/series-exp-smoothing-fl.md)
  - Add series_exp_smoothing_fl()

#### Management

- [Export data to storage](./kusto/management/data-export/export-data-to-storage.md)
  - Export: storage failures during export commands
- [.disable plugin](./kusto/management/disable-plugin.md)
  - Add mysql_request() preview plugin - Original PR Alex S #1164
- [.enable plugin](./kusto/management/enable-plugin.md)
  - Add mysql_request() preview plugin - Original PR Alex S #1164
- [.show database schema commands](./kusto/management/show-schema-database.md)
  - Update show-schema-database.md #1222
- [Continuous data export overview](./kusto/management/data-export/continuous-data-export.md)
  - Export: storage failures during export commands
- [Export data to an external table](./kusto/management/data-export/export-data-to-an-external-table.md)
  - Export: storage failures during export commands
- [Callout policy](./kusto/management/calloutpolicy.md)
  - Add mysql_request() preview plugin - Original PR Alex S #1164
- [Create and alter external tables in Azure Storage or Azure Data Lake](./kusto/management/external-tables-azurestorage-azuredatalake.md)
  - Added some samples on filtering by partition columns

#### Tools

- [Troubleshooting](./kusto/tools/kusto-explorer-troubleshooting.md)
  - Links: Data Explorer (2020-11)

#### API

- [Client libraries](./kusto/api/client-libraries.md)
  - Links: Data Explorer (2020-11)
  - Update client-libraries links

#### General

- [Azure DevOps Task for Azure Data Explorer](devops.md)
  - Management commands in-line-code
- [Business continuity and disaster recovery overview](business-continuity-overview.md)
  - BCDR Always on update
- [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)
  - 2020 11 assigned identities
  - Support user assigned identities
- [Azure security baseline for Azure Data Explorer](security-baseline.md)
  - ASB: Data Explorer
- [Create a table in Azure Data Explorer](one-click-table.md)
  - One click table GA
- [Visualize data with Azure Data Explorer dashboards(Preview)](azure-data-explorer-dashboards.md)
  - Added documentation for new dashboard visuals and parameter changes
- [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)
  - Event Hub one click
- [Quickstart: Query data in Azure Data Explorer Web UI](web-query-data.md)
  - 2020 10 webui
  - Olgawebui
- [Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs](using-diagnostic-logs.md)
  - Update using-diagnostic-logs screenshot
  - Adding ingestion batching log
  - Ingestion log note
- [Event Hub data connection](ingest-data-event-hub-overview.md)
  - Geo redundancy in event hub connection
- [Ingest JSON formatted sample data into Azure Data Explorer](ingest-json-formats.md)
  - 2020 11 ingest json 2
- [Best practices for using Power BI to query and visualize Azure Data Explorer data](power-bi-best-practices.md)
  - Added documentation for ForceUseContains option
  - Links: Data Explorer (2020-11)
  - Add PBI Value.NativeQuery docs
- [What is one-click ingestion?](ingest-data-one-click.md)
  - Update one click ingestion
  - OCI = GA + JSON nested levels + file types
- [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md)
  - Update one click ingestion
  - OCI = GA + JSON nested levels + file types
- [Integrate Azure Data Explorer with Azure Data Factory](data-factory-integration.md)
  - Add mysql_request() preview plugin - Original PR Alex S #1164
  - Add mysql_request() preview plugin into the docs
- [Use a Jupyter Notebook and kqlmagic extension to analyze data in Azure Data Explorer](kqlmagic.md)
  - Links: Data Explorer (2020-11)
- [Create Power Apps application to query data in Azure Data Explorer (preview)](power-apps-connector.md)
  - Links: Data Explorer (2020-11)
- [Azure Data Explorer tools and integrations overview](tools-integrations-overview.md)
  - Links: Data Explorer (2020-11)
- [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](one-click-ingestion-existing-table.md)
  - OCI = GA + JSON nested levels + file types
- [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
  - Added documentation for new dashboard visuals and parameter changes
- [Ingest data from Logstash to Azure Data Explorer (preview)](ingest-data-logstash.md) - Repo sync for protected CLA branch
- [Use LightIngest to ingest data to Azure Data Explorer](lightingest.md) - Repo sync for protected CLA branch

## October 2020

Welcome to what's new in the Azure Data Explorer docs from October 1, 2020 through October 31, 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

- [project-keep operator](/azure/data-explorer/kusto/query/project-keep-operator.md)
- [bag_remove_keys()](/azure/data-explorer/kusto/query/bag-remove-keys-function.md)
- [series_fit_poly()](/azure/data-explorer/kusto/query/series-fit-poly-function.md)
- [array_sort_asc()](/azure/data-explorer/kusto/query/arraysortascfunction.md)
- [array_sort_desc()](/azure/data-explorer/kusto/query/arraysortdescfunction.md)

#### Functions library

- [kmeans_fl()](/azure/data-explorer/kusto/functions-library/kmeans-fl.md)
- [series_dot_product_fl()](/azure/data-explorer/kusto/functions-library/series-dot-product-fl.md) - Kmeans-fl
- [series_dot_product_fl()](/azure/data-explorer/kusto/functions-library/series_dot_product_fl.md) - Add kmeans_fl

#### Management

- [Query throttling policy commands](/azure/data-explorer/kusto/management/query-throttling-policy-commands.md)
- [Query throttling policy](/azure/data-explorer/kusto/management/query-throttling-policy.md)
- [.clear table data](/azure/data-explorer/kusto/management/clear-table-data-command.md)

#### General

- [Ingest data using the Azure Data Explorer Java SDK](java-ingest-data.md)
- [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)
- [Create a private or service endpoint to Event Hub and Azure Storage](vnet-endpoint-storage-event-hub.md)
- [EngineV3 - preview](engine-v3.md)
- [Create an Azure Data Explorer cluster and database using Go](create-cluster-database-go.md)
- [Create Power Apps application to query data in Azure Data Explorer (preview)](power-apps-connector.md)

### Updated articles


Ignoring PR 380: Update parse-xmlfunction.md
Ignoring PR 1155: Update cross-cluster-or-database-queries.md
Ignoring PR 1147: Update partitionoperator.md
Ignoring PR 1144: Update logicapps.md
Ignoring PR 1142: Update dcount-intersect-plugin.md
Ignoring PR 1124: Update querylimits.md
Ignoring PR 1109: Update request-properties.md
Ignoring PR 1105: Update ingest-data-event-hub-overview.md
Ignoring PR 1104: Replaced reviewer from Rachel to Alexans
Ignoring PR 1099: Update sandboxes.md
Ignoring PR 1092: Update partitioningpolicy.md
Ignoring PR 1089: Update batchingpolicy.md
Ignoring PR 1085: Update kusto-explorer-troubleshooting.md
Ignoring PR 1079: Update engine-v3.md
Ignoring PR 1077: Update query-results-cache.md
Ignoring PR 1074: Update drop-function.md
Ignoring PR 1068: Update row-level-security-policy.md
Ignoring PR 1064: Update rowlevelsecuritypolicy.md
Ignoring PR 1051: Update data-explorer-overview.md
Ignoring PR 1031: Update dcount-intersect-plugin.md
Ignoring PR 1029: Update countif-aggfunction.md
Ignoring PR 1025: Update ingest-data-overview.md

#### Query

- [tdigest_merge() (aggregation function)](/azure/data-explorer/kusto/query/tdigest-merge-aggfunction.md)
  - Tdigest_merge Original PR 1151
  - Fix tdigest_merge doc
- [fork operator](/azure/data-explorer/kusto/query/forkoperator.md)
  - Added project-keep
- [project-away operator](/azure/data-explorer/kusto/query/projectawayoperator.md)
  - Added project-keep
- [project-reorder operator](/azure/data-explorer/kusto/query/projectreorderoperator.md)
  - Added project-keep
- [array_rotate_left()](/azure/data-explorer/kusto/query/array_rotate_leftfunction.md)
  - Add bag_remove_keys() function to the docs
- [array_rotate_right()](/azure/data-explorer/kusto/query/array_rotate_rightfunction.md)
  - Add bag_remove_keys() function to the docs
- [array_shift_left()](/azure/data-explorer/kusto/query/array_shift_leftfunction.md)
  - Add bag_remove_keys() function to the docs
- [Scalar function types](/azure/data-explorer/kusto/query/scalarfunctions.md)
  - Add bag_remove_keys() function to the docs
  - Added array_sort functions
- [make_list_with_nulls() (aggregation function)](/azure/data-explorer/kusto/query/make-list-with-nulls-aggfunction.md)
  - Added array_sort functions
- [make_list() (aggregation function)](/azure/data-explorer/kusto/query/makelist-aggfunction.md)
  - Added array_sort functions

#### Functions library

- [Functions library](/azure/data-explorer/kusto/functions-library/functions-library.md)
  - Kmeans-fl
  - Add kmeans_fl
- [series_fit_poly_fl()](/azure/data-explorer/kusto/functions-library/series-fit-poly-fl.md)
  - Adieldar/series fit poly Original PR #977

#### Management

- [Create and alter external tables in Azure Storage or Azure Data Lake](/azure/data-explorer/kusto/management/external-tables-azurestorage-azuredatalake.md)
  - Fixed external table next steps
  - Document new columns in external table artifacts result
- [Partitioning policy](/azure/data-explorer/kusto/management/partitioningpolicy.md)
  - Update partitioning policy
- [Data mappings](/azure/data-explorer/kusto/management/mappings.md)
  - Update documentation of ingestion mappings
- [Tables management](/azure/data-explorer/kusto/management/tables.md)
  - User/vrozov/cleartable
  
#### Concepts

- [Data purge](/azure/data-explorer/kusto/concepts/data-purge.md)
  - Data purge formatting
  - Purge docs clarification
- [Query result set has exceeded the internal ... limit](/azure/data-explorer/kusto/concepts/resulttruncation.md)
  - Added project-keep
- [Runaway queries](/azure/data-explorer/kusto/concepts/runawayqueries.md)
  - Added project-keep
- [Query limits](/azure/data-explorer/kusto/concepts/querylimits.md)
  - Update query limits

#### General

- [Create an Event Hub data connection for Azure Data Explorer by using C#](data-connection-event-hub-csharp.md)
  - Event Hub C# compression
  - Links: Dataexplorer - Pass1
- [Azure Data Explorer tools and integrations overview](tools-integrations-overview.md)
  - Add link to power apps in tools and integrations
  - Add synapse to tools and integrations
  - Links: Dataexplorer - Pass1
  - add azure data studio topics
- [KQL quick reference](kql-quick-reference.md)
  - Added project-keep
- [Azure Data Explorer data ingestion overview](ingest-data-overview.md)
  - Fix typo
  - Update ingest-data-overview.md ingestion limit
- [Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md) - Azure advisor new recommendation and links
- [Use a Jupyter Notebook and kqlmagic extension to analyze data in Azure Data Explorer](kqlmagic.md) - change kqlmagic and remove azure notebooks
- [Tutorial: Ingest and query monitoring data in Azure Data Explorer](ingest-data-no-code.md)
  - Updated UI for ingest-data-no-code
  - Repo sync for protected CLA branch
- [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)
  - Update Event Grid Manual doc
  - Event Grid - manually create resources in portal
  - Repo sync for protected CLA branch
- [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network (preview)](vnet-create-private-endpoint.md)
  - ADX VNet
- [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
  - ADX VNet
- [Best practices for using Power BI to query and visualize Azure Data Explorer data](power-bi-best-practices.md)
  - Add documenation on PBI Timeout option
  - Improve PBI-related docs
- [Select the correct compute SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md)
  - fix "Standard_E16as_v4 + 3 TB PS" ps value
- [Create an Azure Data Explorer cluster and database by using C#](create-cluster-database-csharp.md)
  - 2020 10 create clusterdb go
- [Create an Azure Data Explorer cluster and database by using PowerShell](create-cluster-database-powershell.md)
  - 2020 10 create clusterdb go
- [Create an Azure Data Explorer cluster and database by using Python](create-cluster-database-python.md)
  - 2020 10 create clusterdb go
- [Use follower database to attach databases in Azure Data Explorer](follower.md)
  - add powershell and conceptual tabs to follower doc
- [Visualize data using the Azure Data Explorer connector for Power BI](power-bi-connector.md)
  - Improve PBI-related docs
- [Create an Azure Data Explorer cluster and database by using Azure CLI](create-cluster-database-cli.md)
  - 2020 10 create clusterdb go
- [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md)
  - 2020 10 create clusterdb go
- [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md)
  - Remove note of 'experimental' for apache-avro format

## September 2020

Welcome to what's new in the Azure Data Explorer docs from September 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

- [zlib_compress_to_base64_string()](./kusto/query/zlib-base64-compress.md)
- [zlib_decompress_from_base64_string()](./kusto/query/zlib-base64-decompress.md)
- [cosmosdb_sql_request plugin](./kusto/query/cosmosdb-plugin.md)
- [materialized_view() function](./kusto/query/materialized-view-function.md)

#### Functions library

- [Functions library](./kusto/functions-library/functions-library.md)

#### Management

- [.create materialized-view](./kusto/management/materialized-views/materialized-view-create.md)
- [Materialized views (preview)](./kusto/management/materialized-views/materialized-view-overview.md)
- [.alter materialized-view](./kusto/management/materialized-views/materialized-view-alter.md)
- [.disable | .enable materialized-view](./kusto/management/materialized-views/materialized-view-enable-disable.md)
- [.drop materialized-view](./kusto/management/materialized-views/materialized-view-drop.md)
- [.show materialized-views commands](./kusto/management/materialized-views/materialized-view-show-commands.md)

#### API

- [Azure Data Explorer Golang SDK](./kusto/api/golang/kusto-golang-client-library.md)
- [Ingestion without Kusto.Ingest Library](./kusto/api/netfx/kusto-ingest-client-rest.md)

#### General

- [Create a table in Azure Data Explorer (preview)](one-click-table.md)
- [Enable isolated compute on your Azure Data Explorer cluster](isolated-compute.md)
- [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network](vnet-create-private-endpoint.md)
- [Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md)
- [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)

### Updated articles


Ignoring PR 1011: Update index.yml
Ignoring PR 1008: Update query-monitor-data.md
Ignoring PR 1006: Update renderoperator.md    
Ignoring PR 1003: Update show-query-results-cache-command.md
Ignoring PR 996: Update series-fill-constfunction.md
Ignoring PR 955: Update vnet-create-private-endpoint.md
Ignoring PR 952: Update make-seriesoperator.md
Ignoring PR 951: Update parse-xmlfunction.md
Ignoring PR 949: Update data-lake-query-data.md
Ignoring PR 944: Update calloutpolicy.md
Ignoring PR 938: Update beta-cdffunction.md
Ignoring PR 931: Update partitioningpolicy.md
Ignoring PR 930: Update partitioningpolicy.md
Ignoring PR 906: Update dashboard-parameters.md
Ignoring PR 902: Update ingest-sample-data.md
Ignoring PR 901: Update ingest-sample-data.md
Ignoring PR 898: Update partitioningpolicy.md
Ignoring PR 877: Update mv-applyoperator.md
Ignoring PR 362: Update one-click-table.md

#### Query

- [geo_distance_point_to_line()](./kusto/query/geo-distance-point-to-line-function.md)
  - Add multiline support docs
- [geo_line_densify()](./kusto/query/geo-line-densify-function.md)
  - Add multiline support docs
- [Query operators](./kusto/query/queries.md)
  - Queries
- [externaldata operator](./kusto/query/externaldata-operator.md)
  - Added note on limits to externaldata() and external_table() functions
  - Added missing documentation to externaldata() operator
- [external_table()](./kusto/query/externaltablefunction.md)
  - Added note on limits to externaldata() and external_table() functions

#### Management 

- [.create-merge table](./kusto/management/create-merge-table-command.md)
  - See also changed from bold to h2
- [Diagnostic information](./kusto/management/diagnostics.md)
  - Adding indication that sizes returned in bytes
- [Export data to storage](./kusto/management/data-export/export-data-to-storage.md)
  - Exportdocs
- [Create and alter external SQL tables](./kusto/management/external-sql-tables.md)
  - Correct SQL external table documentation
- [.show database cache query_results](./kusto/management/show-query-results-cache-command.md) - Repo sync for protected CLA branch
- [Kusto Access Control Overview](./kusto/management/access-control/index.md) - Repo sync for protected CLA branch
- [Data partitioning policy](./kusto/management/partitioningpolicy.md)

#### General

- [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
  - vnet: add additional DM private endpoint
  - Vnet depolyment
  - vnet: formatting fix
  - vnet: add new monitoring IPs
- [Query data in Azure Monitor using Azure Data Explorer (Preview)](query-monitor-data.md)
  - removed borders as requested
  - TrustedExternalTenants
- [Create a table in Azure Data Explorer (preview)](one-click-table.md)
  - One click table
- [Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs](using-diagnostic-logs.md)
  - Add the table names in Log Analytics + fix the names of the logs
  - update diagnostic logs with query and command info
- [Ingest data from Apache Kafka into Azure Data Explorer](ingest-data-kafka.md)
  - Kafka
- [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md)
  - IoT Hub, Event Hub, Event Grid updates
  - Data connector ingestion updates
- [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)
  - IoT Hub, Event Hub, Event Grid updates
  - Data connector ingestion updates
- [Ingest data from IoT Hub into Azure Data Explorer](ingest-data-iot-hub.md)
  - IoT Hub, Event Hub, Event Grid updates
- [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
  - Content performance tracking
  - continuous export metrics fix
  - Materialized views original PR 890
  - Metrics
- [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
  - Fix python ingest data
- [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network](vnet-create-private-endpoint.md)
  - change Disable network policies in Prerequisites section
  - Vnet private endpoint - Original PR 822
- [Visualize data from Azure Data Explorer in Grafana](grafana.md)
  - 2020 9 grafana query editor
- [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
  - Update azure-data-explorer-dashboards with security information
  - 2020 8 adx dashboards
- [Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md)
  - Updated pre-requisites section for Go SDK ingestion how-to
- [Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network](vnet-deploy-troubleshoot.md)
  - Metrics
- [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
  - 2020 8 adx dashboards

## August 2020

Welcome to what's new in the Azure Data Explorer docs from August 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

- [series_fft()](./kusto/query/series-fft-function.md)
- [series_ifft()](./kusto/query/series-ifft-function.md)
- [dynamic_to_json()](./kusto/query/dynamic-to-json-function.md)
- [format_ipv4()](./kusto/query/format-ipv4-function.md)
- [format_ipv4_mask()](./kusto/query/format-ipv4-mask-function.md)

### Management

- [Create or alter continuous export](./kusto/management/data-export/create-alter-continuous.md)
- [Disable or enable continuous export](./kusto/management/data-export/disable-enable-continuous.md)
- [Drop continuous export](./kusto/management/data-export/drop-continuous-export.md)
- [Show continuous export artifacts](./kusto/management/data-export/show-continuous-artifacts.md)
- [Show continuous export](./kusto/management/data-export/show-continuous-export.md)
- [Show continuous export failures](./kusto/management/data-export/show-continuous-failures.md)

### General

- [Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer](double-encryption.md)
- [Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md)
- [Business continuity and disaster recovery overview](business-continuity-overview.md)
- [Connect to Event Grid](ingest-data-event-grid-overview.md)
- [Create business continuity and disaster recovery solutions with Azure Data Explorer](business-continuity-create-solution.md)

### Updated articles

Ignoring PR 872: Update columns.md
Ignoring PR 864: Update vnet-deployment.md
Ignoring PR 860: Update partitioningpolicy.md
Ignoring PR 848: Update partitioningpolicy.md
Ignoring PR 845: Update dynamic-to-json-function.md
Ignoring PR 838: Update show-table-details-command.md
Ignoring PR 833: Update user-defined-functions.md
Ignoring PR 832: Update mvexpandoperator.md      
Ignoring PR 831: Update rowlevelsecuritypolicy.md
Ignoring PR 823: Update kusto-explorer.md
Ignoring PR 821: Update querylimits.md   
Ignoring PR 808: Update shufflequery.md
Ignoring PR 805: Update binatfunction.md
Ignoring PR 804: Update binfunction.md
Ignoring PR 800: Update rowlevelsecuritypolicy.md
Ignoring PR 795: Update updatepolicy.md
Ignoring PR 792: Update go-ingest-data.md
Ignoring PR 789: Update mvexpandoperator.md
Ignoring PR 788: Update usinghlltdigest.md
Ignoring PR 784: Update business-continuity-create-solution.md
Ignoring PR 774: Update mv-applyoperator.md
Ignoring PR 771: Update net-sdk-ingest-data.md
Ignoring PR 753: Update countif-aggfunction.md
Ignoring PR 298: Update about-kusto-ingest.md
Ignoring PR 289: Update python-query-data.md
Ignoring PR 278: Update data-share.md
Ignoring PR 268: Update monitor-with-resource-health.md

#### Query

- [isnotempty()](./kusto/query/isnotemptyfunction.md)
  - Kusto isnotempty needed an example
- [String operators](./kusto/query/datatypes-string-operators.md)
  - String operators
- [Scalar function types](./kusto/query/scalarfunctions.md)
  - Add series_fft() and series_ifft() functions
  - Add documentation for format_ipv4() and format_ipv4_mask() functions
- [summarize operator](./kusto/query/summarizeoperator.md)
  - summarizeoperator: Improved initial example. Fixed ancient definition of *GroupExpression*
- [dynamic_to_json()](./kusto/query/dynamic-to-json-function.md)
  - introduced dynamic-to-json command
- [Using hll() and tdigest()](./kusto/query/usinghlltdigest.md)
  - hll digest - update PR 788
- [mv-expand operator](./kusto/query/mvexpandoperator.md)
  - MV-expand
- [Let statement](./kusto/query/letstatement.md)
  - Add examples to let statement

#### Management

- [Create and alter external tables in Azure Storage or Azure Data Lake](./kusto/management/external-tables-azurestorage-azuredatalake.md)
  - Added notes to external table management article
  - External tables: specify new command option .create-or-alter
- [Continuous data export overview](./kusto/management/data-export/continuous-data-export.md)
  - Data connectors reorg
  - Continuous export
- [Create and alter external SQL tables](./kusto/management/external-sql-tables.md)
  - External tables: specify new command option .create-or-alter
- [The .ingest into command (pull data from storage)](./kusto/management/data-ingestion/ingest-from-storage.md)
  - Ingest from storage: improve explanation on connection strings
- [Export data to an external table](./kusto/management/data-export/export-data-to-an-external-table.md)
  - Continuous export
- [update policy commands](./kusto/management/update-policy.md)
  - Update policy - Original PR539
- [Update policy overview](./kusto/management/updatepolicy.md)
  - Update policy - Original PR539
- [Columns management](./kusto/management/columns.md) - Repo sync for protected CLA branch

#### Concepts

- [Query limits](./kusto/concepts/querylimits.md)
  - Clarifications in query limits section

#### General

- [Ingest data using the Azure Data Explorer Node library](node-ingest-data.md)
  - Microsoft 365 branding.
  - 2020 8 go sdk ingest
- [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
  - vnet; Private endpoints section
  - vnet: remove "Azure Monitor configuration" dependency
- [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
  - Updating batching metrics
- [Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer](double-encryption.md)
  - Double encryption- fix merge conflict in 793
  - added portal section to double encryption
  - 2020 8 double encryption
- [Business continuity and disaster recovery overview](business-continuity-overview.md)
  - Data connectors reorg
  - 2020 4 bcdr doc
- [Create an Event Grid data connection for Azure Data Explorer by using C#](data-connection-event-grid-csharp.md)
  - Data connectors reorg
- [Create an Event Grid data connection for Azure Data Explorer by using Python](data-connection-event-grid-python.md)
  - Data connectors reorg
- [Create an Event Grid data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-event-grid-resource-manager.md)
  - Data connectors reorg
- [Create an Event Hub data connection for Azure Data Explorer by using C#](data-connection-event-hub-csharp.md)
  - Data connectors reorg
- [Create an Event Hub data connection for Azure Data Explorer by using Python](data-connection-event-hub-python.md)
  - Data connectors reorg
- [Create an Event Hub data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-event-hub-resource-manager.md)
  - Data connectors reorg
- [Create an IoT Hub data connection for Azure Data Explorer by using C# (Preview)](data-connection-iot-hub-csharp.md)
  - Data connectors reorg
- [Create an IoT Hub data connection for Azure Data Explorer by using Python (Preview)](data-connection-iot-hub-python.md)
  - Data connectors reorg
- [Create an IoT Hub data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)
  - Data connectors reorg
- [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md)
  - Data connectors reorg
- [Connect to Event Hub](ingest-data-event-hub-overview.md)
  - Data connectors reorg
- [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)
  - Data connectors reorg
  - Update instructions for the sample app
- [Connect to IoT Hub](ingest-data-iot-hub-overview.md)
  - Data connectors reorg
- [Ingest data from IoT Hub into Azure Data Explorer](ingest-data-iot-hub.md)
  - Data connectors reorg
- [Azure Data Explorer data ingestion overview](ingest-data-overview.md)
  - Data connectors reorg
- [Azure Data Explorer tools and integrations overview](tools-integrations-overview.md)
  - Data connectors reorg
- [Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal](cluster-disk-encryption.md)
  - 2020 8 double encryption
  - Fix git push error for protected CLA branch
- [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)
  - 2020 8 double encryption
- [Configure customer-managed keys using the Azure portal](customer-managed-keys-portal.md)
  - 2020 8 double encryption
- [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys-resource-manager.md)
  - 2020 8 double encryption
- [Manage language extensions in your Azure Data Explorer cluster (Preview)](language-extensions.md)
  - 2020 8 double encryption
  - Fix git push error for protected CLA branch
- [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)
  - 2020 8 double encryption
  - Fix git push error for protected CLA branch
- [Secure Azure Data Explorer clusters in Azure](security.md)
  - 2020 8 double encryption
- [Create business continuity and disaster recovery solutions with Azure Data Explorer](business-continuity-create-solution.md)
  - 2020 4 bcdr doc

