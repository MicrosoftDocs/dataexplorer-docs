---
title: Use Kusto cmdlets in Azure PowerShell
description: This article describes how to use Kusto cmdlets in Azure PowerShell in Azure Data Explorer.
ms.reviewer: orhasban
ms.topic: reference
ms.date: 03/10/2024
---
# Use Kusto cmdlets in Azure PowerShell

PowerShell scripts can use Azure PowerShell [Az.Kusto cmdlets](/powershell/module/az.kusto) to run management commands.

The steps in this article aren't required if you're running commands in [Azure Cloud Shell](https://shell.azure.com). If you're running the CLI locally, follow these steps to set up your environment.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Follow the Azure PowerShell prerequisites relevant to your environment. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

## Install az.Kusto cmdlets

To install the Az.Kusto cmdlets, run the following command:

```powershell
Install-Module -Name Az.Kusto -Repository PSGallery -Force
```

## Sign in to Azure

To start managing your cluster with the Az.Kusto cmdlets, launch a PowerShell session and run `Connect-AzAccount` to sign in to Azure:

```powershell
Connect-AzAccount
```

Use your Azure account login credentials to log into the browser window that opens. For more information about signing in, see [Sign in with Azure PowerShell](/powershell/azure/install-azps-windows#sign-in).

## Set the subscription context

Optionally, set the subscription context by running the following command replacing `<SubscriptionId>` with your cluster's subscription ID. You can get your cluster's subscription ID from the Azure portal form your cluster's **Overview** page.

```powershell
Set-AzContext -SubscriptionId "<SubscriptionId>"
```

## Run Kusto cmdlets

To view your cluster details, run the following command replacing `<ClusterResourceID>` with your cluster's resource ID. You can get your cluster's resource ID from the Azure portal form your cluster's **Properties** page.

```powershell
$resource_id = "<ClusterResourceID>"
$mycluster = Get-AzKustoCluster -InputObject $resource_id
$mycluster
```

For a list of all available cmdlets, see [Az.Kusto cmdlets](/powershell/module/az.kusto).

## Related content

* [Use Kusto .NET client libraries from PowerShell](powershell.md)
