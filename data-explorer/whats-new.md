---
title: What's new in Azure Data Explorer
description: What's new in the Azure Data Explorer docs
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/15/2020
---
# What's new in Azure Data Explorer

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

> [!NOTE]
> Get notified about when to revisit this page for updates by copying and pasting this URL into your RSS feed reader:
>
>
## December 2020

### General

Article title | Description
---|---
[Ingestion error codes in Azure Data Explorer](error-codes.md) | New article. This list contains error codes you may come across during [ingestion](ingest-data-overview.md).


[Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md)
  - Update using-metrics.md
  - Update custom metadata
  - Update using-metrics.md
  - Error codes
- [Best practices for using Power BI to query and visualize Azure Data Explorer data](power-bi-best-practices.md) - Update power-bi-best-practices.md

### Functions library

Article title | Description
---|---
[series_metric_fl()](kusto/functions-library/series-metric-fl.md) | New article. The `series_metric_fl()` function selects and retrieves time series of metrics ingested to Azure Data Explorer using the Prometheus monitoring system.
[series_rate_fl()](kusto/functions-library/series-rate-fl.md) | New article. The function `series_rate_fl()` calculates the average rate of metric increase per second.
[series_fit_lowess_fl()](kusto/functions-library/series-fit-lowess-fl.md) | New article. The function `series_fit_lowess_fl()` applies a LOWESS regression on a series.

### Management

[.create table based-on](/azure/data-explorer/kusto/management/create-table-based-on-command.md)  | New article.
[Stored query results (Preview)](/azure/data-explorer/kusto/management/stored-query-results.md) | New article.
  
### Updated articles

- [Update policy overview](/azure/data-explorer/kusto/management/updatepolicy.md) - update policy limitations for streaming ingestion
- [Create and alter external tables in Azure Storage or Azure Data Lake](/azure/data-explorer/kusto/management/external-tables-azurestorage-azuredatalake.md)
  - Document `filesPreview` and `dryRun` external table definition options
  - Update external table mapping commands
- [Export data to an external table](/azure/data-explorer/kusto/management/data-export/export-data-to-an-external-table.md) - Use new external table syntax in export docs
- [IngestionBatching policy command](/azure/data-explorer/kusto/management/batching-policy.md) - Update batching-policy.md
- [Best practices for schema management](/azure/data-explorer/kusto/management/management-best-practices.md) - updated according to customer feedback
- [.create materialized-view](/azure/data-explorer/kusto/management/materialized-views/materialized-view-create.md) - Materializedview create

## Query

### Updated articles


- [Let statement](/azure/data-explorer/kusto/query/letstatement.md) - Update letstatement.md
- [parse operator](/azure/data-explorer/kusto/query/parseoperator.md) - Make it clearer when to use parse-where
- [externaldata operator](/azure/data-explorer/kusto/query/externaldata-operator.md)
  - Adding AzMon performance warnings for 4 operators
  - Fix zone issues
  - Add a warning on usage in AzMon
- [find operator](/azure/data-explorer/kusto/query/findoperator.md) - Adding AzMon performance warnings for 4 operators
- [search operator](/azure/data-explorer/kusto/query/searchoperator.md) - Adding AzMon performance warnings for 4 operators
- [geo_distance_point_to_line()](/azure/data-explorer/kusto/query/geo-distance-point-to-line-function.md) - adding geospatial examples
- [geo_polygon_to_s2cells()](/azure/data-explorer/kusto/query/geo-polygon-to-s2cells-function.md) - adding geospatial examples
- [top-nested operator](/azure/data-explorer/kusto/query/topnestedoperator.md) - top-nested: Added an example for partition/top
- [The dynamic data type](/azure/data-explorer/kusto/query/scalar-data-types/dynamic.md) - Update dynamic.md
- [Tutorial: Use Kusto queries in Azure Data Explorer and Azure Monitor](/azure/data-explorer/kusto/query/tutorial.md)
  - 350885
  - Update tutorial.md
