---
title: Azure Data Explorer Connector for Azure Stream Analytics
description: This topic shows you how to move data between Azure Data Explorer and Azure Stream Analytics.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 04/06/2022
---

# Azure Data Explorer connector for Azure Stream Analytics

[Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) is a real-time analytics and complex event-processing engine that is designed to analyze and process high volumes of fast streaming data from multiple sources simultaneously.

An Azure Stream Analytics job consists of an input, query, and an output. There are several output types to which you can send transformed data. To create, edit, and test Stream Analytics job outputs, you can use the [Azure portal](/azure/stream-analytics/stream-analytics-quick-create-portal), [Azure PowerShell](/azure/stream-analytics/stream-analytics-quick-create-powershell), [.NET API](/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations), [REST API](/rest/api/streamanalytics/), and [Visual Studio](/azure/stream-analytics/stream-analytics-quick-create-vs). This article shows you how to create Azure Data Explorer output connection to Azure Stream Analytics job.

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, IoT Hubs, blobs written to blob containers and Azure Stream Analytics job.

For general information about creating Azure Data Explorer output connection to Azure Stream Analytics job, see Connect to Azure Stream Analytics job *main link*.

## Data format

* No user defined data formats are supported. Internally output connection leverages csv data format to ingest data into the table.
* All [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-add-inputs) inputs are supported.

## Events routing

When setting up an [Azure Data Explorer output connection](/azure/stream-analytics/azure-database-explorer-output) to Azure Stream Analytics job, you specify target Azure Data Explorer cluster, database, and table name.

> [!NOTE]
> For Ingestion to successfully work, you need to make sure that -

* Number of columns in Azure Stream Analytics job query should match with Azure Data Explorer table and should be in the same order.
* Name of the columns & data type should match between Azure Stream Analytics SQL query and Azure Data Explorer table.

## Create an Azure Data Explorer output connection

If you don't already have one, [Create an Azure Stream Analytics Job](/azure/stream-analytics/stream-analytics-quick-create-portal). The Azure Stream Analytics job transfers events from input source to Azure Data Explorer cluster using the SQL query defined in the job to transform the data. You then create a target table in Azure Data Explorer database in this data is going to be ingested. You need to then create the Azure Data Explorer output connection to Azure Stream Analytics job which can be managed through the Azure portal or with the Azure Resource Manager template.

> [!NOTE]
> Azure Data Explorer output connection only supports [Managed Identity](/azure/active-directory/managed-identities-azure-resources/overview) for authentication. As part of output creation, database monitor and database ingestor permission will be granted to Azure Stream Analytics job MSI.

There are various methods to create Azure Data Explorer output connection to Azure Stream Analytics job. See the following tabs to create an Azure Data Explorer output connection by using Azure portal or by using Azure Resource Manager template.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md) and table
* Create an [Azure Stream Analytics job](/azure/stream-analytics/stream-analytics-quick-create-portal)

## [Azure portal](#tab/portal)

Here you create Azure Data Explorer output connection to the Azure Stream Analytics job. When this connection is complete, and job is running, data that flows into the Azure Stream Analytics job will be ingested into the target table you created.

1. Under the Azure Stream Analytics job, select **Outputs** and then select **Azure Data Explorer**.

    :::image type="content" source="media/stream-analytics-connector/stream-analytics-job-output.png" alt-text="Screenshot of the Outputs page, showing how to create an Azure Data Explorer connection.":::

1. Enter the required information into the outdata connection.

    :::image type="content" source="media/stream-analytics-connector/stream-analytics-new-output.png" alt-text="Screenshot of New output dialog box, showing required property information.":::

The following table lists the property names and their description for creating an Azure Data Explorer output:

| Property name | Description |
|--|--|
| Output alias | A friendly name used in queries to direct the query output to this database. |
| Subscription | Select the Azure subscription that you want to use for your cluster. |
| Cluster | Choose a unique name that identifies your cluster. The domain name [region].kusto.windows.net is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters. |
| Database | The name of the database where you are sending your output. The database name must be unique within the cluster. |
| Authentication | A managed identity from Azure Active Directory allows your cluster to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Managed identity configuration is currently supported only to enable customer-managed keys for your cluster. |
| Table | The table name where the output is written. The schema of this table should exactly match the number of fields and their types that your job output generates. |

### [Azure Resource Manager template](#tab/armtemplate)

The following example shows an Azure Resource Manager template for adding an Azure Data Explorer output data connection. You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal) by using the form.

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
> When creating an Azure Data Explorer output connecting using ARM template, Azure Streaming Analytics job “Managed Identity” permission to Azure Data Explorer database needs to be granted manually.

---

## Sample data

You can download the phone call event generator app [TelcoGenerator.zip](https://download.microsoft.com/download/8/B/D/8BD50991-8D54-4F59-AB83-3354B69C8A7E/TelcoGenerator.zip) from the Microsoft Download Center or get the source code from [GitHub](https://aka.ms/azure-stream-analytics-telcogenerator). With the app generating data, you can now see the data flow from the Azure Stream Analytics to the table in your Azure Data Explorer database.

> [!NOTE]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes, 1000 items or 1 GB of data by default, so you may experience a latency. See [batching policy](kusto/management/batchingpolicy.md) for aggregation options.

## Clean up resources

If you don't plan to use your Azure Stream Analytics job and Azure Data Explorer cluster again, clean up your resource group to avoid incurring costs. When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created.
    If the left menu is collapsed, select :::image type="icon" source="media/stream-analytics-connector/rt arrow icon.png" border="false"::: to expand it.

    :::image type="content" source="media/stream-analytics-connector/stream-analytics-resource-group-menu.png" alt-text="Screenshot of Resource group menu, showing how to delete resource group.":::

1. Under **test-resource-group**, select **Delete resource group**.
1. In the new window, type the name of the resource group to delete it, and then select **Delete**.

### Clean up resources using the Azure portal

Delete the resources in the Azure portal by following the steps in [clean up resources](create-cluster-database-portal.md).

### Clean up resources using PowerShell

If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

Azure PowerShellCopy

Try It

```azurepowershell

$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."

```

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
