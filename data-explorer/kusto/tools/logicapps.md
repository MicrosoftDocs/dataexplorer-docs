---
title: Use Logic Apps to run Kusto queries automatically in Azure Data Explorer
description: Learn how to use Logic Apps to run Kusto queries and commands automatically and schedule them.
ms.reviewer: docohe
ms.topic: how-to
ms.date: 05/04/2022
---

# Microsoft Logic App and Azure Data Explorer

The Azure Kusto Logic App connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using the [Microsoft Logic App](/azure/logic-apps/logic-apps-what-are-logic-apps) connector.

Logic App and :::no-loc text="Power Automate"::: are built on the same connector. Therefore, the [limitations](../../flow.md#limitations), [actions](../../flow.md#flow-actions), [authentication](../../flow.md#authentication) and [usage examples](../../flow-usage.md) that apply to :::no-loc text="Power Automate":::, also apply to Logic Apps, as mentioned on the [:::no-loc text="Power Automate"::: documentation page](../../flow.md).

## How to create a Logic App with Azure Data Explorer

1. Open the [Microsoft Azure portal](https://ms.portal.azure.com/).
1. Search for `logic app` and select it.

    :::image type="content" source="images/logicapps/logicapp-search.png" alt-text="Screenshot of the Azure portal, showing the search for Logic app." lightbox="images/logicapps/logicapp-search.png#lightbox":::

1. Select **+Add**.

    :::image type="content" source="images/logicapps/logicapp-add.png" alt-text="Screenshot of the Azure portal, showing the add logic app action.":::

1. Enter the required details of the form:
    * Subscription
    * Resource group
    * Logic App name
    * Region or Integration Service Environment
    * Location
    * Log analysis on or off
1. Select **Review + create**.

    :::image type="content" source="images/logicapps/logicapp-create-new.png" alt-text="Screenshot of the Azure portal, showing the create logic app.":::

1. When the Logic App is created, select **Edit**.

    :::image type="content" source="images/logicapps/logicapp-editdesigner.png" alt-text="Screenshot of the Azure portal, showing the edit logic app designer.":::

1. Create a blank Logic App.

    :::image type="content" source="images/logicapps/logicapp-blanktemplate.png" alt-text="Screenshot of the Azure portal, showing the logic app blank template.":::

1. Add recurrence action and select **Azure Kusto**.

    :::image type="content" source="images/logicapps/logicapp-kustoconnector-inline.png" alt-text="Screenshot of Logic app, showing the Azure Data Explorer connector." lightbox="images/logicapps/logicapp-kustoconnector.png":::

## Next steps

* To learn more about configuring a recurrence action, see the [:::no-loc text="Power Automate"::: documentation page](../../flow.md)
* Take a look at some [usage examples](../../flow-usage.md) for ideas on configuring your logic app actions
