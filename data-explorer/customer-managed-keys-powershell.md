---
title: Configure customer-managed-keys using PowerShell
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer using PowerShell.
author: orspod
ms.author: orspodek
ms.reviewer: roshauli
ms.service: data-explorer
ms.topic: how-to
ms.date: 06/04/2020
---

# Configure customer-managed keys using PowerShell

> [!div class="op_single_selector"]
> * [Portal](customer-managed-keys-portal.md)
> * [C#](customer-managed-keys-csharp.md)
> * [Azure Resource Manager template](customer-managed-keys-resource-manager.md)
> * [CLI](customer-managed-keys-cli.md)
> * [PowerShell](customer-managed-keys-powershell.md)

[!INCLUDE [data-explorer-configure-customer-managed-keys](includes/data-explorer-configure-customer-managed-keys.md)]

## Enable encryption with customer-managed keys using PowerShell

This article shows you how to enable customer-managed keys encryption using PowerShell. By default, Azure Data Explorer encryption
uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate
with the cluster.

1. Run the following command to sign in to Azure:

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Set the subscription where your cluster is registered.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```

1. Run the following command to set the new key.

    ```azurepowershell-interactive
    Update-AzKustoCluster -ResourceGroupName "mytestrg" -Name "mytestcluster" -KeyVaultPropertyKeyName "<key-name>" -KeyVaultPropertyKeyVaultUri "<key-vault-uri>" -KeyVaultPropertyKeyVersion "<key-version>"
    ```

1. Run the following command and check the 'KeyVaultProperty...' properties to verify the cluster updated successfully.

    ```azurepowershell-interactive
    Get-AzKustoCluster -Name "mytestcluster" -ResourceGroupName "mytestrg" | Format-List
    ```
