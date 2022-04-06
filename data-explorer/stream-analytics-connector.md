---
title: Use the Azure Data Explorer connector for Apache Spark to move data between Azure Data Explorer and Azure Stream Analytics.
description: This topic shows you how to move data between Azure Data Explorer and Azure Stream Analytics.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 04/06/2022
---

# Azure Data Explorer Connector for Azure Stream Analytics

[Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) is a real-time analytics and complex event-processing engine that is designed to analyze and process high volumes of fast streaming data from multiple sources simultaneously.

An Azure Stream Analytics job consists of an input, query, and an output. There are several output types to which you can send transformed data. To create, edit, and test Stream Analytics job outputs, you can use the [Azure portal](/azure/stream-analytics/stream-analytics-quick-create-portal), [Azure PowerShell](/azure/stream-analytics/stream-analytics-quick-create-powershell), [.NET API](/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations), [REST API](/rest/api/streamanalytics/), and [Visual Studio](/azure/stream-analytics/stream-analytics-quick-create-vs). This article covers Azure Data Explorer output connection.

## Data format

* No user defined data formats are supported. Internally output connection leverages csv data format to ingest data into the table.
* All [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-add-inputs) inputs are supported.

## Events routing

When setting up an A[zure Data Explorer output connection](/azure/stream-analytics/azure-database-explorer-output) to Azure Stream Analytics job, you specify target Azure Data Explorer cluster, database, and table name.

> [!NOTE]
>For Ingestion to successfully work, you need to make sure that -

* Number of columns in Azure Stream Analytics job query should match with Azure Data Explorer table and should be in the same order.
* Name of the columns & data type should match between Azure Stream Analytics SQL query and Azure Data Explorer table.

## Create an Azure Data Explorer output connection

If you don't already have one, [Create an Azure Stream Analytics Job](/azure/stream-analytics/stream-analytics-quick-create-portal). The Azure Stream Analytics job transfers events from input source to Azure Data Explorer cluster using the SQL query defined in the job to transform the data. You then create a target table in Azure Data Explorer database in this data is going to be ingested. You need to then create the Azure Data Explorer output connection to Azure Stream Analytics job which can be managed through the Azure portal or with the Azure Resource Manager template.

> [!NOTE]
> Azure Data Explorer output connection only supports “Managed Identity” (incorrect link, added for reference…need to update a new one) for authentication. As part of output creation, database monitor and database ingestor permission will be granted to Azure Stream Analytics job MSI.

# Create Azure Data Explorer output connection using Azure portal

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, IoT Hubs, blobs written to blob containers and Azure Stream Analytics job.

This article shows you how to create Azure Data Explorer output connection to Azure Stream Analytics job, a real time analytics and event processing engine service.

For general information about creating Azure Data Explorer output connection to Azure Stream Analytics job, see Connect to Azure Stream Analytics job <main link>.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](/azure/data-explorer/create-cluster-database-portal) and table
* Create an [Azure Stream Analytics job](/azure/stream-analytics/stream-analytics-quick-create-portal)

## Create Azure Data Explorer output connection to Azure Stream Analytics job

Now you create Azure Data Explorer output connection to the Azure Stream Analytics job. When this connection is complete, and job is running, data that flows into the Azure Stream Analytics job will be ingested into the target table you created.
