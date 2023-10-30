---
title: Ingest data from Splunk Universal Forwarder to Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Splunk Universal Forwarder.
ms.reviewer: tanmayapanda
ms.topic: how-to
ms.date: 10/26/2023
---

# Ingest data from Splunk Universal Forwarder to Azure Data Explorer

[Splunk Universal Forwarder](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/Abouttheuniversalforwarder) is a lightweight version of the [Splunk Enterprise](https://www.splunk.com/en_us/products/splunk-enterprise.html) software that allows you to ingest data from many sources simultaneously. It's designed for collecting and forwarding log data and machine data from various sources to a central Splunk Enterprise server or a Splunk Cloud deployment. Splunk Universal Forwarder serves as an agent that simplifies the process of data collection and forwarding, making it an essential component in a Splunk deployment. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.

In this article, learn how to use the Kusto Splunk Universal Forwarder Connector to send data to a table in your cluster. You initially create a table and data mapping, then direct Splunk to send data into the table, and then validate the results.

## Prerequisites

* [Splunk Universal Forwarder](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/InstallaWindowsuniversalforwarderfromaninstaller) downloaded on the same machine where the logs originate.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Docker](https://www.docker.com/) installed on the system that runs the Kusto Splunk Universal Forwarder connector.

## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](provision-azure-ad-app.md) or programatically, as in the following example.

This service principal is the identity used by the connector to write to the Azure Data Explorer table. You later grant permissions for this service principal to access Azure Data Explorer.

1. Sign in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```

2. Choose the subscription to host the principal. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

3. Create the service principal. In this example, the service principal is called `splunk-uf`.

   ```azurecli-interactive
   az ad sp create-for-rbac -n "splunk-uf" --role Contributor --scopes /subscriptions/{SubID}
   ```

4. From the returned JSON data, copy the `appId`, `password`, and `tenant`, as you need them in later steps.

    ```json
    {
      "appId": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "displayName": "splunk-spn",
      "name": "http://splunk-spn",
      "password": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "tenant": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn"
    }
    ```

## Create an Azure Data Explorer table

Create a table to recieve the data from Splunk Universal Forwarder, which sends data in a raw text format by default. In the following example, you create a table named `MySplunkLogs` with a single column (`RawText`) and then grant the service principal access to this table. The following commands can be run in the [web UI query editor](web-ui-query-overview.md#write-and-run-queries).

1. Create a table:

    ```Kusto
    .create table MySplunkLogs (RawText: string)
    ```

2. Verify that the table `WeatherAlert` was created and is empty:

    ```Kusto
    MySplunkLogs
    | count
    ```

3. Use the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-id-service-principal) to grant permission to work with the database containing your table.

    ```kusto
    .add database YOUR_DATABASE_NAME admins ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'Entra service principal: Splunk UF'
    ```

## Configure Splunk Universal Forwarder

When you download Splunk Universal Forwarder, a wizard will open to configure the forwarder.

1. In the wizard, set the **Recieving Indexer** to point to the system hosting the Kusto Splunk Universal Forwarder connector. Enter `127.0.0.1` for the **Hostname or IP** and `9997` for the port. Leave the **Destination Indexer** blank.

    For more information, see [Enable a receiver for Splunk Enterprise](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/Enableareceiver).

2. Go to the folder where Splunk Universal Forwarder is installed and then to the */etc/system/local* folder. Create or modify the *inputs.conf* file to allow the forwarder to read logs:

    ```txt
    [default]
    index = default
    disabled = false

    [monitor://C:\Program Files\Splunk\var\log\splunk\modinput_eventgen.log*]
    sourcetype = modinput_eventgen
    ```

    For more information, see [Monitor files and directories with inputs.conf](https://docs.splunk.com/Documentation/Splunk/9.1.1/Data/Monitorfilesanddirectorieswithinputs.conf).

3. Go to the folder where Splunk Universal Forwarder is installed and then to the */etc/system/local* folder. Create or modify the *outputs.conf* file to determine the destination logcation for the logs, which is the hostname and port of the system hosting Kusto Splunk Universal Forwarder connector:

    ```txt
    [tcpout]
    defaultGroup = default-autolb-group
    sendCookedData = false

    [tcpout:default-autolb-group]
    server = 127.0.0.1:9997

    [tcpout-server://127.0.0.1:9997]
    ```
    
    For more information, see [Configure forwarding with outputs.conf](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/Configureforwardingwithoutputs.conf).

4. Restart Splunk Universal Forwarder.

## Configure Kusto Splunk Universal connector

To configure the Kusto Splunk Universal connector to send logs to your Azure Data Explorer table:

1. Download or clone the connector from the [GitHub repository](https://github.com/Azure/azure-kusto-splunk/tree/main/SplunkADXForwarder).

1. Go to the base directory of the connector:

    ```bash
    cd .\SplunkADXForwarder\
    ```

2. Edit the *config.yml* to contain the following properties:

    ```yaml
    ingest_url: <ingest_url>
    client_id: <ms_entra_app_client_id>
    client_secret: <ms_entra_app_client_secret>
    authority: <ms_entra_authority>
    database_name: <database_name>
    table_name: <table_name>
    table_mapping_name: <table_mapping_name>
    data_format: csv
    ```

    |Field|Description|
    |--|--|
    |`ingest_url`|The ingestion URL for your Azure Data Explorer cluster. You can find it in the Azure portal under the **Data ingestion URI** in the **Overview** tab of your cluster. It should be in the format `https://ingest-<clusterName>.<region>.kusto.windows.net`.|
    |`client_id`|The client ID of your Microsoft Entra application registration created in the [Prerequisites](#prerequisites) section.|
    |`client_secret`|The client secret of your Microsoft Entra application registration created in the [Prerequisites](#prerequisites) section.|
    |`authority`|The ID of the tenant that holds your Microsoft Entra application registration created in the [Prerequisites](#prerequisites) section.|
    |`database_name`|The name of your Azure Data Explorer database.|
    |`table_name`|The name of your Azure Data Explorer destination table.|
    |`table_mapping_name`|The name of the [ingestion data mapping](kusto/management/mappings.md) for your table. If you don't have a mapping, you can omit this property from the configuration file. You can always parse data into various columns later.|
    |`data_format`|The expected data format for incoming data. The incoming data is in raw text format, so the recommended format is `csv`, which maps the raw text to the 0th index by default.|

3. Build the docker image:

    ```bash
    docker build -t splunk-forwarder-listener
    ```

4. Run the docker container:

    ```bash
    docker run -p 9997:9997 splunk-forwarder-listener
    ```

## Verify that data is ingested into Azure Data Explorer

Once the docker is running, data is sent to your Azure Data Explorer table. You can verify that the data is ingested by running a query in the [web UI query editor](web-ui-query-overview.md#write-and-run-queries).

1. Run the following query to verify that data is ingested into the table:

    ```Kusto
    MyLogsTable
    | count
    ```

1. Run the following query to view the data:

    ```Kusto
    MyLogsTable
    | take 100
    ```

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
