---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/02/2023
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## January 2023

**General**

| Article title | Description |
|--|--|
|- [Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md) </br> - [Referencing security principals](/azure/data-explorer/kusto/management/access-control/referencing-security-principals.md) | Updated articles. Renewed and restructured referencing of security principals and identity providers.

**Functions library**

| Article title | Description |
|--|--|
|- [plotly_anomaly_fl()](/azure/data-explorer/kusto/functions-library/plotly-anomaly-fl.md) </br> - [plotly_scatter3d_fl()](/azure/data-explorer/kusto/functions-library/plotly-scatter3d-fl.md) | New articles. Describes how to customize a plotly template. |

**Management**

| Article title | Description |
|--|--|
|- [.dup-next-failed-ingest](/azure/data-explorer/kusto/management/dup-next-failed-ingest.md) <br/> - [.dup-next-ingest](/azure/data-explorer/kusto/management/dup-next-ingest.md) | New articles. Describes how to troubleshoot data on demand. |

**Query**

| Article title | Description |
|--|--|
|[render operator](/azure/data-explorer/kusto/query/renderoperator.md)| Refreshed article. Renewed list of visualizations.
|- [Anomaly chart](kusto/query/visualization-anomalychart.md) <br/> - [Area chart](kusto/query/visualization-areachart.md) <br/> - [Bar chart](kusto/query/visualization-barchart.md) <br/> - [Card](kusto/query/visualization-card.md) <br/> - [Column chart](kusto/query/visualization-columnchart.md) <br/> - [Ladder chart](kusto/query/visualization-ladderchart.md) <br/> - [Line chart](kusto/query/visualization-linechart.md) <br/> - [Pie chart](kusto/query/visualization-piechart.md) <br/> - [Pivot chart](kusto/query/visualization-pivotchart.md) <br/> - [Scatter chart](kusto/query/visualization-scatterchart.md) <br/> - [Stacked area chart](kusto/query/visualization-stackedareachart.md) <br/> - [Table](kusto/query/visualization-table.md) <br/> - [Time chart](kusto/query/visualization-timechart.md) <br/> - [Time pivot](kusto/query/visualization-timepivot.md) | New articles. Describes how to render visualizations of query results. |
| [series_dot_product()](/azure/data-explorer/kusto/query/series-dot-productfunction.md) | New articles. Describes how to calculate the dot product of two numeric series.|
| [hll_if() (aggregation function)](/azure/data-explorer/kusto/query/hll-if-aggregation-function.md) | New article. Describes how to calculate the intermediate results of the `dcount()` function. |
| [bag_set_key()](/azure/data-explorer/kusto/query/bag-set-key-function.md) | New article. Describes how to set a given key to a given value in a dynamic property bag. |

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
|- [Use the ingestion wizard to ingest JSON data](ingestion-wizard-existing-table.md) <br />- [Web UI overview](web-ui-overview.md)|Updated articles. Added references to ingestion wizard and updated UI.|

**Management**

| Article title | Description |
|--|--|
|[.cancel operation command](kusto/management/cancel-operation-command.md)| New article. Describes how to use the `.cancel operation` command.|
|[How to authenticate with Azure Active Directory](kusto/management/access-control/how-to-authenticate-with-aad.md)| Updated article. Updated with Microsoft Authentication Library authentication.|
|[.drop extents](kusto/management/drop-extents.md)| Updated article. Added examples to drop specific extents.|
|[Queries management](kusto/management/queries.md)| Updated article. Added show by user command.
|- [Ingest from storage](kusto/management/data-ingestion/ingest-from-storage.md)|Updated article. Added ingest from Amazon S3.
|- [.create-or-alter function](kusto/management/create-alter-function.md)<br />- [.create function](kusto/management/create-function.md)| New and updated article. Added new parameter for stored view.|

## July 2022

**General**

| Article title | Description |
|--|--|
| [Upgrade a free cluster](start-for-free-upgrade.md) | New Article. Describes how to upgrade a free cluster to a full cluster without losing your data. |

