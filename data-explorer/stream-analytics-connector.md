---
title: Azure Data Explorer connector for Azure Stream Analytics
description: This article shows you how to move data between Azure Data Explorer and Azure Stream Analytics.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 06/09/2022
---

# Azure Data Explorer connector for Azure Stream Analytics

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion from Event Hubs, IoT Hubs, blobs written to blob containers, and Azure Stream Analytics jobs.

[Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) is a real-time analytics and complex event-processing engine that is designed to analyze and process high volumes of fast streaming data from multiple sources simultaneously. An Azure Stream Analytics *job* consists of an input source, a transformation query, and an output connection. There are several output types to which you can send transformed data. You can create, edit, and test Stream Analytics jobs using the [Azure portal](/azure/stream-analytics/stream-analytics-quick-create-portal), Azure Resource Manager (ARM) templates, [Azure PowerShell](/azure/stream-analytics/stream-analytics-quick-create-powershell), [.NET API](/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations), [REST API](/rest/api/streamanalytics/), and [Visual Studio](/azure/stream-analytics/stream-analytics-quick-create-vs).

In this article, you'll learn how to use a Streaming Analytics job to collect data from an event hub and send it to your Azure Data Explorer cluster using the Azure portal or an ARM template.

## Prerequisites

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
- Create a [cluster and database](create-cluster-database-portal.md) and a [table](one-click-table.md).
- Create an event hub using the following sections of the from the Azure Stream Analytics tutorial:
    - [Create an event hub](/azure/stream-analytics/stream-analytics-real-time-fraud-detection#create-an-event-hub)
    - [Grant access to the event hub and get a connection string](/azure/stream-analytics/stream-analytics-real-time-fraud-detection#grant-access-to-the-event-hub-and-get-a-connection-string)

    > [!TIP]
    > For testing, we recommend that you download the phone call event generator app [TelcoGenerator.zip](https://download.microsoft.com/download/8/B/D/8BD50991-8D54-4F59-AB83-3354B69C8A7E/) from the Microsoft Download Center or get the source code from [GitHub](https://github.com/Azure/azure-stream-analytics/tree/master/Samples/TelcoGenerator). When setting up the Azure Stream Analytics job, you'll configure it to pull data from the event hub and pass it to the Azure Data Explorer output connector.
    >
    > :::image type="content" source="media/stream-analytics-connector/sample-data-process.png" alt-text="Flow chart showing the ingestion process for sample data." border="false":::

## Create an Azure Data Explorer output connection

Use the following steps to create an Azure Data Explorer output connection for an Stream Analytics job using the Azure portal or using an ARM template. The connection is used by the Stream Analytics job to send data to a specified Azure Data Explorer table. Once created and job is running, data that flows into the job is ingested into the specified target table.

> [!NOTE]
> The Azure Data Explorer output connector only supports [Managed Identity](/azure/active-directory/managed-identities-azure-resources/overview) authentication. As part of creating the connector, database monitor and database ingestor permissions are granted to the Azure Stream Analytics job managed identity.

### Data format

- No user defined data formats are supported. Internally the output connector uses a CSV data format to ingest data into the table.
- All [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-add-inputs) inputs are supported.

## [Azure portal](#tab/portal)

Before you begin, make sure your have an existing Stream Analytics job or [create a new one](/azure/stream-analytics/stream-analytics-quick-create-portal), and then use the following steps to create your Azure Data Explorer connection.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. From the Azure portal, open **All resources**, and select your Stream Analytics job.

1. Under **Job topology**, select the **Outputs**.

    :::image type="content" source="media/stream-analytics-connector/stream-analytics-job-output.png" alt-text="Screenshot of the Outputs page, showing how to create an Azure Data Explorer connection.":::

1. Select **Add** > **Azure Data Explorer**.

1. Fill the output form using the following information and then select **Save**.

    > [!NOTE]
    > When setting up the [Azure Data Explorer output connector](/azure/stream-analytics/azure-database-explorer-output), you specify target the cluster, database, and table name. For ingestion to succeed, make sure that the number, data types, and order of the columns in the Azure Stream Analytics query match the table schema in the Azure Data Explorer table.

    | Property name | Description |
    |--|--|
    | Output alias | A friendly name used in queries to direct the query output to this database. |
    | Subscription | Select the Azure subscription where your cluster resides. |
    | Cluster | The unique name that identifies your cluster. The domain name [region].kusto.windows.net is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters. |
    | Database | The name of the database where you're sending your output. The database name must be unique within the cluster. |
    | Authentication | An [Azure Active Directory (Azure AD) managed identity](/azure/active-directory/managed-identities-azure-resources/overview) that allows your cluster to easily access other Azure AD protected resources. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Managed identity configuration enables you to use customer-managed keys for your cluster. |
    | Table | The name of the table where you're sending your output. The number, data types, and order of the columns in the output must match the schema of this table schema. |

    :::image type="content" source="media/stream-analytics-connector/stream-analytics-new-output.png" alt-text="Screenshot of New output dialog box, showing required information.":::

> [!NOTE]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes, 1000 items or 1 GB of data by default, so you may experience a latency. See [batching policy](kusto/management/batchingpolicy.md) for aggregation options.

### [Azure Resource Manager template](#tab/armtemplate)

The following example shows an Azure Resource Manager template for adding an Azure Data Explorer output connector. You can [edit and deploy the template](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal) in the Azure portal to create your connector.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "streamingJobName": {
            "type": "string",
            "defaultValue": "streamingjob"
        },
        "eventHubNamespace": {
            "type": "string"
        },
        "eventHubKey": {
            "type": "securestring"
        },
        "eventHubName": {
            "type": "string"
        },
        "eventHubConsumerGroupName": {
            "type": "string"
        },
        "streamingUnits": {
            "type": "int",
            "defaultValue": 3
        },
        "ADXClusterUri": {
            "type": "string"
        },
        "ADXDatabaseName": {
            "type": "string"
        },
        "ADXTableName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "apiVersion": "2017-04-01-preview",
            "name": "[parameters('streamingJobName')]",
            "location": "[resourceGroup().location]",
            "type": "Microsoft.StreamAnalytics/StreamingJobs",
            "identity": {
                "type": "systemAssigned"
            },
            "properties": {
                "sku": {
                    "name": "standard"
                },
                "eventsOutOfOrderPolicy": "drop",
                "eventsOutOfOrderMaxDelayInSeconds": 10,
                "compatibilityLevel": "1.2",
                "outputStartMode": "JobStartTime",
                "inputs": [
                    {
                        "name": "inputEventHub",
                        "properties": {
                            "type": "stream",
                            "serialization": {
                                "type": "JSON",
                                "properties": {
                                    "encoding": "UTF8"
                                }
                            },
                            "datasource": {
                                "type": "Microsoft.ServiceBus/EventHub",
                                "properties": {
                                    "serviceBusNamespace": "[parameters('eventHubNamespace')]",
                                    "sharedAccessPolicyName": "RootManageSharedAccessKey",
                                    "sharedAccessPolicyKey": "[parameters('eventHubKey')]",
                                    "eventHubName": "[parameters('eventHubName')]",
                                    "consumerGroupName": "[parameters('eventHubConsumerGroupName')]"
                                }
                            }
                        }
                    }
                ],
                "transformation": {
                    "name": "ProcessSampleData",
                    "properties": {
                        "streamingUnits": "[int(parameters('streamingUnits'))]",
                        "query": "select * from inputEventHub"
                    }
                },
                "outputs": [
                    {
                        "name": "output",
                        "properties": {
                            "serialization": {
                                "type": "CSV",
                                "properties": {
                                    "encoding": "UTF8"
                                }
                            },
                            "datasource": {
                                "type": "Microsoft.Kusto/clusters/databases",
                                "properties": {
                                    "cluster": "[parameters('ADXClusterUri')]",
                                    "table": "[parameters('ADXTableName')]",
                                    "database": "[parameters('ADXDatabaseName')]",
                                    "authenticationMode": "Msi"
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]
}
```

> [!NOTE]
> When creating an Azure Data Explorer output connection using an ARM template, the Streaming Analytics job managed identity permissions to the Azure Data Explorer database must be granted manually.

---

## Clean up resources

If you don't plan to use your Stream Analytics again, clean up your resource group to avoid incurring costs.

### Clean up resources using the Azure portal

1. In the Azure portal, select **Resource groups** on the far left.
    If the left menu is collapsed, select :::image type="icon" source="media/stream-analytics-connector/rt arrow icon.png" border="false"::: to expand it.

1. Check the box next to your resource group, select the resource group name, and then select **Delete resource group**.
1. In the new window, type the name of the resource group to delete it, and then select **Delete**.

### Clean up resources using PowerShell

In the Azure portal, select the Azure Cloud Shell, and then run the following commands:

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

- [Query data in Azure Data Explorer](web-query-data.md)
- [Run Azure Functions from Azure Stream Analytics jobs](/azure/stream-analytics/stream-analytics-with-azure-functions)
