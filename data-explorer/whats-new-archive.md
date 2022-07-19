---
title: What's new in Azure Data Explorer documentation archive
description: In this article, you'll find an archive of new and significant changes in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/06/2022
---
# What's new in Azure Data Explorer documentation archive

Welcome to what's new in Azure Data Explorer archive. This article is an archive of new and significantly updated content in the Azure Data Explorer documentation.

## December 2020

Article title | Description
---|---
[Ingestion error codes in Azure Data Explorer](error-codes.md) | New article. This list contains error codes you may come across during [ingestion](ingest-data-overview.md).

**Management**

Article title | Description
---|---
[.create table based-on](kusto/management/create-table-based-on-command.md)  | New article. Creates a new empty table based on existing table.
[Stored query results (Preview)](kusto/management/stored-query-results.md) | New article. Stored query results is a mechanism that temporarily stores the result of a query on the service.
[Create and alter Azure Storage external tables](kusto/management/external-tables-azurestorage-azuredatalake.md) | Updated article. Document `filesPreview` and `dryRun` external table definition options
[Export data to an external table](kusto/management/data-export/export-data-to-an-external-table.md) | Updated article. New external table syntax in export docs

**Functions library**

Article title | Description
---|---
[series_metric_fl()](kusto/functions-library/series-metric-fl.md) | New article. The `series_metric_fl()` function selects and retrieves time series of metrics ingested to Azure Data Explorer using the Prometheus monitoring system.
[series_rate_fl()](kusto/functions-library/series-rate-fl.md) | New article. The function `series_rate_fl()` calculates the average rate of metric increase per second.
[series_fit_lowess_fl()](kusto/functions-library/series-fit-lowess-fl.md) | New article. The function `series_fit_lowess_fl()` applies a LOWESS regression on a series.

## November 2020

Article title | Description
---|---
[Azure Policy built-in definitions](policy-reference.md) | New article. Index of [Azure Policy](/azure/governance/policy/overview) built-in policy definitions.
[Use one-click ingestion to create an event hub data connection](one-click-event-hub.md) | New article. Connect an event hub to a table using the [one-click ingestion](ingest-data-one-click.md) experience.
| [Configure managed identities for your cluster](configure-managed-identities-cluster.md) | Updated article. Supports both user-assigned managed identities and system-assigned managed identities
| [Create a table](one-click-table.md) | Updated article. General availability (GA). |
 | [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md) | Updated article. New capabilities.
|  [What is one-click ingestion?](ingest-data-one-click.md) | Updated article. Added ingestion from JSON nested levels. General availability (GA).
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Updated article. New dashboard visuals and parameter changes.

**Query**

Article title | Description
---|---
[mysql_request plugin (Preview)](kusto/query/mysqlrequest-plugin.md) | New article. The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results.
[ipv4_lookup plugin](kusto/query/ipv4-lookup-plugin.md) | New article. The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](kusto/query/ipv4-is-privatefunction.md) | New article. Checks if IPv4 string address belongs to a set of private network IPs.
[Splunk to Kusto Query Language map](kusto/query/splunk-cheat-sheet.md) | New article. This article is intended to assist users who are familiar with Splunk learn the Kusto Query Language to write log queries with Kusto.
[gzip_compress_to_base64_string()](kusto/query/gzip-base64-compress.md) | New article. Performs gzip compression and encodes the result to base64.
[gzip_decompress_from_base64_string()](kusto/query/gzip-base64-decompress.md) | New article. Decodes the input string from base64 and performs gzip decompression.
[array_reverse()](kusto/query/array-reverse-function.md) | New article. Reverses the order of the elements in a dynamic array.

**Management**

Article title | Description
---|---
[.disable plugin](kusto/management/disable-plugin.md) | New article. Disables a plugin.
[.enable plugin](kusto/management/enable-plugin.md) | New article. Enables a plugin.
[.show plugins](kusto/management/show-plugins.md) | New article. Lists all plugins of the cluster.
| [Cluster follower commands](kusto/management/cluster-follower.md) | Updated article. Syntax changed, added `.alter follower database prefetch-extents`. |

**Functions library**

Article title | Description
---|---
[series_downsample_fl()](kusto/functions-library/series-downsample-fl.md) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor).
[series_exp_smoothing_fl()](kusto/functions-library/series-exp-smoothing-fl.md) | Applies a basic exponential smoothing filter on a series.
