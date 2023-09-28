---
title: Ingest data from Splunk to Azure Data Explorer
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Splunk
ms.reviewer: takamara
ms.topic: how-to
ms.date: 09/28/2023
#Customer intent: As a DevOps engineer, I want to use Splunk to pipeline logs and ingest into Azure Data Explorer so that I can analyze them later.
---

# Ingest data from Splunk to Azure Data Explorer

[Splunk Enterprise](https://www.splunk.com/en_us/products/splunk-enterprise.html) is a software platform that allows you to ingest data from many sources simultaneously. The Splunk indexer processes the data and stores it by default in the main index or a specified custom index. Searching in Splunk uses the indexed data for creating metrics, dashboards, and alerts. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.

In this article, you learn how to the Azure Data Explorer Splunk add-on to send data from Splunk to a table in your cluster. You initially create a table and data mapping, then direct Splunk to send data into the table, and then validate the results.

The following scenarios are most suitable for ingesting data into Azure Data Explorer:

* **High-volume data**: Azure Data Explorer is built to efficiently handle vast amounts of data. If your organization generates a significant volume of data that needs real-time analysis, Azure Data Explorer is a suitable choice.
* **Time-series data**: Azure Data Explorer excels at handling time-series data, such as logs, telemetry data, and sensor readings. It organizes data in time-based partitions, making it easy to perform time-based analysis and aggregations.
* **Real-time analytics**: If your organization requires real-time insights from the data flowing in, Azure Data Explorer's near real-time capabilities can be beneficial.

## Prerequisites

* A Microsoft account or a Microsoft Entra ID user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Splunk Enterprise 9 or newer.

## Create a Microsoft Entra ID service principal

The Microsoft Entra ID service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal is the identity used by the connector to write to the Azure Data Explorer table. You later grant permissions for this service principal to access Azure Data Explorer.

1. Sign in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```

1. Choose the subscription you want use to run the lab. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

1. Create the service principal. In this example, the service principal is called `splunk-spn`.

   ```azurecli-interactive
   az ad sp create-for-rbac -n "splunk-spn" --role Contributor --scopes /subscriptions/{SubID}
   ```

1. From the returned JSON data, copy the `appId`, `password`, and `tenant`, as you  need them in later steps.

    ```json
    {
      "appId": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "displayName": "splunk-spn",
      "name": "http://splunk-spn",
      "password": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "tenant": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn"
    }
    ```

## Create a table and a mapping object

After you have a cluster and a database, create a table with a schema that matches your Splunk data. You also create a mapping object that is used to transform the incoming data into the target table schema.

In the following example, you create a table named `WeatherAlert` with four columns: `Timestamp`, `Temperature`, `Humidity`, and `Weather`. You also create a new mapping named `WeatherAlert_Json_Mapping` that extracts properties from the incoming json as noted by the `path` and outputs them to the specified `column`.

In the [web UI query editor](web-ui-query-overview.md#write-and-run-queries), run the following commands to create the table and mapping:

1. Create a table:

    ```Kusto
    .create table WeatherAlert (Timestamp: datetime, Temperature: string, Humidity: string, Weather: string)
    ```

1. Verify that the table `WeatherAlert` was created and is empty:

    ```Kusto
    WeatherAlert
    | count
    ```

1. Create a mapping object:

    ~~~Kusto
    .create table WeatherAlert ingestion json mapping "WeatherAlert_Json_Mapping"
        ```[{ "column" : "Timestamp", "datatype" : "datetime", "Properties":{"Path":"$.timestamp"}},
            { "column" : "Temperature", "datatype" : "string", "Properties":{"Path":"$.temperature"}},
            { "column" : "Humidity", "datatype" : "string", "Properties":{"Path":"$.humidity"}},
            { "column" : "Weather", "datatype" : "string", "Properties":{"Path":"$.weather_condition"}}
          ]```
    ~~~

1. Use the service principal from [Create an Microsoft Entra ID service principal](#create-a-microsoft-entra-id-service-principal) to grant permission to work with the database.

    ```kusto
    .add database YOUR_DATABASE_NAME admins  ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'Entra App'
    ```

## Install the Splunk Azure Data Explorer add-on

The Splunk add-on communicates with Azure Data Explorer and sends the data to the specified table.

1. Download the [Azure Data Explorer add-on](https://splunkbase.splunk.com/app/6979).
1. Sign in to your Splunk instance as an administrator.
1. Go to **Apps** > **Manage Apps**.
1. Select **Install app from file** and then *Azure Data Explorer add-on* file you downloaded.
1. Follow the prompts to complete the installation.
1. Select **Restart Now**.
1. Verify that the add-on is installed by going to **Dashboard** > **Alert Actions** and looking for the *Azure Data Explorer add-on*.

    :::image type="content" source="media/ingest-data-splunk/select-send-to-azure-data-explorer.png" alt-text="Screenshot of Alert Actions page showing the Azure Data Explorer add-on." lightbox="media/ingest-data-splunk/select-send-to-azure-data-explorer.png":::

## Create a new index in Splunk

Create an index in Splunk specifying the criteria for the data you want to send to Azure Data Explorer.

1. Sign in to your Splunk instance as an administrator.
1. Go to **Settings** > **Indexes**.
1. Specify a name for the index and configure the criteria for the data you want to send to Azure Data Explorer.
1. Configure the remaining properties as required and then save the index.

## Configure the Splunk add-on to send data to Azure Data Explorer

1. Sign in to your Splunk instance as an administrator.
1. Go to the dashboard and search using the index you created earlier. For example, if you created an index named `WeatherAlerts`, search for `index="WeatherAlerts"`.
1. Select **Save As** > **Alert**.
1. Specify the name, interval, and conditions as required for the alert.

    :::image type="content" source="media/ingest-data-splunk/save-alert-as-settings.png" alt-text="Screenshot of create alert dialog showing the Azure Data Explorer add-on settings." lightbox="media/ingest-data-splunk/save-alert-as-settings.png":::

1. Under **Trigger Actions**, select **Add Actions** > **Send to Microsoft Azure Data Explorer**.

    :::image type="content" source="media/ingest-data-splunk/save-alert-as-trigger-action.png" alt-text="Screenshot of create alert dialog showing the Azure Data Explorer add-on trigger action." lightbox="media/ingest-data-splunk/save-alert-as-trigger-action.png":::

1. Configure the connections details, as follows:

    | Setting | Description |
    | -- | -- |
    | **Cluster Ingestion URL** | Specify the ingestion URL of your Azure Data Explorer cluster. For example, `https://ingest-<mycluster>.<myregion>.kusto.windows.net`. |
    | **Client ID** | Specify the client ID of the Microsoft Entra ID application you created earlier. |
    | **Client Secret** | Specify the client secret of the Microsoft Entra ID application you created earlier. |
    | **Tenant ID** | Specify the tenant ID of the Microsoft Entra ID application you created earlier. |
    | **Database** | Specify the name of the database you want to send the data to. |
    | **Table** | Specify the name of the table you want to send the data to. |
    | **Mapping** | Specify the name of the mapping object you created earlier. |
    | **Remove Extra Fields** | Select this option to remove any empty fields from the data sent to your cluster. |
    | **Durable Mode** | Select this option to enable durability mode during ingestion. When set to true, the ingestion throughput is impacted. |

    :::image type="content" source="media/ingest-data-splunk/save-alert-as-connection.png" alt-text="Screenshot of create alert dialog showing the Azure Data Explorer add-on connection settings." lightbox="media/ingest-data-splunk/save-alert-as-connection.png":::

1. Select **Save** to save the alert.
1. Go to the **Alerts** page and verify that your alert appears in the list of alerts.

    :::image type="content" source="media/ingest-data-splunk/alerts-page.png" alt-text="Screenshot of create alerts page showing the Azure Data Explorer add-on." lightbox="media/ingest-data-splunk/alerts-page.png":::

## Verify that data is ingested into Azure Data Explorer

Once the alert is triggered, data is sent to your Azure Data Explorer table. You can verify that the data is ingested by running a query in the [web UI query editor](web-ui-query-overview.md#write-and-run-queries).

1. Run the following query to verify that data is ingested into the table:

    ```Kusto
    WeatherAlert
    | count
    ```

1. Run the following query to view the data:

    ```Kusto
    WeatherAlert
    | take 100
    ```

    :::image type="content" source="media/ingest-data-splunk/verify-alert.png" alt-text="Screenshot of KQL query editor showing the results of a query to get 100 records from the table." lightbox="media/ingest-data-splunk/verify-alert.png":::

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
