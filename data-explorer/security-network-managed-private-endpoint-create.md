---
title: Create a managed private endpoint for Azure Data Explorer
description: In this article, you'll learn how to create a managed private endpoint for Azure Data Explorer.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 04/05/2022
---

# Create a managed private endpoint for Azure Data Explorer

Managed private endpoints are required to connect to Azure resources that are highly protected. In this article, you'll learn how to create a managed private endpoint and connect it to your data source.

## Prerequisites

* [Create an Azure Data Explorer Cluster](create-cluster-database-portal.md) that isn't injected in a virtual network
* Create an [event hub](/azure/event-hubs/event-hubs-about) or a [Azure Storage](/azure/storage/blobs/storage-blobs-overview) blob

## Create a managed private endpoint using the Azure portal

You can create a managed private endpoint using the portal for your cluster to use when accessing your storage.

1. In the Azure portal, navigate to your cluster and then select **Networking**.

1. Select **Managed private endpoints**, and then select **Add**.

    :::image type="content" source="media/security-network-private-endpoint/mpe-create-1.png" alt-text="Screenshot of the networking page, showing the first step in the creation of a managed private endpoint.":::

1. On the **New managed private endpoint** pane, fill out the resource details with the following information, and then select **Next**.

    :::image type="content" source="media/security-network-private-endpoint/mpe-create-2.png" alt-text="Screenshot of the networking page, showing the second step in the creation of a managed private endpoint.":::

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Name | mpeToStorage | The name of the managed private endpoint |
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster |
    | Resource type | *Microsoft.Storage/storageAccounts* | Select the relevant resources type you want for your data source. |
    | Resource name | *share* | Choose the cluster that should be used as the destination for the new Azure Private Endpoint |
    | Target sub-resource | *blob* | Select the relevant target for your data source. |
    | | | |

1. select **Create** to create the managed private endpoint resource.

## Create a managed private endpoint using the REST API

Creating a managed private endpoint requires a single API call to the *Kusto* resource provider. You can establish a managed private endpoint to the following resource types:

* Microsoft.Storage/storageAccounts (sub-resource may be "blob" or "dfs")
* Microsoft.EventHub/namespaces (sub-resource "namespace")
* Microsoft.Devices/IoTHubs (sub-resource "iotHub")
* Microsoft.KeyVault/vaults (sub-resource "vault")
* Microsoft.Sql/servers (sub-resource "sqlServer")
* Microsoft.Kusto/clusters (sub-resource "cluster")
* Microsoft.DigitalTwins/digitalTwinsInstance (sub-resource "digitaltwinsinstance")

In the following this example, you'll use the [ARMclient](https://chocolatey.org/packages/ARMClient) in PowerShell to create a managed private endpoint using the REST API.

### Prerequisites for using the REST API

