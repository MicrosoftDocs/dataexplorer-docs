---
title: Configure customer-managed-keys using Azure CLI
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer using Azure CLI.
ms.reviewer: astauben
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/01/2020
---

# Configure customer-managed keys using Azure CLI

> [!div class="op_single_selector"]
> * [Portal](customer-managed-keys-portal.md)
> * [C#](customer-managed-keys-csharp.md)
> * [Azure Resource Manager template](customer-managed-keys-resource-manager.md)
> * [CLI](customer-managed-keys-cli.md)
> * [PowerShell](customer-managed-keys-powershell.md)

[!INCLUDE [data-explorer-configure-customer-managed-keys](includes/data-explorer-configure-customer-managed-keys.md)]

## Enable encryption with customer-managed keys using Azure CLI
This article shows you how to enable customer-managed keys encryption using Azure CLI client. By default, Azure Data Explorer encryption
uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate
with the cluster.

1. Run the following command to sign in to Azure:

    ```azurecli-interactive
    az login
    ```

1. Set the subscription where your cluster is registered. Replace *MyAzureSub* with the name of the Azure subscription that you want to use.

    ```azurecli-interactive
    az account set --subscription MyAzureSub
    ```

1. Run the following command to set the new key with the cluster's system assigned identity

    ```azurecli-interactive
    az kusto cluster update --cluster-name "mytestcluster" --resource-group "mytestrg" --key-vault-properties key-name="<key-name>" key-version="<key-version>" key-vault-uri="<key-vault-uri>"
    ```

    Alternatively, set the new key with a user assigned identity.

    ```azurecli-interactive
    az kusto cluster update --cluster-name "mytestcluster" --resource-group "mytestrg" --key-vault-properties key-name="<key-name>" key-version="<key-version>" key-vault-uri="<key-vault-uri>" key-user-identity="<user-identity-resource-id>"
    ```

1. Run the following command and check the 'keyVaultProperties' property to verify the cluster updated successfully.

    ```azurecli-interactive
    az kusto cluster show --cluster-name "mytestcluster" --resource-group "mytestrg"
    ```
