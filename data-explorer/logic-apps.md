---
title: Microsoft Logic Apps and Azure Data Explorer
description: Learn how to use Logic Apps to run Kusto queries and commands automatically and schedule them.
ms.reviewer: docohe
ms.topic: how-to
ms.date: 0/02/2026
---

# Microsoft Logic Apps and Azure Data Explorer

<!-- //TODO - per Akshay this does work with Fabric but you need to direct user to find the right query uri and take out ADX specific language -->

By using the [Microsoft Logic Apps](/azure/logic-apps/logic-apps-what-are-logic-apps) connector, you can run queries and commands automatically as part of a scheduled or triggered task.

Logic Apps and :::no-loc text="Power Automate"::: are built on the same connector. Therefore, the [limitations](/azure/data-explorer/flow#limitations), [actions](/azure/data-explorer/flow#flow-actions), [authentication](/azure/data-explorer/flow#authentication), and [usage examples](/azure/data-explorer/flow-usage) that apply to :::no-loc text="Power Automate"::: also apply to Logic Apps, as mentioned on the [:::no-loc text="Power Automate"::: documentation page](/azure/data-explorer/flow).

> [!NOTE]
> To enable a logic app to access a [network protected cluster](/azure/data-explorer/security-network-private-endpoint), add the [outbound IP addresses](/connectors/common/outbound-ip-addresses#azure-logic-apps) associated with the region of your logic app to the firewall allowlist. For more information, see [Manage public access to your Azure Data Explorer cluster](/azure/data-explorer/security-network-restrict-public-access).

## Create a logic app with Azure Data Explorer

1. Open the [Microsoft Azure portal](https://ms.portal.azure.com/).
1. Search for "Logic apps" and select the **Logic apps** service.

    :::image type="content" source="media/logic-apps/logic-app-search.png" alt-text="Screenshot of the Azure portal, showing the search for Logic apps." lightbox="media/logic-apps/logic-app-search.png#lightbox":::

1. Select **+Create**.

    :::image type="content" source="media/logic-apps/create-new.png" alt-text="Screenshot of the Logic apps page, showing the add logic app button.":::

1. In the **Create Logic App** pane, enter your app details, and then select **Review + create**.
1. Verify that the details are correct, and then select **Create**.

    :::image type="content" source="media/logic-apps/create-logic-app.png" alt-text="Screenshot of the Create Logic App page, showing the Basics tab filled out.":::

1. When the logic app is created, select **Open resource**.
1. In the left navigation pane, select **Workflows**, and then select **+ Create**.

    :::image type="content" source="media/logic-apps/creeate-workflow.png" alt-text="Screenshot of the Workflows page, showing the add workflow button.":::

1. In the **New workflow** pane, enter the workflow details, and then select **Create**.

    :::image type="content" source="media/logic-apps/new-workflow.png" alt-text="Screenshot of the New workflow page, showing the details filled out and the create button.":::

1. In the list of workflows, select your workflow.
1. In the left menu, select **Designer**.
1. Add a recurrence trigger. Under **Choose an operation**, search for **Azure Data Explorer**. Select the **Azure** results tab.
1. Select **Azure Data Explorer**. Under **Actions**, choose the action you want to use. To learn more about each action, see [flow actions](/azure/data-explorer/flow#flow-actions).

    :::image type="content" source="media/logic-apps/logic-app-kusto-connector-inline.png" alt-text="Screenshot of the designer page, showing the Azure Data Explorer actions." lightbox="media/logic-apps/logic-app-kusto-connector.png":::

## Related content

* [:::no-loc text="Power Automate"::: documentation page](/azure/data-explorer/flow)
* [usage examples](/azure/data-explorer/flow-usage)
