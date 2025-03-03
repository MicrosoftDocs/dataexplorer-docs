---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/03/2025
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and updated content in the Azure Data Explorer documentation.

## February 2025

## API

|Article title | Description|
|--|--|
| [Create an app to get data using the managed streaming ingestion client](/kusto/api/get-started/app-managed-streaming-ingest.md)| New article. Learn how to create an app to ingest data from a file or in-memory stream using the managed streaming ingestion client.|
| [Create an app to get data using queued ingestion](/kusto/api/get-started/app-queued-ingestion.md) | Updated article. Fixed an error in the code.|
| [Controlling and suppressing Kusto SDK client-side tracing](/kusto/api/netfx/controlling-tracing.md) | Updated article. Clarified instructions of how to enable or disable tracing. |

## Functions library

|Article title | Description|
|--|--|
| [Functions library](/kusto/functions-library/functions-library.md) | Updated article. Minor corrections. |
| [graph_blast_radius_fl()](/kusto/functions-library/graph-blast-radius-fl.md) | Updated article. Refreshed with clearer content. |
| [graph_exposure_perimeter_fl()](/kusto/functions-library/graph-exposure-perimeter-fl.md) | Updated article. Refreshed with clearer content. |
| [graph_path_discovery_fl()](/kusto/functions-library/graph-path-discovery-fl.md) |Updated article. Refreshed with clearer content. |

## Management

|Article title | Description|
|--|--|
| [Entity groups](/kusto/management/entity-groups.md) | New article. Learn how to use Entity groups to store entity groups in the database.|
| [.alter entity_group command](/kusto/management/alter-entity-group.md) | New article. Learn how to use the `.alter entity_group` command to change an existing entity group. |
| [.alter-merge entity_group command](/kusto/management/alter-merge-entity-group.md) | New article. Learn how to use the `.alter-merge entity_group` command to change an existing entity group. |
| [.create entity_group command](/kusto/management/create-entity-group.md) | New article. Learn how to use the `.create entity_group` command to create an entity group. |
| [.drop entity_group command](/kusto/management/drop-entity-group.md) | New article. Learn how to use the `.drop entity_group` command to remove an entity group from your database. |
| [.show entity_group(s) command](/kusto/management/show-entity-group.md) | New article. Learn how to use the `.show entity_group` command to view existing entity groups. |
| [.alter materialized-view lookback](/kusto/management/materialized-views/materialized-view-alter-lookback.md) | Updated article. Refreshed with clearer content and examples. |
| [.alter materialized-view](/kusto/management/materialized-views/materialized-view-alter.md) | Updated article. Refreshed with clearer content and examples. |
| [.create-or-alter materialized-view](/kusto/management/materialized-views/materialized-view-create-or-alter.md) | Updated article. Refreshed with clearer content and examples.|
| [.create materialized-view](/kusto/management/materialized-views/materialized-view-create.md) | Updated article. Refreshed with clearer content and examples. |
| [Materialized views](/kusto/management/materialized-views/materialized-view-overview.md) | Updated article. Refreshed with clearer content and examples. |
| [Materialized views limitations and known issues](/kusto/management/materialized-views/materialized-views-limitations.md) | Updated article. Refreshed with clearer content and examples. |
| [Monitor materialized views](/kusto/management/materialized-views/materialized-views-monitoring.md) | Updated article. Added how to check if materialization is hitting cold cache. |

## Query

