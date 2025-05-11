---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/11/2025
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and updated content in the Azure Data Explorer documentation.

## April 2025

**Query**

| Article title | Description |
|--|--|
| - [ai_chat_completion plugin (preview)](/kusto/query/ai-chat-completion-plugin?view=azure-data-explorer&preserve-view=true)<br/>- [ai_chat_completion_prompt plugin (preview)](/kusto/query/ai-chat-completion-prompt-plugin?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to use the ai_chat plugins to chat with large language models, enabling AI-related scenarios such as RAG application and semantic search. |
| - [geo_line_lookup plugin (preview)](/kusto/query/geo-line-lookup-plugin?view=azure-data-explorer&preserve-view=true)<br/>- [geo_polygon_lookup plugin (preview)](/kusto/query/geo-polygon-lookup-plugin?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to use the geo line/polygon plugin to look up line/polygon value in a lookup table. |
| [Geospatial joins](/kusto/query/geospatial-joins?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use KQL tools for geospatial joins, including examples. |
| - [geo_closest_point_on_line()](/kusto/query/geo-closest-point-on-line-function?view=azure-data-explorer&preserve-view=true)<br/>- [geo_closest_point_on_polygon()](/kusto/query/geo-closest-point-on-polygon-function?view=azure-data-explorer&preserve-view=true)<br/>- [geo_from_wkt()](/kusto/query/geo-from-wkt-function?view=azure-data-explorer&preserve-view=true)<br>- [geo_line_interpolate_point()](/kusto/query/geo-line-interpolate-point-function?view=azure-data-explorer&preserve-view=true)<br/>- [geo_line_locate_point()](/kusto/query/geo-line-locate-point-function?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to use new geospatial line functions. |
| [any() (graph function)](/kusto/query/any-graph-function?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the any() function to evaluate a condition over the elements of a variable length edge. |
| [graph-match operator](/kusto/query/graph-match-operator?view=azure-data-explorer&preserve-view=true)<br/>- [inner_nodes() (graph function)](/kusto/query/inner-nodes-graph-function?view=azure-data-explorer&preserve-view=true)<br/>- [node_degree_in() (graph function)](/kusto/query/node-degree-in?view=azure-data-explorer&preserve-view=true)<br/>- [node_degree_out() (graph function)](/kusto/query/node-degree-out?view=azure-data-explorer&preserve-view=true) | Updated articles. The functions can be used with the any() graph function . |
| [geo_distance_2points()](/kusto/query/geo-distance-2points-function?view=azure-data-explorer&preserve-view=true) | Updated article. Updated the syntax to include *use_spheroid* |
| [Scalar function types at a glance](/kusto/query/scalar-functions?view=azure-data-explorer&preserve-view=true) | Updated article. Added new functions to the table. |

## March 2025

**Functions library**

|Article title | Description|
|--|--|
| [graph_node_centrality_fl()](/kusto/functions-library/graph-node-centrality-fl?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the graph_node_centrality_fl() function to calculate metrics of node centrality over graph data. |
| [Functions library](/kusto/functions-library/functions-library?view=azure-data-explorer&preserve-view=true) | Updated articles. Added graph node centrality function to library.|

**Management**

| Article title | Description |
|--|--|
| - [Queued ingestion overview (Preview)](/kusto/management/data-ingestion/queued-ingestion-overview?view=azure-data-explorer&preserve-view=true)<br/> - [Queued ingestion use case (Preview)](/kusto/management/data-ingestion/queued-ingestion-use-case?view=azure-data-explorer&preserve-view=true)<br/>- [.cancel queued ingestion operation command (Preview)](/kusto/management/data-ingestion/cancel-queued-ingestion-operation-command?view=azure-data-explorer&preserve-view=true)<br/>- [.list blobs command (Preview)](/kusto/management/data-ingestion/list-blobs?view=azure-data-explorer&preserve-view=true)<br/>- [.ingest-from-storage-queued command (Preview)](/kusto/management/data-ingestion/ingest-from-storage-queued?view=azure-data-explorer&preserve-view=true)<br/>- [.show queued ingestion operations command (Preview)](/kusto/management/data-ingestion/show-queued-ingestion-operations?view=azure-data-explorer&preserve-view=true)<br/>| New articles. Learn about queued ingestion and its commands.|
| [.alter-merge table policy mirroring command](/kusto/management/alter-merge-mirroring-policy-command?view=azure-data-explorer&preserve-view=true) | Updated article. Added Onelake Backfill and EffectiveDateTime properties, to add support for mirroring from a specified time. |
| [.show table policy mirroring command](/kusto/management/show-table-mirroring-policy-command?view=azure-data-explorer&preserve-view=true) | Updated article. Refreshed with an example. |

**Query**

| Article title | Description |
|--|--|
| - [covariance() (aggregation function)](/kusto/query/covariance-aggregation-function?view=azure-data-explorer&preserve-view=true)<br/>- [covariancep() (aggregation function)](/kusto/query/covariancep-aggregation-function?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to use the covariance()/covariancep() aggregation functions to calculate the sample covariance of two random variables. |
| - [make-series operator](/kusto/query/make-series-operator?view=azure-data-explorer&preserve-view=true)<br/> - [Null values](/kusto/query/scalar-data-types/null-values?view=azure-data-explorer&preserve-view=true) | Updated articles.  Added covariance()/covariancep() aggregation functions to the list of operators that cause null values to be ignored. |
| [Splunk to Kusto cheat sheet](/kusto/query/splunk-cheat-sheet?view=azure-data-explorer&preserve-view=true) | Updated article. Added timechart Splunk to Kusto comparison. |

## February 2025

**API**

|Article title | Description|
|--|--|
| [Create an app to get data using the managed streaming ingestion client](/kusto/api/get-started/app-managed-streaming-ingest?view=azure-data-explorer&preserve-view=true)| New article. Learn how to create a basic application to ingest data from a file or in-memory stream using the managed streaming ingestion client.|
| [Controlling and suppressing Kusto SDK client-side tracing](/kusto/api/netfx/controlling-tracing?view=azure-data-explorer&preserve-view=true) | Updated article. Clarified instructions of how to enable or disable tracing. |

**Functions library**

|Article title | Description|
|--|--|
| - [Functions library](/kusto/functions-library/functions-library?view=azure-data-explorer&preserve-view=true)<br/>- [graph_blast_radius_fl()](/kusto/functions-library/graph-blast-radius-fl?view=azure-data-explorer&preserve-view=true) <br/>- [graph_exposure_perimeter_fl()](/kusto/functions-library/graph-exposure-perimeter-fl?view=azure-data-explorer&preserve-view=true) | Updated articles. Refreshed with clearer content.|

**Management**

|Article title | Description|
|--|--|
| - [Entity groups](/kusto/management/entity-groups?view=azure-data-explorer&preserve-view=true)<br/>- [.alter entity_group command](/kusto/management/alter-entity-group?view=azure-data-explorer&preserve-view=true)<br/>- [.alter-merge entity_group command](/kusto/management/alter-merge-entity-group?view=azure-data-explorer&preserve-view=true)<br/>- [.create entity_group command](/kusto/management/create-entity-group?view=azure-data-explorer&preserve-view=true)<br/>- [.drop entity_group command](/kusto/management/drop-entity-group?view=azure-data-explorer&preserve-view=true)<br/>- [.show entity_group(s) command](/kusto/management/show-entity-group?view=azure-data-explorer&preserve-view=true)<br/>  [macro-expand operator](/kusto/query/macro-expand-operator?view=azure-data-explorer&preserve-view=true) | Updated articles. Refreshed with clearer content.|
| - [.alter materialized-view lookback](/kusto/management/materialized-views/materialized-view-alter-lookback?view=azure-data-explorer&preserve-view=true)<br/>- [.alter materialized-view](/kusto/management/materialized-views/materialized-view-alter?view=azure-data-explorer&preserve-view=true)<br/>- [.create-or-alter materialized-view](/kusto/management/materialized-views/materialized-view-create-or-alter?view=azure-data-explorer&preserve-view=true)<br/>- [.create materialized-view](/kusto/management/materialized-views/materialized-view-create?view=azure-data-explorer&preserve-view=true)<br/>- [Materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true)<br/>- [Materialized views limitations and known issues](/kusto/management/materialized-views/materialized-views-limitations?view=azure-data-explorer&preserve-view=true)<br/>- [Monitor materialized views](/kusto/management/materialized-views/materialized-views-monitoring?view=azure-data-explorer&preserve-view=true) | Updated articles. Refreshed with clearer content, examples, and troubleshooting. |

**Query**

|Article title | Description|
|--|--|
| - [all() (graph function)](/kusto/query/all-graph-function?view=azure-data-explorer&preserve-view=true)<br/>- [inner_nodes() (graph function)](/kusto/query/inner-nodes-graph-function?view=azure-data-explorer&preserve-view=true)<br/>- [map() (graph function)](/kusto/query/map-graph-function?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to use the all(), inner nodes, and map graph functions to evaluate a condition over the elements of a variable length edge. |
| - [node_degree_in() (graph function)](/kusto/query/node-degree-in?view=azure-data-explorer&preserve-view=true)<br/>- [node_degree_out() (graph function)](/kusto/query/node-degree-out?view=azure-data-explorer&preserve-view=true) | New articles. Learn how to calculate the number of incoming or outgoing edges in a directed graph.|

## January 2025

**General**

| Article title | Description |
|--|--|
| [Customize settings in the web UI](web-customize-settings.md) | Updated topic. Added how to enable cross-tenant dashboard sharing. |
| [Share dashboards](azure-data-explorer-dashboard-share.md) | New article. Describes how to share dashboards in Azure Data Explorer. |
| [Share queries from web UI](web-share-queries.md) | Updated topic. Added information about shared queries opening in protected mode for enhanced security. |
| [Troubleshoot: Failure to connect to a cluster](troubleshoot-connect-cluster.md) | Updated topic. Added instructions how to verify a cluster is active. |
| [Manage public access to your cluster](security-network-restrict-public-access.md) | Updated topic. Added section to manage access to your cluster by specifying selected IP addresses, CIDER notations, or service tags. |

**Query**

| Article title | Description |
|--|--|
| [range operator](/kusto/query/range-operator?view=azure-data-explorer&preserve-view=true) | Updated topic. Added example of using the range operator to combine different stop times. |
| [replace_string() function](/kusto/query/replace-string-function?view=azure-data-explorer&preserve-view=true) | Updated topic. Added a simpler example that replaces words in a string. |

## December 2024

**Functions library**

|Article title | Description|
|--|--|
| [graph_path_discovery_fl()](/kusto/functions-library/graph-path-discovery-fl?view=azure-data-explorer&preserve-view=true)| New article. Describes how to discover valid paths between relevant endpoints over graph data. |

**General**

|Article title | Description|
|--|--|
| [Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md) | Updated topic. Added keyboard shortcuts for Apple macOS. |
| [Ingest data with Fluent Bit into Azure Data Explorer](fluent-bit.md)| Updated topic. Added new properties to the Fluent Bit client configuration file. |

**Query**

|Article title | Description|
|--|--|
|- [series_periods_detect()](/kusto/query/series-periods-detect-function?view=azure-data-explorer&preserve-view=true) <br/> - [extract()](/kusto/query/extract-function?view=azure-data-explorer&preserve-view=true) <br/> - [max_of()](/kusto/query/max-of-function?view=azure-data-explorer&preserve-view=true) <br/> - [iff()](/kusto/query/iff-function?view=azure-data-explorer&preserve-view=true) <br/> - [parse_version()](/kusto/query/parse-version-function?view=azure-data-explorer&preserve-view=true) <br/>- [not()](/kusto/query/not-function?view=azure-data-explorer&preserve-view=true) <br/> - [Tutorial: Learn common operators](/kusto/query/tutorials/learn-common-operators?view=azure-data-explorer&preserve-view=true) <br/> - [sum() (aggregation function)](/kusto/query/sum-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [arg_max() (aggregation function)](/kusto/query/arg-max-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [arg_min() (aggregation function)](/kusto/query/arg-min-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [max() (aggregation function)](/kusto/query/max-aggregation-function?view=azure-data-explorer&preserve-view=true) <br/> - [min() (aggregation function)](/kusto/query/min-aggregation-function?view=azure-data-explorer&preserve-view=true) | Updated topics. Refreshed with clearer content and enhances examples. <br/> Added examples for the iff() and arg_min() functions. Added example outputs for extract().  |

## November 2024

**API**

|Article title | Description|
|--|--|
| [App authentication methods](/kusto/api/get-started/app-authentication-methods?view=azure-data-explorer&preserve-view=true) | New article. Learn about the different authentication methods that can be used in apps using Kusto client libraries. |
| [Kusto connection strings](/kusto/api/connection-strings/kusto?view=azure-data-explorer&preserve-view=true) | Updated article. Refreshed content and updated code. |
| [Request properties](/kusto/api/rest/request-properties?view=azure-data-explorer&preserve-view=trued) | Updated article. Refreshed content and added a section that lists which request properties can't be set with a set statement. |

**Functions library**

|Article title | Description|
|--|--|
| [detect_anomalous_new_entity_fl()](/kusto/functions-library/detect-anomalous-new-entity-fl?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the detect_anomalous_new_entity_fl() function to detect the appearance of anomalous new entities. |
| [plotly_gauge_fl()](/kusto/functions-library/plotly-gauge-fl?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the plotly_gauge_fl() user-defined function. |
| [Functions library](/kusto/functions-library/functions-library?view=azure-data-explorer&preserve-view=true) | Updated article. Added detect anomalous new entity and use of a Plotly template to render a gauge chart. |
| [plotly_anomaly_fl()](/kusto/functions-library/plotly-anomaly-fl?view=azure-data-explorer&preserve-view=true) | Updated article. Added use of a Plotly template to render a gauge chart. |

**General**

|Article title | Description|
|--|--|
| [Create a managed private endpoint](security-network-managed-private-endpoint-create.md) | Updated article. Refreshed content and added information about creating multiple managed private endpoints and automatic approval. |

**Management**

|Article title | Description|
|--|--|
| [Managed Identity policy](/kusto/management/managed-identity-policy?view=azure-data-explorer&preserve-view=true) | Updated article. Added *ai_embeddings* plugin for `AzureAI` to the list of managed identity usages. |

**Query**

|Article title | Description|
|--|--|
| [graph-shortest-paths operator (preview)](/kusto/query/graph-shortest-paths-operator?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the graph_shortest_paths operator to efficiently find the shortest paths from a given set of source nodes to a set of target nodes within a graph. |
| [graph-mark-components operator (preview)](/kusto/query/graph-mark-components-operator?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the graph_mark_components operator to find and mark all connected components of a graph. |
| [ai_embeddings plugin (preview)](/kusto/query/ai-embeddings-plugin?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the ai_embeddings plugin to embed text via language models, enabling various AI-related scenarios such as RAG application and semantic search. |
| [Graph operators](/kusto/query/graph-operators?view=azure-data-explorer&preserve-view=true) | Updated. Added new graph operators. |
| [make-graph operator](/kusto/query/make-graph-operator?view=azure-data-explorer&preserve-view=true) | Updated article. Refreshed content and added information about default nodes. |
| [toint() function](/kusto/query/toint-function?view=azure-data-explorer&preserve-view=true) | Updated article. Refreshed content and added instruction on how to convert a decimal value into a truncate integer. |

## October 2024

**Management**

|Article title | Description|
|--|--|
| [Change column type without data loss](/kusto/management/change-column-type-without-data-loss?view=azure-data-explorer&preserve-view=true) | New article. Learn how to preserve pre-existing data by changing column type without data loss. |
| [.alter column command](/kusto/management/alter-column?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for changing column type without data loss. |

## September 2024

**General**

|Article title | Description|
|--|--|
| [Ingest data from Cribl Stream into Azure Data Explorer](ingest-data-cribl.md) | New article. Learn how to ingest data from Cribl stream. |

**Management**

|Article title | Description|
|--|--|
| [.alter database prettyname command](/kusto/management/alter-database-prettyname?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the `.alter database prettyname` command to alter the database's prettyname. |
| [.drop database prettyname command](/kusto/management/drop-database-prettyname?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the `.drop database prettyname` command to drop the database's prettyname. |
| [.execute database script command](/kusto/management/execute-database-script?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show database schema violations](/kusto/management/show-database-schema-violations?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show database command](/kusto/management/show-database?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show databases entities command](/kusto/management/show-databases-entities?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show databases command](/kusto/management/show-databases?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show database schema command](/kusto/management/show-schema-database?view=azure-data-explorer&preserve-view=true) | Updated article. Updated information for .alter db. |
| [.show data operations command](/kusto/management/show-data-operations?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the `.show data operations` command to return data operations that reached a final state. |

**Query**

|Article title | Description|
|--|--|
| [top-nested operator](/kusto/query/top-nested-operator?view=azure-data-explorer&preserve-view=true) | Updated article. Refreshed with clearer content and examples. |

## August 2024

**General**

|Article title | Description|
|--|--|
| [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md) | Updated article. Added section explaining how the tile legend is used to interact with the data in the tile. |
| [Ingest data from Apache Kafka into Azure Data Explorer](ingest-data-kafka.md) | Updated article. Added information about managed identity. |

**Management**

|Article title | Description|
|--|--|
| [.show data operation command](/kusto/management/show-data-operations?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the `.show data operations` command to return data operations that reached a final state. |

## July 2024

**General**

|Article title | Description|
|--|--|
| [Python plugin packages](python-package-reference.md) | Updated article. Refreshed the list of available Python packages for the Python plugin. |
|  [Azure DevOps Task for Azure Data Explorer](devops.md) | Updated article. Updated to include latest authentication changes in the Azure DevOps extension. |

**Query**

|Article title | Description|
|--|--|
| [infer_storage_schema_with_suggestions plugin](/kusto/query/infer-storage-schema-with-suggestions-plugin?view=azure-data-explorer&preserve-view=true) | New article. Describes how to use the infer_storage_schema_with_suggestions plugin to infer the optimal schema of external data. |
| [infer_storage_schema plugin](/kusto/query/infer-storage-schema-plugin?view=azure-data-explorer&preserve-view=true) | Updated article. Added description of how to use the infer_storage_schema plugin to retrieve the CSL schema string. |
| [cosmosdb_sql_request plugin](/kusto/query/cosmosdb-plugin?view=azure-data-explorer&preserve-view=true) | Updated article. Added token authentication method. |
| [evaluate plugin operator](/kusto/query/evaluate-operator?view=azure-data-explorer&preserve-view=true) | Updated article. Added the ipv6_lookup plugin to the list of supported plugins. |
| [ipv6_lookup plugin](/kusto/query/ipv6-lookup-plugin?view=azure-data-explorer&preserve-view=true) | New article. Describes how to use the ipv6_lookup plugin to look up an IPv6 address in a lookup table. |

## June 2024

**General**

|Article title | Description|
|--|--|
| [How the reservation discount is applied to Azure Data Explorer](pricing-reservation-discount.md) | New article. Describes how the reservation discount is applied to Azure Data Explorer markup meter. |
| [Access the data profile of a table](data-profile.md) | Updated article. Refreshed steps on how to open the data profile. |
| [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md) | Updated article. Refreshed steps on how to use the KQL tools in the toolbar. |
| [Explore the samples gallery](web-ui-samples-query.md) | Updated article. Refreshed steps on how to navigate to other tutorials. |

**Query**

|Article title | Description|
|--|--|
|[cosmosdb_sql_request plugin](/kusto/query/cosmosdb-plugin?view=azure-data-explorer&preserve-view=true) | Updated article. Added Azure Resource Manager example. |