1. Install [choco](https://chocolatey.org/install)
1. Install *ARMClient*

   ```powerShell
   choco install armclient
   ```

1. Log in with ARMClient

   ```powerShell
   armclient login
   ```

### Create a managed private endpoint to Azure Event Hubs

Use the following REST API call to enable the managed private endpoint to an Event Hubs service:

1. Run the following command to create a managed private endpoint to an Event Hubs service:

    ```powershell
    # Replace the <...> placeholders with the correct values
    armclient PUT /subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/clusters/<clusterName>/managedPrivateEndpoints/<newMpeName>?api-version=2022-02-01 @"
    {
        'properties': {
            'privateLinkResourceId':'/subscriptions/<subscriptionIdEventHub>/resourceGroups/<resourceGroupNameEventHub>/providers/Microsoft.EventHub/namespaces/<EventHubNamespace>',
            'groupId':'namespace',
            'requestMessage':'Please Approve.'
        }
    }
    "@
    ```

1. Check the response.

    ```json
    {
      "id": "/subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/Clusters/<clusterName>/ManagedPrivateEndpoints/<newMpeName>",
      "name": "<clusterName>/<newMpeName>",
      "type": "Microsoft.Kusto/Clusters/ManagedPrivateEndpoints",
      "location": "DummyLocation",
      "properties": {
        "privateLinkResourceId": "/subscriptions/<subscriptionIdEventHub>/resourceGroups/<resourceGroupNameEventHub>/providers/Microsoft.EventHub/namespaces/<EventHubNamespace>",
        "groupId": "namespace",
        "requestMessage": "Please Approve.",
        "provisioningState": "Creating"
      }
    }
    ```

### Create a managed private endpoint to an Azure Storage account

Use the following REST API call to enable the managed private endpoint to an Azure Storage blob:

1. Run the following command to create a managed private endpoint to Event Hubs:

    ```powershell
    #replace the <...> placeholders with the correct values
    armclient PUT /subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/clusters/<clusterName>/managedPrivateEndpoints/<newMpeName>?api-version=2022-02-01 @"
    {
        'properties': {
            'privateLinkResourceId':'/subscriptions/<subscriptionIdStorage>/resourceGroups/<resourceGroupNameStorage>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>',
            'groupId':'blob',
            'requestMessage':'Please Approve.'
        }
    }
    "@
    ```

1. Check the response.

    ```json
    {
      "id": "/subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/Clusters/<clusterName>/ManagedPrivateEndpoints/<newMpeName>",
      "name": "<clusterName>/<newMpeName>",
      "type": "Microsoft.Kusto/Clusters/ManagedPrivateEndpoints",
      "location": "DummyLocation",
      "properties": {
        "privateLinkResourceId": "/subscriptions/<subscriptionIdStorage>/resourceGroups/<resourceGroupNameStorage>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>",
        "groupId": "blob",
        "requestMessage": "Please Approve.",
        "provisioningState": "Creating"
      }
    }
    ```

### How to check progress

To check the progress of the managed private endpoint migration, use the following command:

1. Run the following command:

    ```powershell
    #replace the <...> placeholders with the correct values
    armclient GET /subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/clusters/<clusterName>/managedPrivateEndpoints/<newMpeName>?api-version=2022-02-01
    ```

1. Check the response.

    ```json
    {
      "id": "/subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/Clusters/<clusterName>/ManagedPrivateEndpoints/<newMpeName>",
      "name": "<clusterName>/<newMpeName>",
      "type": "Microsoft.Kusto/Clusters/ManagedPrivateEndpoints",
      "location": "DummyLocation",
      "properties": {
        "privateLinkResourceId": "/subscriptions/02de0e00-8c52-405c-9088-1342de78293d/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.<service>/<...>/<name>",
        "groupId": "<groupId>",
        "requestMessage": "Please Approve.",
        "provisioningState": "Succeeded"
      },
      "systemData": {
        "createdBy": "<UserName>",
        "createdByType": "User",
        "createdAt": "2022-02-05T08:29:54.2912851Z",
        "lastModifiedBy": "chrisqpublic@contoso.com",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2022-02-05T08:29:54.2912851Z"
      }
    }
    ```

## Approve the managed private endpoint

Whichever method you used to create the managed private endpoint using, you must approve its creation on target resource. The following example shows the approval of a managed private endpoint to an Event Hubs service.

1. In the Azure portal, navigate to your Event Hubs service and then select **Networking**.

1. Select **Private endpoint connections**, select the managed private endpoint you created, and then select **Approve**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-mpe-approval-inline.png" alt-text="Screenshot of the networking page, showing the approval of the managed private endpoint to the Event Hubs service." lightbox="media/security-network-private-endpoint/pe-create-mpe-approval.png":::

1. In the **Connection state** column, verify that the managed private endpoint is approved.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-mpe-approved-inline.png" alt-text="Screenshot of the networking page, showing the approved managed private endpoint to the Event Hubs service." lightbox="media/security-network-private-endpoint/pe-create-mpe-approved.png":::

Your cluster can now connect to the resource using the managed private endpoint connection.

## Limitations

In order to connect to Azure Data Lake Gen2 you must create a managed private endpoint to Microsoft.Storage/storageAccounts with the sub-resource "dfs" and "blob". Otherwise Azure Data Explorer will not be able to establish a connection to a "dfs" (i.e. "https://myAdlsGen2.dfs.core.windows.net") endpoint.

## Next steps

* [Troubleshooting private endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
