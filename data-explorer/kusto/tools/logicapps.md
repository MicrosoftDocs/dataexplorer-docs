---
title: Use Logic Apps to run Kusto queries automatically
description: Learn how to use Logic Apps to run Kusto queries and commands automatically and schedule them
author: orspod
ms.author: orspodek
ms.reviewer: docohe
ms.service: data-explorer
ms.topic: how-to
ms.date: 04/14/2020
---

# Microsoft Logic App and Azure Data Explorer

The Azure Kusto Logic App connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using the [Microsoft Logic App](https://docs.microsoft.com/azure/logic-apps/logic-apps-what-are-logic-apps) connector.

Logic App and Flow are built on the same connector. Therefore, the [limitations](flow.md#limitations), [actions](flow.md#azure-kusto-flow-actions), [authentication](flow.md#authentication) and [usage examples](flow.md#azure-kusto-flow-actions) that apply to Flow, also apply to Logic Apps, as mentioned on the [Flow documentation page](flow.md).

## How to create a Logic App with Azure Data Explorer

1. Open the [Microsoft Azure portal](https://ms.portal.azure.com/). 
1. Search for `logic app` and select it.

    :::image type="content" source="./images/logicapps/logicapp-search.png" alt-text="Searching for 'logic app' in the Azure portal, Azure Data Explorer" lightbox="./images/logicapps/logicapp-search.png#lightbox":::

1. Select **+Add**.

    ![Add logic app](./Images/logicapps/logicapp-add.png)

1. Enter the required details of the form:
    * Subscription
    * Resource group
    * Logic App name
    * Region or Integration Service Environment
    * Location
    * Log analysis on or off
1. Select **Review + create**.

    ![Create logic app](./Images/logicapps/logicapp-create-new.png)

1. When the Logic App is created, select **Edit**.

    ![Edit logic app designer](./Images/logicapps/logicapp-editdesigner.png "logicapp-editdesigner")

1. Create a blank Logic App.

    ![Logic app blank template](./Images/logicapps/logicapp-blanktemplate.png "logicapp-blanktemplate")

1. Add recurrence action and select **Azure Kusto**.

    ![Logic app Kusto Flow connector](./Images/logicapps/logicapp-kustoconnector.png "logicapp-kustoconnector")

## Next steps

* To learn more about configuring a recurrence action, see the [Flow documentation page](flow.md)
* Take a look at some [usage examples](flow.md#azure-kusto-flow-actions) for ideas on configuring your logic app actions
