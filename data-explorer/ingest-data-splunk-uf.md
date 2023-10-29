---
title: Ingest data from Splunk Universal Forwarder to Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Splunk Universal Forwarder.
ms.reviewer: tanmayapanda
ms.topic: how-to
ms.date: 10/26/2023
---

# Ingest data from Splunk Universal Forwarder to Azure Data Explorer

Splunk Universal Forwarder (Splunk UF) is a lightweight version of the [Splunk Enterprise](https://www.splunk.com/en_us/products/splunk-enterprise.html) software that allows you to ingest data from many sources simultaneously. It's designed for collecting and forwarding log data and machine data from various sources to a central Splunk Enterprise server or a Splunk Cloud deployment. Splunk UF serves as an agent that simplifies the process of data collection and forwarding, making it an essential component in a Splunk deployment. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.

In this article, learn how to use the Kusto Splunk Universal Forwarder Connector to send data to a table in your cluster. You initially create a table and data mapping, then direct Splunk to send data into the table, and then validate the results.

## Prerequisites

* [Splunk Universal Forwarder](https://docs.splunk.com/Documentation/Forwarder/9.1.1/Forwarder/InstallaWindowsuniversalforwarderfromaninstaller) downloaded on the same machine where the logs originate.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Create a Microsoft Entra application registration](provision-azure-ad-app.md), and [grant the application registration access to your Azure Data Explorer database](provision-azure-ad-app.md#grant-the-application-registration-access-to-an-azure-data-explorer-database).
* [Docker](https://www.docker.com/) installed on the system that runs the Kusto Splunk Universal Forwarder connector.

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
