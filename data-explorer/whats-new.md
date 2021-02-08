---
New article title: What's new in Azure Data Explorer
description: What's new in the Azure Data Explorer docs
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/15/2020
---
# What's new in Azure Data Explorer

Find new and significantly updated content in Azure Data Explorer. 

## November 2020

Welcome to what's new in the Azure Data Explorer docs from November 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

New article title | Description
---|---
[mysql_request plugin (Preview)](./kusto/query/mysqlrequest-plugin.md) | The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results. The query may return more than one rowset, but only the first rowset is made available for the rest of the Kusto query. 
[ipv4_lookup plugin](./kusto/query/ipv4-lookup-plugin.md) | The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](./kusto/query/ipv4-is-privatefunction.md) | Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](./kusto/query/splunk-cheat-sheet.md) | This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto. Direct comparisons are made between the two to highlight key differences and similarities, so you can build on your existing knowledge.
[gzip_compress_to_base64_string()](./kusto/query/gzip-base64-compress.md) | Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](./kusto/query/gzip-base64-decompress.md) | Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](./kusto/query/array-reverse-function.md) | Reverses the order of the elements in a dynamic array.

#### Functions library

New article title | Description
---|---
[series_downsample_fl()](./kusto/functions-library/series-downsample-fl.md) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). 
[series_exp_smoothing_fl()](./kusto/functions-library/series-exp-smoothing-fl.md) | Applies a basic exponential smoothing filter on a series.

#### Management

New article title | Description
---|---
[.disable plugin](./kusto/management/disable-plugin.md) | New article. Disables a plugin.
[.enable plugin](./kusto/management/enable-plugin.md) | New article. Enables a plugin.
[.show plugins](./kusto/management/show-plugins.md) | New article. Lists all plugins of the cluster.

#### General

New article title | Description
---|---
[Azure Policy built-in definitions for Azure Data Explorer](policy-reference.md) | New article. Index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions for Azure Data Explorer. 
[Use one-click ingestion to create an Event Hub data connection for Azure Data Explorer](one-click-event-hub.md) | New article. Connect an Event Hub to a table in Azure Data Explorer using the [one-click ingestion](ingest-data-one-click.md) experience.


### Updated articles

- Ignoring PR 1204: Update cluster-follower.md = syntax changed, added `.alter follower database prefetch-extents`

#### General

- [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md) - KEEP
   - Supports both user-assigned managed identities and system-assigned managed identities
- [Create a table in Azure Data Explorer](one-click-table.md) - KEEP
  - One click table GA
- [Quickstart: Query data in Azure Data Explorer Web UI](web-query-data.md) - KEEP
  - 2020 10 webui
  - Olgawebui
- [What is one-click ingestion?](ingest-data-one-click.md) - KEEP
  - Update one click ingestion
  - OCI = GA + JSON nested levels + file types
- [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) - KEEP
  - New dashboard visuals and parameter changes

## October 2020

Welcome to what's new in the Azure Data Explorer docs from October 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

New article title | Description
---|---
[project-keep operator](./kusto/query/project-keep-operator.md) | Select what columns from the input to keep in the output.
[bag_remove_keys()](./kusto/query/bag-remove-keys-function.md) | Removes keys and associated values from a `dynamic` property-bag.
[series_fit_poly()](./kusto/query/series-fit-poly-function.md) | Applies a polynomial regression from an independent variable (x_series) to a dependent variable (y_series). This function takes a table containing multiple series (dynamic numerical arrays) and generates the best fit high-order polynomial for each series using [polynomial regression](https://en.wikipedia.org/wiki/Polynomial_regression). 
[array_sort_asc()](./kusto/query/arraysortascfunction.md) | Receives one or more arrays. Sorts the first array in ascending order. Orders the remaining arrays to match the reordered first array.
[array_sort_desc()](./kusto/query/arraysortdescfunction.md) | Receives one or more arrays. Sorts the first array in descending order. Orders the remaining arrays to match the reordered first array.

#### Functions library

New article title | Description
---|---
[kmeans_fl()](./kusto/functions-library/kmeans-fl.md) | The function `kmeans_fl()` clusterizes a dataset using the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering).
[series_dot_product_fl()](./kusto/functions-library/series-dot-product-fl.md) | Calculates the dot product of two numerical vectors.

#### Management

New article title | Description
---|---
[Query throttling policy commands](./kusto/management/query-throttling-policy-commands.md) | The [query throttling policy](kusto/management/query-throttling-policy.md) is a cluster-level policy to restrict query concurrency in the cluster. 
[Query throttling policy](./kusto/management/query-throttling-policy.md) | Define the query throttling policy to limit the number of concurrent queries the cluster can execute at the same time. This policy protects the cluster from being overloaded with more concurrent queries than it can sustain. The policy can be changed at run-time, and takes place immediately after the alter policy command completes.
[.clear table data](./kusto/management/clear-table-data-command.md) | Clears the data of an existing table, including streaming ingestion data.

#### General