**Management**

| Article title | Description |
|--|--|
| [.alter extent tags](kusto/management/alter-extent.md) | Updated article. Added documentation for `alter-merge` extent tags. |

**Query**

| Article title | Description |
|--|--|
| - [convert_angle](kusto/query/convert-angle-function.md) <br />- [convert_energy](kusto/query/convert-energy-function.md) <br />- [convert_force](kusto/query/convert-force-function.md) <br />- [convert_length](kusto/query/convert-length-function.md) <br />- [convert_mass](kusto/query/convert-mass-function.md) <br />- [convert_speed](kusto/query/convert-speed-function.md) <br />- [convert_temperature](kusto/query/convert-temperature-function.md) <br />- [convert_volume](kusto/query/convert-volume-function.md) | New articles. New functions for converting values. |
| [parse-kv operator](kusto/query/parse-kv-operator.md) | New Article. Describes how to extract structured information from a string in key/value form. |
|- [Scalar function types at a glance](kusto/query/scalarfunctions.md) <br />- [arg_max() (aggregation function)](kusto/query/arg-max-aggfunction.md) <br />- [arg_min() (aggregation function)](kusto/query/arg-min-aggfunction.md) <br />- [avg() (aggregation function)](kusto/query/avg-aggfunction.md) <br />- [max() (aggregation function)](kusto/query/max-aggfunction.md) <br />- [min() (aggregation function)](kusto/query/min-aggfunction.md) <br />- [sum() (aggregation function)](kusto/query/sum-aggfunction.md) | Updated articles. Added new examples. |

## June 2022

| Article title | Description |
|--|--|
| [Ingest data from Azure Stream Analytics (Preview)](stream-analytics-connector.md) | New Article. Describes how to ingest (load) data from Azure Stream Analytics. |
| [Azure Data Explorer web UI overview](web-ui-overview.md) | New Article. Describes the elements of web UI home page and the data analytics journey. |
| [Explore the Azure Data Explorer web UI samples gallery](web-ui-samples-gallery.md) | New Article. Describes how to use the samples gallery in the web UI. |
| [Select a SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md) | Updated Article. New SKU list and refreshed content. |

## May 2022

| Article title | Description |
|--|--|
| [Ingest data from Telegraf](ingest-data-telegraf.md) | New Article. Describes how to ingest data into your cluster from Telegraf. |
| [Ingest data using managed identity authentication](ingest-data-managed-identity.md) | New Article. Queue Azure Storage blobs for ingestion using managed identity authentication. |
|- [Azure Data Explorer connector for Microsoft Power Automate](flow.md) <br />- [Usage examples for Power Automate connector](flow-usage.md) <br />- [Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md) <br />- [Microsoft Logic App and Azure Data Explorer](kusto/tools/logicapps.md)| Updated articles. General availability (GA). Content refreshed. |
| [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md) | Updated Article. Added section on drillthrough. |

## April 2022

| Article title | Description |
|--|--|
| - [Enable disk encryption for your cluster](cluster-encryption-disk.md)<br />- [Secure your cluster with encryption](cluster-encryption-overview.md)<br />- [Enable double encryption for your cluster](cluster-encryption-double.md) | New articles. Describing securing your cluster using disk encryption. |
| - [Create a managed private endpoint for your cluster](security-network-managed-private-endpoint-create.md)<br />- [Network security](security-network-overview.md)<br />- [Create a private endpoint for your cluster](security-network-private-endpoint-create.md)<br />- [Troubleshoot private endpoints](security-network-private-endpoint-troubleshoot.md)<br />- [Private endpoints for your cluster](security-network-private-endpoint.md)<br />- [Restrict outbound access from your cluster](security-network-restrict-outbound-access.md)<br />- [Restrict public access to your cluster](security-network-restrict-public-access.md)| New articles. Describes private endpoint security. |

**Management**

