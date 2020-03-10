---
title: Kusto EV2 extension - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto EV2 extension in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/08/2020
---
# Kusto EV2 extension

The Kusto EV2 extension allows users to run Kusto commands as part of an [EV2](https://ev2docs.azure.net/overview/intro.html) template for JEDI buildout purposes.

## How to use it

1. Install [Ev2 Powershell SDK](https://msazure.visualstudio.com/Azure-Express/_git/Quickstart?path=%2FEv2_PowerShell&version=GBmaster)

1. Download the Example rollout from the [Kusto source code](https://msazure.visualstudio.com/One/_git/Azure-Kusto-Service?path=%2FSrc%2FTools%2FKusto.EV2.Extension%2FExamples%2FServiceGroupRoot)

1. Change relevant parameters in the ServiceModel.json and Rollout.json and kusto.extension.rolloutparameters
    1. In Kusto.Extension.RolloutParameters.json make sure to replace extensions.ConnectionProperties with an application id that has permissions on your cluster, path to a secret id used to authenticate to the application id and its tenant id. 
1. Open the AzureServiceDeployClient shortcut
1. Copy the examples to the same folder
1. Start new rollout with: New-AzureServiceRollout -ServiceGroupRoot . -RolloutSpec RolloutSpec.json -RolloutInfra Prod -WaitToComplete
1. Follow the status in Ev2 Portal: https://ev2portal.azure.net/ (the link will appear in the Powershell result)