New article title | Description
---|---
[Ingest data using the Azure Data Explorer Java SDK](java-ingest-data.md) | In this article, learn how to ingest data using the Azure Data Explorer Java library. First, you'll create a table and a data mapping in a test cluster. Then you'll queue an ingestion from blob storage to the cluster using the Java SDK and validate the results.
[Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) | In this article, you learn how to create manually the resources needed for Event Grid Ingestion: Event Grid subscription, Event Hub New article titlespace, and Event Hub. 
[Create a private or service endpoint to Event Hub and Azure Storage](vnet-endpoint-storage-event-hub.md) | A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your VNet’s address space for the Azure service to securely connect between Azure Data Explorer and Azure services such as Azure Storage and Event Hub. Azure Data Explorer accesses the Private Endpoint of the storage accounts or Event Hubs over the Microsoft backbone, and all communication, for example, data export, external tables, and data ingestion, takes take place over the private IP address. 
[EngineV3 - preview](engine-v3.md) | Kusto EngineV3 is Azure Data Explorer’s next generation storage and query engine. It's designed to provide unparalleled performance for ingesting and querying telemetry, logs, and time series data.
[Create an Azure Data Explorer cluster and database using Go](create-cluster-database-go.md) |  In this article, you create an Azure Data Explorer cluster and database using [Go](https://golang.org/). You can then list and delete your new cluster and database and execute operations on your resources.
[Create Power Apps application to query data in Azure Data Explorer (preview)](power-apps-connector.md) | In this article, you will create a Power Apps application to query Azure Data Explorer data. During this process, you will see the steps of data parameterization, retrieval, and presentation.

### Updated articles

- Ignoring PR 1144: Update logicapps.md - GA - KEEP
- Ignoring PR 1068: Update row-level-security-policy.md and rowlevelsecuritypolicy.md - GA - KEEP 

#### Management

#### General

- [Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md) -KEEP
  - Azure advisor new recommendation and links
- [Use follower database to attach databases in Azure Data Explorer](follower.md) - KEEP
  - Use powershell to attach and detach follower databases 

## September 2020

Welcome to what's new in the Azure Data Explorer docs from September 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

New article title | Description
---|---
[zlib_compress_to_base64_string()](./kusto/query/zlib-base64-compress.md) | Performs zlib compression and encodes the result to base64.
[zlib_decompress_from_base64_string()](./kusto/query/zlib-base64-decompress.md) | Decodes the input string from base64 and performs zlib decompression.
[cosmosdb_sql_request plugin](./kusto/query/cosmosdb-plugin.md) | The `cosmosdb_sql_request` plugin sends a SQL query to a Cosmos DB SQL network endpoint and returns the results of the query. This plugin is primarily designed for querying small datasets, for example, enriching data with reference data stored in [Azure Cosmos DB](/azure/cosmos-db/).
[materialized_view() function](./kusto/query/materialized-view-function.md) | References the materialized part of a [materialized view](kusto/management/materialized-views/materialized-view-overview.md). 

#### Functions library

New article title | Description
---|---
[Functions library](./kusto/functions-library/functions-library.md) | The following article contains a categorized list of [UDF (user-defined functions)](kusto/query/functions/user-defined-functions.md). The user-defined functions code is given in the articles.  It can be used within a let statement embedded in a query or can be persisted in a database using [`.create function`](kusto/management/create-function.md).

#### Management

New article title | Description
---|---
[.create materialized-view](./kusto/management/materialized-views/materialized-view-create.md) | A [materialized view](kusto/management/materialized-views/materialized-view-overview.md) is an aggregation query over a source table, representing a single summarize statement.
[Materialized views (preview)](./kusto/management/materialized-views/materialized-view-overview.md) | [Materialized views](kusto/query/materialized-view-function.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](./kusto/management/materialized-views/materialized-view-overview.md#materialized-views-queries) is more performant than running the aggregation directly over the source table, which is performed each query.
[.alter materialized-view](./kusto/management/materialized-views/materialized-view-alter.md) | Altering the [materialized view](kusto/management/materialized-views/materialized-view-overview.md) can be used for changing the query of a materialized view, while preserving the existing data in the view.
[`.disable | .enable materialized-view`](./kusto/management/materialized-views/materialized-view-enable-disable.md) | Describes how to disable a materialized view.
[.drop materialized-view](./kusto/management/materialized-views/materialized-view-drop.md) | Drops a materialized view.
[.show materialized-views commands](./kusto/management/materialized-views/materialized-view-show-commands.md) | The following show commands display information about [materialized views](kusto/management/materialized-views/materialized-view-overview.md).

#### API

New article title | Description
---|---
[Azure Data Explorer Golang SDK](./kusto/api/golang/kusto-golang-client-library.md) | Azure Data Explorer Go Client library provides the capability to query, control, and ingest into Azure Data Explorer clusters using Go. 
[Ingestion without Kusto.Ingest Library](./kusto/api/netfx/kusto-ingest-client-rest.md) | The Kusto.Ingest library is preferred for ingesting data to Azure Data Explorer. However, you can still achieve almost the same functionality, without being dependent on the Kusto.Ingest package. This article shows you how, by using *Queued Ingestion* to Azure Data Explorer for production-grade pipelines.

#### General

New article title | Description
---|---
[Create a table in Azure Data Explorer (preview)](one-click-table.md) | The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer Web UI. 
[Enable isolated compute on your Azure Data Explorer cluster](isolated-compute.md) | Isolated compute virtual machines (VMs) enable customers to run their workload in a hardware isolated environment dedicated to single customer. Clusters deployed with isolated compute VMs are best suited for workloads that require a high degree of isolation for compliance and regulatory requirements.
[Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md) | Azure Advisor analyzes the Azure Data Explorer cluster configurations and usage telemetry and offers personalized and actionable recommendations to help you optimize your cluster.
[Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Visuals are essential part of any Azure Data Explorer Dashboard. This document details the different visual types and describes various options that are available to dashboard users to customize their visuals.

### Updated articles

- Ignoring PR 955: Update vnet-create-private-endpoint.md - GA - Keep

#### Query

- [geo_distance_point_to_line()](./kusto/query/geo-distance-point-to-line-function.md) -keep
  - Add multiline support docs
- [geo_line_densify()](./kusto/query/geo-line-densify-function.md) - keep
  - Add multiline support docs

#### General

- [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network](vnet-create-private-endpoint.md) - keep (see above in ignored as well)
  - change Disable network policies in Prerequisites section
  - Vnet private endpoint - Original PR 822
- [Visualize data from Azure Data Explorer in Grafana](grafana.md) - KEEP
  - Updated with new capabilities
- [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md), [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md) - KEEP
  - Update with new capabilities

## August 2020

Welcome to what's new in the Azure Data Explorer docs from August 2020. This article lists some of the major changes to docs during this period.

### New articles

#### Query

New article title | Description
---|---
[series_fft()](./kusto/query/series-fft-function.md) | Applies the Fast Fourier Transform (FFT) on a series.  
[series_ifft()](./kusto/query/series-ifft-function.md) | Applies the Inverse Fast Fourier Transform (IFFT) on a series. 
[dynamic_to_json()](./kusto/query/dynamic-to-json-function.md) | Converts `dynamic` input to a string representation. If the input is a property bag, the output string prints its content sorted by the keys, recursively. Otherwise, the output is similar to the `tostring` function output.
[format_ipv4()](./kusto/query/format-ipv4-function.md) | Parses input with a netmask and returns string representing IPv4 address.
[format_ipv4_mask()](./kusto/query/format-ipv4-mask-function.md) | Parses input with a netmask and returns string representing IPv4 address as CIDR notation.

### Management

New article title | Description
---|---- 
[Create or alter continuous export](./kusto/management/data-export/create-alter-continuous.md) | Creates or alters a continuous export job.
[Disable or enable continuous export](./kusto/management/data-export/disable-enable-continuous.md) | Disables or enables the continuous-export job. A disabled continuous export won't be executed, but its current state is persisted and can be resumed when the continuous export is enabled. 
[Drop continuous export](./kusto/management/data-export/drop-continuous-export.md) | Drops a continuous-export job.
[Show continuous export artifacts](./kusto/management/data-export/show-continuous-artifacts.md) | Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 
[Show continuous export](./kusto/management/data-export/show-continuous-export.md) | Returns the continuous export properties of *ContinuousExportNew article title*. 
[Show continuous export failures](./kusto/management/data-export/show-continuous-failures.md) | Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 
 
### General

New article title | Description
---|---
[Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer](double-encryption.md) | When you create a cluster, its storage is [automatically encrypted at the service level](/azure/storage/common/storage-service-encryption). If you require a higher level of assurance that your data is secure, you can also enable [Azure Storage infrastructure level encryption](/azure/storage/common/infrastructure-encryption-enable), also known as double encryption.
[Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md) | You can use the [Go SDK](https://github.com/Azure/azure-kusto-go) to ingest, control, and query data in Azure Data Explorer clusters. 
[Business continuity and disaster recovery overview](business-continuity-overview.md) | Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. 
[Connect to Event Grid](ingest-data-event-grid-overview.md) | Event Grid ingestion is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created or blob reNew article titled notifications and streaming these notifications to Azure Data Explorer via an Event Hub.
[Create business continuity and disaster recovery solutions with Azure Data Explorer](business-continuity-create-solution.md) | This article details how you can prepare for an Azure regional outage by replicating your Azure Data Explorer resources, management, and ingestion in different Azure regions.

### Updated articles

- Ignoring PR 800: Update rowlevelsecuritypolicy.md - how to produce error for unauthorized access - KEEP

#### Query

- [dynamic_to_json()](./kusto/query/dynamic-to-json-function.md) - should be new
  - introduced dynamic-to-json command

#### Management

- [Create and alter external tables in Azure Storage or Azure Data Lake](./kusto/management/external-tables-azurestorage-azuredatalake.md) - keep
  - Added Description to external table management article
  - External tables: specify new command option .create-or-alter
- [Create and alter external SQL tables](./kusto/management/external-sql-tables.md) - keep
  - External tables: specify new command option .create-or-alter

