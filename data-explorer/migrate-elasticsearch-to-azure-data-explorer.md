---
title: "Elasticsearch to Azure Data Explorer: Migration guide"
description: This guide teaches you to migrate your Elasticsearch data to Azure Data Explorer, by using Logstash.
ms.reviewer: guregini
ms.date: 06/26/2023
ms.topic: how-to
---
# Migration guide: Elasticsearch to Azure Data Explorer

In this guide, you learn [how to migrate](https://azure.microsoft.com/migration/migration-journey) your Elasticsearch data to Azure Data Explorer, by using [Logstash](https://www.elastic.co/products/logstash).

In this guide, the data to be migrated is in an Elasticsearch index named **vehicle** that has the following data schema:

```json
{
  "Manufacturer": "string",
  "Model": "string",
  "ReleaseYear": "int",
  "ReleaseDate": "datetime"
}
```

## Prerequisites

To migrate your Elasticsearch data to Azure Data Explorer, you need:

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. You can [create a free cluster](start-for-free-web-ui.md) or [create a full cluster](create-cluster-database-portal.md). To decide which is best for you, check the [feature comparison](start-for-free.md#feature-comparison).
* An app ID and delegated permissions to access your Azure Data Explorer cluster. For more information, see [Create a Microsoft Entra app](provision-azure-ad-app.md). You need app ID, secret, and tenant ID to configure the Logstash pipeline.
* Logstash version 6+ [Installation instructions](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html).

## Pre-migration

After you have met the prerequisites, you're ready to discover the topology of your environment and assess the feasibility of your [Azure cloud migration](https://azure.microsoft.com/migration).

### Create target schema in your Azure Data Explorer cluster

To properly ingest and structure the data for querying and analysis, you need to create a table schema and a mapping in your Azure Data Explorer cluster.

The schema of the table and the data being migrated should match. The ingestion mapping is important to establish the mapping of the source columns in ELK to the target columns in your table.

To create a table schema and ingestion mapping in your cluster:

1. Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).
1. Add a [connection to your cluster](add-cluster-connection.md#add-a-cluster-connection).
1. Select the database where you want to create the table schema for the migration data.
1. Run the following command in your database query window to create a table schema.

    ```Kusto
    .create tables Vehicle (
      Manufacturer: string,
      Model: string,
      ReleaseYear: int,
      ReleaseDate: datetime
      )
    ```

1. Run the following command to create an ingestion mapping.

    ```Kusto
    .create table Vehicle ingestion json mapping 'VechicleMapping'
      '['
      '  {"column":"Manufacturer", "path":"$.manufacturer"},'
      '  {"column":"Model", "path":"$.model"},'
      '  {"column":"ReleaseYear", "path":"$.releaseYear"},'
      '  {"column":"ReleaseDate", "path":"$.releaseDate"}'
      ']'
    ```

### Prepare Logstash for migration

When migrating data to your Azure Data Explorer cluster, it's important to properly set up a [Logstash pipeline](https://www.elastic.co/guide/en/logstash/current/configuration.html). The pipeline ensures that data is correctly formatted and transferred to the target table.

If you need to move data from multiple Elasticsearch clusters or indices, you can create multiple input sections in the pipeline configuration file. To achieve this, you can define one input section for each Elasticsearch cluster or index and categorize them using tags if you wish. Then, you can use these tags in conditional statements in the output section to direct these datasets to specific Azure Data Explorer cluster tables

To set up a Logstash pipeline:

1. In a command shell, navigate to the Logstash root directory, and then run the following command to install the [Logstash output plugin](https://github.com/Azure/logstash-output-kusto). For more information about the plugin, see [Ingest data from Logstash](ingest-data-logstash.md).

    ```bash
    bin/logstash-plugin install logstash-output-kusto
    ```

1. Create a Logstash pipeline configuration file, using the following settings:

    ```ruby
    input {
      elasticsearch {
        hosts => "http://localhost:9200"
        index => "vehicle"
        query => '{ "query": { "range" : { "releaseDate": { "gte": "2019-01-01", "lte": "2023-12-31" }}}}'
        user => "<elasticsearch_username>"
        password => "<elasticsearch_password>"
        ssl => true
        ca_file => "<certification_file>"
      }
    }

    filter
    {
      ruby
      {
        code => "event.set('[@metadata][timebucket]', Time.now().to_i/10)"
      }
    }

    output {
      kusto {
        path => "/tmp/region1/%{+YYYY-MM-dd}-%{[@metadata][timebucket]}.txt"
        ingest_url => "https://ingest-<azure_data_explorer_cluster_name>.<region>.kusto.windows.net"
        app_id => "<app_id>"
        app_key => "<app_secret>"
        app_tenant => "<app_tenant_id>"
        database => "<your_database>"
        table => "Vehicle" // The table schema you created earlier
        json_mapping => "vehicleMapping" // The ingestion mapping you created earlier
      }
    }
    ```

    **Input parameters**

    | Parameter name | Description |
    | --- | --- |
    | **hosts** | The URL of the Elasticsearch cluster.|
    | **index** | The name of the index to migrate.|
    | **query** | Optional query to get specific data from the index. |
    | **user**| User name to connect to Elasticsearch cluster. |
    | **password** | Password to connect to Elasticsearch cluster. |
    | **tags** | Optional tags to identify the source of the data. For example, specify `tags => ["vehicle"]` in the **elasticsearch** section, and then filter using `if "vehicle" in [tags] { ... }` wrapping the **kusto** section. |
    | **ssl** | Specifies whether an SSL certificate is required. |
    | **ca_file** | The certificate file to pass for authentication. |

    **Filter parameters**

    The ruby filter prevents duplicate data being ingested into your cluster by setting a unique timestamp for Elasticsearch data files every 10 seconds. This is a best practice that chunks data into files with a unique timestamp, ensuring data is properly processed for migration.

    **Output parameters**

    | Parameter name | Description |
    | --- | --- |
    | **path** | The Logstash plugin writes events to temporary files before sending them to your cluster. This parameter describes the path to where temporary files are saved and a time expression for file rotation to trigger uploads to your cluster.|
    | **ingest_url** | The cluster endpoint for ingestion-related communication.|
    | **app_id**,  **app_key**, and **app_tenant**| Credentials required to connect to your cluster. Make sure you use an application with ingest privileges. For more information, see [Prerequisites](#prerequisites). |
    | **database**| Database name to place events. |
    | **table** | Target table name to place events. |
    | **json_mapping** | Mapping is used to map an incoming event json string into the correct row format (defines which ELK property goes into which table schema column). |

## Migration

After you've completed preparing your pre-migrations steps, the next step is to execute the migration process. It's important to monitor the pipeline during the data migration process to ensure that it's running smoothly and so that you can address any issues that may arise.

To migrate your data, in a command shell, navigate to the Logstash root directory, and then run the following command:

```bash
bin/logstash -f <your_pipeline>.conf
```

You should see information printed to the screen.

## Post-migration

After the migration is complete, you need to go through a series of post-migration tasks to validate the data and ensure that everything is functioning as smoothly and efficiently as possible.

The process of data validation for a specific index generally consists of the following activities:

**Data comparison**: Compare the migrated data in your Azure Data Explorer cluster to the original data in Elasticsearch. You can do this using a tool like Kibana in ELK stack that allows you to query and visualize the data in both environments.

**Query execution**: Run a series of queries against the migrated data in your Azure Data Explorer cluster to ensure that the data is accurate and complete. This includes running queries that test the relationships between different fields, and queries that test the data's integrity.

**Check for missing data**: Compare the migrated data in your cluster with the data in Elasticsearch to check for missing data, duplicate data, or any other data inconsistencies.

**Validate the performance**: Test the performance of the migrated data in your cluster and compare it with the performance of the data in Elasticsearch. This can include running queries and visualizing the data to test the response times and ensure that the data in your cluster is optimized for performance.

> [!IMPORTANT]
> Repeat the data validation process if any changes are made to the migrated data, or your cluster, to ensure that the data is still accurate and complete.

The following are some examples of queries you can run to validate the data in your cluster:

1. In Elasticsearch, run the following queries to get the :

    ```json
    // Gets the total record count of the index
    GET vehicle/_count

    // Gets the total record count of the index based on a datetime query
    GET vehicle/_count
    {
      "query": {
        "range" : {
          "releaseDate": { "gte": "2021-01-01", "lte": "2021-12-31" }
                  }
              }
    }

    // Gets the count of all vehicles that has manufacturer as "Honda".
    GET vehicle/_count
    {
      "query": {
        "bool" : {
          "must" : {
            "term" : { "manufacturer" : "Honda" }
          }
        }
      }
    }

    // Get the record count where a specific property doesn't exist.
    // This is helpful especially when some records don't have NULL properties.
    GET vehicle/_count
    {
      "query": {
        "bool": {
          "must_not": {
            "exists": {
              "field": "description"
            }
          }
        }
      }
    }
    ```

1. In your database query window, run the following corresponding query:

    ```Kusto
    // Gets the total record count in the table
    Vehicle
    | count

    // Gets the total record count where a given property is NOT empty/null
    Vehicle
    | where isnotempty(Manufacturer)

    // Gets the total record count where a given property is empty/null
    Vehicle
    | where isempty(Manufacturer)

    // Gets the total record count by a property value
    Vehicle
    | where Manufacturer == "Honda"
    | count
    ```

1. Compare the results from both sets of queries to ensure that the data in your cluster is accurate and complete.

## Related content

### To learn more about Azure Database Explorer, see:

* [An overview of Azure Data Explorer](data-explorer-overview.md)
* [Azure Data Explorer pricing calculator](pricing-calculator.md)

### To learn more about the framework and adoption cycle for cloud migrations, see:

* [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
* [Best practices for costing and sizing workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs)
* [Cloud Migration Resources](https://azure.microsoft.com/migration/resources)
