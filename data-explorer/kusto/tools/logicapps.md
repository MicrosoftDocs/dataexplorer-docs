---
title: Microsoft Logic App and Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes Microsoft Logic App and Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 04/15/2019

---
# Microsoft Logic App and Kusto

The Azure Kusto Logic App connector allows users to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Logic App](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-what-are-logic-apps).

The Logic App and Flow connectors are built on top of the same connector therefore the same [limitations](flow.md#limitations), [actions](flow.md#azure-kusto-flow-actions), [authentication](flow.md#authentication) and [usage examples](flow.md#usage-examples) apply for both as mentioned in the [Flow documentation page](flow.md).


## How to create a Logic App with Azure Kusto

Open the Azure portal and click create a new Logic App resource.
Add the desired name, subscription, resoure group and location and click create.

![Create logic app](./Images/KustoTools-LogicApp/logicapp-createlogicapp.png "logicapp-createlogicapp")

After the Logic App is created, click the edit button

![Edit logic app designer](./Images/KustoTools-LogicApp/logicapp-editdesigner.png "logicapp-editdesigner")

Create a blank Logic App

![Logic app blank template](./Images/KustoTools-LogicApp/logicapp-blanktemplate.png "logicapp-blanktemplate")

Add recurrence action and then choose 'Azure Kusto'

![Logic app Kusto Flow connector](./Images/KustoTools-LogicApp/logicapp-kustoconnector.png "logicapp-kustoconnector")