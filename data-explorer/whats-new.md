---
title: What's new in Azure Data Explorer
description: What's new in the Azure Data Explorer docs
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/17/2021
---
# What's new in Azure Data Explorer

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## January 2021

This section lists the major changes to docs during January 2021.

### General

Article title | Description
---|--- 
[Azure Policy Regulatory Compliance controls for Azure Data Explorer](security-controls-policy.md) | New article. This page lists the **compliance domains** and **security controls** for Azure Data Explorer.
[Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md) | New article. In this article, you will learn how to give cluster access to principals from another tenant.

### Management

### New articles

Article title | Description
---|---
[Clean extent containers commands](kusto/management/clean-extent-containers.md) | New article. This article describes the `.clean databases extentcontainers` and `.show database extentcontainers clean operations` commands in Azure Data Explorer.
[Request classification policy (Preview)](kusto/management/request-classification-policy.md)  <br>[Request classification policy (Preview) - Control commands](kusto/management/request-classification-policy-commands.md) | New articles. The classification process assigns incoming requests to a workload group, based on the characteristics of the requests.
[Request limits policy (Preview)](kusto/management/request-limits-policy.md) | New article. A workload group's request limits policy allows limiting the resources used by the request during its execution.
[Request rate limit policy (Preview)](kusto/management/request-rate-limit-policy.md) | New article. The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group.
[Workload groups (Preview)](kusto/management/workload-groups.md)  <br> [Workload groups (Preview) - Control commands](kusto/management/workload-groups-commands.md) | New articles. A workload group serves as a container for requests (queries, commands) that have similar classification criteria. A workload allows for aggregate monitoring of the requests, and defines policies for the requests.
[Queries management](kusto/management/queries.md) | Updated article. Syntax updated

## December 2020

This section lists the major changes to docs during December 2020.

### General

Article title | Description
---|---
[Ingestion error codes in Azure Data Explorer](error-codes.md) | New article. This list contains error codes you may come across during [ingestion](ingest-data-overview.md).

### Management

Article title | Description
---|---
[.create table based-on](kusto/management/create-table-based-on-command.md)  | New article. Creates a new empty table based on existing table.
[Stored query results (Preview)](kusto/management/stored-query-results.md) | New article. Stored query results is a mechanism that temporarily stores the result of a query on the service. 
[Create and alter external tables in Azure Storage or Azure Data Lake](/azure/data-explorer/kusto/management/external-tables-azurestorage-azuredatalake.md) | Updated article. Document `filesPreview` and `dryRun` external table definition options

### Functions library

Article title | Description
---|---
[series_metric_fl()](kusto/functions-library/series-metric-fl.md) | New article. The `series_metric_fl()` function selects and retrieves time series of metrics ingested to Azure Data Explorer using the Prometheus monitoring system.
[series_rate_fl()](kusto/functions-library/series-rate-fl.md) | New article. The function `series_rate_fl()` calculates the average rate of metric increase per second.
[series_fit_lowess_fl()](kusto/functions-library/series-fit-lowess-fl.md) | New article. The function `series_fit_lowess_fl()` applies a LOWESS regression on a series.
[Export data to an external table](/azure/data-explorer/kusto/management/data-export/export-data-to-an-external-table.md) | Updated article. New external table syntax in export docs

## November 2020

This section lists the major changes to docs during November 2020.

### General

Article title | Description
---|---
[Azure Policy built-in definitions for Azure Data Explorer](policy-reference.md) | New article. Index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions for Azure Data Explorer. 
[Use one-click ingestion to create an Event Hub data connection for Azure Data Explorer](one-click-event-hub.md) | New article. Connect an Event Hub to a table in Azure Data Explorer using the [one-click ingestion](ingest-data-one-click.md) experience.
| [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md) | Updated article. Supports both user-assigned managed identities and system-assigned managed identities
| [Create a table in Azure Data Explorer](one-click-table.md) | Updated article. General availability (GA). |
 | [Quickstart: Query data in Azure Data Explorer Web UI](web-query-data.md) | Updated article. New capabilities.
|  [What is one-click ingestion?](ingest-data-one-click.md) | Updated article. Added ingestion from JSON nested levels. General availability (GA).
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Updated article. New dashboard visuals and parameter changes.

### Query

Article title | Description
---|---
[mysql_request plugin (Preview)](./kusto/query/mysqlrequest-plugin.md) | New article. The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results. 
[ipv4_lookup plugin](./kusto/query/ipv4-lookup-plugin.md) | New article. The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](./kusto/query/ipv4-is-privatefunction.md) | New article. Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](./kusto/query/splunk-cheat-sheet.md) | New article. This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto. 
[gzip_compress_to_base64_string()](./kusto/query/gzip-base64-compress.md) | New article. Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](./kusto/query/gzip-base64-decompress.md) | New article. Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](./kusto/query/array-reverse-function.md) | New article. Reverses the order of the elements in a dynamic array.

### Management