| Article title | Description |
|--|--|
| [Streaming ingestion failures](kusto/management/streamingingestionfailures.md) | New article. Describes the command to show streaming ingestion failures. |
| [Streaming ingestion statistics](kusto/management/streamingingestionstatistics.md) | New article. Describes the command to show streaming ingestion statistics. |

## March 2022

| Article title | Description |
|--|--|
| [Create a free cluster](start-for-free-web-ui.md) | New article. Describes how to create a free cluster, ingest data, and run queries. |
| - [Create an Event Grid data connection using C\#](data-connection-event-grid-csharp.md)<br />- [Create an Event Grid data connection using Python](data-connection-event-grid-python.md)<br />- [Create an Event Grid data connection using Azure Resource Manager template](data-connection-event-grid-resource-manager.md)<br />- [Create an Event Hubs data connection using C\#](data-connection-event-hub-csharp.md)<br />- [Create an Event Hubs data connection using Python](data-connection-event-hub-python.md)<br />- [Create an Event Hubs data connection using Azure Resource Manager template](data-connection-event-hub-resource-manager.md)<br />- [Create an IoT Hub data connection using C\# (Preview)](data-connection-iot-hub-csharp.md)<br />- [Create an IoT Hub data connection using Python (Preview)](data-connection-iot-hub-python.md)<br />- [Create an IoT Hub data connection using Azure Resource Manager template](data-connection-iot-hub-resource-manager.md) | Updated articles. Added `databaseRouting` parameter and setting. |
| - [Event Grid data connection](ingest-data-event-grid-overview.md)<br />- [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md) | Updated articles. Added events routing setting. |
| - [Azure Event Hubs data connection](ingest-data-event-hub-overview.md)<br />- [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md) | Updated articles. Added new Events Routing features including alternative databases and tables. |
| - [IoT Hub data connection](ingest-data-iot-hub-overview.md)<br />- [Ingest data from IoT Hub into Azure Data Explorer](ingest-data-iot-hub.md) | Updated articles. Added new sections on target databases (multi-database data connection). |

**Functions library**

| Article title | Description |
|--|--|
| [pairwise_dist_fl()](kusto/functions-library/pairwise-dist-fl.md) | New article. Describes the `pairwise_dist_fl()` user-defined function. |
| [series_uv_anomalies_fl()](kusto/functions-library/series-uv-anomalies-fl.md) | New article. Describes the `series_uv_anomalies_fl()` user-defined function. |
| [series_uv_change_points_fl()](kusto/functions-library/series-uv-change-points-fl.md) | New article. Describes the `series_uv_change_points_fl()` user-defined function. |

**Management**

| Article title | Description |
|--|--|
| [Clear schema cache for cross-cluster queries](kusto/management/clear-cross-cluster-schema-cache.md) | New article. Describes how to manually clear the cross-cluster query cache. |

**Query**

| Article title | Description |
|--|--|
| [http_request plugin / http_request_post plugin](kusto/query/http-request-plugin.md) | New article. Describes the http_request plugin. |
| [Cross-database and cross-cluster queries](kusto/query/cross-cluster-or-database-queries.md) | Updated article. Updated links to cross-cluster queries and schema changes page. |
| [Cross-cluster queries and schema changes](kusto/concepts/cross-cluster-and-schema-changes.md) | New article. Describes cross-cluster queries and schema changes. |

## February 2022

| Article title | Description |
|--|--|
| [What is a free cluster?](start-for-free.md) | New article. Describes how to get started with a free Azure Data Explorer cluster. |
| [Cross-tenant data connection](ingest-data-cross-tenant.md) | New article. Describes how to create cross-tenant data connections for Azure Event Hubs or Azure Event Grid services in a different tenant. |
| [Automated provisioning](automated-deploy-overview.md) | New article. Maps different articles for automating the provisioning of clusters. |

**Functions library**

| Article title | Description |
|--|--|
| [series_lag_fl()](kusto/functions-library/series-lag-fl.md) | New article. Describes the `series_lag_fl()` user-defined function. |
