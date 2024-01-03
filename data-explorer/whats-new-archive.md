---
title: What's new in Azure Data Explorer documentation archive
description: In this article, you'll find an archive of new and significant changes in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/08/2023
---
# What's new in Azure Data Explorer documentation archive

Welcome to what's new in Azure Data Explorer archive. This article is an archive of new and significantly updated content in the Azure Data Explorer documentation.

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
|- [count_distinct() (aggregation function) - (preview)](kusto/query/count-distinct-aggregation-function.md) <br/> - [count_distinctif() (aggregation function) - (preview)](kusto/query/count-distinctif-aggregation-function.md) | New articles. Count unique values specified by the scalar expression per summary group. |
|- [series_ceiling()](kusto/query/series-ceiling-function.md) <br/> - [series_floor()](kusto/query/series-floor-function.md) <br/> - [series_log()](kusto/query/series-log-function.md)| New articles. Calculate the element-wise functions of the numeric series input. |
|- [bin_auto()](kusto/query/bin-auto-function.md) <br/> - [binary_shift_left()](kusto/query/binary-shift-left-function.md) <br/> - [binary_shift_right()](kusto/query/binary-shift-right-function.md) <br/> - [binary_xor()](kusto/query/binary-xor-function.md) <br/> - [bin_at()](kusto/query/bin-at-function.md) <br/> - [bin()](kusto/query/bin-function.md) <br/> - [bitset_count_ones()](kusto/query/bitset-count-ones-function.md) <br/> - [buildschema() (aggregation function)](kusto/query/buildschema-aggregation-function.md) <br/> - [case()](kusto/query/case-function.md) <br/> - [ceiling()](kusto/query/ceiling-function.md) <br/> - [cosmosdb_sql_request plugin](kusto/query/cosmosdb-plugin.md)| Updated articles. Added new tables and examples. |

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
|- [Kusto emulator overview](kusto-emulator-overview.md)<br/>- [Install the Kusto emulator](kusto-emulator-install.md)|New articles. Describes the Kusto emulator, how to install it, and run your first query.|

## August 2022

**General**

| Article title | Description |
|--|--|
|- [Use the ingestion wizard to ingest JSON data](/azure/data-explorer/ingest-from-local-file) <br/>- [Web UI overview](./web-query-data.md)|Updated articles. Added references to ingestion wizard and updated UI.|

**Management**

| Article title | Description |
|--|--|
|[.cancel operation command](kusto/management/cancel-operation-command.md)| New article. Describes how to use the `.cancel operation` command.|
|[How to authenticate with Microsoft Entra ID](kusto/access-control/how-to-authenticate-with-aad.md)| Updated article. Updated with Microsoft Authentication Library authentication.|
|[.drop extents](kusto/management/drop-extents.md)| Updated article. Added examples to drop specific extents.|
|[Queries management](kusto/management/queries.md)| Updated article. Added show by user command.
|- [Ingest from storage](kusto/management/data-ingestion/ingest-from-storage.md)|Updated article. Added ingest from Amazon S3.
|- [.create-or-alter function](kusto/management/create-alter-function.md)<br/>- [.create function](kusto/management/create-function.md)| New and updated article. Added new parameter for stored view.|

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
|- [Scalar function types at a glance](kusto/query/scalar-functions.md) <br />- [arg_max() (aggregation function)](kusto/query/arg-max-aggregation-function.md) <br />- [arg_min() (aggregation function)](kusto/query/arg-min-aggregation-function.md) <br />- [avg() (aggregation function)](kusto/query/avg-aggfunction.md) <br />- [max() (aggregation function)](kusto/query/max-aggregation-function.md) <br />- [min() (aggregation function)](kusto/query/min-aggregation-function.md) <br />- [sum() (aggregation function)](kusto/query/sum-aggfunction.md) | Updated articles. Added new examples. |

## June 2022

| Article title | Description |
|--|--|
| [Ingest data from Azure Stream Analytics (Preview)](stream-analytics-connector.md) | New Article. Describes how to ingest (load) data from Azure Stream Analytics. |
| [Azure Data Explorer web UI overview](./web-query-data.md) | New Article. Describes the elements of web UI home page and the data analytics journey. |
| [Explore the Azure Data Explorer web UI samples gallery](./web-ui-samples-dashboards.md) | New Article. Describes how to use the samples gallery in the web UI. |
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
| [Streaming ingestion failures](kusto/management/streaming-ingestion-failures.md) | New article. Describes the command to show streaming ingestion failures. |
| [Streaming ingestion statistics](kusto/management/streaming-ingestion-statistics.md) | New article. Describes the command to show streaming ingestion statistics. |

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