Article title | Description
---|---
[.disable plugin](./kusto/management/disable-plugin.md) | New article. Disables a plugin.
[.enable plugin](./kusto/management/enable-plugin.md) | New article. Enables a plugin.
[.show plugins](./kusto/management/show-plugins.md) | New article. Lists all plugins of the cluster.
| [Cluster follower commands](kusto/management/cluster-follower.md) | Updated article. Syntax changed, added `.alter follower database prefetch-extents`. |

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
[Ingest data using the Azure Data Explorer Java SDK](java-ingest-data.md) | New article.  In this article, learn how to ingest data using the Azure Data Explorer Java library. 
[Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) | New article. In this article, you learn how to create manually the resources needed for Event Grid Ingestion: Event Grid subscription, Event Hub  namespace, and Event Hub. 
[Create a private or service endpoint to Event Hub and Azure Storage](vnet-endpoint-storage-event-hub.md) | New article. A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your VNet’s address space for the Azure service to securely connect between Azure Data Explorer and Azure services such as Azure Storage and Event Hub.  
[EngineV3 - preview](engine-v3.md) | New article. Kusto EngineV3 is Azure Data Explorer’s next generation storage and query engine. 
[Create an Azure Data Explorer cluster and database using Go](create-cluster-database-go.md) |  New article. In this article, you create an Azure Data Explorer cluster and database using [Go](https://golang.org/). 
[Create Power Apps application to query data in Azure Data Explorer (preview)](power-apps-connector.md) | New article. In this article, you will create a Power Apps application to query Azure Data Explorer data. 
|[Microsoft Logic App and Azure Data Explorer ](kusto/tools/logicapps.md) |Updated article. General availability (GA).
| [Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster](azure-advisor.md) | Updated article. Azure advisor new recommendation.
| [Use follower database to attach databases in Azure Data Explorer](follower.md) | Updated article. Use PowerShell to attach and detach follower databases. 

### Query

Article title | Description
---|---
[project-keep operator](./kusto/query/project-keep-operator.md) | New article. Select what columns from the input to keep in the output.
[bag_remove_keys()](./kusto/query/bag-remove-keys-function.md) | New article. Removes keys and associated values from a `dynamic` property-bag.
[series_fit_poly()](./kusto/query/series-fit-poly-function.md) | New article. Applies a polynomial regression from an independent variable (x_series) to a dependent variable (y_series). 
[array_sort_asc()](./kusto/query/arraysortascfunction.md) | New article. Receives one or more arrays. Sorts the first array in ascending order. Orders the remaining arrays to match the reordered first array.
[array_sort_desc()](./kusto/query/arraysortdescfunction.md) | New article. Receives one or more arrays. Sorts the first array in descending order. Orders the remaining arrays to match the reordered first array.

### Management

 Article title | Description
---|---
[Query throttling policy commands](./kusto/management/query-throttling-policy-commands.md) | New article. The [query throttling policy](kusto/management/query-throttling-policy.md) is a cluster-level policy to restrict query concurrency in the cluster. 
[Query throttling policy](./kusto/management/query-throttling-policy.md) | New article. Define the query throttling policy to limit the number of concurrent queries the cluster can execute at the same time. 
[.clear table data](./kusto/management/clear-table-data-command.md) | New article. Clears the data of an existing table, including streaming ingestion data.
|  [row_level_security policy command](kusto/management/row-level-security-policy.md) <br> [Row Level Security](kusto/management/rowlevelsecuritypolicy.md) |Updated articles. General availability (GA).

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
[Enable isolated compute on your Azure Data Explorer cluster](isolated-compute.md) | New article. Isolated compute virtual machines (VMs) enable customers to run their workload in a hardware isolated environment dedicated to single customer.
[Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)](azure-advisor.md) | New article.  Azure Advisor analyzes the Azure Data Explorer cluster configurations and usage telemetry and offers personalized and actionable recommendations to help you optimize your cluster.
[Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) |New article. This document details the different visual types and describes various options that are available to dashboard users to customize their visuals.
| [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network (preview)](vnet-create-private-endpoint.md) | Updated article. General availability (GA).
| [Visualize data from Azure Data Explorer in Grafana](grafana.md) | Updated article. Updated with new capabilities.
| [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md) <br> [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md) | Updated articles. Updated with new capabilities.

#### Query

 Article title | Description
---|---
[zlib_compress_to_base64_string()](./kusto/query/zlib-base64-compress.md) | New article.  Performs zlib compression and encodes the result to base64.
[zlib_decompress_from_base64_string()](./kusto/query/zlib-base64-decompress.md) |New article.  Decodes the input string from base64 and performs zlib decompression.
[cosmosdb_sql_request plugin](./kusto/query/cosmosdb-plugin.md) | New article. The `cosmosdb_sql_request` plugin sends a SQL query to a Cosmos DB SQL network endpoint and returns the results of the query. 
[materialized_view() function](./kusto/query/materialized-view-function.md) |New article.  References the materialized part of a [materialized view](kusto/management/materialized-views/materialized-view-overview.md). 
| [geo_distance_point_to_line()](./kusto/query/geo-distance-point-to-line-function.md) | Updated article. Add multiline support docs.
|[geo_line_densify()](./kusto/query/geo-line-densify-function.md)| Updated article. Add multiline support docs. |