- [pattern statement](/azure/data-explorer/kusto/query/patternstatement.md) - 1800773, fixed validation issues.
- [Python plugin](/azure/data-explorer/kusto/query/pythonplugin.md) - 1800773, fixed validation issues.
- [bin()](/azure/data-explorer/kusto/query/binfunction.md) - Update binfunction.md
- [render operator](/azure/data-explorer/kusto/query/renderoperator.md) - Fix to render operator for Azure Monitor
- [mv-expand operator](/azure/data-explorer/kusto/query/mvexpandoperator.md) - Update mvexpandoperator.md
- [take operator](/azure/data-explorer/kusto/query/takeoperator.md) - Stored query (Original PR 1283)
- [Databases](/azure/data-explorer/kusto/query/schema-entities/databases.md) - Update databases.md
- [Query results cache](/azure/data-explorer/kusto/query/query-results-cache.md) - Request properties

## Tools

### Updated articles

- [Kusto.Explorer installation and user interface](/azure/data-explorer/kusto/tools/kusto-explorer.md) - Kusto.Explorer row colors legends

## November 2020

This section lists the major changes to docs during November 2020.

### General

Article title | Description
---|---
[Azure Policy built-in definitions for Azure Data Explorer](policy-reference.md) | New article. Index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions for Azure Data Explorer. 
[Use one-click ingestion to create an Event Hub data connection for Azure Data Explorer](one-click-event-hub.md) | New article. Connect an Event Hub to a table in Azure Data Explorer using the [one-click ingestion](ingest-data-one-click.md) experience.
| [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md) | Updated article. Supports both user-assigned managed identities and system-assigned managed identities
| [Create a table in Azure Data Explorer](one-click-table.md) | Updated article. General availability (GA) |
 | [Quickstart: Query data in Azure Data Explorer Web UI](web-query-data.md) | Updated article. New capabilities
|  [What is one-click ingestion?](ingest-data-one-click.md) | Updated article. Added ingestion from JSON nested levels. General availability (GA).
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Updated article. New dashboard visuals and parameter changes

### Query

Article title | Description
---|---
[mysql_request plugin (Preview)](./kusto/query/mysqlrequest-plugin.md) | New article. The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results. The query may return more than one rowset, but only the first rowset is made available for the rest of the Kusto query. 
[ipv4_lookup plugin](./kusto/query/ipv4-lookup-plugin.md) | New article. The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](./kusto/query/ipv4-is-privatefunction.md) | New article. Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](./kusto/query/splunk-cheat-sheet.md) | New article. This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto. Direct comparisons are made between the two to highlight key differences and similarities, so you can build on your existing knowledge.
[gzip_compress_to_base64_string()](./kusto/query/gzip-base64-compress.md) | New article. Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](./kusto/query/gzip-base64-decompress.md) | New article. Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](./kusto/query/array-reverse-function.md) | New article. Reverses the order of the elements in a dynamic array.

### Management

Article title | Description
---|---
[.disable plugin](./kusto/management/disable-plugin.md) | New article. Disables a plugin.
[.enable plugin](./kusto/management/enable-plugin.md) | New article. Enables a plugin.
[.show plugins](./kusto/management/show-plugins.md) | New article. Lists all plugins of the cluster.
| [Cluster follower commands](kusto/management/cluster-follower.md) | Updated article. Syntax changed, added `.alter follower database prefetch-extents` |

### Functions library

Article title | Description
---|---
[series_downsample_fl()](./kusto/functions-library/series-downsample-fl.md) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). 
[series_exp_smoothing_fl()](./kusto/functions-library/series-exp-smoothing-fl.md) | Applies a basic exponential smoothing filter on a series.

## October 2020

This section lists the major changes to docs during October 2020.

### General

 Article title | Description
