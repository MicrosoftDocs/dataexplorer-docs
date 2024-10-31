---
title: What's new in Azure Data Explorer documentation
description: What's new in the Azure Data Explorer documentation
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/14/2024
---
# What's new in Azure Data Explorer documentation

Welcome to what's new in Azure Data Explorer. This article details new and significantly updated content in the Azure Data Explorer documentation.

## September 2024

**General**

|Article title | Description|
|--|--|
| [Ingest data from Cribl Stream into Azure Data Explorer](ingest-data-cribl.md) | New article. Learn how to ingest data from Cribl stream. |

**Management**

|Article title | Description|
|--|--|
| [.alter database prettyname command](kusto/management/alter-database-prettyname.md) | New article. Learn how to use the `.alter database prettyname` command to alter the database's prettyname. |
| [.drop database prettyname command](kusto/management/drop-database-prettyname.md) | New article. Learn how to use the `.drop database prettyname` command to drop the database's prettyname. |
| [.execute database script command](kusto/management/execute-database-script.md) | Updated article. Updated information for .alter db. |
| [.show database schema violations](kusto/management/show-database-schema-violations.md) | Updated article. Updated information for .alter db. |
| [.show database command](kusto/management/show-database.md) | Updated article. Updated information for .alter db. |
| [.show databases entities command](kusto/management/show-databases-entities.md) | Updated article. Updated information for .alter db. |
| [.show databases command](kusto/management/show-databases.md) | Updated article. Updated information for .alter db. |
| [.show database schema command](kusto/management/show-schema-database.md) | Updated article. Updated information for .alter db. |
| [.show data operations command](kusto/management/show-data-operations.md) | New article. Learn how to use the `.show data operations` command to return data operations that reached a final state. |

**Query**

|Article title | Description|
|--|--|
| [top-nested operator](kusto/query/top-nested-operator.md) | Updated article. Refreshed with clearer content and examples. |

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
| [Apply row-level security on SQL external tables](/kusto/management/row-level-security-external-sql?view=azure-data-explorer&preserve-view=true)| New article. Describes how to create a row-level security solution with Azure Data Explorer SQL external tables.|
| [.update table command (preview)](/kusto/management/update-table-command?view=azure-data-explorer&preserve-view=true)| New article. Describes how to use the `.update table` command to perform transactional data updates.|
|- [Stored query results](/kusto/management/stored-query-results?view=azure-data-explorer&preserve-view=true)<br/>- [.set stored_query_result command](/kusto/management/set-stored-query-result-command?view=azure-data-explorer&preserve-view=true)<br/>- [.show stored_query_result command](/kusto/management/show-stored-query-result-command?view=azure-data-explorer&preserve-view=true)<br/>- [.drop stored_query_result command](/kusto/management/drop-stored-query-result-command?view=azure-data-explorer&preserve-view=true)<br/>- [stored_query_result()](/kusto/query/stored-query-result-function?view=azure-data-explorer&preserve-view=true)| New articles. Describe how to manage stored query results.|
| [Continuous data export overview](/kusto/management/data-export/continuous-data-export?view=azure-data-explorer&preserve-view=true)| Updated article. Added section on continuous export to delta table, and refreshed limitations.|

**Query**

|Article title| Description|
|--|--|
| [sort operator](/kusto/query/sort-operator?view=azure-data-explorer&preserve-view=true)| Updated article. Added section on the use of special floating-point values.|

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
|-[Scalar function types at a glance](/kusto/query/scalar-functions?view=azure-data-explorer&preserve-view=true) <br/> -[series_cosine_similarity()](/kusto/query/series-cosine-similarity-function?view=azure-data-explorer&preserve-view=true) <br/> - [series_magnitude()](/kusto/query/series-magnitude-function?view=azure-data-explorer&preserve-view=true) <br/> - [series_sum()](/kusto/query/series-sum-function?view=azure-data-explorer&preserve-view=true) | New articles. Describes how to calculate series elements, and added to scalar functions overview.|
|[series_dot_product()](/kusto/query/series-dot-product-function?view=azure-data-explorer&preserve-view=true)| Updated article. Added section on performance optimization.|

## November 2023

**General**

| Article title | Description |
|--|--|
| [Migrate a Virtual Network injected cluster to private endpoints (Preview)](security-network-migrate-vnet-to-private-endpoint.md)| New article. Describes how to migrate a Virtual Network injected Azure Data Explorer Cluster to private endpoints.|
| - [Ingest data from Splunk Universal Forwarder](ingest-data-splunk-uf.md) <br/> - [Ingest data with Apache Flink](ingest-data-flink.md) <br/> - [Data connectors overview](integrate-data-overview.md)| New articles that describe how to ingest data with Splunk Universal Forwarder and Apache Flink, and updated data connector overview.|
| [Use follower databases](follower.md)| Updated article. Update limitations for clusters using customer-managed keys.|
| [Create Power Apps application to query data in Azure Data Explorer](power-apps-connector.md)| Updated article. Refreshed content.|
| [Create a Microsoft Entra application registration in Azure Data Explorer](provision-entra-id-app.md)| Updated article. Added section on creating a Microsoft Entra service principal.|

**Management**

| Article title | Description |
|--|--|
| [Materialized views use cases](/kusto/management/materialized-views/materialized-view-use-cases?view=azure-data-explorer&preserve-view=true)| New article. Describes common and advanced use cases for materialized views.|

## October 2023

**General**

| Article title | Description |
|--|--|
|- [Ingest data with Fluent Bit](fluent-bit.md) <br/> - [Data connectors overview](integrate-data-overview.md)| New article that describes how to ingest data from Fluent Bit, and updated data connector overview with additional capabilities.|
| [Connect a cluster behind a private endpoint to a Power BI service](power-bi-private-endpoint.md)| New article. Describes how to connect an Azure Data Explorer cluster behind a private endpoint to a Power BI service.|