|Article title | Description|
|--|--|
| [all() (graph function)](/kusto/query/all-graph-function.md) | New article. Learn how to use the all() function to evaluate a condition over the elements of a variable length edge. |
| [inner_nodes() (graph function)](/kusto/query/inner-nodes-graph-function.md) | New article. Learn how to use the inner_nodes() function to access all inner nodes in a variable length path. |
| [map() (graph function)](/kusto/query/map-graph-function.md) | New article. Learn how to use the map() function to evaluate an expression over the elements of a variable length edge. |
| [node_degree_in() (graph function)](/kusto/query/node-degree-in.md) | New article. The `node_degree_in` function calculates the *in-degree*, or number of incoming edges, to a node in a directed graph.|
| [node_degree_out() (graph function)](/kusto/query/node-degree-out.md) | New article. The `node_degree_out` function calculates the *out-degree*, or number of outgoing edges, from  a node in a directed graph.|
| [macro-expand operator](/kusto/query/macro-expand-operator.md) | New article. Learn how to use the macro-expand operator to run a subquery on a set of entities. |
| [Best practices for Kusto Query Language (KQL) graph semantics](/kusto/query/graph-best-practices.md) | Updated article. Corrections made to the query syntax. |
| [graph-mark-components operator (Preview)](/kusto/query/graph-mark-components-operator.md) | Updated article. Corrections made to the query syntax. |
| [graph-match operator](/kusto/query/graph-match-operator.md) | Updated article. Corrections made to the query syntax. |
| [graph-shortest-paths Operator (Preview)](/kusto/query/graph-shortest-paths-operator.md) | Updated article. Corrections made to the query syntax. |

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
| [Managed Identity policy](/kusto/management/managed-identity-policy?view=azure-data-explorer&preserve-view=true) | Updated article. Added *ai_embed_text* plugin for `AzureAI` to the list of managed identity usages. |

**Query**

|Article title | Description|
|--|--|
| [graph-shortest-paths operator (Preview)](/kusto/query/graph-shortest-paths-operator?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the graph_shortest_paths operator to efficiently find the shortest paths from a given set of source nodes to a set of target nodes within a graph. |
| [graph-mark-components operator (Preview)](/kusto/query/graph-mark-components-operator?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the graph_mark_components operator to find and mark all connected components of a graph. |
| [ai_embed_text plugin (Preview)](/kusto/query/ai-embed-text-plugin?view=azure-data-explorer&preserve-view=true) | New article. Learn how to use the ai_embed_text plugin to embed text via language models, enabling various AI-related scenarios such as RAG application and semantic search. |
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

## May 2024

No updates.

## April 2024

**Management**

|Article title | Description|
|--|--|
| [.execute cluster script command](/kusto/management/execute-cluster-script?view=azure-data-explorer&preserve-view=true) | New article. Describes how to use the `.execute cluster script` command to execute a batch of management commands in the scope of a cluster. |

## March 2024

**API**

|Article title | Description|
|--|--|
| [Use Kusto cmdlets in Azure PowerShell](/kusto/api/powershell/azure-powershell?view=azure-data-explorer&preserve-view=true) | New article. Describes how to use Kusto cmdlets in Azure PowerShell. |

**General**

|Article title | Description|
|--|--|
| [Create an Azure Data Explorer cluster and database](create-cluster-database.md) | Updated article. Refreshed steps on how to set up Azure PowerShell to run Kusto cmdlets. |
| [Migrate your cluster to support multiple availability zones (Preview)](migrate-cluster-to-multiple-availability-zone.md) | Updated article. Refreshed steps on how to get the list of availability zones for your cluster's region in Azure portal. |

**Management**

| Article title | Description|
|--|--|
| - [What are common scenarios for using table update policies](/kusto/management/update-policy-common-scenarios?view=azure-data-explorer&preserve-view=true)<br />- [Tutorial: Route data using table update policies](/kusto/management/update-policy-tutorial?view=azure-data-explorer&preserve-view=true)<br />- [Update policy overview](/kusto/management/update-policy?view=azure-data-explorer&preserve-view=true) | New and updated articles. Describes common use cases for how to use *update table policies* to perform complex transformations and route results to destination tables. |
| [Parquet mapping](/kusto/management/parquet-mapping?view=azure-data-explorer&preserve-view=true) | Updated article. Added parquet type conversions table to provide a mapping of Parquet field types, and the table column types they can be converted to. |