## January 2022

| Article title | Description |
|--|--|
| [Use the sample app generator to create code to ingest and query your data](sample-app-generator-wizard.md) | New Article. Describes how to use the sample app generator for your preferred programming language. |

**API**

| Article title | Description |
|--|--|
| [Azure Data Explorer API overview](kusto/api/index.md) | Updated article. Added new tip and link to the doc on using the one-click sample app generator.

## December 2021

| Article title | Description |
|--|--|
| [Use parameters in dashboards](dashboard-parameters.md) | Updated article. Added new section for cross-filters as dashboard parameters. |

**Functions library**

| Article title | Description |
|--|--|
| [time_window_rolling_avg_fl()](kusto/functions-library/time-window-rolling-avg-fl.md) | New Article. Describes the function that calculates the rolling average of a metric over a constant duration time window. |

## November 2021

| Article title | Description |
|--|--|
| [Automatic stop of inactive clusters](auto-stop-clusters.md) | New article. Inactive clusters are automatically stopped. |
| [Solution architectures](solution-architectures.md) | New article. Lists references to the architectures that include Azure Data Explorer. |
| [Delete data](delete-data.md) | Updated article. Added new sections for purge and soft delete. |

**Query**

| Article title | Description |
|--|--|
| [[Soft delete]](kusto/concepts/data-soft-delete.md) | New article. Describes the data soft delete function. |

## October 2021

