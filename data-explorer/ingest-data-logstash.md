---
title: 'Ingest data from Logstash to Azure Data Explorer'
description: 'In this article, you learn how to ingest (load) data into Azure Data Explorer from Logstash'
ms.reviewer: takamara
ms.topic: how-to
ms.date: 09/22/2022

#Customer intent: As a DevOps engineer, I want to use Logstash to pipeline logs and ingest into Azure Data Explorer so that I can analyze them later.
---

# Ingest data from Logstash to Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

[Logstash](https://www.elastic.co/products/logstash) is an open source, server-side data processing pipeline that ingests data from many sources simultaneously, transforms the data, and then sends the data to your favorite "stash". In this article, you'll send that data to Azure Data Explorer, which is a fast and highly scalable data exploration service for log and telemetry data. You'll initially create a table and data mapping in a test cluster, and then direct Logstash to send data into the table and validate the results.

> [!NOTE]
> This connector currently supports only json data format.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Logstash version 6+ [Installation instructions](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html).

## Create a table

After you have a cluster and a database, it's time to create a table.

1. Run the following command in your database query window to create a table:

    ```Kusto
    .create table logs (timestamp: datetime, message: string)
    ```

1. Run the following command to confirm that the new table `logs` has been created and that it's empty:

    ```Kusto
    logs
    | count
    ```

## Create a mapping

Mapping is used by Azure Data Explorer to transform the incoming data into the target table schema. The following command creates a new mapping named `basicmsg` that extracts properties from the incoming json as noted by the `path` and outputs them to the `column`.

Run the following command in the query window:

```Kusto
.create table logs ingestion json mapping 'basicmsg' '[{"column":"timestamp","path":"$.@timestamp"},{"column":"message","path":"$.message"}]'
```

## Install the Logstash output plugin

The Logstash output plugin communicates with Azure Data Explorer and sends the data to the service. For more information, see [Logstash plugin](https://github.com/Azure/logstash-output-kusto).

In a command shell, navigate to the Logstash root directory, and then run the following command to install the plugin:

```bash
bin/logstash-plugin install logstash-output-kusto
```

## Configure Logstash to generate a sample dataset

Logstash can generate sample events that can be used to test an end-to-end pipeline.
If you're already using Logstash and have access to your own event stream, skip to the next section.

> [!NOTE]
> If you're using your own data, change the table and mapping objects defined in the previous steps.

1. Edit a new text file that will contain the required pipeline settings (using vi):

    ```bash
    vi test.conf
    ```

1. Paste the following settings that will tell Logstash to generate 1000 test events:

    ```ruby
    input {
        stdin { }
        generator {
            message => "Test Message 123"
            count => 1000
        }
    }
    ```

This configuration also includes the `stdin` input plugin that will enable you to write more messages by yourself (be sure to use *Enter* to submit them into the pipeline).

## Configure Logstash to send data to Azure Data Explorer

Paste the following settings into the same config file used in the previous step. Replace all the placeholders with the relevant values for your setup. For more information, see [Creating a Microsoft Entra Application](./provision-azure-ad-app.md).

```ruby
output {
    kusto {
            path => "/tmp/kusto/%{+YYYY-MM-dd-HH-mm-ss}.txt"
            ingest_url => "https://ingest-<cluster name>.kusto.windows.net/"
            app_id => "<application id>"
            app_key => "<application key/secret>"
            app_tenant => "<tenant id>"
            database => "<database name>"
            table => "<target table>" # logs as defined above
            json_mapping => "<mapping name>" # basicmsg as defined above
    }
}
```

| Parameter Name | Description |
| --- | --- |
| **path** | The Logstash plugin writes events to temporary files before sending them to Azure Data Explorer. This parameter includes a path where files should be written and a time expression for file rotation to trigger an upload to the Azure Data Explorer service.|
| **ingest_url** | The Kusto endpoint for ingestion-related communication.|
| **app_id**,  **app_key**, and **app_tenant**| Credentials required to connect to Azure Data Explorer. Be sure to use an application with ingest privileges. |
| **database**| Database name to place events. |
| **table** | Target table name to place events. |
| **json_mapping** | Mapping is used to map an incoming event json string into the correct row format (defines which property goes into which column). |

## Run Logstash

We're now ready to run Logstash and test our settings.

1. In a command shell, navigate to the Logstash root directory, and then run the following command:

    ```sh
    bin/logstash -f test.conf
    ```

    You should see information printed to the screen, and then the 1000 messages generated by our sample configuration. At this point, you can also enter more messages manually.

1. After a few minutes, run the following Data Explorer query to see the messages in the table you defined:

    ```Kusto
    logs
    | order by timestamp desc
    ```

1. Select Ctrl+C to exit Logstash

## Clean up resources

Run the following command in your database to clean up the `logs` table:

```Kusto
.drop table logs
```

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