#### Management

 Article title | Description
---|---
[.create materialized-view](./kusto/management/materialized-views/materialized-view-create.md) | New article.  A [materialized view](kusto/management/materialized-views/materialized-view-overview.md) is an aggregation query over a source table, representing a single summarize statement.
[Materialized views (preview)](./kusto/management/materialized-views/materialized-view-overview.md) | New article.  [Materialized views](kusto/query/materialized-view-function.md) expose an *aggregation* query over a source table. 
[.alter materialized-view](./kusto/management/materialized-views/materialized-view-alter.md) | New article. Altering the [materialized view](kusto/management/materialized-views/materialized-view-overview.md) can be used for changing the query of a materialized view, while preserving the existing data in the view.
[.disable .enable materialized-view](./kusto/management/materialized-views/materialized-view-enable-disable.md) | New article. Describes how to disable a materialized view.
[.drop materialized-view](./kusto/management/materialized-views/materialized-view-drop.md) | New article. Drops a materialized view.
[.show materialized-views commands](./kusto/management/materialized-views/materialized-view-show-commands.md) | New article. The following show commands display information about [materialized views](kusto/management/materialized-views/materialized-view-overview.md).

#### Functions library

 Article title | Description
---|---
[Functions library](./kusto/functions-library/functions-library.md) | New article. The following article contains a categorized list of [UDF (user-defined functions)](kusto/query/functions/user-defined-functions.md). 

#### API

 Article title | Description
---|---
[Azure Data Explorer Golang SDK](./kusto/api/golang/kusto-golang-client-library.md) | New article. Azure Data Explorer Go Client library provides the capability to query, control, and ingest into Azure Data Explorer clusters using Go. 
[Ingestion without Kusto.Ingest Library](./kusto/api/netfx/kusto-ingest-client-rest.md) | New article. The Kusto.Ingest library is preferred for ingesting data to Azure Data Explorer. However, you can still achieve almost the same functionality, without being dependent on the Kusto.Ingest package.

## August 2020

This section lists the major changes to docs during August 2020.

### General

 Article title | Description
---|---
[Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer](double-encryption.md) | New article. If you require a higher level of assurance that your data is secure, you can also enable [Azure Storage infrastructure level encryption](/azure/storage/common/infrastructure-encryption-enable), also known as double encryption.
[Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md) | New article. You can use the [Go SDK](https://github.com/Azure/azure-kusto-go) to ingest, control, and query data in Azure Data Explorer clusters. 
[Business continuity and disaster recovery overview](business-continuity-overview.md) | New article. Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. 
[Connect to Event Grid](ingest-data-event-grid-overview.md) | New article. Event Grid ingestion is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. 
[Create business continuity and disaster recovery solutions with Azure Data Explorer](business-continuity-create-solution.md) | New article. This article details how you can prepare for an Azure regional outage by replicating your Azure Data Explorer resources, management, and ingestion in different Azure regions.

### Query

 Article title | Description
---|---
[series_fft()](./kusto/query/series-fft-function.md) | New article. Applies the Fast Fourier Transform (FFT) on a series.  
[series_ifft()](./kusto/query/series-ifft-function.md) | New article. Applies the Inverse Fast Fourier Transform (IFFT) on a series. 
[dynamic_to_json()](./kusto/query/dynamic-to-json-function.md) | New article. Converts `dynamic` input to a string representation. 
[format_ipv4()](./kusto/query/format-ipv4-function.md) | New article. Parses input with a netmask and returns string representing IPv4 address.
[format_ipv4_mask()](./kusto/query/format-ipv4-mask-function.md) | New article. Parses input with a netmask and returns string representing IPv4 address as CIDR notation.

### Management

 Article title | Description
---|---- 
[Create or alter continuous export](./kusto/management/data-export/create-alter-continuous.md) | New article. Creates or alters a continuous export job.
[Disable or enable continuous export](./kusto/management/data-export/disable-enable-continuous.md) | New article. Disables or enables the continuous-export job. 
[Drop continuous export](./kusto/management/data-export/drop-continuous-export.md) | New article. Drops a continuous-export job.
[Show continuous export artifacts](./kusto/management/data-export/show-continuous-artifacts.md) | New article. Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest.
[Show continuous export](./kusto/management/data-export/show-continuous-export.md) | New article. Returns the continuous export properties of *ContinuousExport Name*. 
[Show continuous export failures](./kusto/management/data-export/show-continuous-failures.md) | New article. Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 
| [Row Level Security](kusto/management/rowlevelsecuritypolicy.md) | Updated article. How to produce error for unauthorized access.
|[Create and alter external tables in Azure Storage or Azure Data Lake](./kusto/management/external-tables-azurestorage-azuredatalake.md) <br> <br> [Create and alter external SQL tables](./kusto/management/external-sql-tables.md) | Updated articles. New command option `.create-or-alter`.

## Next steps

To contribute to the Azure Data Explorer docs, see the [Docs contributor guide](https://docs.microsoft.com/contribute/).