| Article title | Description |
|--|--|
| [Create an Event Grid data connection using C#](data-connection-event-grid-csharp.md) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Create an Event Grid data connection using Python](data-connection-event-grid-python.md) | Updated article.
| [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Event Grid data connection](ingest-data-event-grid-overview.md) | Updated article. AddedEvent Grid data connection from Azure portal.
| [Ingest blobs by subscribing to Event Grid notifications](ingest-data-event-grid.md) | Updated article. Added Event Grid data connection from Azure portal.
| [Add cluster principals using C#](cluster-principal-csharp.md) | Updated article. AddedAllDatabasesMonitor role.
| [Add cluster principals using Python](cluster-principal-python.md) | Updated article. Added AllDatabasesMonitor role.
| [Add cluster principals using an Azure Resource Manager template](cluster-principal-resource-manager.md) | Updated article. Added AllDatabasesMonitor role.
| [Add database principals using Python](database-principal-python.md) | Updated article. AddedAllDatabasesMonitor role.
| [Manage Azure Data Explorer database permissions](manage-database-permissions.md) | Updated article. Added AllDatabasesMonitor role.

**Management**

| Article title | Description |
|--|--|
| [Role-based access control in Kusto](kusto/access-control/role-based-access-control.md) | Updated article. Materialized views rename source table.
| [Cache policy (hot and cold cache)](kusto/management/cache-policy.md) | Updated article. Caching with long storage.
| [Role-based access control in Kusto](kusto/access-control/role-based-access-control.md)| Updated article. Using the AllDatabasesMonitor role.

## September 2021

| Article title | Description |
|--|--|
| [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md) | Updated article. Learn how to connect event hub with managed identity.

**Query**

| Article title | Description |
|--|--|
| [Views](kusto/query/schema-entities/views.md)| New article. Learn how to use views, which are virtual tables based on the result-set of a query.
| [Entity types](kusto/query/schema-entities/index.md)| Updated article. Added information on how to use views.

## August 2021

| Article title | Description |
|--|--|
| [Use wizard for ingestion with LightIngest (preview)](ingest-data-historical.md) | New article. Learn how to use a wizard for one-time ingestion of historical data with LightIngest.
| [Use one-click ingestion to create an event hub data connection](./event-hub-wizard.md)| Updated article. One click event hub experience.
| [Use LightIngest to ingest data into Azure Data Explorer](lightingest.md)| Updated article. Generate LightIngest commands - one click experience.

**Query**

| Article title | Description |
|--|--|
| [series_pow()](kusto/query/series-pow-function.md)| New article. Calculates the element-wise power of two numeric series inputs.
| [Aggregation function types at a glance](kusto/query/aggregation-functions.md) | New article. Lists aggregation functions, which perform a calculation on a set of values and return a single value.
| [Scalar function types at a glance](kusto/query/scalar-functions.md) | Updated article. Updated aggregation function and added series_pow.
| [materialized_view() function](kusto/query/materialized-view-function.md) | Updated article. Updated aggregation function.

**Management**

| Article title | Description |
|--|--|
| [.alter query weak consistency policy](kusto/management/alter-query-weak-consistency-policy.md) | New article.
| [Query weak consistency policy](kusto/management/query-weak-consistency-policy.md) | New article.
| [.show query weak consistency policy](kusto/management/show-query-weak-consistency-policy.md) | New article.

**Functions library**

| Article title | Description |
|--|--|
| [pair_probabilities_fl()](kusto/functions-library/functions-library.md) | New article. The function `pair_probabilities_fl()`calculates probabilities and metrics.
| [bartlett_test_fl()](kusto/functions-library/bartlett-test-fl.md) | New article. The function `bartlett_test_fl()` performs the [Bartlett Test](https://en.wikipedia.org/wiki/Bartlett%27s_test).
| [levene_test_fl()](kusto/functions-library/levene-test-fl.md) | New article. The function `levene_test_fl()` performs the [Levene Test](https://en.wikipedia.org/wiki/Levene%27s_test).
| [mann_whitney_u_test_fl()](kusto/functions-library/mann-whitney-u-test-fl.md) | New article. The function `mann_whitney_u_test_fl()` performs the [Mann-Whitney U Test](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test).
| [wilcoxon_test_fl()](kusto/functions-library/wilcoxon-test-fl.md) | New article. The function `wilcoxon_test_fl()` performs the [Wilcoxon Test](https://en.wikipedia.org/wiki/Wilcoxon_signed-rank_test).

## July 2021

| Article title | Description |
|--|--|
| [Monitor batching ingestion with metrics](monitor-batching-ingestion.md) | New article. Learn how to use Azure Data Explorer metrics to monitor batching ingestion to Azure Data Explorer in Azure portal.
| [Create an external table using the Azure Data Explorer web UI wizard](external-table.md) | Updated article. New UI.
| [Use one-click ingestion to create an event hub data connection](./event-hub-wizard.md)| Updated article. New UI.
| [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](/azure/data-explorer/ingest-from-local-file) | Updated article. New UI.
| [Ingest data from a container/ADLS into Azure Data Explorer](/azure/data-explorer/ingest-from-container) | Updated article. New UI.
| [Create a table in Azure Data Explorer](./create-table-wizard.md) | Updated article. New UI.

**Query**

| Article title | Description |
|--|--|
| [replace_string()](kusto/query/replace-string-function.md)| New article. Replaces all string matches with another string.
| [take_any() (aggregation function)](kusto/query/take-any-aggfunction.md) | New article. Replaces any().
| [take_anyif() (aggregation function)](kusto/query/take-anyif-aggfunction.md) | New article. Replaces anyif().
| [replace_regex()](kusto/query/replace-regex-function.md) | Updated article. Replace() function changed to replace_regex().

**Management**

| Article title | Description |
|--|--|
| [.alter extent tags retention policy](kusto/management/alter-extent-tags-retention-policy.md) | New article.
| [.delete extent tags retention policy](kusto/management/delete-extent-tags-retention-policy.md) | New article.
| [Extent tags retention policy](kusto/management/extent-tags-retention-policy.md) | New article. The extent tags retention policy controls the mechanism that automatically removes [extent tags](kusto/management/extent-tags.md) from tables, based on the age of the extents.
| [.show extent tags retention policy](kusto/management/show-extent-tags-retention-policy.md) | New article.
| [Stored query results](kusto/management/stored-query-results.md) | Updated article. General Availability.

**Functions library**

| Article title | Description |
|--|--|
 [two_sample_t_test_fl()](kusto/functions-library/two-sample-t-test-fl.md) | New article. The function `two_sample_t_test_fl()` performs the [Two-Sample T-Test](https://en.wikipedia.org/wiki/Student%27s_t-test#Independent_two-sample_t-test). |

## June 2021

| Article title | Description |
|--|--|
| -[Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs](using-diagnostic-logs.md)<br />- [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md) | Updated articles. Document batching types. |

**Query**

| Article title | Description |
|--|--|
| [rows_near() plugin](kusto/query/rows-near-plugin.md) | New article. Finds rows near a specified condition.
| [has_any_ipv4()](kusto/query/has-any-ipv4-function.md) | New article. Returns a value indicating whether one of specified IPv4 addresses appears in a text.
| [has_any_ipv4_prefix()](kusto/query/has-any-ipv4-prefix-function.md) | New article. Returns a value indicating whether one of specified IPv4 address prefixes appears in a text.

**Management**

| Article title | Description |
|--|--|
| [IngestionBatching policy](kusto/management/batching-policy.md) | Updated article. Document batching types

## May 2021

| Article title | Description |
|--|--|
| [Use follower databases](follower.md) | Updated article. Added table level sharing. |

## April 2021

**Query**

| Article title | Description |
|--|--|
[has_ipv4()](kusto/query/has-ipv4-function.md) | New article. Returns a value indicating whether a specified IPv4 address appears in a text.
[has_ipv4_prefix()](kusto/query/has-ipv4-prefix-function.md) | New article. Returns a value indicating whether a specified IPv4 address prefix appears in a text.
[scan operator (preview)](kusto/query/scan-operator.md) | New article. Scans data, matches, and builds sequences based on the predicates.
[Query results cache](kusto/query/query-results-cache.md) | Updated article. Per shard query results cache added.
[The string data type](kusto/query/scalar-data-types/string.md) | Updated article.
[Null Values](kusto/query/scalar-data-types/null-values.md) | Updated article.

**Management**

| Article title | Description |
|--|--|
[Workload groups - Management commands](kusto/management/show-workload-group-command.md) | Updated article. General Availability (GA).
[Workload groups](kusto/management/workload-groups.md) | Updated article. General Availability (GA).
[Materialized views](kusto/management/materialized-views/materialized-view-overview.md) | Updated article. General Availability (GA).
[Materialized views policies](kusto/management/materialized-views/materialized-view-policies.md) | Updated article. General Availability (GA).

**Functions library**

| Article title | Description |
|--|--|
[time_weighted_avg_fl()](kusto/functions-library/time-weighted-avg-fl.md) | New article. The function `time_weighted_avg_fl()` calculates the time weighted average of a metric in a given time window, over input time bins.

**API**

| Article title | Description |
|--|--|
[Request properties and ClientRequestProperties](kusto/api/netfx/request-properties.md) | Updated article. Per shard query results cache added.

## March 2021

| Article title | Description |
|--|--|
| [Create an external table (preview)](external-table.md) | New article. An external table is a schema entity that references data stored outside the Azure Data Explorer database. |

**Management**

| Article title | Description |
|--|--|
| - [Auto delete policy command](kusto/management/show-auto-delete-policy-command.md)<br />- [Auto delete policy](kusto/management/auto-delete-policy.md) | New articles. An auto delete policy on a table sets an expiry date for the table. |
| [Stored query results (Preview)](kusto/management/stored-query-results.md) | Updated article. Added async mode. |

**Functions library**

| Article title | Description |
|--|--|
| [binomial_test_fl()](kusto/functions-library/binomial-test-fl.md) | New article. The function `binomial_test_fl()` performs the [binomial test](https://en.wikipedia.org/wiki/Binomial_test). |
| [comb_fl()](kusto/functions-library/comb-fl.md) | New article. The function `comb_fl()`calculates *C(n, k)*, the number of [combinations](https://en.wikipedia.org/wiki/Combination) for selection of k items out of n, without order. |
| [factorial_fl()](kusto/functions-library/factorial-fl.md) | New article. The function `factorial_fl()`calculates [factorial](https://en.wikipedia.org/wiki/Factorial) of positive integers (*n!*). |
| [perm_fl()](kusto/functions-library/perm-fl.md) | New article. The function `perm_fl()`calculates *P(n, k)*, the number of [permutations](https://en.wikipedia.org/wiki/Permutation) for selection of k items out of n, with order. |

## February 2021

Article title | Description
---|---
[Optimize for high concurrency with Azure Data Explorer](high-concurrency.md) | New article. In this article, you learn to optimize your Azure Data Explorer setup for high concurrency.
| [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md) | Updated article. Explanation of table grid options.

**Query**

Article title | Description
---|---
[ipv4_is_in_range()](kusto/query/ipv4-is-in-range-function.md) | New article. Checks if IPv4 string address is in IPv4-prefix notation range.
[ipv4_netmask_suffix()](kusto/query/ipv4-netmask-suffix-function.md) | New article. Returns the value of the IPv4 netmask suffix from IPv4 string address.
[has_all operator](kusto/query/has-all-operator.md) | New article. `has_all` operator filters based on the provided set of values (all values must be present).
[row_rank()](./kusto/query/row-rank-dense-function.md) | New article. Returns the current row's rank in a [serialized row set](kusto/query/windowsfunctions.md#serialized-row-set).
| [Null Values](kusto/query/scalar-data-types/null-values.md) | Updated article. New behavior in Engine V3.
| [String operators](kusto/query/datatypes-string-operators.md) | Updated article. String term indexing for Engine V3.

**Management**

Article title | Description
---|---
| [Materialized views data purge](kusto/management/materialized-views/materialized-view-purge.md) | New article. [Data purge](kusto/concepts/data-purge.md) commands can be used to purge records from materialized views.
[.alter materialized-view lookback](kusto/management/materialized-views/materialized-view-alter-lookback.md) | New article. Alters the `lookback` value of an existing materialized view.
[.alter materialized-view autoUpdateSchema](kusto/management/materialized-views/materialized-view-alter-autoupdateschema.md) | New article. Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`.
[.alter materialized-view docstring](kusto/management/materialized-views/materialized-view-alter-docstring.md) | New article. Alters the DocString value of an existing materialized view.
[.alter materialized-view folder](kusto/management/materialized-views/materialized-view-alter-folder.md) | New article. Alters the folder value of an existing materialized view.
[.create-or-alter materialized-view](kusto/management/materialized-views/materialized-view-create-or-alter.md) | New article. Creates a materialized view or alters an existing materialized view.
[Materialized views policies](kusto/management/materialized-views/materialized-view-policies.md) | New article. Includes information about policies that can be set on a materialized view.
[Request queuing policy (Preview)](kusto/management/request-queuing-policy.md) | New article. A workload group's request queuing policy controls queueing of requests for delayed execution, once a certain threshold of concurrent requests is exceeded.

**Functions library**

Article title | Description
---|---
| [series_dbl_exp_smoothing_fl()](kusto/functions-library/series-dbl-exp-smoothing-fl.md) | New article. Applies a double exponential smoothing filter on a series.

## January 2021

Article title | Description
---|---
[Azure Policy Regulatory Compliance controls](security-controls-policy.md) | New article. This page lists the **compliance domains** and **security controls**.
[Allow cross-tenant queries and commands](kusto/access-control/cross-tenant-query-and-commands.md) | New article. In this article, you'll learn how to give cluster access to principals from another tenant.

**Management**

Article title | Description
---|---
[Clean extent containers commands](/azure/data-explorer/kusto/management/extents-overview) | New article. Describes the `.clean databases extentcontainers` and `.show database extentcontainers clean operations` commands.
[Request classification policy (Preview)](kusto/management/request-classification-policy.md)<br>[Request classification policy (Preview) - Management commands](kusto/management/show-cluster-policy-request-classification-command.md) | New articles. The classification process assigns incoming requests to a workload group, based on the characteristics of the requests.
[Request limits policy (Preview)](kusto/management/request-limits-policy.md) | New article. A workload group's request limits policy allows limiting the resources used by the request during its execution.
[Request rate limit policy (Preview)](kusto/management/request-rate-limit-policy.md) | New article. The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group.
[Workload groups (Preview)](kusto/management/workload-groups.md)<br>[Workload groups (Preview) - Management commands](kusto/management/show-workload-group-command.md) | New articles. A workload group serves as a container for requests (queries, commands) that have similar classification criteria. A workload allows for aggregate monitoring of the requests, and defines policies for the requests.
[Queries management](kusto/management/queries.md) | Updated article. Syntax updated

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
[Use one-click ingestion to create an event hub data connection](./event-hub-wizard.md) | New article. Connect an event hub to a table using the [one-click ingestion](./ingest-data-wizard.md) experience.
| [Configure managed identities for your cluster](configure-managed-identities-cluster.md) | Updated article. Supports both user-assigned managed identities and system-assigned managed identities
| [Create a table](./create-table-wizard.md) | Updated article. General availability (GA). |
 | [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md) | Updated article. New capabilities.
|  [What is one-click ingestion?](./ingest-data-wizard.md) | Updated article. Added ingestion from JSON nested levels. General availability (GA).
| [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md) | Updated article. New dashboard visuals and parameter changes.

**Query**

Article title | Description
---|---
[mysql_request plugin (Preview)](kusto/query/mysql-request-plugin.md) | New article. The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results.
[ipv4_lookup plugin](kusto/query/ipv4-lookup-plugin.md) | New article. The `ipv4_lookup` plugin looks up an IPv4 value in a lookup table and returns rows with matched values.
[ipv4_is_private()](kusto/query/ipv4-is-private-function.md) | New article. Checks if IPv4 string address belongs to a set of private network IPs.
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
| [Follower commands](kusto/management/cluster-follower.md) | Updated article. Syntax changed, added `.alter follower database prefetch-extents`. |

**Functions library**

Article title | Description
---|---
[series_downsample_fl()](kusto/functions-library/series-downsample-fl.md) | The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor).
[series_exp_smoothing_fl()](kusto/functions-library/series-exp-smoothing-fl.md) | Applies a basic exponential smoothing filter on a series.
