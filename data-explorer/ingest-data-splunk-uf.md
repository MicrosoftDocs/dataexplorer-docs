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
* [Create a Microsoft Entra application registration](provision-azure-ad-app.md) with [access to your Azure Data Explorer database](provision-azure-ad-app.md#grant-the-application-registration-access-to-an-azure-data-explorer-database).
* [Docker](https://www.docker.com/) installed on the system that runs the Kusto Splunk Universal Forwarder connector.

## Configure Splunk Universal Forwarder

When you download Splunk Universal Forwarder, a wizard will open to configure the forwarder.

1. Set the **Recieving Indexer** to point to the system hosting the Kusto Splunk Universal Forwarder connector. Enter `127.0.0.1` for the **Hostname or IP** and `9997` for the port.

    For more information, see [Enable a receiver for Splunk Enterprise](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/Enableareceiver).

    > [!NOTE]
    > The **Destination Indexer** can be left blank.

1. Go to the folder where Splunk Universal Forwarder is installed and then to the */etc/system/local* folder. Create or modify the *Inputs.conf* file to allow the forwarder to read logs:

    ```txt
    [default]
    index = default
    disabled = false

    [monitor://C:\Program Files\Splunk\var\log\splunk\modinput_eventgen.log*]
    sourcetype = modinput_eventgen
    ```

    For more information, see [Monitor files and directories with inputs.conf](https://docs.splunk.com/Documentation/Splunk/9.1.1/Data/Monitorfilesanddirectorieswithinputs.conf).

1. Go to the folder where Splunk Universal Forwarder is installed and then to the */etc/system/local* folder. Create or modify the *Inputs.conf* file to determine the destination logcation for the logs, which is the hostname and port of the system hosting Kusto Splunk Universal Forwarder connector:

    ```txt
    [tcpout]
    defaultGroup = default-autolb-group
    sendCookedData = false

    [tcpout:default-autolb-group]
    server = 127.0.0.1:9997

    [tcpout-server://127.0.0.1:9997]
    ```

1. Restart Splunk Universal Forwarder.


## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