---|---
[Ingest data using the Azure Data Explorer Java SDK](java-ingest-data.md) | New article.  In this article, learn how to ingest data using the Azure Data Explorer Java library. First, you'll create a table and a data mapping in a test cluster. Then you'll queue an ingestion from blob storage to the cluster using the Java SDK and validate the results.
[Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) | New article. In this article, you learn how to create manually the resources needed for Event Grid Ingestion: Event Grid subscription, Event Hub  Article titlespace, and Event Hub. 
[Create a private or service endpoint to Event Hub and Azure Storage](vnet-endpoint-storage-event-hub.md) | New article. A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your VNet’s address space for the Azure service to securely connect between Azure Data Explorer and Azure services such as Azure Storage and Event Hub. Azure Data Explorer accesses the Private Endpoint of the storage accounts or Event Hubs over the Microsoft backbone, and all communication, for example, data export, external tables, and data ingestion, takes take place over the private IP address. 
[EngineV3 - preview](engine-v3.md) | New article. Kusto EngineV3 is Azure Data Explorer’s next generation storage and query engine. It's designed to provide unparalleled performance for ingesting and querying telemetry, logs, and time series data.
[Create an Azure Data Explorer cluster and database using Go](create-cluster-database-go.md) |  New article. In this article, you create an Azure Data Explorer cluster and database using [Go](https://golang.org/). You can then list and delete your new cluster and database and execute operations on your resources.
[Create Power Apps application to query data in Azure Data Explorer (preview)](power-apps-connector.md) | New article. In this article, you will create a Power Apps application to query Azure Data Explorer data. During this process, you will see the steps of data parameterization, retrieval, and presentation.
|[Microsoft Logic App and Azure Data Explorer ](kusto/tools/logicapps.md) |Updated article. General availability (GA).
| [Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster](azure-advisor.md) | Updated article. Azure advisor new recommendation.
| [Use follower database to attach databases in Azure Data Explorer](follower.md) | Updated article. Use powershell to attach and detach follower databases. 

### Query

Article title | Description
---|---
[project-keep operator](./kusto/query/project-keep-operator.md) | New article. Select what columns from the input to keep in the output.
[bag_remove_keys()](./kusto/query/bag-remove-keys-function.md) | New article. Removes keys and associated values from a `dynamic` property-bag.
[series_fit_poly()](./kusto/query/series-fit-poly-function.md) | New article. Applies a polynomial regression from an independent variable (x_series) to a dependent variable (y_series). This function takes a table containing multiple series (dynamic numerical arrays) and generates the best fit high-order polynomial for each series using [polynomial regression](https://en.wikipedia.org/wiki/Polynomial_regression). 
[array_sort_asc()](./kusto/query/arraysortascfunction.md) | New article. Receives one or more arrays. Sorts the first array in ascending order. Orders the remaining arrays to match the reordered first array.
[array_sort_desc()](./kusto/query/arraysortdescfunction.md) | New article. Receives one or more arrays. Sorts the first array in descending order. Orders the remaining arrays to match the reordered first array.

### Management

 Article title | Description
---|---
[Query throttling policy commands](./kusto/management/query-throttling-policy-commands.md) | New article. The [query throttling policy](kusto/management/query-throttling-policy.md) is a cluster-level policy to restrict query concurrency in the cluster. 
[Query throttling policy](./kusto/management/query-throttling-policy.md) | New article. Define the query throttling policy to limit the number of concurrent queries the cluster can execute at the same time. This policy protects the cluster from being overloaded with more concurrent queries than it can sustain. The policy can be changed at run-time, and takes place immediately after the alter policy command completes.
[.clear table data](./kusto/management/clear-table-data-command.md) | New article. Clears the data of an existing table, including streaming ingestion data.
|  [row_level_security policy command](kusto/management/row-level-security-policy.md) [Row Level Security](kusto/management/rowlevelsecuritypolicy.md) |Updated articles. General availability (GA).

### Functions library

 Article title | Description
---|---
[kmeans_fl()](./kusto/functions-library/kmeans-fl.md) | New article.  The function `kmeans_fl()` clusterizes a dataset using the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering).
[series_dot_product_fl()](./kusto/functions-library/series-dot-product-fl.md) | New article. Calculates the dot product of two numerical vectors.

## September 2020

This section lists the major changes to docs during September 2020.


#### General

 Article title | Description
---|---
[Create a table in Azure Data Explorer (preview)](one-click-table.md) | New article.  The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer Web UI. 
[Enable isolated compute on your Azure Data Explorer cluster](isolated-compute.md) | New article. Isolated compute virtual machines (VMs) enable customers to run their workload in a hardware isolated environment dedicated to single customer. Clusters deployed with isolated compute VMs are best suited for workloads that require a high degree of isolation for compliance and regulatory requirements.
[Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md) | New article.  Azure Advisor analyzes the Azure Data Explorer cluster configurations and usage telemetry and offers personalized and actionable recommendations to help you optimize your cluster.
[Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) |New article. Visuals are essential part of any Azure Data Explorer Dashboard. This document details the different visual types and describes various options that are available to dashboard users to customize their visuals.
| [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network (preview)](vnet-create-private-endpoint.md) | Updated article. General availability (GA).
| [Visualize data from Azure Data Explorer in Grafana](grafana.md) | Updated article. Updated with new capabilities
| [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md), [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md) | Updated articles. Updated with new capabilities.

#### Query

 Article title | Description
---|---
[zlib_compress_to_base64_string()](./kusto/query/zlib-base64-compress.md) | New article.  Performs zlib compression and encodes the result to base64.
[zlib_decompress_from_base64_string()](./kusto/query/zlib-base64-decompress.md) |New article.  Decodes the input string from base64 and performs zlib decompression.
[cosmosdb_sql_request plugin](./kusto/query/cosmosdb-plugin.md) | New article. The `cosmosdb_sql_request` plugin sends a SQL query to a Cosmos DB SQL network endpoint and returns the results of the query. This plugin is primarily designed for querying small datasets, for example, enriching data with reference data stored in [Azure Cosmos DB](/azure/cosmos-db/).
[materialized_view() function](./kusto/query/materialized-view-function.md) |New article.  References the materialized part of a [materialized view](kusto/management/materialized-views/materialized-view-overview.md). 
| [geo_distance_point_to_line()](./kusto/query/geo-distance-point-to-line-function.md) | Updated article. Add multiline support docs.
|[geo_line_densify()](./kusto/query/geo-line-densify-function.md)| Updated article. Add multiline support docs |

#### Management

 Article title | Description
---|---
[.create materialized-view](./kusto/management/materialized-views/materialized-view-create.md) | New article.  A [materialized view](kusto/management/materialized-views/materialized-view-overview.md) is an aggregation query over a source table, representing a single summarize statement.
[Materialized views (preview)](./kusto/management/materialized-views/materialized-view-overview.md) | New article.  [Materialized views](kusto/query/materialized-view-function.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](./kusto/management/materialized-views/materialized-view-overview.md#materialized-views-queries) is more performant than running the aggregation directly over the source table, which is performed each query.
[.alter materialized-view](./kusto/management/materialized-views/materialized-view-alter.md) | New article. Altering the [materialized view](kusto/management/materialized-views/materialized-view-overview.md) can be used for changing the query of a materialized view, while preserving the existing data in the view.
[.disable .enable materialized-view](./kusto/management/materialized-views/materialized-view-enable-disable.md) | New article. Describes how to disable a materialized view.
[.drop materialized-view](./kusto/management/materialized-views/materialized-view-drop.md) | New article. Drops a materialized view.
[.show materialized-views commands](./kusto/management/materialized-views/materialized-view-show-commands.md) | New article. The following show commands display information about [materialized views](kusto/management/materialized-views/materialized-view-overview.md).

#### Functions library

 Article title | Description
---|---
[Functions library](./kusto/functions-library/functions-library.md) | New article. The following article contains a categorized list of [UDF (user-defined functions)](kusto/query/functions/user-defined-functions.md). The user-defined functions code is given in the articles.  It can be used within a let statement embedded in a query or can be persisted in a database using [`.create function`](kusto/management/create-function.md).

#### API

 Article title | Description
---|---
[Azure Data Explorer Golang SDK](./kusto/api/golang/kusto-golang-client-library.md) | New article. Azure Data Explorer Go Client library provides the capability to query, control, and ingest into Azure Data Explorer clusters using Go. 
[Ingestion without Kusto.Ingest Library](./kusto/api/netfx/kusto-ingest-client-rest.md) | New article. The Kusto.Ingest library is preferred for ingesting data to Azure Data Explorer. However, you can still achieve almost the same functionality, without being dependent on the Kusto.Ingest package. This article shows you how, by using *Queued Ingestion* to Azure Data Explorer for production-grade pipelines.


## August 2020

This section lists the major changes to docs during August 2020.

### General

 Article title | Description
---|---
[Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer](double-encryption.md) | New article. When you create a cluster, its storage is [automatically encrypted at the service level](/azure/storage/common/storage-service-encryption). If you require a higher level of assurance that your data is secure, you can also enable [Azure Storage infrastructure level encryption](/azure/storage/common/infrastructure-encryption-enable), also known as double encryption.
[Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md) | New article. You can use the [Go SDK](https://github.com/Azure/azure-kusto-go) to ingest, control, and query data in Azure Data Explorer clusters. 
[Business continuity and disaster recovery overview](business-continuity-overview.md) | New article. Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. 
[Connect to Event Grid](ingest-data-event-grid-overview.md) | New article. Event Grid ingestion is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created or blob re Article titled notifications and streaming these notifications to Azure Data Explorer via an Event Hub.
[Create business continuity and disaster recovery solutions with Azure Data Explorer](business-continuity-create-solution.md) | New article. This article details how you can prepare for an Azure regional outage by replicating your Azure Data Explorer resources, management, and ingestion in different Azure regions.

### Query

 Article title | Description
---|---
[series_fft()](./kusto/query/series-fft-function.md) | New article. Applies the Fast Fourier Transform (FFT) on a series.  
[series_ifft()](./kusto/query/series-ifft-function.md) | New article. Applies the Inverse Fast Fourier Transform (IFFT) on a series. 
[dynamic_to_json()](./kusto/query/dynamic-to-json-function.md) | New article. Converts `dynamic` input to a string representation. If the input is a property bag, the output string prints its content sorted by the keys, recursively. Otherwise, the output is similar to the `tostring` function output.
[format_ipv4()](./kusto/query/format-ipv4-function.md) | New article. Parses input with a netmask and returns string representing IPv4 address.
[format_ipv4_mask()](./kusto/query/format-ipv4-mask-function.md) | New article. Parses input with a netmask and returns string representing IPv4 address as CIDR notation.

### Management

 Article title | Description
---|---- 
[Create or alter continuous export](./kusto/management/data-export/create-alter-continuous.md) | New article. Creates or alters a continuous export job.
[Disable or enable continuous export](./kusto/management/data-export/disable-enable-continuous.md) | New article. Disables or enables the continuous-export job. A disabled continuous export won't be executed, but its current state is persisted and can be resumed when the continuous export is enabled. 
[Drop continuous export](./kusto/management/data-export/drop-continuous-export.md) | New article. Drops a continuous-export job.
[Show continuous export artifacts](./kusto/management/data-export/show-continuous-artifacts.md) | New article. Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 
[Show continuous export](./kusto/management/data-export/show-continuous-export.md) | New article. Returns the continuous export properties of *ContinuousExport Article title*. 
[Show continuous export failures](./kusto/management/data-export/show-continuous-failures.md) | New article. Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 
| [Row Level Security](kusto/management/rowlevelsecuritypolicy.md) | Updated article. How to produce error for unauthorized access.
|[Create and alter external tables in Azure Storage or Azure Data Lake](./kusto/management/external-tables-azurestorage-azuredatalake.md) [Create and alter external SQL tables](./kusto/management/external-sql-tables.md) | Updated articles. New command option `.create-or-alter`.

## Next steps

To contribute to the Azure Data Explorer docs, see the [Docs contributor guide](https://docs.microsoft.com/contribute/).